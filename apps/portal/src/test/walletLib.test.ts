import { beforeEach, describe, expect, it } from 'vitest'
import {
  DEFAULT_SEED_BALANCE,
  demoTopUp,
  ensureWallet,
  getWallet,
  isEpisodeUnlocked,
  listTransactions,
  unlockEpisode,
} from '../lib/wallet'

describe('wallet operations', () => {
  const store = new Map<string, string>()

  beforeEach(() => {
    store.clear()
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
          store.set(key, value)
        },
        removeItem: (key: string) => {
          store.delete(key)
        },
        clear: () => store.clear(),
        length: 0,
        key: () => null,
      },
    })
  })

  it('seeds default balance on first access', () => {
    expect(ensureWallet('u1').balance).toBe(DEFAULT_SEED_BALANCE)
    expect(getWallet('u1').seeded).toBe(true)
  })

  it('demo top-up increments balance and appends txn', () => {
    demoTopUp('u1', 100, 'Demo pack')
    expect(getWallet('u1').balance).toBe(DEFAULT_SEED_BALANCE + 100)
    expect(listTransactions('u1')[0].type).toBe('demo_topup')
  })

  it('unlocks episode and debits coins', () => {
    const result = unlockEpisode('u1', 'w1', 2, 40, 'Unlock ep 2')
    expect(result.ok).toBe(true)
    expect(isEpisodeUnlocked('u1', 'w1', 2)).toBe(true)
    expect(getWallet('u1').balance).toBe(DEFAULT_SEED_BALANCE - 40)
  })

  it('returns insufficient when balance too low', () => {
    const result = unlockEpisode('u1', 'w1', 9, 9999, 'too much')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe('INSUFFICIENT_COINS')
  })
})
