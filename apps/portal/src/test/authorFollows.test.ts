import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEY as FOLLOWS_KEY, isFollowing, listFollows, toggleFollow } from '../lib/follows'
import { STORAGE_KEY as LIBRARY_KEY, listBookmarks } from '../lib/library'

describe('author follows storage', () => {
  const store = new Map<string, string>()

  beforeEach(() => {
    store.clear()
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
          store.set(key, value)
        },
        removeItem: (key: string) => {
          store.delete(key)
        },
        clear: () => store.clear(),
        length: 0,
        key: () => null,
      },
    })
  })

  it('toggles follow on and off for a user', () => {
    expect(isFollowing('1', 'a1')).toBe(false)
    toggleFollow('1', 'a1')
    expect(isFollowing('1', 'a1')).toBe(true)
    expect(listFollows('1').map((row) => row.authorId)).toEqual(['a1'])
    toggleFollow('1', 'a1')
    expect(isFollowing('1', 'a1')).toBe(false)
    expect(listFollows('1')).toEqual([])
  })

  it('namespaces follows per user id', () => {
    toggleFollow('1', 'a1')
    toggleFollow('2', 'a2')
    expect(listFollows('1').map((row) => row.authorId)).toEqual(['a1'])
    expect(listFollows('2').map((row) => row.authorId)).toEqual(['a2'])
  })

  it('does not write the Library subscribe store', () => {
    toggleFollow('1', 'a1')
    expect(store.has(FOLLOWS_KEY)).toBe(true)
    expect(store.has(LIBRARY_KEY)).toBe(false)
    expect(listBookmarks('1')).toEqual([])
  })
})
