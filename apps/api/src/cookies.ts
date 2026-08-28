import type { Env } from './env.js'

export function sessionCookieOptions(env: Env) {
  const production = env.NODE_ENV === 'production'
  return {
    httpOnly: true as const,
    secure: production,
    sameSite: production ? ('None' as const) : ('Lax' as const),
    path: '/' as const,
  }
}
