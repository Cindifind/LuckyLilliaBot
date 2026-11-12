import React, { useState, useEffect } from 'react';
import { OB11Config, ConnectConfig, WsConnectConfig, WsReverseConnectConfig, HttpConnectConfig, HttpPostConnectConfig, JniConfig } from '../../types';
import { Radio, Wifi, Globe, Send, X, Settings, Plus, Trash2, Edit2, Eye, EyeOff, ExternalLink, Coffee, RefreshCw, Play, Power, List } from 'lucide-react';
import { Portal, HostSelector } from '../common';
import { showToast } from '../common';
import EventFilterEditor from './EventFilterEditor';
import { apiFetch } from '../../utils/api';

interface OneBotConfigProps {
  config: OB11Config;
  onChange: (config: OB11Config) => void;
  onSave: (config?: OB11Config) => void;
}

/** Java 插件信息（与后端 JavaPluginInfo 一致） */
interface JniPluginItem {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  entry: string;
  enabled: boolean;
}

interface JniStatus {
  ready: boolean;
  running: boolean;
  plugins: JniPluginItem[];
}

const OneBotConfigNew: React.FC<OneBotConfigProps> = ({ config, onChange, onSave }) => {
  const [selectedAdapter, setSelectedAdapter] = useState<ConnectConfig | null>(null);
  const [selectedAdapterIndex, setSelectedAdapterIndex] = useState<number>(-1);
  const [showDialog, setShowDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isNewAdapter, setIsNewAdapter] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [jniReloading, setJniReloading] = useState(false);
  const [jniStatus, setJniStatus] = useState<JniStatus | null>(null);
  const [operatingPluginId, setOperatingPluginId] = useState<string | null>(null);
  const [showPluginDialog, setShowPluginDialog] = useState(false);

  // 老配置可能没有 jni 段，用默认值兜底
  const jni: JniConfig = config.jni ?? {
    enable: false,
    javaPath: 'java',
    jvmArgs: ['-Xmx256m'],
    bridgeJar: 'onebot-bridge.jar',
    javaPluginDir: 'java-plugins',
    classpath: [],
    callTimeout: 30000,
    reportSelfMessage: false,
  };

  const adapterInfo = {
    'ws': { icon: Radio, name: 'WebSocket正向', desc: '提供WebSocket服务器' },
    'ws-reverse': { icon: Wifi, name: 'WebSocket反向', desc: '作为客户端连接到WebSocket服务' },
    'http': { icon: Globe, name: 'HTTP服务', desc: '提供HTTP API服务' },
    'http-post': { icon: Send, name: 'HTTP上报', desc: '上报事件到HTTP服务器' },
  };

  const handleAdapterClick = (adapter: ConnectConfig, index: number) => {
    setSelectedAdapter(adapter);
    setSelectedAdapterIndex(index);
    setIsNewAdapter(false);
    setEditingName(false);
    setTempName(adapter.name || '');
    setShowToken(false);
    setShowDialog(true);
  };

  const handleStartEditName = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingName(true);
  };

  const handleSaveName = () => {
    if (!selectedAdapter) return;
    const updatedAdapter = { ...selectedAdapter, name: tempName.trim() };
    setSelectedAdapter(updatedAdapter);
    setEditingName(false);
  };

  const handleCancelEditName = () => {
    setTempName(selectedAdapter?.name || '');
    setEditingName(false);
  };

  const handleSaveAdapter = () => {
    if (!selectedAdapter) return;

    // 检查：如果监听所有地址且是 ws/http 类型，token 必须设置
    const needsTokenValidation = selectedAdapter.type === 'ws' || selectedAdapter.type === 'http';
    const adapterHost = (selectedAdapter as WsConnectConfig | HttpConnectConfig).host;
    const isListenAll = !adapterHost || adapterHost === '0.0.0.0' || adapterHost === '::';
    if (needsTokenValidation && isListenAll && !selectedAdapter.token?.trim()) {
      showToast('监听全部地址时必须设置 Token', 'error');
      return;
    }

    let newConnect: ConnectConfig[];

    if (isNewAdapter) {
      newConnect = [...config.connect, selectedAdapter];
    } else {
      if (selectedAdapterIndex < 0) return;
      newConnect = [...config.connect];
      newConnect[selectedAdapterIndex] = selectedAdapter;
    }

    const newConfig = { ...config, connect: newConnect };
    onChange(newConfig);
    setShowDialog(false);
    setIsNewAdapter(false);
    onSave(newConfig);
  };

  const handleDeleteAdapter = () => {
    if (isNewAdapter) {
      setShowDialog(false);
      setIsNewAdapter(false);
      return;
    }

    if (selectedAdapterIndex < 0) return;

    const newConnect = config.connect.filter((_, index) => index !== selectedAdapterIndex);
    const newConfig = { ...config, connect: newConnect };
    onChange(newConfig);
    setShowDialog(false);
    onSave(newConfig);
  };

  const handleAddAdapter = (type: 'ws' | 'ws-reverse' | 'http' | 'http-post') => {
    const baseConfig = {
      enable: true,
      token: '',
      messageFormat: 'array' as const,
      reportSelfMessage: false,
      reportOfflineMessage: false,
      debug: false,
    };

    let newAdapter: ConnectConfig;
    switch (type) {
      case 'ws':
        newAdapter = { ...baseConfig, type: 'ws', host: '', port: 3001, heartInterval: 60000 };
        break;
      case 'ws-reverse':
        newAdapter = { ...baseConfig, type: 'ws-reverse', url: '', heartInterval: 60000 };
        break;
      case 'http':
        newAdapter = { ...baseConfig, type: 'http', host: '', port: 3000 };
        break;
      case 'http-post':
        newAdapter = { ...baseConfig, type: 'http-post', url: '', enableHeart: false, heartInterval: 60000 };
        break;
    }

    setShowAddDialog(false);
    setSelectedAdapter(newAdapter);
    setSelectedAdapterIndex(-1);
    setIsNewAdapter(true);
    setShowToken(false);
    setShowDialog(true);
  };

  const updateSelectedAdapter = (field: string, value: unknown) => {
    if (!selectedAdapter) return;
    setSelectedAdapter({ ...selectedAdapter, [field]: value });
  };

  // 拉取桥接运行状态
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await apiFetch<JniStatus>('/api/ob11/jni/status');
        if (!cancelled && res.success && res.data) {
          setJniStatus({ ready: res.data.ready, running: res.data.running, plugins: res.data.plugins || [] });
        }
      } catch { /* 未就绪时忽略 */ }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // 修改 jni 配置并保存（保存后后端自动停止/重启桥接，即热重载）
  const updateJni = (partial: Partial<JniConfig>) => {
    const newConfig = { ...config, jni: { ...jni, ...partial } };
    onChange(newConfig);
    onSave(newConfig);
  };

  // 显式热重载：重启 Java 进程、重新扫描插件目录（更新插件 jar 后使用）
  const handleReloadJni = async () => {
    setJniReloading(true);
    try {
      const res = await apiFetch<JniStatus>('/api/ob11/jni/reload', { method: 'POST' });
      if (res.success) {
        showToast(res.message || 'Java 插件重载成功', 'success');
        setJniStatus({ ready: true, running: res.data?.running ?? false, plugins: res.data?.plugins || [] });
      } else {
        showToast(res.message || '重载失败', 'error');
      }
    } catch (e) {
      showToast('重载失败: ' + (e instanceof Error ? e.message : String(e)), 'error');
    } finally {
      setJniReloading(false);
    }
  };

  // 单个插件热插拔：已启用 → 卸载，未启用 → 加载（无需重启桥接进程）
  const handleTogglePlugin = async (plugin: JniPluginItem) => {
    setOperatingPluginId(plugin.id);
    try {
      const res = await apiFetch<JniStatus & { ok: boolean }>(`/api/ob11/jni/${plugin.enabled ? 'unload' : 'load'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pluginId: plugin.id }),
      });
      if (res.success) {
        showToast(res.message || `${plugin.enabled ? '卸载' : '加载'}成功`, 'success');
        if (res.data) {
          setJniStatus({ ready: true, running: res.data.running, plugins: res.data.plugins || [] });
        }
      } else {
        showToast(res.message || `${plugin.enabled ? '卸载' : '加载'}失败`, 'error');
      }
    } catch (e) {
      showToast(`${plugin.enabled ? '卸载' : '加载'}失败: ${e instanceof Error ? e.message : String(e)}`, 'error');
    } finally {
      setOperatingPluginId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 总开关 */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl gradient-primary-br flex items-center justify-center">
            <Radio size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-theme">OneBot 11 协议</h3>
            <p className="text-sm text-theme-secondary">启用或禁用 OneBot 11 适配器</p>
          </div>
          <a
            href="https://www.luckylillia.com/guide/develop#onebot11-%E5%8D%8F%E8%AE%AE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/30 rounded-lg transition-colors"
          >
            <ExternalLink size={16} />
            文档
          </a>
          <input
            type="checkbox"
            checked={config.enable}
            onChange={(e) => {
              const newConfig = { ...config, enable: e.target.checked };
              onChange(newConfig);
              onSave(newConfig);
            }}
            className="switch-toggle-lg"
          />
        </div>
      </div>

      {/* Java 插件桥接 */}
      {config.enable && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Coffee size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-theme">Java 插件桥接</h3>
              <p className="text-sm text-theme-secondary">与 Java 插件双向通信，插件目录: {jni.javaPluginDir}</p>
            </div>
            <input
              type="checkbox"
              checked={jni.enable}
              onChange={(e) => updateJni({ enable: e.target.checked })}
              className="switch-toggle-lg"
            />
          </div>

          {jni.enable && (
            <div className="space-y-4 border-t border-theme-divider pt-4">
              <div className="flex items-center justify-between p-4 bg-theme-item rounded-xl">
                <div>
                  <div className="text-sm font-medium text-theme">上报自身消息</div>
                  <div className="text-xs text-theme-muted mt-0.5">开启后，机器人自己发送的消息也会推送给 Java 插件</div>
                </div>
                <input
                  type="checkbox"
                  checked={jni.reportSelfMessage}
                  onChange={(e) => updateJni({ reportSelfMessage: e.target.checked })}
                  className="switch-toggle"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-theme-item rounded-xl">
                <div>
                  <div className="text-sm font-medium text-theme">桥接状态</div>
                  <div className="text-xs text-theme-muted mt-0.5">
                    {jniStatus?.ready === false
                      ? '未登录时不可用'
                      : jniStatus?.running
                        ? `运行中 · 共 ${jniStatus.plugins.length} 个插件`
                        : '未运行'}
                  </div>
                  {/* 插件简要列表：启用为绿色，未启用为灰色 */}
                  {jniStatus?.running && jniStatus.plugins.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {jniStatus.plugins.map((p) => (
                        <span
                          key={p.id || p.name}
                          title={`${p.name}${p.description ? ` - ${p.description}` : ''}`}
                          className={`text-xs px-2 py-0.5 rounded-full ${p.enabled
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-400'}`}
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPluginDialog(true)}
                    disabled={!jniStatus?.running}
                    className="px-4 py-2.5 text-sm font-medium text-theme-secondary bg-theme-item hover:bg-theme-item-hover rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <List size={16} />
                    插件详情
                  </button>
                  <button
                    onClick={handleReloadJni}
                    disabled={jniReloading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <RefreshCw size={16} className={jniReloading ? 'animate-spin' : ''} />
                    {jniReloading ? '重载中...' : '重载插件'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Java 插件详情弹窗：单个插件热插拔 */}
      {showPluginDialog && (
        <Portal>
          <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 9000 }}>
            <div className="bg-white/60 dark:bg-neutral-800/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-white/50 dark:border-neutral-700/50">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-neutral-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <Coffee size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-theme">Java 插件详情</h3>
                    <p className="text-sm text-theme-secondary">
                      {jniStatus?.running ? `共 ${jniStatus.plugins.length} 个插件 · 点击加载/卸载启用或禁用` : '桥接未运行'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowPluginDialog(false)} className="text-theme-hint hover:text-theme">
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-3 overflow-y-auto flex-1">
                {!jniStatus?.running ? (
                  <div className="text-sm text-theme-muted text-center py-10">Java 桥接未运行，无法管理插件</div>
                ) : jniStatus.plugins.length === 0 ? (
                  <div className="text-sm text-theme-muted text-center py-10">未发现插件，将 jar 放入插件目录后点击“重载插件”扫描</div>
                ) : (
                  jniStatus.plugins.map((p) => (
                    <div key={p.id || p.name} className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-theme-item border border-theme-divider">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-theme">{p.name}</span>
                          {p.version && <span className="text-xs px-1.5 py-0.5 rounded bg-theme-hint/10 text-theme-hint">{p.version}</span>}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${p.enabled
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-400'}`}>
                            {p.enabled ? '已启用' : '未启用'}
                          </span>
                        </div>
                        <div className="text-xs text-theme-muted mt-1 truncate" title={p.id}>
                          ID: {p.id}{p.author ? ` · ${p.author}` : ''}
                        </div>
                        {p.description && <div className="text-xs text-theme-secondary mt-1">{p.description}</div>}
                      </div>
                      <button
                        onClick={() => handleTogglePlugin(p)}
                        disabled={operatingPluginId === p.id}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-colors flex-shrink-0 disabled:opacity-50 ${
                          p.enabled
                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                            : 'bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400'
                        }`}
                      >
                        {operatingPluginId === p.id ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            {p.enabled ? '禁用中...' : '启用中...'}
                          </>
                        ) : p.enabled ? (
                          <>
                            <Power size={14} />
                            禁用
                          </>
                        ) : (
                          <>
                            <Play size={14} />
                            启用
                          </>
                        )}
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end p-6 border-t border-white/20 dark:border-neutral-700/50">
                <button onClick={() => setShowPluginDialog(false)} className="px-6 py-2.5 text-theme-secondary hover:bg-theme-item rounded-xl font-medium transition-colors">关闭</button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* 适配器卡片 */}
      {config.enable && config.connect && Array.isArray(config.connect) && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.connect.map((adapter, index) => {
            const info = adapterInfo[adapter.type as keyof typeof adapterInfo];
            const Icon = info.icon;

            return (
              <div
                key={index}
                className={`card p-6 cursor-pointer hover:scale-105 transition-all ${
                  adapter.enable ? 'ring-2 ring-pink-500' : ''
                }`}
                onClick={() => handleAdapterClick(adapter, index)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      adapter.enable
                        ? 'gradient-primary-br text-white'
                        : 'bg-gray-200 dark:bg-neutral-600 text-theme-secondary'
                    }`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-theme">
                        {adapter.name || info.name}
                      </h4>
                      <p className="text-sm text-theme-secondary">{info.desc}</p>
                    </div>
                  </div>
                  <Settings size={20} className="text-theme-hint" />
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-theme-divider">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    adapter.enable
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-400'
                  }`}>
                    {adapter.enable ? '已启用' : '未启用'}
                  </span>
                  {adapter.enable && (
                    <>
                      {(adapter.type === 'ws' || adapter.type === 'http') && (
                        <span className="text-sm text-theme-secondary">
                          端口: {(adapter as WsConnectConfig | HttpConnectConfig).port}
                        </span>
                      )}
                      {(adapter.type === 'ws-reverse' || adapter.type === 'http-post') && (
                        <span className="text-sm text-theme-secondary truncate max-w-[180px]" title={(adapter as WsReverseConnectConfig | HttpPostConnectConfig).url || '未配置'}>
                          URL: {(adapter as WsReverseConnectConfig | HttpPostConnectConfig).url || '未配置'}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              );
            })}
          </div>

          {/* 添加按钮 */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAddDialog(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              添加适配器
            </button>
          </div>
        </>
      )}

      {/* 配置弹窗 */}
      {showDialog && selectedAdapter && (
        <Portal>
          <div className="fixed inset-0 scrim flex items-center justify-center p-4" style={{ zIndex: 9000 }}>
          <div className="glass glass-thick r-window glass-pop w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 hairline-b">
              <div className="flex items-center gap-3 flex-1">
                {editingName ? (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                        if (e.key === 'Escape') handleCancelEditName();
                      }}
                      placeholder="输入自定义名称"
                      className="flex-1 px-3 py-2 border border-theme-input rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-theme-input text-theme"
                      autoFocus
                    />
                    <div className="flex gap-2 sm:flex-shrink-0">
                      <button onClick={handleSaveName} className="flex-1 sm:flex-none px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors whitespace-nowrap">确定</button>
                      <button onClick={handleCancelEditName} className="flex-1 sm:flex-none px-4 py-2 bg-theme-item text-theme-secondary rounded-xl hover:bg-theme-item-hover transition-colors whitespace-nowrap">取消</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-theme">
                      {isNewAdapter ? '新建 - ' : ''}{selectedAdapter.name || adapterInfo[selectedAdapter.type as keyof typeof adapterInfo].name}
                    </h3>
                    <button onClick={handleStartEditName} className="p-2 text-theme-hint hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/30 rounded-lg transition-colors" title="编辑名称">
                      <Edit2 size={18} />
                    </button>
                  </>
                )}
              </div>
              <button onClick={() => { setShowDialog(false); setIsNewAdapter(false); setEditingName(false); }} className="text-theme-hint hover:text-theme">
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-theme-secondary">启用此适配器</span>
                  <input type="checkbox" checked={selectedAdapter.enable} onChange={(e) => updateSelectedAdapter('enable', e.target.checked)} className="switch-toggle" />
                </label>
              </div>

              {/* WS正向 */}
              {selectedAdapter.type === 'ws' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-2">监听地址</label>
                    <HostSelector value={(selectedAdapter as WsConnectConfig).host || ''} onChange={(host) => updateSelectedAdapter('host', host)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-2">端口</label>
                    <input type="number" value={(selectedAdapter as WsConnectConfig).port} onChange={(e) => updateSelectedAdapter('port', parseInt(e.target.value))} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-2">心跳间隔 (ms)</label>
                    <input type="number" value={(selectedAdapter as WsConnectConfig).heartInterval} onChange={(e) => updateSelectedAdapter('heartInterval', parseInt(e.target.value))} className="input-field" />
                  </div>
                </>
              )}

              {/* WS反向 */}
              {selectedAdapter.type === 'ws-reverse' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-2">连接地址</label>
                    <input type="text" value={(selectedAdapter as WsReverseConnectConfig).url} onChange={(e) => updateSelectedAdapter('url', e.target.value)} placeholder="ws://example.com:8080" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-2">心跳间隔 (ms)</label>
                    <input type="number" value={(selectedAdapter as WsReverseConnectConfig).heartInterval} onChange={(e) => updateSelectedAdapter('heartInterval', parseInt(e.target.value))} className="input-field" />
                  </div>
                </>
              )}

              {/* HTTP */}
              {selectedAdapter.type === 'http' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-2">监听地址</label>
                    <HostSelector value={(selectedAdapter as HttpConnectConfig).host || ''} onChange={(host) => updateSelectedAdapter('host', host)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-2">端口</label>
                    <input type="number" value={(selectedAdapter as HttpConnectConfig).port} onChange={(e) => updateSelectedAdapter('port', parseInt(e.target.value))} className="input-field" />
                  </div>
                </>
              )}

              {/* HTTP上报 */}
              {selectedAdapter.type === 'http-post' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-2">上报地址</label>
                    <input type="text" value={(selectedAdapter as HttpPostConnectConfig).url} onChange={(e) => updateSelectedAdapter('url', e.target.value)} placeholder="http://example.com:8080/webhook" className="input-field" />
                  </div>
                  <div>
                    <label className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-theme-secondary">启用心跳</span>
                      <input type="checkbox" checked={(selectedAdapter as HttpPostConnectConfig).enableHeart} onChange={(e) => updateSelectedAdapter('enableHeart', e.target.checked)} className="switch-toggle" />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-2">心跳间隔 (ms)</label>
                    <input type="number" value={(selectedAdapter as HttpPostConnectConfig).heartInterval} onChange={(e) => updateSelectedAdapter('heartInterval', parseInt(e.target.value))} className="input-field" />
                  </div>
                </>
              )}

              {/* 通用配置 */}
              <div className="border-t border-theme-divider pt-6">
                <h4 className="text-md font-semibold text-theme mb-4">通用配置</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-2">Token</label>
                    <div className="relative">
                      <input type={showToken ? 'text' : 'password'} value={selectedAdapter.token} onChange={(e) => updateSelectedAdapter('token', e.target.value)} placeholder="访问令牌" className="input-field pr-12" />
                      <button type="button" onClick={() => setShowToken(!showToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-hint hover:text-theme transition-colors p-1">
                        {showToken ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-2">消息格式</label>
                    <div className="flex gap-4 text-theme-secondary">
                      <label className="flex items-center">
                        <input type="radio" value="array" checked={selectedAdapter.messageFormat === 'array'} onChange={(e) => updateSelectedAdapter('messageFormat', e.target.value)} className="mr-2" />
                        消息段 (array)
                      </label>
                      <label className="flex items-center">
                        <input type="radio" value="string" checked={selectedAdapter.messageFormat === 'string'} onChange={(e) => updateSelectedAdapter('messageFormat', e.target.value)} className="mr-2" />
                        CQ码 (string)
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-theme-secondary">上报自己发送的消息</span>
                      <input type="checkbox" checked={selectedAdapter.reportSelfMessage} onChange={(e) => updateSelectedAdapter('reportSelfMessage', e.target.checked)} className="switch-toggle" />
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-theme-secondary">上报离线消息</span>
                      <input type="checkbox" checked={selectedAdapter.reportOfflineMessage} onChange={(e) => updateSelectedAdapter('reportOfflineMessage', e.target.checked)} className="switch-toggle" />
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-theme-secondary">调试模式</span>
                      <input type="checkbox" checked={selectedAdapter.debug} onChange={(e) => updateSelectedAdapter('debug', e.target.checked)} className="switch-toggle" />
                    </label>
                  </div>
                </div>
              </div>

              {/* 事件过滤器 */}
              <EventFilterEditor
                key={selectedAdapterIndex}
                filter={selectedAdapter.filter}
                onChange={(f) => updateSelectedAdapter('filter', f)}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 hairline-t">
              {!isNewAdapter && (
                <button onClick={handleDeleteAdapter} className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                  <Trash2 size={18} />删除
                </button>
              )}
              {isNewAdapter && <div />}
              <div className="flex items-center gap-3">
                <button onClick={() => setShowDialog(false)} className="px-6 py-2.5 text-theme-secondary hover:bg-theme-item rounded-xl font-medium transition-colors">取消</button>
                <button onClick={handleSaveAdapter} className="btn-primary">保存</button>
              </div>
            </div>
          </div>
          </div>
        </Portal>
      )}

      {/* 添加适配器对话框 */}
      {showAddDialog && (
        <Portal>
          <div className="fixed inset-0 scrim flex items-center justify-center p-4" style={{ zIndex: 9000 }}>
          <div className="glass glass-thick r-window glass-pop w-full max-w-md">
            <div className="flex items-center justify-between p-6 hairline-b">
              <h3 className="text-xl font-semibold text-theme">选择适配器类型</h3>
              <button onClick={() => setShowAddDialog(false)} className="text-theme-hint hover:text-theme"><X size={24} /></button>
            </div>

            <div className="p-6 space-y-3">
              <button onClick={() => handleAddAdapter('ws')} className="w-full p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30 hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-900/50 dark:hover:to-rose-900/50 transition-all flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl gradient-primary-br text-white flex items-center justify-center group-hover:scale-110 transition-transform"><Radio size={24} /></div>
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-theme">WebSocket正向</h4>
                  <p className="text-sm text-theme-secondary">作为WebSocket服务器</p>
                </div>
              </button>

              <button onClick={() => handleAddAdapter('ws-reverse')} className="w-full p-4 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 hover:from-green-100 hover:to-teal-100 dark:hover:from-green-900/50 dark:hover:to-teal-900/50 transition-all flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform"><Wifi size={24} /></div>
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-theme">WebSocket反向</h4>
                  <p className="text-sm text-theme-secondary">作为客户端连接到WebSocket服务端</p>
                </div>
              </button>

              <button onClick={() => handleAddAdapter('http')} className="w-full p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/50 dark:hover:to-red-900/50 transition-all flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform"><Globe size={24} /></div>
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-theme">HTTP服务</h4>
                  <p className="text-sm text-theme-secondary">提供HTTP API服务</p>
                </div>
              </button>

              <button onClick={() => handleAddAdapter('http-post')} className="w-full p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30 hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-900/50 dark:hover:to-rose-900/50 transition-all flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform"><Send size={24} /></div>
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-theme">HTTP上报</h4>
                  <p className="text-sm text-theme-secondary">上报事件到HTTP服务器</p>
                </div>
              </button>
            </div>

            <div className="flex justify-end p-6 hairline-t">
              <button onClick={() => setShowAddDialog(false)} className="px-6 py-2.5 text-theme-secondary hover:bg-theme-item rounded-xl font-medium transition-colors">取消</button>
            </div>
          </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default OneBotConfigNew;
