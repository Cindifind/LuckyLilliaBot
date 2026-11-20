import { createHash } from 'node:crypto'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Registries, RegistryError, type PackageVersion, type Packument } from '@/plugin/internal/tool/market/registry'
import { MarketSchema, marketSettings, registriesOf } from '@/plugin/internal/tool/market/settings'

const archive = Buffer.from('package contents')
const integrity = 'sha512-' + createHash('sha512').update(archive).digest('base64')

function version(name: string, number: string, tarball: string): PackageVersion {
  return { name, version: number, dist: { tarball, integrity } }
}

function document(name: string, origin: string, numbers = ['1.0.0']): Packument {
  const file = name.split('/').pop()
  return {
    name,
    'dist-tags': { latest: numbers.at(-1)! },
    versions: Object.fromEntries(numbers.map(number => [number, version(name, number, `${origin}/${name}/-/${file}-${number}.tgz`)])),
  }
}

type Answer = Response | 'unreachable'

/** A fetch that answers per URL; anything unlisted is a 404. Records each URL in order. */
function fake(answers: Record<string, () => Answer>) {
  const calls: string[] = []
  const fetch = async (url: string) => {
    calls.push(url)
    const answer = answers[url]?.() ?? new Response('{}', { status: 404 })
    if (answer === 'unreachable') throw new TypeError('fetch failed', { cause: { code: 'ECONNREFUSED' } })
    return answer
  }
  return { fetch, calls }
}

const json = (body: unknown) => () => new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } })
const bytes = (body: Buffer) => () => new Response(body)

const A = 'https://mirror-a.example'
const B = 'https://mirror-b.example'
const C = 'https://mirror-c.example'

afterEach(() => {
  vi.useRealTimers()
})

