import { expect, it, vi } from 'vitest'
import { registerGlass, setGlassSource, unregisterGlass } from '@/plugin/internal/service/webui/FE/utils/glassRuntime'

it('clears the old canvas lens and adaptive state when switching to a theme wallpaper', () => {
  const clearRect = vi.fn()
  const element = { classList: { remove: vi.fn() }, style: { removeProperty: vi.fn() } } as unknown as HTMLElement
  const lens = { width: 240, height: 400, getContext: () => ({ clearRect }) } as unknown as HTMLCanvasElement
  vi.stubGlobal('getComputedStyle', () => ({ getPropertyValue: () => '', backgroundColor: 'white' }))
  try {
    registerGlass(element, lens)
    setGlassSource(null)
    expect(clearRect).toHaveBeenCalledWith(0, 0, 240, 400)
    expect(element.classList.remove).toHaveBeenCalledWith('glass-on-dark', 'glass-on-light')
  } finally {
    unregisterGlass(element)
    vi.unstubAllGlobals()
  }
})
