import { describe, expect, it } from 'vitest'
import {
  asBilingual,
  publishedCatalogFromAdmin,
  type AdminAuthorRow,
  type AdminEpisodeRow,
  type AdminGenreRow,
  type AdminWebtoonRow,
} from '../catalog/fromAdmin.js'

const createdAt = '2026-01-01T00:00:00.000Z'
const updatedAt = '2026-01-02T00:00:00.000Z'

const author: AdminAuthorRow = {
  id: 'author-1',
  name: { en: 'Ada', mm: 'အေဒါ' },
  bio: { en: 'Bio', mm: 'အတ္ထု' },
  avatar: 'https://cdn.example/a.png',
  followerCount: 12,
  status: 'active',
}

const allGenre: AdminGenreRow = {
  id: 'genre-all',
  name: { en: 'All', mm: 'အားလုံး' },
  slug: 'all',
}

const romance: AdminGenreRow = {
  id: 'genre-romance',
  name: { en: 'Romance', mm: 'အချစ်' },
  slug: 'romance',
}

const publishedWebtoon: AdminWebtoonRow = {
  id: 'wt-1',
  title: { en: 'Live', mm: 'တိုက်ရိုက်' },
  description: { en: 'Desc', mm: 'ဖော်ပြ' },
  coverImage: 'https://cdn.example/c.png',
  coverColor: '#111111',
  authorId: 'author-1',
  tags: ['office'],
  status: 'ongoing',
  isPremium: false,
  viewCount: 10,
  likeCount: 2,
  rating: 4.5,
  contentRating: '13',
  spotlight: true,
  spotlightOrder: 1,
  weeklyViewCount: 3,
  createdAt,
  updatedAt,
  genreIds: ['genre-romance'],
}

const draftWebtoon: AdminWebtoonRow = {
  ...publishedWebtoon,
  id: 'wt-draft',
  title: { en: 'Draft series', mm: 'မူကြမ်း' },
  status: 'draft',
  spotlight: false,
  spotlightOrder: null,
}

const invalidRatingWebtoon: AdminWebtoonRow = {
  ...publishedWebtoon,
  id: 'wt-bad-rating',
  title: { en: 'Bad rating', mm: 'အဆင့်မှား' },
  contentRating: '21',
}

const publishedEpisode: AdminEpisodeRow = {
  id: 'ep-1',
  webtoonId: 'wt-1',
  title: { en: 'Ep 1', mm: 'အပိုင်း ၁' },
  description: { en: 'First', mm: 'ပထမ' },
  images: ['https://cdn.example/1.png'],
  imageSizes: [{ width: 800, height: 1200 }, null],
  isPremium: false,
  coinPrice: 0,
  viewCount: 8,
  likeCount: 1,
  episodeNumber: 1,
  status: 'published',
  createdAt,
  updatedAt,
}

const scheduledEpisode: AdminEpisodeRow = {
  ...publishedEpisode,
  id: 'ep-2',
  title: { en: 'Ep 2', mm: 'အပိုင်း ၂' },
  episodeNumber: 2,
  status: 'scheduled',
  scheduledAt: '2026-09-20T00:00:00.000Z',
}

const draftEpisode: AdminEpisodeRow = {
  ...publishedEpisode,
  id: 'ep-draft',
  title: { en: 'Hidden', mm: 'ဝှက်' },
  episodeNumber: 3,
  status: 'draft',
}

describe('publishedCatalogFromAdmin', () => {
  it('omits drafts, keeps scheduled, skips invalid contentRating, and leaves coinPackages unset', () => {
    const catalog = publishedCatalogFromAdmin({
      authors: [author],
      genres: [allGenre, romance],
      webtoons: [publishedWebtoon, draftWebtoon, invalidRatingWebtoon],
      episodes: [publishedEpisode, scheduledEpisode, draftEpisode],
    })

    expect(catalog.webtoons.map((row) => row.id)).toEqual(['wt-1'])
    expect(catalog.episodes.map((row) => row.id)).toEqual(['ep-1', 'ep-2'])
    expect(catalog.episodes.every((row) => row.status !== 'draft')).toBe(true)
    expect(catalog.episodes.some((row) => row.status === 'scheduled')).toBe(true)
    expect(catalog.authors.map((row) => row.id)).toEqual(['author-1'])
    expect(catalog.webtoons[0]?.episodeCount).toBe(2)
    expect(catalog.webtoons[0]?.genres).toEqual(['romance'])
    expect(catalog.webtoons[0]?.author.status).toBe('active')
    expect(catalog.webtoons[0]?.spotlight).toBe(true)
    expect(catalog.webtoons[0]?.weeklyViewCount).toBe(3)
    expect(catalog.authors[0]?.webtoonCount).toBe(1)
    expect(catalog.genres.find((row) => row.slug === 'all')?.webtoonCount).toBe(1)
    expect(catalog.genres.find((row) => row.slug === 'romance')?.webtoonCount).toBe(1)
    expect(catalog.coinPackages).toBeUndefined()
  })

  it('maps bilingual JSON, ISO dates, and imageSizes including nulls', () => {
    const catalog = publishedCatalogFromAdmin({
      authors: [author],
      genres: [romance],
      webtoons: [publishedWebtoon],
      episodes: [
        {
          ...publishedEpisode,
          freeAt: '2026-02-01T00:00:00.000Z',
        },
      ],
    })

    expect(catalog.webtoons[0]?.title).toEqual({ en: 'Live', mm: 'တိုက်ရိုက်' })
    expect(catalog.episodes[0]?.webtoonTitle).toEqual({ en: 'Live', mm: 'တိုက်ရိုက်' })
    expect(catalog.episodes[0]?.imageSizes).toEqual([{ width: 800, height: 1200 }, null])
    expect(catalog.episodes[0]?.freeAt).toBe('2026-02-01T00:00:00.000Z')
    expect(catalog.webtoons[0]?.createdAt).toBe(createdAt)
  })
})

describe('asBilingual', () => {
  it('returns empty strings for invalid JSON', () => {
    expect(asBilingual('nope')).toEqual({ en: '', mm: '' })
    expect(asBilingual({ en: 1, mm: 'ok' })).toEqual({ en: '', mm: 'ok' })
  })
})
