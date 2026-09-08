import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { persist } from '../persist.js'
import { testEnv } from './helpers.js'

const jsonHeaders = { 'Content-Type': 'application/json' }

const registerBody = {
  email: 'library@example.com',
  password: 'password1',
  username: 'libraryone',
  displayName: 'Library One',
}

function cookieHeader(res: Response) {
  return res.headers
    .getSetCookie()
    .map((part) => part.split(';')[0])
    .join('; ')
}

type LibraryData = {
  bookmarks: Array<{
    webtoonId: string
    addedAt: string
    notifyMuted?: boolean
    lastNotifiedEpisodeNumber?: number
  }>
  history: Array<{
    webtoonId: string
    episodeNumber: number
    lastReadAt: string
    scrollRatio?: number
    readEpisodeNumbers: number[]
  }>
  likedWebtoonIds: string[]
}

async function registerCookie() {
  const app = createApp(testEnv())
  const registered = await app.request('/api/auth/register', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(registerBody),
  })
  expect(registered.status).toBe(200)
  return { app, cookie: cookieHeader(registered) }
}

describe('library stub', () => {
  beforeEach(async () => {
    await persist.clearAuth()
  })

  afterEach(async () => {
    await persist.clearAuth()
  })

  it('rejects unauthenticated /me', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/api/library/me')
    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ error: { code: 'NOT_AUTHENTICATED' } })
  })

  it('returns empty snapshot and does not set cookies', async () => {
    const { app, cookie } = await registerCookie()
    const res = await app.request('/api/library/me', { headers: { Cookie: cookie } })
    expect(res.status).toBe(200)
    expect(res.headers.get('Set-Cookie')).toBeNull()
    expect(await res.json()).toEqual({
      data: { bookmarks: [], history: [], likedWebtoonIds: [] },
    })
  })

  it('rejects POST without JSON content type', async () => {
    const { app, cookie } = await registerCookie()
    const res = await app.request('/api/library/subscribe', {
      method: 'POST',
      headers: { Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'wt-1' }),
    })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: { code: 'VALIDATION_ERROR' } })
  })

  it('toggles subscribe and stamps lastNotified on add', async () => {
    const { app, cookie } = await registerCookie()
    const added = await app.request('/api/library/subscribe', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'wt-1', lastNotifiedEpisodeNumber: 3 }),
    })
    expect(added.status).toBe(200)
    const addedBody = (await added.json()) as { data: LibraryData }
    expect(addedBody.data.bookmarks).toHaveLength(1)
    expect(addedBody.data.bookmarks[0]?.webtoonId).toBe('wt-1')
    expect(addedBody.data.bookmarks[0]?.lastNotifiedEpisodeNumber).toBe(3)

    const removed = await app.request('/api/library/subscribe', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'wt-1' }),
    })
    const removedBody = (await removed.json()) as { data: LibraryData }
    expect(removedBody.data.bookmarks).toEqual([])
  })

  it('mutes and stamps with no-op when not subscribed', async () => {
    const { app, cookie } = await registerCookie()
    const muteMissing = await app.request('/api/library/mute', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'wt-1', muted: true }),
    })
    expect(muteMissing.status).toBe(200)
    expect(((await muteMissing.json()) as { data: LibraryData }).data.bookmarks).toEqual([])

    await app.request('/api/library/subscribe', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'wt-1' }),
    })
    const muted = await app.request('/api/library/mute', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'wt-1', muted: true }),
    })
    const mutedBody = (await muted.json()) as { data: LibraryData }
    expect(mutedBody.data.bookmarks[0]?.notifyMuted).toBe(true)

    const stamped = await app.request('/api/library/stamp-notified', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'wt-1', episodeNumber: 4 }),
    })
    const stampedBody = (await stamped.json()) as { data: LibraryData }
    expect(stampedBody.data.bookmarks[0]?.lastNotifiedEpisodeNumber).toBe(4)
  })

  it('upserts history with scrollRatio preserve and readEpisodeNumbers merge', async () => {
    const { app, cookie } = await registerCookie()
    const first = await app.request('/api/library/history', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'wt-1', episodeNumber: 2 }),
    })
    const firstBody = (await first.json()) as { data: LibraryData }
    expect(firstBody.data.history[0]?.episodeNumber).toBe(2)
    expect(firstBody.data.history[0]?.scrollRatio).toBe(0)
    expect(firstBody.data.history[0]?.readEpisodeNumbers).toEqual([2])

    const progress = await app.request('/api/library/history', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'wt-1', episodeNumber: 2, scrollRatio: 0.4 }),
    })
    const progressBody = (await progress.json()) as { data: LibraryData }
    expect(progressBody.data.history[0]?.scrollRatio).toBe(0.4)

    const sameEpisode = await app.request('/api/library/history', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'wt-1', episodeNumber: 2 }),
    })
    const sameBody = (await sameEpisode.json()) as { data: LibraryData }
    expect(sameBody.data.history[0]?.scrollRatio).toBe(0.4)

    const nextEp = await app.request('/api/library/history', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'wt-1', episodeNumber: 3 }),
    })
    const nextBody = (await nextEp.json()) as { data: LibraryData }
    expect(nextBody.data.history[0]?.episodeNumber).toBe(3)
    expect(nextBody.data.history[0]?.scrollRatio).toBe(0)
    expect(nextBody.data.history[0]?.readEpisodeNumbers).toEqual([2, 3])
  })

  it('toggles likes newest-first and bulk-removes', async () => {
    const { app, cookie } = await registerCookie()
    await app.request('/api/library/like', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'a' }),
    })
    const liked = await app.request('/api/library/like', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'b' }),
    })
    expect(((await liked.json()) as { data: LibraryData }).data.likedWebtoonIds).toEqual(['b', 'a'])

    await app.request('/api/library/subscribe', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'a' }),
    })
    await app.request('/api/library/history', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'a', episodeNumber: 1 }),
    })

    const removed = await app.request('/api/library/remove-bookmarks', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonIds: ['a'] }),
    })
    const removedBody = (await removed.json()) as { data: LibraryData }
    expect(removedBody.data.bookmarks).toEqual([])

    const historyGone = await app.request('/api/library/remove-history', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonIds: ['a'] }),
    })
    expect(((await historyGone.json()) as { data: LibraryData }).data.history).toEqual([])

    const likesGone = await app.request('/api/library/remove-likes', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonIds: ['a', 'b'] }),
    })
    expect(((await likesGone.json()) as { data: LibraryData }).data.likedWebtoonIds).toEqual([])
  })

  it('rejects empty webtoonId and non-positive episodeNumber', async () => {
    const { app, cookie } = await registerCookie()
    const emptyId = await app.request('/api/library/subscribe', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: '  ' }),
    })
    expect(emptyId.status).toBe(400)

    const badEpisode = await app.request('/api/library/history', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'wt-1', episodeNumber: 0 }),
    })
    expect(badEpisode.status).toBe(400)
    expect(await badEpisode.json()).toEqual({ error: { code: 'VALIDATION_ERROR' } })
  })

  it('clears library rows on deleteReaderUser and clearAuth', async () => {
    const { app, cookie } = await registerCookie()
    const registered = await app.request('/api/auth/me', { headers: { Cookie: cookie } })
    const me = (await registered.json()) as { data: { id: string } }

    await app.request('/api/library/subscribe', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'wt-1' }),
    })
    await app.request('/api/library/like', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'wt-1' }),
    })
    await app.request('/api/library/history', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: 'wt-1', episodeNumber: 1 }),
    })

    expect(await persist.deleteReaderUser(me.data.id)).toBe('ok')
    expect(await persist.getLibrary(me.data.id)).toEqual({
      bookmarks: [],
      history: [],
      likedWebtoonIds: [],
    })

    const again = await registerCookie()
    await again.app.request('/api/library/subscribe', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: again.cookie },
      body: JSON.stringify({ webtoonId: 'wt-2' }),
    })
    await persist.clearAuth()
    const afterClear = await registerCookie()
    const empty = await afterClear.app.request('/api/library/me', {
      headers: { Cookie: afterClear.cookie },
    })
    expect(await empty.json()).toEqual({
      data: { bookmarks: [], history: [], likedWebtoonIds: [] },
    })
  })
})
