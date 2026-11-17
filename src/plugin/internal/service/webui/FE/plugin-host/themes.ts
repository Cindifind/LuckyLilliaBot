import { useMemo } from 'react'
import { create } from 'zustand'
import type { StyleOptions, ThemeDefinition, ThemeSnapshot, ThemeState, ThemeTokens, ThemeVariant } from '@luckylillia/plugin-sdk/webui'
import type { PluginStatus } from '../types/plugins'
import { useThemeStore } from '../stores/themeStore'
import { resetGlassAdaptive } from '../utils/glassRuntime'
import { usePluginList } from './pluginList'

interface OwnedTheme extends ThemeDefinition { owner: string; key: string }
interface TokenLayer { owner: string; id: string; light: ThemeTokens; dark: ThemeTokens }
interface Style { owner: string; id: string; css: string; when: 'active' | 'loaded' }
export const useThemes = create<{ themes: OwnedTheme[]; layers: TokenLayer[]; styles: Style[] }>(() => ({ themes: [], layers: [], styles: [] }))
export const themeKey = (owner: string, id: string) => `${owner}|${id}`

function identifier(id: string) {
  if (typeof id !== 'string' || !/^[\w.-]+$/.test(id) || id === 'default') throw new Error(`Invalid theme/style id: ${id}`)
}

function tokens(input: ThemeTokens): ThemeTokens {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Theme tokens must be an object')
  const copy: ThemeTokens = {}
  for (const [name, value] of Object.entries(input)) {
    if (!/^--[a-zA-Z][\w-]*$/.test(name) || typeof value !== 'string' || /[;{}<>]/.test(value)) {
      throw new Error(`Invalid theme token: ${name}`)
    }
    copy[name] = value
  }
  return copy
}

function variant(input: ThemeVariant): ThemeVariant {
  if (!input || (input.background !== undefined && (typeof input.background !== 'string' || /[;{}<>]/.test(input.background)))) {
    throw new Error('Invalid theme variant/background')
  }
  return { tokens: tokens(input.tokens), background: input.background }
}

export function registerTheme(owner: string, definition: ThemeDefinition): () => void {
  identifier(definition.id)
  if (typeof definition.title !== 'string' || !definition.title.trim()) throw new Error('A theme needs a title')
  if (definition.css !== undefined && typeof definition.css !== 'string') throw new Error('Theme CSS must be a string')
  const theme: OwnedTheme = { ...definition, owner, key: themeKey(owner, definition.id), light: variant(definition.light), dark: variant(definition.dark) }
  if (useThemes.getState().themes.some(other => other.key === theme.key)) throw new Error(`Theme ${theme.key} already registered`)
  useThemes.setState(state => ({ themes: [...state.themes, theme] }))
  return () => useThemes.setState(state => ({ themes: state.themes.filter(other => other !== theme) }))
}

export function overrideTokens(owner: string, id: string, input: { light: ThemeTokens; dark: ThemeTokens }): () => void {
  identifier(id)
  const layer: TokenLayer = { owner, id, light: tokens(input.light), dark: tokens(input.dark) }
  useThemes.setState(state => ({ layers: [...state.layers.filter(other => other.owner !== owner || other.id !== id), layer] }))
  return () => useThemes.setState(state => ({ layers: state.layers.filter(other => other !== layer) }))
}

export function registerStyle(owner: string, id: string, css: string, options: StyleOptions = {}): () => void {
  identifier(id)
  if (typeof css !== 'string') throw new Error('Stylesheet CSS must be a string')
  if (options.when === 'loaded' && options.scope !== 'plugin') throw new Error('Loaded styles must be scoped to the plugin')
  const style: Style = { owner, id, css, when: options.when ?? 'active' }
  if (options.scope === 'plugin') {
    // @scope's proximity wins over global host utilities only inside this plugin. Tailwind's default theme
    // declarations become local defaults rather than changing :root for everybody.
    style.css = `@scope ([data-plugin-ui=${JSON.stringify(owner)}]) {${css.replace(/:root\s*,\s*:host\b/g, ':scope')}}`
  }
  useThemes.setState(state => ({ styles: [...state.styles.filter(other => other.owner !== owner || other.id !== id), style] }))
  return () => useThemes.setState(state => ({ styles: state.styles.filter(other => other !== style) }))
}

