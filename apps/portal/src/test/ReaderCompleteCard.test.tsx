import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { SettingsProvider } from '../context/SettingsContext'
import { LibraryProvider } from '../context/LibraryContext'
import { WalletProvider } from '../context/WalletContext'
import { EngagementProvider } from '../context/EngagementContext'
import ReaderPage from '../features/reader/ReaderPage'

const renderReader = (path: string) =>
  render(
    <HelmetProvider>
      <DataProvider>
        <MemoryRouter initialEntries={[path]}>
          <SettingsProvider>
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
          </SettingsProvider>
        </MemoryRouter>
      </DataProvider>
    </HelmetProvider>
  )

// The global localStorage mock in src/test/setup.ts always returns null from getItem
// and never persists what setItem writes, so it cannot round-trip a toggle across two
// clicks. Back it with a real Map for this suite, matching the pattern already used in
// src/test/readerReactions.test.ts.
const reactionStore = new Map<string, string>()

beforeEach(() => {
  reactionStore.clear()
  vi.mocked(window.localStorage.getItem).mockImplementation(
    (key: string) => reactionStore.get(key) ?? null
  )
  vi.mocked(window.localStorage.setItem).mockImplementation((key: string, value: string) => {
    reactionStore.set(key, value)
  })
})

afterEach(() => {
  vi.mocked(window.localStorage.getItem).mockImplementation(() => null)
  vi.mocked(window.localStorage.setItem).mockImplementation(() => null)
})

describe('reader reactions', () => {
  it('offers every reaction with a Demo count', async () => {
    renderReader('/read/1/1')
    const row = await screen.findByTestId('reader-reactions')
    expect(row).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Love it' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('toggles a reaction on and back off', async () => {
    const user = userEvent.setup()
    renderReader('/read/1/1')
    const fire = await screen.findByRole('button', { name: 'Fire' })
    await user.click(fire)
    expect(screen.getByRole('button', { name: 'Fire' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Fire' }))
    expect(screen.getByRole('button', { name: 'Fire' })).toHaveAttribute('aria-pressed', 'false')
  })
})
