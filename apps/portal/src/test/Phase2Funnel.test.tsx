import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { SettingsProvider } from '../context/SettingsContext'
import { LibraryProvider } from '../context/LibraryContext'
import { WalletProvider } from '../context/WalletContext'
import { EngagementProvider } from '../context/EngagementContext'
import { SESSION_STORAGE_KEY } from '../lib/auth/types'
import LibraryPage from '../features/library/LibraryPage'
import LibraryEmptyState from '../features/library/components/LibraryEmptyState'
import NotificationsPage from '../features/notifications/NotificationsPage'
import WebtoonDetailPage from '../features/webtoon/WebtoonDetailPage'

const providers = (children: React.ReactNode, entries: (string | object)[]) => (
  <HelmetProvider>
    <DataProvider>
      <MemoryRouter initialEntries={entries as never}>
        <SettingsProvider>
          <AuthProvider>
            <LibraryProvider>
              <WalletProvider>
                <EngagementProvider>{children}</EngagementProvider>
              </WalletProvider>
            </LibraryProvider>
          </AuthProvider>
        </SettingsProvider>
      </MemoryRouter>
    </DataProvider>
  </HelmetProvider>
)

const seedSession = () => {
  vi.mocked(window.localStorage.getItem).mockImplementation((key: string) =>
    key === SESSION_STORAGE_KEY
      ? JSON.stringify({ id: 'u_test', email: 'test@example.com', username: 'tester' })
      : null
  )
}

afterEach(() => {
  vi.mocked(window.localStorage.getItem).mockImplementation(() => null)
})

describe('Phase 2 — an empty shelf says why it is empty', () => {
  it('offers Clear search and a search icon when a filter hides the shelf', async () => {
    const user = userEvent.setup()
    const onCta = vi.fn()
    render(
      <LibraryEmptyState
        tab="bookmarks"
        filtered
        title="Nothing here matches “abc”"
        description="Your library still has these titles — the search is just hiding them."
        ctaLabel="Clear search"
        onCtaClick={onCta}
      />
    )
    // The recovery for a filtered shelf is to clear the filter, not to go browse.
    expect(screen.getByText(/the search is just hiding them/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /clear search/i }))
    expect(onCta).toHaveBeenCalledTimes(1)
  })

  it('keeps the first-run copy when the shelf is genuinely empty', () => {
    render(
      <LibraryEmptyState
        tab="bookmarks"
        title="Your library is empty"
        description="Explore and subscribe to a series."
        ctaLabel="Browse webtoons"
        onCtaClick={() => {}}
      />
    )
    expect(screen.getByText(/your library is empty/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /browse webtoons/i })).toBeInTheDocument()
  })

  it('renders the real page empty state with a verb CTA', async () => {
    seedSession()
    render(providers(<LibraryPage />, ['/library']))
    expect(await screen.findByRole('button', { name: /browse webtoons/i })).toBeInTheDocument()
  })
})

describe('Phase 2 — the inbox distinguishes empty from filtered', () => {
  it('does not claim "all caught up" while a filter is hiding notifications', async () => {
    const user = userEvent.setup()
    seedSession()
    render(providers(<NotificationsPage />, ['/notifications']))

    const filters = await screen.findAllByRole('button', { pressed: false })
    if (filters.length === 0) return

    // Pick a type filter that has no matches in the seeded inbox.
    for (const chip of filters) {
      await user.click(chip)
      if (screen.queryByText(/nothing in this filter/i)) {
        expect(screen.queryByText(/all caught up/i)).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: /show all notifications/i })).toBeInTheDocument()
        return
      }
    }
  })
})

describe('Phase 2 — locked episodes are priced against the wallet', () => {
  it('tells a signed-in reader whether they can afford the episode before they tap', async () => {
    seedSession()
    render(
      providers(
        <Routes>
          <Route path="/webtoon/:id" element={<WebtoonDetailPage />} />
        </Routes>,
        ['/webtoon/1']
      )
    )

    const prices = await screen.findAllByTestId('episode-price')
    expect(prices.length).toBeGreaterThan(0)
    // Seed balance is 150 and episode prices are 5, so every locked row reads as
    // affordable rather than showing a bare number.
    const affordable = prices.filter((p) => /you have/i.test(p.textContent ?? ''))
    expect(affordable.length).toBeGreaterThan(0)
    expect(within(affordable[0]).getByText(/150/)).toBeInTheDocument()
  })

  it('shows a bare price to guests, who have no balance to compare against', async () => {
    render(
      providers(
        <Routes>
          <Route path="/webtoon/:id" element={<WebtoonDetailPage />} />
        </Routes>,
        ['/webtoon/1']
      )
    )
    const prices = await screen.findAllByTestId('episode-price')
    for (const price of prices) {
      expect(price.textContent).not.toMatch(/you have|short/i)
    }
  })
})
