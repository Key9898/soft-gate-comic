import { describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { corsAllowlist } from '../cors.js'
import { testEnv } from './helpers.js'

describe('CORS allowlist', () => {
  it('allows CLIENT_URL and optional ADMIN_URL', () => {
    const env = testEnv({ ADMIN_URL: 'http://localhost:4173' })
    expect(corsAllowlist(env)).toEqual(['http://localhost:5173', 'http://localhost:4173'])
  })

  it('echoes an allowed Origin', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/health', {
      headers: { Origin: 'http://localhost:5173' },
    })
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:5173')
    expect(res.headers.get('Access-Control-Allow-Credentials')).toBe('true')
  })

  it('does not echo a foreign Origin', async () => {
    const app = createApp(testEnv())
    const res = await app.request('/health', {
      headers: { Origin: 'https://evil.example' },
    })
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull()
  })
})
