import { describe, expect, it } from 'vitest'
import type { Context } from 'cordis'
import { startupPluginError, startupPluginNames, startRequestedPlugins } from '@/main/startupPlugins'

describe('startup plugin arguments', () => {
  it('accepts scoped packages, repeated arguments, comma lists and deduplicates in input order', () => {
    expect(startupPluginNames(['node', 'llbot.js', '--plugin', '@luckylillia/plugin-nt-protocol', '--plugin=a,b', '--plugin', ' b, @example/c ', '--plugin=a'])).toEqual([
      '@luckylillia/plugin-nt-protocol', 'a', 'b', '@example/c',
    ])
  })
  it('leaves other arguments alone and respects the option terminator', () => {
    expect(startupPluginNames(['--plugin-dir', 'data/plugins', '--plugin-hmr', '--', '--plugin=ignored'])).toEqual([])
  })
  it.each(['', 'a,', ',a', 'a,,b', '@scope', '../local', 'file:local', 'https://example.com/p.tgz', 'name@1.0.0', '@scope/name@latest', 'a;whoami', 'a b', 'NAME', 'node_modules', 'favicon.ico', 'a'.repeat(215)])('rejects anything except package names: %s', value => {
    expect(() => startupPluginNames(['--plugin=' + value])).toThrow('--plugin')
  })
  it('rejects missing values and the next option instead of silently skipping the request', () => {
    expect(() => startupPluginNames(['--plugin'])).toThrow('--plugin')
    expect(() => startupPluginNames(['--plugin', '--instance=x'])).toThrow('--plugin')
  })
  it('does nothing without options, without accessing services or a registry', async () => {
    await expect(startRequestedPlugins({} as Context, [])).resolves.toBeUndefined()
  })
  it('redacts registry credentials and signed tarball queries from startup errors', () => {
    expect(startupPluginError(new Error('cannot download https://user:secret@example.com/p.tgz?token=hidden#fragment'))).toBe('cannot download https://example.com/p.tgz')
  })
})
