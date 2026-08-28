import { describe, expect, it } from 'vitest'
import { mockWebtoons } from '@softgate/shared'
import type { Webtoon } from '@softgate/shared'
import { ogImageForWebtoon } from '../lib/seo/ogImage'

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
})
