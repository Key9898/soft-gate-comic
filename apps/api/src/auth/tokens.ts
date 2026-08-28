import { randomUUID } from 'node:crypto'
import { SignJWT, jwtVerify } from 'jose'
import type { Env } from '../env.js'
import { ACCESS_MAX_AGE, REFRESH_MAX_AGE } from './types.js'

const ACCESS_TYP = 'access'
const REFRESH_TYP = 'refresh'

function secretKey(env: Env) {
  return new TextEncoder().encode(env.JWT_SECRET)
}

export async function signAccessToken(env: Env, userId: string) {
  return new SignJWT({ typ: ACCESS_TYP })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_MAX_AGE}s`)
    .sign(secretKey(env))
}

export async function signRefreshToken(env: Env, userId: string) {
  const jti = randomUUID()
  const token = await new SignJWT({ typ: REFRESH_TYP })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_MAX_AGE}s`)
    .sign(secretKey(env))
  return { token, jti }
}

export async function verifyAccessToken(env: Env, token: string) {
  const { payload } = await jwtVerify(token, secretKey(env))
  if (payload.typ !== ACCESS_TYP || typeof payload.sub !== 'string') {
    throw new Error('INVALID_TOKEN')
  }
  return payload.sub
}

export async function verifyRefreshToken(env: Env, token: string) {
  const { payload } = await jwtVerify(token, secretKey(env))
  if (
    payload.typ !== REFRESH_TYP ||
    typeof payload.sub !== 'string' ||
    typeof payload.jti !== 'string'
  ) {
    throw new Error('INVALID_TOKEN')
  }
  return { userId: payload.sub, jti: payload.jti }
}
