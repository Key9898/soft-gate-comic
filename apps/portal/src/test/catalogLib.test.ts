import { describe, expect, it } from 'vitest'
import {
  applyCatalogSeed,
  mockEpisodes,
  mockUsers,
  mockWebtoons,
  SHARED_DATA_SCHEMA_VERSION,
  type Author,
  type Webtoon,
} from '@softgate/shared'
import {
  formatCatalogDate,
  NEW_RELEASE_CAP,
  newestPublishedIds,
  newReleaseWebtoons,
  updatedWebtoons,
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

describe('newestPublishedIds', () => {
  it(`returns the ${NEW_RELEASE_CAP} newest published series`, () => {
    const webtoons = [
      series({ id: 'old', createdAt: '2026-01-08', status: 'ongoing' }),
      series({ id: 'mid', createdAt: '2026-03-12', status: 'ongoing' }),
      series({ id: 'new-a', createdAt: '2026-08-10', status: 'ongoing' }),
      series({ id: 'new-b', createdAt: '2026-07-08', status: 'ongoing' }),
      series({ id: 'new-c', createdAt: '2026-06-14', status: 'ongoing' }),
      series({ id: 'new-d', createdAt: '2026-05-09', status: 'ongoing' }),
      series({ id: 'new-e', createdAt: '2026-04-03', status: 'ongoing' }),
      series({ id: 'draft', createdAt: '2026-08-15', status: 'draft' }),
      series({ id: 'new-f', createdAt: '2026-03-20', status: 'completed' }),
    ]

    expect([...newestPublishedIds(webtoons)]).toEqual([
      'new-a',
      'new-b',
      'new-c',
      'new-d',
      'new-e',
      'new-f',
    ])
  })

  it('excludes drafts even when they are the newest', () => {
    const webtoons = [
      series({ id: 'live', createdAt: '2026-01-01', status: 'ongoing' }),
      series({ id: 'hidden', createdAt: '2026-08-17', status: 'draft' }),
    ]

    expect(newestPublishedIds(webtoons).has('hidden')).toBe(false)
    expect(newestPublishedIds(webtoons).has('live')).toBe(true)
  })
})

describe('formatCatalogDate', () => {
  it('formats a calendar date as day month year in English', () => {
    expect(formatCatalogDate('2026-01-08')).toBe('8 Jan 2026')
    expect(formatCatalogDate('2026-03-12')).toBe('12 Mar 2026')
  })
})

describe('mock catalog calendar', () => {
  const yearOf = (iso: string) => iso.slice(0, 4)

  it('keeps Love in Seoul MM literary and EN cover-brand', () => {
    const loveInSeoul = mockWebtoons.find((webtoon) => webtoon.id === '2')
    expect(loveInSeoul?.title.mm).toBe('ဆိုးလ်မြို့က ချစ်ခြင်းတရား')
    expect(loveInSeoul?.title.en).toBe('Love in Seoul')
  })

  it('keeps series, episodes, and users in 2026', () => {
    expect(SHARED_DATA_SCHEMA_VERSION).toBe(14)

    for (const webtoon of mockWebtoons) {
      expect(yearOf(webtoon.createdAt)).toBe('2026')
      expect(yearOf(webtoon.updatedAt)).toBe('2026')
      expect(webtoon.createdAt <= webtoon.updatedAt).toBe(true)
      expect(webtoon.updatedAt <= '2026-08-19').toBe(true)
      expect(['all', '13', '16', '18']).toContain(webtoon.contentRating)
    }

    expect(mockWebtoons.map((webtoon) => webtoon.contentRating)).toEqual([
      '13',
      '13',
      '16',
      'all',
      '13',
      'all',
      '18',
      '16',
      '13',
    ])

    expect(mockWebtoons.every((webtoon) => webtoon.uploadDay === undefined)).toBe(true)

    expect(newReleaseWebtoons(mockWebtoons).map((webtoon) => webtoon.id)).toEqual([
      '9',
      '6',
      '4',
      '8',
      '7',
      '2',
    ])
    expect(updatedWebtoons(mockWebtoons).map((webtoon) => webtoon.id)).toEqual(['3', '1', '5'])

    for (const episode of mockEpisodes) {
      const series = mockWebtoons.find((webtoon) => webtoon.id === episode.webtoonId)
      expect(series).toBeTruthy()
      expect(yearOf(episode.createdAt)).toBe('2026')
      expect(episode.createdAt >= series!.createdAt).toBe(true)
      expect(episode.createdAt <= series!.updatedAt).toBe(true)
      if (episode.status === 'scheduled') {
        expect(episode.scheduledAt).toBeTruthy()
        expect(episode.scheduledAt!.startsWith('2026-')).toBe(true)
        expect(episode.scheduledAt).not.toMatch(/T23:59/)
        continue
      }
      if (!episode.isPremium) {
        expect(episode.freeAt).toBeUndefined()
      }
      if (episode.freeAt) {
        expect(episode.isPremium).toBe(true)
        expect(episode.freeAt.startsWith('2026-')).toBe(true)
        expect(episode.freeAt >= episode.createdAt).toBe(true)
        expect(episode.freeAt).not.toMatch(/T23:59/)
      }
    }

    const publishedPremium = mockEpisodes.filter(
      (episode) => episode.isPremium && episode.status === 'published'
    )
    const waiting = publishedPremium.filter((episode) => episode.freeAt)
    const coinsOnly = publishedPremium.filter((episode) => !episode.freeAt)
    expect(coinsOnly.length).toBeGreaterThan(0)
    expect(waiting.length).toBeGreaterThan(0)
    const demoNow = Date.parse('2026-08-19T12:00:00.000Z')
    expect(waiting.some((episode) => Date.parse(episode.freeAt!) <= demoNow)).toBe(true)
    expect(waiting.some((episode) => Date.parse(episode.freeAt!) > demoNow)).toBe(true)

    for (const user of mockUsers) {
      expect(yearOf(user.createdAt)).toBe('2026')
      if (user.lastLoginAt) {
        expect(user.createdAt <= user.lastLoginAt.slice(0, 10)).toBe(true)
      }
    }
  })

  it('keeps a stored catalog instead of replacing it with the Demo seed', () => {
    const storedEpisodes = [
      {
        ...mockEpisodes[0],
        images: ['/a.png', '/b.png'],
        imageSizes: [
          { width: 800, height: 1200 },
          { width: 800, height: 900 },
        ],
      },
    ]
    const stored = {
      dashboardStats: {
        totalUsers: 0,
        totalWebtoons: 1,
        totalEpisodes: 0,
        totalViews: 0,
        totalRevenue: 0,
        newUsersToday: 0,
        activeUsersToday: 0,
        newEpisodesToday: 0,
      },
      revenueData: [],
      userGrowthData: [],
      popularWebtoons: [],
      authors: [],
      genres: [],
      webtoons: mockWebtoons.map((webtoon) => ({
        ...webtoon,
        createdAt: '2023-06-10',
        updatedAt: '2024-11-10',
      })),
      episodes: storedEpisodes,
      users: [],
      comments: [],
      mediaFiles: [],
      activityLogs: [],
      reports: [],
      transactions: [],
      scheduledEpisodes: [],
    }

    const kept = applyCatalogSeed(stored)
    expect(kept.webtoons.every((webtoon) => webtoon.createdAt === '2023-06-10')).toBe(true)
    expect(kept.episodes).toEqual(storedEpisodes)
    expect(kept.episodes[0].imageSizes).toEqual([
      { width: 800, height: 1200 },
      { width: 800, height: 900 },
    ])
  })

  it('keeps an empty stored catalog empty', () => {
    const empty = applyCatalogSeed({
      dashboardStats: {
        totalUsers: 0,
        totalWebtoons: 0,
        totalEpisodes: 0,
        totalViews: 0,
        totalRevenue: 0,
        newUsersToday: 0,
        activeUsersToday: 0,
        newEpisodesToday: 0,
      },
      revenueData: [],
      userGrowthData: [],
      popularWebtoons: [],
      authors: [],
      genres: [],
      webtoons: [],
      episodes: [],
      users: [],
      comments: [],
      mediaFiles: [],
      activityLogs: [],
      reports: [],
      transactions: [],
      scheduledEpisodes: [],
    })
    expect(empty.webtoons).toEqual([])
    expect(empty.episodes).toEqual([])
  })

  it('does not replace stored coinPackages', () => {
    const packs = [
      { id: '9', coins: 77, price: 900, bonus: 5 },
      { id: '10', coins: 200, price: 2500, popular: true },
    ]
    const stored = applyCatalogSeed({
      dashboardStats: {
        totalUsers: 0,
        totalWebtoons: 1,
        totalEpisodes: 0,
        totalViews: 0,
        totalRevenue: 0,
        newUsersToday: 0,
        activeUsersToday: 0,
        newEpisodesToday: 0,
      },
      revenueData: [],
      userGrowthData: [],
      popularWebtoons: [],
      authors: [],
      genres: [],
      webtoons: mockWebtoons.slice(0, 1),
      episodes: mockEpisodes.slice(0, 1),
      users: [],
      comments: [],
      mediaFiles: [],
      activityLogs: [],
      reports: [],
      transactions: [],
      scheduledEpisodes: [],
      coinPackages: packs,
    })
    expect(stored.coinPackages).toEqual(packs)
  })
})
