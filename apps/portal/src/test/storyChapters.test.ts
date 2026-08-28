import { describe, it, expect } from 'vitest'
import { getPublishedStoryChapters } from '../lib/info/storyChapters'
import { mockStoryChapters } from '@softgate/shared'

describe('getPublishedStoryChapters', () => {
  it('returns six published chapters in sortOrder, dropping unpublished', () => {
    const published = getPublishedStoryChapters()
    expect(published).toHaveLength(6)
    expect(published.map((chapter) => chapter.id)).toEqual([
      'origin',
      'readers',
      'community',
      'what-ships',
      'demo',
      'next',
    ])
    expect(published.every((chapter) => chapter.published)).toBe(true)
    expect(mockStoryChapters.some((chapter) => chapter.id === 'unpublished-seed')).toBe(true)
    expect(published.some((chapter) => chapter.id === 'unpublished-seed')).toBe(false)
  })
})
