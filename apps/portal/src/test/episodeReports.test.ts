import { describe, expect, it, beforeEach } from 'vitest'
import { EPISODE_REPORTS_KEY, addEpisodeReport, hasEpisodeReport } from '../lib/reader'

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

describe('episode reports', () => {
  beforeEach(() => {
    installStorage()
  })

  it('starts unreported and persists a device flag', () => {
    expect(hasEpisodeReport('1', 1)).toBe(false)
    addEpisodeReport('1', 1)
    expect(hasEpisodeReport('1', 1)).toBe(true)
    expect(hasEpisodeReport('1', 2)).toBe(false)
    const raw = JSON.parse(store.get(EPISODE_REPORTS_KEY) ?? '{}') as { keys: string[] }
    expect(raw.keys).toEqual(['1:1'])
  })

  it('does not duplicate the same episode key', () => {
    addEpisodeReport('1', 1)
    addEpisodeReport('1', 1)
    const raw = JSON.parse(store.get(EPISODE_REPORTS_KEY) ?? '{}') as { keys: string[] }
    expect(raw.keys).toEqual(['1:1'])
  })
})
