export const PAGE_SIZE = 24
export const RANK_CHART_CAP = 100

export const parsePage = (searchParams: URLSearchParams): number => {
  const raw = searchParams.get('page')
  if (!raw || !/^[1-9]\d*$/.test(raw)) return 1
  return Number(raw)
}

export const showPager = (total: number, pageSize: number = PAGE_SIZE): boolean => total > pageSize

export const pageCount = (total: number, pageSize: number = PAGE_SIZE): number => {
  if (total <= 0) return 1
  return Math.ceil(total / pageSize)
}

export const clampPage = (page: number, total: number, pageSize: number = PAGE_SIZE): number => {
  const pages = pageCount(total, pageSize)
  if (page < 1) return 1
  if (page > pages) return pages
  return page
}

export const pageSlice = <T>(items: T[], page: number, pageSize: number = PAGE_SIZE): T[] => {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export const rankOnPage = (page: number, index: number, pageSize: number = PAGE_SIZE): number =>
  (page - 1) * pageSize + index + 1

export const capRankingList = <T>(items: T[], cap: number = RANK_CHART_CAP): T[] =>
  items.slice(0, cap)
