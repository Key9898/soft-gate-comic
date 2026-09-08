import { Hono } from 'hono'
import { z } from 'zod'
import type { Env } from '../env.js'
import {
  persist,
  normalizeBrightness,
  type PersistFontSize,
  type PersistImageFit,
  type PersistNotifPrefsPatch,
  type PersistReaderPrefs,
  type PrefsSnapshot,
} from '../persist.js'
import { optionalReaderUserId } from '../auth/session.js'

const FONT_SIZES = ['sm', 'md', 'lg'] as const
const IMAGE_FITS = ['fit', 'full'] as const

const notifPatchSchema = z.object({
  newEpisode: z.boolean().optional(),
  commentReply: z.boolean().optional(),
  promotion: z.boolean().optional(),
})

const readerSchema = z.object({
  darkMode: z.boolean(),
  brightness: z.number(),
  fontSize: z.enum(FONT_SIZES),
  imageFit: z.enum(IMAGE_FITS),
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

function isBrightness(value: number) {
  return Number.isFinite(value) && value >= 0.25 && value <= 1
}

function snapshot(data: PrefsSnapshot) {
  return data
}

export function createPrefsApp(env: Env) {
  const prefs = new Hono()

  prefs.use('*', async (c, next) => {
    if (c.req.method === 'POST' && !isJsonContentType(c.req.header('content-type'))) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }
    await next()
  })

  prefs.get('/me', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)
    return c.json({ data: snapshot(await persist.getPrefs(userId)) })
  })

  prefs.post('/notif', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)

    const parsed = notifPatchSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)

    const patch: PersistNotifPrefsPatch = {}
    if (typeof parsed.data.newEpisode === 'boolean') patch.newEpisode = parsed.data.newEpisode
    if (typeof parsed.data.commentReply === 'boolean') patch.commentReply = parsed.data.commentReply
    if (typeof parsed.data.promotion === 'boolean') patch.promotion = parsed.data.promotion
    if (Object.keys(patch).length === 0) return jsonError(c, 'VALIDATION_ERROR', 400)

    return c.json({ data: snapshot(await persist.patchNotifPrefs(userId, patch)) })
  })

  prefs.post('/reader', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)

    const parsed = readerSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) return jsonError(c, 'VALIDATION_ERROR', 400)
    if (!isBrightness(parsed.data.brightness)) return jsonError(c, 'VALIDATION_ERROR', 400)

    const reader: PersistReaderPrefs = {
      darkMode: parsed.data.darkMode,
      brightness: normalizeBrightness(parsed.data.brightness),
      fontSize: parsed.data.fontSize as PersistFontSize,
      imageFit: parsed.data.imageFit as PersistImageFit,
    }

    return c.json({ data: snapshot(await persist.setReaderPrefs(userId, reader)) })
  })

  return prefs
}
