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
import { SESSION_STORAGE_KEY } from '../lib/auth/types'
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

// Layers the session seed on top of the Map-backed store below rather than
// replacing its getItem entirely: the composer's post round-trips through
// writeStore/readStore (both backed by that Map), so a getItem override that
// unconditionally returns null for every other key would silently drop the
// write and the posted comment would never reach the teaser.
const seedSession = () => {
  vi.mocked(window.localStorage.getItem).mockImplementation((key: string) =>
    key === SESSION_STORAGE_KEY
      ? JSON.stringify({ id: 'u_test', email: 'test@example.com', username: 'tester' })
      : (reactionStore.get(key) ?? null)
  )
}

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

describe('reader next-up', () => {
  it('shows the next episode with its thumb', async () => {
    renderReader('/read/1/1')
    const row = await screen.findByTestId('reader-next-up')
    expect(row.querySelector('img')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
  })

  // packages/shared/src/data.ts: series 1 episode 2 is not premium (its successor,
  // episode 3, isn't either) so /read/1/2 never produces a locked next-up. Episode 4
  // is the premium one with no freeAt (a straight lock, not a wait-for-free window),
  // so reading episode 3 is the path that actually exercises the locked state.
  it('marks a locked next episode and still routes to it', async () => {
    const user = userEvent.setup()
    renderReader('/read/1/3')
    const row = await screen.findByTestId('reader-next-up')
    expect(row).toHaveTextContent('Unlock this episode for')
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('Premium Episode')).toBeInTheDocument()
  })
})

describe('reader comments composer', () => {
  it('is hidden for a guest', async () => {
    renderReader('/read/1/1')
    await screen.findByTestId('reader-reactions')
    expect(screen.queryByTestId('reader-comment-composer')).not.toBeInTheDocument()
  })

  it('posts a comment that shows up in the teaser', async () => {
    const user = userEvent.setup()
    seedSession()
    renderReader('/read/1/1')
    const box = await screen.findByTestId('reader-comment-composer')
    const field = box.querySelector('textarea') as HTMLTextAreaElement
    await user.type(field, 'Great episode')
    await user.click(screen.getByRole('button', { name: 'Post' }))
    expect(await screen.findByText('Great episode')).toBeInTheDocument()
  })
})
