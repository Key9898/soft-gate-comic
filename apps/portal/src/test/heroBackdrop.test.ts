import { describe, expect, it } from 'vitest'
import type { Webtoon } from '@softgate/shared'
import { heroBackdrop } from '../lib/images/heroBackdrop'

const slide = (over: Partial<Webtoon>): Webtoon => ({
  id: '1',
  title: { mm: 'Test Webtoon', en: 'Test Webtoon' },
  description: { mm: 'Test description', en: 'Test description' },
  coverColor: 'bg-gradient-to-br from-blue-400 to-blue-600',
  author: {
    id: '1',
    name: { mm: 'Test Author', en: 'Test Author' },
    followerCount: 1000,
    webtoonCount: 1,
  },
  genres: ['action'],
  tags: ['test'],
  status: 'ongoing',
  isPremium: false,
  viewCount: 1000,
  likeCount: 100,
  episodeCount: 1,
  rating: 4.5,
  contentRating: '13',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
  ...over,
})

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
