import { Hono } from 'hono'
import { z } from 'zod'
import type { Env } from '../env.js'
import { persist } from '../persist.js'
import { optionalReaderUserId } from '../auth/session.js'

const demoTopUpSchema = z.object({
  coins: z.number(),
  description: z.string(),
  packageId: z.string().optional(),
})

const unlockSchema = z.object({
  webtoonId: z.string(),
  episodeNumber: z.number(),
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

export function createWalletApp(env: Env) {
  const wallet = new Hono()

  wallet.use('*', async (c, next) => {
    if (c.req.method === 'POST' && !isJsonContentType(c.req.header('content-type'))) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }
    await next()
  })

  wallet.get('/me', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)
    return c.json({ data: await persist.getWallet(userId) })
  })

  wallet.post('/demo-topup', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)

    const parsed = demoTopUpSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }
    const coins = parsed.data.coins
    if (!Number.isFinite(coins) || coins <= 0) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }

    return c.json({
      data: await persist.demoTopUp(userId, coins, parsed.data.description, parsed.data.packageId),
    })
  })

  wallet.post('/unlock', async (c) => {
    const userId = await optionalReaderUserId(c, env)
    if (!userId) return jsonError(c, 'NOT_AUTHENTICATED', 401)

    const parsed = unlockSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }

    const webtoonId = parsed.data.webtoonId.trim()
    const episodeNumber = parsed.data.episodeNumber
    if (!webtoonId || !Number.isInteger(episodeNumber)) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }

    const result = await persist.unlockEpisode(userId, webtoonId, episodeNumber)
    if (!result.ok) {
      return jsonError(c, result.reason, 400)
    }
    return c.json({ data: result.wallet })
  })

  return wallet
}
