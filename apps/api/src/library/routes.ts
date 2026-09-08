import { Hono } from 'hono'
import { z } from 'zod'
import type { Env } from '../env.js'
import { persist } from '../persist.js'
import { optionalReaderUserId } from '../auth/session.js'

const webtoonIdSchema = z.object({
  webtoonId: z.string(),
})

const subscribeSchema = z.object({
  webtoonId: z.string(),
  lastNotifiedEpisodeNumber: z.number().optional(),
})

const muteSchema = z.object({
  webtoonId: z.string(),
  muted: z.boolean(),
})

const stampSchema = z.object({
  webtoonId: z.string(),
  episodeNumber: z.number(),
})

const historySchema = z.object({
  webtoonId: z.string(),
  episodeNumber: z.number(),
  scrollRatio: z.number().optional(),
})

const removeSchema = z.object({
  webtoonIds: z.array(z.string()),
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

function trimmedId(value: string) {
  return value.trim()
}

function isEpisodeNumber(value: number) {
  return Number.isInteger(value) && value >= 1
}

export function createLibraryApp(env: Env) {
  const library = new Hono()

  library.use('*', async (c, next) => {
    if (c.req.method === 'POST' && !isJsonContentType(c.req.header('content-type'))) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }
    await next()
  })

  library.get('/me', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)
    return c.json({ data: await persist.getLibrary(userId) })
  })

  library.post('/subscribe', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)

    const parsed = subscribeSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)

    const webtoonId = trimmedId(parsed.data.webtoonId)
    const lastNotified = parsed.data.lastNotifiedEpisodeNumber
    if (!webtoonId) return jsonError(c, 'VALIDATION_ERROR', 400)
    if (lastNotified !== undefined && !isEpisodeNumber(lastNotified)) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }

    return c.json({
      data: await persist.toggleLibrarySubscribe(userId, webtoonId, lastNotified),
    })
  })

  library.post('/mute', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)

    const parsed = muteSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)

    const webtoonId = trimmedId(parsed.data.webtoonId)
    if (!webtoonId) return jsonError(c, 'VALIDATION_ERROR', 400)

    return c.json({ data: await persist.setLibraryMute(userId, webtoonId, parsed.data.muted) })
  })

  library.post('/stamp-notified', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)

    const parsed = stampSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)

    const webtoonId = trimmedId(parsed.data.webtoonId)
    if (!webtoonId || !isEpisodeNumber(parsed.data.episodeNumber)) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }

    return c.json({
      data: await persist.stampLibraryNotified(userId, webtoonId, parsed.data.episodeNumber),
    })
  })

  library.post('/history', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)

    const parsed = historySchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)

    const webtoonId = trimmedId(parsed.data.webtoonId)
    const { episodeNumber, scrollRatio } = parsed.data
    if (!webtoonId || !isEpisodeNumber(episodeNumber)) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }
    if (scrollRatio !== undefined && !Number.isFinite(scrollRatio)) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }

    return c.json({
      data: await persist.upsertLibraryHistory(userId, webtoonId, episodeNumber, scrollRatio),
    })
  })

  library.post('/like', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)

    const parsed = webtoonIdSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)

    const webtoonId = trimmedId(parsed.data.webtoonId)
    if (!webtoonId) return jsonError(c, 'VALIDATION_ERROR', 400)

    return c.json({ data: await persist.toggleLibraryLike(userId, webtoonId) })
  })

  library.post('/remove-bookmarks', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)

    const parsed = removeSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)

    const webtoonIds = parsed.data.webtoonIds.map(trimmedId).filter(Boolean)
    if (webtoonIds.length === 0) return jsonError(c, 'VALIDATION_ERROR', 400)

    return c.json({ data: await persist.removeLibraryBookmarks(userId, webtoonIds) })
  })

  library.post('/remove-history', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)

    const parsed = removeSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)

    const webtoonIds = parsed.data.webtoonIds.map(trimmedId).filter(Boolean)
    if (webtoonIds.length === 0) return jsonError(c, 'VALIDATION_ERROR', 400)

    return c.json({ data: await persist.removeLibraryHistory(userId, webtoonIds) })
  })

  library.post('/remove-likes', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)

    const parsed = removeSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)

    const webtoonIds = parsed.data.webtoonIds.map(trimmedId).filter(Boolean)
    if (webtoonIds.length === 0) return jsonError(c, 'VALIDATION_ERROR', 400)

    return c.json({ data: await persist.removeLibraryLikes(userId, webtoonIds) })
  })

  return library
}
