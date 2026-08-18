import { describe, expect, it, beforeEach } from 'vitest'
import type { Author, Episode, Genre, Webtoon } from '@softgate/shared'
import {
  escapeRegExp,
  searchWebtoons,
  searchAuthors,
  searchEpisodes,
  getSearchSuggestions,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
} from '../lib/search'

const webtoons = [
  {
    id: '1',
    title: { mm: 'နောက်ဆုံးမြောက်တိမ်တိုက်', en: 'The Last Cloud' },
    description: { mm: 'desc', en: 'An action fantasy' },
    coverColor: 'bg-blue-500',
    author: {
      id: 'a1',
      name: { mm: 'စာရေးဆရာ', en: 'Writer One' },
      followerCount: 10,
      webtoonCount: 1,
      status: 'active',
    },
    genres: ['Action', 'Fantasy'],
    tags: ['hero'],
    status: 'ongoing',
    isPremium: false,
    viewCount: 100,
    likeCount: 10,
    episodeCount: 12,
    rating: 4.5,
    createdAt: '2026-01-01',
    updatedAt: '2026-02-01',
  },
  {
    id: '2',
    title: { mm: 'အချစ်', en: 'Love Story' },
    description: { mm: 'desc', en: 'Romance in Yangon' },
    coverColor: 'bg-pink-500',
    author: {
      id: 'a2',
      name: { mm: 'အချစ်စာရေး', en: 'Romance Author' },
      followerCount: 50,
      webtoonCount: 2,
      status: 'active',
    },
    genres: ['Romance'],
    tags: ['love'],
    status: 'completed',
    isPremium: false,
    viewCount: 200,
    likeCount: 20,
    episodeCount: 5,
    rating: 4.8,
    createdAt: '2026-01-02',
    updatedAt: '2026-03-01',
  },
] as Webtoon[]

const authors = webtoons.map((w) => w.author) as Author[]

const episodes = [
  {
    id: 'e1',
    webtoonId: '1',
    webtoonTitle: webtoons[0].title,
    title: { mm: 'အပိုင်း ၁', en: 'Episode 1 Cloud Gate' },
    images: [],
    isPremium: false,
    coinPrice: 0,
    viewCount: 9,
    likeCount: 1,
    episodeNumber: 1,
    status: 'published',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
] as Episode[]

const genres = [
  { id: 'g1', name: { mm: 'အားလုံး', en: 'All' }, slug: 'all' },
  { id: 'g2', name: { mm: 'အက်ရှင်', en: 'Action' }, slug: 'action' },
] as Genre[]

describe('escapeRegExp', () => {
  it('escapes special characters', () => {
    expect(escapeRegExp('a+b?')).toBe('a\\+b\\?')
  })
})

describe('searchWebtoons', () => {
  it('matches bilingual title/tags and sorts by popular by default', () => {
    const hits = searchWebtoons(webtoons, { q: 'love' })
    expect(hits.map((w) => w.id)).toEqual(['2'])
  })

  it('filters by status and min episodes', () => {
    const hits = searchWebtoons(webtoons, { status: 'ongoing', minEpisodes: 10 })
    expect(hits.map((w) => w.id)).toEqual(['1'])
  })
})

describe('searchAuthors', () => {
  it('finds authors by name', () => {
    const hits = searchAuthors(authors, 'Romance')
    expect(hits[0]?.id).toBe('a2')
  })
})

describe('searchEpisodes', () => {
  it('returns published episode hits with snippet', () => {
    const hits = searchEpisodes(episodes, webtoons, 'Cloud')
    expect(hits).toHaveLength(1)
    expect(hits[0].snippet.toLowerCase()).toContain('cloud')
  })
})

describe('getSearchSuggestions', () => {
  it('returns empty under min length', () => {
    expect(getSearchSuggestions({ q: 'a', webtoons, authors, genres })).toEqual([])
  })

  it('suggests webtoons for query', () => {
    const hits = getSearchSuggestions({ q: 'cloud', webtoons, authors, genres, limit: 5 })
    expect(hits.some((s) => s.kind === 'webtoon')).toBe(true)
  })
})

describe('recentSearches', () => {
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
    clearRecentSearches()
  })

  it('stores deduped recent terms', () => {
    addRecentSearch('Cloud')
    addRecentSearch('cloud')
    addRecentSearch('Love')
    expect(getRecentSearches()).toEqual(['Love', 'cloud'])
  })
})
