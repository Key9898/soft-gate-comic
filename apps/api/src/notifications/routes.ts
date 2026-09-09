import { Hono } from 'hono'
import { z } from 'zod'
import { isPushConfigured, type Env } from '../env.js'
import {
  persist,
  toPersistNotification,
  type PersistNotification,
  type PersistNotificationType,
} from '../persist.js'
import { optionalReaderUserId } from '../auth/session.js'
import type { PushPort } from '../ports/push.js'

const NOTIFICATION_TYPES = ['new_episode', 'comment_reply', 'system', 'promotion'] as const

const notificationSchema = z.object({
  id: z.string(),
  type: z.enum(NOTIFICATION_TYPES),
  titleKey: z.string(),
  message: z.string(),
  isRead: z.boolean(),
  createdAt: z.string(),
  href: z.string().optional(),
  data: z
    .object({
      webtoonId: z.string().optional(),
      episodeNumber: z.number().optional(),
    })
    .optional(),
})

const upsertSchema = z.object({
  notification: notificationSchema,
})

const idSchema = z.object({
  id: z.string(),
})

const emptySchema = z.object({})

function jsonError(
  c: { json: (body: unknown, status: 400 | 401 | 503) => Response },
  code: string,
  status: 400 | 401 | 503
) {
  return c.json({ error: { code } }, status)
}

function isJsonContentType(contentType: string | undefined) {
  return (contentType ?? '').toLowerCase().includes('application/json')
}

function isEpisodeNumber(value: number) {
  return Number.isInteger(value) && value >= 1
}

function snapshot(notifications: PersistNotification[]) {
  return { notifications }
}

function normalizeNotification(
  raw: z.infer<typeof notificationSchema>
): PersistNotification | null {
  const id = raw.id.trim()
  const titleKey = raw.titleKey.trim()
  const message = raw.message.trim()
  if (!id || !titleKey || !message) return null
  if (!Number.isFinite(Date.parse(raw.createdAt))) return null

  const href = raw.href?.trim()
  const webtoonId = raw.data?.webtoonId?.trim()
  const episodeNumber = raw.data?.episodeNumber
  if (raw.data?.webtoonId !== undefined && !webtoonId) return null
  if (episodeNumber !== undefined && !isEpisodeNumber(episodeNumber)) return null

  return toPersistNotification({
    id,
    type: raw.type as PersistNotificationType,
    titleKey,
    message,
    isRead: raw.isRead,
    createdAt: new Date(raw.createdAt).toISOString(),
    href: href || null,
    webtoonId: webtoonId || null,
    episodeNumber: episodeNumber ?? null,
  })
}

const subscribeSchema = z.object({
  endpoint: z.string(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
})

const unsubscribeSchema = z.object({
  endpoint: z.string(),
})

export function createNotificationsApp(env: Env, _ports?: { push?: PushPort }) {
  const notifications = new Hono()

  notifications.use('*', async (c, next) => {
    if (c.req.method === 'POST' && !isJsonContentType(c.req.header('content-type'))) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }
    await next()
  })

  notifications.get('/me', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)
    return c.json({ data: snapshot(await persist.getNotifications(userId)) })
  })

  notifications.post('/upsert', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)

    const parsed = upsertSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)

    const notification = normalizeNotification(parsed.data.notification)
    if (!notification) return jsonError(c, 'VALIDATION_ERROR', 400)

    return c.json({
      data: snapshot(await persist.upsertNotification(userId, notification)),
    })
  })

  notifications.post('/read', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)

    const parsed = idSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)

    const id = parsed.data.id.trim()
    if (!id) return jsonError(c, 'VALIDATION_ERROR', 400)

    return c.json({ data: snapshot(await persist.markNotificationRead(userId, id)) })
  })

  notifications.post('/read-all', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)

    const parsed = emptySchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)

    return c.json({ data: snapshot(await persist.markAllNotificationsRead(userId)) })
  })

  notifications.post('/delete', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)

    const parsed = idSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)

    const id = parsed.data.id.trim()
    if (!id) return jsonError(c, 'VALIDATION_ERROR', 400)

    return c.json({ data: snapshot(await persist.deleteNotification(userId, id)) })
  })

  notifications.post('/clear-read', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)

    const parsed = emptySchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)

    return c.json({ data: snapshot(await persist.clearReadNotifications(userId)) })
  })

  notifications.get('/push/vapid', (c) => {
    if (!isPushConfigured(env) || !env.VAPID_PUBLIC_KEY) {
      return jsonError(c, 'PUSH_NOT_CONFIGURED', 503)
    }
    return c.json({ data: { publicKey: env.VAPID_PUBLIC_KEY } })
  })

  notifications.post('/push/subscribe', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)
    const parsed = subscribeSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)
    const endpoint = parsed.data.endpoint.trim()
    const p256dh = parsed.data.keys.p256dh.trim()
    const auth = parsed.data.keys.auth.trim()
    if (!endpoint || !p256dh || !auth) return jsonError(c, 'VALIDATION_ERROR', 400)
    await persist.upsertPushSubscription(userId, { endpoint, p256dh, auth })
    return c.json({ data: { ok: true } })
  })

  notifications.post('/push/unsubscribe', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)
    const parsed = unsubscribeSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)
    const endpoint = parsed.data.endpoint.trim()
    if (!endpoint) return jsonError(c, 'VALIDATION_ERROR', 400)
    await persist.deletePushSubscription(userId, endpoint)
    return c.json({ data: { ok: true } })
  })

  return notifications
}
