import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync, utimesSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

const DATA_DIR = mkdtempSync(path.join(tmpdir(), 'llbot-migrate-'))

vi.mock('@/common/globalVars', () => ({ DATA_DIR }))

const { liftBuiltinSettings, migrateToInstances, renameNativeQQSettings, migrateExtractedPlugins, migrateNTQQMessaging } = await import('@/main/config/migrate')

const log = { info: vi.fn(), warn: vi.fn() }
const at = (...parts: string[]) => path.join(DATA_DIR, ...parts)
const read = (...parts: string[]) => JSON.parse(readFileSync(at(...parts), 'utf8'))
const instances = () => readdirSync(at('instances')).sort()

function put(file: string, content: unknown, mtime?: Date) {
  mkdirSync(path.dirname(at(file)), { recursive: true })
  writeFileSync(at(file), typeof content === 'string' ? content : JSON.stringify(content))
  if (mtime) utimesSync(at(file), mtime, mtime)
}

const older = new Date('2026-01-01')
const newer = new Date('2026-06-01')

afterAll(() => rmSync(DATA_DIR, { recursive: true, force: true }))

beforeEach(() => {
  for (const name of readdirSync(DATA_DIR)) rmSync(at(name), { recursive: true, force: true })
  log.info.mockClear()
  log.warn.mockClear()
})

