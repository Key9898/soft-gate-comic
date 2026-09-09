import { describe, expect, it, beforeEach } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { render, screen } from './utils'
import SearchPage from '../features/search/SearchPage'

const store = new Map<string, string>()

const EMPTY_SHARED_DATA = JSON.stringify({
  schemaVersion: 14,
  data: {
    webtoons: [],
    episodes: [],
    users: [],
    comments: [],
    authors: [],
    genres: [],
  },
})

function installStorage() {
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
}

function renderSearch(path = '/search') {
  window.history.pushState({}, '', path)
  return render(
    <Routes>
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  )
}

describe('Search destination', () => {
  beforeEach(() => {
    installStorage()
  })

  it('shows a visible h1, browse genres, popular and new rails, and recovery', async () => {
    renderSearch()
    expect(await screen.findByRole('heading', { level: 1, name: 'Search' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Browse genres' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Demo searches' })).toBeInTheDocument()
    expect(
      screen.getByText('Example queries for this Demo catalog — not live trends.')
    ).toBeInTheDocument()
    expect(screen.queryByText('Trending Searches')).not.toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: 'Popular' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('heading', { name: 'New Releases' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /^categories$/i })).toHaveAttribute(
      'href',
      '/categories'
    )
    expect(screen.getByRole('link', { name: /^popular$/i })).toHaveAttribute('href', '/ranking')
    expect(screen.getByRole('link', { name: /^new releases$/i })).toHaveAttribute(
      'href',
      '/categories?sort=new'
    )
  })

  it('clears recent searches', async () => {
    const user = userEvent.setup()
    store.set('softgate_recent_searches', JSON.stringify(['Forest']))
    renderSearch()
    expect(await screen.findByRole('button', { name: 'Forest' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.queryByRole('button', { name: 'Forest' })).not.toBeInTheDocument()
    expect(store.get('softgate_recent_searches')).toBeUndefined()
  })

  it('links author hits to author profiles', async () => {
    renderSearch('/search?q=Ko&tab=authors')
    const hit = await screen.findByRole('link', { name: /ko zaw/i })
    expect(hit).toHaveAttribute('href', '/author/1')
  })

  it('hides webtoon filters on the authors tab', async () => {
    const user = userEvent.setup()
    renderSearch('/search?q=Ko')
    expect(await screen.findByRole('button', { name: /authors/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All statuses' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /authors/i }))
    expect(screen.queryByRole('button', { name: 'All statuses' })).not.toBeInTheDocument()
  })

  it('shows recovery destinations when there are no results', async () => {
    renderSearch('/search?q=zzzznotatitle')
    expect(await screen.findByText('No results found')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^categories$/i })).toHaveAttribute(
      'href',
      '/categories'
    )
    expect(screen.getByRole('link', { name: /^popular$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^new releases$/i })).toBeInTheDocument()
  })

  it('renders an image on episode hits', async () => {
    renderSearch('/search?q=Beginning&tab=episodes')
    const hit = await screen.findByRole('link', { name: /ep\.\s*1/i })
    expect(hit).toHaveAttribute('href', '/read/1/1')
    expect(hit.querySelector('img')).not.toBeNull()
  })

  it('runs a Demo search chip and does not label it as live trending', async () => {
    const user = userEvent.setup()
    renderSearch()
    expect(await screen.findByRole('heading', { name: 'Demo searches' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Horizon' }))
    expect(await screen.findByText(/results for "horizon"/i)).toBeInTheDocument()
    expect(window.location.search).toContain('q=Horizon')
    expect(screen.queryByRole('heading', { name: 'Demo searches' })).not.toBeInTheDocument()
    expect(screen.queryByText('Trending Searches')).not.toBeInTheDocument()
  })

  it('keeps Popular and New headings with catalog-empty chrome when there are no titles', async () => {
    store.set('softgate-shared-data', EMPTY_SHARED_DATA)
    renderSearch()
    expect(await screen.findByRole('heading', { level: 1, name: 'Search' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Browse genres' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Demo searches' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: 'Popular' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('heading', { name: 'New Releases' }).length).toBeGreaterThan(0)
    expect(
      await screen.findByText(/there are no published series to search yet/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /help center/i })).toHaveAttribute('href', '/help')
    expect(screen.getByRole('link', { name: /publish with us/i })).toHaveAttribute(
      'href',
      '/creators'
    )
    expect(screen.queryByRole('heading', { name: /go here/i })).not.toBeInTheDocument()
  })
})
