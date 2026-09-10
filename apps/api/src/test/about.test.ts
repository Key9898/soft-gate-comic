import { unwrapApiData } from '@softgate/contracts'
import { describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { persist } from '../persist.js'
import { testEnv } from './helpers.js'

describe('GET /api/about', () => {
  it('returns the portal about envelope from the stub', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/api/about')
    expect(res.status).toBe(200)
    expect(res.headers.get('Set-Cookie')).toBeNull()

    const body: unknown = await res.json()
    const about = unwrapApiData<Awaited<ReturnType<typeof persist.getAbout>>>(body)
    expect(about).not.toBeNull()
    expect(about?.histories).toHaveLength(4)
    expect(about?.members).toHaveLength(4)
    const production = about?.histories.find((row) => row.id === 'h4')
    expect(production?.year).toBe(2026)
    expect(production?.month).toBe(12)
    expect(about?.meta.standInVisible).toBe(true)
    expect(about?.histories.every((row) => !('published' in row))).toBe(true)
    expect(about?.members.every((row) => !('published' in row))).toBe(true)
  })
})
