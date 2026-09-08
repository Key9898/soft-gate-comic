import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { hashPasswordResetToken, PASSWORD_RESET_TTL_MS } from '../auth/password-reset.js'
import { ACCESS_COOKIE, REFRESH_COOKIE } from '../auth/types.js'
import { persist } from '../persist.js'
import { createMail, type MailPort, type SendTransactionalInput } from '../ports/mail.js'
import { testEnv } from './helpers.js'

const jsonHeaders = { 'Content-Type': 'application/json' }

const registerBody = {
  email: 'reader@example.com',
  password: 'password1',
  username: 'readerone',
  displayName: 'Reader One',
}

const mailEnv = {
  BREVO_API_KEY: 'xkeysib-testkeyxxxx',
  BREVO_FROM_EMAIL: 'noreply@softgate.example',
} as const

function cookieHeader(res: Response) {
  return res.headers
    .getSetCookie()
    .map((part) => part.split(';')[0])
    .join('; ')
}

function spyMail() {
  const sent: SendTransactionalInput[] = []
  const mail: MailPort = {
    async sendTransactional(input) {
      sent.push(input)
    },
  }
  return { mail, sent }
}

describe('password reset', () => {
  beforeEach(async () => {
    await persist.clearAuth()
  })

  afterEach(async () => {
    await persist.clearAuth()
  })

  it('returns 200 and does not send when mail is unset', async () => {
    const { mail, sent } = spyMail()
    const app = createApp(testEnv(), { mail })
    await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const res = await app.request('/api/auth/forgot', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ email: 'reader@example.com' }),
    })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ data: { ok: true } })
    expect(sent).toHaveLength(0)
  })

  it('returns 200 and does not send when mail slots are partial', async () => {
    const { mail, sent } = spyMail()
    const app = createApp(testEnv({ BREVO_API_KEY: 'xkeysib-testkeyxxxx' }), { mail })
    const res = await app.request('/api/auth/forgot', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ email: 'nobody@example.com' }),
    })
    expect(res.status).toBe(200)
    expect(sent).toHaveLength(0)
  })

  it('returns 200 for an unknown email without sending', async () => {
    const { mail, sent } = spyMail()
    const app = createApp(testEnv(mailEnv), { mail })
    const res = await app.request('/api/auth/forgot', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ email: 'missing@example.com' }),
    })
    expect(res.status).toBe(200)
    const body = (await res.json()) as { data: { ok: true } }
    expect(body).toEqual({ data: { ok: true } })
    expect(sent).toHaveLength(0)
    expect(JSON.stringify(body)).not.toMatch(/token/i)
  })

  it('sends a CLIENT_URL reset link when mail is configured', async () => {
    const { mail, sent } = spyMail()
    const app = createApp(testEnv(mailEnv), { mail })
    await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const res = await app.request('/api/auth/forgot', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ email: 'reader@example.com' }),
    })
    expect(res.status).toBe(200)
    expect(sent).toHaveLength(1)
    expect(sent[0]?.to).toBe('reader@example.com')
    expect(sent[0]?.html).toContain('http://localhost:5173/reset-password/')
    expect(sent[0]?.text).toContain('http://localhost:5173/reset-password/')
    expect(sent[0]?.html).not.toContain('portal/')
    const match = sent[0]?.text.match(/http:\/\/localhost:5173\/reset-password\/([0-9a-f]+)/)
    expect(match?.[1]?.length).toBe(64)
  })

  it('rejects an invalid or reused token and accepts a seeded token without mail', async () => {
    const app = createApp(testEnv())
    const registered = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const user = await persist.findUserByEmail('reader@example.com')
    expect(user).toBeTruthy()
    const raw = 'a'.repeat(64)
    await persist.createPasswordResetToken(
      user!.id,
      hashPasswordResetToken(raw),
      new Date(Date.now() + PASSWORD_RESET_TTL_MS)
    )

    const tooShort = await app.request('/api/auth/reset', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ token: raw, password: 'short' }),
    })
    expect(tooShort.status).toBe(400)
    expect(await tooShort.json()).toEqual({ error: { code: 'PASSWORD_TOO_SHORT' } })

    const ok = await app.request('/api/auth/reset', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ token: raw, password: 'changed99' }),
    })
    expect(ok.status).toBe(200)
    expect(await ok.json()).toEqual({ data: { ok: true } })
    expect(ok.headers.getSetCookie().some((part) => part.startsWith(`${ACCESS_COOKIE}=`))).toBe(
      false
    )

    const reused = await app.request('/api/auth/reset', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ token: raw, password: 'changed99' }),
    })
    expect(reused.status).toBe(400)
    expect(await reused.json()).toEqual({ error: { code: 'RESET_TOKEN_INVALID' } })

    const refresh = await app.request('/api/auth/refresh', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookieHeader(registered) },
      body: '{}',
    })
    expect(refresh.status).toBe(401)

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
    expect(
      newLogin.headers.getSetCookie().some((part) => part.startsWith(`${REFRESH_COOKIE}=`))
    ).toBe(true)
  })

  it('rejects an expired token', async () => {
    const app = createApp(testEnv())
    await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const user = await persist.findUserByEmail('reader@example.com')
    const raw = 'b'.repeat(64)
    await persist.createPasswordResetToken(
      user!.id,
      hashPasswordResetToken(raw),
      new Date(Date.now() - 1000)
    )
    const res = await app.request('/api/auth/reset', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ token: raw, password: 'changed99' }),
    })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: { code: 'RESET_TOKEN_INVALID' } })
  })

  it('sends confirmation only when mail is configured after a successful reset', async () => {
    const { mail, sent } = spyMail()
    const withMail = createApp(testEnv(mailEnv), { mail })
    await withMail.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const user = await persist.findUserByEmail('reader@example.com')
    const raw = 'c'.repeat(64)
    await persist.createPasswordResetToken(
      user!.id,
      hashPasswordResetToken(raw),
      new Date(Date.now() + PASSWORD_RESET_TTL_MS)
    )
    const res = await withMail.request('/api/auth/reset', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ token: raw, password: 'changed99' }),
    })
    expect(res.status).toBe(200)
    expect(sent).toHaveLength(1)
    expect(sent[0]?.to).toBe('reader@example.com')
    expect(sent[0]?.html).not.toContain('/reset-password/')

    sent.length = 0
    const noMail = createApp(testEnv(), { mail })
    await persist.clearAuth()
    await noMail.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const again = await persist.findUserByEmail('reader@example.com')
    const raw2 = 'd'.repeat(64)
    await persist.createPasswordResetToken(
      again!.id,
      hashPasswordResetToken(raw2),
      new Date(Date.now() + PASSWORD_RESET_TTL_MS)
    )
    await noMail.request('/api/auth/reset', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ token: raw2, password: 'changed99' }),
    })
    expect(sent).toHaveLength(0)
  })
})

