import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { fireEvent, render, screen } from '@testing-library/react'
import { mockGenres, mockWebtoons } from '@softgate/shared'
import { CatalogBookCard } from '../components/BookCard'
import { SeriesRatingControl } from '../components/SeriesRating'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { EngagementProvider } from '../context/EngagementContext'
import { LibraryProvider } from '../context/LibraryContext'
import { WalletProvider } from '../context/WalletContext'
import { recordHistory } from '../lib/engagement'

const horizon = mockWebtoons.find((webtoon) => webtoon.id === '1')!

const sessionUser = {
  id: 'u_tester',
  email: 'tester@example.com',
  username: 'tester',
  displayName: 'Tester',
  createdAt: '2026-01-01T00:00:00.000Z',
}

const store = new Map<string, string>()

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

function renderControl(path = '/webtoon/1') {
  return render(
    <HelmetProvider>
      <DataProvider>
        <MemoryRouter initialEntries={[path]}>
          <AuthProvider>
            <LibraryProvider>
              <WalletProvider>
                <EngagementProvider>
                  <Routes>
                    <Route
                      path="/webtoon/:id"
                      element={<SeriesRatingControl webtoonId="1" variant="hero" />}
                    />
                    <Route path="/login" element={<div>Login page</div>} />
                  </Routes>
                </EngagementProvider>
              </WalletProvider>
            </LibraryProvider>
          </AuthProvider>
        </MemoryRouter>
      </DataProvider>
    </HelmetProvider>
  )
}

describe('series rating chrome', () => {
  beforeEach(() => {
    installStorage()
  })

  it('shows the community score on a catalog cover chip', () => {
    render(
      <HelmetProvider>
        <CatalogBookCard webtoon={horizon} lang="en" genres={mockGenres} newestIds={new Set()} />
      </HelmetProvider>
    )
    expect(screen.getByTestId('rating-chip')).toHaveTextContent('4.9')
  })

  it('sends guests to login when they try to rate', () => {
    renderControl()
    fireEvent.click(screen.getByRole('radio', { name: '4.5 stars' }))
    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('disables rating until the signed-in user has read an episode', () => {
    store.set('softgate_user', JSON.stringify(sessionUser))
    renderControl()
    expect(screen.getByRole('radio', { name: '4.5 stars' })).toBeDisabled()
    expect(screen.getByText('Read an episode to rate.')).toBeInTheDocument()
  })

  it('lets a reader set a half-star rating after history exists', () => {
    store.set('softgate_user', JSON.stringify(sessionUser))
    recordHistory(sessionUser.id, '1', 1)
    renderControl()
    fireEvent.click(screen.getByRole('radio', { name: '4.5 stars' }))
    expect(screen.getByText('You rated 4.5')).toBeInTheDocument()
  })

  it('gives each half-star a 44 by 24 CSS-pixel hit cell', () => {
    renderControl()
    const half = screen.getByRole('radio', { name: '4.5 stars' })
    expect(half.className).toMatch(/\bw-1\/2\b/)
    expect(half.parentElement?.className).toMatch(/\bh-11\b/)
    expect(half.parentElement?.className).toMatch(/\bw-12\b/)
  })
})
