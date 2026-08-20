import { describe, expect, it } from 'vitest'
import {
  PAGE_SIZE,
  RANK_CHART_CAP,
  capRankingList,
  clampPage,
  pageCount,
  pageSlice,
  parsePage,
  rankOnPage,
  showPager,
} from '../lib/catalog/pagination'

const ids = (count: number) => Array.from({ length: count }, (_, index) => `w-${index + 1}`)

describe('catalog pagination', () => {
  it('hides the pager at 9 and 24 titles', () => {
    expect(showPager(9)).toBe(false)
    expect(showPager(PAGE_SIZE)).toBe(false)
    expect(showPager(25)).toBe(true)
  })

  it('slices page 2 of a 25-item list', () => {
    const list = ids(25)
    expect(pageSlice(list, 1)).toHaveLength(24)
    expect(pageSlice(list, 2)).toEqual(['w-25'])
    expect(rankOnPage(2, 0)).toBe(25)
  })

  it('caps ranking at 100 before paging', () => {
    const list = ids(120)
    const capped = capRankingList(list)
    expect(capped).toHaveLength(RANK_CHART_CAP)
    expect(pageCount(capped.length)).toBe(5)
    expect(pageSlice(capped, 5)).toHaveLength(4)
    expect(rankOnPage(5, 3)).toBe(100)
  })

  it('clamps page=99 down to the last page', () => {
    expect(clampPage(99, 9)).toBe(1)
    expect(clampPage(99, 25)).toBe(2)
    expect(parsePage(new URLSearchParams('page=99'))).toBe(99)
    expect(parsePage(new URLSearchParams('page=1'))).toBe(1)
    expect(parsePage(new URLSearchParams())).toBe(1)
  })
})
