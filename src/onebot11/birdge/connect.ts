import path from 'node:path';
import fs from 'node:fs';
import { Context } from 'cordis';
import { BaseAction } from '../action/BaseAction';
import { OB11BaseEvent } from '../event/OB11BaseEvent';
import { OB11Message } from '../types';
import { JniConfig } from '@/common/types';
import { DATA_DIR } from '@/common/globalVars';
import { JniBridge, DEFAULT_BRIDGE_JAR, DEFAULT_JAVA_PLUGIN_DIR } from './bridge';
import type { InitParams, InitResult, JavaPluginInfo } from './protocol';

/**
 * Java 插件桥接
 *
 * 直接工作在 OneBot 11 协议层内（不是独立连接类型）：消息/事件由 Onebot11Adapter
 * 的 dispatch 流程直接转发进来；Java 插件通过 Action 通知反向调用 OneBot API
 * （走 adapter 的 actionMap），并通过 event 通知向其他协议连接推送事件。
 */
class OB11Jni {
  private bridge: JniBridge | null = null;
  private javaPlugins: JavaPluginInfo[] = [];

  constructor(protected ctx: Context, public config: OB11Jni.Config) {
  }

  /** Java 桥接进程是否在运行 */
  get running(): boolean {
    return this.bridge?.running ?? false;
  }

  /** 已发现的 Java 插件列表 */
  get plugins(): JavaPluginInfo[] {
    return this.javaPlugins;
  }

  public async start() {
    if (this.bridge?.running || !this.config.enable) {
      return;
    }

    // 桥接 JAR：相对路径基于运行目录（打包后为 dist/，dev 为 birdge/ 源码目录）
    const bridgeJarPath = path.isAbsolute(this.config.bridgeJar)
      ? this.config.bridgeJar
      : path.join(import.meta.dirname, this.config.bridgeJar);

    // Java 插件目录：相对路径基于 data 目录
    const javaPluginPath = path.isAbsolute(this.config.javaPluginDir)
      ? this.config.javaPluginDir
      : path.join(DATA_DIR, this.config.javaPluginDir);
    if (!fs.existsSync(javaPluginPath)) {
      fs.mkdirSync(javaPluginPath, { recursive: true });
    }

    const b = new JniBridge({
      javaPath: this.config.javaPath,
      jvmArgs: this.config.jvmArgs,
      bridgeJar: bridgeJarPath,
      classpath: this.config.classpath,
      callTimeout: this.config.callTimeout,
      logger: this.ctx.logger,
    });

    // 关键：在 init 之前注册事件监听器
    // Java 侧在 handleInit 期间会自动加载插件，插件 onInit 可能立即发起 Action 调用
    // 如果监听器在 init 之后才注册，这些 Action 通知会被丢弃，导致超时
    b.on('action', (params) => this.handleJavaAction(b, params));
    b.on('event', (event) => {
      try {
        this.config.onEmit(event as unknown as OB11BaseEvent);
      } catch (e) {
        this.ctx.logger.warn('[JNI] Failed to forward event from Java:', e);
      }
    });
    b.on('exit', (code, signal) => {
      this.ctx.logger.warn(`[JNI] Java 桥接进程退出 (code=${code}, signal=${signal})`);
      if (this.bridge === b) this.bridge = null;
    });

    // 启动 Java 进程并等待 ready
    await b.start();

    // 发送 init 请求（期间插件可能已发起 Action 调用，监听器已就绪）
    const initParams: InitParams = {
      dataPath: DATA_DIR,
      javaPluginPath,
      adapterName: 'llbot-onebot11',
      javaPath: this.config.javaPath,
      jvmArgs: this.config.jvmArgs,
      bridgeJar: bridgeJarPath,
      classpath: this.config.classpath,
    };
    const info = await b.call<InitResult>('init', initParams);

    this.bridge = b;
    this.javaPlugins = info.plugins ?? [];
    this.ctx.logger.info(`[JNI] Java 插件桥接器就绪，已加载 ${this.javaPlugins.length} 个 Java 插件`);
  }

  public async stop() {
    if (!this.bridge) return;
    const b = this.bridge;
    this.bridge = null;
    this.javaPlugins = [];
    try {
      await b.stop();
    } catch (e) {
      this.ctx.logger.warn('[JNI] 停止 Java 桥接器时出错:', e);
    }
  }

