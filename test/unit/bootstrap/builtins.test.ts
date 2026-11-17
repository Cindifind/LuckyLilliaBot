import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { Context, Fiber, Service } from 'cordis'
import TimerService from '@cordisjs/plugin-timer'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { WebSocket } from 'ws'
import { Config as LLBotConfig } from '@/common/types'
import { DATA_DIR } from '@/common/globalVars'
import { defaultConfig } from '@/main/config/defaultConfig'
import { deepMerge } from '@/common/utils/misc'
import { builtinPlugins } from '@/plugin/internal'
import BotsService from '@/universal/bots'
import HttpService from '@/universal/http'
import PluginService, { PluginForbiddenError } from '@/plugin/host'

// Both the plugin database and shared package registry use an isolated temporary environment.
vi.mock('@/common/globalVars', async () => {
  const fs = await import('node:fs')
  const os = await import('node:os')
  const path = await import('node:path')
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'llbot-builtins-'))
  return {
    DATA_DIR: dir,
    TEMP_DIR: path.join(dir, 'temp'),
    LOG_DIR: path.join(dir, 'logs'),
    dbDir: path.join(dir, 'database'),
    getFixedDataDir: () => dir,
  }
})

let config: LLBotConfig

class MockConfig extends Service {
  constructor(ctx: Context) { super(ctx, 'config') }
  get() { return config }
  patch(partial: object) {
    config = deepMerge(config, partial) as LLBotConfig
    return config
  }
  set() {}
  listenChange() {}
}

async function freePort(): Promise<number> {
  const server = net.createServer()
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  const { port } = server.address() as net.AddressInfo
  await new Promise<void>(resolve => server.close(() => resolve()))
  return port
}

function listening(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect(port, '127.0.0.1')
    socket.once('connect', () => { socket.destroy(); resolve(true) })
    socket.once('error', () => resolve(false))
  })
}

const tmp = mkdtempSync(path.join(os.tmpdir(), 'llbot-builtins-run-'))
const mounted: Fiber[] = []

afterAll(async () => {
  for (const fiber of mounted.reverse()) await fiber.dispose()
  rmSync(tmp, { recursive: true, force: true })
  rmSync(DATA_DIR, { recursive: true, force: true })
})

