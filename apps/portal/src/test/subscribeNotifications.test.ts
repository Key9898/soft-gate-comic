import { beforeEach, describe, expect, it } from 'vitest'
import type { Episode } from '@softgate/shared'
import { listBookmarks, toggleBookmark, setNotifyMuted } from '../lib/library'
import { listNotifications, setNotifPrefs, syncSubscribeNotifications } from '../lib/notifications'

const episode = (
  webtoonId: string,
  episodeNumber: number,
  status: Episode['status'] = 'published'
): Episode => ({
  id: `${webtoonId}-${episodeNumber}`,
  webtoonId,
  webtoonTitle: { en: 'Title', mm: 'Title' },
  title: { en: `Ep ${episodeNumber}`, mm: `Ep ${episodeNumber}` },
  images: [],
  isPremium: false,
  coinPrice: 0,
  viewCount: 1,
  likeCount: 1,
  episodeNumber,
  status,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
})

describe('subscribe episode notifications', () => {
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

  it('does not notify when latest is already stamped', () => {
    toggleBookmark('u1', 'wt-1', { lastNotifiedEpisodeNumber: 3 })
    const before = listNotifications('u1').filter((n) => n.id.startsWith('sub-'))
    syncSubscribeNotifications('u1', listBookmarks('u1'), [], [episode('wt-1', 3)])
    const after = listNotifications('u1').filter((n) => n.id.startsWith('sub-'))
    expect(after).toEqual(before)
  })

  it('notifies when a later published episode appears and stamps lastNotified', () => {
    toggleBookmark('u1', 'wt-1', { lastNotifiedEpisodeNumber: 3 })
    syncSubscribeNotifications(
      'u1',
      listBookmarks('u1'),
      [],
      [episode('wt-1', 3), episode('wt-1', 4)]
    )
    const notice = listNotifications('u1').find((n) => n.id === 'sub-wt-1-4')
    expect(notice?.type).toBe('new_episode')
    expect(notice?.data).toEqual({ webtoonId: 'wt-1', episodeNumber: 4 })
    expect(listBookmarks('u1')[0]?.lastNotifiedEpisodeNumber).toBe(4)
  })

  it('skips muted series and does not duplicate', () => {
    toggleBookmark('u1', 'wt-1', { lastNotifiedEpisodeNumber: 3 })
    setNotifyMuted('u1', 'wt-1', true)
    syncSubscribeNotifications(
      'u1',
      listBookmarks('u1'),
      [],
      [episode('wt-1', 3), episode('wt-1', 5)]
    )
    expect(listNotifications('u1').some((n) => n.id === 'sub-wt-1-5')).toBe(false)
    setNotifyMuted('u1', 'wt-1', false)
    syncSubscribeNotifications(
      'u1',
      listBookmarks('u1'),
      [],
      [episode('wt-1', 3), episode('wt-1', 5)]
    )
    syncSubscribeNotifications(
      'u1',
      listBookmarks('u1'),
      [],
      [episode('wt-1', 3), episode('wt-1', 5)]
    )
    expect(listNotifications('u1').filter((n) => n.id === 'sub-wt-1-5')).toHaveLength(1)
  })

  it('stamps existing bookmarks without lastNotified and does not spam', () => {
    toggleBookmark('u1', 'wt-1')
    expect(listBookmarks('u1')[0]?.lastNotifiedEpisodeNumber).toBeUndefined()
    syncSubscribeNotifications('u1', listBookmarks('u1'), [], [episode('wt-1', 2)])
    expect(listBookmarks('u1')[0]?.lastNotifiedEpisodeNumber).toBe(2)
    expect(listNotifications('u1').some((n) => n.id === 'sub-wt-1-2')).toBe(false)
  })

  it('skips new episode notices when the global pref is off', () => {
    setNotifPrefs('u1', { newEpisode: false })
    toggleBookmark('u1', 'wt-1', { lastNotifiedEpisodeNumber: 3 })
    syncSubscribeNotifications(
      'u1',
      listBookmarks('u1'),
      [],
      [episode('wt-1', 3), episode('wt-1', 4)]
    )
    expect(listNotifications('u1').some((n) => n.id === 'sub-wt-1-4')).toBe(false)
  })
})
