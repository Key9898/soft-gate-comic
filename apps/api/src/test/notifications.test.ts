import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { persist } from '../persist.js'
import { testEnv } from './helpers.js'

const jsonHeaders = { 'Content-Type': 'application/json' }

const registerBody = {
  email: 'notifs@example.com',
  password: 'password1',
  username: 'notifone',
  displayName: 'Notif One',
}

function cookieHeader(res: Response) {
  return res.headers
    .getSetCookie()
    .map((part) => part.split(';')[0])
    .join('; ')
}

const sample = {
  id: 'sub-wt-1-4',
  type: 'new_episode' as const,
  titleKey: 'notificationsPage.newEpisode',
  message: 'Episode 4 of Title is out.',
  isRead: false,
  createdAt: '2026-09-08T12:00:00.000Z',
  href: '/webtoon/wt-1',
  data: { webtoonId: 'wt-1', episodeNumber: 4 },
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

describe('notifications stub', () => {
  beforeEach(async () => {
    await persist.clearAuth()
  })

  afterEach(async () => {
    await persist.clearAuth()
  })

  it('rejects unauthenticated /me', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/api/notifications/me')
    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ error: { code: 'NOT_AUTHENTICATED' } })
  })

  it('returns empty list and does not set cookies', async () => {
    const { app, cookie } = await registerCookie()
    const res = await app.request('/api/notifications/me', { headers: { Cookie: cookie } })
    expect(res.status).toBe(200)
    expect(res.headers.get('Set-Cookie')).toBeNull()
    expect(await res.json()).toEqual({ data: { notifications: [] } })
  })

  it('rejects POST without JSON content type', async () => {
    const { app, cookie } = await registerCookie()
    const res = await app.request('/api/notifications/upsert', {
      method: 'POST',
      headers: { Cookie: cookie },
      body: JSON.stringify({ notification: sample }),
    })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: { code: 'VALIDATION_ERROR' } })
  })

  it('upserts by id and sorts newest first', async () => {
    const { app, cookie } = await registerCookie()
    const older = {
      ...sample,
      id: 'older',
      createdAt: '2026-09-08T11:00:00.000Z',
      message: 'older',
    }
    await app.request('/api/notifications/upsert', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ notification: older }),
    })
    const added = await app.request('/api/notifications/upsert', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ notification: sample }),
    })
    expect(added.status).toBe(200)
    const body = (await added.json()) as { data: { notifications: (typeof sample)[] } }
    expect(body.data.notifications.map((row) => row.id)).toEqual(['sub-wt-1-4', 'older'])

    const again = await app.request('/api/notifications/upsert', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({
        notification: { ...sample, message: 'updated', isRead: true },
      }),
    })
    const updated = (await again.json()) as { data: { notifications: (typeof sample)[] } }
    expect(updated.data.notifications).toHaveLength(2)
    expect(updated.data.notifications[0]).toMatchObject({
      id: 'sub-wt-1-4',
      message: 'updated',
      isRead: true,
    })
  })

  it('reads, deletes, and clears read rows', async () => {
    const { app, cookie } = await registerCookie()
    await app.request('/api/notifications/upsert', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ notification: sample }),
    })
    await app.request('/api/notifications/upsert', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({
        notification: {
          ...sample,
          id: 'promo-1',
          type: 'promotion',
          titleKey: 'notificationsPage.promo',
          message: 'promo',
          href: undefined,
          data: undefined,
        },
      }),
    })

    const missingRead = await app.request('/api/notifications/read', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ id: 'missing' }),
    })
    expect(missingRead.status).toBe(200)
    expect(
      (
        (await missingRead.json()) as { data: { notifications: Array<{ isRead: boolean }> } }
      ).data.notifications.every((row) => !row.isRead)
    ).toBe(true)

    const readOne = await app.request('/api/notifications/read', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ id: 'sub-wt-1-4' }),
    })
    const afterRead = (await readOne.json()) as {
      data: { notifications: Array<{ id: string; isRead: boolean }> }
    }
    expect(afterRead.data.notifications.find((row) => row.id === 'sub-wt-1-4')?.isRead).toBe(true)

    const readAll = await app.request('/api/notifications/read-all', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({}),
    })
    const allRead = (await readAll.json()) as {
      data: { notifications: Array<{ isRead: boolean }> }
    }
    expect(allRead.data.notifications.every((row) => row.isRead)).toBe(true)

    const missingDelete = await app.request('/api/notifications/delete', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ id: 'missing' }),
    })
    expect(missingDelete.status).toBe(200)
    expect(
      ((await missingDelete.json()) as { data: { notifications: unknown[] } }).data.notifications
    ).toHaveLength(2)

    const deleted = await app.request('/api/notifications/delete', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ id: 'promo-1' }),
    })
    expect(
      (
        (await deleted.json()) as { data: { notifications: Array<{ id: string }> } }
      ).data.notifications.map((row) => row.id)
    ).toEqual(['sub-wt-1-4'])

    const cleared = await app.request('/api/notifications/clear-read', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({}),
    })
    expect(await cleared.json()).toEqual({ data: { notifications: [] } })
  })

  it('rejects invalid payloads', async () => {
    const { app, cookie } = await registerCookie()
    const badType = await app.request('/api/notifications/upsert', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({
        notification: { ...sample, type: 'unknown' },
      }),
    })
    expect(badType.status).toBe(400)

    const badDate = await app.request('/api/notifications/upsert', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({
        notification: { ...sample, createdAt: 'not-a-date' },
      }),
    })
    expect(badDate.status).toBe(400)

    const emptyId = await app.request('/api/notifications/upsert', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({
        notification: { ...sample, id: '  ' },
      }),
    })
    expect(emptyId.status).toBe(400)

    const badEpisode = await app.request('/api/notifications/upsert', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({
        notification: { ...sample, data: { webtoonId: 'wt-1', episodeNumber: 0 } },
      }),
    })
    expect(badEpisode.status).toBe(400)
    expect(await badEpisode.json()).toEqual({ error: { code: 'VALIDATION_ERROR' } })
  })

  it('clears notification rows on deleteReaderUser and clearAuth', async () => {
    const { app, cookie } = await registerCookie()
    const registered = await app.request('/api/auth/me', { headers: { Cookie: cookie } })
    const me = (await registered.json()) as { data: { id: string } }

    await app.request('/api/notifications/upsert', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ notification: sample }),
    })

    expect(await persist.deleteReaderUser(me.data.id)).toBe('ok')
    expect(await persist.getNotifications(me.data.id)).toEqual([])

    const again = await registerCookie()
    await again.app.request('/api/notifications/upsert', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: again.cookie },
      body: JSON.stringify({ notification: sample }),
    })
    await persist.clearAuth()
    const afterClear = await registerCookie()
    const empty = await afterClear.app.request('/api/notifications/me', {
      headers: { Cookie: afterClear.cookie },
    })
    expect(await empty.json()).toEqual({ data: { notifications: [] } })
  })
})
