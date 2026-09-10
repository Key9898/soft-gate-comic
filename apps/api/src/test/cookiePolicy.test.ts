import { unwrapApiData } from '@softgate/contracts'
import { describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { persist } from '../persist.js'
import { COOKIE_COPY_KEYS, STUB_COOKIES } from '../cookiePolicy/fromAdmin.js'
import { testEnv } from './helpers.js'

describe('GET /api/cookies', () => {
  it('returns the portal Cookie Policy envelope from the stub', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/api/cookies')
    expect(res.status).toBe(200)
    expect(res.headers.get('Set-Cookie')).toBeNull()

    const body: unknown = await res.json()
    const cookies = unwrapApiData<Awaited<ReturnType<typeof persist.getCookies>>>(body)
    expect(cookies).not.toBeNull()
    expect(cookies?.effectiveDate).toBe(STUB_COOKIES.effectiveDate)
    expect(Object.keys(cookies?.copy ?? {})).toEqual([...COOKIE_COPY_KEYS])
    expect(cookies?.glance).toHaveLength(5)
    expect(cookies?.rows).toHaveLength(STUB_COOKIES.rows.length)
    expect(cookies?.rows.some((row) => row.storageKey === 'softgate_age_confirm_v1')).toBe(true)
    expect(cookies?.copy.analyticsCookiesDesc.en).toMatch(/None/)
  })
})