describe('migrateToInstances', () => {
  const loginMethodKept = { id: expect.any(String), name: 'builtin:nt-protocol', config: { mode: 'direct', protocol: 'linux' } }

  it('leaves a fresh data directory alone', () => {
    migrateToInstances(log)
    expect(existsSync(at('instances'))).toBe(false)
  })

  it('makes the only account the default instance and keeps the old file as .bak', () => {
    put('config_1.json', { webui: { port: 3080 }, ffmpeg: '/f' })
    migrateToInstances(log)
    expect(instances()).toEqual(['default'])
    expect(read('instances', 'default', 'settings.json')).toEqual({ webui: { port: 3080 }, ffmpeg: '/f' })
    expect(existsSync(at('config_1.json'))).toBe(false)
    expect(existsSync(at('config_1.json.bak'))).toBe(true)
  })

  it('puts accounts with the same settings in one instance', () => {
    put('config_1.json', { ffmpeg: '/f' }, older)
    put('config_2.json', { ffmpeg: '/f' }, newer)
    migrateToInstances(log)
    expect(instances()).toEqual(['default'])
    expect(existsSync(at('config_1.json.bak'))).toBe(true)
  })

  it('gives an account whose settings differ an instance named after it', () => {
    put('config_1.json', { webui: { port: 3001 } }, older)
    put('config_2.json', { webui: { port: 3002 } }, newer)
    migrateToInstances(log)
    expect(instances()).toEqual(['1', 'default'])
    // the account used most recently is the default
    expect(read('instances', 'default', 'settings.json').webui.port).toBe(3002)
    expect(read('instances', '1', 'settings.json').webui.port).toBe(3001)
    expect(log.info).toHaveBeenCalledWith(expect.stringContaining('--instance 1'))
  })

  it('gives every instance its own copy of the email settings, the WebUI password and the plugin entries', () => {
    put('config_1.json', { webui: { port: 3001 } }, older)
    put('config_2.json', { webui: { port: 3002 } }, newer)
    put('email_config.json', { enabled: true, from: 'a@b.c' })
    put('webui_token.txt', 'secret')
    put('config/global/plugins.json', { version: 1, entries: [{ id: 'a1', name: 'p' }] })
    migrateToInstances(log)
    for (const name of ['default', '1']) {
      expect(read('instances', name, 'email.json')).toEqual({ enabled: true, from: 'a@b.c' })
      expect(readFileSync(at('instances', name, 'webui_token.txt'), 'utf8')).toBe('secret')
      expect(read('instances', name, 'plugins.json').entries).toEqual([{ id: 'a1', name: 'p' }, loginMethodKept])
    }
    expect(existsSync(at('email_config.json.bak'))).toBe(true)
    expect(existsSync(at('webui_token.txt.bak'))).toBe(true)
  })

  it('keeps the login method released versions had, the pure protocol on Linux, over the new defaults', () => {
    put('config_1.json', { ffmpeg: '/f' })
    migrateToInstances(log)
    expect(read('instances', 'default', 'plugins.json')).toEqual({ version: 1, entries: [loginMethodKept] })
    expect(log.info).toHaveBeenCalledWith(expect.stringContaining('纯协议 · Linux'))
  })

  it('leaves the login method of an unreleased plugins.json as it is', () => {
    put('config_1.json', { ffmpeg: '/f' })
    const entries = [{ id: 'n0000001', name: 'builtin:nt-protocol', config: { mode: 'nativeqq' } }]
    put('config/global/plugins.json', { version: 1, entries })
    migrateToInstances(log)
    expect(read('instances', 'default', 'plugins.json').entries).toEqual(entries)
  })

  it('puts the unreleased data/config/ layout back together, and retires it as a whole', () => {
    put('config/global/settings.json', { ffmpeg: '/f' })
    put('config/accounts/1/settings.json', { webui: { port: 3001 } })
    put('config/accounts/1/plugins.json', { version: 1, entries: {} })
    put('config/global/email.json', { enabled: false })
    put('plugin-data/p/shared/x.txt', 'data')
    migrateToInstances(log)
    expect(read('instances', 'default', 'settings.json')).toEqual({ ffmpeg: '/f', webui: { port: 3001 } })
    expect(read('instances', 'default', 'email.json')).toEqual({ enabled: false })
    expect(readFileSync(at('instances', 'default', 'plugin-data', 'p', 'shared', 'x.txt'), 'utf8')).toBe('data')
    expect(existsSync(at('config'))).toBe(false)
    expect(existsSync(at('config.bak', 'accounts', '1', 'plugins.json'))).toBe(true)
    // the per-account override has nowhere to go
    expect(log.warn).toHaveBeenCalledWith(expect.stringContaining('覆盖'))
  })

  it('prefers the unreleased layout over an old file that came back for the same account', () => {
    put('config/accounts/1/settings.json', { webui: { port: 3001 } }, older)
    put('config_1.json', { webui: { port: 9999 } }, newer)
    migrateToInstances(log)
    expect(read('instances', 'default', 'settings.json').webui.port).toBe(3001)
    expect(existsSync(at('config_1.json.bak'))).toBe(true)
  })

  it('runs once: later old files are reported, not imported', () => {
    put('config_1.json', { webui: { port: 3001 } })
    migrateToInstances(log)
    put('config_1.json', { webui: { port: 9999 } })
    migrateToInstances(log)
    expect(read('instances', 'default', 'settings.json').webui.port).toBe(3001)
    expect(log.warn).toHaveBeenCalledWith(expect.stringContaining('config_1.json 已不再读取'))
  })

  it('leaves a file it cannot parse where it is', () => {
    put('config_1.json', '{ broken')
    put('config_2.json', { ffmpeg: '/f' })
    migrateToInstances(log)
    expect(read('instances', 'default', 'settings.json')).toEqual({ ffmpeg: '/f' })
    expect(readFileSync(at('config_1.json'), 'utf8')).toBe('{ broken')
    expect(log.warn).toHaveBeenCalledWith(expect.stringContaining('config_1.json 解析失败'))
  })

  it('does not overwrite a backup an earlier migration left', () => {
    put('config_1.json.bak', { earlier: true })
    put('config_1.json', { ffmpeg: '/f' })
    migrateToInstances(log)
    expect(read('config_1.json.bak')).toEqual({ earlier: true })
    expect(read('config_1.json.bak.1')).toEqual({ ffmpeg: '/f' })
  })

  it('starts over when a previous run died halfway', () => {
    put('instances.migrating/default/settings.json', { half: true })
    put('config_1.json', { ffmpeg: '/f' })
    migrateToInstances(log)
    expect(read('instances', 'default', 'settings.json')).toEqual({ ffmpeg: '/f' })
    expect(existsSync(at('instances.migrating'))).toBe(false)
  })
})

