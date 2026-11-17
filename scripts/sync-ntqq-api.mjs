/** Refresh the vendored, side-effect-free API and type contracts from a built NTQQ plugin package. */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const plugin = path.resolve(process.argv[2] || path.join(root, '../LuckyLillia.Plugins/lucky-lillia-plugin-ntqq-protocol'))
const output = path.join(root, 'src/ntqq')
const pkg = JSON.parse(await fs.readFile(path.join(plugin, 'package.json'), 'utf8'))
if (pkg.name !== '@luckylillia/plugin-nt-protocol') throw new Error('Expected the NTQQ plugin package')
const within = (dir, file) => file.startsWith(dir + path.sep)
const copied = new Set()
const generated = new Set()
async function copyModule(file) {
  const dir = path.join(plugin, 'lib')
  if (!within(dir, file)) throw new Error('API import escaped the package')
  if (copied.has(file)) return
  copied.add(file)
  const code = await fs.readFile(file, 'utf8')
  if (/loadNative|getNativeAddon|setupSign|class (?:Direct|Native)QQProtocol/.test(code)) {
    throw new Error('Public API unexpectedly includes native or login implementation: ' + file)
  }
  const dest = path.join(output, 'runtime', path.relative(dir, file))
  generated.add(dest)
  await fs.mkdir(path.dirname(dest), { recursive: true })
  await fs.writeFile(dest, code.replace(/^\/\/# sourceMappingURL=.*$/gm, ''))
  for (const match of code.matchAll(/(?:from|import)\s*['"](\.[^'"]+)['"]/g)) {
    await copyModule(path.resolve(path.dirname(file), match[1]))
  }
}
await copyModule(path.join(plugin, 'lib/api.js'))
await copyModule(path.join(plugin, 'lib/types.js'))
// These are declarations only: keeping the public signatures does not bundle protocol implementations.
const declarations = path.join(plugin, 'lib/declarations')
const visited = new Set()
async function copyDeclaration(file) {
  if (visited.has(file)) return
  if (!within(declarations, file)) throw new Error('Declaration escaped public output: ' + file)
  visited.add(file)
  const code = await fs.readFile(file, 'utf8')
  const dest = path.join(output, 'contracts', path.relative(declarations, file))
  generated.add(dest)
  await fs.mkdir(path.dirname(dest), { recursive: true })
  await fs.writeFile(dest, code)
  for (const match of code.matchAll(/(?:from|import\()\s*['"](\.[^'"]+)['"]/g)) {
    const target = path.resolve(path.dirname(file), match[1])
    const options = [target + '.d.ts', path.join(target, 'index.d.ts')]
    let found
    for (const option of options) { try { await fs.access(option); found = option; break } catch {} }
    if (found) await copyDeclaration(found)
    else if (match[1].endsWith('.json')) {
      // TypeScript declarations retain JSON imports, but emitDeclarationOnly does not copy their data.
      let source = target
      if (!within(declarations, source)) throw new Error('JSON declaration escaped package')
      try { await fs.access(source) } catch {
        source = path.resolve(plugin, 'src', path.relative(declarations, target))
        if (!within(path.join(plugin, 'src'), source)) throw new Error('JSON declaration escaped source')
      }
      const jsonDest = path.join(output, 'contracts', path.relative(declarations, target))
      await fs.mkdir(path.dirname(jsonDest), { recursive: true })
      await fs.copyFile(source, jsonDest)
      generated.add(jsonDest)
    } else throw new Error('Unresolved public type: ' + match[1] + ' in ' + file)
  }
}
await copyDeclaration(path.join(declarations, 'contracts.d.ts'))
await copyDeclaration(path.join(declarations, 'api.d.ts'))
await copyDeclaration(path.join(declarations, 'types.d.ts'))
await fs.writeFile(path.join(output, 'runtime/api.d.ts'), "export * from '../contracts/api'\n")
await fs.writeFile(path.join(output, 'runtime/types.d.ts'), "export * from '../contracts/types'\n")
generated.add(path.join(output, 'runtime/api.d.ts'))
generated.add(path.join(output, 'runtime/types.d.ts'))
await fs.writeFile(path.join(output, 'api.ts'), "// Generated public API snapshot; update with scripts/sync-ntqq-api.mjs.\nexport * from './runtime/api.js'\nimport type {} from './contracts/contracts'\n")
await fs.writeFile(path.join(output, 'types.ts'), "// Generated browser-safe NTQQ enums and type exports.\nexport * from './runtime/types.js'\n")
await fs.writeFile(path.join(output, 'source.json'), JSON.stringify({ package: pkg.name, version: pkg.version,
  note: 'Public API and declarations only. Native, login, sessions and account services are supplied by the installed plugin.' }, null, 2) + '\n')
const actionNames = JSON.parse(await fs.readFile(path.join(plugin, 'lib/onebot-actions.json'), 'utf8'))
if (!Array.isArray(actionNames) || !actionNames.length || actionNames.some(name => typeof name !== 'string' || !name)) throw new Error('Invalid NTQQ OneBot action name manifest')
await fs.writeFile(path.join(output, 'onebot-actions.json'), JSON.stringify([...new Set(actionNames)].sort(), null, 2) + '\n')
const internalMethods = JSON.parse(await fs.readFile(path.join(plugin, 'lib/onebot-internal.json'), 'utf8'))
if (!internalMethods || Array.isArray(internalMethods) || typeof internalMethods !== 'object'
  || !Object.keys(internalMethods).length
  || Object.entries(internalMethods).some(([method, action]) => !method || !actionNames.includes(action))) {
  throw new Error('Invalid NTQQ bot.internal method manifest')
}
await fs.writeFile(path.join(output, 'onebot-internal.json'), JSON.stringify(internalMethods, null, 2) + '\n')
// Hash-named chunks from the previous snapshot must not accumulate. Only touch these generated directories.
for (const directory of ['runtime', 'contracts']) {
  const owned = path.resolve(output, directory)
  if (!within(path.resolve(root, 'src/ntqq'), owned)) throw new Error('Unsafe generated output directory')
  async function prune(dir) {
    for (const item of await fs.readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, item.name)
      if (!within(owned, file)) throw new Error('Unsafe generated output path')
      if (item.isDirectory()) {
        await prune(file)
        if (!(await fs.readdir(file)).length) await fs.rmdir(file)
      } else if (!generated.has(file)) await fs.unlink(file)
    }
  }
  await prune(owned)
}
console.log('Synced ' + copied.size + ' public API files and ' + visited.size + ' declaration files')