/** Any active instance of a package keeps its UI effects alive. Pending/failed/disabled entries do not. */
const owners = (plugins: PluginStatus[] | null) => new Set((plugins ?? []).filter(plugin => !plugin.disabled && plugin.state === 'active').map(plugin => plugin.name))

export function themeSnapshot(
  themes: OwnedTheme[], plugins: PluginStatus[] | null,
  preference: Pick<ThemeSnapshot, 'mode' | 'isDark' | 'selected'>,
): ThemeSnapshot {
  const active = owners(plugins)
  const theme = themes.find(theme => theme.key === preference.selected && active.has(theme.owner))
  return {
    mode: preference.mode, isDark: preference.isDark, selected: preference.selected,
    active: theme?.key ?? 'default',
    background: theme?.[preference.isDark ? 'dark' : 'light'].background,
    themes: themes.map(({ key, owner, id, title, description }) => ({ key, owner, id, title, description, available: active.has(owner) })),
  }
}

export function getTheme(): ThemeSnapshot {
  return themeSnapshot(useThemes.getState().themes, usePluginList.getState().plugins, useThemeStore.getState())
}

export function useTheme(): ThemeState {
  const themes = useThemes(state => state.themes)
  const plugins = usePluginList(state => state.plugins)
  const { mode, isDark, selected, select, setMode } = useThemeStore()
  return useMemo(() => ({ ...themeSnapshot(themes, plugins, { mode, isDark, selected }), select, setMode }), [themes, plugins, mode, isDark, selected, select, setMode])
}

const declarations = (values: ThemeTokens) => Object.entries(values).map(([name, value]) => `${name}:${value};`).join('')

/** Use explicit material selectors too: glass sheets resolve their own light/dark palette, including in portals. */
export function themeStyles(): string {
  const state = useThemes.getState()
  const snapshot = getTheme()
  const active = owners(usePluginList.getState().plugins)
  const theme = state.themes.find(theme => theme.key === snapshot.active)
  const light = { ...theme?.light.tokens }, dark = { ...theme?.dark.tokens }
  for (const layer of state.layers) {
    if (!active.has(layer.owner)) continue
    Object.assign(light, layer.light)
    Object.assign(dark, layer.dark)
  }
  const root = ':root[data-llbot-theme]'
  return [
    `${root}{${declarations(snapshot.isDark ? dark : light)}}`,
    `${root} .glass-on-light{${declarations(light)}}`,
    `${root} .glass-on-dark{${declarations(dark)}}`,
    snapshot.background === undefined ? '' : `${root} body{background:${snapshot.background};background-attachment:fixed}`,
    theme?.css ?? '',
  ].join('\n')
}

/** Explicitly installed by main, so importing the SDK has no DOM side effects. */
export function installThemeRuntime(): () => void {
  const root = document.documentElement
  const themeStyle = document.createElement('style')
  themeStyle.dataset.llbotTheme = ''
  document.head.append(themeStyle)
  const managed = new Map<Style, HTMLStyleElement>()
  let previous = ''
  const update = () => {
    root.dataset.llbotTheme = getTheme().active
    const css = themeStyles()
    let changed = false
    if (css !== previous) {
      themeStyle.textContent = css
      previous = css
      changed = true
    }
    const active = owners(usePluginList.getState().plugins)
    const wanted = useThemes.getState().styles.filter(style => style.when === 'loaded' || active.has(style.owner))
    for (const [style, node] of managed) if (!wanted.includes(style)) { node.remove(); managed.delete(style); changed = true }
    for (const style of wanted) if (!managed.has(style)) {
      const node = document.createElement('style')
      node.dataset.plugin = style.owner
      node.dataset.style = style.id
      node.textContent = style.css
      document.head.append(node)
      managed.set(style, node)
      changed = true
    }
    // Theme CSS is last, allowing the selected theme to override general component styles.
    if (themeStyle !== document.head.lastElementChild) document.head.append(themeStyle)
    if (changed) resetGlassAdaptive()
  }
  const dispose = [useThemes.subscribe(update), usePluginList.subscribe(update), useThemeStore.subscribe(update)]
  update()
  return () => {
    dispose.forEach(unsubscribe => unsubscribe())
    themeStyle.remove()
    managed.forEach(node => node.remove())
    delete root.dataset.llbotTheme
    resetGlassAdaptive()
  }
}
