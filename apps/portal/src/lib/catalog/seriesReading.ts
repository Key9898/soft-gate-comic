import type { Episode } from '@softgate/shared'
import { isSeriesCompleteForContinue, type HistoryRecord } from '../engagement'

export function publishedEpisodesForSeries(episodes: Episode[], webtoonId: string): Episode[] {
  return episodes.filter(
    (episode) => episode.webtoonId === webtoonId && episode.status === 'published'
  )
}

export function latestPublishedEpisode(
  episodes: Episode[],
  webtoonId: string
): Episode | undefined {
  const published = publishedEpisodesForSeries(episodes, webtoonId)
  if (published.length === 0) return undefined
  return published.reduce((latest, episode) =>
    episode.episodeNumber > latest.episodeNumber ? episode : latest
  )
}

export function episodeThumbSrc(
  episode: Pick<Episode, 'images'>,
  seriesCover?: string
): string | undefined {
  const first = episode.images[0]
  if (first) return first
  return seriesCover
}

export function panelPixelSize(
  imagesLength: number,
  imageSizes: Episode['imageSizes'],
  index: number
): { width: number; height: number } | undefined {
  if (!imageSizes || imageSizes.length !== imagesLength) return undefined
  if (index < 0 || index >= imagesLength) return undefined
  const slot = imageSizes[index]
  if (!slot) return undefined
  const { width, height } = slot
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return undefined
  }
  return { width, height }
}

export function isPublishedEpisode(episode: Pick<Episode, 'status'>): boolean {
  return episode.status === 'published'
}

export type SeriesPrimaryRead = {
  kind: 'continue' | 'start'
  episodeNumber: number
}

export function seriesPrimaryRead(
  historyRecord: HistoryRecord | undefined,
  publishedCount: number
): SeriesPrimaryRead {
  if (!historyRecord) {
    return { kind: 'start', episodeNumber: 1 }
  }
  if (
    isSeriesCompleteForContinue(
      historyRecord.episodeNumber,
      publishedCount,
      historyRecord.scrollRatio ?? 0
    )
  ) {
    return { kind: 'start', episodeNumber: 1 }
  }
  return { kind: 'continue', episodeNumber: historyRecord.episodeNumber }
}