describe('liftBuiltinSettings', () => {
  const entry = (name: string) => read('instances', 'default', 'plugins.json').entries.find((item: { name: string }) => item.name === name)

  it('moves the adapters\' sections into their plugin entries, `enable` becoming the switch', () => {
    put('instances/default/settings.json', {
      log: true,
      satori: { enable: true, host: '127.0.0.1', port: 5700, token: 't' },
      milky: { enable: false, http: { port: 3011 } },
      // from before connections were a list: converted on the way
      ob11: { enable: true, enableWs: true, wsPort: 3100 },
    })
    liftBuiltinSettings(log)
    expect(read('instances', 'default', 'settings.json')).toEqual({ log: true })
    expect(entry('builtin:satori')).toMatchObject({ config: { host: '127.0.0.1', port: 5700, token: 't' } })
    expect(entry('builtin:satori').disabled).toBeUndefined()
    expect(entry('@luckylillia/plugin-milky')).toMatchObject({ disabled: true, config: { http: { port: 3011 } } })
    expect(entry('@luckylillia/plugin-onebot11').config.connect[0]).toMatchObject({ type: 'ws', enable: true, port: 3100 })
  })

  it('moves email.json into its entry and keeps the file as .bak', () => {
    put('instances/default/email.json', { enabled: true, from: 'a@b.c' })
    put('instances/default/plugins.json', { version: 1, entries: [{ id: 'p0000001', name: 'p' }] })
    liftBuiltinSettings(log)
    expect(entry('@luckylillia/plugin-ntqq-offline-email')).toMatchObject({ config: { from: 'a@b.c' } })
    expect(entry('@luckylillia/plugin-ntqq-offline-email').disabled).toBeUndefined()
    expect(entry('p')).toEqual({ id: 'p0000001', name: 'p' })
    expect(existsSync(at('instances', 'default', 'email.json'))).toBe(false)
    expect(existsSync(at('instances', 'default', 'email.json.bak'))).toBe(true)
  })

  it('overwrites an existing entry\'s settings with a section written later', () => {
    put('instances/default/plugins.json', { version: 1, entries: [{ id: 's0000001', name: 'builtin:satori', config: { port: 1 }, disabled: true }] })
    put('instances/default/settings.json', { satori: { enable: true, port: 2 } })
    liftBuiltinSettings(log)
    expect(entry('builtin:satori')).toEqual({ id: 's0000001', name: 'builtin:satori', config: { port: 2 } })
  })

  it('leaves everything alone while plugins.json cannot be read', () => {
    put('instances/default/plugins.json', '{ broken')
    put('instances/default/settings.json', { satori: { enable: true } })
    liftBuiltinSettings(log)
    expect(read('instances', 'default', 'settings.json')).toEqual({ satori: { enable: true } })
    expect(readFileSync(at('instances', 'default', 'plugins.json'), 'utf8')).toBe('{ broken')
  })

  it('does nothing when there is nothing to move', () => {
    put('instances/default/settings.json', { log: true })
    liftBuiltinSettings(log)
    expect(existsSync(at('instances', 'default', 'plugins.json'))).toBe(false)
  })
})

