import { describe, expect, it } from 'vitest'
import { createApp } from '../app.js'
import { corsAllowlist, corsOrigin } from '../cors.js'
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

/**
 * Issue #44. Vite takes whichever port is free, and apps/api/.env is gitignored, so
 * a CLIENT_URL that no longer matches silently fails every request with an opaque
 * CORS error. Development trusts any loopback origin; production does not.
 */
describe('CORS in development', () => {
  const devEnv = (overrides: Partial<NodeJS.ProcessEnv> = {}) =>
    testEnv({ NODE_ENV: 'development', ...overrides })

  it('echoes a loopback Origin on a port CLIENT_URL does not name', () => {
    const env = devEnv()
    expect(corsOrigin(env, 'http://localhost:5177')).toBe('http://localhost:5177')
    expect(corsOrigin(env, 'http://127.0.0.1:4173')).toBe('http://127.0.0.1:4173')
  })

  it('still refuses a non-loopback Origin', () => {
    expect(corsOrigin(devEnv(), 'https://evil.example')).toBeUndefined()
    expect(corsOrigin(devEnv(), 'http://localhost.evil.example:5173')).toBeUndefined()
  })

  it('does not widen the allowlist outside development', () => {
    const prod = testEnv({
      NODE_ENV: 'production',
      CLIENT_URL: 'https://softgatecomic.com',
      JWT_SECRET: 'a-production-secret-value',
    })
    expect(corsOrigin(prod, 'http://localhost:5177')).toBeUndefined()
    expect(corsOrigin(prod, 'https://softgatecomic.com')).toBe('https://softgatecomic.com')
  })

  it('leaves the declared allowlist itself unchanged', () => {
    expect(corsAllowlist(devEnv())).toEqual(['http://localhost:5173'])
  })
})
