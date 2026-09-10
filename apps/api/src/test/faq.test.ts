import { unwrapApiData } from '@softgate/contracts'
import { describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { persist } from '../persist.js'
import { STUB_FAQ } from '../faq/fromAdmin.js'
import { testEnv } from './helpers.js'

describe('GET /api/faq', () => {
  it('returns the portal FAQ envelope from the stub', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/api/faq')
    expect(res.status).toBe(200)
    expect(res.headers.get('Set-Cookie')).toBeNull()

    const body: unknown = await res.json()
    const faq = unwrapApiData<Awaited<ReturnType<typeof persist.getFaq>>>(body)
    expect(faq).not.toBeNull()
    expect(faq?.items).toHaveLength(STUB_FAQ.items.length)
    expect(faq?.items.some((row) => row.id === 'q1')).toBe(true)
    expect(faq?.items.every((row) => !('published' in row))).toBe(true)
    expect(faq?.items.find((row) => row.id === 'q4')?.relatedTo).toBe('/profile')
  })
})
