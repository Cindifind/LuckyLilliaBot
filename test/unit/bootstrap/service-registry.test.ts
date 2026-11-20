import { mkdtempSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { Context, Fiber, FiberState, Service } from 'cordis'
import Database from '@cordisjs/plugin-database'
import SQLiteDriver from '@cordisjs/plugin-database-sqlite'
import TimerService from '@cordisjs/plugin-timer'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { Config as LLBotConfig } from '@/common/types'
import { DATA_DIR } from '@/common/globalVars'
import { adapterDefaults, defaultConfig } from '@/main/config/defaultConfig'
import SatoriAdapter from '@/plugin/internal/adapter/satori/adapter'
import { WebuiServer } from '@/plugin/internal/service/webui/BE/server'
import { Dashboard } from '@/plugin/internal/tool/dashboard'
import { Logs } from '@/plugin/internal/tool/logs'
import BotsService from '@/universal/bots'

// These host services write sqlite and temporary files, so never use a real instance directory.
vi.mock('@/common/globalVars', async () => {
  const fs = await import('node:fs')
  const os = await import('node:os')
  const path = await import('node:path')
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'llbot-registry-'))
  return {
    DATA_DIR: dir,
    TEMP_DIR: path.join(dir, 'temp'),
    LOG_DIR: path.join(dir, 'logs'),
    dbDir: path.join(dir, 'database'),
    getFixedDataDir: () => dir,
  }
})

const config: LLBotConfig = { ...defaultConfig, webui: { ...defaultConfig.webui, enable: false } }

class MockConfig extends Service {
  constructor(ctx: Context) { super(ctx, 'config') }
  get() { return config }
  set() {}
  listenChange() {}
}

const dbDir = mkdtempSync(path.join(os.tmpdir(), 'llbot-registry-db-'))

afterAll(() => {
  rmSync(dbDir, { recursive: true, force: true })
  rmSync(DATA_DIR, { recursive: true, force: true })
})

describe('service registry under the pinned cordis version', () => {
  it('starts the host without an NT package and leaves account-dependent consumers waiting', async () => {
    const ctx = new Context()
    const fibers: Record<string, Fiber> = {}
    const mount = (name: string, plugin: any, cfg?: unknown) => { fibers[name] = ctx.plugin(plugin, cfg) }
    try {
      mount('timer', TimerService)
      mount('config', MockConfig)
      mount('bots', BotsService)
      mount('database', Database)
      mount('sqlite', SQLiteDriver, { path: pathToFileURL(path.join(dbDir, 'registry.db')).href })
      mount('satori', SatoriAdapter, { ...adapterDefaults.satori, enable: false })
      mount('webuiServer', WebuiServer)
      mount('dashboard', Dashboard)
      mount('logs', Logs)
      // Their inject lists are intentionally unsatisfied until the external protocol is installed and logged in.
      const waiting = new Set<string>()
      await vi.waitFor(() => {
        const stuck = Object.entries(fibers)
          .filter(([name, fiber]) => !waiting.has(name) && fiber.state !== FiberState.ACTIVE)
          .map(([name, fiber]) => name + '=' + FiberState[fiber.state])
        expect(stuck).toEqual([])
      }, { timeout: 4_000, interval: 100 })
      for (const name of waiting) expect(fibers[name].state, name).toBe(FiberState.PENDING)
      for (const name of ['config', 'bots', 'timer', 'database', 'model', 'satori', 'webuiServer']) {
        expect(ctx.get(name), name).toBeDefined()
      }
      for (const name of [
        'qqProtocol', 'store', 'app', 'ntOnebot', 'ntFileApi', 'ntFriendApi', 'ntGroupApi', 'ntLoginApi',
        'ntMsgApi', 'ntUserApi', 'ntWebApi', 'ntSystemApi', 'onebot', 'milky', 'emailNotification',
      ]) expect(ctx.get(name), name).toBeUndefined()
      expect(ctx.bots.size).toBe(0)
    } finally {
      for (const fiber of Object.values(fibers).reverse()) await fiber.dispose()
    }
  })
})
