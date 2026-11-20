import path from 'node:path'
import { realpathSync } from 'node:fs'
import { Context } from 'cordis'
import type { PluginStatus } from '@/plugin/host'
import { Market } from '@/plugin/internal/tool/market/index'
import { isPackageName, Registry } from '@/plugin/internal/tool/market/registry'
import { MarketSchema, type MarketSettings } from '@/plugin/internal/tool/market/settings'

/** Only npm names: repeat --plugin, or put several comma-separated names in one value. */
export function startupPluginNames(argv: readonly string[] = process.argv): string[] {
  const names = new Set<string>()
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]
    if (arg === '--') break
    let value: string | undefined
    if (arg === '--plugin') value = argv[++index]
    else if (arg.startsWith('--plugin=')) value = arg.slice('--plugin='.length)
    else continue
    if (!value) throw new Error('--plugin 需要 npm 包名，可重复指定多个包')
    for (const part of value.split(',')) {
      const name = part.trim()
      if (!isPackageName(name)) throw new Error('--plugin 只接受 npm 包名，不接受版本、路径或 URL')
      names.add(name)
    }
    if (names.size > 128) throw new Error('--plugin 最多指定 128 个插件包')
  }
  return [...names]
}

type RequestedInstaller = Pick<Market, 'ensureRequested'>

/** Do not include registry credentials or signed tarball queries in startup errors. */
export function startupPluginError(error: unknown): string {
  return (error instanceof Error ? error.message : String(error)).replace(/https?:\/\/[^\s]+/g, raw => {
    try { const url = new URL(raw); return url.origin + url.pathname } catch { return '[registry URL]' }
  })
}

function installer(ctx: Context): RequestedInstaller {
  const first = ctx.plugins.config.roots[0]
  if (!first) throw new Error('没有可安装插件的目录')
  let root = path.resolve(first)
  try { root = realpathSync(root) } catch { /* the installer creates a missing root */ }
  const config = new MarketSchema(ctx.plugins.entrySettings('builtin:market')?.config as MarketSettings | undefined)
  return new Market(ctx, new Registry(config.registry, (url, init) => ctx.http.fetch(url, init)), root)
}

/** CLI selection explicitly authorizes trust for requested packages and their required plugin dependencies. */
export async function startRequestedPlugins(ctx: Context, names: readonly string[], source?: RequestedInstaller): Promise<void> {
  if (!names.length) return
  const market = source ?? installer(ctx)
  const logger = ctx.logger('startup-plugins')
  const completed = new Set<string>()
  const failures: string[] = []
  const check = (status: PluginStatus) => {
    if (['failed', 'missing', 'incompatible'].includes(status.state) || status.disabled || !status.trusted) {
      throw new Error(status.error ?? `${status.name} 未能启用（${status.state}）`)
    }
    // Pending services such as QQ login are expected; enabling a plugin does not promise an account is online.
    logger.info(`${status.name} 已启用${status.state === 'pending' ? '，等待所需服务就绪' : ''}`)
  }
  for (const requested of new Set(names)) {
    try {
      const plan = await market.ensureRequested(requested)
      for (const name of plan.names) {
        if (completed.has(name)) continue
        const entries = ctx.plugins.list().filter(entry => entry.name === name || entry.packageName === name)
        if (!entries.length) check(await ctx.plugins.add(name, undefined, { trust: true }))
        else {
          // Preserve multi-entry choices: keep all previously enabled entries, otherwise enable the first saved one.
          const enabled = entries.filter(entry => !entry.disabled)
          for (const entry of enabled.length ? enabled : entries.slice(0, 1)) {
            check(await ctx.plugins.enable(entry.id, { trust: true }))
          }
        }
        completed.add(name)
      }
    } catch (error) {
      const message = `${requested}: ${startupPluginError(error)}`
      logger.error(message)
      failures.push(message)
    }
  }
  if (failures.length) throw new Error(`启动插件未全部就绪：${failures.join('; ')}`)
}
