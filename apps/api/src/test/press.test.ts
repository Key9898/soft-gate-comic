import { unwrapApiData } from '@softgate/contracts'
import { describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { persist } from '../persist.js'
import { testEnv } from './helpers.js'

describe('GET /api/press', () => {
  it('returns the portal press envelope from the stub', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/api/press')
    expect(res.status).toBe(200)
    expect(res.headers.get('Set-Cookie')).toBeNull()

    const body: unknown = await res.json()
    const press = unwrapApiData<Awaited<ReturnType<typeof persist.getPress>>>(body)
    expect(press).not.toBeNull()
    expect(press?.zipUrl).toBe('/press-kit/softgate-comic-press-kit.zip')
    expect(press?.contactEmail).toBe('press@softgatecomic.com')
    expect(press?.news).toEqual([])
    expect(press?.stills).toEqual([])
    expect(press?.copy.boilerplateTitle.en).toBe('About SoftGate Comic')
    expect(press?.news.every((row) => !('published' in row))).toBe(true)
  })
})
