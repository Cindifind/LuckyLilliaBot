import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { SharedPackages, recordPackageSwap, withPackageRootLock } from '../../../src/plugin/host/shared-packages'

const [root, instance, mode] = process.argv.slice(2)
const send = (message: object) => process.send?.(message)
// Keep the IPC channel referenced even while the lock test intentionally waits forever.
process.on('message', () => {})

if (mode === 'lock') {
  await withPackageRootLock(root, async () => {
    send({ event: 'locked' })
    await new Promise(() => {})
  })
} else {
  const packages = new SharedPackages({
    roots: [root], instance,
    async prepare(change) { send({ event: 'prepared', name: change.name }) },
    async finish(change, applied) {
      const manifest = JSON.parse(await readFile(path.join(root, change.name, 'package.json'), 'utf8'))
      send({ event: 'finished', version: manifest.version, applied })
      return { status: 'reloaded', entries: [instance] }
    },
    warn(error) { send({ event: 'warning', error: String(error) }) },
  })
  send({ event: 'starting' })
  await packages.initialize(async () => {})
  send({ event: 'ready' })
  process.on('message', async (message: { action?: string }) => {
    if (message.action === 'close') {
      await packages.close()
      process.exit(0)
    }
    if (message.action === 'crash-swap') {
      await packages.exclusive(root, () => packages.change({ root, name: 'example', kind: 'install', manifest: { version: '2.0.0' } }, async () => {
        const target = path.join(root, 'example')
        const scratch = path.join(root, '.market-candidate')
        const old = path.join(root, '.market-old')
        await mkdir(scratch)
        await writeFile(path.join(scratch, 'package.json'), JSON.stringify({ name: 'example', version: '2.0.0' }))
        await recordPackageSwap(root, target, scratch, old)
        await rename(target, old)
        send({ event: 'mid-swap' })
        await new Promise(() => {})
      }))
    }
  })
}
