import type { Author } from '@softgate/shared'
import { matchesQuery } from './escapeRegExp'

export function searchAuthors(authors: Author[], q: string, lang: 'mm' | 'en' = 'en'): Author[] {
  const query = q.trim()
  if (!query) return []

  return authors
    .filter((a) => a.status !== 'inactive')
    .filter((a) => {
      const haystack = [
        a.name.mm,
        a.name.en,
        a.bio?.mm ?? '',
        a.bio?.en ?? '',
        a.name[lang],
        a.bio?.[lang] ?? '',
      ].join(' ')
      return matchesQuery(haystack, query)
    })
    .sort((a, b) => b.followerCount - a.followerCount)
}
