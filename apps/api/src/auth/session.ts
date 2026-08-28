import type { Context } from 'hono'
import type { Env } from '../env.js'
import { persist } from '../persist.js'
import { readAccessCookie } from './cookies.js'
import { verifyAccessToken } from './tokens.js'

export async function optionalReaderUserId(c: Context, env: Env): Promise<string | undefined> {
  const token = readAccessCookie(c)
  if (!token) return undefined
  try {
    const userId = await verifyAccessToken(env, token)
    if (!persist.findUserById(userId)) return undefined
    return userId
  } catch {
    return undefined
  }
}
