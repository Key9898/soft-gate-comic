import { describe, expect, it } from 'vitest'
import { sessionCookieOptions } from '../cookies.js'
import { testEnv } from './helpers.js'

describe('sessionCookieOptions', () => {
  it('uses lax insecure cookies in development', () => {
    expect(sessionCookieOptions(testEnv({ NODE_ENV: 'development' }))).toEqual({
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      path: '/',
    })
  })

  it('uses none plus secure cookies in production', () => {
    expect(
      sessionCookieOptions(
        testEnv({
          NODE_ENV: 'production',
          CLIENT_URL: 'https://softgate.example',
          JWT_SECRET: 'production-secret-not-stub-xx',
        })
      )
    ).toEqual({
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/',
    })
  })
})
