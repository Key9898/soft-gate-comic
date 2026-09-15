import { describe, expect, it } from 'vitest'
import { mockWebtoons } from '@softgate/shared'
import type { Webtoon } from '@softgate/shared'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { ogImageForWebtoon, hasGeneratedOgImage } from '../lib/seo/ogImage'

describe('ogImageForWebtoon', () => {
  it('maps local covers to the generated 1200x630 OG image', () => {
    const webtoon = mockWebtoons.find((entry) => entry.coverImage?.startsWith('/webtoon-covers/'))
    expect(webtoon).toBeDefined()
    expect(ogImageForWebtoon(webtoon as Webtoon)).toBe(
      `https://softgatecomic.com/og/${(webtoon as Webtoon).id}.png`
    )
  })

  it('falls back to the absolute cover URL for non-local covers', () => {
    const base = mockWebtoons[0]
    const webtoon = { ...base, coverImage: '/uploads/custom-cover.png' } as Webtoon
    expect(ogImageForWebtoon(webtoon)).toBe('https://softgatecomic.com/uploads/custom-cover.png')
  })

  it('returns undefined when there is no cover', () => {
    const base = mockWebtoons[0]
    const webtoon = { ...base, coverImage: undefined } as Webtoon
    expect(ogImageForWebtoon(webtoon)).toBeUndefined()
  })

  // A draft with a local cover used to satisfy the page's condition while
  // failing the generator's, so the page advertised an og:image that was never
  // produced. Every share of that series would have resolved to a 404.
  it('does not advertise a generated image for a draft', () => {
    const draft = { ...mockWebtoons[0], status: 'draft' } as Webtoon
    expect(hasGeneratedOgImage(draft)).toBe(false)
    expect(ogImageForWebtoon(draft)).not.toContain('/og/')
  })
})

describe('OG images exist for every series that advertises one', () => {
  const ogDir = path.resolve(__dirname, '../../public/og')

  it('agrees with the generator about which series get an image', () => {
    for (const webtoon of mockWebtoons) {
      const url = ogImageForWebtoon(webtoon)
      const advertises = Boolean(url?.includes('/og/'))
      expect(advertises, `${webtoon.title.en} disagrees with hasGeneratedOgImage`).toBe(
        hasGeneratedOgImage(webtoon)
      )
    }
  })

  // Build output, so absent means "not generated yet" on a fresh clone — the
  // same caveat as the cover variants.
  it('has a file for every advertised image, once built', () => {
    if (!existsSync(ogDir)) return
    for (const webtoon of mockWebtoons.filter(hasGeneratedOgImage)) {
      const file = path.join(ogDir, `${webtoon.id}.png`)
      expect(existsSync(file), `missing og/${webtoon.id}.png for ${webtoon.title.en}`).toBe(true)
    }
  })
})
