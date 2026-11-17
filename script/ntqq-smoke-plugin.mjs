import { existsSync, mkdirSync, readFileSync, realpathSync, symlinkSync } from 'node:fs'
import path from 'node:path'

export const ntqqPackage = '@luckylillia/plugin-nt-protocol'
export const defaultNTQQPlugin = root => path.resolve(root, '../LuckyLillia.Plugins/lucky-lillia-plugin-ntqq-protocol')

export function nativeBundleRoot(directory) {
  const root = realpathSync(directory)
  const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
  if (manifest.name !== ntqqPackage || !existsSync(path.join(root, 'lib/index.js'))) {
    throw new Error('Build the standalone NTQQ plugin first; --plugin-dir must point to its package directory')
  }
  return path.join(root, 'native/production')
}

/** Make only this package discoverable; dependencies resolve from the package's real node_modules directory. */
export function exposeNTQQPlugin(workspace, directory) {
  nativeBundleRoot(directory)
  const root = path.join(workspace, 'plugins')
  mkdirSync(root, { recursive: true })
  symlinkSync(realpathSync(directory), path.join(root, 'ntqq'), process.platform === 'win32' ? 'junction' : 'dir')
  return root
}
