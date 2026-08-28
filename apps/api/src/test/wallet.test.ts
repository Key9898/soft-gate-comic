import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { persist, STUB_SEED_BALANCE } from '../persist.js'
import { testEnv } from './helpers.js'

const jsonHeaders = { 'Content-Type': 'application/json' }

const registerBody = {
  email: 'wallet@example.com',
  password: 'password1',
  username: 'walletone',
  displayName: 'Wallet One',
}

function cookieHeader(res: Response) {
  return res.headers
    .getSetCookie()
    .map((part) => part.split(';')[0])
    .join('; ')
}

describe('wallet stub', () => {
  beforeEach(() => {
    persist.clearAuth()
  })

  afterEach(() => {
    persist.clearAuth()
  })

  it('seeds 150 on first /me and does not set cookies', async () => {
    const app = createApp(testEnv())
    const registered = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const res = await app.request('/api/wallet/me', {
      headers: { Cookie: cookieHeader(registered) },
    })
    expect(res.status).toBe(200)
    expect(res.headers.get('Set-Cookie')).toBeNull()
    const body = (await res.json()) as {
      data: { balance: number; transactions: unknown[]; unlockedEpisodeKeys: string[] }
    }
    expect(body.data.balance).toBe(STUB_SEED_BALANCE)
    expect(body.data.unlockedEpisodeKeys).toEqual([])
    expect(body.data.transactions.length).toBeGreaterThan(0)
  })

  it('rejects unauthenticated /me', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/api/wallet/me')
    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ error: { code: 'NOT_AUTHENTICATED' } })
  })

  it('credits demo top-up and rejects non-positive coins', async () => {
    const app = createApp(testEnv())
    const registered = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const cookie = cookieHeader(registered)

    const credited = await app.request('/api/wallet/demo-topup', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ coins: 80, description: 'Demo pack' }),
    })
    expect(credited.status).toBe(200)
    const body = (await credited.json()) as { data: { balance: number } }
    expect(body.data.balance).toBe(STUB_SEED_BALANCE + 80)

    const rejected = await app.request('/api/wallet/demo-topup', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ coins: 0, description: 'noop' }),
    })
    expect(rejected.status).toBe(400)
    expect(await rejected.json()).toEqual({ error: { code: 'VALIDATION_ERROR' } })
  })

  it('unlocks a locked episode, then rejects a second unlock', async () => {
    const app = createApp(testEnv())
    const registered = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const cookie = cookieHeader(registered)

    const unlocked = await app.request('/api/wallet/unlock', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: '1', episodeNumber: 4 }),
    })
    expect(unlocked.status).toBe(200)
    const body = (await unlocked.json()) as {
      data: { balance: number; unlockedEpisodeKeys: string[] }
    }
    expect(body.data.balance).toBe(STUB_SEED_BALANCE - 5)
    expect(body.data.unlockedEpisodeKeys).toContain('1:4')

    const again = await app.request('/api/wallet/unlock', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: '1', episodeNumber: 4 }),
    })
    expect(again.status).toBe(400)
    expect(await again.json()).toEqual({ error: { code: 'ALREADY_UNLOCKED' } })
  })

  it('does not debit wait-for-free episodes', async () => {
    const app = createApp(testEnv())
    const registered = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const cookie = cookieHeader(registered)
    const res = await app.request('/api/wallet/unlock', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: '2', episodeNumber: 3 }),
    })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: { code: 'NOT_LOCKED' } })

    const me = await app.request('/api/wallet/me', {
      headers: { Cookie: cookie },
    })
    const body = (await me.json()) as { data: { balance: number; unlockedEpisodeKeys: string[] } }
    expect(body.data.balance).toBe(STUB_SEED_BALANCE)
    expect(body.data.unlockedEpisodeKeys).toEqual([])
  })

  it('rejects unlock when the balance is too low', async () => {
    const app = createApp(testEnv())
    const registered = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const cookie = cookieHeader(registered)
    const registeredBody = (await registered.json()) as { data: { id: string } }
    persist.setWalletBalance(registeredBody.data.id, 0)

    const res = await app.request('/api/wallet/unlock', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookie },
      body: JSON.stringify({ webtoonId: '1', episodeNumber: 4 }),
    })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: { code: 'INSUFFICIENT_COINS' } })
  })

  it('ignores a client coinPrice of 0', async () => {
    const app = createApp(testEnv())
    const registered = await app.request('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(registerBody),
    })
    const res = await app.request('/api/wallet/unlock', {
      method: 'POST',
      headers: { ...jsonHeaders, Cookie: cookieHeader(registered) },
      body: JSON.stringify({ webtoonId: '1', episodeNumber: 4, coinPrice: 0 }),
    })
    expect(res.status).toBe(200)
    const body = (await res.json()) as { data: { balance: number } }
    expect(body.data.balance).toBe(STUB_SEED_BALANCE - 5)
  })
})
