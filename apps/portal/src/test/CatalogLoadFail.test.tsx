import { afterEach, describe, expect, it, vi } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import CatalogStatus from '../components/CatalogStatus/CatalogStatus'
import CategoriesPage from '../features/categories/CategoriesPage'
import HomePage from '../features/home/HomePage'
import SearchPage from '../features/search/SearchPage'
import { render, screen } from './utils'

const jsonRes = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

function stubCatalogHttpFail() {
  vi.stubEnv('VITE_USE_MOCK_API', 'false')
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('/api/catalog')) {
        return jsonRes(404, { error: { code: 'NOT_FOUND' } })
      }
      if (url.includes('/api/settings')) {
        return jsonRes(200, { data: {} })
      }
      return jsonRes(401, { error: { code: 'UNAUTHENTICATED' } })
    })
  )
}

const FAIL_DECK = /titles cannot show until the catalog request succeeds/i

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('catalog HTTP load-fail chrome', () => {
  it('keeps Home live chrome with fail copy, not unpublished or skeleton', async () => {
    stubCatalogHttpFail()
    render(
      <>
        <CatalogStatus />
        <HomePage />
      </>
    )

    expect((await screen.findAllByText(FAIL_DECK, {}, { timeout: 8000 })).length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: /^popular$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /start here/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^daily$/i })).toBeInTheDocument()
    expect(
      screen.queryByText(/published series will appear here when softgate comic adds titles/i)
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /help center/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /help center/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /publish with us/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /publish with us/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(/the catalog request failed/i)
    expect(screen.getByRole('alert').textContent?.toLowerCase()).not.toMatch(/cached|demo/)
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  }, 15000)

  it('keeps Categories masthead and uses fail copy instead of catalog-empty', async () => {
    stubCatalogHttpFail()
    window.history.pushState({}, '', '/categories')
    render(
      <Routes>
        <Route path="/categories" element={<CategoriesPage />} />
      </Routes>
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Browse by Genre' }, { timeout: 8000 })
    ).toBeInTheDocument()
    expect((await screen.findAllByText(FAIL_DECK)).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /all statuses/i })).toBeInTheDocument()
    expect(screen.queryByText(/no published series in the library yet/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/matching your criteria/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /help center/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /go here/i })).not.toBeInTheDocument()
  }, 15000)

  it('keeps Search Popular and New headings with fail copy, not Help/Creators', async () => {
    stubCatalogHttpFail()
    window.history.pushState({}, '', '/search')
    render(
      <Routes>
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Search' }, { timeout: 8000 })
    ).toBeInTheDocument()
    expect((await screen.findAllByText(FAIL_DECK)).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('heading', { name: 'Popular' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('heading', { name: 'New Releases' }).length).toBeGreaterThan(0)
    expect(
      screen.queryByText(/there are no published series to search yet/i)
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /help center/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /publish with us/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /go here/i })).not.toBeInTheDocument()
  }, 15000)
})
