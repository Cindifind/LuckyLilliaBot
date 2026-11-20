import h from '@satorijs/element'

// Shared extension-element scenarios. Keep the host official-bot tests and the standalone NTQQ tests aligned
// when adding a new element kind; each package verifies its own native sends and fallbacks.

export function crossPlatform(image: string): Record<string, h[]> {
  return {
    markdown: [h('markdown', {}, '# 标题\n**粗体** 和 [链接](https://example.com)')],
    buttons: [
      h.text('选一个'),
      h('button-group', {}, [
        h('button', {}, '签到'),
        h('button', { text: '/sign' }, '每日签到'),
        h('button', { type: 'link', href: 'https://example.com' }, '官网'),
        h('button', { type: 'action', id: 'vote' }, '投票'),
      ]),
    ],
    card: [h('card', { title: '标题', url: 'https://example.com/a', desc: '描述', image })],
    face: [h.text('好的'), h('face', { id: '13', name: '呲牙' })],
  }
}
