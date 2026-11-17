import { afterAll, afterEach, describe, expect, it, vi } from 'vitest'
import { Context, type Fiber, Service } from 'cordis'
import TimerService from '@cordisjs/plugin-timer'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { applyLegacyConfig, legacyConfig } from '@/main/config/legacyConfig'
import { ADAPTER_ENTRIES } from '@/main/config/upgrade'
import PluginService, { PluginTrustRequiredError } from '@/plugin/host'

function fakeContext(entries: Record<string, { id: string; enabled: boolean; config: object }>) {
  const plugins = {
    entrySettings: (name: string) => entries[name] && { ...entries[name], trusted: true },
    updateConfig: vi.fn(async () => {}),
    enable: vi.fn(async () => {}),
    disable: vi.fn(async () => {}),
  }
  const ctx = {
    config: { get: () => ({ log: true, musicCardSignUrl: 'https://sign.example' }), patch: vi.fn((partial: object) => partial) },
    get: (name: string) => (name === 'plugins' ? plugins : undefined),
    parallel: vi.fn(async () => {}),
    logger: { warn: vi.fn() },
  } as unknown as Context
  return { ctx, plugins }
}

describe('the old config shape', () => {
  it('puts each adapter\'s section back, its switch as `enable`', () => {
    const { ctx } = fakeContext({
      'builtin:satori': { id: 's', enabled: true, config: { port: 5600 } },
      [ADAPTER_ENTRIES.milky]: { id: 'm', enabled: false, config: { reportSelfMessage: true } },
    })
    expect(legacyConfig(ctx)).toEqual({
      log: true,
      musicCardSignUrl: 'https://sign.example',
      // the old name too, for clients that know only that one
      musicSignUrl: 'https://sign.example',
      satori: { port: 5600, enable: true },
      milky: { reportSelfMessage: true, enable: false },
    })
  })

  it('passes the choice to skip the adapters\' own rules on, as OneBot set_config needs', async () => {
    const { ctx, plugins } = fakeContext({ 'builtin:satori': { id: 's', enabled: false, config: { host: '127.0.0.1' } } })
    await applyLegacyConfig(ctx, { satori: { enable: true, host: '' } }, { rules: false })
    expect(plugins.updateConfig).toHaveBeenCalledWith('s', { host: '' }, undefined, [], { rules: false })
    expect(plugins.enable).toHaveBeenCalledWith('s', { rules: false })
    // nothing left over for the settings file
    expect(ctx.config.patch).not.toHaveBeenCalled()
  })

  it('takes the old name of the music card service and drops settings nothing reads any more', async () => {
    const { ctx } = fakeContext({})
    await applyLegacyConfig(ctx, { musicSignUrl: 'https://sign.example/card', autoDeleteFile: true, log: false })
    expect(ctx.config.patch).toHaveBeenCalledWith({ musicCardSignUrl: 'https://sign.example/card', log: false })
  })
})

declare global {
  var __legacyConfigImports: string[]
}

const tmp = path.resolve('.tmp')
mkdirSync(tmp, { recursive: true })
const work = mkdtempSync(path.join(tmp, 'legacy-plugin-config-'))
const mounted: Fiber[] = []

afterEach(async () => {
  for (const fiber of mounted.splice(0).reverse()) await fiber.dispose()
})
afterAll(() => rmSync(work, { recursive: true, force: true }))

class BaseConfig extends Service {
  constructor(ctx: Context) { super(ctx, 'config') }
  get() { return { log: true, musicCardSignUrl: 'https://sign.example' } }
  patch(partial: object) { return { ...this.get(), ...partial } }
}

