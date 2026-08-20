export const RANKING_PATH = '/ranking'
export const CATEGORIES_PATH = '/categories'

export type CatalogSort = 'browse' | 'popular' | 'new' | 'recentlyUpdated' | 'highestRated'

export interface BrowseLocation {
  pathname: string
  search: string
}

const catalogSlug = (pathname: string): string | undefined => {
  if (pathname === CATEGORIES_PATH) return undefined
  if (!pathname.startsWith(`${CATEGORIES_PATH}/`)) return undefined
  const slug = pathname.slice(`${CATEGORIES_PATH}/`.length).split('/')[0]
  return slug || undefined
}

const dropJunkPage = (params: URLSearchParams) => {
  const page = params.get('page')
  if (page === null) return
  if (page === '' || page === '1' || !/^[1-9]\d*$/.test(page)) {
    params.delete('page')
  }
}

const toSearch = (params: URLSearchParams): string => {
  const query = params.toString()
  return query ? `?${query}` : ''
}

const finish = (pathname: string, params: URLSearchParams): BrowseLocation => {
  dropJunkPage(params)
  return { pathname, search: toSearch(params) }
}

export const locationsEqual = (
  pathname: string,
  search: string,
  target: BrowseLocation
): boolean => {
  if (pathname !== target.pathname) return false
  const current = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const next = new URLSearchParams(
    target.search.startsWith('?') ? target.search.slice(1) : target.search
  )
  const keys = new Set([...current.keys(), ...next.keys()])
  for (const key of keys) {
    if (current.get(key) !== next.get(key)) return false
  }
  return true
}

export const canonicalizeBrowseLocation = (
  pathname: string,
  searchParams: URLSearchParams
): BrowseLocation => {
  const params = new URLSearchParams(searchParams)
  const queryGenre = params.get('genre')
  params.delete('genre')

  let slug = catalogSlug(pathname)
  if (slug === 'all') slug = undefined
  if (!slug && queryGenre && queryGenre !== 'all') slug = queryGenre

  if (pathname === RANKING_PATH) {
    params.delete('sort')
    if (slug) {
      params.set('sort', 'popular')
      return finish(`${CATEGORIES_PATH}/${slug}`, params)
    }
    return finish(RANKING_PATH, params)
  }

  if (pathname === CATEGORIES_PATH || pathname.startsWith(`${CATEGORIES_PATH}/`)) {
    const sort = params.get('sort')
    if (sort === 'popular' && !slug) {
      params.delete('sort')
      return finish(RANKING_PATH, params)
    }
    const nextPath = slug ? `${CATEGORIES_PATH}/${slug}` : CATEGORIES_PATH
    return finish(nextPath, params)
  }

  return finish(pathname, params)
}

export const catalogHref = (input: {
  sort: CatalogSort
  genreSlug?: string | null
  status?: string | null
  page?: number | null
}): string => {
  const slug = !input.genreSlug || input.genreSlug === 'all' ? undefined : input.genreSlug
  const params = new URLSearchParams()
  let pathname: string

  if (input.sort === 'popular') {
    if (!slug) {
      pathname = RANKING_PATH
    } else {
      pathname = `${CATEGORIES_PATH}/${slug}`
      params.set('sort', 'popular')
    }
  } else if (input.sort === 'browse') {
    pathname = slug ? `${CATEGORIES_PATH}/${slug}` : CATEGORIES_PATH
  } else {
    pathname = slug ? `${CATEGORIES_PATH}/${slug}` : CATEGORIES_PATH
    params.set('sort', input.sort)
  }

  if (input.status && input.status !== 'all') params.set('status', input.status)
  if (input.page && input.page > 1) params.set('page', String(input.page))

  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}
