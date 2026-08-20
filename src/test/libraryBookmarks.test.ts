import { beforeEach, describe, expect, it } from 'vitest'
import {
  STORAGE_KEY,
  isBookmarked,
  listBookmarks,
  readStore,
  removeBookmark,
  removeBookmarks,
  setLastNotifiedEpisodeNumber,
  setNotifyMuted,
  toggleBookmark,
  writeStore,
} from '../lib/library'

describe('library bookmarks storage', () => {
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

  it('toggles bookmark on and off for a user', () => {
    expect(isBookmarked('1', 'wt-1')).toBe(false)
    toggleBookmark('1', 'wt-1')
    expect(isBookmarked('1', 'wt-1')).toBe(true)
    expect(listBookmarks('1').map((b) => b.webtoonId)).toEqual(['wt-1'])
    toggleBookmark('1', 'wt-1')
    expect(isBookmarked('1', 'wt-1')).toBe(false)
    expect(listBookmarks('1')).toEqual([])
  })

  it('keeps a single entry after toggle cycles', () => {
    toggleBookmark('1', 'wt-1')
    toggleBookmark('1', 'wt-1')
    toggleBookmark('1', 'wt-1')
    expect(listBookmarks('1')).toHaveLength(1)
    expect(listBookmarks('1')[0].webtoonId).toBe('wt-1')
  })

  it('namespaces bookmarks per user id', () => {
    toggleBookmark('1', 'wt-1')
    toggleBookmark('2', 'wt-2')
    expect(listBookmarks('1').map((b) => b.webtoonId)).toEqual(['wt-1'])
    expect(listBookmarks('2').map((b) => b.webtoonId)).toEqual(['wt-2'])
  })

  it('removes one and many bookmarks', () => {
    toggleBookmark('1', 'a')
    toggleBookmark('1', 'b')
    toggleBookmark('1', 'c')
    removeBookmark('1', 'b')
    expect(listBookmarks('1').map((b) => b.webtoonId)).toEqual(['c', 'a'])
    removeBookmarks('1', ['a', 'c'])
    expect(listBookmarks('1')).toEqual([])
  })

  it('ignores corrupt or wrong-schema localStorage payloads', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not-json')
    expect(readStore().byUserId).toEqual({})

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ schemaVersion: 99, byUserId: { '1': [{ webtoonId: 'x', addedAt: 'y' }] } })
    )
    expect(readStore().byUserId).toEqual({})

    writeStore({
      schemaVersion: 1,
      byUserId: {
        '1': [
          { webtoonId: 'ok', addedAt: '2026-08-11T00:00:00.000Z' },
          { webtoonId: 1, addedAt: 'bad' } as unknown as { webtoonId: string; addedAt: string },
        ],
      },
    })
    expect(listBookmarks('1')).toEqual([{ webtoonId: 'ok', addedAt: '2026-08-11T00:00:00.000Z' }])
  })

  it('keeps schema 1 records and optional mute fields', () => {
    writeStore({
      schemaVersion: 1,
      byUserId: {
        '1': [{ webtoonId: 'ok', addedAt: '2026-08-11T00:00:00.000Z' }],
      },
    })
    expect(listBookmarks('1')[0]).toEqual({
      webtoonId: 'ok',
      addedAt: '2026-08-11T00:00:00.000Z',
    })

    toggleBookmark('1', 'wt-2', { lastNotifiedEpisodeNumber: 3 })
    expect(listBookmarks('1').find((b) => b.webtoonId === 'wt-2')).toMatchObject({
      webtoonId: 'wt-2',
      lastNotifiedEpisodeNumber: 3,
    })
    setNotifyMuted('1', 'wt-2', true)
    expect(listBookmarks('1').find((b) => b.webtoonId === 'wt-2')?.notifyMuted).toBe(true)
    setLastNotifiedEpisodeNumber('1', 'wt-2', 4)
    expect(listBookmarks('1').find((b) => b.webtoonId === 'wt-2')?.lastNotifiedEpisodeNumber).toBe(
      4
    )
  })
})
