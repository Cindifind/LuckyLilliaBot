import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs'
import { realpath } from 'node:fs/promises'
import path from 'node:path'
import { Context } from 'cordis'
import TimerService from '@cordisjs/plugin-timer'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import PluginService from '@/plugin/host'
import { createPluginRoutes } from '@/plugin/internal/service/webui/BE/routes/plugins'
import { scannedPackagePath } from '@/plugin/host/package-location'

const name = '@luckylillia/plugin-aiprovider'
const contexts: Context[] = []
let work: string
let root: string

function writePlugin(directory: string, packageName = name) {
  mkdirSync(directory, { recursive: true })
  writeFileSync(path.join(directory, 'package.json'), JSON.stringify({ name: packageName, version: '1.0.1', type: 'module', main: 'index.js', llbot: {} }))
  writeFileSync(path.join(directory, 'index.js'), 'export function apply() {}')
  writeFileSync(path.join(directory, 'source.txt'), 'original source')
}

async function boot(instance: string, roots = [root]) {
  const ctx = new Context()
  contexts.push(ctx)
  const file = path.join(work, `${instance}.json`)
  await ctx.plugin(TimerService)
  await ctx.plugin(PluginService, { file, roots, instance })
  return { ctx, file }
}

beforeEach(() => {
  mkdirSync('.tmp', { recursive: true })
  work = mkdtempSync(path.resolve('.tmp', 'local-removal-'))
  root = path.join(work, 'plugins')
  mkdirSync(root)
})

afterEach(async () => {
  for (const ctx of contexts.splice(0).reverse()) await ctx.fiber.dispose()
  rmSync(work, { recursive: true, force: true })
})

