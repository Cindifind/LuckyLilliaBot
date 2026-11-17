import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync } from 'node:fs'
import path from 'node:path'
import JSON5 from 'json5'
import { deepEqual, Dict } from 'cosmokit'
import { DATA_DIR } from '@/common/globalVars'
import { configPaths, INSTANCE_FILES, LEGACY_ACCOUNT_FILE, legacyPaths } from '@/common/configPaths'
import { DEFAULT_INSTANCE, instancesDir } from '@/common/instance'
import { JsonFile } from '@/common/jsonFile'
import { mergeNewProperties } from '@/common/utils'
import { newEntryId, PluginEntry, PluginsFile } from '../../plugin/host/store'
import { adapterDefaults } from './defaultConfig'
import { ADAPTER_ENTRIES, ADAPTER_KEYS, templateConfig, upgradeConfig } from './upgrade'

export interface MigrationLog {
  info(...args: unknown[]): void
  warn(...args: unknown[]): void
}

interface Found<T> {
  value: T
  mtimeMs: number
  /** Files (or the one directory) this came from, retired once the instances are in place. */
  sources: string[]
}

interface AccountConfig extends Found<Dict> {
  uin: string
}

/**
 * One-time move into data/instances/ (config-storage §9): the most recently used account becomes the default
 * instance, every other account whose settings differ gets one named after its QQ number, and the files all
 * accounts shared are copied into each. Built in instances.migrating/ and renamed into place at the end, so a
 * crash halfway reruns the whole migration.
 */
export function migrateToInstances(log: MigrationLog) {
  if (existsSync(instancesDir())) {
    reportLeftovers(log)
    return
  }
  const accounts = findAccounts(log).sort((a, b) => b.mtimeMs - a.mtimeMs)
  const instanceWide = readJson(log, path.join(legacyPaths.configDir(), 'global', 'settings.json'))
  const email = newest(readJson(log, legacyPaths.email()), readJson(log, path.join(legacyPaths.configDir(), 'global', 'email.json')))
  const plugins = newest(readJson(log, legacyPaths.pluginsFile()), readJson(log, path.join(legacyPaths.configDir(), 'global', 'plugins.json')))
  const token = existsSync(legacyPaths.webuiToken()) ? legacyPaths.webuiToken() : undefined
  const pluginData = existsSync(legacyPaths.pluginData()) ? legacyPaths.pluginData() : undefined
  if (!accounts.length && !instanceWide && !email && !plugins && !token && !pluginData) return

  const baseline = accounts[0] ?? (instanceWide && { ...instanceWide, uin: '' })
  const instances: { name: string; settings?: Dict; from?: string }[] = [
    { name: DEFAULT_INSTANCE, settings: baseline?.value, from: accounts[0]?.uin },
  ]
  for (const account of accounts.slice(1)) {
    if (deepEqual(normalize(account.value), normalize(baseline!.value))) {
      log.info(`QQ ${account.uin} 的配置和最近使用的 QQ ${baseline!.uin} 相同，以后用实例 ${DEFAULT_INSTANCE}`)
    } else {
      instances.push({ name: account.uin, settings: account.value, from: account.uin })
    }
  }

  const staging = `${instancesDir()}.migrating`
  rmSync(staging, { recursive: true, force: true })
  for (const { name, settings } of instances) {
    const dir = path.join(staging, name)
    mkdirSync(dir, { recursive: true })
    if (settings) writeJson(path.join(dir, INSTANCE_FILES.settings), settings)
    if (email) writeJson(path.join(dir, INSTANCE_FILES.email), email.value)
    writeJson(path.join(dir, INSTANCE_FILES.plugins), keepLoginMethod(plugins?.value))
    if (token) copyFileSync(token, path.join(dir, INSTANCE_FILES.webuiToken))
  }
  if (pluginData) renameSync(pluginData, path.join(staging, DEFAULT_INSTANCE, INSTANCE_FILES.pluginData))
  renameSync(staging, instancesDir())

  const sources = new Set([
    ...accounts.flatMap(account => account.sources),
    ...(instanceWide?.sources ?? []),
    ...(email?.sources ?? []),
    ...(plugins?.sources ?? []),
    ...(token ? [token] : []),
  ])
  // The unreleased layout goes as a whole, whatever in it was not carried over (the per-account overrides)
  const configDir = legacyPaths.configDir()
  if (existsSync(configDir)) {
    for (const source of [...sources]) if (source.startsWith(configDir + path.sep)) sources.delete(source)
    sources.add(configDir)
  }
  for (const source of sources) retire(source)

  for (const { name, from } of instances) {
    const what = from ? `QQ ${from} 的配置` : '没有登录过的旧配置'
    log.info(`已把${what}迁到实例 ${name}（data/instances/${name}/）`)
    if (name !== DEFAULT_INSTANCE) log.info(`QQ ${name} 的配置和 ${DEFAULT_INSTANCE} 不同，单独放在实例 ${name}：用 -q ${name} 或 --instance ${name} 启动就会用它`)
  }
  log.info('登录方式沿用旧版的纯协议 · Linux，可以在 WebUI 的「NTQQ 协议」页更改')
  log.info(`旧配置文件已改名为 *.bak：${[...sources].map(source => path.relative(DATA_DIR, source)).join('、')}`)
}

