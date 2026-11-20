import React, { useEffect, useMemo, useSyncExternalStore } from 'react'
import { usePlugins, type PluginCatalogProps, type PluginCatalogState, type WebUIContext, type WebUIPlugin } from '@luckylillia/plugin-sdk/webui'
import LocalInstallPanel from './LocalInstallPanel'
import { MarketStore } from './store'

export const name = 'builtin:market'

interface InstanceResult {
  instance: string
  pid: number
  status: 'reloaded' | 'unchanged' | 'removed' | 'restart-required' | 'failed'
  reason?: string
}

interface PackageResult {
  reload?: { status: 'reloaded' } | { status: 'restart-required' | 'failed'; reason: string }
  instances?: InstanceResult[]
}

interface InstallOutcome extends PackageResult {
  name: string
  title?: string
  version: string
  previous?: string
  entries: string[]
  scripts: string[]
  skipped: string[]
  dependencies?: (PackageResult & { name: string; title?: string; version: string; previous?: string; entries: string[] })[]
}

// Local uploads do not reveal their package name until the server validates them.
const LOCAL_INSTALL = ':local'
const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e))
const store = new MarketStore()
const titleOf = (name: string, title?: string) => title || store.installed?.find(pkg => pkg.name === name)?.title
  || store.catalog?.find(item => item.name === name)?.title || name

function reportResult(ctx: WebUIContext, message: string, result: PackageResult, announceSuccess = true) {
  if (result.instances?.length) {
    const failures = result.instances.filter(item => item.status === 'failed')
    const pending = result.instances.filter(item => item.status === 'restart-required')
    const details = [
      ...failures.map(item => `实例 ${item.instance} 同步失败${item.reason ? `：${item.reason}` : ''}`),
      ...pending.map(item => `实例 ${item.instance} 需要重启 Bot${item.reason ? `：${item.reason}` : ''}`),
    ]
    if (details.length) ctx.toast(`${message}；${details.join('；')}`, failures.length ? 'error' : 'warning')
    else if (announceSuccess) ctx.toast(`${message}${result.instances.length > 1 ? `；已同步 ${result.instances.length} 个实例` : ''}`)
    return
  }
  const reload = result.reload
  if (reload?.status === 'restart-required') ctx.toast(`${message}，重启 Bot 后生效：${reload.reason}`, 'warning')
  else if (reload?.status === 'failed') ctx.toast(`${message}，但重新加载失败：${reload.reason}`, 'error')
  else if (announceSuccess) ctx.toast(message)
}

function useMarket() {
  useSyncExternalStore(store.subscribe, () => store.version)
  return store
}

async function install(name: string, version: string): Promise<boolean> {
  if (store.catalogError || !store.catalog?.some(item => item.name === name && item.version === version)
    || store.installed?.some(pkg => pkg.name === name)) return false
  return performInstall(name, titleOf(name), () => store.ctx!.api<InstallOutcome>('/api/market/install', { body: { name, version } }))
}

async function update(name: string): Promise<boolean> {
  const pkg = store.installed?.find(item => item.name === name)
  const version = store.updates?.[name]?.update
  if (!pkg?.managed || !version) return false
  return performInstall(name, titleOf(name), () => store.ctx!.api<InstallOutcome>('/api/market/update', {
    body: { name, version, currentVersion: pkg.version },
  }), '更新')
}

async function installLocal(file: File): Promise<boolean> {
  const body = new FormData()
  body.set('file', file)
  body.set('confirm', 'true')
  return performInstall(LOCAL_INSTALL, file.name, () => store.ctx!.api<InstallOutcome>('/api/market/install-local', { body }))
}