  /** 热重载：停止 Java 桥接进程并按当前配置重启（重新扫描插件目录，更新插件 jar 后无需改配置） */
  public async reload() {
    await this.stop();
    if (this.config.enable) {
      await this.start();
    }
    return { running: this.running, plugins: this.javaPlugins };
  }

  /** 重新扫描并刷新插件列表（同步 javaPlugins 缓存） */
  public async listPlugins(): Promise<JavaPluginInfo[]> {
    if (!this.bridge?.running) {
      return this.javaPlugins;
    }
    const info = await this.bridge.call<InitResult>('listPlugins', {});
    this.javaPlugins = info.plugins ?? [];
    return this.javaPlugins;
  }

  /** 加载单个 Java 插件（热插拔，无需重启桥接进程） */
  public async loadPlugin(pluginId: string): Promise<{ ok: boolean; pluginId: string }> {
    if (!this.bridge?.running) {
      throw new Error('[JNI] Java 桥接进程未运行，无法加载插件');
    }
    const result = await this.bridge.call<{ ok: boolean; pluginId: string }>('loadPlugin', { pluginId });
    await this.listPlugins();
    return result;
  }

  /** 卸载单个 Java 插件（热插拔，会触发插件 onCleanup 生命周期） */
  public async unloadPlugin(pluginId: string): Promise<{ ok: boolean; pluginId: string }> {
    if (!this.bridge?.running) {
      throw new Error('[JNI] Java 桥接进程未运行，无法卸载插件');
    }
    const result = await this.bridge.call<{ ok: boolean; pluginId: string }>('unloadPlugin', { pluginId });
    await this.listPlugins();
    return result;
  }

  public updateConfig(config: Partial<OB11Jni.Config>) {
    Object.assign(this.config, config);
  }

  /** 处理 Java 侧发起的 OneBot Action 调用 */
  private async handleJavaAction(
    b: JniBridge,
    params: { requestId: number | string; action: string; params?: unknown }
  ): Promise<void> {
    const { requestId, action, params: actionParams } = params;
    const actionHandler = this.config.actionMap.get(action);
    if (!actionHandler) {
      b.replyAction(requestId, false, undefined, `Action '${action}' not found`);
      return;
    }
    try {
      const data = await actionHandler.handle(actionParams ?? {}, {
        messageFormat: 'array',
        debug: false,
      });
      b.replyAction(requestId, true, data);
    } catch (e) {
      b.replyAction(requestId, false, undefined, (e as Error).message);
    }
  }

  /** 判断是否为自身消息（user_id === self_id） */
  private isSelfMessage(event: unknown): boolean {
    if (!event || typeof event !== 'object') return false;
    const e = event as { user_id?: unknown; self_id?: unknown };
    return e.user_id != null && e.self_id != null &&
      String(e.user_id) === String(e.self_id);
  }

  /** OneBot 通用事件（notice/request/meta 等）转发给 Java */
  public async notifyEvent(event: OB11BaseEvent) {
    if (!this.bridge?.running || !this.config.enable) return;
    if (!this.config.reportSelfMessage && this.isSelfMessage(event)) return;
    try {
      // 通知 Java 侧处理事件（不等待返回，避免阻塞事件流）
      this.bridge.notify('onEvent', { event });
    } catch (e) {
      this.ctx.logger.warn('[JNI] Failed to forward event to Java:', e);
    }
  }

  /** OneBot 消息事件转发给 Java（走 adapter.dispatchMessageLike 同一流程） */
  public async notifyMessage(event: OB11BaseEvent, self: boolean) {
    if (!this.bridge?.running || !this.config.enable) return;
    if (self && !this.config.reportSelfMessage) return;
    if (event.post_type === 'message' || event.post_type === 'message_sent') {
      const msg = event as OB11Message;
      if (msg.message.length === 0) {
        return;
      }
      delete msg.raw;
      delete msg.raw_pb;
    }
    try {
      // 通知 Java 侧处理消息（不等待返回，避免阻塞事件流）
      this.bridge.notify('onMessage', { event });
    } catch (e) {
      this.ctx.logger.warn('[JNI] Failed to forward message to Java:', e);
    }
  }
}

namespace OB11Jni {
  export interface Config extends JniConfig {
    actionMap: Map<string, BaseAction<unknown, unknown>>
    /** Java 侧推送的事件经此回调回流到其他协议连接（避免回到本桥接造成循环） */
    onEmit: (event: OB11BaseEvent) => void
  }
}

export { OB11Jni, DEFAULT_BRIDGE_JAR, DEFAULT_JAVA_PLUGIN_DIR };