describe('renameNativeQQSettings', () => {
  const entry = () => read('instances', 'default', 'plugins.json').entries[0]

  it('gives the official QQ client bridge its NativeQQ names', () => {
    put('instances/default/plugins.json', {
      version: 1,
      entries: [{ id: 'n0000001', name: 'builtin:nt-protocol', config: { mode: 'pmhq', pmhq: { configPath: '/qq.json', qqPath: '' } } }],
    })
    renameNativeQQSettings(log)
    expect(entry()).toEqual({ id: 'n0000001', name: 'builtin:nt-protocol', config: { mode: 'nativeqq', nativeQQ: { configPath: '/qq.json', qqPath: '' } } })
    expect(log.info).toHaveBeenCalledTimes(1)
  })

  it('takes the old key alone too, and leaves new settings and other entries alone', () => {
    put('instances/default/plugins.json', {
      version: 1,
      entries: [{ id: 'n0000001', name: 'builtin:nt-protocol', config: { protocol: 'macos', pmhq: { qqPath: '/QQ' } } }],
    })
    renameNativeQQSettings(log)
    expect(entry().config).toEqual({ protocol: 'macos', nativeQQ: { qqPath: '/QQ' } })
    const written = readFileSync(at('instances', 'default', 'plugins.json'), 'utf8')
    renameNativeQQSettings(log)
    expect(readFileSync(at('instances', 'default', 'plugins.json'), 'utf8')).toBe(written)
    expect(log.info).toHaveBeenCalledTimes(1)
  })

  it('does nothing without plugins.json, or with one it cannot read', () => {
    renameNativeQQSettings(log)
    expect(existsSync(at('instances', 'default', 'plugins.json'))).toBe(false)
    put('instances/default/plugins.json', '{ broken')
    renameNativeQQSettings(log)
    expect(readFileSync(at('instances', 'default', 'plugins.json'), 'utf8')).toBe('{ broken')
  })
})

describe('migrateNTQQMessaging', () => {
  it('removes retired core entries and their layout references without changing protocol settings or trust', () => {
    const protocol = { id: 'nt000001', name: '@luckylillia/plugin-nt-protocol', config: { autoLoginUin: '123' }, disabled: true }
    put('instances/default/plugins.json', { version: 1, entries: [
      { id: 'bridge', name: 'builtin:ntqq-universal' }, protocol, { id: 'other', name: 'some-plugin' },
    ], retained: [{ id: 'retained', name: 'builtin:ntqq-universal' }], trusted: ['some-plugin'],
    messageOrder: ['bridge', 'nt000001', 'other', 'retained'], ui: {
      hidden: ['builtin:ntqq-universal|page|legacy', 'some-plugin|page|main'],
      order: { 'builtin:ntqq-universal|page|legacy': 1, 'some-plugin|page|main': 2 },
    } })
    migrateNTQQMessaging(log)
    expect(read('instances', 'default', 'plugins.json')).toEqual({ version: 1,
      entries: [protocol, { id: 'other', name: 'some-plugin' }], retained: [], trusted: ['some-plugin'],
      messageOrder: ['nt000001', 'other'], ui: { hidden: ['some-plugin|page|main'], order: { 'some-plugin|page|main': 2 } },
    })
    migrateNTQQMessaging(log)
    expect(log.info).toHaveBeenCalledTimes(1)
  })

  it('does not create or enable a protocol entry when retiring the only NTQQ messaging entry', () => {
    put('instances/default/plugins.json', { version: 1, entries: [{ id: 'old', name: 'builtin:ntqq-universal' }] })
    migrateNTQQMessaging(log)
    expect(read('instances', 'default', 'plugins.json')).toEqual({ version: 1, entries: [] })
  })

  it.each([{}, { hidden: null, order: null }, { hidden: [null], order: [] }])('tolerates partial layout preferences: %j', ui => {
    put('instances/default/plugins.json', { version: 1, entries: [null, {}, { id: 'old', name: 'builtin:ntqq-universal' }], ui })
    expect(() => migrateNTQQMessaging(log)).not.toThrow()
    expect(read('instances', 'default', 'plugins.json').entries).toEqual([null, {}])
  })
})

