import { spawn, type ChildProcess } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { packageRoot, SharedPackages, withPackageRootLock } from '@/plugin/host/shared-packages'

vi.mock('node:fs/promises', async importOriginal => {
  const original = await importOriginal<typeof import('node:fs/promises')>()
  return { ...original, writeFile: vi.fn(original.writeFile) }
})

const children: ChildProcess[] = []
const coordinators: SharedPackages[] = []
const directories: string[] = []

async function directory() {
  const base = path.resolve('.tmp')
  await mkdir(base, { recursive: true })
  const root = await mkdtemp(path.join(base, 'shared-packages-'))
  directories.push(root)
  await mkdir(path.join(root, 'example'))
  await writeFile(path.join(root, 'example', 'package.json'), JSON.stringify({ name: 'example', version: '1.0.0' }))
  return root
}

function child(root: string, name: string, mode = 'peer') {
  const process = spawn(globalThis.process.execPath, ['--import', 'tsx', 'test/fixtures/plugins/shared-packages-child.mts', root, name, mode], {
    cwd: path.resolve('.'), stdio: ['ignore', 'pipe', 'pipe', 'ipc'], windowsHide: true,
  })
  children.push(process)
  const messages: Record<string, any>[] = []
  let output = ''
  process.on('message', message => messages.push(message as Record<string, any>))
  process.stdout?.on('data', chunk => { output += chunk.toString() })
  process.stderr?.on('data', chunk => { output += chunk.toString() })
  const wait = async (event: string) => {
    await vi.waitFor(() => {
      if (process.exitCode !== null) throw new Error(`worker exited: ${output}`)
      expect(messages.some(message => message.event === event), output).toBe(true)
    }, { timeout: 10_000, interval: 20 })
    return messages.find(message => message.event === event)!
  }
  return { process, messages, wait }
}

async function kill(worker: ChildProcess) {
  if (worker.exitCode !== null || worker.signalCode) return
  const exited = new Promise<void>(resolve => worker.once('exit', () => resolve()))
  worker.kill('SIGKILL')
  await exited
}

afterEach(async () => {
  for (const worker of children.splice(0)) await kill(worker)
  for (const coordinator of coordinators.splice(0)) await coordinator.close()
  for (const root of directories.splice(0)) {
    await rm(root, { recursive: true, force: true })
    const canonical = process.platform === 'win32' ? root.toLowerCase() : root
    await rm(path.join(tmpdir(), 'llbot-plugin-peers', createHash('sha256').update(canonical).digest('hex')), { recursive: true, force: true })
  }
})

