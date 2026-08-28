import { beforeEach, describe, expect, it } from 'vitest'
import { addComment, episodeCommentKey, listComments, seriesCommentKey } from '../lib/comments'

const memory = new Map<string, string>()

const commentUser = {
  id: 'u1',
  username: 'tester',
  displayName: 'Tester',
}

describe('comment keys', () => {
  beforeEach(() => {
    memory.clear()
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => memory.get(key) ?? null,
        setItem: (key: string, value: string) => {
          memory.set(key, value)
        },
        removeItem: (key: string) => {
          memory.delete(key)
        },
        clear: () => memory.clear(),
        length: 0,
        key: () => null,
      },
    })
  })

  it('keeps series keys distinct from episode keys', () => {
    expect(seriesCommentKey('7')).toBe('7:series')
    expect(seriesCommentKey('7')).not.toBe(episodeCommentKey('7', 1))
    expect(seriesCommentKey('')).toBe('')
  })

  it('does not mix series posts with episode threads', () => {
    addComment(seriesCommentKey('1'), commentUser, 'Hub only')
    addComment(episodeCommentKey('1', 1), commentUser, 'Episode only')
    expect(listComments(seriesCommentKey('1')).map((c) => c.content)).toEqual(['Hub only'])
    expect(listComments(episodeCommentKey('1', 1)).map((c) => c.content)).toEqual(['Episode only'])
  })
})
