import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { persist } from '../persist.js'
import { testEnv } from './helpers.js'

const jsonHeaders = { 'Content-Type': 'application/json' }

const registerBody = {
  email: 'prefs@example.com',
  password: 'password1',
  username: 'prefsone',
  displayName: 'Prefs One',
}

const defaults = {
  notifPrefs: { newEpisode: true, commentReply: true, promotion: true },
  readerPrefs: { darkMode: true, brightness: 0.9, fontSize: 'md', imageFit: 'fit' },
}

function cookieHeader(res: Response) {
  return res.headers
    .getSetCookie()
    .map((part) => part.split(';')[0])
    .join('; ')
}

async function registerCookie(overrides?: Partial<typeof registerBody>) {
  const app = createApp(testEnv())
  const registered = await app.request('/api/auth/register', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ ...registerBody, ...overrides }),
  })
  expect(registered.status).toBe(200)
  return { app, cookie: cookieHeader(registered) }
}

describe('prefs stub', () => {
  beforeEach(async () => {
    await persist.clearAuth()
  })

  afterEach(async () => {
    await persist.clearAuth()
  })

  it('rejects unauthenticated /me', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/api/prefs/me')
    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ error: { code: 'NOT_AUTHENTICATED' } })
  })

  it('returns defaults without inserting and does not set cookies', async () => {
    const { app, cookie } = await registerCookie()
    const first = await app.request('/api/prefs/me', { headers: { Cookie: cookie } })
    expect(first.status).toBe(200)
    expect(first.headers.get('Set-Cookie')).toBeNull()
    expect(await first.json()).toEqual({ data: defaults })

    const second = await app.request('/api/prefs/me', { headers: { Cookie: cookie } })
    expect(await second.json()).toEqual({ data: defaults })
  })

  it('rejects POST without JSON content type', async () => {
    const { app, cookie } = await registerCookie()
    const res = await app.request('/api/prefs/notif', {
      method: 'POST',
      headers: { Cookie: cookie },
      body: JSON.stringify({ newEpisode: false }),
    })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: { code: 'VALIDATION_ERROR' } })
  })

  it('rejects empty notif patch', async () => {
    const { app, cookie } = await registerCookie()
    const res = await app.request('/api/prefs/notif', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: { code: 'VALIDATION_ERROR' } })
  })

  it('merges notif toggles and keeps reader defaults', async () => {
    const { app, cookie } = await registerCookie()
    const res = await app.request('/api/prefs/notif', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ promotion: false }),
    })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      data: {
        notifPrefs: { newEpisode: true, commentReply: true, promotion: false },
        readerPrefs: defaults.readerPrefs,
      },
    })
  })

  it('upserts reader prefs and keeps notif defaults', async () => {
    const { app, cookie } = await registerCookie()
    const res = await app.request('/api/prefs/reader', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({
        darkMode: false,
        brightness: 0.45,
        fontSize: 'lg',
        imageFit: 'full',
      }),
    })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      data: {
        notifPrefs: defaults.notifPrefs,
        readerPrefs: { darkMode: false, brightness: 0.45, fontSize: 'lg', imageFit: 'full' },
      },
    })
  })

  it('rejects invalid reader payloads', async () => {
    const { app, cookie } = await registerCookie()
    const tooDim = await app.request('/api/prefs/reader', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({
        darkMode: true,
        brightness: 0.24,
        fontSize: 'md',
        imageFit: 'fit',
      }),
    })
    expect(tooDim.status).toBe(400)

    const badFit = await app.request('/api/prefs/reader', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({
        darkMode: true,
        brightness: 0.9,
        fontSize: 'md',
        imageFit: 'wide',
      }),
    })
    expect(badFit.status).toBe(400)
    expect(await badFit.json()).toEqual({ error: { code: 'VALIDATION_ERROR' } })
  })

  it('isolates prefs per user', async () => {
    const first = await registerCookie()
    const second = await registerCookie({
      email: 'prefs2@example.com',
      username: 'prefstwo',
      displayName: 'Prefs Two',
    })
    await first.app.request('/api/prefs/notif', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: first.cookie },
      body: JSON.stringify({ newEpisode: false }),
    })
    const other = await second.app.request('/api/prefs/me', {
      headers: { Cookie: second.cookie },
    })
    expect(await other.json()).toEqual({ data: defaults })
  })

  it('clears prefs rows on deleteReaderUser and clearAuth', async () => {
    const { app, cookie } = await registerCookie()
    const registered = await app.request('/api/auth/me', { headers: { Cookie: cookie } })
    const me = (await registered.json()) as { data: { id: string } }

    await app.request('/api/prefs/notif', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ promotion: false }),
    })

    expect(await persist.deleteReaderUser(me.data.id)).toBe('ok')
    expect(await persist.getPrefs(me.data.id)).toEqual(defaults)

    const again = await registerCookie()
    await again.app.request('/api/prefs/reader', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: again.cookie },
      body: JSON.stringify({
        darkMode: false,
        brightness: 1,
        fontSize: 'sm',
        imageFit: 'full',
      }),
    })
    await persist.clearAuth()
    const afterClear = await persist.getPrefs(me.data.id)
    expect(afterClear).toEqual(defaults)
  })
})
