import type { Genre, Webtoon } from '@softgate/shared'

export function normalizeGenreToken(s: string): string {
  return s.trim().toLowerCase()
}

export function webtoonMatchesGenre(webtoon: Webtoon, genre: Genre): boolean {
  if (genre.slug === 'all') return true
  const aliases = new Set(
    [genre.name.mm, genre.name.en, genre.slug].map(normalizeGenreToken).filter(Boolean)
  )
  return webtoon.genres.some((g) => aliases.has(normalizeGenreToken(g)))
}

export function findGenreByToken(genres: Genre[], token: string): Genre | undefined {
  const key = normalizeGenreToken(token)
  if (!key) return undefined
  return genres.find(
    (g) =>
      normalizeGenreToken(g.slug) === key ||
      normalizeGenreToken(g.name.mm) === key ||
      normalizeGenreToken(g.name.en) === key
  )
}

export function resolveGenreLabel(raw: string, genres: Genre[], lang: 'mm' | 'en'): string {
  const found = findGenreByToken(genres, raw)
  return found ? found.name[lang] : raw
}
