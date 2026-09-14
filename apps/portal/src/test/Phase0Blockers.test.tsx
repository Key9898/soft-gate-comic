import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render as utilsRender } from './utils'
import { coinPackages } from '../features/coins/components/coinData'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { SettingsProvider } from '../context/SettingsContext'
import { LibraryProvider } from '../context/LibraryContext'
import { WalletProvider } from '../context/WalletContext'
import { EngagementProvider } from '../context/EngagementContext'
import { SESSION_STORAGE_KEY } from '../lib/auth/types'
import ReaderPage from '../features/reader/ReaderPage'
import CoinsPage from '../features/coins/CoinsPage'
import ProfilePage from '../features/profile/ProfilePage'

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

const renderReader = (path: string) =>
  render(
    providers(
      <Routes>
        <Route path="/read/:webtoonId/:episodeNumber" element={<ReaderPage />} />
      </Routes>,
      [path]
    )
  )

const renderCoins = (state?: object) =>
  render(
    providers(
      <Routes>
        <Route path="/coins" element={<CoinsPage />} />
      </Routes>,
      [{ pathname: '/coins', ...(state ? { state } : {}) }]
    )
  )

const renderProfile = () =>
  render(
    providers(
      <Routes>
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>,
      [{ pathname: '/profile', search: '?tab=security' }]
    )
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

describe('Phase 0 — spending coins is legible before it happens', () => {
  it('puts the price on the unlock CTA and shows the balance it will leave', () => {
    seedSession()
    renderReader('/read/1/4')
    expect(screen.getByRole('button', { name: /unlock · 5/i })).toBeInTheDocument()
    expect(screen.getByText(/balance after: 145/i)).toBeInTheDocument()
  })

  it('asks for confirmation before the first spend and lets the reader back out', async () => {
    const user = userEvent.setup()
    seedSession()
    renderReader('/read/1/4')

    await user.click(screen.getByRole('button', { name: /unlock · 5/i }))
    expect(screen.getByText(/unlock episode 4 for 5 coins/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByText(/unlock episode 4 for 5 coins/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /unlock · 5/i })).toBeInTheDocument()
  })

  it('carries a live region so a balance change is announced', () => {
    seedSession()
    renderReader('/read/1/4')
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})

describe('Phase 0 — a paywall that could not be paid keeps its context', () => {
  it('shows what the top-up is for and a way back to the episode', () => {
    seedSession()
    renderCoins({
      from: '/read/1/4',
      needCoins: 20,
      episodeNumber: 4,
      seriesTitle: 'The Last Horizon',
    })

    const strip = screen.getByTestId('coins-topup-context')
    expect(within(strip).getByText(/episode 4 of the last horizon/i)).toBeInTheDocument()
    expect(within(strip).getByText(/you need 20 more coins/i)).toBeInTheDocument()
    expect(within(strip).getByRole('link', { name: /back to episode 4/i })).toHaveAttribute(
      'href',
      '/read/1/4'
    )
  })

  it('does not show the strip on a plain visit', () => {
    seedSession()
    renderCoins()
    expect(screen.queryByTestId('coins-topup-context')).not.toBeInTheDocument()
  })
})

describe('Phase 0 — the demo checkout cannot hold a real card', () => {
  it('locks every card field and says why', () => {
    utilsRender(<CoinsPage />)
    fireEvent.click(screen.getByText(coinPackages[0].coins.toLocaleString()))
    fireEvent.click(screen.getByText('Cards'))

    expect(screen.getByTestId('card-demo-locked')).toBeInTheDocument()
    for (const id of ['cardNumberInput', 'cardHolderInput', 'cardExpiryInput', 'cardCvvInput']) {
      expect(document.getElementById(id)).toHaveAttribute('readonly')
    }
    expect(document.getElementById('cardNumberInput')).toHaveValue('4111 1111 1111 1111')
  })
})

describe('Phase 0 — account deletion is confirmed, not one click', () => {
  it('opens a dialog and keeps Confirm disabled until the username is typed', async () => {
    const user = userEvent.setup()
    seedSession()
    renderProfile()

    const passwords = await screen.findAllByLabelText(/^password$/i)
    await user.type(passwords[passwords.length - 1], 'hunter2hunter2')
    await user.click(screen.getAllByRole('button', { name: /delete account/i })[0])

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText(/cannot be undone/i)).toBeInTheDocument()

    const confirm = within(dialog).getByRole('button', { name: /delete account/i })
    expect(confirm).toBeDisabled()

    await user.type(within(dialog).getByLabelText(/type tester to confirm/i), 'tester')
    expect(confirm).toBeEnabled()
  })
})