/**
 * Released versions logged in with the pure protocol on Linux unless launched otherwise. The NT protocol plugin
 * defaults to the official QQ client bridge and macOS since 2026-11-02, so an upgraded install gets the old ones
 * written into its entry (launch flags still win). An entry the unreleased layout already had stays as it is,
 * and so does a file that has no entry list to add to.
 */
function keepLoginMethod(plugins: Dict | undefined): Dict {
  if (plugins && !Array.isArray(plugins.entries)) return plugins
  const file = (plugins ?? { version: 1, entries: [] }) as unknown as PluginsFile
  if (!file.entries.some(entry => entry?.name === 'builtin:nt-protocol' || entry?.name === '@luckylillia/plugin-nt-protocol')) {
    const id = newEntryId(new Set(file.entries.map(entry => entry?.id)))
    file.entries.push({ id, name: 'builtin:nt-protocol', config: { mode: 'direct', protocol: 'linux' } })
  }
  return file as unknown as Dict
}

/**
 * Moves what the bot's own files still hold for the builtins into the current instance's plugins.json: the
 * adapters' sections of settings.json, whose `enable` becomes the entry switch, and email.json. Runs at every
 * start, so a section something writes there later (an old desktop app, a hand edit) is taken over as well.
 */
export function liftBuiltinSettings(log: MigrationLog) {
  const settingsFile = configPaths.settings()
  const emailFile = configPaths.email()
  const pluginsFile = configPaths.plugins()
  const settings = readJson(log, settingsFile)?.value
  const sections = ADAPTER_KEYS.filter(key => settings?.[key] !== undefined)
  const email = readJson(log, emailFile)?.value
  if (!sections.length && !email) return
  const plugins = readJson(log, pluginsFile)?.value as PluginsFile | undefined
  if (existsSync(pluginsFile) && !Array.isArray(plugins?.entries)) {
    log.warn(`${path.relative(DATA_DIR, pluginsFile)} 读不出来，内置插件的设置先不搬，修好后下次启动再搬`)
    return
  }
  const file: PluginsFile = plugins ?? { version: 1, entries: [] }
  // An ob11 section from before connections were a list is converted first
  const upgraded = upgradeConfig(structuredClone(settings ?? {})) as unknown as Dict
  for (const key of sections) {
    const { enable, ...config } = upgraded[key] as Dict
    setEntry(file, ADAPTER_ENTRIES[key], config, enable ?? adapterDefaults[key].enable)
    delete settings![key]
  }
  if (email) {
    const { enabled, ...config } = email
    setEntry(file, '@luckylillia/plugin-ntqq-offline-email', config, !!enabled)
  }
  writeJson(pluginsFile, file as unknown as Dict)
  if (sections.length) writeJson(settingsFile, settings!)
  if (email) retire(emailFile)
  const moved = [...sections, ...(email ? ['email'] : [])]
  log.info(`内置插件的设置（${moved.join('、')}）已从实例的 settings.json / email.json 搬进 plugins.json`)
}

/**
 * The NT protocol plugin's login method by its NativeQQ names (2026-11-02): the official QQ client bridge was mode
 * `pmhq`, its settings the key `pmhq`. Runs at every start, under the instance lock like the rest.
 */
export function renameNativeQQSettings(log: MigrationLog) {
  const pluginsFile = configPaths.plugins()
  const plugins = readJson(log, pluginsFile)?.value as PluginsFile | undefined
  if (!Array.isArray(plugins?.entries)) return
  const config = plugins.entries.find(item => item?.name === 'builtin:nt-protocol' || item?.name === '@luckylillia/plugin-nt-protocol')?.config as Dict | undefined
  if (!config || typeof config !== 'object' || (config.mode !== 'pmhq' && !('pmhq' in config))) return
  if (config.mode === 'pmhq') config.mode = 'nativeqq'
  if ('pmhq' in config) {
    config.nativeQQ ??= config.pmhq
    delete config.pmhq
  }
  writeJson(pluginsFile, plugins as unknown as Dict)
  log.info('NTQQ 协议的登录方式设置已改用 NativeQQ 的名字')
}

