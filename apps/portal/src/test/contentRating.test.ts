import { beforeEach, describe, expect, it } from 'vitest'
import type { ContentRating } from '@softgate/shared'
import {
  AGE_CONFIRM_SESSION_KEY,
  AGE_CONFIRM_STORAGE_KEY,
  confirmAge,
  contentRatingLabelKey,
  contentRatingSchemaText,
  hasAgeConfirm,
  isMature18,
  promoteSessionAgeConfirm,
  requiresAgeConfirm,
} from '../lib/contentRating'

function installStorage() {
  const local = new Map<string, string>()
  const session = new Map<string, string>()
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => local.get(key) ?? null,
      setItem: (key: string, value: string) => {
        local.set(key, value)
      },
      removeItem: (key: string) => {
        local.delete(key)
      },
      clear: () => local.clear(),
      length: 0,
      key: () => null,
    },
  })
  Object.defineProperty(window, 'sessionStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => session.get(key) ?? null,
      setItem: (key: string, value: string) => {
        session.set(key, value)
      },
      removeItem: (key: string) => {
        session.delete(key)
      },
      clear: () => session.clear(),
      length: 0,
      key: () => null,
    },
  })
}

describe('content rating helpers', () => {
  it('treats only 18 as a read gate', () => {
    expect(isMature18('18')).toBe(true)
    expect(isMature18('16')).toBe(false)
    expect(requiresAgeConfirm({ contentRating: '18' })).toBe(true)
    expect(requiresAgeConfirm({ contentRating: '13' as ContentRating })).toBe(false)
    expect(contentRatingLabelKey('all')).toBe('contentRating.all')
    expect(contentRatingSchemaText('all')).toBe('All Ages')
    expect(contentRatingSchemaText('18')).toBe('18+')
  })
})

describe('age confirm storage', () => {
  beforeEach(() => {
    installStorage()
  })

  it('stores guest confirm in session storage only', () => {
    expect(hasAgeConfirm(null)).toBe(false)
    confirmAge(null)
    expect(window.sessionStorage.getItem(AGE_CONFIRM_SESSION_KEY)).toBe('1')
    expect(window.localStorage.getItem(AGE_CONFIRM_STORAGE_KEY)).toBeNull()
    expect(hasAgeConfirm(null)).toBe(true)
    window.sessionStorage.clear()
    expect(hasAgeConfirm(null)).toBe(false)
  })

  it('stores signed-in confirm per account and keeps it after logout session remains', () => {
    confirmAge('u1')
    expect(hasAgeConfirm('u1')).toBe(true)
    expect(hasAgeConfirm(null)).toBe(false)
    expect(hasAgeConfirm('u2')).toBe(false)
  })

  it('promotes a guest session confirm onto the account at login', () => {
    confirmAge(null)
    promoteSessionAgeConfirm('u1')
    expect(hasAgeConfirm('u1')).toBe(true)
    expect(hasAgeConfirm(null)).toBe(true)
  })
})
