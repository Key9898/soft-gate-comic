import { unwrapApiData } from '@softgate/contracts'
import { describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { persist } from '../persist.js'
import { testEnv } from './helpers.js'

describe('GET /api/legal', () => {
  it('returns the portal privacy envelope from the stub', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/api/legal/privacy')
    expect(res.status).toBe(200)
    expect(res.headers.get('Set-Cookie')).toBeNull()

    const body: unknown = await res.json()
    const privacy = unwrapApiData<Awaited<ReturnType<typeof persist.getPrivacy>>>(body)
    expect(privacy).not.toBeNull()
    expect(privacy?.glance[0]?.en).toMatch(/does not send your data to any server/)
    expect(privacy?.effectiveDate).toBe('2026-09-10')
    expect(privacy?.sections.some((row) => row.slug === 'rights')).toBe(true)
    expect(privacy?.sections.every((row) => !('published' in row))).toBe(true)
  })

  it('returns the portal terms envelope from the stub', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/api/legal/terms')
    expect(res.status).toBe(200)
    expect(res.headers.get('Set-Cookie')).toBeNull()

    const body: unknown = await res.json()
    const terms = unwrapApiData<Awaited<ReturnType<typeof persist.getTerms>>>(body)
    expect(terms).not.toBeNull()
    expect(terms?.sections.some((row) => row.slug === 'coins')).toBe(true)
    expect(terms?.glance[2]?.en).toMatch(/no real-world value/)
    expect(terms?.sections.every((row) => !('published' in row))).toBe(true)
  })
})