export const EXTRACTED_PLUGINS: Readonly<Record<string, string>> = {
  'builtin:nt-protocol': '@luckylillia/plugin-nt-protocol',
  'builtin:onebot11': '@luckylillia/plugin-onebot11',
  'builtin:milky': '@luckylillia/plugin-milky',
  'builtin:email-notification': '@luckylillia/plugin-ntqq-offline-email',
  'builtin:webqq': '@luckylillia/plugin-webqq',
}

/** NTQQ messaging is owned by the protocol package now; the old core entry has no independent settings. */
export function migrateNTQQMessaging(log: MigrationLog) {
  const file = configPaths.plugins()
  const data = readJson(log, file)?.value as PluginsFile | undefined
  if (!Array.isArray(data?.entries)) return
  const retired = 'builtin:ntqq-universal'
  let changed = false
  const removedIds = new Set<string>()
  const keep = (entry: PluginEntry) => {
    if (entry?.name !== retired) return true
    removedIds.add(entry.id)
    changed = true
    return false
  }
  data.entries = data.entries.filter(keep)
  if (Array.isArray(data.retained)) data.retained = data.retained.filter(keep)
  if (Array.isArray(data.messageOrder)) data.messageOrder = data.messageOrder.filter(id => !removedIds.has(id))
  const retiredKey = (key: unknown) => typeof key === 'string' && (key === retired || key.startsWith(retired + '|'))
  if (data.ui && typeof data.ui === 'object' && !Array.isArray(data.ui)) {
    if (Array.isArray(data.ui.hidden)) data.ui.hidden = data.ui.hidden.filter(key => {
      if (!retiredKey(key)) return true
      changed = true
      return false
    })
    const order = data.ui.order
    if (order && typeof order === 'object' && !Array.isArray(order)) {
      for (const key of Object.keys(order)) {
        if (!retiredKey(key)) continue
        delete order[key]
        changed = true
      }
    }
  }
  if (!changed) return
  writeJson(file, data as unknown as Dict)
  log.info('NTQQ 消息服务已并入 NTQQ 协议插件，旧内置条目已清理')
}

/** Migrate identities only; packages are installed by the user and never receive implicit third-party trust. */
export function migrateExtractedPlugins(log: MigrationLog) {
  const file = configPaths.plugins()
  const data = readJson(log, file)?.value as PluginsFile | undefined
  if (!Array.isArray(data?.entries)) return
  const extracted = new Set(Object.values(EXTRACTED_PLUGINS))
  const entries = [...data.entries, ...(Array.isArray(data.retained) ? data.retained : [])]
    .filter(entry => entry && typeof entry.name === 'string')
  const affected = entries.filter(entry => Object.hasOwn(EXTRACTED_PLUGINS, entry.name) || extracted.has(entry.name))
  if (!affected.length) return
  let changed = false
  if (data.trusted === undefined) {
    // Keep the old host's implicit trust for pre-existing third-party packages, but not newly extracted ones.
    data.trusted = [...new Set(data.entries.filter(entry => entry && !entry.disabled && typeof entry.name === 'string').map(entry => entry.name)
      .filter(name => !name.startsWith('builtin:') && !extracted.has(name)))]
    changed = true
  }
  for (const entry of entries) {
    if (!Object.hasOwn(EXTRACTED_PLUGINS, entry.name)) continue
    entry.name = EXTRACTED_PLUGINS[entry.name]
    changed = true
  }
  const uiKey = (key: string) => {
    const split = key.indexOf('|')
    const name = split < 0 ? key : key.slice(0, split)
    return Object.hasOwn(EXTRACTED_PLUGINS, name) ? EXTRACTED_PLUGINS[name] + key.slice(name.length) : key
  }
  if (data.ui && typeof data.ui === 'object' && !Array.isArray(data.ui)) {
    if (Array.isArray(data.ui.hidden)) {
      data.ui.hidden = data.ui.hidden.map(key => {
        if (typeof key !== 'string') return key
        const renamed = uiKey(key)
        if (renamed !== key) changed = true
        return renamed
      })
    }
    const order = data.ui.order
    for (const [key, position] of Object.entries(order && typeof order === 'object' && !Array.isArray(order) ? order : {})) {
      const renamed = uiKey(key)
      if (renamed === key) continue
      if (!Object.hasOwn(order, renamed)) order[renamed] = position
      delete order[key]
      changed = true
    }
  }
  if (!changed) return
  writeJson(file, data as unknown as Dict)
  log.info('NTQQ、OneBot 11、Milky、WebQQ 和 NTQQ掉线邮件通知已改为第三方插件，原设置和实例标识已保留；请安装插件并确认信任后启用')
  for (const name of extracted) {
    const duplicates = data.entries.filter(entry => entry?.name === name && !entry.disabled)
    if (duplicates.length > 1) log.warn(`${name} 存在多个启用条目（${duplicates.map(entry => entry.id).join('、')}），配置均已保留；请在插件页选择要使用的条目并停用其他条目`)
  }
}

