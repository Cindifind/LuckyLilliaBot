import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const repository = path.resolve(import.meta.dirname, '../../..')

describe('startup plugin process lifecycle', () => {
  it('disposes already started plugins and exits nonzero if another requested plugin fails', () => {
    const directory = mkdtempSync(path.join(os.tmpdir(), 'llbot-startup-failure-'))
    try {
      const instance = path.join(directory, 'data/instances/startup-test')
      mkdirSync(instance, { recursive: true })
      writeFileSync(path.join(instance, 'settings.json'), JSON.stringify({
        log: false, webui: { enable: false, host: '127.0.0.1', port: 0 },
      }))
      writeFileSync(path.join(instance, 'plugins.json'), JSON.stringify({
        version: 1, trusted: [], entries: [
          { id: 'a1000001', name: 'builtin:satori', disabled: true },
          { id: 'a1000002', name: 'builtin:market', disabled: true, config: { registry: 'http://127.0.0.1:1' } },
          { id: 'a1000003', name: 'startup-good', disabled: true, config: { value: 'saved-config' } },
          { id: 'a1000004', name: 'startup-broken', disabled: true },
        ],
      }))
      for (const [name, code] of [
        ['startup-good', "import { writeFileSync } from 'node:fs'; export function apply(ctx, config) { writeFileSync('started', config.value); ctx.effect(() => () => writeFileSync('disposed', 'yes')) }"],
        ['startup-broken', "export function apply() { throw new Error('requested fixture failed') }"],
      ]) {
        const plugin = path.join(directory, 'data/plugins', name)
        mkdirSync(plugin, { recursive: true })
        writeFileSync(path.join(plugin, 'package.json'), JSON.stringify({ name, version: '1.0.0', type: 'module', main: 'index.js', llbot: {} }))
        writeFileSync(path.join(plugin, 'index.js'), code)
      }
      const result = spawnSync(process.execPath, [
        '--import', import.meta.resolve('tsx'), path.join(repository, 'src/main/main.ts'),
        '--instance', 'startup-test', '--plugin', 'startup-good,startup-broken',
      ], {
        cwd: directory, encoding: 'utf8', timeout: 15000, windowsHide: true,
        env: { ...process.env, TSX_TSCONFIG_PATH: path.join(repository, 'tsconfig.json'), LLBOT_WEBUI_PORT: '0', LLBOT_WEBUI_HOST: '127.0.0.1' },
      })
      const output = result.stdout + result.stderr
      expect(result.error, output).toBeUndefined()
      expect(result.status, output).toBe(1)
      expect(output).toContain('startup-broken')
      expect(readFileSync(path.join(directory, 'started'), 'utf8')).toBe('saved-config')
      expect(readFileSync(path.join(directory, 'disposed'), 'utf8')).toBe('yes')
      const saved = JSON.parse(readFileSync(path.join(instance, 'plugins.json'), 'utf8'))
      expect(saved.entries.find((entry: { id: string }) => entry.id === 'a1000003')).toMatchObject({ name: 'startup-good', config: { value: 'saved-config' } })
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  }, 20000)
})
