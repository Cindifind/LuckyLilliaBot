import Schema from 'schemastery'
import type { BuiltinConfig } from '../../../host'
import { MARKET_PACKAGE } from './catalog'
import { isPackageName } from './registry'

export interface MarketSettings {
  registry: string
  mirrors: string[]
  catalog: string
}

export const MarketSchema: Schema<MarketSettings> = Schema.object({
  registry: Schema.string().role('link').default('https://registry.npmmirror.com')
    .description('读取插件目录、下载插件和依赖用的 npm 源，比如 https://registry.npmmirror.com 或 https://registry.npmjs.org'),
  mirrors: Schema.array(Schema.string().role('link')).default(['https://registry.npmjs.org'])
    .description('备用镜像源：上面的源连不上、出错，或还没同步到需要的版本时，按顺序改用这些源'),
  catalog: Schema.string().default(MARKET_PACKAGE)
    .description('提供插件列表和已审核版本的 npm 目录包，不清楚时保持默认即可'),
})

/** Every registry to use, the main one first */
export const registriesOf = (settings: MarketSettings): string[] => [settings.registry, ...(settings.mirrors ?? [])]

const sameUrl = (a: string, b: string) => a.replace(/\/+$/, '') === b.replace(/\/+$/, '')

const isWebUrl = (value: string) => {
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) && !!url.hostname
  } catch {
    return false
  }
}

export const marketSettings: BuiltinConfig<MarketSettings> = {
  normalize(value) {
    const registry = value.registry?.trim()
    // Absent stays absent, so the default mirrors apply
    let mirrors: string[] | undefined
    if (Array.isArray(value.mirrors)) {
      mirrors = []
      // Blank rows the form leaves behind, repeats and the main registry itself add nothing; the schema then
      // rejects anything that is no string
      for (const raw of value.mirrors as unknown[]) {
        const mirror = typeof raw === 'string' ? raw.trim() : raw
        if (mirror === '') continue
        if (typeof mirror === 'string' && ((registry && sameUrl(mirror, registry)) || mirrors.some(other => sameUrl(other, mirror)))) continue
        mirrors.push(mirror as string)
      }
    }
    return { registry, mirrors, catalog: value.catalog?.trim() } as MarketSettings
  },
  check(value) {
    const issues: { path: string[]; message: string }[] = []
    if (!isWebUrl(value.registry)) issues.push({ path: ['registry'], message: '要填 http:// 或 https:// 开头的有效地址' })
    for (const [index, mirror] of (value.mirrors ?? []).entries()) {
      if (!isWebUrl(mirror)) issues.push({ path: ['mirrors', String(index)], message: '要填 http:// 或 https:// 开头的有效地址' })
    }
    if (!isPackageName(value.catalog)) issues.push({ path: ['catalog'], message: '要填有效的 npm 包名，不能包含版本、URL 或文件路径' })
    return issues
  },
}
