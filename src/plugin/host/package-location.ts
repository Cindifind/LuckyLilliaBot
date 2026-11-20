import { randomUUID } from 'node:crypto'
import { lstat, readFile, readdir, realpath, rename, rm, unlink } from 'node:fs/promises'
import path from 'node:path'

/** The scanned entry and its owning root, kept separately from the ESM package's real path. */
export interface PackageLocation {
  root: string
  directory: string
  kind: 'directory' | 'link'
}

export function scannedPackagePath(root: string, directory: string): string {
  const parts = directory.split('/')
  if (parts.length !== 1 && !(parts.length === 2 && parts[0].startsWith('@'))
    || parts.some(part => !part || part.startsWith('.') || part === 'node_modules' || /[\\:\x00-\x1f]/.test(part))) {
    throw new Error('插件路径必须是扫描根目录中的插件目录')
  }
  const target = path.resolve(root, ...parts)
  const relative = path.relative(root, target)
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('插件路径超出扫描根目录')
  return target
}

/** A symlink in @scope cannot be removed on behalf of one of its child packages. */
export async function inspectPackageLocation(root: string, candidate: string): Promise<PackageLocation | undefined> {
  const directory = path.relative(path.resolve(root), path.resolve(candidate)).split(path.sep).join('/')
  const canonical = await realpath(root)
  const target = scannedPackagePath(canonical, directory)
  const parent = path.dirname(target)
  if (parent !== canonical && (await lstat(parent)).isSymbolicLink()) return
  if (path.relative(parent, await realpath(parent)) !== '') return
  const entry = await lstat(target)
  if (!entry.isDirectory() && !entry.isSymbolicLink()) return
  return { root: canonical, directory, kind: entry.isSymbolicLink() ? 'link' : 'directory' }
}

/** Validate again under the root lock, never deleting a link's real target. */
export async function removeScannedPackage(location: PackageLocation, expectedRoot: string, expectedName: string): Promise<void> {
  const target = scannedPackagePath(location.root, location.directory)
  const current = await inspectPackageLocation(location.root, target)
  const manifest = JSON.parse(await readFile(path.join(target, 'package.json'), 'utf8')) as { name?: string }
  if (!current || current.kind !== location.kind || path.relative(expectedRoot, await realpath(target)) !== '' || manifest.name !== expectedName) {
    throw new Error('插件目录已变化，请重新扫描后再删除')
  }
  if (current.kind === 'link') {
    await unlink(target)
    return
  }
  const away = path.join(location.root, `.llbot-removed-${randomUUID()}`)
  // If any file is held open, fail before deleting files or configuration.
  await rename(target, away)
  // Logical removal is complete after rename; an open child cannot restore a half-deleted package.
  await rm(away, { recursive: true, force: true }).catch(() => {})
}

/** Retry incomplete cleanup only for this operation's direct, hidden scratch entries under a locked root. */
export async function cleanupRemovedPackages(root: string): Promise<void> {
  for (const item of await readdir(root)) {
    if (/^\.llbot-removed-[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(item)) {
      await rm(path.join(root, item), { recursive: true, force: true }).catch(() => {})
    }
  }
}
