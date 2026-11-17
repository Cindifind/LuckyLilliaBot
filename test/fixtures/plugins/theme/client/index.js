import { createElement as h, useState } from 'react'
import ReactDOM from 'react-dom'
import { useTheme } from '@luckylillia/plugin-sdk/webui'

function ThemeStatus() {
  const theme = useTheme()
  return h('p', { 'data-theme-status': true }, `${theme.active} / ${theme.isDark ? 'dark' : 'light'}`)
}

export default function apply(ctx) {
  const common = {
    '--r-card': '12px', '--r-panel': '14px', '--glass-blur-regular': '0px',
    '--glass-alpha-card': '0.96', '--glass-alpha-regular': '0.96', '--glass-alpha-thick': '0.98',
    '--accent-from': '#0891b2', '--accent-to': '#2563eb', '--accent': '#0891b2', '--accent-strong': '#0e7490',
    '--accent-soft': 'rgba(8,145,178,0.12)', '--accent-ring': 'rgba(8,145,178,0.35)',
  }
  ctx.theme.register({
    id: 'ocean', title: '海洋', description: '青蓝配色、清晰卡片与独立背景，支持亮色和暗色。',
    light: {
      tokens: { ...common, '--glass-tint': '245 253 255', '--text-primary': '#133345', '--text-secondary': '#3f6679', '--text-muted': '#567887', '--text-hint': '#6c8895' },
      background: `url("${ctx.asset('ocean.svg')}") center / cover`,
    },
    dark: {
      tokens: { ...common, '--glass-tint': '14 34 48', '--text-primary': '#e1f5ff', '--text-secondary': '#afcddb', '--text-muted': '#84a6b8', '--text-hint': '#7593a2', '--accent': '#38bdf8', '--accent-strong': '#0ea5e9' },
      background: 'linear-gradient(135deg, #081522, #12364a)',
    },
  })
  ctx.theme.register({
    id: 'paper', title: '素纸', description: '米白与炭黑的纯色背景、直角卡片。',
    light: { tokens: { '--accent': '#5a554b', '--accent-strong': '#36322b', '--accent-from': '#787166', '--accent-to': '#454139', '--r-card': '3px', '--glass-tint': '255 253 247', '--glass-alpha-card': '1' }, background: '#eeeae1' },
    dark: { tokens: { '--accent': '#d1c6ac', '--accent-strong': '#b9a887', '--accent-from': '#786e59', '--accent-to': '#4d4639', '--r-card': '3px', '--glass-tint': '35 33 29', '--glass-alpha-card': '1' }, background: '#191815' },
  })
  ctx.style('demo', '.theme-demo-label { font-size: 12px; color: var(--text-muted); }')
  ctx.style('scoped', '@layer utilities {.flex{display:flex}.theme-portal-probe{padding:23px}}', { scope: 'plugin', when: 'loaded' })
  ctx.page({ id: 'preview', title: '主题预览', icon: 'palette', component: () => h('div', { className: 'card', style: { padding: 24 } }, h('h2', null, '主题预览'), h(ThemeStatus), h('button', { className: 'btn-primary', onClick: () => ctx.theme.select('ocean') }, '使用海洋主题')) })
  ctx.slot('settings.appearance', { id: 'status', component: ThemeStatus })
  ctx.slot('settings.sections', { id: 'demo', title: '主题示例设置', component: () => {
    const [open, setOpen] = useState(false)
    return h('div', null, h(ThemeStatus), h('button', { className: 'btn-glass', onClick: () => setOpen(true) }, '测试插件弹框'),
      open && ReactDOM.createPortal(h('div', { role: 'dialog', className: 'glass glass-thick theme-portal-probe', style: { position: 'fixed', top: 100, right: 40, zIndex: 11000 } }, h('p', null, '插件弹框样式测试'), h('button', { className: 'btn-glass', onClick: () => setOpen(false) }, '关闭测试弹框')), document.body))
  } })
  ctx.slot('sidebar.footer', { id: 'demo', component: () => h('p', { className: 'theme-demo-label', 'data-theme-sidebar': true }, '主题扩展已运行') })
  ctx.slot('page.header.actions', { id: 'mode', component: () => {
    const theme = useTheme()
    return h('button', { className: 'btn-glass', onClick: () => theme.setMode(theme.isDark ? 'light' : 'dark') }, '切换亮暗')
  } })
  ctx.slot('page.content', { id: 'frame', match: `${ctx.plugin.name}:preview`, component: ({ children }) => {
    if (sessionStorage.getItem('theme-demo-error')) throw new Error('theme demo wrapper failure')
    return h('div', { 'data-theme-wrapper': true, style: { borderTop: '3px solid var(--accent)', paddingTop: 12 } }, children)
  } })
}
