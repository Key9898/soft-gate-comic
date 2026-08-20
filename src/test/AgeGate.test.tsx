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
import { ENGAGEMENT_SCHEMA_VERSION, STORAGE_KEY as ENGAGE_STORAGE_KEY } from '../lib/engagement'
import { AGE_CONFIRM_STORAGE_KEY } from '../lib/contentRating'
import ReaderPage from '../features/reader/ReaderPage'

const store = new Map<string, string>()

const sessionUser = {
  id: 'u_tester',
  email: 'tester@example.com',
  username: 'tester',
  displayName: 'Tester',
  createdAt: '2026-01-01T00:00:00.000Z',
}

function installStorage() {
  store.clear()
  window.sessionStorage.clear()
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

function renderRead(path: string) {
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

describe('18+ age gate', () => {
  beforeEach(() => {
    installStorage()
  })

  it('blocks Blood Moon until confirm and does not write history', async () => {
    renderRead('/read/7/1')
    expect(await screen.findByTestId('age-gate')).toBeInTheDocument()
    expect(screen.queryByTestId('reader-strip-stack')).not.toBeInTheDocument()
    expect(store.get(ENGAGE_STORAGE_KEY)).toBeUndefined()
  })

  it('does not gate a 13+ title', async () => {
    renderRead('/read/1/1')
    expect(await screen.findByRole('heading', { name: 'The Beginning' })).toBeInTheDocument()
    expect(screen.queryByTestId('age-gate')).not.toBeInTheDocument()
  })

  it('lets a guest confirm for this tab and forgets after session clear', async () => {
    const user = userEvent.setup()
    const first = renderRead('/read/7/1')
    await user.click(await screen.findByRole('button', { name: /i am 18 or older/i }))
    expect(screen.queryByTestId('age-gate')).not.toBeInTheDocument()
    first.unmount()
    window.sessionStorage.clear()
    renderRead('/read/7/1')
    expect(await screen.findByTestId('age-gate')).toBeInTheDocument()
  })

  it('keeps a signed-in confirm after remount', async () => {
    store.set('softgate_user', JSON.stringify(sessionUser))
    store.set(
      AGE_CONFIRM_STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        byUserId: { [sessionUser.id]: { confirmedAt: '2026-08-19T00:00:00.000Z' } },
      })
    )
    renderRead('/read/7/1')
    expect(await screen.findByText('Blood Moon')).toBeInTheDocument()
    expect(screen.queryByTestId('age-gate')).not.toBeInTheDocument()
  })

  it('returns to the series hub on dismiss', async () => {
    const user = userEvent.setup()
    renderRead('/read/7/1')
    await user.click(await screen.findByRole('button', { name: /not now/i }))
    expect(await screen.findByText('series hub')).toBeInTheDocument()
  })

  it('does not write history while the gate is open for a signed-in reader', async () => {
    store.set('softgate_user', JSON.stringify(sessionUser))
    renderRead('/read/7/1')
    expect(await screen.findByTestId('age-gate')).toBeInTheDocument()
    const raw = store.get(ENGAGE_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as {
        schemaVersion: number
        byUserId: Record<string, { history?: unknown[] }>
      }
      expect(parsed.schemaVersion).toBe(ENGAGEMENT_SCHEMA_VERSION)
      expect(parsed.byUserId[sessionUser.id]?.history ?? []).toEqual([])
    }
  })
})
