import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { LibraryProvider } from '../context/LibraryContext'
import { WalletProvider } from '../context/WalletContext'
import { EngagementProvider } from '../context/EngagementContext'
import { addComment, episodeCommentKey } from '../lib/comments'
import { READER_PREFS_KEY } from '../lib/reader'
import ReaderPage from '../features/reader/ReaderPage'

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

function renderReader(path: string) {
  return render(
    <HelmetProvider>
      <DataProvider>
        <MemoryRouter initialEntries={[path]}>
          <AuthProvider>
            <LibraryProvider>
              <WalletProvider>
                <EngagementProvider>
                  <Routes>
                    <Route path="/read/:webtoonId/:episodeNumber" element={<ReaderPage />} />
                    <Route path="/webtoon/:id" element={<div>series hub</div>} />
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

describe('Reader chrome', () => {
  beforeEach(() => {
    installStorage()
  })

  it('opens the episode list as a dialog instead of navigating away', async () => {
    const user = userEvent.setup()
    renderReader('/read/1/1')
    expect(await screen.findByRole('heading', { name: 'The Beginning' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Episode List' }))
    expect(await screen.findByRole('dialog', { name: 'Episode List' })).toBeInTheDocument()
    expect(screen.queryByText('series hub')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to series' })).toHaveAttribute(
      'href',
      '/webtoon/1'
    )
  })

  it('goes to the next episode with ArrowRight', async () => {
    renderReader('/read/1/1')
    expect(await screen.findByRole('heading', { name: 'The Beginning' })).toBeInTheDocument()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    expect(await screen.findByRole('heading', { name: 'Awakening' })).toBeInTheDocument()
  })

  it('does not change episode with ArrowRight while the episode sheet is open', async () => {
    const user = userEvent.setup()
    renderReader('/read/1/1')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'The Beginning' })
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Episode List' }))
    expect(await screen.findByRole('dialog', { name: 'Episode List' })).toBeInTheDocument()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    expect(screen.getByRole('heading', { level: 1, name: 'The Beginning' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: 'Awakening' })).not.toBeInTheDocument()
  })

  it('restores image fit after remount', async () => {
    const user = userEvent.setup()
    const { unmount } = renderReader('/read/1/1')
    expect(await screen.findByRole('heading', { name: 'The Beginning' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Settings' }))
    await user.click(screen.getByRole('button', { name: 'Full width' }))
    expect(screen.getByTestId('reader-strip-stack').className).toMatch(/w-full/)
    unmount()
    renderReader('/read/1/1')
    expect(await screen.findByRole('heading', { name: 'The Beginning' })).toBeInTheDocument()
    expect(screen.getByTestId('reader-strip-stack').className).toMatch(/w-full/)
    expect(JSON.parse(store.get(READER_PREFS_KEY) ?? '{}').imageFit).toBe('full')
  })

  it('shows the comments count on the header button', async () => {
    addComment(
      episodeCommentKey('1', 1),
      { id: 'u_seed', username: 'seed', displayName: 'Seed' },
      'Seeded comment'
    )
    renderReader('/read/1/1')
    expect(await screen.findByRole('button', { name: 'Comments' })).toHaveTextContent('1')
  })

  it('toggles the fit class on the strip stack', async () => {
    const user = userEvent.setup()
    renderReader('/read/1/1')
    expect(await screen.findByRole('heading', { name: 'The Beginning' })).toBeInTheDocument()
    const strip = screen.getByTestId('reader-strip-stack')
    expect(strip.className).not.toMatch(/\bw-full\b/)
    await user.click(screen.getByRole('button', { name: 'Settings' }))
    await user.click(screen.getByRole('button', { name: 'Full width' }))
    expect(screen.getByTestId('reader-strip-stack').className).toMatch(/\bw-full\b/)
    await user.click(screen.getByRole('button', { name: 'Fit' }))
    expect(screen.getByTestId('reader-strip-stack').className).not.toMatch(/\bw-full\b/)
  })
})
