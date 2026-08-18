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
import { formatCatalogDate, NEW_RELEASE_CAP, newestPublishedIds } from '../lib/catalog'

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

  it('keeps series, episodes, and users in 2026', () => {
    expect(SHARED_DATA_SCHEMA_VERSION).toBe(7)

    for (const webtoon of mockWebtoons) {
      expect(yearOf(webtoon.createdAt)).toBe('2026')
      expect(yearOf(webtoon.updatedAt)).toBe('2026')
      expect(webtoon.createdAt <= webtoon.updatedAt).toBe(true)
      expect(webtoon.updatedAt <= '2026-08-17').toBe(true)
    }

    for (const episode of mockEpisodes) {
      const series = mockWebtoons.find((webtoon) => webtoon.id === episode.webtoonId)
      expect(series).toBeTruthy()
      expect(yearOf(episode.createdAt)).toBe('2026')
      expect(episode.createdAt >= series!.createdAt).toBe(true)
      expect(episode.createdAt <= series!.updatedAt).toBe(true)
    }

    for (const user of mockUsers) {
      expect(yearOf(user.createdAt)).toBe('2026')
      if (user.lastLoginAt) {
        expect(user.createdAt <= user.lastLoginAt.slice(0, 10)).toBe(true)
      }
    }
  })

  it('replaces a stale stored catalog with the current 2026 seed', () => {
    const stale = applyCatalogSeed({
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
      episodes: [],
      users: [],
      comments: [],
      mediaFiles: [],
      activityLogs: [],
      reports: [],
      transactions: [],
      scheduledEpisodes: [],
    })

    expect(stale.webtoons.every((webtoon) => webtoon.createdAt.startsWith('2026-'))).toBe(true)
    expect(stale.episodes).toEqual(mockEpisodes)
  })
})
