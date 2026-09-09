import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, renderHook, screen, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { EngagementProvider, useEngagement } from '../context/EngagementContext'
import { LibraryProvider } from '../context/LibraryContext'
import { SettingsProvider } from '../context/SettingsContext'
import { WalletProvider } from '../context/WalletContext'
import ReaderPage from '../features/reader/ReaderPage'
import { PREFS_STORAGE_KEY } from '../lib/notifications'
import { READER_PREFS_KEY } from '../lib/reader'
import type { ReactNode } from 'react'

const store = new Map<string, string>()

const publicUser = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'reader@example.com',
  username: 'readerone',
  displayName: 'Reader One',
  createdAt: '2026-08-24T00:00:00.000Z',
}

const emptyPrefs = {
  notifPrefs: { newEpisode: true, commentReply: true, promotion: true },
  readerPrefs: { darkMode: true, brightness: 0.9, fontSize: 'md', imageFit: 'fit' },
}

const httpCatalog = {
  authors: [],
  genres: [],
  webtoons: [
    {
      id: 'wt-1',
      title: { en: 'Title', mm: 'Title' },
      description: { en: 'd', mm: 'd' },
      coverColor: '#000000',
      author: {
        id: 'a1',
        name: { en: 'A', mm: 'A' },
        followerCount: 0,
        webtoonCount: 1,
      },
      genres: [],
      tags: [],
      status: 'ongoing' as const,
      isPremium: false,
      viewCount: 0,
      likeCount: 0,
      episodeCount: 4,
      rating: 0,
      contentRating: 'all' as const,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
  ],
  episodes: [
    {
      id: 'e4',
      webtoonId: 'wt-1',
      webtoonTitle: { en: 'Title', mm: 'Title' },
      title: { en: 'Ep 4', mm: 'Ep 4' },
      images: ['/x.png'],
      isPremium: false,
      coinPrice: 0,
      viewCount: 0,
      likeCount: 0,
      episodeNumber: 4,
      status: 'published' as const,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
  ],
}

const librarySnapshot = {
  bookmarks: [
    {
      webtoonId: 'wt-1',
      addedAt: '2026-09-08T00:00:00.000Z',
      lastNotifiedEpisodeNumber: 3,
    },
  ],
  history: [] as Array<Record<string, unknown>>,
  likedWebtoonIds: [] as string[],
}

const emptyLibrary = {
  bookmarks: [] as Array<Record<string, unknown>>,
  history: [] as Array<Record<string, unknown>>,
  likedWebtoonIds: [] as string[],
}

const leftoverNotifStore = {
  schemaVersion: 1,
  byUserId: {
    [publicUser.id]: { newEpisode: false, commentReply: true, promotion: true },
  },
}

const leftoverReader = {
  schemaVersion: 1,
  darkMode: false,
  brightness: 0.25,
  fontSize: 'lg',
  imageFit: 'full',
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>
      <DataProvider>
        <LibraryProvider>
          <EngagementProvider>{children}</EngagementProvider>
        </LibraryProvider>
      </DataProvider>
    </AuthProvider>
  </MemoryRouter>
)

describe('prefs HTTP', () => {
  beforeEach(() => {
    store.clear()
    vi.stubEnv('VITE_USE_MOCK_API', 'false')
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
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('posts notif prefs without writing softgate_notif_prefs_v1', async () => {
    let prefs = { ...emptyPrefs, notifPrefs: { ...emptyPrefs.notifPrefs } }
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (url.endsWith('/api/auth/me') && method === 'GET') {
        return jsonResponse({ data: publicUser }, 200)
      }
      if (url.endsWith('/api/catalog') && method === 'GET') {
        return jsonResponse({ data: httpCatalog }, 200)
      }
      if (url.endsWith('/api/library/me') && method === 'GET') {
        return jsonResponse({ data: emptyLibrary }, 200)
      }
      if (url.endsWith('/api/notifications/me') && method === 'GET') {
        return jsonResponse({ data: { notifications: [] } }, 200)
      }
      if (url.endsWith('/api/prefs/me') && method === 'GET') {
        return jsonResponse({ data: prefs }, 200)
      }
      if (url.endsWith('/api/prefs/notif') && method === 'POST') {
        expect(JSON.parse(String(init?.body))).toEqual({ promotion: false })
        prefs = {
          ...prefs,
          notifPrefs: { ...prefs.notifPrefs, promotion: false },
        }
        return jsonResponse({ data: prefs }, 200)
      }
      throw new Error(`unexpected ${method} ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useEngagement(), { wrapper })
    await waitFor(() => {
      expect(result.current.prefsHydrated).toBe(true)
    })
    expect(
      fetchMock.mock.calls.some(
        ([input, init]) => String(input).endsWith('/api/prefs/reader') && init?.method === 'POST'
      )
    ).toBe(false)
    expect(
      fetchMock.mock.calls.some(
        ([input, init]) => String(input).endsWith('/api/prefs/notif') && init?.method === 'POST'
      )
    ).toBe(false)

    act(() => {
      result.current.setNotifPrefs({ promotion: false })
    })
    await waitFor(() => {
      expect(result.current.notifPrefs.promotion).toBe(false)
    })
    expect(store.has(PREFS_STORAGE_KEY)).toBe(false)
  })

  it('posts reader prefs without writing softgate_reader_prefs_v1', async () => {
    let prefs = {
      ...emptyPrefs,
      readerPrefs: { ...emptyPrefs.readerPrefs },
    }
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (url.endsWith('/api/auth/me') && method === 'GET') {
        return jsonResponse({ data: publicUser }, 200)
      }
      if (url.endsWith('/api/catalog') && method === 'GET') {
        return jsonResponse({ data: httpCatalog }, 200)
      }
      if (url.endsWith('/api/library/me') && method === 'GET') {
        return jsonResponse({ data: emptyLibrary }, 200)
      }
      if (url.endsWith('/api/notifications/me') && method === 'GET') {
        return jsonResponse({ data: { notifications: [] } }, 200)
      }
      if (url.endsWith('/api/prefs/me') && method === 'GET') {
        return jsonResponse({ data: prefs }, 200)
      }
      if (url.endsWith('/api/prefs/reader') && method === 'POST') {
        const body = JSON.parse(String(init?.body)) as { darkMode: boolean }
        expect(body.darkMode).toBe(false)
        prefs = {
          ...prefs,
          readerPrefs: { ...prefs.readerPrefs, darkMode: false },
        }
        return jsonResponse({ data: prefs }, 200)
      }
      throw new Error(`unexpected ${method} ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useEngagement(), { wrapper })
    await waitFor(() => {
      expect(result.current.prefsHydrated).toBe(true)
    })
    act(() => {
      result.current.setReaderPrefs({
        schemaVersion: 1,
        darkMode: false,
        brightness: 0.9,
        fontSize: 'md',
        imageFit: 'fit',
      })
    })
    await waitFor(() => {
      expect(result.current.readerPrefs.darkMode).toBe(false)
    })
    expect(store.has(READER_PREFS_KEY)).toBe(false)
  })

  it('ignores leftover device reader blob for HTTP logged-in chrome', async () => {
    store.set(READER_PREFS_KEY, JSON.stringify(leftoverReader))
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (url.endsWith('/api/auth/me') && method === 'GET') {
        return jsonResponse({ data: publicUser }, 200)
      }
      if (url.endsWith('/api/catalog') && method === 'GET') {
        return jsonResponse({ data: httpCatalog }, 200)
      }
      if (url.endsWith('/api/settings') && method === 'GET') {
        return jsonResponse(
          { data: { maintenanceMode: false, allowRegistration: true, contactEmail: '' } },
          200
        )
      }
      if (url.endsWith('/api/wallet/me') && method === 'GET') {
        return jsonResponse(
          { data: { balance: 150, transactions: [], unlockedEpisodeKeys: [] } },
          200
        )
      }
      if (url.endsWith('/api/library/me') && method === 'GET') {
        return jsonResponse({ data: emptyLibrary }, 200)
      }
      if (url.endsWith('/api/notifications/me') && method === 'GET') {
        return jsonResponse({ data: { notifications: [] } }, 200)
      }
      if (url.endsWith('/api/prefs/me') && method === 'GET') {
        return jsonResponse({ data: emptyPrefs }, 200)
      }
      throw new Error(`unexpected ${method} ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    render(
      <HelmetProvider>
        <DataProvider>
          <MemoryRouter initialEntries={['/read/wt-1/4']}>
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

    expect(await screen.findByRole('heading', { name: 'Ep 4' })).toBeInTheDocument()
    expect(document.querySelector('.bg-gray-950')).toBeTruthy()
    expect(store.get(READER_PREFS_KEY)).toBe(JSON.stringify(leftoverReader))
  })

  it('does not upsert from leftover localStorage when API newEpisode is on', async () => {
    store.set(PREFS_STORAGE_KEY, JSON.stringify(leftoverNotifStore))
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (url.endsWith('/api/auth/me') && method === 'GET') {
        return jsonResponse({ data: publicUser }, 200)
      }
      if (url.endsWith('/api/catalog') && method === 'GET') {
        return jsonResponse({ data: httpCatalog }, 200)
      }
      if (url.endsWith('/api/library/me') && method === 'GET') {
        return jsonResponse({ data: librarySnapshot }, 200)
      }
      if (url.endsWith('/api/notifications/me') && method === 'GET') {
        return jsonResponse({ data: { notifications: [] } }, 200)
      }
      if (url.endsWith('/api/prefs/me') && method === 'GET') {
        return jsonResponse({ data: emptyPrefs }, 200)
      }
      throw new Error(`unexpected ${method} ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useEngagement(), { wrapper })
    await waitFor(() => {
      expect(result.current.prefsHydrated).toBe(true)
      expect(result.current.isReady).toBe(true)
    })
    expect(result.current.notifications).toEqual([])
    expect(store.has(PREFS_STORAGE_KEY)).toBe(true)
    expect(
      fetchMock.mock.calls.some(([input]) => String(input).endsWith('/api/notifications/upsert'))
    ).toBe(false)
  })

  it('does not upsert when API newEpisode is false even if leftover is true', async () => {
    store.set(PREFS_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, byUserId: {} }))
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (url.endsWith('/api/auth/me') && method === 'GET') {
        return jsonResponse({ data: publicUser }, 200)
      }
      if (url.endsWith('/api/catalog') && method === 'GET') {
        return jsonResponse({ data: httpCatalog }, 200)
      }
      if (url.endsWith('/api/library/me') && method === 'GET') {
        return jsonResponse({ data: librarySnapshot }, 200)
      }
      if (url.endsWith('/api/library/stamp-notified') && method === 'POST') {
        return jsonResponse({ data: librarySnapshot }, 200)
      }
      if (url.endsWith('/api/notifications/me') && method === 'GET') {
        return jsonResponse({ data: { notifications: [] } }, 200)
      }
      if (url.endsWith('/api/prefs/me') && method === 'GET') {
        return jsonResponse(
          {
            data: {
              notifPrefs: { newEpisode: false, commentReply: true, promotion: true },
              readerPrefs: emptyPrefs.readerPrefs,
            },
          },
          200
        )
      }
      throw new Error(`unexpected ${method} ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useEngagement(), { wrapper })
    await waitFor(() => {
      expect(result.current.prefsHydrated).toBe(true)
      expect(result.current.isReady).toBe(true)
    })
    expect(result.current.notifications).toEqual([])
    expect(
      fetchMock.mock.calls.some(([input]) => String(input).endsWith('/api/notifications/upsert'))
    ).toBe(false)
  })
})
