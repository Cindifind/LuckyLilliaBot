import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ThemeDefinition } from '@luckylillia/plugin-sdk/webui'
import type { PluginStatus } from '@/plugin/internal/service/webui/FE/types/plugins'

const storage = vi.hoisted(() => {
  const values = new Map<string, string>()
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) }, removeItem: (key: string) => { values.delete(key) } }
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage })
  return storage
})
vi.mock('@/plugin/internal/service/webui/FE/components/common', () => ({ showToast: () => {} }))

import { getTheme, installThemeRuntime, overrideTokens, registerStyle, registerTheme, themeStyles, useThemes } from '@/plugin/internal/service/webui/FE/plugin-host/themes'
import { useThemeStore } from '@/plugin/internal/service/webui/FE/stores/themeStore'
import { usePluginList } from '@/plugin/internal/service/webui/FE/plugin-host/pluginList'
import { createWebUIContext } from '@/plugin/internal/service/webui/FE/plugin-host/context'

const definition = (): ThemeDefinition => ({
  id: 'ocean', title: '海洋',
  light: { tokens: { '--accent': '#008899', '--text-primary': '#102030' }, background: '#e0f5ff' },
  dark: { tokens: { '--accent': '#55ccff', '--text-primary': '#d0e5ff' }, background: '#102030' },
  css: '.theme-proof { border-radius: 0 }',
})
const plugin = (name: string, state: PluginStatus['state'] = 'active', id = name): PluginStatus => ({
  id, name, disabled: state === 'disposed', state, manifest: {}, missingDeps: [], reloadCount: 0,
  service: { required: [], optional: [], implements: [] },
})

/** The DOM operations the style runtime uses, including moving an existing node to the end. */
function documentStub() {
  const children: any[] = []
  const head = { append(node: any) { node.remove(); children.push(node) }, get lastElementChild() { return children.at(-1) } }
  const root = { dataset: {} as Record<string, string>, classList: { add: vi.fn(), remove: vi.fn() } }
  return { children, root, document: { head, documentElement: root, createElement: () => ({
    dataset: {} as Record<string, string>, textContent: '',
    remove() { const index = children.indexOf(this); if (index >= 0) children.splice(index, 1) },
  }) } }
}

beforeEach(() => {
  useThemes.setState({ themes: [], layers: [], styles: [] })
  usePluginList.setState({ plugins: [plugin('theme'), plugin('addon')] })
  useThemeStore.setState({ mode: 'light', isDark: false, selected: 'default' })
})
afterEach(() => vi.unstubAllGlobals())