async function pluginContext(options: { trusted?: boolean; disabled?: boolean; config?: object; installed?: boolean } = {}) {
  globalThis.__legacyConfigImports = []
  const dir = mkdtempSync(path.join(work, 'instance-'))
  const root = path.join(dir, 'plugins')
  const name = ADAPTER_ENTRIES.ob11
  if (options.installed !== false) {
    const pkg = path.join(root, name)
    mkdirSync(pkg, { recursive: true })
    writeFileSync(path.join(pkg, 'package.json'), JSON.stringify({ name, version: '1.0.0', type: 'module', main: 'index.js', llbot: {} }))
    writeFileSync(path.join(pkg, 'index.js'), `
      import Schema from 'schemastery'
      globalThis.__legacyConfigImports.push('import')
      export const Config = Schema.object({
        connect: Schema.array(Schema.any()).default([]),
        reportSelfMessage: Schema.boolean().default(false),
        http: Schema.object({ host: Schema.string().default('127.0.0.1'), port: Schema.number().default(3000), token: Schema.string().role('secret').default('') }),
      })
      export function apply() { globalThis.__legacyConfigImports.push('apply') }
    `)
  }
  const file = path.join(dir, 'plugins.json')
  writeFileSync(file, JSON.stringify({ version: 1, trusted: options.trusted ? [name] : [], entries: [{
    id: 'legacy01', name, disabled: options.disabled !== false, config: options.config ?? { http: { port: 3081, token: 'secret' } },
  }] }))
  const ctx = new Context()
  mounted.push(await ctx.plugin(TimerService))
  mounted.push(await ctx.plugin(BaseConfig))
  mounted.push(await ctx.plugin(PluginService, { file, roots: [root], trust: true }))
  return { ctx, file, name }
}

describe('legacy config for independently installed adapters', () => {
  it('reads stored settings of a disabled untrusted package without importing its code', async () => {
    const { ctx, name } = await pluginContext()
    expect(legacyConfig(ctx).ob11).toEqual({ http: { port: 3081, token: 'secret' }, enable: false })
    expect(ctx.plugins.entrySettings(name)).toMatchObject({ enabled: false, trusted: false })
    expect(globalThis.__legacyConfigImports).toEqual([])
    const read = legacyConfig(ctx).ob11 as unknown as { http: { port: number } }
    read.http.port = 9999
    expect((ctx.plugins.entrySettings(name)!.config as { http: { port: number } }).http.port).toBe(3081)
  })

  it('combines loaded defaults with retained adapter config after the entry is disabled again', async () => {
    const { ctx, name } = await pluginContext()
    await ctx.plugins.enable('legacy01', { trust: true })
    await ctx.plugins.disable('legacy01')
    expect(legacyConfig(ctx).ob11).toEqual({
      connect: [], reportSelfMessage: false, http: { host: '127.0.0.1', port: 3081, token: 'secret' }, enable: false,
    })
    expect(ctx.plugins.builtinSettings(name)).toBeUndefined()
  })

  it('updates the migrated package entry and its switch without losing other fields or its id', async () => {
    const { ctx, file, name } = await pluginContext({ trusted: true })
    await applyLegacyConfig(ctx, { ob11: { enable: true, http: { port: 4000 } } }, { rules: false })
    expect(ctx.plugins.list().find(entry => entry.id === 'legacy01')).toMatchObject({ name, state: 'active', disabled: false })
    expect(legacyConfig(ctx).ob11).toMatchObject({ enable: true, http: { port: 4000, host: '127.0.0.1', token: 'secret' }, reportSelfMessage: false })
    await applyLegacyConfig(ctx, { ob11: { enable: false, reportSelfMessage: true } })
    expect(ctx.plugins.list().find(entry => entry.id === 'legacy01')).toMatchObject({ disabled: true, state: 'disposed' })
    const stored = JSON.parse(readFileSync(file, 'utf8')).entries[0]
    expect(stored).toMatchObject({ id: 'legacy01', name, disabled: true, config: { http: { port: 4000, token: 'secret' }, reportSelfMessage: true } })
  })

  it('does not let set_config skip trust through enable or schema loading, even with rules disabled', async () => {
    const { ctx, file } = await pluginContext()
    const before = readFileSync(file, 'utf8')
    await expect(applyLegacyConfig(ctx, { ob11: { enable: true, http: { port: 4000 } } }, { rules: false })).rejects.toBeInstanceOf(PluginTrustRequiredError)
    await expect(applyLegacyConfig(ctx, { ob11: { http: { port: 4000 } } })).rejects.toBeInstanceOf(PluginTrustRequiredError)
    expect(globalThis.__legacyConfigImports).toEqual([])
    expect(readFileSync(file, 'utf8')).toBe(before)
  })

  it('keeps a migrated missing adapter configuration readable without creating or trusting a package', async () => {
    const { ctx } = await pluginContext({ installed: false })
    expect(legacyConfig(ctx).ob11).toMatchObject({ enable: false, http: { port: 3081 } })
    expect(ctx.plugins.list()[0]).toMatchObject({ state: 'missing', disabled: true, trusted: false })
    expect(globalThis.__legacyConfigImports).toEqual([])
  })
})