describe('shared plugin package processes', () => {
  it.each([false, true])('recovers local removals using the scanned path and the link itself (removed: %s)', async removed => {
    const root = await directory()
    const finish = vi.fn(async (_change, _applied) => ({ status: 'unchanged' as const, entries: [] }))
    const local = new SharedPackages({ roots: [root], instance: 'local-removal', async prepare() {}, finish, warn() {} })
    coordinators.push(local)
    await local.initialize(async () => {})
    // A dangling junction is still installed as a filesystem link; it has not been unlinked yet.
    if (!removed) await symlink(path.join(root, 'source-no-longer-present'), path.join(root, 'development-ai'), 'junction')
    const peer = JSON.parse(await readFile(path.join(root, '.llbot-packages', 'peers', `${local.id}.json`), 'utf8'))
    await writeFile(path.join(root, '.llbot-packages', 'pending.json'), JSON.stringify({
      change: { id: 'local-removal-pending', root: await packageRoot(root), name: '@example/plugin', directory: 'development-ai', kind: 'uninstall', initiator: local.id },
      applied: false, peers: [peer],
    }))
    await local.exclusive(root, async () => {})
    expect(finish).toHaveBeenCalledWith(expect.objectContaining({ directory: 'development-ai' }), removed)
  })

  it('keeps a live writer exclusive and releases its kernel lock on process death', async () => {
    const root = await directory()
    const holder = child(root, 'holder', 'lock')
    await holder.wait('locked')
    await expect(withPackageRootLock(root, async () => 'wrong', 0)).rejects.toThrow(/另一个实例|协调端点/)
    await kill(holder.process)
    expect(await withPackageRootLock(root, async () => 'released', 1000)).toBe('released')
  })

  it('prepares and finishes a real peer process before reporting a successful change', async () => {
    const root = await directory()
    const peer = child(root, '第二个实例')
    await peer.wait('ready')
    const local = new SharedPackages({ roots: [root], instance: 'first', async prepare() {},
      async finish() { return { status: 'unchanged', entries: [] } }, warn() {} })
    coordinators.push(local)
    await local.initialize(async () => {})
    const result = await local.exclusive(root, () => local.change({ root, name: 'example', kind: 'install', manifest: { version: '2.0.0' } }, async () => {
      await peer.wait('prepared')
      await writeFile(path.join(root, 'example', 'package.json'), JSON.stringify({ name: 'example', version: '2.0.0' }))
    }))
    expect(result.instances).toContainEqual(expect.objectContaining({ instance: '第二个实例', pid: peer.process.pid, status: 'reloaded' }))
    expect(await peer.wait('finished')).toMatchObject({ version: '2.0.0', applied: true })
  })

  it('holds a newly starting instance outside a directory while its writer owns the lock', async () => {
    const root = await directory()
    const holder = child(root, 'holder', 'lock')
    await holder.wait('locked')
    const newcomer = child(root, 'newcomer')
    await newcomer.wait('starting')
    await new Promise(resolve => setTimeout(resolve, 150))
    expect(newcomer.messages.some(message => message.event === 'ready')).toBe(false)
    await kill(holder.process)
    await newcomer.wait('ready')
  })

  it('registers readonly readers outside the package root and refuses a writer before replacement', async () => {
    const root = await directory()
    const options = { roots: [root], async prepare() {}, async finish() { return { status: 'unchanged' as const, entries: [] } }, warn() {} }
    const writer = new SharedPackages({ ...options, instance: 'writer' })
    const reader = new SharedPackages({ ...options, instance: 'readonly-reader' })
    coordinators.push(writer, reader)
    await writer.initialize(async () => {})
    const write = (await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises')).writeFile
    const denied = vi.spyOn(fs, 'writeFile').mockImplementation((...args: Parameters<typeof fs.writeFile>) => {
      if (String(args[0]).toLowerCase().startsWith(path.join(root, '.llbot-packages').toLowerCase()) && String(args[1]).includes(reader.id)) {
        return Promise.reject(Object.assign(new Error('read-only mount'), { code: 'EROFS' }))
      }
      return write(...args)
    })
    try { await reader.initialize(async () => {}) } finally { denied.mockRestore() }
    expect(reader.writable(root)).toBe(false)
    await expect(reader.exclusive(root, async () => {})).rejects.toThrow(/只读模式/)
    const replace = vi.fn(async () => {})
    await expect(writer.exclusive(root, () => writer.change({ root, name: 'example', kind: 'install', manifest: { version: '2.0.0' } }, replace))).rejects.toThrow(/readonly-reader.*只读模式/)
    expect(replace).not.toHaveBeenCalled()
    expect(JSON.parse(await readFile(path.join(root, 'example', 'package.json'), 'utf8')).version).toBe('1.0.0')
  })

  it('restores the old package after a writer dies between renames, then resumes surviving peers', async () => {
    const root = await directory()
    const observer = child(root, 'survivor')
    await observer.wait('ready')
    const writer = child(root, 'writer')
    await writer.wait('ready')
    writer.process.send({ action: 'crash-swap' })
    await writer.wait('mid-swap')
    await expect(readFile(path.join(root, 'example', 'package.json'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' })
    // A heartbeat must never resume the peer while the original writer still holds its OS lock.
    await new Promise(resolve => setTimeout(resolve, 1100))
    expect(observer.messages.some(message => message.event === 'finished')).toBe(false)
    await kill(writer.process)
    expect(await observer.wait('finished')).toMatchObject({ version: '1.0.0', applied: false })
    expect(JSON.parse(await readFile(path.join(root, 'example', 'package.json'), 'utf8')).version).toBe('1.0.0')
    await vi.waitFor(async () => {
      await expect(readFile(path.join(root, '.llbot-packages', 'pending.json'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' })
    })
  })
})
