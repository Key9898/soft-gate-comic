import { describe, expect, it } from 'vitest'
import { canonicalizeBrowseLocation, catalogHref, locationsEqual } from '../lib/catalog/browseUrls'

const run = (path: string, search = '') =>
  canonicalizeBrowseLocation(
    path,
    new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  )

describe('canonicalizeBrowseLocation', () => {
  it('moves /categories/all to /categories', () => {
    expect(run('/categories/all')).toEqual({ pathname: '/categories', search: '' })
  })

  it('drops ?genre=all', () => {
    expect(run('/categories', 'genre=all')).toEqual({ pathname: '/categories', search: '' })
  })

  it('moves ?genre=action onto the path and drops the query', () => {
    expect(run('/categories', 'genre=action')).toEqual({
      pathname: '/categories/action',
      search: '',
    })
  })

  it('keeps status when moving a genre query to the path', () => {
    expect(run('/categories', 'genre=action&status=ongoing')).toEqual({
      pathname: '/categories/action',
      search: '?status=ongoing',
    })
  })

  it('sends all-genre sort=popular to /ranking and drops sort', () => {
    expect(run('/categories', 'sort=popular')).toEqual({ pathname: '/ranking', search: '' })
  })

  it('keeps status when sending all-genre popular to /ranking', () => {
    expect(run('/categories', 'sort=popular&status=ongoing')).toEqual({
      pathname: '/ranking',
      search: '?status=ongoing',
    })
  })

  it('does not send a genre popular chart to /ranking', () => {
    expect(run('/categories/action', 'sort=popular')).toEqual({
      pathname: '/categories/action',
      search: '?sort=popular',
    })
  })

  it('turns ?genre=action&sort=popular into a genre chart, not /ranking', () => {
    expect(run('/categories', 'genre=action&sort=popular')).toEqual({
      pathname: '/categories/action',
      search: '?sort=popular',
    })
  })

  it('never leaves sort=popular on /ranking', () => {
    expect(run('/ranking', 'sort=popular')).toEqual({ pathname: '/ranking', search: '' })
  })

  it('does not bounce /ranking back to ?sort=popular', () => {
    const target = run('/ranking')
    expect(target).toEqual({ pathname: '/ranking', search: '' })
    expect(run(target.pathname, target.search)).toEqual(target)
  })

  it('does not loop all-genre popular through /ranking', () => {
    const toRanking = run('/categories', 'sort=popular')
    expect(toRanking).toEqual({ pathname: '/ranking', search: '' })
    expect(run(toRanking.pathname, toRanking.search)).toEqual(toRanking)
  })

  it('moves /ranking?genre=action to the genre popular chart', () => {
    expect(run('/ranking', 'genre=action')).toEqual({
      pathname: '/categories/action',
      search: '?sort=popular',
    })
  })

  it('strips a conflicting sort on /ranking', () => {
    expect(run('/ranking', 'sort=new')).toEqual({ pathname: '/ranking', search: '' })
  })

  it('drops page=1, empty page, and non-numeric page', () => {
    expect(run('/categories', 'page=1')).toEqual({ pathname: '/categories', search: '' })
    expect(run('/categories', 'page=')).toEqual({ pathname: '/categories', search: '' })
    expect(run('/categories', 'page=abc')).toEqual({ pathname: '/categories', search: '' })
  })

  it('leaves page=99 for the pager pass', () => {
    expect(run('/ranking', 'page=99')).toEqual({ pathname: '/ranking', search: '?page=99' })
  })

  it('sends /categories/all?sort=popular to /ranking', () => {
    expect(run('/categories/all', 'sort=popular')).toEqual({ pathname: '/ranking', search: '' })
  })
})

describe('locationsEqual', () => {
  it('treats matching canonical locations as equal', () => {
    expect(locationsEqual('/ranking', '', { pathname: '/ranking', search: '' })).toBe(true)
    expect(
      locationsEqual('/categories', '?sort=new', { pathname: '/categories', search: '?sort=new' })
    ).toBe(true)
  })

  it('treats a leftover sort on /ranking as not equal', () => {
    expect(locationsEqual('/ranking', '?sort=popular', { pathname: '/ranking', search: '' })).toBe(
      false
    )
  })
})

describe('catalogHref', () => {
  it('uses /ranking for all-genre popular', () => {
    expect(catalogHref({ sort: 'popular' })).toBe('/ranking')
    expect(catalogHref({ sort: 'popular', genreSlug: 'all' })).toBe('/ranking')
  })

  it('keeps genre popular on the categories path', () => {
    expect(catalogHref({ sort: 'popular', genreSlug: 'action' })).toBe(
      '/categories/action?sort=popular'
    )
  })

  it('builds browse, new, and status URLs', () => {
    expect(catalogHref({ sort: 'browse' })).toBe('/categories')
    expect(catalogHref({ sort: 'browse', genreSlug: 'action' })).toBe('/categories/action')
    expect(catalogHref({ sort: 'new' })).toBe('/categories?sort=new')
    expect(catalogHref({ sort: 'new', genreSlug: 'action' })).toBe('/categories/action?sort=new')
    expect(catalogHref({ sort: 'popular', status: 'ongoing' })).toBe('/ranking?status=ongoing')
  })
})
