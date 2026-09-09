import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { persist } from '../persist.js'
import { ADMIN_SERVICE_TOKEN_HEADER } from '../internal/serviceAuth.js'
import type { MailPort, SendTransactionalInput } from '../ports/mail.js'
import type { PushPort, PushSendInput } from '../ports/push.js'
import { testEnv } from './helpers.js'

const jsonHeaders = { 'Content-Type': 'application/json' }
const TOKEN = 'service-token-for-tests-ok'

const registerBody = {
  email: 'pipe@example.com',
  password: 'password1',
  username: 'pipeone',
  displayName: 'Pipe One',
}

function cookieHeader(res: Response) {
  return res.headers
    .getSetCookie()
    .map((part) => part.split(';')[0])
    .join('; ')
}

function spies() {
  const mailed: SendTransactionalInput[] = []
  const pushed: PushSendInput[] = []
  const mail: MailPort = {
    async sendTransactional(input) {
      mailed.push(input)
    },
  }
  const push: PushPort = {
    async send(input) {
      pushed.push(input)
    },
  }
  return { mail, push, mailed, pushed }
}

async function registerUser(body = registerBody) {
  const { mail, push, mailed, pushed } = spies()
  const env = testEnv({ ADMIN_SERVICE_TOKEN: TOKEN })
  const app = createApp(env, { mail, push })
  const registered = await app.request('/api/auth/register', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(body),
  })
  expect(registered.status).toBe(200)
  const me = (await registered.json()) as { data: { id: string } }
  return {
    app,
    env,
    mail,
    push,
    mailed,
    pushed,
    cookie: cookieHeader(registered),
    userId: me.data.id,
    serviceHeaders: { ...jsonHeaders, [ADMIN_SERVICE_TOKEN_HEADER]: TOKEN },
  }
}

