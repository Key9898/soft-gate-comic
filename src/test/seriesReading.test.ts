import { describe, expect, it } from 'vitest'
import type { Episode } from '@softgate/shared'
import {
  episodeThumbSrc,
  isPublishedEpisode,
  latestPublishedEpisode,
  publishedEpisodesForSeries,
  seriesPrimaryRead,
} from '../lib/catalog'

const episode = (
  partial: Partial<Episode> & Pick<Episode, 'id' | 'webtoonId' | 'episodeNumber' | 'status'>
): Episode => ({
  webtoonTitle: { mm: '', en: '' },
  title: { mm: '', en: '' },
  images: [],
  isPremium: false,
  coinPrice: 0,
  viewCount: 0,
  likeCount: 0,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
  ...partial,
})

const catalog: Episode[] = [
  episode({ id: 'a', webtoonId: '1', episodeNumber: 1, status: 'published', images: ['/a.png'] }),
  episode({ id: 'b', webtoonId: '1', episodeNumber: 3, status: 'published' }),
  episode({ id: 'c', webtoonId: '1', episodeNumber: 2, status: 'draft' }),
  episode({ id: 'd', webtoonId: '2', episodeNumber: 9, status: 'published' }),
]

describe('seriesReading', () => {
  it('lists only published episodes for a series', () => {
    const published = publishedEpisodesForSeries(catalog, '1')
    expect(published.map((item) => item.id)).toEqual(['a', 'b'])
  })

  it('picks the highest published episode number', () => {
    expect(latestPublishedEpisode(catalog, '1')?.episodeNumber).toBe(3)
    expect(latestPublishedEpisode(catalog, 'missing')).toBeUndefined()
  })

  it('uses the first strip then the series cover for thumbs', () => {
    expect(episodeThumbSrc(catalog[0], '/cover.png')).toBe('/a.png')
    expect(episodeThumbSrc(catalog[1], '/cover.png')).toBe('/cover.png')
    expect(episodeThumbSrc(catalog[1])).toBeUndefined()
  })

  it('treats only published episodes as readable', () => {
    expect(isPublishedEpisode(catalog[0])).toBe(true)
    expect(isPublishedEpisode(catalog[2])).toBe(false)
  })

  it('starts guests and completed readers at episode 1', () => {
    expect(seriesPrimaryRead(undefined, 3)).toEqual({ kind: 'start', episodeNumber: 1 })
    expect(
      seriesPrimaryRead(
        {
          webtoonId: '1',
          episodeNumber: 3,
          lastReadAt: '2026-08-01T00:00:00.000Z',
          scrollRatio: 0.99,
        },
        3
      )
    ).toEqual({ kind: 'start', episodeNumber: 1 })
  })

  it('continues at the last opened episode when the series is incomplete', () => {
    expect(
      seriesPrimaryRead(
        {
          webtoonId: '1',
          episodeNumber: 2,
          lastReadAt: '2026-08-01T00:00:00.000Z',
          scrollRatio: 0.4,
        },
        5
      )
    ).toEqual({ kind: 'continue', episodeNumber: 2 })
  })
})
