import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { ACCESS_COOKIE, REFRESH_COOKIE } from '../auth/types.js'
import { persist } from '../persist.js'
import { testEnv } from './helpers.js'

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

function cookieLine(res: Response, name: string) {
  return res.headers.getSetCookie().find((part) => part.startsWith(`${name}=`))
}

describe('reader auth', () => {
  beforeEach(() => {
    persist.clearAuth()
  })

  afterEach(() => {
    persist.clearAuth()
  })

  it('registers, sets httpOnly cookies, and hides the password hash', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    expect(res.status).toBe(200)
    const body = (await res.json()) as { data: Record<string, unknown> }
    expect(body.data.email).toBe('reader@example.com')
    expect(body.data.username).toBe('readerone')
    expect(body.data).not.toHaveProperty('password')
    expect(body.data).not.toHaveProperty('passwordHash')

    const access = cookieLine(res, ACCESS_COOKIE)
    const refresh = cookieLine(res, REFRESH_COOKIE)
    expect(access).toBeDefined()
    expect(refresh).toBeDefined()
    expect(access?.toLowerCase()).toContain('httponly')
    expect(refresh?.toLowerCase()).toContain('httponly')

    const stored = persist.findUserByEmail('reader@example.com')
    expect(stored?.passwordHash).not.toBe('password1')
    expect(stored?.passwordHash.startsWith('$2')).toBe(true)
  })

  it('returns the public user from /me with the access cookie', async () => {
    const app = createApp(testEnv())
    const registered = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const res = await app.request('/api/auth/me', {
      headers: { Cookie: cookieHeader(registered) },
    })
    expect(res.status).toBe(200)
    const body = (await res.json()) as { data: { email: string } }
    expect(body.data.email).toBe('reader@example.com')
  })

  it('rejects a wrong password', async () => {
    const app = createApp(testEnv())
    await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ email: 'reader@example.com', password: 'wrongpass' }),
    })
    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ error: { code: 'INVALID_CREDENTIALS' } })
  })

  it('refreshes cookies and then serves /me', async () => {
    const app = createApp(testEnv())
    const registered = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const refreshed = await app.request('/api/auth/refresh', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookieHeader(registered) },
      body: '{}',
    })
    expect(refreshed.status).toBe(200)
    const me = await app.request('/api/auth/me', {
      headers: { Cookie: cookieHeader(refreshed) },
    })
    expect(me.status).toBe(200)
  })

  it('logs out, revokes refresh, and rejects unauthenticated /me', async () => {
    const app = createApp(testEnv())
    const registered = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const loggedOut = await app.request('/api/auth/logout', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookieHeader(registered) },
      body: '{}',
    })
    expect(loggedOut.status).toBe(200)
    expect(await loggedOut.json()).toEqual({ data: { ok: true } })

    const refreshed = await app.request('/api/auth/refresh', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookieHeader(registered) },
      body: '{}',
    })
    expect(refreshed.status).toBe(401)

    const me = await app.request('/api/auth/me')
    expect(me.status).toBe(401)
  })

  it('rejects a duplicate email', async () => {
    const app = createApp(testEnv())
    await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const res = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ ...registerBody, username: 'readertwo' }),
    })
    expect(res.status).toBe(409)
    expect(await res.json()).toEqual({ error: { code: 'EMAIL_TAKEN' } })
  })

  it('rejects register when registration is closed', async () => {
    persist.setAuthFlags({ allowRegistration: false })
    const app = createApp(testEnv())
    const res = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    expect(res.status).toBe(403)
    expect(await res.json()).toEqual({ error: { code: 'REGISTRATION_CLOSED' } })
  })
})
