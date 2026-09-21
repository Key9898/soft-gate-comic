import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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

describe('reader related and back to series', () => {
  it('shows at most three related series alongside a next episode', async () => {
    renderReader('/read/1/1')
    const list = await screen.findByTestId('reader-related')
    expect(list.querySelectorAll('li').length).toBeLessThanOrEqual(3)
    expect(screen.getByTestId('reader-next-up')).toBeInTheDocument()
  })

  it('offers Back to series even when a next episode exists', async () => {
    renderReader('/read/1/1')
    expect(await screen.findByRole('link', { name: 'Back to series' })).toBeInTheDocument()
  })
})

describe('reader complete card order', () => {
  it('renders the blocks in the specified order', async () => {
    renderReader('/read/1/1')
    const card = await screen.findByTestId('reader-complete-card')
    const ids = Array.from(card.querySelectorAll('[data-testid]'))
      .map((node) => node.getAttribute('data-testid'))
      .filter(
        (id): id is string =>
          id !== null && ['reader-reactions', 'reader-next-up', 'reader-related'].includes(id)
      )
    expect(ids).toEqual(['reader-reactions', 'reader-next-up', 'reader-related'])
  })

  // The assertion above only orders the three blocks that already carry a data-testid.
  // RatingControl, CreatorNote, CompleteComments, GuestNudge and the footer (Back to series +
  // ReportControl) render without one, so a regression that reshuffled any of those five --
  // relative to each other or to the three above, e.g. hoisting CreatorNote above the comments
  // teaser, or moving the footer above GuestNudge -- would satisfy the assertion above unnoticed.
  // This test locates every block by its accessible role or visible text instead, so the whole
  // sequence is pinned end to end, not just the three blocks that happen to have a testid.
  it('renders every block, including ones without a testid, in the specified order', async () => {
    renderReader('/read/1/1')
    const card = await screen.findByTestId('reader-complete-card')
    const view = within(card)

    const ordered = [
      view.getByRole('radiogroup', { name: 'Rate this series' }),
      view.getByTestId('reader-reactions'),
      view.getByTestId('reader-next-up'),
      view.getByText('Creator note'),
      view.getByRole('button', { name: 'Open comments' }),
      view.getByTestId('reader-related'),
      view.getByRole('button', { name: 'Create free account' }),
      view.getByRole('link', { name: 'Back to series' }),
      view.getByRole('button', { name: 'Report episode' }),
    ]

    for (let i = 1; i < ordered.length; i += 1) {
      const position = ordered[i - 1].compareDocumentPosition(ordered[i])
      expect(Boolean(position & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true)
    }
  })

  // The two tests above only ever see the hasNext branch (NextUpRow). Task 6 made related
  // series show alongside a next episode "not only at end of series" -- which implies the
  // reverse still holds too. This exercises the EndOfSeries branch directly: webtoon 1's last
  // published episode (5) is a wait-for-free premium episode, so a guest reads it once its
  // freeAt has passed, with no published episode 6 to make hasNext true (6 and 7 are
  // scheduled drops, not published episodes).
  it('shows end-of-series instead of next-up once the last episode is reached, with related still alongside it', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-01T00:00:00.000Z'))
    try {
      renderReader('/read/1/5')
      const card = screen.getByTestId('reader-complete-card')
      const view = within(card)
      expect(view.getByTestId('reader-end-of-series')).toBeInTheDocument()
      expect(view.queryByTestId('reader-next-up')).not.toBeInTheDocument()
      expect(view.getByTestId('reader-related')).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })
})
