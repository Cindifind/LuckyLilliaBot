import { Context, Fiber } from 'cordis'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Bot, NeutralEvent } from '@luckylillia/plugin-sdk'
import BotsService from '@/universal/bots'
import SatoriAdapter from '@/plugin/internal/adapter/satori/adapter'

// Protocol packages register neutral bots; Satori never imports their implementation.
let ctx: Context
let ntqq: Fiber
let ntBot: Bot
let dispatched: Record<string, any>[]
let sendMessage: ReturnType<typeof vi.fn>
let setGuildMemberRole: ReturnType<typeof vi.fn>
let muteChannel: ReturnType<typeof vi.fn>

const official: Bot = {
  platform: 'qq', selfId: 'APPID', sid: 'qq:APPID', status: 1, features: ['message.markdown'],
  user: { id: 'APPID', name: 'Official' }, sendMessage: async () => [],
}
const ntPlugin = { inject: ['bots'], apply(ctx: Context) { ctx.bots.register(ntBot) } }

beforeEach(async () => {
  ctx = new Context()
  dispatched = []
  sendMessage = vi.fn(async (_channel, content) => [{ id: '2|987654|42', content }])
  setGuildMemberRole = vi.fn(async () => {})
  muteChannel = vi.fn(async () => {})
  ntBot = {
    platform: 'ntqq', selfId: '123456', sid: 'ntqq:123456', status: 1,
    features: ['message.face', 'message.forward', 'message.proactive', 'guild.plain'],
    user: { id: '123456', name: 'TestBot' }, sendMessage, setGuildMemberRole, muteChannel,
    getFriendList: async () => ({ data: [] }),
  }
  await ctx.plugin(BotsService)
  ntqq = await ctx.plugin(ntPlugin)
  await ctx.plugin(SatoriAdapter, { enable: true, host: '127.0.0.1', port: 0, token: '' })
  const satori = ctx.satori as unknown as { server: { dispatch: (body: unknown) => void } }
  vi.spyOn(satori.server, 'dispatch').mockImplementation(body => { dispatched.push(body as Record<string, any>) })
})
afterEach(async () => { await ctx.fiber.dispose() })

