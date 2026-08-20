import { describe, expect, it } from 'vitest'
import type { Author, Episode, Webtoon } from '@softgate/shared'
import {
  forYouWebtoons,
  newReleaseWebtoons,
  rankingWebtoons,
  spotlightSlides,
  startHereWebtoons,
  trendingWebtoons,
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

describe('spotlightSlides', () => {
  it('orders flagged titles by spotlightOrder, not viewCount', () => {
    const webtoons = [
      series({
        id: 'hot',
        createdAt: '2026-01-01',
        status: 'ongoing',
        viewCount: 900,
        spotlight: true,
        spotlightOrder: 3,
      }),
      series({
        id: 'pick',
        createdAt: '2026-01-01',
        status: 'ongoing',
        viewCount: 10,
        spotlight: true,
        spotlightOrder: 1,
      }),
      series({
        id: 'mid',
        createdAt: '2026-01-01',
        status: 'ongoing',
        viewCount: 50,
        spotlight: true,
        spotlightOrder: 2,
      }),
      series({ id: 'skip', createdAt: '2026-01-01', status: 'ongoing', viewCount: 800 }),
    ]

    expect(spotlightSlides(webtoons).map((webtoon) => webtoon.id)).toEqual(['pick', 'mid', 'hot'])
  })

  it('falls back to viewCount only when no spotlight flags exist', () => {
    const webtoons = [
      series({ id: 'a', createdAt: '2026-01-01', status: 'ongoing', viewCount: 10 }),
      series({ id: 'b', createdAt: '2026-01-01', status: 'ongoing', viewCount: 30 }),
      series({ id: 'draft', createdAt: '2026-01-01', status: 'draft', viewCount: 99 }),
    ]

    expect(spotlightSlides(webtoons, 2).map((webtoon) => webtoon.id)).toEqual(['b', 'a'])
  })

  it('excludes drafts from flagged spotlight', () => {
    const webtoons = [
      series({
        id: 'live',
        createdAt: '2026-01-01',
        status: 'ongoing',
        spotlight: true,
        spotlightOrder: 1,
      }),
      series({
        id: 'hidden',
        createdAt: '2026-01-01',
        status: 'draft',
        spotlight: true,
        spotlightOrder: 0,
      }),
    ]

    expect(spotlightSlides(webtoons).map((webtoon) => webtoon.id)).toEqual(['live'])
  })
})

describe('ranking vs trending', () => {
  const catalog = [
    series({
      id: 'lifetime',
      createdAt: '2026-01-01',
      status: 'ongoing',
      viewCount: 1000,
      weeklyViewCount: 5,
    }),
    series({
      id: 'rising',
      createdAt: '2026-01-01',
      status: 'ongoing',
      viewCount: 20,
      weeklyViewCount: 80,
    }),
    series({ id: 'quiet', createdAt: '2026-01-01', status: 'ongoing', viewCount: 200 }),
  ]

  it('ranks by lifetime viewCount', () => {
    expect(rankingWebtoons(catalog).map((webtoon) => webtoon.id)).toEqual([
      'lifetime',
      'quiet',
      'rising',
    ])
  })

  it('trends by weeklyViewCount and treats missing as 0', () => {
    expect(trendingWebtoons(catalog).map((webtoon) => webtoon.id)).toEqual([
      'rising',
      'lifetime',
      'quiet',
    ])
  })

  it('does not strip ranking ids from trending', () => {
    const ranked = new Set(rankingWebtoons(catalog, 2).map((webtoon) => webtoon.id))
    const trending = trendingWebtoons(catalog, 2).map((webtoon) => webtoon.id)
    expect(trending.some((id) => ranked.has(id))).toBe(true)
  })
})

describe('updated and new rails', () => {
  const catalog = [
    series({
      id: 'born-a',
      createdAt: '2026-08-15',
      updatedAt: '2026-08-15',
      status: 'ongoing',
    }),
    series({
      id: 'born-b',
      createdAt: '2026-08-10',
      updatedAt: '2026-08-10',
      status: 'ongoing',
    }),
    series({
      id: 'moved-1',
      createdAt: '2026-01-08',
      updatedAt: '2026-08-16',
      status: 'ongoing',
    }),
    series({
      id: 'moved-2',
      createdAt: '2026-02-01',
      updatedAt: '2026-08-14',
      status: 'ongoing',
    }),
    series({
      id: 'draft',
      createdAt: '2026-08-16',
      updatedAt: '2026-08-16',
      status: 'draft',
    }),
  ]

  it('sorts new releases by createdAt', () => {
    expect(newReleaseWebtoons(catalog, 2).map((webtoon) => webtoon.id)).toEqual([
      'born-a',
      'born-b',
    ])
  })

  it('sorts updated by updatedAt and omits the new-rail ids', () => {
    expect(updatedWebtoons(catalog, 2).map((webtoon) => webtoon.id)).toEqual(['moved-1', 'moved-2'])
  })
})

describe('startHereWebtoons', () => {
  const episode = (partial: Partial<Episode> & Pick<Episode, 'id' | 'webtoonId'>): Episode => ({
    webtoonTitle: { mm: partial.webtoonId, en: partial.webtoonId },
    title: { mm: 'ep', en: 'ep' },
    images: [],
    isPremium: false,
    coinPrice: 0,
    viewCount: 1,
    likeCount: 1,
    episodeNumber: 1,
    status: 'published',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    ...partial,
  })

  const catalog = [
    series({
      id: 'hero',
      createdAt: '2026-01-01',
      status: 'ongoing',
      viewCount: 900,
      spotlight: true,
      spotlightOrder: 1,
    }),
    series({
      id: 'free-hot',
      createdAt: '2026-01-01',
      status: 'ongoing',
      viewCount: 400,
      isPremium: true,
    }),
    series({
      id: 'free-mid',
      createdAt: '2026-01-01',
      status: 'ongoing',
      viewCount: 200,
    }),
    series({
      id: 'locked-ep',
      createdAt: '2026-01-01',
      status: 'ongoing',
      viewCount: 800,
    }),
    series({
      id: 'draft-ep',
      createdAt: '2026-01-01',
      status: 'ongoing',
      viewCount: 700,
    }),
    series({
      id: 'no-ep',
      createdAt: '2026-01-01',
      status: 'ongoing',
      viewCount: 600,
    }),
    series({
      id: 'draft-series',
      createdAt: '2026-01-01',
      status: 'draft',
      viewCount: 999,
    }),
  ]

  const episodes = [
    episode({ id: 'e-hero', webtoonId: 'hero' }),
    episode({ id: 'e-hot', webtoonId: 'free-hot' }),
    episode({ id: 'e-mid', webtoonId: 'free-mid' }),
    episode({ id: 'e-locked', webtoonId: 'locked-ep', isPremium: true }),
    episode({ id: 'e-draft', webtoonId: 'draft-ep', status: 'draft' }),
    episode({ id: 'e-series-draft', webtoonId: 'draft-series' }),
  ]

  it('drops hero ids and keeps free published episode 1 by viewCount', () => {
    expect(startHereWebtoons(catalog, episodes).map((webtoon) => webtoon.id)).toEqual([
      'free-hot',
      'free-mid',
    ])
  })

  it('does not drop a series only because webtoon.isPremium is true', () => {
    expect(startHereWebtoons(catalog, episodes).map((webtoon) => webtoon.id)).toContain('free-hot')
  })

  it('drops missing, draft, or premium episode 1', () => {
    const ids = startHereWebtoons(catalog, episodes).map((webtoon) => webtoon.id)
    expect(ids).not.toContain('locked-ep')
    expect(ids).not.toContain('draft-ep')
    expect(ids).not.toContain('no-ep')
    expect(ids).not.toContain('draft-series')
  })

  it('caps at 6 and returns empty when nothing qualifies', () => {
    const hero = series({
      id: 'cap-hero',
      createdAt: '2026-01-01',
      status: 'ongoing',
      viewCount: 1,
      spotlight: true,
      spotlightOrder: 1,
    })
    const many = Array.from({ length: 8 }, (_, index) =>
      series({
        id: `fill-${index}`,
        createdAt: '2026-01-01',
        status: 'ongoing',
        viewCount: 10 + index,
      })
    )
    const manyEpisodes = [hero, ...many].map((webtoon, index) =>
      episode({ id: `fill-ep-${index}`, webtoonId: webtoon.id })
    )
    expect(startHereWebtoons([hero, ...many], manyEpisodes)).toHaveLength(6)
    expect(startHereWebtoons([], [])).toEqual([])
    expect(startHereWebtoons(catalog, [])).toEqual([])
  })
})

describe('forYouWebtoons', () => {
  it('returns empty when there is no personal signal', () => {
    expect(
      forYouWebtoons({
        webtoons: [
          series({ id: 'hot', createdAt: '2026-01-01', status: 'ongoing', viewCount: 900 }),
        ],
        bookmarkIds: [],
        likedIds: [],
        history: [],
        excludeIds: [],
      })
    ).toEqual([])
  })

  it('keeps subscribe order and does not sort by viewCount', () => {
    const catalog = [
      series({
        id: 'low',
        createdAt: '2026-01-01',
        status: 'ongoing',
        viewCount: 1,
        genres: ['romance'],
      }),
      series({
        id: 'high',
        createdAt: '2026-01-01',
        status: 'ongoing',
        viewCount: 999,
        genres: ['romance'],
      }),
    ]
    expect(
      forYouWebtoons({
        webtoons: catalog,
        bookmarkIds: ['low', 'high'],
        likedIds: [],
        history: [],
        excludeIds: [],
      }).map((webtoon) => webtoon.id)
    ).toEqual(['low', 'high'])
  })

  it('does not include a ranking-hot title with no personal signal', () => {
    const catalog = [
      series({
        id: 'hot',
        createdAt: '2026-01-01',
        status: 'ongoing',
        viewCount: 999,
        genres: ['action'],
      }),
      series({
        id: 'mine',
        createdAt: '2026-01-01',
        status: 'ongoing',
        viewCount: 1,
        genres: ['slice'],
      }),
    ]
    expect(
      forYouWebtoons({
        webtoons: catalog,
        bookmarkIds: ['mine'],
        likedIds: [],
        history: [],
        excludeIds: [],
      }).map((webtoon) => webtoon.id)
    ).toEqual(['mine'])
  })

  it('drops excluded continue ids even when subscribed', () => {
    const catalog = [
      series({
        id: 'reading',
        createdAt: '2026-01-01',
        status: 'ongoing',
        viewCount: 1,
        genres: ['unique-a'],
      }),
      series({
        id: 'other',
        createdAt: '2026-01-01',
        status: 'ongoing',
        viewCount: 1,
        genres: ['unique-b'],
      }),
    ]
    expect(
      forYouWebtoons({
        webtoons: catalog,
        bookmarkIds: ['reading', 'other'],
        likedIds: [],
        history: [],
        excludeIds: ['reading'],
      }).map((webtoon) => webtoon.id)
    ).toEqual(['other'])
  })

  it('fills same-genre neighbors after seeds without viewCount order', () => {
    const catalog = [
      series({
        id: 'z-seed',
        createdAt: '2026-01-01',
        status: 'ongoing',
        viewCount: 1,
        genres: ['shared'],
      }),
      series({
        id: 'b-hot',
        createdAt: '2026-01-01',
        status: 'ongoing',
        viewCount: 900,
        genres: ['shared'],
      }),
      series({
        id: 'a-cold',
        createdAt: '2026-01-01',
        status: 'ongoing',
        viewCount: 2,
        genres: ['shared'],
      }),
    ]
    expect(
      forYouWebtoons({
        webtoons: catalog,
        bookmarkIds: ['z-seed'],
        likedIds: [],
        history: [],
        excludeIds: [],
      }).map((webtoon) => webtoon.id)
    ).toEqual(['z-seed', 'a-cold', 'b-hot'])
  })
})
