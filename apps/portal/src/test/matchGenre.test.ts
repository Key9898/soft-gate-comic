import { describe, expect, it } from 'vitest'
import type { Genre, Webtoon } from '@softgate/shared'
import {
  findGenreByToken,
  normalizeGenreToken,
  resolveGenreLabel,
  webtoonMatchesGenre,
} from '../lib/categories'

const actionGenre: Genre = {
  id: '2',
  name: { mm: 'အက်ရှင်', en: 'Action' },
  slug: 'action',
}

const romanceGenre: Genre = {
  id: '3',
  name: { mm: 'အချစ်ဇာတ်လမ်း', en: 'Romance' },
  slug: 'romance',
}

const webtoon = {
  id: '1',
  title: { mm: 'တိမ်', en: 'Cloud' },
  description: { mm: '', en: '' },
  coverColor: 'bg-blue-500',
  author: {
    id: 'a1',
    name: { mm: 'စာရေး', en: 'Writer' },
    followerCount: 1,
    webtoonCount: 1,
    status: 'active',
  },
  genres: ['အက်ရှင်', 'စိတ်ကူးယဉ်'],
  tags: [],
  status: 'ongoing',
  isPremium: false,
  viewCount: 1,
  likeCount: 1,
  episodeCount: 1,
  rating: 5,
  contentRating: 'all',
  createdAt: '2026-01-01',
  updatedAt: '2026-02-01',
} as Webtoon

const genres = [actionGenre, romanceGenre]

describe('matchGenre', () => {
  it('normalizes tokens', () => {
    expect(normalizeGenreToken('  Action  ')).toBe('action')
  })

  it('matches MM-stored genres when filtering by Action genre (EN UI)', () => {
    expect(webtoonMatchesGenre(webtoon, actionGenre)).toBe(true)
    expect(webtoonMatchesGenre(webtoon, romanceGenre)).toBe(false)
  })

  it('matches via slug aliases', () => {
    expect(findGenreByToken(genres, 'action')?.slug).toBe('action')
    expect(findGenreByToken(genres, 'Action')?.slug).toBe('action')
    expect(findGenreByToken(genres, 'အက်ရှင်')?.slug).toBe('action')
  })

  it('resolves card labels to current language', () => {
    expect(resolveGenreLabel('အက်ရှင်', genres, 'en')).toBe('Action')
    expect(resolveGenreLabel('Action', genres, 'mm')).toBe('အက်ရှင်')
    expect(resolveGenreLabel('unknown', genres, 'en')).toBe('unknown')
  })
})
