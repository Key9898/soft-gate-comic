import { describe, expect, it } from 'vitest'
import type { Author, Episode, Webtoon } from '@softgate/shared'
import {
  dailyDrops,
  dropRemainingMs,
  formatDropCountdown,
  nextDropForSeries,
  todayWeekday,
  weekdayInYangon,
} from '../lib/catalog'

const author: Author = {
  id: 'a1',
  name: { mm: 'စာရေးဆရာ', en: 'Writer' },
  followerCount: 1,
  webtoonCount: 1,
  status: 'active',
}

const series = (
  partial: Partial<Webtoon> & Pick<Webtoon, 'id' | 'createdAt' | 'status'>
): Webtoon => ({
  title: { mm: partial.id, en: partial.id },
  description: { mm: 'desc', en: 'desc' },
  coverColor: 'bg-gray-700',
  author,
  genres: ['အက်ရှင်'],
  tags: [],
  isPremium: false,
  viewCount: 1,
  likeCount: 1,
  episodeCount: 1,
  rating: 4,
  contentRating: 'all',
  updatedAt: partial.createdAt,
  ...partial,
})

const episode = (
  partial: Partial<Episode> & Pick<Episode, 'id' | 'webtoonId' | 'episodeNumber' | 'status'>
): Episode => ({
  webtoonTitle: { mm: partial.webtoonId, en: partial.webtoonId },
  title: { mm: `ep-${partial.episodeNumber}`, en: `ep-${partial.episodeNumber}` },
  images: [],
  isPremium: false,
  coinPrice: 0,
  viewCount: 0,
  likeCount: 0,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
  ...partial,
})

const WED_OVERDUE = '2026-08-19T05:00:00.000Z'
const FRI_SOON = '2026-08-21T05:00:00.000Z'
const FRI_LATER = '2026-08-21T08:00:00.000Z'
const MON_NEXT = '2026-08-24T05:00:00.000Z'
const FROZEN_NOW = Date.parse('2026-08-19T12:00:00.000Z')

describe('weekdayInYangon', () => {
  it('maps ISO instants in Asia/Yangon, not local midnight', () => {
    expect(weekdayInYangon('2026-08-19T05:00:00.000Z')).toBe(3)
    expect(weekdayInYangon('2026-08-16T05:00:00.000Z')).toBe(0)
    expect(weekdayInYangon('2026-08-21T05:00:00.000Z')).toBe(5)
    expect(todayWeekday(new Date('2026-08-19T12:00:00.000Z'))).toBe(3)
  })
})

describe('dailyDrops', () => {
  const catalog = [
    series({ id: 'horizon', createdAt: '2026-01-01', status: 'ongoing', viewCount: 900 }),
    series({ id: 'knight', createdAt: '2026-01-01', status: 'ongoing', viewCount: 10 }),
    series({ id: 'ghost', createdAt: '2026-01-01', status: 'draft', viewCount: 999 }),
  ]

  const episodes = [
    episode({
      id: 'pub',
      webtoonId: 'horizon',
      episodeNumber: 5,
      status: 'published',
      scheduledAt: FRI_SOON,
    }),
    episode({
      id: 'draft-ep',
      webtoonId: 'horizon',
      episodeNumber: 99,
      status: 'draft',
      scheduledAt: FRI_SOON,
    }),
    episode({
      id: 'fri-a',
      webtoonId: 'horizon',
      episodeNumber: 7,
      status: 'scheduled',
      scheduledAt: FRI_SOON,
    }),
    episode({
      id: 'mon-a',
      webtoonId: 'horizon',
      episodeNumber: 6,
      status: 'scheduled',
      scheduledAt: MON_NEXT,
    }),
    episode({
      id: 'fri-b',
      webtoonId: 'horizon',
      episodeNumber: 8,
      status: 'scheduled',
      scheduledAt: FRI_LATER,
    }),
    episode({
      id: 'wed-overdue',
      webtoonId: 'knight',
      episodeNumber: 4,
      status: 'scheduled',
      scheduledAt: WED_OVERDUE,
    }),
    episode({
      id: 'ghost-drop',
      webtoonId: 'ghost',
      episodeNumber: 1,
      status: 'scheduled',
      scheduledAt: FRI_SOON,
    }),
  ]

  it('keeps scheduled episodes for that Yangon weekday and drops published, draft, and draft series', () => {
    expect(dailyDrops(catalog, episodes, 5).map((drop) => drop.webtoon.id)).toEqual(['horizon'])
    expect(dailyDrops(catalog, episodes, 3).map((drop) => drop.episode.id)).toEqual(['wed-overdue'])
    expect(dailyDrops(catalog, episodes, 2)).toEqual([])
  })

  it('keeps one card per series per weekday and still lists the same title on another weekday', () => {
    expect(dailyDrops(catalog, episodes, 5).map((drop) => drop.episode.id)).toEqual(['fri-a'])
    expect(dailyDrops(catalog, episodes, 1).map((drop) => drop.episode.id)).toEqual(['mon-a'])
  })

  it('sorts by scheduledAt, not viewCount', () => {
    const mixed = [
      series({ id: 'hot', createdAt: '2026-01-01', status: 'ongoing', viewCount: 900 }),
      series({ id: 'quiet', createdAt: '2026-01-01', status: 'ongoing', viewCount: 1 }),
    ]
    const rows = [
      episode({
        id: 'late',
        webtoonId: 'hot',
        episodeNumber: 2,
        status: 'scheduled',
        scheduledAt: FRI_LATER,
      }),
      episode({
        id: 'early',
        webtoonId: 'quiet',
        episodeNumber: 2,
        status: 'scheduled',
        scheduledAt: FRI_SOON,
      }),
    ]
    expect(dailyDrops(mixed, rows, 5).map((drop) => drop.webtoon.id)).toEqual(['quiet', 'hot'])
  })

  it('leaves overdue scheduled rows on Daily', () => {
    expect(dailyDrops(catalog, episodes, 3)[0]?.episode.id).toBe('wed-overdue')
    expect(dropRemainingMs(WED_OVERDUE, FROZEN_NOW)).toBeLessThan(0)
  })
})

describe('nextDropForSeries', () => {
  it('returns the global soonest scheduled episode', () => {
    const episodes = [
      episode({
        id: 'later',
        webtoonId: 'horizon',
        episodeNumber: 6,
        status: 'scheduled',
        scheduledAt: MON_NEXT,
      }),
      episode({
        id: 'sooner',
        webtoonId: 'horizon',
        episodeNumber: 7,
        status: 'scheduled',
        scheduledAt: FRI_SOON,
      }),
    ]
    expect(nextDropForSeries(episodes, 'horizon')?.id).toBe('sooner')
  })
})

describe('formatDropCountdown', () => {
  it('formats remaining time without wrapping at 23:59', () => {
    expect(formatDropCountdown(17 * 60 * 60 * 1000)).toBe('17h 0m 0s')
    expect(formatDropCountdown(2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000)).toBe('2d 3h 0m 0s')
    expect(formatDropCountdown(0)).toBe('')
    expect(formatDropCountdown(-1000)).toBe('')
  })
})