describe('local plugin removal', () => {
  it('removes an active directory in another scan root through the host API, retaining configuration', async () => {
    const additional = path.join(work, 'additional')
    const directory = path.join(additional, 'developer-ai')
    writePlugin(directory)
    writeFileSync(path.join(additional, 'unrelated.txt'), 'keep')
    const { ctx, file } = await boot('local', [root, additional])
    const entry = ctx.plugins.list()[0]
    await ctx.plugins.updateConfig(entry.id, { key: 'fixture-secret' })
    await ctx.plugins.enable(entry.id)
    expect(ctx.plugins.get(entry.id)).toMatchObject({ state: 'active', removal: { path: await realpath(directory), kind: 'directory' } })
    const response = await createPluginRoutes(ctx).request(`/${entry.id}/uninstall`, { method: 'POST', body: JSON.stringify({ keepConfig: true }) })
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ success: true, data: { removed: [entry.id], instances: [expect.objectContaining({ status: 'removed' })] } })
    expect(ctx.plugins.list()).toEqual([])
    expect(existsSync(directory)).toBe(false)
    expect(readFileSync(path.join(additional, 'unrelated.txt'), 'utf8')).toBe('keep')
    expect(JSON.parse(readFileSync(file, 'utf8')).retained).toEqual([expect.objectContaining({ id: entry.id, disabled: true, config: { key: 'fixture-secret' } })])
  })

  it.each([false, true])('unlinks a scoped development junction without deleting its source or peer configuration (%s)', async keepConfig => {
    const source = path.join(work, 'source-repo')
    writePlugin(source)
    mkdirSync(path.join(root, '@dev'))
    const link = path.join(root, '@dev', 'ai')
    symlinkSync(source, link, 'junction')
    const { ctx, file } = await boot('first')
    const peer = await boot('second')
    const first = ctx.plugins.list()[0]
    const other = peer.ctx.plugins.list()[0]
    await ctx.plugins.enable(first.id)
    await peer.ctx.plugins.enable(other.id)
    expect(ctx.plugins.get(first.id).removal).toEqual({ path: link, kind: 'link' })
    const result = await ctx.plugins.uninstallPackage(name, { keepConfig })
    expect(result.instances.map(item => item.status)).toEqual(['removed', 'removed'])
    expect(() => lstatSync(link)).toThrow()
    expect(readFileSync(path.join(source, 'source.txt'), 'utf8')).toBe('original source')
    expect(ctx.plugins.list()).toEqual([])
    expect(peer.ctx.plugins.list()).toEqual([])
    expect(JSON.parse(readFileSync(file, 'utf8')).retained?.length).toBe(keepConfig ? 1 : undefined)
    expect(JSON.parse(readFileSync(peer.file, 'utf8')).retained).toEqual([expect.objectContaining({ id: other.id, disabled: true })])
  })

  it('deletes an ordinary directory without following links nested inside it', async () => {
    const source = path.join(work, 'shared-source')
    writePlugin(source, 'unrelated')
    const directory = path.join(root, 'ai')
    writePlugin(directory)
    symlinkSync(source, path.join(directory, 'linked-library'), 'junction')
    const { ctx } = await boot('local')
    await ctx.plugins.uninstallPackage(name)
    expect(existsSync(directory)).toBe(false)
    expect(readFileSync(path.join(source, 'source.txt'), 'utf8')).toBe('original source')
  })

  it('refuses a linked scope so deleting one plugin cannot remove another source directory', async () => {
    const scope = path.join(work, 'source-scope')
    writePlugin(path.join(scope, 'ai'))
    symlinkSync(scope, path.join(root, '@dev'), 'junction')
    const { ctx } = await boot('local')
    expect(ctx.plugins.list()[0].removal).toBeUndefined()
    await expect(ctx.plugins.uninstallPackage(name)).rejects.toThrow('链接作用域目录')
    expect(lstatSync(path.join(root, '@dev')).isSymbolicLink()).toBe(true)
    expect(readFileSync(path.join(scope, 'ai', 'source.txt'), 'utf8')).toBe('original source')
  })

  it('does not expose or execute removal in a readonly scan root', async () => {
    writePlugin(path.join(root, 'ai'))
    writeFileSync(path.join(root, '.llbot-packages'), 'readonly coordination state')
    const { ctx } = await boot('readonly')
    expect(ctx.plugins.list()[0].removal).toBeUndefined()
    await expect(ctx.plugins.uninstallPackage(name)).rejects.toThrow('只读模式')
    expect(existsSync(path.join(root, 'ai'))).toBe(true)
  })

  it('refuses a link changed after the list was scanned', async () => {
    const source = path.join(work, 'source-first')
    const replacement = path.join(work, 'source-second')
    writePlugin(source)
    writePlugin(replacement)
    const link = path.join(root, 'ai')
    symlinkSync(source, link, 'junction')
    const { ctx } = await boot('local')
    unlinkSync(link)
    symlinkSync(replacement, link, 'junction')
    await expect(ctx.plugins.uninstallPackage(name)).rejects.toThrow('插件目录已变化')
    expect(lstatSync(link).isSymbolicLink()).toBe(true)
    expect(existsSync(source)).toBe(true)
    expect(existsSync(replacement)).toBe(true)
  })

  it('refuses deletion if a peer selects a different link to the same source package', async () => {
    const source = path.join(work, 'source')
    const otherRoot = path.join(work, 'other')
    writePlugin(source)
    mkdirSync(otherRoot)
    symlinkSync(source, path.join(root, 'ai'), 'junction')
    symlinkSync(source, path.join(otherRoot, 'ai'), 'junction')
    const { ctx } = await boot('first')
    const peer = await boot('second', [otherRoot, root])
    await ctx.plugins.enable(ctx.plugins.list()[0].id)
    await peer.ctx.plugins.enable(peer.ctx.plugins.list()[0].id)
    await expect(ctx.plugins.uninstallPackage(name)).rejects.toThrow('其他目录中的同名包')
    expect(lstatSync(path.join(root, 'ai')).isSymbolicLink()).toBe(true)
    expect(ctx.plugins.list()[0].state).toBe('active')
    expect(peer.ctx.plugins.list()[0].state).toBe('active')
  })

  it.each(['', '..', '../source', '@dev/../source', 'node_modules', '.llbot-packages', 'a/b', 'C:/source', 'a\\b'])('rejects non-package deletion paths (%s)', directory => {
    expect(() => scannedPackagePath(root, directory)).toThrow()
  })
})