function request(name: string, platform: string, selfId: string, body: object) {
  const { app } = (ctx.satori as unknown as { server: { app: { fetch: (request: Request) => Promise<Response> } } }).server
  return app.fetch(new Request(`http://localhost/v1/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Satori-Platform': platform, 'Satori-User-ID': selfId },
    body: JSON.stringify(body),
  }))
}

function message(content: string, userId = '555') {
  return ctx.bots.dispatch(ntBot, {
    sn: 42, type: 'message-created', self_id: '123456', platform: 'ntqq', timestamp: 1700000000000,
    login: { sn: 1, platform: 'ntqq', user: ntBot.user },
    message: { id: '2|987654|42', content, created_at: 1700000000000 },
    user: { id: userId, name: 'Alice', is_bot: false },
    member: { user: { id: userId, name: 'Alice' } },
    channel: { id: '987654', type: 0, name: 'Test Group' }, guild: { id: '987654' },
  } as NeutralEvent)
}

describe('events', () => {
  it('preserves NTQQ wire names, elements and the event envelope', async () => {
    await message('hi<face id="13" type="1" name="呲牙"/><ntqq:ark data="{&quot;prompt&quot;:&quot;[分享]标题&quot;}">[分享]标题</ntqq:ark>')
    const [event] = dispatched
    expect(Object.keys(event).sort()).toEqual(
      ['channel', 'guild', 'id', 'login', 'member', 'message', 'platform', 'self_id', 'sn', 'timestamp', 'type', 'user'].sort(),
    )
    expect(event).toMatchObject({
      id: 1, sn: 1, type: 'message-created', self_id: '123456', platform: 'llonebot',
      login: { sn: 1, platform: 'llonebot', user: { id: '123456' } },
      message: { id: '2|987654|42', created_at: 1700000000000 },
      user: { id: '555', name: 'Alice', is_bot: false },
      channel: { id: '987654', type: 0, name: 'Test Group' }, guild: { id: '987654' },
    })
    expect(event.message.content).toBe(
      'hi<face id="13" type="1" name="呲牙" platform="llonebot"/><llonebot:ark data="{&quot;prompt&quot;:&quot;[分享]标题&quot;}">[分享]标题</llonebot:ark>',
    )
    expect(Object.keys(event.login).sort()).toEqual(['platform', 'sn', 'user'])
  })

  it('sees messages swallowed by middleware and the bot\'s own messages', async () => {
    ctx.on('bot/message', () => {}, { prepend: true })
    await message('from someone')
    await message('from the bot', '123456')
    expect(dispatched.map(event => [event.sn, event.message.content])).toEqual([[1, 'from someone'], [2, 'from the bot']])
  })

  it('numbers events and logins across all platforms', async () => {
    await ctx.plugin({ inject: ['bots'], apply: (ctx: Context) => { ctx.bots.register(official) } })
    await message('nt')
    await ctx.bots.dispatch(official, {
      sn: 1, type: 'message-created', self_id: 'APPID', platform: 'qq', timestamp: 0,
      message: { id: 'q1', content: 'official' }, channel: { id: 'G1', type: 0 },
    } as NeutralEvent)
    expect(dispatched.map(event => [event.type, event.platform, event.sn, event.login.sn])).toEqual([
      ['login-added', 'qq', 1, 1], ['message-created', 'llonebot', 2, 2], ['message-created', 'qq', 3, 1],
    ])
    expect(dispatched[0].login).toMatchObject({ platform: 'qq', adapter: 'qq', user: { id: 'APPID', name: 'Official' } })
  })

  it('removes an unloaded protocol\'s login and adds it again after reload', async () => {
    const previous = await (await request('login.get', 'llonebot', '123456', {})).json()
    await ntqq.dispose()
    expect(ctx.bots.get('ntqq:123456')).toBeUndefined()
    expect(dispatched).toHaveLength(1)
    expect(dispatched[0]).toMatchObject({
      type: 'login-removed', self_id: '123456', platform: 'llonebot',
      login: { sn: previous.sn, user: { id: '123456', name: 'TestBot' } },
    })
    expect((await request('login.get', 'llonebot', '123456', {})).status).toBe(403)
    await ctx.plugin(ntPlugin)
    expect(dispatched[1]).toMatchObject({ type: 'login-added', login: { user: { id: '123456' } } })
    expect(dispatched[1].login.sn).toBeGreaterThan(previous.sn)
  })

  it('keeps login numbers unique after another bot is removed and registered again', async () => {
    const plugin = { inject: ['bots'], apply: (ctx: Context) => { ctx.bots.register(official) } }
    const first = await ctx.plugin(plugin)
    const ntLogin = await (await request('login.get', 'llonebot', '123456', {})).json()
    await first.dispose()
    await ctx.plugin(plugin)
    expect(dispatched.map(event => event.type)).toEqual(['login-added', 'login-removed', 'login-added'])
    expect(dispatched[1].login.sn).toBe(dispatched[0].login.sn)
    expect(dispatched[2].login.sn).toBeGreaterThan(ntLogin.sn)
  })
})

describe('API', () => {
  it('selects bots by wire platform and passes Satori arguments in method order', async () => {
    expect((await request('guild.list', 'ntqq', '123456', {})).status).toBe(403)
    expect((await request('guild.member.role.set', 'llonebot', '123456', { guild_id: '987654', user_id: '555', role_id: '3' })).status).toBe(200)
    expect(setGuildMemberRole).toHaveBeenCalledExactlyOnceWith('987654', '555', '3')
    await request('channel.mute', 'llonebot', '123456', { channel_id: '987654', guild_id: '987654', enable: false })
    expect(muteChannel).toHaveBeenCalledExactlyOnceWith('987654', '987654', false)
  })

  it('marks client sends as relayed and renames their elements in both directions', async () => {
    const response = await request('message.create', 'llonebot', '123456', { channel_id: '987654', content: '<llonebot:ark data="{&quot;app&quot;:&quot;x&quot;}"/>' })
    expect(response.status).toBe(200)
    expect(sendMessage).toHaveBeenCalledExactlyOnceWith('987654', '<ntqq:ark data="{&quot;app&quot;:&quot;x&quot;}"/>', { relay: true, referrer: undefined })
    const [sent] = await response.json()
    expect(sent.content).toContain('<llonebot:ark ')
  })

  it('passes the referrer through for a passive reply', async () => {
    const send = vi.spyOn(official, 'sendMessage')
    await ctx.plugin({ inject: ['bots'], apply: (ctx: Context) => { ctx.bots.register(official) } })
    expect((await request('message.create', 'qq', 'APPID', { channel_id: 'G1', content: 'hi', referrer: { msg_id: 'M1' } })).status).toBe(200)
    expect(send).toHaveBeenCalledExactlyOnceWith('G1', 'hi', { relay: true, referrer: { msg_id: 'M1' } })
    send.mockRestore()
  })

  it('advertises each bot\'s methods and features and returns 404 for missing methods', async () => {
    await ctx.plugin({ inject: ['bots'], apply: (ctx: Context) => { ctx.bots.register(official) } })
    const login = await (await request('login.get', 'llonebot', '123456', {})).json()
    expect(login).toMatchObject({ platform: 'llonebot', adapter: 'llonebot', user: { id: '123456', name: 'TestBot' } })
    expect(login.features).toEqual(expect.arrayContaining(['message.create', 'friend.list', 'guild.member.role.set', 'message.face', 'guild.plain']))
    expect(login.features).not.toContain('message.update')
    expect((await request('friend.list', 'qq', 'APPID', {})).status).toBe(404)
  })
})
