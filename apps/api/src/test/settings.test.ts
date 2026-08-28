import { unwrapApiData } from '@softgate/contracts'
import { describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { persist } from '../persist.js'
import { testEnv } from './helpers.js'

describe('GET /api/settings', () => {
  it('returns the portal settings envelope from the stub', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/api/settings')
    expect(res.status).toBe(200)
    expect(res.headers.get('Set-Cookie')).toBeNull()

    const body: unknown = await res.json()
    const settings = unwrapApiData<ReturnType<typeof persist.getPortalSettings>>(body)
    expect(settings).not.toBeNull()
    expect(settings?.maintenanceMode).toBe(false)
    expect(settings?.allowRegistration).toBe(true)
    expect(settings?.contactEmail).toBe('admin@softgatecomic.com')
    expect(settings?.defaultLanguage).toBe('en')
  })
})
