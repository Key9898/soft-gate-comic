import { unwrapApiData } from '@softgate/contracts'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { persist } from '../persist.js'
import { testEnv } from './helpers.js'

type PublishedCatalog = Awaited<ReturnType<typeof persist.getPublishedCatalog>>

const jsonHeaders = { 'Content-Type': 'application/json' }

const registerBody = {
  email: 'reader@example.com',
  password: 'password1',
  username: 'readerone',
  displayName: 'Reader One',
}

function cookieHeader(res: Response) {
  return res.headers
    .getSetCookie()
    .map((part) => part.split(';')[0])
    .join('; ')
}

describe('GET /api/catalog', () => {
  beforeEach(async () => {
    await persist.clearAuth()
  })

  afterEach(async () => {
    await persist.clearAuth()
  })

  it('returns the published catalog envelope from the stub', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/api/catalog')
    expect(res.status).toBe(200)
    expect(res.headers.get('Set-Cookie')).toBeNull()

    const body: unknown = await res.json()
    const catalog = unwrapApiData<PublishedCatalog>(body)
    expect(catalog).not.toBeNull()
    expect(Array.isArray(catalog?.webtoons)).toBe(true)
    expect(Array.isArray(catalog?.episodes)).toBe(true)
    expect(catalog!.episodes.every((episode) => episode.status !== 'draft')).toBe(true)
    expect(catalog!.episodes.some((episode) => episode.status === 'scheduled')).toBe(true)
  })

  it('strips locked premium images for guests and keeps wait-free and free panels', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/api/catalog')
    expect(res.status).toBe(200)

    const catalog = unwrapApiData<PublishedCatalog>(await res.json())
    const locked = catalog!.episodes.find(
      (episode) => episode.webtoonId === '1' && episode.episodeNumber === 4
    )
    const waitFree = catalog!.episodes.find(
      (episode) => episode.webtoonId === '2' && episode.episodeNumber === 3
    )
    const free = catalog!.episodes.find(
      (episode) => episode.webtoonId === '1' && episode.episodeNumber === 1
    )

    expect(locked?.isPremium).toBe(true)
    expect(locked?.freeAt).toBeUndefined()
    expect(locked?.images).toEqual([])
    expect(waitFree?.isPremium).toBe(true)
    expect(waitFree?.images.length).toBeGreaterThan(0)
    expect(free?.isPremium).toBe(false)
    expect(free?.images.length).toBeGreaterThan(0)
  })

  it('never 401s on a bad access cookie', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/api/catalog', {
      headers: { Cookie: 'sg_reader=not-a-jwt' },
    })
    expect(res.status).toBe(200)
    const catalog = unwrapApiData<PublishedCatalog>(await res.json())
    const locked = catalog!.episodes.find(
      (episode) => episode.webtoonId === '1' && episode.episodeNumber === 4
    )
    expect(locked?.images).toEqual([])
  })

  it('returns locked panel URLs after the member unlocks', async () => {
    const app = createApp(testEnv())
    const registered = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const cookie = cookieHeader(registered)

    const before = unwrapApiData<PublishedCatalog>(
      await (
        await app.request('/api/catalog', {
          headers: { Cookie: cookie },
        })
      ).json()
    )
    expect(
      before!.episodes.find((episode) => episode.webtoonId === '1' && episode.episodeNumber === 4)
        ?.images
    ).toEqual([])

    const unlocked = await app.request('/api/wallet/unlock', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: '1', episodeNumber: 4 }),
    })
    expect(unlocked.status).toBe(200)

    const after = unwrapApiData<PublishedCatalog>(
      await (
        await app.request('/api/catalog', {
          headers: { Cookie: cookie },
        })
      ).json()
    )
    const episode = after!.episodes.find((row) => row.webtoonId === '1' && row.episodeNumber === 4)
    expect(episode?.images.length).toBeGreaterThan(0)
  })
})

describe('GET/PUT /api/data', () => {
  it('does not implement the catalog blob dump', async () => {
    const app = createApp(testEnv())
    expect((await app.request('/api/data')).status).toBe(404)
    expect((await app.request('/api/data', { method: 'PUT' })).status).toBe(404)
  })
})
