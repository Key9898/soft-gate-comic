import { describe, expect, it } from 'vitest'
import { safeReturnTo } from '../lib/auth/safeReturnTo'

describe('safeReturnTo', () => {
  it('allows same-origin relative paths including Start here reader urls', () => {
    expect(safeReturnTo({ pathname: '/read/wt-1/1', search: '' })).toBe('/read/wt-1/1')
    expect(safeReturnTo({ pathname: '/webtoon/wt-1', search: '?tab=1' })).toBe(
      '/webtoon/wt-1?tab=1'
    )
  })

  it('rejects protocol-relative and absolute urls', () => {
    expect(safeReturnTo({ pathname: '//evil.example', search: '' })).toBe('/')
    expect(safeReturnTo({ pathname: 'https://evil.example', search: '' })).toBe('/')
    expect(safeReturnTo({ pathname: '/\\evil', search: '' })).toBe('/')
  })

  it('falls back to home when from is missing', () => {
    expect(safeReturnTo(undefined)).toBe('/')
    expect(safeReturnTo(null)).toBe('/')
    expect(safeReturnTo({ pathname: '', search: '' })).toBe('/')
  })
})
