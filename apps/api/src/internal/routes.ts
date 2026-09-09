import { Hono } from 'hono'
import { z } from 'zod'
import type { Env } from '../env.js'
import { persist, type PersistCampaign, type PersistNotification } from '../persist.js'
import type { MailPort } from '../ports/mail.js'
import type { PushPort } from '../ports/push.js'
import { requireServiceToken } from './serviceAuth.js'
import { campaignInboxId } from '../notify/campaign.js'
import { NEW_EPISODE_TITLE_KEY, newEpisodeInboxId, newEpisodeMessageEn } from '../notify/episode.js'
import { deliverOutOfBand } from '../notify/deliver.js'

const previewSchema = z.union([
  z.object({ all: z.literal(true), userIds: z.undefined().optional() }),
  z.object({ all: z.undefined().optional(), userIds: z.array(z.string()).min(1) }),
])

const broadcastSchema = z.object({
  campaignId: z.string(),
  type: z.enum(['system', 'promotion']),
  titleKey: z.string(),
  message: z.string(),
  href: z.string().optional(),
  audience: z.union([
    z.object({ all: z.literal(true) }),
    z.object({ userIds: z.array(z.string()).min(1) }),
  ]),
})

const newEpisodeSchema = z.object({
  webtoonId: z.string(),
  episodeNumber: z.number().int().min(1),
})

function jsonError(
  c: { json: (body: unknown, status: 400 | 401) => Response },
  code: string,
  status: 400 | 401
) {
  return c.json({ error: { code } }, status)
}

function isJsonContentType(contentType: string | undefined) {
  return (contentType ?? '').toLowerCase().includes('application/json')
}

function clampLimit(raw: string | undefined) {
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 1) return 20
  return Math.min(50, Math.floor(n))
}

function clampOffset(raw: string | undefined) {
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.floor(n)
}

function uniqueIds(ids: string[]) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const id of ids) {
    const trimmed = id.trim()
    if (!trimmed || seen.has(trimmed)) continue
    seen.add(trimmed)
    out.push(trimmed)
  }
  return out
}

async function resolveAudienceIds(audience: { all: true } | { userIds: string[] }) {
  if ('userIds' in audience) return uniqueIds(audience.userIds)
  return persist.listReaderIds()
}

