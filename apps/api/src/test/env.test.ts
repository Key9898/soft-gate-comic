import { describe, expect, it } from 'vitest'
import {
  DEV_JWT_STUB,
  isDatabaseConfigured,
  isMailConfigured,
  isR2Configured,
  parseEnv,
} from '../env.js'

const base = {
  NODE_ENV: 'test',
  CLIENT_URL: 'http://localhost:5173',
  JWT_SECRET: DEV_JWT_STUB,
} as const

describe('parseEnv', () => {
  it('accepts the development JWT stub outside production', () => {
    const env = parseEnv({
      NODE_ENV: 'development',
      CLIENT_URL: 'http://localhost:5173',
      JWT_SECRET: DEV_JWT_STUB,
    })
    expect(env.PORT).toBe(3000)
    expect(env.CLIENT_URL).toBe('http://localhost:5173')
    expect(env.ADMIN_URL).toBeUndefined()
    expect(env.JWT_SECRET).toBe(DEV_JWT_STUB)
    expect(env.DATABASE_URL).toBeUndefined()
    expect(isDatabaseConfigured(env)).toBe(false)
    expect(isR2Configured(env)).toBe(false)
    expect(isMailConfigured(env)).toBe(false)
  })

  it('treats empty ADMIN_URL as unset', () => {
    const env = parseEnv({
      NODE_ENV: 'test',
      CLIENT_URL: 'http://localhost:5173',
      ADMIN_URL: '',
      JWT_SECRET: DEV_JWT_STUB,
    })
    expect(env.ADMIN_URL).toBeUndefined()
  })

  it('includes ADMIN_URL when it is a valid origin', () => {
    const env = parseEnv({
      NODE_ENV: 'test',
      CLIENT_URL: 'http://localhost:5173',
      ADMIN_URL: 'http://localhost:4173',
      JWT_SECRET: DEV_JWT_STUB,
    })
    expect(env.ADMIN_URL).toBe('http://localhost:4173')
  })

  it('generates a JWT secret in development when unset', () => {
    const env = parseEnv({
      NODE_ENV: 'development',
      CLIENT_URL: 'http://localhost:5173',
    })
    expect(env.JWT_SECRET.length).toBeGreaterThanOrEqual(16)
    expect(env.JWT_SECRET).not.toBe(DEV_JWT_STUB)
  })

  it('rejects the development JWT stub in production', () => {
    expect(() =>
      parseEnv({
        NODE_ENV: 'production',
        CLIENT_URL: 'https://softgate.example',
        JWT_SECRET: DEV_JWT_STUB,
      })
    ).toThrow(/stub is not allowed in production/)
  })

  it('treats empty integration slots as unset', () => {
    const env = parseEnv({
      ...base,
      DATABASE_URL: '  ',
      R2_ACCOUNT_ID: '',
      R2_PUBLIC_BASE_URL: '',
      BREVO_API_KEY: '',
      BREVO_FROM_EMAIL: '',
    })
    expect(env.DATABASE_URL).toBeUndefined()
    expect(env.R2_ACCOUNT_ID).toBeUndefined()
    expect(env.R2_PUBLIC_BASE_URL).toBeUndefined()
    expect(env.BREVO_API_KEY).toBeUndefined()
    expect(env.BREVO_FROM_EMAIL).toBeUndefined()
    expect(isDatabaseConfigured(env)).toBe(false)
    expect(isR2Configured(env)).toBe(false)
    expect(isMailConfigured(env)).toBe(false)
  })

  it('parses postgresql and postgres DATABASE_URL without treating them as http URLs', () => {
    const postgresql = parseEnv({
      ...base,
      DATABASE_URL: 'postgresql://unused:unused@127.0.0.1:5432/unused',
    })
    expect(postgresql.DATABASE_URL).toBe('postgresql://unused:unused@127.0.0.1:5432/unused')
    expect(isDatabaseConfigured(postgresql)).toBe(true)

    const postgres = parseEnv({
      ...base,
      DATABASE_URL: 'postgres://unused:unused@127.0.0.1:5432/unused',
    })
    expect(postgres.DATABASE_URL).toBe('postgres://unused:unused@127.0.0.1:5432/unused')
    expect(isDatabaseConfigured(postgres)).toBe(true)
  })

  it('requires all R2 core slots before isR2Configured', () => {
    const partial = parseEnv({
      ...base,
      R2_ACCOUNT_ID: 'acct',
      R2_ACCESS_KEY_ID: 'key',
      R2_SECRET_ACCESS_KEY: 'secret',
    })
    expect(isR2Configured(partial)).toBe(false)

    const full = parseEnv({
      ...base,
      R2_ACCOUNT_ID: 'acct',
      R2_ACCESS_KEY_ID: 'key',
      R2_SECRET_ACCESS_KEY: 'secret',
      R2_BUCKET: 'covers',
    })
    expect(isR2Configured(full)).toBe(true)
    expect(full.R2_PUBLIC_BASE_URL).toBeUndefined()
  })

  it('requires Brevo key and from email before isMailConfigured', () => {
    const keyOnly = parseEnv({
      ...base,
      BREVO_API_KEY: 'xkeysib-demo',
    })
    expect(isMailConfigured(keyOnly)).toBe(false)

    const both = parseEnv({
      ...base,
      BREVO_API_KEY: 'xkeysib-demo',
      BREVO_FROM_EMAIL: 'noreply@softgate.example',
    })
    expect(isMailConfigured(both)).toBe(true)
    expect(both.BREVO_FROM_EMAIL).toBe('noreply@softgate.example')
  })
})
