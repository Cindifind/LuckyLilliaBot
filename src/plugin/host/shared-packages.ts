import { createHash, randomUUID } from 'node:crypto'
import { existsSync } from 'node:fs'
import { lstat, mkdir, readFile, readdir, readlink, realpath, rename, rm, writeFile } from 'node:fs/promises'
import net, { type AddressInfo } from 'node:net'
import { hostname, tmpdir } from 'node:os'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { cleanupRemovedPackages, scannedPackagePath } from './package-location'

export interface SharedPackageChange {
  id: string
  root: string
  name: string
  /** Scanned directory relative to root; absent for the conventional npm package layout. */
  directory?: string
  kind: 'install' | 'uninstall'
  manifest?: Record<string, any>
  builtin?: boolean
  initiator: string
  keepConfig?: boolean
}

export interface SharedPackageResult {
  instance: string
  pid: number
  status: 'reloaded' | 'unchanged' | 'removed' | 'restart-required' | 'failed'
  reason?: string
  entries?: string[]
}

interface Peer { id: string; instance: string; pid: number; host: string; environment: string; port: number; secret: string }
interface Pending { change: SharedPackageChange; applied: boolean; peers: Peer[] }
interface Call { secret: string; action: 'ping' | 'prepare' | 'finish'; change?: SharedPackageChange; applied?: boolean }

const STATE = '.llbot-packages'
const WAIT = 120_000
const RPC_TIMEOUT = 30_000

function semaphore(root: string): string | number {
  const digest = createHash('sha256').update(root).digest()
  return process.platform === 'win32' ? `\\\\.\\pipe\\llbot-packages-${digest.toString('hex')}` : 20_000 + digest.readUInt32BE(0) % 20_000
}

async function environmentIdentity(): Promise<string> {
  if (process.platform !== 'linux') return `${process.platform}:${hostname()}`
  // Equal Docker hostnames do not imply a shared PID namespace or a shared kernel-held semaphore.
  const [boot, pid, network] = await Promise.all([readFile('/proc/sys/kernel/random/boot_id', 'utf8'),
    readlink('/proc/self/ns/pid'), readlink('/proc/self/ns/net')])
  return `${boot.trim()}:${pid}:${network}`
}

/** The same user's readonly readers must be discoverable by writable peers without writing the package root. */
function localPeerDirectory(root: string): string {
  return path.join(tmpdir(), 'llbot-plugin-peers', createHash('sha256').update(root).digest('hex'))
}

/** Resolve aliases before grouping. Packages in the same physical directory have one writer. */
export async function packageRoot(root: string): Promise<string> {
  await mkdir(root, { recursive: true })
  const canonical = await realpath(root)
  return process.platform === 'win32' ? canonical.toLowerCase() : canonical
}

/**
 * A kernel-held local semaphore, released even on SIGKILL. Port collisions only serialize unrelated roots;
 * they never allow two writers. No stale PID/heartbeat is used to evict a live owner. Loopback only.
 * Unlike Unix socket files this has no stale-unlink race after an unclean process exit.
 */
export async function withPackageRootLock<T>(root: string, task: () => Promise<T>, timeout = WAIT): Promise<T> {
  const canonical = await packageRoot(root)
  const endpoint = semaphore(canonical)
  const deadline = Date.now() + timeout
  for (;;) {
    const server = net.createServer(socket => socket.destroy())
    const error = await new Promise<NodeJS.ErrnoException | undefined>(resolve => {
      server.once('error', resolve)
      if (typeof endpoint === 'string') server.listen(endpoint, () => resolve(undefined))
      else server.listen({ host: '127.0.0.1', port: endpoint, exclusive: true }, () => resolve(undefined))
    })
    if (!error) {
      server.unref()
      try { return await task() } finally { await new Promise<void>(resolve => server.close(() => resolve())) }
    }
    server.close()
    if (error.code !== 'EADDRINUSE') throw error
    if (Date.now() >= deadline) throw new Error(`插件目录正在被另一个实例操作，或本机协调端点被占用：${root}`)
    await delay(50)
  }
}

async function json<T>(file: string): Promise<T | undefined> {
  try { return JSON.parse(await readFile(file, 'utf8')) as T } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return
    throw error
  }
}

async function save(file: string, value: unknown) {
  await mkdir(path.dirname(file), { recursive: true })
  const temporary = `${file}.${randomUUID()}.tmp`
  try {
    await writeFile(temporary, JSON.stringify(value), { mode: 0o600 })
    await rename(temporary, file)
  } finally { await rm(temporary, { force: true }).catch(() => {}) }
}

