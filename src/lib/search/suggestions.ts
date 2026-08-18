import type { Author, Genre, Webtoon } from '@softgate/shared'
import { matchesQuery } from './escapeRegExp'

export type SuggestionKind = 'webtoon' | 'author' | 'genre'

export interface SearchSuggestion {
  id: string
  kind: SuggestionKind
  label: string
  href: string
}

const MIN_QUERY_LENGTH = 2

export function getSearchSuggestions(options: {
  q: string
  webtoons: Webtoon[]
  authors: Author[]
  genres: Genre[]
  lang?: 'mm' | 'en'
  limit?: number
}): SearchSuggestion[] {
  const { q, webtoons, authors, genres, lang = 'en', limit = 5 } = options
  const query = q.trim()
  if (query.length < MIN_QUERY_LENGTH) return []

  const capped = Math.min(Math.max(limit, 1), 10)
  const out: SearchSuggestion[] = []

  for (const w of [...webtoons]
    .filter((x) => x.status !== 'draft')
    .sort((a, b) => b.viewCount - a.viewCount)) {
    if (out.filter((s) => s.kind === 'webtoon').length >= capped) break
    const label = w.title[lang]
    if (matchesQuery(`${w.title.mm} ${w.title.en} ${w.genres.join(' ')}`, query)) {
      out.push({ id: `w-${w.id}`, kind: 'webtoon', label, href: `/webtoon/${w.id}` })
    }
  }

  for (const a of [...authors]
    .filter((x) => x.status !== 'inactive')
    .sort((x, y) => y.followerCount - x.followerCount)) {
    if (out.filter((s) => s.kind === 'author').length >= capped) break
    if (matchesQuery(`${a.name.mm} ${a.name.en}`, query)) {
      out.push({
        id: `a-${a.id}`,
        kind: 'author',
        label: a.name[lang],
        href: `/search?q=${encodeURIComponent(a.name[lang])}&tab=authors`,
      })
    }
  }

  for (const g of genres) {
    if (out.filter((s) => s.kind === 'genre').length >= capped) break
    if (g.slug === 'all') continue
    if (matchesQuery(`${g.name.mm} ${g.name.en}`, query)) {
      out.push({
        id: `g-${g.id}`,
        kind: 'genre',
        label: g.name[lang],
        href: `/categories/${g.slug}`,
      })
    }
  }

  return out.slice(0, capped * 3)
}
