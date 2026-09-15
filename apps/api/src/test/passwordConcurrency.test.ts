import { describe, expect, it } from 'vitest'
import { PRODUCTION_BCRYPT_COST } from '../auth/types.js'
import { hashAtCost, verifyPassword } from '../auth/password.js'

/**
 * Measures how long the event loop is starved while hashes run. A pure-JS
 * implementation does the work on the main thread, so every other request in
 * the process waits behind it; a threadpool-backed one does not.
 *
 * Deliberately run at PRODUCTION_BCRYPT_COST, not the cheap test cost — the
 * point is the cost real users pay.
 */
async function maxEventLoopLag(work: () => Promise<unknown>): Promise<number> {
  const tick = 10
  let maxLag = 0
  let last = Date.now()
  const timer = setInterval(() => {
    const now = Date.now()
    maxLag = Math.max(maxLag, now - last - tick)
    last = now
  }, tick)
  try {
    await work()
  } finally {
    clearInterval(timer)
  }
  return maxLag
}

const CONCURRENT = 8

describe('password hashing concurrency', () => {
  it('does not starve the event loop while hashing at the production cost', async () => {
    const lag = await maxEventLoopLag(() =>
      Promise.all(
        Array.from({ length: CONCURRENT }, () => hashAtCost('password1', PRODUCTION_BCRYPT_COST))
      )
    )

    // bcryptjs measured ~1000ms of lag for ten concurrent cost-12 hashes
    // (#25). Anything off the main thread stays in the low tens.
    expect(lag).toBeLessThan(150)
  }, 30_000)

  it('runs concurrent hashes in parallel rather than one after another', async () => {
    const started = Date.now()
    await hashAtCost('password1', PRODUCTION_BCRYPT_COST)
    const single = Date.now() - started

    const batchStarted = Date.now()
    await Promise.all(
      Array.from({ length: CONCURRENT }, () => hashAtCost('password1', PRODUCTION_BCRYPT_COST))
    )
    const batch = Date.now() - batchStarted

    // Serial work would cost about CONCURRENT x single. Real parallelism keeps
    // the batch well under that even on a small threadpool.
    expect(batch).toBeLessThan(single * CONCURRENT * 0.7)
  }, 30_000)

  it('verifies a hash produced by the previous bcryptjs deployment', async () => {
    // Written by bcryptjs at cost 12. Native bcrypt must accept it unchanged,
    // or the swap would lock every existing reader out of their account.
    const legacy = '$2b$12$ezIikI5WFNCyNm6aZl09kO0c29waoS.784ZpZg54wlMa7QvajIAdC'
    expect(await verifyPassword('password1', legacy)).toBe(true)
    expect(await verifyPassword('wrong', legacy)).toBe(false)
  })
})
