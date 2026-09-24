import { Context } from 'cordis'
import { networkInterfaces } from 'os'
import { selfInfo } from '@/common/globalVars'
import { ReqConfig, ResConfig } from '../types'
import { Config } from '@/common/types'
import { isDockerEnvironment } from '@/common/utils/environment'
import { Hono } from 'hono'
import { webuiTokenUtil } from '../../../main/config'

function isListenAllInterfaces(host: string | undefined): boolean {
  return !host || host === '0.0.0.0' || host === '::'
}

function validateTokenConfig(config: Config): string | null {
  // 检查 Satori
  if (config.satori?.enable && isListenAllInterfaces(config.satori.host) && !config.satori.token) {
    return 'Satori 监听全部地址时必须设置 Token'
  }

  // 检查 Milky HTTP
  if (config.milky?.enable && isListenAllInterfaces(config.milky.http?.host) && !config.milky.http?.accessToken) {
    return 'Milky HTTP 监听全部地址时必须设置 Token'
  }

  // 检查 OneBot11 适配器
  if (config.ob11?.enable && Array.isArray(config.ob11.connect)) {
    for (const conn of config.ob11.connect) {
      if (!conn.enable) continue
      if ((conn.type === 'ws' || conn.type === 'http') && isListenAllInterfaces(conn.host) && !conn.token) {
        const typeName = conn.type === 'ws' ? 'WebSocket' : 'HTTP'
        return `OneBot11 ${typeName} 适配器监听全部地址时必须设置 Token`
      }
    }
  }

  return null
}

export function createConfigRoutes(ctx: Context): Hono {
  const router = new Hono()

  // 获取网卡列表
  router.get('/network-interfaces', async (c) => {
    try {
      const isDocker = isDockerEnvironment()
      const interfaces = networkInterfaces()
      const addresses: string[] = []
      if (!isDocker) {
        for (const name in interfaces) {
          for (const iface of interfaces[name] || []) {
            if (iface.family === 'IPv4' && !iface.internal) {
              addresses.push(iface.address)
            }
          }
        }
      }
      return c.json({ success: true, data: addresses, isDocker })
    } catch (e) {
      return c.json({ success: false, message: '获取网卡列表失败', error: e }, 500)
    }
  })

  // 设置token接口
  router.post('/set-token', async (c) => {
    const { token } = await c.req.json()
    if (!token) {
      return c.json({ success: false, message: 'Token不能为空' }, 400)
    }
    webuiTokenUtil.setToken(token)
    return c.json({ success: true, message: 'Token设置成功' })
  })

  // 获取配置
  router.get('/config', async (c) => {
    try {
      const config = ctx.config.get()
      const resJson: ResConfig = {
        config,
        selfInfo,
      }
      return c.json({
        success: true,
        data: resJson,
      })
    } catch (e) {
      return c.json({ success: false, message: '获取配置失败', error: e }, 500)
    }
  })

  // 保存配置
  router.post('/config', async (c) => {
    try {
      const { config } = await c.req.json() as ReqConfig
      const oldConfig = ctx.config.get()
      const newConfig = { ...oldConfig, ...config }

      const validationError = validateTokenConfig(newConfig)
      if (validationError) {
        return c.json({ success: false, message: validationError }, 400)
      }

      ctx.config.set(newConfig)
      ctx.parallel('llob/config-updated', newConfig)
      return c.json({ success: true, message: '配置保存成功' })
    } catch (e) {
      return c.json({ success: false, message: '保存配置失败', error: e }, 500)
    }
  })

  // Java 插件桥接：当前状态（登录后 onebot 服务才就绪）
  router.get('/ob11/jni/status', async (c) => {
    try {
      let onebot: Context['onebot'] | undefined
      try {
        onebot = ctx.get('onebot' as never) as Context['onebot'] | undefined
      } catch {
        onebot = undefined
      }
      if (!onebot) {
        return c.json({ success: true, data: { ready: false, running: false, plugins: [] } })
      }
      const status = onebot.jniStatus
      return c.json({ success: true, data: { ready: true, ...status } })
    } catch (e) {
      return c.json({ success: false, message: '获取 Java 插件桥接状态失败', error: e }, 500)
    }
  })

  // Java 插件桥接：热重载（停止并重启 Java 进程，重新扫描插件目录）
  router.post('/ob11/jni/reload', async (c) => {
    try {
      let onebot: Context['onebot'] | undefined
      try {
        onebot = ctx.get('onebot' as never) as Context['onebot'] | undefined
      } catch {
        onebot = undefined
      }
      if (!onebot) {
        return c.json({ success: false, message: 'OneBot 适配器未就绪（请确认已登录且 OneBot 11 已启用）' }, 400)
      }
      const status = await onebot.reloadJni()
      return c.json({
        success: true,
        message: status.running
          ? `Java 插件重载成功，已加载 ${status.plugins.length} 个插件`
          : 'Java 插件桥接已停止（当前未启用）',
        data: status,
      })
    } catch (e) {
      return c.json({ success: false, message: '重载 Java 插件失败', error: e }, 500)
    }
  })

  // Java 插件桥接：加载单个插件（热插拔，无需重启进程）
  router.post('/ob11/jni/load', async (c) => {
    try {
      const { pluginId } = await c.req.json() as { pluginId?: string }
      if (!pluginId) {
        return c.json({ success: false, message: '缺少 pluginId' }, 400)
      }
      let onebot: Context['onebot'] | undefined
      try {
        onebot = ctx.get('onebot' as never) as Context['onebot'] | undefined
      } catch {
        onebot = undefined
      }
      if (!onebot) {
        return c.json({ success: false, message: 'OneBot 适配器未就绪（请确认已登录且 OneBot 11 已启用）' }, 400)
      }
      const result = await onebot.loadJniPlugin(pluginId)
      // 附带最新插件列表，前端可直接刷新 UI 无需二次请求
      return c.json({ success: true, message: `插件 ${pluginId} 加载成功`, data: { ...result, ...onebot.jniStatus } })
    } catch (e) {
      return c.json({ success: false, message: `加载插件失败: ${(e as Error).message}`, error: e }, 500)
    }
  })

  // Java 插件桥接：卸载单个插件（热插拔，触发插件 onCleanup）
  router.post('/ob11/jni/unload', async (c) => {
    try {
      const { pluginId } = await c.req.json() as { pluginId?: string }
      if (!pluginId) {
        return c.json({ success: false, message: '缺少 pluginId' }, 400)
      }
      let onebot: Context['onebot'] | undefined
      try {
        onebot = ctx.get('onebot' as never) as Context['onebot'] | undefined
      } catch {
        onebot = undefined
      }
      if (!onebot) {
        return c.json({ success: false, message: 'OneBot 适配器未就绪（请确认已登录且 OneBot 11 已启用）' }, 400)
      }
      const result = await onebot.unloadJniPlugin(pluginId)
      // 附带最新插件列表，前端可直接刷新 UI 无需二次请求
      return c.json({ success: true, message: `插件 ${pluginId} 卸载成功`, data: { ...result, ...onebot.jniStatus } })
    } catch (e) {
      return c.json({ success: false, message: `卸载插件失败: ${(e as Error).message}`, error: e }, 500)
    }
  })

  return router
}
