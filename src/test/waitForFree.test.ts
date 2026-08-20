import { describe, expect, it } from 'vitest'
import {
  formatWaitFreeAt,
  hasWaitSchedule,
  isEpisodeLocked,
  isWaitFreeNow,
  parseFreeAt,
} from '../lib/catalog'

const now = Date.parse('2026-08-19T12:00:00.000Z')

describe('wait-for-free', () => {
  it('parses freeAt and ignores invalid values', () => {
    expect(parseFreeAt('2026-08-07T05:00:00.000Z')).toBe(Date.parse('2026-08-07T05:00:00.000Z'))
    expect(parseFreeAt(undefined)).toBeNull()
    expect(parseFreeAt('not-a-date')).toBeNull()
  })

  it('unlocks after freeAt without coins and stays locked before', () => {
    const waiting = { isPremium: true, freeAt: '2026-08-26T05:00:00.000Z' }
    const ready = { isPremium: true, freeAt: '2026-08-07T05:00:00.000Z' }
    const coinsOnly = { isPremium: true }
    const free = { isPremium: false }

    expect(isWaitFreeNow(waiting, now)).toBe(false)
    expect(isWaitFreeNow(ready, now)).toBe(true)
    expect(isWaitFreeNow(coinsOnly, now)).toBe(false)
    expect(isWaitFreeNow(free, now)).toBe(false)

    expect(isEpisodeLocked(waiting, false, now)).toBe(true)
    expect(isEpisodeLocked(ready, false, now)).toBe(false)
    expect(isEpisodeLocked(coinsOnly, false, now)).toBe(true)
    expect(isEpisodeLocked(coinsOnly, true, now)).toBe(false)
    expect(isEpisodeLocked(waiting, true, now)).toBe(false)
  })

  it('does not treat wait-for-free as Daily or a 23:59 clock', () => {
    expect(hasWaitSchedule({ isPremium: true, freeAt: '2026-08-24T12:00:00.000Z' })).toBe(true)
    expect(formatWaitFreeAt('2026-08-24T12:00:00.000Z')).toBe('24 Aug 2026, 12:00 UTC')
    expect(formatWaitFreeAt('2026-08-24T12:00:00.000Z')).not.toMatch(/23:59/)
    expect(hasWaitSchedule({ isPremium: false, freeAt: '2026-08-24T12:00:00.000Z' })).toBe(false)
  })
})
