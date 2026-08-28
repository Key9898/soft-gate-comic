import { Hono } from 'hono'
import { z } from 'zod'
import type { Env } from '../env.js'
import { persist } from '../persist.js'
import {
  clearSessionCookies,
  issueSessionCookies,
  readAccessCookie,
  readRefreshCookie,
} from './cookies.js'
import { hashPassword, verifyPassword } from './password.js'
import { verifyAccessToken, verifyRefreshToken } from './tokens.js'
import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from './types.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const registerSchema = z.object({
  email: z.string(),
  password: z.string(),
  username: z.string(),
  displayName: z.string(),
})

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
})

function jsonError(
  c: { json: (body: unknown, status: 400 | 401 | 403 | 409) => Response },
  code: string,
  status: 400 | 401 | 403 | 409
) {
  return c.json({ error: { code } }, status)
}

function isJsonContentType(contentType: string | undefined) {
  return (contentType ?? '').toLowerCase().includes('application/json')
}

export function createAuthApp(env: Env) {
  const auth = new Hono()

  auth.use('*', async (c, next) => {
    if (c.req.method === 'POST' && !isJsonContentType(c.req.header('content-type'))) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }
    await next()
  })

  auth.post('/register', async (c) => {
    if (!persist.isRegistrationOpen()) {
      return jsonError(c, 'REGISTRATION_CLOSED', 403)
    }

    const parsed = registerSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }

    const email = parsed.data.email.trim().toLowerCase()
    const username = parsed.data.username.trim()
    const displayName = parsed.data.displayName.trim()
    const password = parsed.data.password

    if (!EMAIL_RE.test(email) || username.length < MIN_USERNAME_LENGTH || !displayName) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return jsonError(c, 'PASSWORD_TOO_SHORT', 400)
    }
    if (persist.findUserByEmail(email)) {
      return jsonError(c, 'EMAIL_TAKEN', 409)
    }
    if (persist.findUserByUsername(username)) {
      return jsonError(c, 'USERNAME_TAKEN', 409)
    }

    const user = persist.createUser({
      email,
      username,
      displayName,
      passwordHash: await hashPassword(password),
    })
    await issueSessionCookies(c, env, user.id)
    return c.json({ data: persist.toPublicUser(user) })
  })

  auth.post('/login', async (c) => {
    const parsed = loginSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }

    const email = parsed.data.email.trim().toLowerCase()
    const password = parsed.data.password
    const user = persist.findUserByEmail(email)
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return jsonError(c, 'INVALID_CREDENTIALS', 401)
    }

    await issueSessionCookies(c, env, user.id)
    const fresh = persist.findUserById(user.id) ?? user
    return c.json({ data: persist.toPublicUser(fresh) })
  })

  auth.post('/logout', async (c) => {
    const refresh = readRefreshCookie(c)
    if (refresh) {
      try {
        const { jti } = await verifyRefreshToken(env, refresh)
        persist.revokeRefreshJti(jti)
      } catch {
        /* expired or forged refresh — still clear cookies */
      }
    }
    clearSessionCookies(c, env)
    return c.json({ data: { ok: true } })
  })

  auth.get('/me', async (c) => {
    const token = readAccessCookie(c)
    if (!token) {
      return jsonError(c, 'NOT_AUTHENTICATED', 401)
    }
    try {
      const userId = await verifyAccessToken(env, token)
      const user = persist.findUserById(userId)
      if (!user) {
        return jsonError(c, 'NOT_AUTHENTICATED', 401)
      }
      return c.json({ data: persist.toPublicUser(user) })
    } catch {
      return jsonError(c, 'NOT_AUTHENTICATED', 401)
    }
  })

  auth.post('/refresh', async (c) => {
    const token = readRefreshCookie(c)
    if (!token) {
      return jsonError(c, 'NOT_AUTHENTICATED', 401)
    }
    try {
      const { userId, jti } = await verifyRefreshToken(env, token)
      const storedUserId = persist.consumeRefreshJti(jti)
      if (!storedUserId || storedUserId !== userId) {
        return jsonError(c, 'NOT_AUTHENTICATED', 401)
      }
      const user = persist.findUserById(userId)
      if (!user) {
        return jsonError(c, 'NOT_AUTHENTICATED', 401)
      }
      await issueSessionCookies(c, env, user.id)
      return c.json({ data: persist.toPublicUser(user) })
    } catch {
      return jsonError(c, 'NOT_AUTHENTICATED', 401)
    }
  })

  return auth
}