describe('several npm registries', () => {
  it('asks the next registry when one cannot be reached, then tries it last for a while', async () => {
    const { fetch, calls } = fake({ [`${A}/pkg`]: () => 'unreachable', [`${B}/pkg`]: json(document('pkg', B)) })
    const registries = new Registries([A, B], fetch)
    expect((await registries.packument('pkg')).name).toBe('pkg')
    expect(calls).toEqual([`${A}/pkg`, `${B}/pkg`])

    calls.length = 0
    await registries.packument('pkg')
    expect(calls).toEqual([`${B}/pkg`])
  })

  it('goes back to the first registry once the retry delay has passed', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    let up = false
    const { fetch, calls } = fake({
      [`${A}/pkg`]: () => up ? json(document('pkg', A))() : 'unreachable',
      [`${B}/pkg`]: json(document('pkg', B)),
    })
    const registries = new Registries([A, B], fetch)
    await registries.packument('pkg')
    up = true
    vi.setSystemTime(Date.now() + 5 * 60_000 + 1)
    calls.length = 0
    expect(Object.values((await registries.packument('pkg')).versions)[0].dist.tarball).toContain(A)
    expect(calls).toEqual([`${A}/pkg`])
  })

  it('passes over a 404 without marking the registry down, and reports 404 when nobody has the package', async () => {
    const { fetch, calls } = fake({ [`${B}/pkg`]: json(document('pkg', B)) })
    const registries = new Registries([A, B], fetch)
    await registries.packument('pkg')
    calls.length = 0
    await registries.packument('pkg')
    expect(calls).toEqual([`${A}/pkg`, `${B}/pkg`])

    const missing = await registries.packument('missing').catch(e => e)
    expect(missing).toBeInstanceOf(RegistryError)
    expect(missing.status).toBe(404)
  })

  it('reports every registry when none can answer', async () => {
    const { fetch } = fake({ [`${A}/pkg`]: () => 'unreachable', [`${B}/pkg`]: () => new Response('down', { status: 503 }) })
    const error = await new Registries([A, B], fetch).packument('pkg').catch(e => e)
    expect(error).toBeInstanceOf(RegistryError)
    expect(error.status).toBeUndefined()
    expect(error.message).toContain('mirror-a.example')
    expect(error.message).toContain('mirror-b.example')
  })

  it('asks the next registry for a version a mirror has not synced yet, else returns the first document', async () => {
    const { fetch } = fake({
      [`${A}/pkg`]: json(document('pkg', A, ['1.0.0'])),
      [`${B}/pkg`]: json(document('pkg', B, ['1.0.0', '2.0.0'])),
    })
    const registries = new Registries([A, B], fetch)
    const has = (number: string) => (doc: Packument) => Object.hasOwn(doc.versions, number)
    expect(Object.keys((await registries.packument('pkg', true, has('2.0.0'))).versions)).toEqual(['1.0.0', '2.0.0'])
    // Without a need the first answer is enough
    expect(Object.keys((await registries.packument('pkg')).versions)).toEqual(['1.0.0'])
    // Nobody has 3.0.0: the caller gets the first document to say what is missing
    expect(Object.keys((await registries.packument('pkg', true, has('3.0.0'))).versions)).toEqual(['1.0.0'])
  })

  it('downloads a tarball from the same path on the next registry, rejecting a corrupt copy', async () => {
    const { fetch, calls } = fake({
      [`${A}/pkg/-/pkg-1.0.0.tgz`]: () => new Response('down', { status: 502 }),
      [`${B}/pkg/-/pkg-1.0.0.tgz`]: bytes(Buffer.from('tampered')),
      [`${C}/pkg/-/pkg-1.0.0.tgz`]: bytes(archive),
    })
    const registries = new Registries([A, B, C], fetch)
    expect(await registries.tarball(version('pkg', '1.0.0', `${A}/pkg/-/pkg-1.0.0.tgz`))).toEqual(archive)
    expect(calls).toEqual([`${A}/pkg/-/pkg-1.0.0.tgz`, `${B}/pkg/-/pkg-1.0.0.tgz`, `${C}/pkg/-/pkg-1.0.0.tgz`])
  })

  it('falls back to the standard path for a tarball on a host that is no configured registry', async () => {
    const cdn = 'https://cdn.example/files/abc.tgz'
    const { fetch, calls } = fake({
      [cdn]: () => 'unreachable',
      [`${B}/@scope/pkg/-/pkg-1.0.0.tgz`]: bytes(archive),
    })
    expect(await new Registries([A, B], fetch).tarball(version('@scope/pkg', '1.0.0', cdn))).toEqual(archive)
    expect(calls).toEqual([cdn, `${A}/@scope/pkg/-/pkg-1.0.0.tgz`, `${B}/@scope/pkg/-/pkg-1.0.0.tgz`])
  })

  it('treats the same registry written twice, or with a trailing slash, as one', () => {
    expect(new Registries([A, A + '/', B]).registries.map(registry => registry.url)).toEqual([A, B])
  })
})

describe('market mirror settings', () => {
  it('uses npm itself as the default mirror and keeps an old config with only a registry working', () => {
    const value = MarketSchema({ registry: 'https://registry.example' })
    expect(registriesOf(value)).toEqual(['https://registry.example', 'https://registry.npmjs.org'])
  })

  it('drops blank rows, repeats and the main registry from the mirrors', () => {
    const normalized = marketSettings.normalize!({
      registry: ' https://registry.example ',
      mirrors: [' https://b.example ', '', 'https://registry.example/', 'https://b.example/', 'https://c.example'],
      catalog: ' catalog ',
    })
    expect(normalized).toEqual({ registry: 'https://registry.example', mirrors: ['https://b.example', 'https://c.example'], catalog: 'catalog' })
  })

  it('leaves absent mirrors absent so the default applies, and allows an empty list', () => {
    expect(marketSettings.normalize!({ registry: 'https://registry.example' } as never).mirrors).toBeUndefined()
    const none = MarketSchema(marketSettings.normalize!({ registry: 'https://registry.example', mirrors: [], catalog: 'catalog' }))
    expect(registriesOf(none)).toEqual(['https://registry.example'])
  })

  it('points at the mirror row that is no web address', () => {
    const issues = marketSettings.check!({ registry: 'https://registry.example', mirrors: ['https://ok.example', 'ftp://bad.example'], catalog: 'catalog' }, true)
    expect(issues).toEqual([expect.objectContaining({ path: ['mirrors', '1'] })])
  })
})
