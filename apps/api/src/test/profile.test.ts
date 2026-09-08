import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { MAX_AVATAR_DATA_URL_CHARS } from '../auth/avatar.js'
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

describe('reader profile writers', () => {
  beforeEach(async () => {
    await persist.clearAuth()
  })

  afterEach(async () => {
    await persist.clearAuth()
  })

  it('rejects profile writers without a cookie', async () => {
    const app = createApp(testEnv())
    const profile = await app.request('/api/auth/profile', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ displayName: 'Next Name' }),
    })
    expect(profile.status).toBe(401)
    const password = await app.request('/api/auth/password', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ currentPassword: 'password1', newPassword: 'changed99' }),
    })
    expect(password.status).toBe(401)
    const deleted = await app.request('/api/auth/delete-account', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ password: 'password1' }),
    })
    expect(deleted.status).toBe(401)
  })

  it('updates displayName and bio and rejects a taken email', async () => {
    const app = createApp(testEnv())
    const registered = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const cookies = cookieHeader(registered)

    const empty = await app.request('/api/auth/profile', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookies },
      body: '{}',
    })
    expect(empty.status).toBe(400)
    expect(await empty.json()).toEqual({ error: { code: 'VALIDATION_ERROR' } })

    const updated = await app.request('/api/auth/profile', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookies },
      body: JSON.stringify({ displayName: 'Next Name', bio: 'Hello' }),
    })
    expect(updated.status).toBe(200)
    const body = (await updated.json()) as { data: { displayName: string; bio: string } }
    expect(body.data.displayName).toBe('Next Name')
    expect(body.data.bio).toBe('Hello')

    const avatarOnly = await app.request('/api/auth/profile', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookies },
      body: JSON.stringify({ avatar: 'data:image/png;base64,xx' }),
    })
    expect(avatarOnly.status).toBe(200)
    const withAvatar = (await avatarOnly.json()) as {
      data: { bio: string; avatar: string; displayName: string }
    }
    expect(withAvatar.data.bio).toBe('Hello')
    expect(withAvatar.data.displayName).toBe('Next Name')
    expect(withAvatar.data.avatar).toBe('data:image/png;base64,xx')

    await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({
        email: 'other@example.com',
        password: 'password1',
        username: 'readertwo',
        displayName: 'Reader Two',
      }),
    })
    const taken = await app.request('/api/auth/profile', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookies },
      body: JSON.stringify({ email: 'other@example.com' }),
    })
    expect(taken.status).toBe(409)
    expect(await taken.json()).toEqual({ error: { code: 'EMAIL_TAKEN' } })

    const me = await app.request('/api/auth/me', { headers: { Cookie: cookies } })
    const meBody = (await me.json()) as { data: { displayName: string; bio: string } }
    expect(meBody.data.displayName).toBe('Next Name')
    expect(meBody.data.bio).toBe('Hello')
  })

  it('changes password without revoking the current refresh cookie', async () => {
    const app = createApp(testEnv())
    const registered = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const cookies = cookieHeader(registered)

    const changed = await app.request('/api/auth/password', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookies },
      body: JSON.stringify({ currentPassword: 'password1', newPassword: 'changed99' }),
    })
    expect(changed.status).toBe(200)
    expect(await changed.json()).toEqual({ data: { ok: true } })
    expect(
      changed.headers.getSetCookie().some((part) => part.startsWith(`${ACCESS_COOKIE}=`))
    ).toBe(false)

    const oldLogin = await app.request('/api/auth/login', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ email: 'reader@example.com', password: 'password1' }),
    })
    expect(oldLogin.status).toBe(401)

    const newLogin = await app.request('/api/auth/login', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ email: 'reader@example.com', password: 'changed99' }),
    })
    expect(newLogin.status).toBe(200)

    const refresh = await app.request('/api/auth/refresh', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookies },
      body: '{}',
    })
    expect(refresh.status).toBe(200)
  })

  it('deletes the account, clears cookies, and rejects /me', async () => {
    const app = createApp(testEnv())
    const registered = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const cookies = cookieHeader(registered)

    const deleted = await app.request('/api/auth/delete-account', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookies },
      body: JSON.stringify({ password: 'password1' }),
    })
    expect(deleted.status).toBe(200)
    expect(await deleted.json()).toEqual({ data: { ok: true } })
    expect(
      deleted.headers.getSetCookie().some((part) => part.startsWith(`${ACCESS_COOKIE}=`))
    ).toBe(true)
    expect(
      deleted.headers.getSetCookie().some((part) => part.startsWith(`${REFRESH_COOKIE}=`))
    ).toBe(true)

    const me = await app.request('/api/auth/me', { headers: { Cookie: cookies } })
    expect(me.status).toBe(401)
    expect(await persist.findUserByEmail('reader@example.com')).toBeUndefined()
  })

  it('rejects oversized gif and svg avatars and keeps a tiny png', async () => {
    const app = createApp(testEnv())
    const registered = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const cookies = cookieHeader(registered)

    const tiny = await app.request('/api/auth/profile', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookies },
      body: JSON.stringify({ avatar: 'data:image/png;base64,xx' }),
    })
    expect(tiny.status).toBe(200)

    const oversize = `data:image/png;base64,${'a'.repeat(MAX_AVATAR_DATA_URL_CHARS)}`
    const tooBig = await app.request('/api/auth/profile', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookies },
      body: JSON.stringify({ avatar: oversize }),
    })
    expect(tooBig.status).toBe(400)
    expect(await tooBig.json()).toEqual({ error: { code: 'VALIDATION_ERROR' } })

    const gif = await app.request('/api/auth/profile', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookies },
      body: JSON.stringify({ avatar: 'data:image/gif;base64,xx' }),
    })
    expect(gif.status).toBe(400)

    const svg = await app.request('/api/auth/profile', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookies },
      body: JSON.stringify({ avatar: 'data:image/svg+xml;base64,xx' }),
    })
    expect(svg.status).toBe(400)

    const me = await app.request('/api/auth/me', { headers: { Cookie: cookies } })
    const meBody = (await me.json()) as { data: { avatar?: string } }
    expect(meBody.data.avatar).toBe('data:image/png;base64,xx')
  })
})
