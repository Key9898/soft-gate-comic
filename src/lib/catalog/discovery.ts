import type { Episode, Webtoon } from '@softgate/shared'

export const HERO_SLIDE_CAP = 5
export const DISCOVERY_RAIL_CAP = 6

export const publishedWebtoons = (webtoons: Webtoon[]): Webtoon[] =>
  webtoons.filter((webtoon) => webtoon.status !== 'draft')

const byId = (a: Webtoon, b: Webtoon) => a.id.localeCompare(b.id)

const byViewCount = (a: Webtoon, b: Webtoon) => {
  const byViews = b.viewCount - a.viewCount
  if (byViews !== 0) return byViews
  return byId(a, b)
}

const dateValue = (iso: string) => new Date(iso).getTime()

export const spotlightSlides = (webtoons: Webtoon[], cap: number = HERO_SLIDE_CAP): Webtoon[] => {
  const live = publishedWebtoons(webtoons)
  const flagged = live.filter((webtoon) => webtoon.spotlight === true)
  if (flagged.length === 0) {
    return [...live].sort(byViewCount).slice(0, cap)
  }
  return [...flagged]
    .sort((a, b) => {
      const order = (a.spotlightOrder ?? 999) - (b.spotlightOrder ?? 999)
      if (order !== 0) return order
      return byId(a, b)
    })
    .slice(0, cap)
}

export const rankingWebtoons = (webtoons: Webtoon[], cap: number = DISCOVERY_RAIL_CAP): Webtoon[] =>
  [...publishedWebtoons(webtoons)].sort(byViewCount).slice(0, cap)

export const trendingWebtoons = (
  webtoons: Webtoon[],
  cap: number = DISCOVERY_RAIL_CAP
): Webtoon[] =>
  [...publishedWebtoons(webtoons)]
    .sort((a, b) => {
      const weekly = (b.weeklyViewCount ?? 0) - (a.weeklyViewCount ?? 0)
      if (weekly !== 0) return weekly
      return byViewCount(a, b)
    })
    .slice(0, cap)

export const newReleaseWebtoons = (
  webtoons: Webtoon[],
  cap: number = DISCOVERY_RAIL_CAP
): Webtoon[] =>
  [...publishedWebtoons(webtoons)]
    .sort((a, b) => {
      const byDate = dateValue(b.createdAt) - dateValue(a.createdAt)
      if (byDate !== 0) return byDate
      return byId(a, b)
    })
    .slice(0, cap)

export const updatedWebtoons = (
  webtoons: Webtoon[],
  cap: number = DISCOVERY_RAIL_CAP
): Webtoon[] => {
  const newIds = new Set(newReleaseWebtoons(webtoons, cap).map((webtoon) => webtoon.id))
  return [...publishedWebtoons(webtoons)]
    .sort((a, b) => {
      const byDate = dateValue(b.updatedAt) - dateValue(a.updatedAt)
      if (byDate !== 0) return byDate
      return byId(a, b)
    })
    .filter((webtoon) => !newIds.has(webtoon.id))
    .slice(0, cap)
}

export const startHereWebtoons = (
  webtoons: Webtoon[],
  episodes: Episode[],
  cap: number = DISCOVERY_RAIL_CAP
): Webtoon[] => {
  const heroIds = new Set(spotlightSlides(webtoons).map((webtoon) => webtoon.id))
  const freeFirstIds = new Set(
    episodes
      .filter(
        (episode) =>
          episode.episodeNumber === 1 && episode.status === 'published' && !episode.isPremium
      )
      .map((episode) => episode.webtoonId)
  )
  return [...publishedWebtoons(webtoons)]
    .filter((webtoon) => !heroIds.has(webtoon.id) && freeFirstIds.has(webtoon.id))
    .sort(byViewCount)
    .slice(0, cap)
}

const genreTokens = (webtoon: Webtoon): Set<string> =>
  new Set(webtoon.genres.map((genre) => genre.trim().toLowerCase()).filter(Boolean))

export interface ForYouInput {
  webtoons: Webtoon[]
  bookmarkIds: string[]
  likedIds: string[]
  history: { webtoonId: string }[]
  excludeIds: string[]
  cap?: number
}

export const forYouWebtoons = ({
  webtoons,
  bookmarkIds,
  likedIds,
  history,
  excludeIds,
  cap = DISCOVERY_RAIL_CAP,
}: ForYouInput): Webtoon[] => {
  const byWebtoonId = new Map(webtoons.map((webtoon) => [webtoon.id, webtoon]))
  const seen = new Set(excludeIds)
  const out: Webtoon[] = []

  const tryAdd = (id: string) => {
    if (out.length >= cap || seen.has(id)) return
    const webtoon = byWebtoonId.get(id)
    if (!webtoon || webtoon.status === 'draft') return
    seen.add(id)
    out.push(webtoon)
  }

  for (const id of bookmarkIds) tryAdd(id)
  for (const id of likedIds) tryAdd(id)
  for (const record of history) tryAdd(record.webtoonId)
  if (out.length >= cap) return out

  const seedTokens = new Set<string>()
  for (const id of [...bookmarkIds, ...likedIds, ...history.map((record) => record.webtoonId)]) {
    const seed = byWebtoonId.get(id)
    if (!seed) continue
    for (const token of genreTokens(seed)) seedTokens.add(token)
  }
  if (seedTokens.size === 0) return out

  const neighbors = publishedWebtoons(webtoons)
    .filter((webtoon) => webtoon.genres.some((genre) => seedTokens.has(genre.trim().toLowerCase())))
    .sort(byId)
  for (const webtoon of neighbors) tryAdd(webtoon.id)
  return out
}
