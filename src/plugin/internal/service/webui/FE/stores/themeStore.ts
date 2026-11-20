import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { ThemeMode } from '@luckylillia/plugin-sdk/webui'

interface ThemeState {
  mode: ThemeMode
  isDark: boolean // 解析 auto 之后的结果
  selected: string
  select: (key: string) => void
  setMode: (mode: ThemeMode) => void
  cycleMode: () => void
}

const getSystemTheme = (): boolean => {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches
}

const resolveTheme = (mode: ThemeMode): boolean => {
  if (mode === 'auto') {
    return getSystemTheme()
  }
  return mode === 'dark'
}

const applyTheme = (isDark: boolean) => {
  if (typeof document === 'undefined') return
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'auto',
      isDark: getSystemTheme(),
      selected: 'default',
      select: selected => set({ selected }),
      setMode: (mode: ThemeMode) => {
        const isDark = resolveTheme(mode)
        applyTheme(isDark)
        set({ mode, isDark })
      },
      cycleMode: () => {
        const currentMode = get().mode
        const nextMode: ThemeMode =
          currentMode === 'light' ? 'dark' :
          currentMode === 'dark' ? 'auto' : 'light'
        const isDark = resolveTheme(nextMode)
        applyTheme(isDark)
        set({ mode: nextMode, isDark })
      },
    }),
    {
      name: 'llbot-theme',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ mode: state.mode, selected: state.selected }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (!['light', 'dark', 'auto'].includes(state.mode)) state.mode = 'auto'
          if (typeof state.selected !== 'string' || !state.selected) state.selected = 'default'
          const isDark = resolveTheme(state.mode)
          applyTheme(isDark)
          state.isDark = isDark
        }
      },
    }
  )
)

if (typeof window !== 'undefined' && window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    const state = useThemeStore.getState()
    if (state.mode === 'auto') {
      applyTheme(e.matches)
      useThemeStore.setState({ isDark: e.matches })
    }
  })
}
