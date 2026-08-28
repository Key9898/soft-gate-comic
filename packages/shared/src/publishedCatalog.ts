import type { Author, CoinPackage, Episode, Genre, SharedData, Webtoon } from './types'
import { getSharedData } from './data'

export type PublishedCatalog = {
  authors: Author[]
  genres: Genre[]
  webtoons: Webtoon[]
  episodes: Episode[]
  coinPackages?: CoinPackage[]
}

export { getSharedData }
export type { WaitForFreeEpisode } from './waitForFree'
export { hasWaitSchedule, isEpisodeLocked, isWaitFreeNow, parseFreeAt } from './waitForFree'

export const publishedCatalogFrom = (
  data: Pick<SharedData, 'authors' | 'genres' | 'webtoons' | 'episodes' | 'coinPackages'>
): PublishedCatalog => {
  const webtoons = data.webtoons.filter((webtoon) => webtoon.status !== 'draft')
  const webtoonIds = new Set(webtoons.map((webtoon) => webtoon.id))
  const episodes = data.episodes.filter(
    (episode) => episode.status !== 'draft' && webtoonIds.has(episode.webtoonId)
  )
  const authorIds = new Set(webtoons.map((webtoon) => webtoon.author.id))
  const authors = data.authors.filter((author) => authorIds.has(author.id))
  const catalog: PublishedCatalog = {
    authors,
    genres: data.genres,
    webtoons,
    episodes,
  }
  if (data.coinPackages !== undefined) {
    catalog.coinPackages = data.coinPackages
  }
  return catalog
}