function setEntry(file: PluginsFile, name: string, config: unknown, enabled: boolean) {
  const previous = Object.keys(EXTRACTED_PLUGINS).find(key => EXTRACTED_PLUGINS[key] === name)
  let entry = file.entries.find(item => item?.name === name)
    ?? (previous ? file.entries.find(item => item?.name === previous) : undefined)
  if (!entry) {
    entry = { id: newEntryId(new Set(file.entries.map(item => item?.id))), name } as PluginEntry
    file.entries.push(entry)
  }
  entry.config = config
  if (enabled) delete entry.disabled
  else entry.disabled = true
}

/**
 * Each account's complete settings, from the old per-account file or from the unreleased layout. An account in
 * both had its old file migrated already: one that is back was rewritten by something that does not know the
 * new layout (an old desktop app, with its own defaults), so the unreleased layout wins.
 */
function findAccounts(log: MigrationLog): AccountConfig[] {
  const byUin = new Map<string, AccountConfig>()

  for (const name of list(DATA_DIR)) {
    const uin = LEGACY_ACCOUNT_FILE.exec(name)?.[1]
    if (!uin) continue
    const found = readJson(log, legacyPaths.account(uin))
    if (found) byUin.set(uin, { ...found, uin })
  }

  const offer = (account: AccountConfig) => {
    const legacy = byUin.get(account.uin)
    byUin.set(account.uin, { ...account, sources: [...(legacy?.sources ?? []), ...account.sources] })
  }
  const accountsDir = path.join(legacyPaths.configDir(), 'accounts')
  const instanceWide = readJson(log, path.join(legacyPaths.configDir(), 'global', 'settings.json'))
  for (const uin of list(accountsDir)) {
    if (existsSync(path.join(accountsDir, uin, 'plugins.json'))) {
      log.warn(`QQ ${uin} 的插件账号覆盖配置（data/config/accounts/${uin}/plugins.json）不再支持，没有迁移`)
    }
    const found = readJson(log, path.join(accountsDir, uin, 'settings.json'))
    if (!found) continue
    // The instance-wide part was split off into config/global/; put the account back together
    offer({ uin, value: { ...instanceWide?.value, ...found.value }, mtimeMs: found.mtimeMs, sources: found.sources })
  }
  return [...byUin.values()]
}

/** What the bot would make of these settings, so two accounts compare equal when they would behave the same. */
function normalize(config: Dict): Dict {
  const upgraded = upgradeConfig(structuredClone(config))
  mergeNewProperties(templateConfig(), upgraded)
  delete (upgraded.webui as Dict | undefined)?.token
  return upgraded
}

function newest<T>(...found: (Found<T> | undefined)[]): Found<T> | undefined {
  const present = found.filter((item): item is Found<T> => !!item)
  if (!present.length) return
  const winner = present.reduce((a, b) => (b.mtimeMs > a.mtimeMs ? b : a))
  return { ...winner, sources: present.flatMap(item => item.sources) }
}

function readJson(log: MigrationLog, file: string): Found<Dict> | undefined {
  if (!existsSync(file)) return
  try {
    return { value: JSON5.parse(readFileSync(file, 'utf8')), mtimeMs: statSync(file).mtimeMs, sources: [file] }
  } catch (e) {
    log.warn(`${path.relative(DATA_DIR, file)} 解析失败，没有迁移，原样留着：${(e as Error).message}`)
  }
}

function writeJson(file: string, value: Dict) {
  new JsonFile<Dict>(file, { defaultValue: () => ({}) }).writeSync(value)
}

function list(dir: string): string[] {
  try {
    return readdirSync(dir)
  } catch {
    return []
  }
}

/** Renames to *.bak, or *.bak.1, ... when an earlier migration already left a *.bak there. */
function retire(file: string) {
  let target = `${file}.bak`
  for (let n = 1; existsSync(target); n++) target = `${file}.bak.${n}`
  renameSync(file, target)
}

/**
 * Old files that showed up again after the migration: whatever wrote them, typically a desktop app that has
 * not been updated, does not know about instances, so their content is not used.
 */
function reportLeftovers(log: MigrationLog) {
  const leftovers = list(DATA_DIR)
    .filter(name => LEGACY_ACCOUNT_FILE.test(name))
    .map(name => path.join(DATA_DIR, name))
  for (const file of [legacyPaths.email(), legacyPaths.webuiToken(), legacyPaths.configDir()]) {
    if (existsSync(file)) leftovers.push(file)
  }
  for (const file of leftovers) {
    log.warn(`${path.relative(DATA_DIR, file)} 已不再读取（配置都在 data/instances/<实例名>/ 下），它的内容不会生效；可能是没升级的桌面端写的`)
  }
}
