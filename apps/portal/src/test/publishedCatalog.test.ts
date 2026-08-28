import { describe, expect, it } from 'vitest'
import {
  applyCatalogSeed,
  getSharedData,
  publishedCatalogFrom,
  type SharedData,
} from '@softgate/shared'

describe('publishedCatalogFrom', () => {
  const catalog = publishedCatalogFrom(getSharedData())

  it('drops draft episodes', () => {
    expect(catalog.episodes.some((episode) => episode.id === 'draft-1-99')).toBe(false)
    expect(catalog.episodes.every((episode) => episode.status !== 'draft')).toBe(true)
  })

  it('keeps scheduled episodes for daily drops', () => {
    expect(catalog.episodes.some((episode) => episode.status === 'scheduled')).toBe(true)
  })

  it('keeps premium published episodes with images and freeAt', () => {
    const premium = catalog.episodes.find(
      (episode) =>
        episode.isPremium &&
        episode.status === 'published' &&
        Boolean(episode.freeAt) &&
        episode.images.length > 0
    )
    expect(premium).toBeDefined()
    expect(premium!.images.length).toBeGreaterThan(0)
    expect(premium!.freeAt).toBeDefined()
  })

  it('passes through coinPackages when present', () => {
    const packs = [{ id: '9', coins: 77, price: 900 }]
    const stored: Pick<
      SharedData,
      'authors' | 'genres' | 'webtoons' | 'episodes' | 'coinPackages'
    > = {
      authors: catalog.authors,
      genres: catalog.genres,
      webtoons: catalog.webtoons,
      episodes: catalog.episodes,
      coinPackages: packs,
    }
    expect(publishedCatalogFrom(stored).coinPackages).toEqual(packs)
  })
})

describe('applyCatalogSeed identity after published catalog helper', () => {
  it('still returns the stored catalog unchanged', () => {
    const stored = getSharedData()
    expect(applyCatalogSeed(stored)).toBe(stored)
  })
})
