import { afterEach, describe, expect, it } from 'vitest'
import { openPersist, persist, resetPersistToStub } from '../persist.js'
import { testEnv } from './helpers.js'

describe('openPersist', () => {
  afterEach(() => {
    resetPersistToStub()
  })

  it('uses stub persist when DATABASE_URL is unset', async () => {
    const port = await openPersist(testEnv())
    expect(port.kind).toBe('stub')
    expect(persist.kind).toBe('stub')
  })

  it('throws when DATABASE_URL is set and Postgres does not accept the connection', async () => {
    await expect(
      openPersist(testEnv({ DATABASE_URL: 'postgresql://unused:unused@127.0.0.1:5432/unused' }))
    ).rejects.toThrow()
    expect(persist.kind).toBe('stub')
  }, 15_000)
})
