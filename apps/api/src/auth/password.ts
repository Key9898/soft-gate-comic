// Native bcrypt, not bcryptjs. Same algorithm and the same `$2b$` hash format,
// so existing stored hashes verify unchanged — but the work runs on libuv's
// threadpool instead of the main thread. See #25: pure-JS hashing at cost 12
// starved the event loop by ~1s under a burst of ten concurrent logins, which
// delayed every unrelated request in the process.
import { compare, hash } from 'bcrypt'
import { BCRYPT_COST } from './types.js'

export function hashPassword(password: string) {
  return hash(password, BCRYPT_COST)
}

/** Explicit cost, for benchmarks and tests that must exercise the real cost. */
export function hashAtCost(password: string, cost: number) {
  return hash(password, cost)
}

export function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash)
}
