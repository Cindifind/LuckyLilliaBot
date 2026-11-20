import { describe, expect, it } from 'vitest'
import { adapterDefaults } from '@/main/config/defaultConfig'
import { SatoriSchema, satoriSettings } from '@/plugin/internal/adapter/satori/settings'
import { ADAPTER_ENTRIES, templateSection, upgradeConfig } from '@/main/config/upgrade'
import defaultConfigFile from '@/main/config/default_config.json'

// The entry switch replaced each section's `enable`
const withoutEnable = <T extends { enable: boolean }>({ enable: _enable, ...rest }: T) => rest

describe('Satori settings', () => {
  it('has schema defaults equal to defaultConfig.ts', () => {
    expect(new SatoriSchema()).toEqual(withoutEnable(adapterDefaults.satori))
  })

  it('starts a new entry from default_config.json, its enable being the entry switch', () => {
    expect(satoriSettings.initial!()).toEqual({ enabled: defaultConfigFile.satori.enable, config: withoutEnable(defaultConfigFile.satori) })
  })

  it('requires a token for a public listener, only while it runs', () => {
    const open = { host: '', port: 5600, token: '' }
    expect(satoriSettings.check!(open, true)).toEqual([{ path: ['token'], message: 'Satori 监听全部地址时必须设置 Token' }])
    expect(satoriSettings.check!(open, false)).toEqual([])
    expect(satoriSettings.checkOnEnable).toBe(true)
  })
})

describe('configuration compatibility for extracted adapters', () => {
  it('targets independently installed OneBot and Milky packages while keeping Satori builtin', () => {
    expect(ADAPTER_ENTRIES).toEqual({ ob11: '@luckylillia/plugin-onebot11', milky: '@luckylillia/plugin-milky', satori: 'builtin:satori' })
  })

  it('keeps legacy template sections available without importing optional adapter implementations', () => {
    expect(templateSection('ob11')).toEqual(defaultConfigFile.ob11)
    expect(templateSection('milky')).toEqual(defaultConfigFile.milky)
  })

  it('still upgrades the desktop legacy OneBot connection flags for entry migration', () => {
    const upgraded = upgradeConfig({ ob11: { enable: true, enableWs: true, wsPort: 3100, token: 'retained' } })
    expect((upgraded as unknown as { ob11: { connect: object[] } }).ob11.connect[0]).toMatchObject({ type: 'ws', enable: true, port: 3100, token: 'retained' })
  })
})
