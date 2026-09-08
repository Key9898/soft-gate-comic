import { afterEach, describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { healthPayload } from '../health.js'
import { testEnv } from './helpers.js'

describe('GET /health', () => {
  it('returns the stub persist envelope', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/health')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual(healthPayload())
    expect(healthPayload()).toEqual({ data: { ok: true, persist: 'stub' } })
    expect(res.headers.get('Set-Cookie')).toBeNull()
  })

  it('stays stub persist when DATABASE_URL is set on createApp', async () => {
    const app = createApp(
      testEnv({ DATABASE_URL: 'postgresql://unused:unused@127.0.0.1:5432/unused' })
    )
    const res = await app.request('/health')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ data: { ok: true, persist: 'stub' } })
  })
})
