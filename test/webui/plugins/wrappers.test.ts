import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, expect, it, vi } from 'vitest'
import { useRegistry, type Contribution } from '@/plugin/internal/service/webui/FE/plugin-host/registry'
import { usePluginList } from '@/plugin/internal/service/webui/FE/plugin-host/pluginList'
import { PluginPage, SlotOutlet } from '@/plugin/internal/service/webui/FE/plugin-host/views'
import type { PluginStatus } from '@/plugin/internal/service/webui/FE/types/plugins'

vi.mock('@/plugin/internal/service/webui/FE/components/common', () => ({ showToast: () => {} }))
// SSR normally reads Zustand's initial snapshot. These render assertions deliberately use the current registry.
vi.mock('@/plugin/internal/service/webui/FE/plugin-host/registry', async importOriginal => {
  const actual = await importOriginal<typeof import('@/plugin/internal/service/webui/FE/plugin-host/registry')>()
  return { ...actual, useRegistry: Object.assign((selector: any) => selector(actual.useRegistry.getState()), actual.useRegistry) }
})
vi.mock('@/plugin/internal/service/webui/FE/plugin-host/pluginList', async importOriginal => {
  const actual = await importOriginal<typeof import('@/plugin/internal/service/webui/FE/plugin-host/pluginList')>()
  return { ...actual, usePluginList: Object.assign((selector: any) => selector(actual.usePluginList.getState()), actual.usePluginList) }
})
const original = useRegistry.getState().contributions
afterEach(() => { useRegistry.setState({ contributions: original }); usePluginList.setState({ plugins: null }) })

it('renders hoc children from the outside in and keeps locked management pages outside wrappers', () => {
  const wrap = (id: string, order: number): Contribution => ({
    kind: 'slot', owner: 'theme', slot: 'page.content', id, order, priority: 0, options: {},
    component: ({ children }) => h('section', { 'data-wrapper': id }, children),
  })
  useRegistry.setState({ contributions: [...original, wrap('outer', 1), wrap('inner', 2)] })
  usePluginList.setState({ plugins: [{ id: 'theme', name: 'theme', state: 'active', disabled: false }] as PluginStatus[] })
  const page = { kind: 'page' as const, owner: 'theme', key: 'theme:preview', title: 'Preview', order: 0, settings: false, component: () => h('b', null, 'content') }
  expect(renderToStaticMarkup(h(SlotOutlet, { name: 'page.content' }, h('b', null, 'content'))))
    .toBe('<section data-wrapper="outer"><section data-wrapper="inner"><b>content</b></section></section>')
  expect(renderToStaticMarkup(h(PluginPage, { page }))).toContain('data-wrapper="outer"')
  expect(renderToStaticMarkup(h(PluginPage, { page: { ...page, locked: true } }))).toBe('<b>content</b>')
})
