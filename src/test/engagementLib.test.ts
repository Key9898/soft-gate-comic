import { beforeEach, describe, expect, it } from 'vitest'
import {
  STORAGE_KEY,
  ENGAGEMENT_SCHEMA_VERSION,
  isLiked,
  listHistory,
  listLikedWebtoonIds,
  recordHistory,
  updateReadingProgress,
  removeHistory,
  removeLikes,
  toggleLike,
  readStore,
} from '../lib/engagement'

describe('engagement storage', () => {
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

  it('records history per webtoon with latest episode', () => {
    recordHistory('u1', 'wt-1', 1)
    recordHistory('u1', 'wt-1', 3)
    recordHistory('u1', 'wt-2', 2)
    const history = listHistory('u1')
    expect(history).toHaveLength(2)
    expect(history.find((h) => h.webtoonId === 'wt-1')?.episodeNumber).toBe(3)
    expect(history.find((h) => h.webtoonId === 'wt-1')?.scrollRatio).toBe(0)
  })

  it('tracks only episodes actually opened (no 1..N assumption)', () => {
    recordHistory('u1', 'wt-1', 3)
    expect(listHistory('u1')[0]?.readEpisodeNumbers).toEqual([3])
  })

  it('accumulates read episodes across sessions', () => {
    recordHistory('u1', 'wt-1', 1)
    recordHistory('u1', 'wt-1', 3)
    expect(listHistory('u1')[0]?.readEpisodeNumbers).toEqual([1, 3])
    updateReadingProgress('u1', 'wt-1', 5, 0.2)
    expect(listHistory('u1')[0]?.readEpisodeNumbers).toEqual([1, 3, 5])
  })

  it('falls back to last-read episode for legacy records without readEpisodeNumbers', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: ENGAGEMENT_SCHEMA_VERSION,
        byUserId: {
          u1: {
            history: [
              {
                webtoonId: 'wt-1',
                episodeNumber: 4,
                lastReadAt: '2026-08-01T00:00:00.000Z',
                scrollRatio: 0.5,
              },
            ],
            likedWebtoonIds: [],
          },
        },
      })
    )
    expect(listHistory('u1')[0]?.readEpisodeNumbers).toEqual([4])
  })

  it('preserves scrollRatio when re-recording the same episode', () => {
    recordHistory('u1', 'wt-1', 2)
    updateReadingProgress('u1', 'wt-1', 2, 0.4)
    recordHistory('u1', 'wt-1', 2)
    expect(listHistory('u1')[0]?.scrollRatio).toBe(0.4)
  })

  it('resets scrollRatio when moving to a different episode', () => {
    recordHistory('u1', 'wt-1', 1)
    updateReadingProgress('u1', 'wt-1', 1, 0.7)
    recordHistory('u1', 'wt-1', 2)
    expect(listHistory('u1')[0]?.scrollRatio).toBe(0)
    expect(listHistory('u1')[0]?.episodeNumber).toBe(2)
  })

  it('updates reading progress scrollRatio', () => {
    recordHistory('u1', 'wt-1', 1)
    updateReadingProgress('u1', 'wt-1', 1, 1.5)
    expect(listHistory('u1')[0]?.scrollRatio).toBe(1)
    updateReadingProgress('u1', 'wt-1', 1, -0.2)
    expect(listHistory('u1')[0]?.scrollRatio).toBe(0)
  })

  it('migrates schema v1 records to v2 with scrollRatio 0', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        byUserId: {
          u1: {
            history: [
              {
                webtoonId: 'wt-1',
                episodeNumber: 2,
                lastReadAt: '2026-08-01T00:00:00.000Z',
              },
            ],
            likedWebtoonIds: [],
          },
        },
      })
    )
    const history = listHistory('u1')
    expect(history[0]?.scrollRatio).toBe(0)
    expect(readStore().schemaVersion).toBe(ENGAGEMENT_SCHEMA_VERSION)
  })

  it('toggles likes and removes selections', () => {
    expect(isLiked('u1', 'a')).toBe(false)
    toggleLike('u1', 'a')
    toggleLike('u1', 'b')
    expect(listLikedWebtoonIds('u1')).toEqual(['b', 'a'])
    toggleLike('u1', 'a')
    expect(isLiked('u1', 'a')).toBe(false)
    removeLikes('u1', ['b'])
    expect(listLikedWebtoonIds('u1')).toEqual([])
  })

  it('removes history entries', () => {
    recordHistory('u1', 'a', 1)
    recordHistory('u1', 'b', 2)
    removeHistory('u1', ['a'])
    expect(listHistory('u1').map((h) => h.webtoonId)).toEqual(['b'])
  })

  it('ignores corrupt engagement payloads', () => {
    window.localStorage.setItem(STORAGE_KEY, '{bad')
    expect(readStore().byUserId).toEqual({})
  })
})