describe('plugin themes and managed styles', () => {
  it('keeps the preference while loading or disabled and resumes when any instance runs', () => {
    useThemeStore.getState().select('theme|ocean')
    expect(getTheme().active).toBe('default')
    registerTheme('theme', definition())
    expect(getTheme()).toMatchObject({ active: 'theme|ocean', background: '#e0f5ff' })
    usePluginList.setState({ plugins: [plugin('theme', 'pending')] })
    expect(getTheme()).toMatchObject({ selected: 'theme|ocean', active: 'default' })
    usePluginList.setState({ plugins: [plugin('theme', 'disposed'), plugin('theme', 'active', 'second')] })
    expect(getTheme().active).toBe('theme|ocean')
    usePluginList.setState({ plugins: [] })
    expect(getTheme().active).toBe('default')
    expect(JSON.parse(storage.getItem('llbot-theme')!).state.selected).toBe('theme|ocean')
  })

  it('clones, validates and unregisters a definition without damaging a later registration', () => {
    const input = definition()
    const dispose = registerTheme('theme', input)
    input.light.tokens['--accent'] = 'red'
    useThemeStore.getState().select('theme|ocean')
    expect(themeStyles()).toContain('--accent:#008899;')
    expect(() => registerTheme('theme', definition())).toThrow('already registered')
    dispose()
    registerTheme('theme', definition())
    dispose()
    expect(getTheme().active).toBe('theme|ocean')
    for (const bad of [{ color: 'red' }, { '--accent': 'red;}body{display:none' }]) {
      expect(() => registerTheme('theme', { ...definition(), id: 'bad', light: { tokens: bad } })).toThrow('Invalid theme token')
    }
    expect(useThemes.getState().themes).toHaveLength(1)
  })

  it('stacks overrides, removes only the matching layer and respects owner state', () => {
    registerTheme('theme', definition())
    useThemeStore.getState().select('theme|ocean')
    const old = overrideTokens('addon', 'accent', { light: { '--accent': 'red' }, dark: { '--accent': 'pink' } })
    const newer = overrideTokens('addon', 'accent', { light: { '--accent': 'green' }, dark: { '--accent': 'lime' } })
    old()
    expect(themeStyles()).toContain(':root[data-llbot-theme]{--accent:green;')
    expect(themeStyles()).toContain('.glass-on-dark{--accent:lime;')
    useThemeStore.setState({ isDark: true })
    expect(themeStyles()).toContain(':root[data-llbot-theme]{--accent:lime;')
    expect(getTheme().background).toBe('#102030')
    usePluginList.setState({ plugins: [plugin('theme'), plugin('addon', 'failed')] })
    expect(themeStyles()).not.toContain('--accent:lime;')
    usePluginList.setState({ plugins: [plugin('theme'), plugin('addon')] })
    newer()
    expect(themeStyles()).toContain('--accent:#55ccff;')
  })

  it('applies and removes DOM styles on owner state changes even while the module is retained', () => {
    const dom = documentStub()
    vi.stubGlobal('document', dom.document)
    const stop = installThemeRuntime()
    const dispose = registerStyle('addon', 'widget', '.widget{color:red}')
    registerTheme('theme', definition())
    useThemeStore.getState().select('theme|ocean')
    expect(dom.root.dataset.llbotTheme).toBe('theme|ocean')
    expect(dom.children.map(n => n.dataset.plugin)).toEqual(['addon', undefined])
    usePluginList.setState({ plugins: [plugin('theme', 'disposed'), plugin('addon', 'disposed')] })
    expect(dom.root.dataset.llbotTheme).toBe('default')
    expect(dom.children).toHaveLength(1)
    expect(dom.children[0].textContent).not.toContain('.theme-proof')
    usePluginList.setState({ plugins: [plugin('theme'), plugin('addon')] })
    expect(dom.children).toHaveLength(2)
    dispose()
    expect(dom.children).toHaveLength(1)
    stop()
    expect(dom.children).toHaveLength(0)
    expect(dom.root.dataset.llbotTheme).toBeUndefined()
  })

  it('tracks context effects for rollback and resolves module-local asset paths', () => {
    vi.stubGlobal('window', { location: { href: 'http://localhost:3080/' } })
    const effects: (() => void)[] = []
    const ctx = createWebUIContext('theme', false, dispose => effects.push(dispose), '/plugin-webui/theme/client/index.js?v=1')
    ctx.theme.register(definition())
    ctx.style('component', '.custom{color:blue}')
    ctx.theme.overrideTokens('accent', { light: { '--accent': 'red' }, dark: {} })
    ctx.theme.select('ocean')
    expect(ctx.theme.get().active).toBe('theme|ocean')
    expect(ctx.asset('images/background.webp')).toBe('http://localhost:3080/plugin-webui/theme/client/images/background.webp')
    const scoped = createWebUIContext('@author/theme', false, dispose => effects.push(dispose), '/plugin-webui/%40author%2Btheme/0/client/index.js')
    expect(scoped.asset('images/background.webp')).toBe('http://localhost:3080/plugin-webui/%40author%2Btheme/0/client/images/background.webp')
    for (const path of ['../secret', '%2e%2e/secret', '%2e%2e%2fsecret', '//example.com/image', 'https://example.com/image', 'images\\image']) {
      expect(() => ctx.asset(path)).toThrow()
    }
    effects.reverse().forEach(dispose => dispose())
    expect(useThemes.getState()).toMatchObject({ themes: [], layers: [], styles: [] })
    expect(getTheme().active).toBe('default')
    expect(getTheme().selected).toBe('theme|ocean')
  })

  it('keeps scoped component CSS for disabled settings, isolated from the shell, until module cleanup', () => {
    const dom = documentStub()
    vi.stubGlobal('document', dom.document)
    const stop = installThemeRuntime()
    const old = registerStyle('addon', 'utilities', ':root,:host{--color-red:red}.flex{display:flex}', { scope: 'plugin', when: 'loaded' })
    const newer = registerStyle('addon', 'utilities', '.grid{display:grid}', { scope: 'plugin', when: 'loaded' })
    old()
    usePluginList.setState({ plugins: [plugin('addon', 'disposed')] })
    expect(dom.children).toHaveLength(2)
    expect(dom.children[0].textContent).toBe('@scope ([data-plugin-ui="addon"]) {.grid{display:grid}}')
    expect(() => registerStyle('addon', 'global', 'body{}', { when: 'loaded' })).toThrow('must be scoped')
    newer()
    expect(dom.children).toHaveLength(1)
    stop()
  })
})
