import { describe, expect, it } from 'vitest'
import { readerMidAdAfterIndex } from '../lib/reader'

describe('readerMidAdAfterIndex', () => {
  it('returns null below six panels', () => {
    expect(readerMidAdAfterIndex(0)).toBeNull()
    expect(readerMidAdAfterIndex(4)).toBeNull()
    expect(readerMidAdAfterIndex(5)).toBeNull()
  })

  it('inserts after the middle panel at six and above', () => {
    expect(readerMidAdAfterIndex(6)).toBe(2)
    expect(readerMidAdAfterIndex(7)).toBe(2)
    expect(readerMidAdAfterIndex(8)).toBe(3)
  })
})
