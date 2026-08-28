import { compare, hash } from 'bcryptjs'
import { BCRYPT_COST } from './types.js'

export function hashPassword(password: string) {
  return hash(password, BCRYPT_COST)
}

export function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash)
}
