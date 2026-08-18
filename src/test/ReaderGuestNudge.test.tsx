import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { LibraryProvider } from '../context/LibraryContext'
import { WalletProvider } from '../context/WalletContext'
import { EngagementProvider } from '../context/EngagementContext'
import { SESSION_STORAGE_KEY } from '../lib/auth/types'
import ReaderPage from '../features/reader/ReaderPage'

const renderReader = (path: string) =>
  render(
    <HelmetProvider>
      <DataProvider>
        <MemoryRouter initialEntries={[path]}>
          <AuthProvider>
            <LibraryProvider>
              <WalletProvider>
                <EngagementProvider>
                  <Routes>
                    <Route path="/read/:webtoonId/:episodeNumber" element={<ReaderPage />} />
                  </Routes>
                </EngagementProvider>
              </WalletProvider>
            </LibraryProvider>
          </AuthProvider>
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

describe('Reader guest nudges', () => {
  it('shows the sign-up nudge with register and login links to guests on a free episode', () => {
    renderReader('/read/1/1')
    expect(
      screen.getByText(/create a free account to keep your reading progress/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create free account/i })).toBeInTheDocument()
    const loginLink = screen.getByRole('link', { name: 'Login' })
    expect(loginLink).toHaveAttribute('href', '/login')
  })

  it('does not show the sign-up nudge to logged-in readers', () => {
    seedSession()
    renderReader('/read/1/1')
    expect(screen.queryByText(/create free account/i)).not.toBeInTheDocument()
  })

  it('shows "Log in to unlock" and hides the balance line for guests on a premium episode', () => {
    renderReader('/read/1/4')
    expect(screen.getByRole('button', { name: /log in to unlock/i })).toBeInTheDocument()
    expect(screen.queryByText(/your balance/i)).not.toBeInTheDocument()
  })

  it('keeps the coin unlock button and balance line for logged-in readers on a premium episode', () => {
    seedSession()
    renderReader('/read/1/4')
    expect(screen.getByRole('button', { name: /unlock with coins/i })).toBeInTheDocument()
    expect(screen.getByText(/your balance/i)).toBeInTheDocument()
  })
})
