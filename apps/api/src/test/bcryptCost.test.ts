import { afterEach, describe, expect, it, vi } from 'vitest'
import { BCRYPT_COST, PRODUCTION_BCRYPT_COST } from '../auth/types.js'
import { hashPassword, verifyPassword } from '../auth/password.js'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

async function costUnder(nodeEnv: string): Promise<number> {
  vi.stubEnv('NODE_ENV', nodeEnv)
  vi.resetModules()
  const mod = await import('../auth/types.js')
  return mod.BCRYPT_COST
}

describe('BCRYPT_COST', () => {
  it('stays at the production cost outside tests', async () => {
    expect(PRODUCTION_BCRYPT_COST).toBe(12)
    expect(await costUnder('production')).toBe(PRODUCTION_BCRYPT_COST)
    expect(await costUnder('development')).toBe(PRODUCTION_BCRYPT_COST)
  })

  it('drops only under NODE_ENV=test', async () => {
    expect(BCRYPT_COST).toBeLessThan(PRODUCTION_BCRYPT_COST)
    // bcrypt rejects a cost below 4, and anything higher reintroduces the
    // per-call cost this exists to remove.
    expect(BCRYPT_COST).toBeGreaterThanOrEqual(4)
  })
})

describe('password hashing', () => {
  it('round-trips a password at the active cost', async () => {
    const hash = await hashPassword('password1')
    expect(hash.startsWith('$2')).toBe(true)
    expect(await verifyPassword('password1', hash)).toBe(true)
    expect(await verifyPassword('password2', hash)).toBe(false)
  })

  it('still verifies a hash produced at the production cost', async () => {
    // bcrypt stores the cost in the hash, so lowering the test cost must not
    // invalidate anything already written by a cost-12 deployment.
    const productionHash = '$2b$12$ezIikI5WFNCyNm6aZl09kO0c29waoS.784ZpZg54wlMa7QvajIAdC'
    expect(productionHash.split('$')[2]).toBe('12')
    expect(await verifyPassword('password1', productionHash)).toBe(true)
  })

  it('hashes fast enough that a chained auth test cannot hit the 5s timeout', async () => {
    const started = Date.now()
    await hashPassword('password1')
    // The flake in #24 came from ~220ms hashes chained several deep under CPU
    // contention. A ceiling well under that leaves real headroom.
    expect(Date.now() - started).toBeLessThan(50)
  })
})