function request<T>(peer: Peer, call: Omit<Call, 'secret'>, timeout = RPC_TIMEOUT): Promise<T> {
  return new Promise((resolve, reject) => {
    const socket = net.connect({ host: '127.0.0.1', port: peer.port })
    socket.setEncoding('utf8')
    let buffer = ''
    let done = false
    const finish = (error?: Error, value?: T) => {
      if (done) return
      done = true
      socket.destroy()
      error ? reject(error) : resolve(value!)
    }
    socket.setTimeout(timeout, () => finish(new Error(`${peer.instance} (pid ${peer.pid}) 未响应插件协调请求`)))
    socket.on('error', finish)
    socket.on('end', () => finish(new Error(`${peer.instance} 在插件协调期间断开连接`)))
    socket.on('connect', () => socket.write(JSON.stringify({ ...call, secret: peer.secret }) + '\n'))
    socket.on('data', chunk => {
      buffer += chunk.toString()
      if (buffer.length > 1024 * 1024) return finish(new Error('插件协调消息过大'))
      if (!buffer.includes('\n')) return
      try {
        const reply = JSON.parse(buffer.slice(0, buffer.indexOf('\n')))
        finish(reply.error ? new Error(reply.error) : undefined, reply.value)
      } catch (error) { finish(error as Error) }
    })
  })
}

/**
 * Every PluginService participates, including instances with Market and development HMR disabled.
 * The root lock covers registration, recovery, package changes and cleanup. The private RPC barrier
 * stops existing consumers before the filesystem swap. Results belong to each instance's own config.
 */
export class SharedPackages {
  readonly id = randomUUID()
  private readonly secret = randomUUID()
  private roots: string[] = []
  private server?: net.Server
  private peer?: Peer
  private timer?: NodeJS.Timeout
  private closing = false
  private readonly finished = new Map<string, SharedPackageResult>()
  private readonly requests = new Map<string, Promise<unknown>>()
  private readonly operations = new Set<Promise<unknown>>()
  private readonly readonlyRoots = new Set<string>()

  constructor(private readonly options: {
    roots: string[]
    instance: string
    prepare(change: SharedPackageChange): Promise<void>
    finish(change: SharedPackageChange, applied: boolean): Promise<Omit<SharedPackageResult, 'instance' | 'pid'>>
    warn(error: unknown): void
  }) {}

  async initialize(task: () => Promise<void>): Promise<void> {
    this.roots = [...new Set(await Promise.all(this.options.roots.map(packageRoot)))].sort()
    this.server = net.createServer(socket => {
      socket.setEncoding('utf8')
      let buffer = ''
      socket.setTimeout(RPC_TIMEOUT, () => socket.destroy())
      socket.on('error', () => {})
      socket.on('data', chunk => {
        buffer += chunk.toString()
        if (buffer.length > 1024 * 1024) return socket.destroy()
        if (!buffer.includes('\n')) return
        socket.removeAllListeners('data')
        let call: Call
        try { call = JSON.parse(buffer.slice(0, buffer.indexOf('\n'))) } catch { return socket.destroy() }
        if (call.secret !== this.secret) return socket.destroy()
        void this.receive(call).then(value => socket.end(JSON.stringify({ value }) + '\n'), error =>
          socket.end(JSON.stringify({ error: String(error instanceof Error ? error.message : error) }) + '\n'))
      })
    })
    await new Promise<void>((resolve, reject) => {
      this.server!.once('error', reject)
      this.server!.listen({ host: '127.0.0.1', port: 0 }, resolve)
    })
    this.server.unref()
    this.peer = { id: this.id, secret: this.secret, instance: this.options.instance, pid: process.pid, host: hostname(), environment: await environmentIdentity(),
      port: (this.server.address() as AddressInfo).port }
    // Deduplicate the rare Unix semaphore collision and use one total lock ordering across services.
    const lockRoots = [...new Map(this.roots.map(root => [semaphore(root), root])).entries()].sort(([a], [b]) => String(a).localeCompare(String(b))).map(([, root]) => root)
    const enter = async (index: number): Promise<void> => {
      if (index < lockRoots.length) return withPackageRootLock(lockRoots[index], () => enter(index + 1))
      for (const root of this.roots) {
        const local = localPeerDirectory(root)
        await mkdir(local, { recursive: true, mode: 0o700 })
        await save(path.join(local, `${this.id}.json`), this.peer)
        try {
          await save(path.join(root, STATE, 'peers', `${this.id}.json`), this.peer)
        } catch (error) {
          if (!['EROFS', 'EACCES', 'EPERM', 'ENOTDIR'].includes((error as NodeJS.ErrnoException).code ?? '')) throw error
          this.readonlyRoots.add(root)
          this.options.warn(`插件目录进入只读模式，可加载但不能安装、更新或卸载：${root}`)
        }
        if (this.readonlyRoots.has(root)) {
          if (existsSync(path.join(root, STATE, 'pending.json')) || existsSync(path.join(root, STATE, 'swap.json'))) {
            throw new Error(`只读插件目录有未完成的替换，请先由有写权限的实例恢复：${root}`)
          }
        } else await this.recover(root)
      }
      await task()
    }
    try { await enter(0) } catch (error) { await this.close(); throw error }
    this.timer = setInterval(() => {
      if (this.closing) return
      for (const root of this.roots) {
        if (this.readonlyRoots.has(root)) continue
        if (!existsSync(path.join(root, STATE, 'pending.json'))) continue
        // Never resume on a timeout alone: only the kernel can release the writer's lock.
        void withPackageRootLock(root, () => this.recover(root), 0).catch(() => {})
      }
    }, 1000)
    this.timer.unref()
  }