async function performInstall(key: string, label: string, request: () => Promise<InstallOutcome>, action = '安装'): Promise<boolean> {
  if (!store.ctx || store.busy.size || !store.installed || store.installedError) return false
  const ctx = store.ctx
  store.busy.add(key)
  store.invalidateUpdates()
  store.emit()
  try {
    const outcome = await request()
    const name = outcome.name
    const title = titleOf(name, outcome.title)
    let what = outcome.previous
      ? `已把 ${title} 从 ${outcome.previous} 更新到 ${outcome.version}`
      : `已安装 ${title} ${outcome.version}`
    if (outcome.dependencies?.length) {
      what += `；同时安装或更新了依赖插件：${outcome.dependencies.map(dep => `${titleOf(dep.name, dep.title)} ${dep.version}`).join('、')}`
    }
    if (!outcome.previous || outcome.dependencies?.some(dep => !dep.previous)) what += '；新装插件可在「已安装」中启用'
    reportResult(ctx, what, outcome)
    for (const dep of outcome.dependencies ?? []) {
      reportResult(ctx, `依赖插件 ${titleOf(dep.name, dep.title)}`, dep, false)
    }
    if (outcome.scripts.length) {
      ctx.toast(`这些包带安装脚本，没有运行：${outcome.scripts.join('、')}。需要编译的原生模块会加载失败`, 'warning')
    }
    return true
  } catch (e) {
    ctx.toast(`${action} ${label} 失败：${errorText(e)}`, 'error')
    return false
  } finally {
    if (store.ctx === ctx) {
      await store.loadInstalled()
      if (store.ctx === ctx) {
        store.busy.delete(key)
        store.emit()
        void store.checkUpdates(true)
      }
    }
  }
}

async function uninstall(name: string, options: { keepConfig?: boolean } = {}): Promise<boolean> {
  const pkg = store.installed?.find(item => item.name === name)
  if (!store.ctx || store.busy.size || store.installedError || !pkg?.managed || pkg.builtin) return false
  const ctx = store.ctx
  store.busy.add(name)
  store.invalidateUpdates()
  store.emit()
  try {
    const outcome = await ctx.api<{ instances?: InstanceResult[] }>('/api/market/uninstall', { body: { name, keepConfig: options.keepConfig === true } })
    reportResult(ctx, `已卸载 ${titleOf(name)}`, outcome)
    return true
  } catch (e) {
    ctx.toast(`卸载 ${titleOf(name)} 失败：${errorText(e)}`, 'error')
    return false
  } finally {
    if (store.ctx === ctx) {
      await store.loadInstalled()
      if (store.ctx === ctx) {
        store.busy.delete(name)
        store.emit()
        void store.checkUpdates(true)
      }
    }
  }
}

/** Supplies package metadata and operations; the host owns filtering, cards, details and settings. */
const CatalogBridge: React.FC<PluginCatalogProps> = ({ loadCatalog, onChange }) => {
  const market = useMarket()
  const plugins = usePlugins()
  useEffect(() => {
    if (loadCatalog) void market.loadCatalog()
  }, [loadCatalog, market, market.ctx])

  useEffect(() => {
    if (!plugins) return
    const ctx = market.ctx
    // Peer updates arrive on the host's plugin stream; refresh package versions after the status burst settles.
    const timer = setTimeout(async () => {
      if (!ctx || market.ctx !== ctx || market.busy.size) return
      if (await market.loadInstalled() && market.ctx === ctx) await market.checkUpdates(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [plugins, market, market.ctx])

  const snapshot = useMemo<PluginCatalogState>(() => {
    const refresh = () => {
      if (loadCatalog || market.catalog !== null || market.catalogError) void market.loadCatalog(true)
      void market.refresh()
    }
    return {
      items: market.catalog, loading: market.loadingCatalog, error: market.catalogError || undefined,
      installed: market.installed, installedError: market.installedError || undefined,
      updates: market.updates, updatesError: market.updatesError || undefined,
      checking: market.checking, loadingInstalled: market.loadingInstalled, checkedAt: market.checkedAt,
      busy: [...market.busy], retry: refresh, refresh, install, update, uninstall,
    }
  }, [market, market.version, loadCatalog])

  useEffect(() => { onChange(snapshot) }, [onChange, snapshot])
  useEffect(() => () => onChange(null), [onChange])
  return null
}

const LocalInstall: React.FC<{ onInstalled(): void; disabled?: boolean }> = ({ onInstalled, disabled }) => {
  const market = useMarket()
  return (
    <LocalInstallPanel
      busy={market.busy.has(LOCAL_INSTALL)}
      disabled={!!disabled || !market.installed || market.loadingInstalled || !!market.installedError || market.busy.size > 0}
      error={market.installedError}
      onRetry={() => { void market.refresh() }}
      onInstall={async file => {
        const installed = await installLocal(file)
        if (installed) onInstalled()
        return installed
      }}
    />
  )
}

const apply: WebUIPlugin = (ctx) => {
  const disconnect = store.connect(ctx)
  ctx.slot('plugins.catalog', { id: 'market', label: '插件市场目录', component: CatalogBridge })
  ctx.slot('plugins.install', { id: 'market-local', label: '本地插件包', component: LocalInstall })
  return disconnect
}

export default apply
