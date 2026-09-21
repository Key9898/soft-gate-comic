import type { Env } from './env.js'

/**
 * Loopback only, and only the host — `http://localhost.evil.example:5173` must not
 * match. The port is whatever Vite managed to bind.
 */
const LOOPBACK_ORIGIN = /^http:\/\/(?:localhost|127\.0\.0\.1|\[::1\]):\d{1,5}$/

export function corsAllowlist(env: Env): string[] {
  return [env.CLIENT_URL, env.ADMIN_URL].filter((value): value is string => Boolean(value))
}

export function corsOrigin(env: Env, origin: string): string | undefined {
  if (!origin) return undefined
  if (corsAllowlist(env).includes(origin)) return origin

  // Vite takes whichever port is free and apps/api/.env is gitignored, so a stale
  // CLIENT_URL otherwise fails every request with an opaque CORS error that points
  // nowhere near the cause (issue #44). Development trusts any loopback origin;
  // production and test stay on the declared allowlist.
  if (env.NODE_ENV === 'development' && LOOPBACK_ORIGIN.test(origin)) return origin

  return undefined
}
