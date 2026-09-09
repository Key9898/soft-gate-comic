import { createHash, timingSafeEqual } from 'node:crypto'
import type { Context, Next } from 'hono'
import type { Env } from '../env.js'

export const ADMIN_SERVICE_TOKEN_HEADER = 'ADMIN_SERVICE_TOKEN'

function digest(value: string) {
  return createHash('sha256').update(value).digest()
}

export function isValidServiceToken(env: Env, header: string | undefined): boolean {
  const expected = env.ADMIN_SERVICE_TOKEN
  if (!expected || !header) return false
  const a = digest(expected)
  const b = digest(header)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function requireServiceToken(env: Env) {
  return async (c: Context, next: Next) => {
    if (!isValidServiceToken(env, c.req.header(ADMIN_SERVICE_TOKEN_HEADER))) {
      return c.json({ error: { code: 'NOT_AUTHENTICATED' } }, 401)
    }
    await next()
  }
}
