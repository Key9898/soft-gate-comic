import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { sessionCookieOptions } from '../cookies.js'
import type { Env } from '../env.js'
import { persist } from '../persist.js'
import { ACCESS_COOKIE, ACCESS_MAX_AGE, REFRESH_COOKIE, REFRESH_MAX_AGE } from './types.js'
import { signAccessToken, signRefreshToken } from './tokens.js'

export function readAccessCookie(c: Context) {
  return getCookie(c, ACCESS_COOKIE)
}

export function readRefreshCookie(c: Context) {
  return getCookie(c, REFRESH_COOKIE)
}

export async function issueSessionCookies(c: Context, env: Env, userId: string) {
  const access = await signAccessToken(env, userId)
  const refresh = await signRefreshToken(env, userId)
  await persist.saveRefreshJti(refresh.jti, userId)
  await persist.touchLastLogin(userId)

  const base = sessionCookieOptions(env)
  setCookie(c, ACCESS_COOKIE, access, { ...base, maxAge: ACCESS_MAX_AGE })
  setCookie(c, REFRESH_COOKIE, refresh.token, { ...base, maxAge: REFRESH_MAX_AGE })
}

export function clearSessionCookies(c: Context, env: Env) {
  const base = sessionCookieOptions(env)
  deleteCookie(c, ACCESS_COOKIE, base)
  deleteCookie(c, REFRESH_COOKIE, base)
}