describe('builtin plugins', () => {
  it('starts the host without optional adapters and releases Satori ports on settings changes and disable', async () => {
    config = { ...defaultConfig, webui: { ...defaultConfig.webui, enable: false } }
    const satoriPort = await freePort()
    const satori = { host: '127.0.0.1', port: satoriPort, token: '' }
    const file = path.join(tmp, 'plugins.json')
    writeFileSync(file, JSON.stringify({ version: 1, entries: [{ id: 'a0000002', name: 'builtin:satori', config: satori }] }))

    const ctx = new Context()
    for (const plugin of [TimerService, HttpService, MockConfig, BotsService]) mounted.push(await ctx.plugin(plugin))
    mounted.push(await ctx.plugin(PluginService, { file, roots: [], resolver: false, builtins: builtinPlugins }))

    const id = (name: string) => ctx.plugins.list().find(status => status.name === name)!.id
    const states = () => Object.fromEntries(ctx.plugins.list().map(status => [status.name, status.state]))
    const shell = [
      'builtin:webui', 'builtin:dashboard', 'builtin:logs', 'builtin:satori', 'builtin:commands', 'builtin:database',
      'builtin:market', 'builtin:proxy', 'builtin:message-order',
    ]
    await vi.waitFor(() => expect(shell.map(name => states()[name])).toEqual(shell.map(() => 'active')))
    const off = ['builtin:qq-official']
    for (const name of off) expect(ctx.plugins.get(id(name))).toMatchObject({ state: 'disposed', disabled: true })
    // Features requiring an NT account can wait without preventing the host, database or Satori from running.
    for (const name of ['builtin:nt-protocol', 'builtin:ntqq-universal', 'builtin:onebot11', 'builtin:milky', 'builtin:email-notification', 'builtin:webqq']) {
      expect(states()).not.toHaveProperty(name)
    }
    for (const name of ['qqProtocol', 'app', 'store', 'onebot', 'milky']) expect(ctx.get(name), name).toBeUndefined()
    expect(ctx.bots.size).toBe(0)
    await vi.waitFor(async () => expect(await listening(satoriPort)).toBe(true))
    expect(ctx.get('satori')!.config).toEqual({ ...satori, enable: true })

    // Changing the host settings preserves the Satori server and connected clients.
    const client = new WebSocket('ws://127.0.0.1:' + satoriPort + '/v1/events')
    await new Promise((resolve, reject) => { client.once('open', resolve); client.once('error', reject) })
    let dropped = false
    client.once('close', () => { dropped = true })
    config = { ...structuredClone(config), log: !config.log }
    await ctx.parallel('llob/config-updated', config)
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(dropped).toBe(false)
    const closed = new Promise<void>(resolve => client.once('close', () => resolve()))
    client.close()
    await closed

    // Changing the entry restarts only Satori and replaces its listener.
    const movedPort = await freePort()
    await ctx.plugins.updateConfig(id('builtin:satori'), { ...satori, port: movedPort })
    await vi.waitFor(async () => expect(await listening(movedPort)).toBe(true))
    expect(await listening(satoriPort)).toBe(false)
    await ctx.plugins.updateConfig(id('builtin:satori'), satori)
    await vi.waitFor(async () => expect(await listening(satoriPort)).toBe(true))
    expect(await listening(movedPort)).toBe(false)

    expect(await ctx.plugins.disable(id('builtin:satori'))).toMatchObject({ state: 'disposed', disabled: true })
    await vi.waitFor(async () => expect(await listening(satoriPort)).toBe(false))
    expect(ctx.get('satori')).toBeUndefined()
    expect(await ctx.plugins.enable(id('builtin:satori'))).toMatchObject({ state: 'active', disabled: false })
    await vi.waitFor(async () => expect(await listening(satoriPort)).toBe(true))
    expect(await ctx.plugins.reload(id('builtin:satori'))).toEqual({ status: 'reloaded' })
    await vi.waitFor(async () => expect(await listening(satoriPort)).toBe(true))

    await expect(ctx.plugins.disable(id('builtin:webui'))).rejects.toBeInstanceOf(PluginForbiddenError)
    await expect(ctx.plugins.reload(id('builtin:webui'))).rejects.toBeInstanceOf(PluginForbiddenError)
    expect(ctx.get('webuiServer')).toBeDefined()
    for (const builtin of builtinPlugins) if (!builtin.core) await ctx.plugins.disable(id(builtin.name))
    await vi.waitFor(async () => expect(await listening(satoriPort)).toBe(false))
  })

  it('switches the official bot on before its credentials are in: it waits for them, saving checks them', async () => {
    vi.stubGlobal('fetch', vi.fn(async (input: string) => {
      if (new URL(input).pathname === '/app/getAppAccessToken') {
        return new Response(JSON.stringify({ access_token: 'tok', expires_in: '7200' }), { status: 200 })
      }
      // No gateway: it retries in the background, which is not what this is about.
      return new Response('{}', { status: 503 })
    }))
    const ctx = new Context()
    const timer = await ctx.plugin(TimerService)
    const bots = await ctx.plugin(BotsService)
    const builtins = builtinPlugins.filter(builtin => builtin.name === 'builtin:qq-official')
    const service = await ctx.plugin(PluginService, { file: path.join(tmp, 'qq-official.json'), roots: [], resolver: false, builtins })
    try {
      const [{ id }] = ctx.plugins.list()
      expect(ctx.plugins.list()[0].notice).toBeUndefined()
      const enabled = await ctx.plugins.enable(id)
      expect(enabled).toMatchObject({ state: 'active', disabled: false, notice: '还没有填写 AppID 和 AppSecret' })
      expect(enabled.error).toBeUndefined()
      expect(ctx.bots.size).toBe(0)
      await expect(ctx.plugins.updateConfig(id, { appId: 'APPID' })).rejects.toMatchObject({ issues: [{ path: ['secret'] }] })
      const saved = await ctx.plugins.updateConfig(id, { appId: 'APPID', secret: 's' })
      expect(saved).toMatchObject({ state: 'active' })
      expect(saved.notice).toBeUndefined()
      expect(ctx.bots.get('qq:APPID')).toBeDefined()
    } finally {
      await service.dispose()
      await bots.dispose()
      await timer.dispose()
      vi.unstubAllGlobals()
    }
  })
})
