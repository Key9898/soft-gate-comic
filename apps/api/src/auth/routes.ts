import { Hono, type Context } from 'hono'
import { z } from 'zod'
import type { Env } from '../env.js'
import { isMailConfigured } from '../env.js'
import { forgotPasswordEmail } from '../mail/templates/forgot-password.js'
import { passwordResetEmail } from '../mail/templates/password-reset.js'
import { persist, type ReaderProfilePatch } from '../persist.js'
import { createMail, type MailPort } from '../ports/mail.js'
import { isAllowedAvatarDataUrl } from './avatar.js'
import {
  clearSessionCookies,
  issueSessionCookies,
  readAccessCookie,
  readRefreshCookie,
} from './cookies.js'
import { hashPassword, verifyPassword } from './password.js'
import {
  hashPasswordResetToken,
  newPasswordResetToken,
  PASSWORD_RESET_TTL_MS,
  passwordResetUrl,
} from './password-reset.js'
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

const forgotSchema = z.object({
  email: z.string(),
})

const resetSchema = z.object({
  token: z.string(),
  password: z.string(),
})

const profileSchema = z.object({
  displayName: z.string().optional(),
  email: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
})

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
})

const deleteAccountSchema = z.object({
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

async function readerFromAccessCookie(c: Context, env: Env) {
  const token = readAccessCookie(c)
  if (!token) return undefined
  try {
    const userId = await verifyAccessToken(env, token)
    return persist.findUserById(userId)
  } catch {
    return undefined
  }
}

export function createAuthApp(env: Env, options?: { mail?: MailPort }) {
  const auth = new Hono()
  const mail = options?.mail ?? createMail(env)

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
    if (await persist.findUserByEmail(email)) {
      return jsonError(c, 'EMAIL_TAKEN', 409)
    }
    if (await persist.findUserByUsername(username)) {
      return jsonError(c, 'USERNAME_TAKEN', 409)
    }

    const user = await persist.createUser({
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
    const user = await persist.findUserByEmail(email)
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return jsonError(c, 'INVALID_CREDENTIALS', 401)
    }

    await issueSessionCookies(c, env, user.id)
    const fresh = (await persist.findUserById(user.id)) ?? user
    return c.json({ data: persist.toPublicUser(fresh) })
  })

  auth.post('/logout', async (c) => {
    const refresh = readRefreshCookie(c)
    if (refresh) {
      try {
        const { jti } = await verifyRefreshToken(env, refresh)
        await persist.revokeRefreshJti(jti)
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
      const user = await persist.findUserById(userId)
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
      const storedUserId = await persist.consumeRefreshJti(jti)
      if (!storedUserId || storedUserId !== userId) {
        return jsonError(c, 'NOT_AUTHENTICATED', 401)
      }
      const user = await persist.findUserById(userId)
      if (!user) {
        return jsonError(c, 'NOT_AUTHENTICATED', 401)
      }
      await issueSessionCookies(c, env, user.id)
      return c.json({ data: persist.toPublicUser(user) })
    } catch {
      return jsonError(c, 'NOT_AUTHENTICATED', 401)
    }
  })

  auth.post('/forgot', async (c) => {
    const parsed = forgotSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }

    const email = parsed.data.email.trim().toLowerCase()
    if (!EMAIL_RE.test(email)) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }

    const user = await persist.findUserByEmail(email)
    if (user) {
      const raw = newPasswordResetToken()
      await persist.createPasswordResetToken(
        user.id,
        hashPasswordResetToken(raw),
        new Date(Date.now() + PASSWORD_RESET_TTL_MS)
      )
      if (isMailConfigured(env)) {
        const rendered = forgotPasswordEmail(passwordResetUrl(env.CLIENT_URL, raw))
        try {
          await mail.sendTransactional({
            to: user.email,
            subject: rendered.subject,
            html: rendered.html,
            text: rendered.text,
          })
        } catch {
          /* enumeration-safe: still 200 */
        }
      }
    }

    return c.json({ data: { ok: true } })
  })

  auth.post('/reset', async (c) => {
    const parsed = resetSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }

    const token = parsed.data.token.trim()
    const password = parsed.data.password
    if (!token) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return jsonError(c, 'PASSWORD_TOO_SHORT', 400)
    }

    const result = await persist.resetPasswordWithToken(
      hashPasswordResetToken(token),
      await hashPassword(password)
    )
    if (!result.ok) {
      return jsonError(c, 'RESET_TOKEN_INVALID', 400)
    }

    if (isMailConfigured(env)) {
      const rendered = passwordResetEmail()
      try {
        await mail.sendTransactional({
          to: result.email,
          subject: rendered.subject,
          html: rendered.html,
          text: rendered.text,
        })
      } catch {
        /* password already changed */
      }
    }

    return c.json({ data: { ok: true } })
  })

  auth.post('/profile', async (c) => {
    const user = await readerFromAccessCookie(c, env)
    if (!user) {
      return jsonError(c, 'NOT_AUTHENTICATED', 401)
    }

    const parsed = profileSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }

    const patch: ReaderProfilePatch = {}
    if (parsed.data.displayName !== undefined) {
      const displayName = parsed.data.displayName.trim()
      if (!displayName || displayName.length < 3) {
        return jsonError(c, 'VALIDATION_ERROR', 400)
      }
      patch.displayName = displayName
    }
    if (parsed.data.email !== undefined) {
      const email = parsed.data.email.trim().toLowerCase()
      if (!EMAIL_RE.test(email)) {
        return jsonError(c, 'VALIDATION_ERROR', 400)
      }
      patch.email = email
    }
    if (parsed.data.bio !== undefined) {
      patch.bio = parsed.data.bio
    }
    if (parsed.data.avatar !== undefined) {
      if (!isAllowedAvatarDataUrl(parsed.data.avatar)) {
        return jsonError(c, 'VALIDATION_ERROR', 400)
      }
      patch.avatar = parsed.data.avatar
    }
    if (
      patch.displayName === undefined &&
      patch.email === undefined &&
      patch.bio === undefined &&
      patch.avatar === undefined
    ) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }

    const result = await persist.updateReaderProfile(user.id, patch)
    if (!result.ok) {
      if (result.reason === 'EMAIL_TAKEN') {
        return jsonError(c, 'EMAIL_TAKEN', 409)
      }
      return jsonError(c, 'NOT_AUTHENTICATED', 401)
    }
    return c.json({ data: persist.toPublicUser(result.user) })
  })

  auth.post('/password', async (c) => {
    const user = await readerFromAccessCookie(c, env)
    if (!user) {
      return jsonError(c, 'NOT_AUTHENTICATED', 401)
    }

    const parsed = changePasswordSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }

    const currentPassword = parsed.data.currentPassword
    const newPassword = parsed.data.newPassword
    if (!(await verifyPassword(currentPassword, user.passwordHash))) {
      return jsonError(c, 'INVALID_CREDENTIALS', 401)
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return jsonError(c, 'PASSWORD_TOO_SHORT', 400)
    }

    const changed = await persist.changeReaderPassword(user.id, await hashPassword(newPassword))
    if (changed !== 'ok') {
      return jsonError(c, 'NOT_AUTHENTICATED', 401)
    }
    return c.json({ data: { ok: true } })
  })

  auth.post('/delete-account', async (c) => {
    const user = await readerFromAccessCookie(c, env)
    if (!user) {
      return jsonError(c, 'NOT_AUTHENTICATED', 401)
    }

    const parsed = deleteAccountSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) {
      return jsonError(c, 'VALIDATION_ERROR', 400)
    }

    if (!(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return jsonError(c, 'INVALID_CREDENTIALS', 401)
    }

    const deleted = await persist.deleteReaderUser(user.id)
    if (deleted !== 'ok') {
      return jsonError(c, 'NOT_AUTHENTICATED', 401)
    }
    clearSessionCookies(c, env)
    return c.json({ data: { ok: true } })
  })

  return auth
}