export function createInternalNotificationsApp(
  env: Env,
  ports: { mail: MailPort; push: PushPort }
) {
  const internal = new Hono()
  internal.use('*', requireServiceToken(env))
  internal.use('*', async (c, next) => {
    if (c.req.method === 'POST' && !isJsonContentType(c.req.header('content-type'))) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }
    await next()
  })

  internal.get('/search', async (c) => {
    const q = (c.req.query('q') ?? '').trim()
    const limit = clampLimit(c.req.query('limit'))
    const offset = clampOffset(c.req.query('offset'))
    const result = await persist.listReaders({ q: q || undefined, limit, offset })
    return c.json({ data: result })
  })

  internal.post('/preview', async (c) => {
    const parsed = previewSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)
    const ids =
      'all' in parsed.data && parsed.data.all
        ? await persist.listReaderIds()
        : uniqueIds(parsed.data.userIds ?? [])
    let readers = 0
    let withPush = 0
    for (const id of ids) {
      const user = await persist.findUserById(id)
      if (!user) continue
      readers += 1
      const subs = await persist.listPushSubscriptions(id)
      if (subs.length > 0) withPush += 1
    }
    return c.json({ data: { readers, withEmail: readers, withPush } })
  })

  internal.post('/broadcast', async (c) => {
    const parsed = broadcastSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)
    const campaignId = parsed.data.campaignId.trim()
    const titleKey = parsed.data.titleKey.trim()
    const message = parsed.data.message.trim()
    const href = parsed.data.href?.trim()
    if (!campaignId || !titleKey || !message) return jsonError(c, 'VALIDATION_ERROR', 400)

    const userIds = await resolveAudienceIds(parsed.data.audience)
    const inboxId = campaignInboxId(campaignId)
    const existing = await persist.getCampaign(campaignId)
    if (existing) {
      let pending = false
      for (const id of userIds) {
        const user = await persist.findUserById(id)
        if (!user) continue
        if (!(await persist.hasNotification(id, inboxId))) {
          const prefs = await persist.getPrefs(id)
          if (parsed.data.type === 'promotion' && !prefs.notifPrefs.promotion) continue
          pending = true
          break
        }
      }
      if (!pending) {
        return c.json({
          data: {
            campaignId: existing.id,
            inbox: existing.inbox,
            emailed: existing.emailed,
            pushed: existing.pushed,
            skippedPref: existing.skippedPref,
          },
        })
      }
    }

    let inbox = 0
    let emailed = 0
    let pushed = 0
    let skippedPref = 0

    for (const id of userIds) {
      const user = await persist.findUserById(id)
      if (!user) continue
      if (await persist.hasNotification(id, inboxId)) {
        inbox += 1
        continue
      }
      const prefs = await persist.getPrefs(id)
      if (parsed.data.type === 'promotion' && !prefs.notifPrefs.promotion) {
        skippedPref += 1
        continue
      }
      const notification: PersistNotification = {
        id: inboxId,
        type: parsed.data.type,
        titleKey,
        message,
        isRead: false,
        createdAt: new Date().toISOString(),
        ...(href ? { href } : {}),
      }
      await persist.upsertNotification(id, notification)
      inbox += 1
      const sendOut = parsed.data.type === 'system' || prefs.notifPrefs.promotion
      const out = await deliverOutOfBand({
        env,
        mail: ports.mail,
        push: ports.push,
        user,
        notification,
        sendEmail: sendOut,
        sendPush: sendOut,
      })
      if (out.emailed) emailed += 1
      if (out.pushed) pushed += 1
    }

    const campaign: PersistCampaign = {
      id: campaignId,
      type: parsed.data.type,
      titleKey,
      message,
      inbox,
      emailed,
      pushed,
      skippedPref,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      ...(href ? { href } : {}),
    }
    await persist.upsertCampaign(campaign)
    return c.json({
      data: { campaignId, inbox, emailed, pushed, skippedPref },
    })
  })

  internal.post('/new-episode', async (c) => {
    const parsed = newEpisodeSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)
    const webtoonId = parsed.data.webtoonId.trim()
    const episodeNumber = parsed.data.episodeNumber
    if (!webtoonId || !Number.isInteger(episodeNumber) || episodeNumber < 1) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }

    const zeros = {
      webtoonId,
      episodeNumber,
      inbox: 0,
      emailed: 0,
      pushed: 0,
      skippedPref: 0,
    }

    const catalog = await persist.getPublishedCatalog()
    const webtoon = catalog.webtoons.find((row) => row.id === webtoonId)
    const episode = catalog.episodes.find(
      (row) =>
        row.webtoonId === webtoonId &&
        row.episodeNumber === episodeNumber &&
        row.status === 'published'
    )
    if (!webtoon || !episode) return c.json({ data: zeros })

    const title = webtoon.title.en.trim() || webtoonId
    const href = `/webtoon/${webtoonId}`
    const inboxId = newEpisodeInboxId(webtoonId, episodeNumber)
    const message = newEpisodeMessageEn(title, episodeNumber)
    const subscribers = await persist.listLibrarySubscribers(webtoonId)

    let inbox = 0
    let emailed = 0
    let pushed = 0
    let skippedPref = 0

    for (const subscriber of subscribers) {
      if (subscriber.notifyMuted) continue
      if (
        typeof subscriber.lastNotifiedEpisodeNumber === 'number' &&
        subscriber.lastNotifiedEpisodeNumber >= episodeNumber
      ) {
        continue
      }
      const prefs = await persist.getPrefs(subscriber.userId)
      if (!prefs.notifPrefs.newEpisode) {
        skippedPref += 1
        continue
      }
      const user = await persist.findUserById(subscriber.userId)
      if (!user) continue
      if (await persist.hasNotification(subscriber.userId, inboxId)) {
        inbox += 1
        await persist.stampLibraryNotified(subscriber.userId, webtoonId, episodeNumber)
        continue
      }
      const notification: PersistNotification = {
        id: inboxId,
        type: 'new_episode',
        titleKey: NEW_EPISODE_TITLE_KEY,
        message,
        isRead: false,
        createdAt: new Date().toISOString(),
        href,
        data: { webtoonId, episodeNumber },
      }
      await persist.upsertNotification(subscriber.userId, notification)
      inbox += 1
      const out = await deliverOutOfBand({
        env,
        mail: ports.mail,
        push: ports.push,
        user,
        notification,
        sendEmail: true,
        sendPush: true,
      })
      if (out.emailed) emailed += 1
      if (out.pushed) pushed += 1
      await persist.stampLibraryNotified(subscriber.userId, webtoonId, episodeNumber)
    }

    return c.json({
      data: { webtoonId, episodeNumber, inbox, emailed, pushed, skippedPref },
    })
  })

  return internal
}
