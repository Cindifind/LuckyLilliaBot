import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Select } from '../common/Select'
import { useTheme } from '../../plugin-host/themes'
import { SlotOutlet, useSlotContents } from '../../plugin-host/views'

export default function ThemeSettings() {
  const theme = useTheme()
  const current = theme.themes.find(item => item.key === theme.selected)
  const active = theme.themes.find(item => item.key === theme.active)
  const settings = useSlotContents('settings.appearance')
  const hasSettings = !!active && settings.some(item => item.owner === active.owner)
  const options = [
    { value: 'default', label: '默认主题' },
    ...theme.themes.filter(item => item.available || item.key === theme.selected)
      .map(item => ({ value: item.key, label: `${item.title}${item.available ? '' : '（未运行）'}` })),
  ]
  if (theme.selected !== 'default' && !current) options.push({ value: theme.selected, label: '已选主题（暂不可用）' })
  return (
    <div className="space-y-3 mb-5">
      <Select value={theme.selected} options={options} onChange={theme.select} />
      {current?.description && <p className="text-sm text-theme-secondary">{current.description}</p>}
      {theme.selected !== theme.active && (
        <p className="text-sm text-theme-secondary">主题插件尚未运行，暂用默认主题。启用后会自动恢复。</p>
      )}
      <p className="text-xs text-theme-muted">在插件页安装并启用主题插件后，可在这里切换。选择保存在当前浏览器。</p>
      {hasSettings && (
        <details key={theme.active} className="theme-settings group border border-theme-divider rounded-xl" data-theme-settings>
          <summary className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-theme cursor-pointer">
            <ChevronRight size={16} className="shrink-0 transition-transform group-open:rotate-90" />
            主题设置
          </summary>
          <div className="theme-settings-body px-3 pb-3">
            <SlotOutlet name="settings.appearance" wrap={(element, contribution) => contribution.owner === active?.owner ? element : null} />
          </div>
        </details>
      )}
    </div>
  )
}
