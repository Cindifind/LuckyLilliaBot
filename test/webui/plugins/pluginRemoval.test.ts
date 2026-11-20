import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PluginCard from '@/plugin/internal/service/webui/FE/components/plugins/PluginCard'
import PluginsPage from '@/plugin/internal/service/webui/FE/components/plugins/PluginsPage'
import type { PluginStatus } from '@/plugin/internal/service/webui/FE/types/plugins'

const view = vi.hoisted(() => ({ plugins: [] as PluginStatus[], prefs: { hidden: [], order: {} } }))
vi.mock('@/plugin/internal/service/webui/FE/plugin-host/pluginList', () => ({
  usePluginList: (selector: (state: typeof view) => unknown) => selector(view),
}))
vi.mock('@/plugin/internal/service/webui/FE/plugin-host/host', () => ({
  useClientErrors: (selector: (state: { errors: Record<string, string> }) => unknown) => selector({ errors: {} }),
}))
vi.mock('@/plugin/internal/service/webui/FE/components/common', () => ({ showToast: vi.fn() }))
vi.mock('@/plugin/internal/service/webui/FE/components/plugins/PluginConfigDialog', () => ({ default: () => null }))
vi.mock('@/plugin/internal/service/webui/FE/components/plugins/LocalInstallDialog', () => ({ default: () => null }))

const name = '@luckylillia/plugin-onebot11'
const missing: PluginStatus = {
  id: 'missing-onebot', name, state: 'missing', disabled: false, trusted: false,
  manifest: {}, missingDeps: [], reloadCount: 0, service: { required: [], optional: [], implements: [] },
}

beforeEach(() => { view.plugins = [missing] })

describe('missing plugin removal', () => {
  it('offers deletion for an active local plugin even without the market service', () => {
    view.plugins = [{ ...missing, name: '@luckylillia/plugin-aiprovider', state: 'active', manifest: { title: 'AI 服务' },
      removal: { path: 'D:/plugins/development-ai', kind: 'directory' } }]
    expect(renderToStaticMarkup(createElement(PluginsPage))).toContain('aria-label="卸载 AI 服务"')
  })

  it.each(['directory', 'link'] as const)('offers deletion for a managed=false local %s', kind => {
    const html = renderToStaticMarkup(createElement(PluginCard, {
      plugin: { ...missing, state: 'active', removal: { path: 'D:/plugins/development-ai', kind } },
      busy: false, onUninstall: vi.fn(),
      packageStatus: { name, version: '1.0.1', managed: false, root: 'D:/source/development-ai' },
    }))
    expect(html).toContain('本地目录')
    expect(html).toContain(`aria-label="卸载 ${name}"`)
  })

  it('shows removal from the installed list with no market or package metadata', () => {
    const html = renderToStaticMarkup(createElement(PluginsPage))
    expect(html).toContain('文件缺失')
    expect(html).toContain(`aria-label="移除 ${name}"`)
    expect(html).toMatch(/aria-label="移除 [^"]+"[^>]+aria-haspopup="dialog"/)
  })

  it.each([{ builtin: true }, { core: true }])('does not expose removal for protected entries (%j)', protection => {
    view.plugins = [{ ...missing, ...protection }]
    const html = renderToStaticMarkup(createElement(PluginCard, { plugin: view.plugins[0], busy: false, onUninstall: vi.fn() }))
    expect(html).not.toContain('aria-label="移除 ')
    expect(html).not.toContain('aria-label="卸载 ')
  })

  it('keeps the uninstall button for installed, managed third-party packages', () => {
    const html = renderToStaticMarkup(createElement(PluginCard, {
      plugin: { ...missing, state: 'disposed', disabled: true }, busy: false, onUninstall: vi.fn(),
      packageStatus: { name, version: '1.0.0', managed: true, root: `data/plugins/${name}` },
    }))
    expect(html).toContain(`aria-label="卸载 ${name}"`)
  })

  it('uses removal when market metadata still describes the missing package', () => {
    const html = renderToStaticMarkup(createElement(PluginCard, {
      plugin: missing, busy: false, onUninstall: vi.fn(),
      packageStatus: { name, version: '1.0.0', managed: true, root: `data/plugins/${name}` },
    }))
    expect(html).toContain(`aria-label="移除 ${name}"`)
    expect(html).not.toContain('aria-label="卸载 ')
  })
})