describe('createMail', () => {
  it('throws MAIL_NOT_CONFIGURED when env is unset', async () => {
    const mail = createMail(testEnv())
    await expect(
      mail.sendTransactional({
        to: 'reader@example.com',
        subject: 'Demo',
        html: '<p>x</p>',
        text: 'x',
      })
    ).rejects.toMatchObject({ code: 'MAIL_NOT_CONFIGURED' })
  })

  it('uses injected send and does not construct a live client', async () => {
    const sent: unknown[] = []
    const mail = createMail(testEnv(mailEnv), {
      send: async (request) => {
        sent.push(request)
      },
    })
    await mail.sendTransactional({
      to: 'reader@example.com',
      subject: 'Reset your password / စကားဝှက် ပြန်သတ်မှတ်ပါ',
      html: '<p>http://localhost:5173/reset-password/abc</p>',
      text: 'http://localhost:5173/reset-password/abc',
    })
    expect(sent).toEqual([
      {
        to: [{ email: 'reader@example.com' }],
        sender: { name: 'SoftGate Comic', email: 'noreply@softgate.example' },
        subject: 'Reset your password / စကားဝှက် ပြန်သတ်မှတ်ပါ',
        htmlContent: '<p>http://localhost:5173/reset-password/abc</p>',
        textContent: 'http://localhost:5173/reset-password/abc',
      },
    ])
  })
})