  async close() {
    this.closing = true
    if (this.timer) clearInterval(this.timer)
    await Promise.allSettled([...this.operations, ...this.requests.values()])
    this.server?.close()
    for (const root of this.roots) {
      await rm(path.join(root, STATE, 'peers', `${this.id}.json`), { force: true }).catch(() => {})
      await rm(path.join(localPeerDirectory(root), `${this.id}.json`), { force: true }).catch(() => {})
    }
  }

  writable(root: string): boolean {
    const normalized = process.platform === 'win32' ? path.resolve(root).toLowerCase() : path.resolve(root)
    return !this.readonlyRoots.has(normalized)
  }

  async exclusive<T>(root: string, task: () => Promise<T>): Promise<T> {
    if (this.closing) throw new Error('实例正在停止')
    const canonical = await packageRoot(root)
    if (!this.roots.includes(canonical)) throw new Error('插件目录未登记到跨实例协调服务')
    if (this.readonlyRoots.has(canonical)) throw new Error(`插件目录处于只读模式，无法安装、更新或卸载：${root}`)
    const operation = withPackageRootLock(canonical, async () => {
      if (this.closing) throw new Error('实例正在停止')
      await this.recover(canonical)
      return task()
    })
    this.operations.add(operation)
    try { return await operation } finally { this.operations.delete(operation) }
  }

  /** Called inside exclusive(), after downloads are prepared and before any installed files move. */
  async change<T>(input: Omit<SharedPackageChange, 'id' | 'initiator'>, apply: () => Promise<T>): Promise<{ value: T; instances: SharedPackageResult[] }> {
    const root = await packageRoot(input.root)
    const change: SharedPackageChange = { ...input, root, id: randomUUID(), initiator: this.id }
    const peers = await this.peers(root)
    const pending: Pending = { change, applied: false, peers }
    const file = path.join(root, STATE, 'pending.json')
    await save(file, pending)
    let value: T
    try {
      // A refusal, timeout, or lost live participant prevents the filesystem mutation.
      const prepared = await Promise.allSettled(peers.map(peer => request(peer, { action: 'prepare', change })))
      const failed = prepared.find((result): result is PromiseRejectedResult => result.status === 'rejected')
      if (failed) throw failed.reason
      value = await apply()
      pending.applied = true
      await save(file, pending)
    } catch (error) {
      await recoverPackageSwap(root)
      await this.finish(pending).catch(this.options.warn)
      throw error
    }
    const instances = await this.finish(pending)
    return { value, instances }
  }

  private receive(call: Call): Promise<unknown> {
    if (call.action === 'ping') return Promise.resolve(this.id)
    const change = call.change
    if (!change || !this.roots.includes(change.root)) return Promise.reject(new Error('未知插件协调目录'))
    const key = `${change.id}:${call.action}`
    const previous = this.requests.get(key)
    if (previous) return previous
    const pending = (async () => {
      if (call.action === 'prepare') {
        if (this.closing) throw new Error('实例正在停止')
        if (this.readonlyRoots.has(change.root)) throw new Error(`实例 ${this.options.instance} 正以只读模式使用插件目录，请先停止此实例后再更新`)
        await this.options.prepare(change)
        return
      }
      const cached = this.finished.get(change.id)
      if (cached) return cached
      // If a timed-out prepare is still running, its stop must finish before any resume.
      await this.requests.get(`${change.id}:prepare`)?.catch(() => {})
      const result = { instance: this.options.instance, pid: process.pid, ...await this.options.finish(change, !!call.applied) }
      this.finished.set(change.id, result)
      if (this.finished.size > 100) this.finished.delete(this.finished.keys().next().value!)
      return result
    })()
    this.requests.set(key, pending)
    void pending.finally(() => {
      if (call.action === 'finish') {
        this.requests.delete(key)
        this.requests.delete(`${change.id}:prepare`)
      }
    }).catch(() => {})
    return pending
  }

