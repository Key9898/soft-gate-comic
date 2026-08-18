import type { Episode, Webtoon } from '@softgate/shared'
import { matchesQuery } from './escapeRegExp'

export interface EpisodeSearchHit {
  episode: Episode
  webtoon?: Webtoon
  snippet: string
}

export function searchEpisodes(
  episodes: Episode[],
  webtoons: Webtoon[],
  q: string,
  lang: 'mm' | 'en' = 'en'
): EpisodeSearchHit[] {
  const query = q.trim()
  if (!query) return []

  const byId = new Map(webtoons.map((w) => [w.id, w]))

  return episodes
    .filter((e) => e.status === 'published')
    .filter((e) => {
      const haystack = [
        e.title.mm,
        e.title.en,
        e.description?.mm ?? '',
        e.description?.en ?? '',
        e.webtoonTitle.mm,
        e.webtoonTitle.en,
      ].join(' ')
      return matchesQuery(haystack, query)
    })
    .map((episode) => {
      const text = episode.title[lang] || episode.title.en
      const lower = text.toLowerCase()
      const idx = lower.indexOf(query.toLowerCase())
      let snippet = text
      if (idx >= 0) {
        const start = Math.max(0, idx - 24)
        const end = Math.min(text.length, idx + query.length + 24)
        snippet = `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`
      }
      return {
        episode,
        webtoon: byId.get(episode.webtoonId),
        snippet,
      }
    })
    .sort((a, b) => b.episode.viewCount - a.episode.viewCount)
}