describe('internal notification delivery', () => {
  beforeEach(async () => {
    await persist.clearAuth()
  })

  afterEach(async () => {
    await persist.clearAuth()
  })

  it('returns 401 without token, with a wrong token, and with a reader cookie only', async () => {
    const session = await registerUser()
    const url = '/api/internal/notifications/search'
    const missing = await session.app.request(url)
    expect(missing.status).toBe(401)

    const wrong = await session.app.request(url, {
      headers: { [ADMIN_SERVICE_TOKEN_HEADER]: 'nope' },
    })
    expect(wrong.status).toBe(401)

    const cookieOnly = await session.app.request(url, {
      headers: { Cookie: session.cookie },
    })
    expect(cookieOnly.status).toBe(401)
  })

  it('skips promotion inbox when the pref is off and always writes system inbox', async () => {
    const session = await registerUser()
    await persist.patchNotifPrefs(session.userId, { promotion: false })

    const skipped = await session.app.request('/api/internal/notifications/broadcast', {
      method: 'POST',
      headers: session.serviceHeaders,
      body: JSON.stringify({
        campaignId: 'camp-promo-1',
        type: 'promotion',
        titleKey: 'notificationsPage.adminPromotion',
        message: 'Coins off this week.',
        audience: { userIds: [session.userId] },
      }),
    })
    expect(skipped.status).toBe(200)
    expect(await skipped.json()).toEqual({
      data: { campaignId: 'camp-promo-1', inbox: 0, emailed: 0, pushed: 0, skippedPref: 1 },
    })
    expect(await persist.getNotifications(session.userId)).toEqual([])
    expect(session.mailed).toHaveLength(0)

    const system = await session.app.request('/api/internal/notifications/broadcast', {
      method: 'POST',
      headers: session.serviceHeaders,
      body: JSON.stringify({
        campaignId: 'camp-sys-1',
        type: 'system',
        titleKey: 'notificationsPage.adminSystem',
        message: 'Scheduled maintenance tonight.',
        audience: { all: true },
      }),
    })
    expect(system.status).toBe(200)
    const body = (await system.json()) as {
      data: { inbox: number; emailed: number; pushed: number; skippedPref: number }
    }
    expect(body.data.inbox).toBe(1)
    expect(body.data.emailed).toBe(1)
    expect(body.data.pushed).toBe(0)
    expect(body.data.skippedPref).toBe(0)
    const inbox = await persist.getNotifications(session.userId)
    expect(inbox).toHaveLength(1)
    expect(inbox[0]?.id).toBe('campaign:camp-sys-1')
    expect(inbox[0]?.type).toBe('system')
  })

  it('is idempotent on campaignId', async () => {
    const session = await registerUser()
    const payload = {
      campaignId: 'camp-once',
      type: 'system' as const,
      titleKey: 'notificationsPage.adminSystem',
      message: 'Hello once.',
      audience: { userIds: [session.userId] },
    }
    const first = await session.app.request('/api/internal/notifications/broadcast', {
      method: 'POST',
      headers: session.serviceHeaders,
      body: JSON.stringify(payload),
    })
    const firstBody = await first.json()
    const second = await session.app.request('/api/internal/notifications/broadcast', {
      method: 'POST',
      headers: session.serviceHeaders,
      body: JSON.stringify(payload),
    })
    expect(await second.json()).toEqual(firstBody)
    expect(await persist.getNotifications(session.userId)).toHaveLength(1)
    expect(session.mailed).toHaveLength(1)
  })

  it('lists readers and previews audience counts', async () => {
    const session = await registerUser()
    const search = await session.app.request('/api/internal/notifications/search?q=pipe', {
      headers: { [ADMIN_SERVICE_TOKEN_HEADER]: TOKEN },
    })
    expect(search.status).toBe(200)
    const found = (await search.json()) as {
      data: { total: number; readers: Array<{ email: string }> }
    }
    expect(found.data.total).toBe(1)
    expect(found.data.readers[0]?.email).toBe('pipe@example.com')

    const preview = await session.app.request('/api/internal/notifications/preview', {
      method: 'POST',
      headers: session.serviceHeaders,
      body: JSON.stringify({ all: true }),
    })
    expect(await preview.json()).toEqual({
      data: { readers: 1, withEmail: 1, withPush: 0 },
    })
  })

  it('returns 401 on new-episode without token, with a wrong token, and with a reader cookie only', async () => {
    const session = await registerUser({
      email: 'ep-auth@example.com',
      password: 'password1',
      username: 'epauthone',
      displayName: 'Ep Auth',
    })
    const url = '/api/internal/notifications/new-episode'
    const payload = JSON.stringify({ webtoonId: '1', episodeNumber: 2 })

    const missing = await session.app.request(url, {
      method: 'POST',
      headers: jsonHeaders,
      body: payload,
    })
    expect(missing.status).toBe(401)

    const wrong = await session.app.request(url, {
      method: 'POST',
      headers: { ...jsonHeaders, [ADMIN_SERVICE_TOKEN_HEADER]: 'nope' },
      body: payload,
    })
    expect(wrong.status).toBe(401)

    const cookieOnly = await session.app.request(url, {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: session.cookie },
      body: payload,
    })
    expect(cookieOnly.status).toBe(401)
  })

  it('rejects empty or invalid new-episode bodies', async () => {
    const session = await registerUser({
      email: 'ep-bad@example.com',
      password: 'password1',
      username: 'epbadone',
      displayName: 'Ep Bad',
    })
    const url = '/api/internal/notifications/new-episode'
    const empty = await session.app.request(url, {
      method: 'POST',
      headers: session.serviceHeaders,
      body: JSON.stringify({}),
    })
    expect(empty.status).toBe(400)
    expect(await empty.json()).toEqual({ error: { code: 'VALIDATION_ERROR' } })

    const zero = await session.app.request(url, {
      method: 'POST',
      headers: session.serviceHeaders,
      body: JSON.stringify({ webtoonId: '1', episodeNumber: 0 }),
    })
    expect(zero.status).toBe(400)

    const blank = await session.app.request(url, {
      method: 'POST',
      headers: session.serviceHeaders,
      body: JSON.stringify({ webtoonId: '  ', episodeNumber: 2 }),
    })
    expect(blank.status).toBe(400)
  })

  it('fans out a published episode to a subscriber below the ping number', async () => {
    const session = await registerUser({
      email: 'ep-ok@example.com',
      password: 'password1',
      username: 'epokone',
      displayName: 'Ep Ok',
    })
    const subscribed = await session.app.request('/api/library/subscribe', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: session.cookie },
      body: JSON.stringify({ webtoonId: '1', lastNotifiedEpisodeNumber: 1 }),
    })
    expect(subscribed.status).toBe(200)

    const first = await session.app.request('/api/internal/notifications/new-episode', {
      method: 'POST',
      headers: session.serviceHeaders,
      body: JSON.stringify({ webtoonId: '1', episodeNumber: 2 }),
    })
    expect(first.status).toBe(200)
    const firstBody = (await first.json()) as {
      data: { inbox: number; emailed: number; pushed: number; skippedPref: number }
    }
    expect(firstBody.data.inbox).toBe(1)
    expect(firstBody.data.emailed).toBe(1)
    expect(firstBody.data.pushed).toBe(0)
    expect(firstBody.data.skippedPref).toBe(0)

    const inbox = await persist.getNotifications(session.userId)
    expect(inbox).toHaveLength(1)
    expect(inbox[0]?.id).toBe('sub-1-2')
    expect(inbox[0]?.type).toBe('new_episode')
    expect(inbox[0]?.titleKey).toBe('notificationsPage.newEpisode')
    expect(inbox[0]?.message).toBe('The Last Horizon — Episode 2 is ready to read.')
    expect(inbox[0]?.href).toBe('/webtoon/1')
    expect(inbox[0]?.data).toEqual({ webtoonId: '1', episodeNumber: 2 })
    expect(session.mailed).toHaveLength(1)

    const stamped = await persist.listLibrarySubscribers('1')
    expect(stamped[0]?.lastNotifiedEpisodeNumber).toBe(2)

    const second = await session.app.request('/api/internal/notifications/new-episode', {
      method: 'POST',
      headers: session.serviceHeaders,
      body: JSON.stringify({ webtoonId: '1', episodeNumber: 2 }),
    })
    expect(second.status).toBe(200)
    expect(await persist.getNotifications(session.userId)).toHaveLength(1)
    expect(session.mailed).toHaveLength(1)
  })

  it('skips inbox when newEpisode is off and does not stamp', async () => {
    const session = await registerUser({
      email: 'ep-pref@example.com',
      password: 'password1',
      username: 'epprefone',
      displayName: 'Ep Pref',
    })
    await persist.patchNotifPrefs(session.userId, { newEpisode: false })
    await session.app.request('/api/library/subscribe', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: session.cookie },
      body: JSON.stringify({ webtoonId: '1', lastNotifiedEpisodeNumber: 1 }),
    })

    const res = await session.app.request('/api/internal/notifications/new-episode', {
      method: 'POST',
      headers: session.serviceHeaders,
      body: JSON.stringify({ webtoonId: '1', episodeNumber: 2 }),
    })
    expect(await res.json()).toEqual({
      data: {
        webtoonId: '1',
        episodeNumber: 2,
        inbox: 0,
        emailed: 0,
        pushed: 0,
        skippedPref: 1,
      },
    })
    expect(await persist.getNotifications(session.userId)).toEqual([])
    expect(session.mailed).toHaveLength(0)
    expect((await persist.listLibrarySubscribers('1'))[0]?.lastNotifiedEpisodeNumber).toBe(1)
  })

  it('omits muted subscribers without skippedPref', async () => {
    const session = await registerUser({
      email: 'ep-mute@example.com',
      password: 'password1',
      username: 'epmuteone',
      displayName: 'Ep Mute',
    })
    await session.app.request('/api/library/subscribe', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: session.cookie },
      body: JSON.stringify({ webtoonId: '1', lastNotifiedEpisodeNumber: 1 }),
    })
    await session.app.request('/api/library/mute', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: session.cookie },
      body: JSON.stringify({ webtoonId: '1', muted: true }),
    })

    const res = await session.app.request('/api/internal/notifications/new-episode', {
      method: 'POST',
      headers: session.serviceHeaders,
      body: JSON.stringify({ webtoonId: '1', episodeNumber: 2 }),
    })
    expect(await res.json()).toEqual({
      data: {
        webtoonId: '1',
        episodeNumber: 2,
        inbox: 0,
        emailed: 0,
        pushed: 0,
        skippedPref: 0,
      },
    })
    expect(await persist.getNotifications(session.userId)).toEqual([])
    expect(session.mailed).toHaveLength(0)
  })

  it('returns zeros for unknown or unpublished episode pairs', async () => {
    const session = await registerUser({
      email: 'ep-miss@example.com',
      password: 'password1',
      username: 'epmissone',
      displayName: 'Ep Miss',
    })
    await session.app.request('/api/library/subscribe', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: session.cookie },
      body: JSON.stringify({ webtoonId: '1', lastNotifiedEpisodeNumber: 1 }),
    })

    const unknown = await session.app.request('/api/internal/notifications/new-episode', {
      method: 'POST',
      headers: session.serviceHeaders,
      body: JSON.stringify({ webtoonId: 'nope', episodeNumber: 1 }),
    })
    expect(unknown.status).toBe(200)
    expect(await unknown.json()).toEqual({
      data: {
        webtoonId: 'nope',
        episodeNumber: 1,
        inbox: 0,
        emailed: 0,
        pushed: 0,
        skippedPref: 0,
      },
    })

    const unpublished = await session.app.request('/api/internal/notifications/new-episode', {
      method: 'POST',
      headers: session.serviceHeaders,
      body: JSON.stringify({ webtoonId: '1', episodeNumber: 6 }),
    })
    expect(unpublished.status).toBe(200)
    expect(await unpublished.json()).toEqual({
      data: {
        webtoonId: '1',
        episodeNumber: 6,
        inbox: 0,
        emailed: 0,
        pushed: 0,
        skippedPref: 0,
      },
    })
    expect(await persist.getNotifications(session.userId)).toEqual([])
    expect(session.mailed).toHaveLength(0)
  })
})
