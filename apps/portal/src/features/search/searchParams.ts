import type { WebtoonSortBy } from '../../lib/search'

export type SearchTab = 'webtoons' | 'authors' | 'episodes'
export type StatusFilter = 'all' | 'ongoing' | 'completed' | 'hiatus'

export const SEARCH_DEFAULT_SORT: WebtoonSortBy = 'popular'

export const SEARCH_TABS: readonly SearchTab[] = ['webtoons', 'authors', 'episodes']

const STATUS_FILTERS: readonly StatusFilter[] = ['all', 'ongoing', 'completed', 'hiatus']
const SORTS: readonly WebtoonSortBy[] = ['latest', 'popular', 'rating', 'title']

export function parseSearchQuery(params: URLSearchParams): string {
  return params.get('q') || ''
}

export function parseSearchTab(params: URLSearchParams): SearchTab {
  const tab = params.get('tab')
  return SEARCH_TABS.includes(tab as SearchTab) ? (tab as SearchTab) : 'webtoons'
}

export function parseSearchStatus(params: URLSearchParams): StatusFilter {
  const status = params.get('status')
  return STATUS_FILTERS.includes(status as StatusFilter) ? (status as StatusFilter) : 'all'
}

export function parseSearchGenre(params: URLSearchParams): string {
  return params.get('genre') || ''
}

export function parseSearchSort(params: URLSearchParams): WebtoonSortBy {
  const sort = params.get('sort')
  return SORTS.includes(sort as WebtoonSortBy) ? (sort as WebtoonSortBy) : SEARCH_DEFAULT_SORT
}

export function applySearchTab(params: URLSearchParams, next: SearchTab): void {
  if (next === 'webtoons') params.delete('tab')
  else params.set('tab', next)
}

export function applySearchStatus(params: URLSearchParams, next: StatusFilter): void {
  if (next === 'all') params.delete('status')
  else params.set('status', next)
}

export function applySearchGenre(params: URLSearchParams, next: string): void {
  if (!next) params.delete('genre')
  else params.set('genre', next)
}

export function applySearchSort(params: URLSearchParams, next: WebtoonSortBy): void {
  if (next === SEARCH_DEFAULT_SORT) params.delete('sort')
  else params.set('sort', next)
}