describe('migrateExtractedPlugins', () => {
  it('migrates WebQQ preferences, retained entries and slots without changing the entry switch or trust', () => {
    put('instances/default/plugins.json', { version: 1, entries: [
      { id: 'webqq', name: 'builtin:webqq', config: { autoHideSidebar: true, fullscreenButton: false } },
    ], retained: [{ id: 'saved-webqq', name: 'builtin:webqq', disabled: true, config: { autoHideSidebar: false } }],
    messageOrder: ['webqq'], ui: { hidden: ['builtin:webqq|page|webqq'], order: { 'builtin:webqq|page|webqq': 30 } } })
    migrateExtractedPlugins(log)
    const file = read('instances', 'default', 'plugins.json')
    expect(file.entries[0]).toEqual({ id: 'webqq', name: '@luckylillia/plugin-webqq', config: { autoHideSidebar: true, fullscreenButton: false } })
    expect(file.retained[0]).toMatchObject({ id: 'saved-webqq', name: '@luckylillia/plugin-webqq', disabled: true })
    expect(file.trusted).toEqual([])
    expect(file.messageOrder).toEqual(['webqq'])
    expect(file.ui).toEqual({ hidden: ['@luckylillia/plugin-webqq|page|webqq'], order: { '@luckylillia/plugin-webqq|page|webqq': 30 } })
    migrateExtractedPlugins(log)
    expect(log.info).toHaveBeenCalledTimes(1)
  })

  it('migrates NTQQ offline email settings, secrets and retained entries without granting trust', () => {
    const smtp = { host: 'smtp.example.com', port: 465, secure: true, auth: { user: 'bot', pass: 'preserved-secret' } }
    put('instances/default/plugins.json', { version: 1, entries: [
      { id: 'mail', name: 'builtin:email-notification', config: { smtp, from: 'a@b.c', to: 'd@e.f' }, scope: { platforms: ['ntqq'] } },
    ], retained: [{ id: 'saved', name: 'builtin:email-notification', disabled: true, config: { smtp } }],
    messageOrder: ['mail'], ui: { hidden: ['builtin:email-notification|page|email'], order: { 'builtin:email-notification|page|email': 13 } } })
    migrateExtractedPlugins(log)
    const file = read('instances', 'default', 'plugins.json')
    expect(file.entries[0]).toEqual({ id: 'mail', name: '@luckylillia/plugin-ntqq-offline-email', config: { smtp, from: 'a@b.c', to: 'd@e.f' }, scope: { platforms: ['ntqq'] } })
    expect(file.retained[0]).toMatchObject({ id: 'saved', name: '@luckylillia/plugin-ntqq-offline-email', disabled: true, config: { smtp } })
    expect(file.trusted).toEqual([])
    expect(file.messageOrder).toEqual(['mail'])
    expect(file.ui).toEqual({ hidden: ['@luckylillia/plugin-ntqq-offline-email|page|email'], order: { '@luckylillia/plugin-ntqq-offline-email|page|email': 13 } })
    migrateExtractedPlugins(log)
    expect(log.info).toHaveBeenCalledTimes(1)
  })

  it('lifts legacy email.json into the existing email entry without losing its ID or password', () => {
    put('instances/default/plugins.json', { version: 1, trusted: [], entries: [{ id: 'mail-id', name: 'builtin:email-notification', disabled: true }] })
    put('instances/default/email.json', { enabled: true, smtp: { host: 'smtp.test', auth: { pass: 'secret' } }, from: 'a@b.c' })
    liftBuiltinSettings(log)
    migrateExtractedPlugins(log)
    expect(read('instances', 'default', 'plugins.json')).toMatchObject({ trusted: [], entries: [
      { id: 'mail-id', name: '@luckylillia/plugin-ntqq-offline-email', config: { smtp: { auth: { pass: 'secret' } }, from: 'a@b.c' } },
    ] })
    expect(read('instances', 'default', 'plugins.json').entries[0].disabled).toBeUndefined()
  })

  it('keeps entry identities, account settings, scope and UI positions without implicitly trusting the extracted packages', () => {
    put('instances/default/plugins.json', { version: 1, entries: [
      { id: 'nt000001', name: 'builtin:nt-protocol', config: { autoLoginUin: '123' }, disabled: true, scope: { platforms: ['ntqq'] } },
      { id: 'external', name: 'third-party' },
      { id: 'untrusted', name: 'disabled-third-party', disabled: true },
    ], retained: [{ id: 'ob000001', name: 'builtin:onebot11', config: { port: 3001 } }],
    messageOrder: ['nt000001', 'external'], ui: { hidden: ['builtin:nt-protocol|page|ntqq'], order: {
      'builtin:onebot11|page|onebot11': 1, '@luckylillia/plugin-onebot11|page|onebot11': 2,
    } } })
    migrateExtractedPlugins(log)
    const file = read('instances', 'default', 'plugins.json')
    expect(file.entries[0]).toEqual({ id: 'nt000001', name: '@luckylillia/plugin-nt-protocol', config: { autoLoginUin: '123' }, disabled: true, scope: { platforms: ['ntqq'] } })
    expect(file.retained[0]).toMatchObject({ id: 'ob000001', name: '@luckylillia/plugin-onebot11', config: { port: 3001 } })
    expect(file.messageOrder).toEqual(['nt000001', 'external'])
    expect(file.trusted).toEqual(['third-party'])
    expect(file.ui).toEqual({ hidden: ['@luckylillia/plugin-nt-protocol|page|ntqq'], order: { '@luckylillia/plugin-onebot11|page|onebot11': 2 } })
    migrateExtractedPlugins(log)
    expect(log.info).toHaveBeenCalledTimes(1)
  })

  it('lifts new desktop settings into the existing builtin entry before renaming it', () => {
    put('instances/default/plugins.json', { version: 1, entries: [{ id: 'old-id', name: 'builtin:onebot11', disabled: true, config: { connect: [] } }] })
    put('instances/default/settings.json', { ob11: { enable: true, enableWs: true, wsPort: 3100 } })
    liftBuiltinSettings(log)
    migrateExtractedPlugins(log)
    const entries = read('instances', 'default', 'plugins.json').entries
    expect(entries).toHaveLength(1)
    expect(entries[0]).toMatchObject({ id: 'old-id', name: '@luckylillia/plugin-onebot11' })
    expect(entries[0].disabled).toBeUndefined()
    expect(entries[0].config.connect[0]).toMatchObject({ type: 'ws', enable: true, port: 3100 })
  })

  it.each([{}, { hidden: ['builtin:nt-protocol|page|ntqq', null] }, { order: { 'builtin:nt-protocol|page|ntqq': 1 } }, { hidden: 'invalid', order: null }])('does not fail on partial UI preferences or unrelated invalid entries: %j', (ui) => {
    put('instances/default/plugins.json', { version: 1, entries: [null, {}, 1, { id: 'nt', name: 'builtin:nt-protocol' }], retained: [null], ui })
    expect(() => migrateExtractedPlugins(log)).not.toThrow()
    expect(read('instances', 'default', 'plugins.json').entries).toEqual([null, {}, 1, { id: 'nt', name: '@luckylillia/plugin-nt-protocol' }])
  })

  it('keeps explicitly granted trust and separate old/new entries without deleting either configuration', () => {
    put('instances/default/plugins.json', { version: 1, trusted: ['@luckylillia/plugin-milky'], entries: [
      { id: 'old', name: 'builtin:milky', config: { port: 1 } },
      { id: 'new', name: '@luckylillia/plugin-milky', config: { port: 2 } },
    ] })
    migrateExtractedPlugins(log)
    expect(read('instances', 'default', 'plugins.json')).toMatchObject({ trusted: ['@luckylillia/plugin-milky'], entries: [
      { id: 'old', name: '@luckylillia/plugin-milky', config: { port: 1 } },
      { id: 'new', name: '@luckylillia/plugin-milky', config: { port: 2 } },
    ] })
    expect(log.warn).toHaveBeenCalledWith(expect.stringContaining('多个启用条目'))
  })
})
