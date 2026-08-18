import type { Genre, Webtoon } from '@softgate/shared'
import { matchesQuery } from './escapeRegExp'
import { findGenreByToken, webtoonMatchesGenre } from '../categories'

export type WebtoonSortBy = 'latest' | 'popular' | 'rating' | 'title'

export interface SearchWebtoonsFilters {
  q?: string
  status?: Webtoon['status'] | 'all'
  genre?: string
  genres?: Genre[]
  tag?: string
  minEpisodes?: number
  maxEpisodes?: number
  sortBy?: WebtoonSortBy
  lang?: 'mm' | 'en'
}

function bilingualHaystack(webtoon: Webtoon, lang: 'mm' | 'en'): string {
  return [
    webtoon.title.mm,
    webtoon.title.en,
    webtoon.description.mm,
    webtoon.description.en,
    webtoon.author.name.mm,
    webtoon.author.name.en,
    ...webtoon.genres,
    ...webtoon.tags,
    webtoon.title[lang],
    webtoon.description[lang],
  ].join(' ')
}

export function searchWebtoons(
  webtoons: Webtoon[],
  filters: SearchWebtoonsFilters = {}
): Webtoon[] {
  const {
    q = '',
    status = 'all',
    genre,
    genres = [],
    tag,
    minEpisodes,
    maxEpisodes,
    sortBy = 'popular',
    lang = 'en',
  } = filters

  let results = webtoons.filter((w) => w.status !== 'draft')

  if (status !== 'all') {
    results = results.filter((w) => w.status === status)
  }

  if (genre) {
    const catalogGenre = findGenreByToken(genres, genre)
    if (catalogGenre) {
      results = results.filter((w) => webtoonMatchesGenre(w, catalogGenre))
    } else {
      const g = genre.toLowerCase()
      results = results.filter((w) =>
        w.genres.some((x) => x.toLowerCase() === g || x.toLowerCase().includes(g))
      )
    }
  }

  if (tag) {
    const t = tag.toLowerCase()
    results = results.filter((w) =>
      w.tags.some((x) => x.toLowerCase() === t || x.toLowerCase().includes(t))
    )
  }

  if (typeof minEpisodes === 'number') {
    results = results.filter((w) => w.episodeCount >= minEpisodes)
  }

  if (typeof maxEpisodes === 'number') {
    results = results.filter((w) => w.episodeCount <= maxEpisodes)
  }

  const query = q.trim()
  if (query) {
    results = results.filter((w) => matchesQuery(bilingualHaystack(w, lang), query))
  }

  switch (sortBy) {
    case 'latest':
      results = [...results].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      break
    case 'rating':
      results = [...results].sort((a, b) => b.rating - a.rating)
      break
    case 'title':
      results = [...results].sort((a, b) => a.title[lang].localeCompare(b.title[lang]))
      break
    case 'popular':
    default:
      results = [...results].sort((a, b) => b.viewCount - a.viewCount)
      break
  }

  return results
}
