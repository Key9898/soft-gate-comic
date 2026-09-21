import { describe, expect, it, beforeEach } from 'vitest'
import {
  EPISODE_REACTIONS_KEY,
  REACTIONS,
  reactionCount,
  readReaction,
  toggleReaction,
} from '../lib/reader'

const store = new Map<string, string>()

function installStorage() {
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
}

describe('episode reactions', () => {
  beforeEach(() => {
    installStorage()
  })

  it('starts with no pick and stores one per episode', () => {
    expect(readReaction('1', 1)).toBeUndefined()
    expect(toggleReaction('1', 1, '🔥')).toBe('🔥')
    expect(readReaction('1', 1)).toBe('🔥')
    expect(readReaction('1', 2)).toBeUndefined()
  })

  it('replaces the pick rather than accumulating', () => {
    toggleReaction('1', 1, '🔥')
    expect(toggleReaction('1', 1, '😭')).toBe('😭')
    expect(readReaction('1', 1)).toBe('😭')
  })

  it('clears the pick when the same reaction is chosen again', () => {
    toggleReaction('1', 1, '🔥')
    expect(toggleReaction('1', 1, '🔥')).toBeUndefined()
    expect(readReaction('1', 1)).toBeUndefined()
  })

  it('persists with the schema version', () => {
    toggleReaction('1', 1, '😂')
    const raw = JSON.parse(store.get(EPISODE_REACTIONS_KEY) ?? '{}') as {
      schemaVersion: number
      picks: Record<string, string>
    }
    expect(raw.schemaVersion).toBe(1)
    expect(raw.picks).toEqual({ '1:1': '😂' })
  })

  it('reads a corrupt payload as no picks', () => {
    store.set(EPISODE_REACTIONS_KEY, 'not json')
    expect(readReaction('1', 1)).toBeUndefined()
    store.set(EPISODE_REACTIONS_KEY, JSON.stringify({ schemaVersion: 99, picks: { '1:1': '🔥' } }))
    expect(readReaction('1', 1)).toBeUndefined()
  })

  it('gives every reaction a stable Demo count inside the published range', () => {
    for (const reaction of REACTIONS) {
      const first = reactionCount('1', 1, reaction, false)
      expect(first).toBe(reactionCount('1', 1, reaction, false))
      expect(first).toBeGreaterThanOrEqual(12)
      expect(first).toBeLessThanOrEqual(480)
    }
  })

  it('adds the reader own pick to the count', () => {
    const base = reactionCount('1', 1, '🔥', false)
    expect(reactionCount('1', 1, '🔥', true)).toBe(base + 1)
  })
})
