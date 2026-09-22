import { describe, expect, it } from 'vitest'
import type { Webtoon } from '@softgate/shared'
import { heroBackdrop } from '../lib/images/heroBackdrop'

const slide = (over: Partial<Webtoon>): Webtoon => ({ id: '1', ...over }) as Webtoon

describe('hero backdrop', () => {
  it('prefers key art when the slide has it', () => {
    expect(heroBackdrop(slide({ keyArt: '/key/1.png', coverImage: '/c/1.png' }))).toEqual({
      kind: 'keyArt',
      src: '/key/1.png',
    })
  })

  it('falls back to the cover when there is no key art', () => {
    expect(heroBackdrop(slide({ coverImage: '/c/1.png' }))).toEqual({
      kind: 'cover',
      src: '/c/1.png',
    })
  })

  it('falls back to the banner when the slide has neither', () => {
    expect(heroBackdrop(slide({}))).toEqual({ kind: 'banner' })
  })

  it('falls back to the banner when there is no slide at all', () => {
    expect(heroBackdrop(undefined)).toEqual({ kind: 'banner' })
  })

  it('treats an empty string as absent rather than a usable src', () => {
    expect(heroBackdrop(slide({ keyArt: '', coverImage: '/c/1.png' }))).toEqual({
      kind: 'cover',
      src: '/c/1.png',
    })
  })
})