  private async peers(root: string): Promise<Peer[]> {
    const peers: Peer[] = []
    const seen = new Set<string>()
    const files: string[] = []
    for (const dir of [path.join(root, STATE, 'peers'), localPeerDirectory(root)]) {
      for (const name of await readdir(dir).catch(error => {
        if (['ENOENT', 'ENOTDIR'].includes(error.code)) return [] as string[]
        throw error
      })) if (name.endsWith('.json')) files.push(path.join(dir, name))
    }
    for (const file of files) {
      const peer = await json<Peer>(file)
      if (!peer) continue
      if (seen.has(peer.id)) continue
      seen.add(peer.id)
      if (peer.host !== hostname() || peer.environment !== this.peer?.environment) {
        // A different container/host has a different kernel semaphore. Its absence cannot be proven here.
        throw new Error('插件目录仍登记了其他主机的实例；请停止原环境并清理其登记后重试，跨容器请使用独立插件目录')
      }
      try {
        if (await request(peer, { action: 'ping' }, 3000) !== peer.id) throw new Error('插件协调端点身份不匹配')
        peers.push(peer)
      } catch (error) {
        // An unavailable endpoint is stale only if its recorded local process no longer exists.
        let alive = true
        try { process.kill(peer.pid, 0) } catch (error) { alive = (error as NodeJS.ErrnoException).code !== 'ESRCH' }
        if (alive) throw error
        await rm(file, { force: true })
        await rm(path.join(localPeerDirectory(root), `${peer.id}.json`), { force: true }).catch(() => {})
        await rm(path.join(root, STATE, 'peers', `${peer.id}.json`), { force: true }).catch(() => {})
      }
    }
    return peers
  }

  private async finish(pending: Pending): Promise<SharedPackageResult[]> {
    const instances = await Promise.all(pending.peers.map(async peer => {
      try { return await request<SharedPackageResult>(peer, { action: 'finish', change: pending.change, applied: pending.applied }) } catch (error) {
        return { instance: peer.instance, pid: peer.pid, status: 'failed' as const, reason: String(error instanceof Error ? error.message : error) }
      }
    }))
    await save(path.join(pending.change.root, STATE, 'last.json'), { ...pending, instances, at: Date.now() })
    // Keep failed RPCs recoverable. Runtime failures are acknowledged and visible in last.json / the entry.
    const unfinished = instances.some(item => item.status === 'failed' && !item.entries)
    if (!unfinished) await rm(path.join(pending.change.root, STATE, 'pending.json'), { force: true })
    for (const item of instances) if (item.status === 'failed') this.options.warn(`${item.instance}: ${item.reason}`)
    return instances
  }

  private async recover(root: string) {
    await recoverPackageSwap(root)
    await cleanupRemovedPackages(root)
    const pending = await json<Pending>(path.join(root, STATE, 'pending.json'))
    if (!pending) return
    const target = scannedPackagePath(root, pending.change.directory ?? pending.change.name)
    if (!pending.applied) {
      if (pending.change.kind === 'uninstall') pending.applied = !await lstat(target).catch(error => {
        if (error.code === 'ENOENT') return undefined
        throw error
      })
      else {
        const installed = await json<{ version?: string }>(path.join(target, 'package.json'))
        pending.applied = installed?.version === pending.change.manifest?.version
      }
    }
    // Remove dead participants; never start another instance or copy its config into this one.
    const live = await this.peers(root)
    pending.peers = pending.peers.filter(peer => live.some(item => item.id === peer.id))
    const results = await this.finish(pending)
    if (results.some(item => item.status === 'failed' && !item.entries)) throw new Error('上次共享插件更新尚未完成实例同步，请检查实例日志')
  }
}

/** Installer's tiny rename journal; only read/written while holding the root semaphore. */
export async function recordPackageSwap(root: string, target: string, scratch: string, old?: string) {
  await save(path.join(root, STATE, 'swap.json'), { target, scratch, old })
}

export async function recoverPackageSwap(root: string): Promise<void> {
  const file = path.join(root, STATE, 'swap.json')
  const journal = await json<{ target: string; scratch: string; old?: string }>(file)
  if (!journal) return
  for (const value of [journal.target, journal.scratch, journal.old].filter(Boolean) as string[]) {
    const relative = path.relative(root, value)
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Invalid plugin replacement recovery path')
  }
  if (!existsSync(journal.target) && journal.old && existsSync(journal.old)) await rename(journal.old, journal.target)
  if (existsSync(journal.target)) {
    // The installed target is complete; locked obsolete native files may remain for a later cleanup.
    await rm(journal.scratch, { recursive: true, force: true }).catch(() => {})
    if (journal.old) await rm(journal.old, { recursive: true, force: true }).catch(() => {})
  }
  await rm(file, { force: true })
}
