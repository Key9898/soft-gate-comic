import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { LibraryProvider, useLibrary } from '../context/LibraryContext'
import { EngagementProvider, useEngagement } from '../context/EngagementContext'
import { STORAGE_KEY as LIBRARY_STORAGE_KEY } from '../lib/library'
import { STORAGE_KEY as ENGAGE_STORAGE_KEY } from '../lib/engagement'

const store = new Map<string, string>()

const publicUser = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'reader@example.com',
  username: 'readerone',
  displayName: 'Reader One',
  createdAt: '2026-08-24T00:00:00.000Z',
}

const emptyLibrary = {
  bookmarks: [] as Array<Record<string, unknown>>,
  history: [] as Array<Record<string, unknown>>,
  likedWebtoonIds: [] as string[],
}

const emptyPrefs = {
  notifPrefs: { newEpisode: true, commentReply: true, promotion: true },
  readerPrefs: { darkMode: true, brightness: 0.9, fontSize: 'md', imageFit: 'fit' },
}

const httpCatalog = {
  authors: [],
  genres: [],
  webtoons: [],
  episodes: [],
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
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

describe('library HTTP', () => {
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

  it('loads /api/library/me without writing softgate_library_v1', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      expect(init?.credentials).toBe('include')
      if (url.endsWith('/api/auth/me') && method === 'GET') {
        return jsonResponse({ data: publicUser }, 200)
      }
      if (url.endsWith('/api/catalog') && method === 'GET') {
        return jsonResponse({ data: httpCatalog }, 200)
      }
      if (url.endsWith('/api/library/me') && method === 'GET') {
        return jsonResponse(
          {
            data: {
              bookmarks: [
                {
                  webtoonId: 'wt-1',
                  addedAt: '2026-09-08T00:00:00.000Z',
                  lastNotifiedEpisodeNumber: 1,
                },
              ],
              history: [],
              likedWebtoonIds: [],
            },
          },
          200
        )
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

    const { result } = renderHook(() => useLibrary(), { wrapper })
    await waitFor(() => {
      expect(result.current.isReady).toBe(true)
    })
    expect(result.current.isBookmarked('wt-1')).toBe(true)
    expect(store.has(LIBRARY_STORAGE_KEY)).toBe(false)
  })

  it('subscribes through the API and does not write the library key', async () => {
    let snapshot = { ...emptyLibrary }
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
        return jsonResponse({ data: snapshot }, 200)
      }
      if (url.endsWith('/api/library/subscribe') && method === 'POST') {
        expect(JSON.parse(String(init?.body))).toEqual({ webtoonId: 'wt-1' })
        snapshot = {
          ...snapshot,
          bookmarks: [{ webtoonId: 'wt-1', addedAt: '2026-09-08T00:00:00.000Z' }],
        }
        return jsonResponse({ data: snapshot }, 200)
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

    const { result } = renderHook(() => useLibrary(), { wrapper })
    await waitFor(() => {
      expect(result.current.isReady).toBe(true)
    })
    act(() => {
      result.current.toggleBookmark('wt-1')
    })
    await waitFor(() => {
      expect(result.current.isBookmarked('wt-1')).toBe(true)
    })
    expect(store.has(LIBRARY_STORAGE_KEY)).toBe(false)
  })

  it('records history and likes on the API without writing engage history or likes', async () => {
    let snapshot = {
      bookmarks: [] as Array<Record<string, unknown>>,
      history: [] as Array<Record<string, unknown>>,
      likedWebtoonIds: [] as string[],
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
        return jsonResponse({ data: snapshot }, 200)
      }
      if (url.endsWith('/api/library/like') && method === 'POST') {
        snapshot = { ...snapshot, likedWebtoonIds: ['wt-1'] }
        return jsonResponse({ data: snapshot }, 200)
      }
      if (url.endsWith('/api/library/history') && method === 'POST') {
        const body = JSON.parse(String(init?.body)) as { scrollRatio?: number }
        expect(body).toEqual({ webtoonId: 'wt-1', episodeNumber: 2 })
        snapshot = {
          ...snapshot,
          history: [
            {
              webtoonId: 'wt-1',
              episodeNumber: 2,
              lastReadAt: '2026-09-08T00:00:00.000Z',
              scrollRatio: 0,
              readEpisodeNumbers: [2],
            },
          ],
        }
        return jsonResponse({ data: snapshot }, 200)
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
      expect(result.current.isReady).toBe(true)
    })
    act(() => {
      result.current.toggleLike('wt-1')
      result.current.recordHistory('wt-1', 2)
    })
    await waitFor(() => {
      expect(result.current.isLiked('wt-1')).toBe(true)
      expect(result.current.history).toHaveLength(1)
    })
    const engage = JSON.parse(store.get(ENGAGE_STORAGE_KEY) ?? '{}') as {
      byUserId?: Record<string, { history?: unknown[]; likedWebtoonIds?: string[] }>
    }
    expect(engage.byUserId?.[publicUser.id]?.history ?? []).toEqual([])
    expect(engage.byUserId?.[publicUser.id]?.likedWebtoonIds ?? []).toEqual([])
  })

  it('still writes ratings to softgate_engage_v1', async () => {
    const snapshot = {
      bookmarks: [],
      history: [
        {
          webtoonId: 'wt-1',
          episodeNumber: 1,
          lastReadAt: '2026-09-08T00:00:00.000Z',
          scrollRatio: 0,
          readEpisodeNumbers: [1],
        },
      ],
      likedWebtoonIds: [],
    }
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.endsWith('/api/auth/me')) {
        return jsonResponse({ data: publicUser }, 200)
      }
      if (url.endsWith('/api/catalog')) {
        return jsonResponse({ data: httpCatalog }, 200)
      }
      if (url.endsWith('/api/library/me')) {
        return jsonResponse({ data: snapshot }, 200)
      }
      if (url.endsWith('/api/notifications/me')) {
        return jsonResponse({ data: { notifications: [] } }, 200)
      }
      if (url.endsWith('/api/prefs/me')) {
        return jsonResponse({ data: emptyPrefs }, 200)
      }
      throw new Error(`unexpected ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useEngagement(), { wrapper })
    await waitFor(() => {
      expect(result.current.isReady).toBe(true)
      expect(result.current.history).toHaveLength(1)
    })
    act(() => {
      result.current.setRating('wt-1', 4.5)
    })
    expect(result.current.getRating('wt-1')).toBe(4.5)
    expect(store.has(ENGAGE_STORAGE_KEY)).toBe(true)
    const engage = JSON.parse(store.get(ENGAGE_STORAGE_KEY) ?? '{}') as {
      byUserId?: Record<string, { history?: unknown[]; likedWebtoonIds?: string[] }>
    }
    expect(engage.byUserId?.[publicUser.id]?.history).toEqual([])
    expect(engage.byUserId?.[publicUser.id]?.likedWebtoonIds).toEqual([])
  })

  it('does not fetch library for a guest', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (url.endsWith('/api/auth/me') && method === 'GET') {
        return jsonResponse({ error: { code: 'NOT_AUTHENTICATED' } }, 401)
      }
      if (url.endsWith('/api/auth/refresh') && method === 'POST') {
        return jsonResponse({ error: { code: 'NOT_AUTHENTICATED' } }, 401)
      }
      if (url.endsWith('/api/catalog') && method === 'GET') {
        return jsonResponse({ data: httpCatalog }, 200)
      }
      throw new Error(`unexpected ${method} ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(
      () => ({
        auth: useAuth(),
        library: useLibrary(),
      }),
      { wrapper }
    )
    await waitFor(() => {
      expect(result.current.auth.isLoading).toBe(false)
      expect(result.current.library.isReady).toBe(true)
    })
    expect(fetchMock.mock.calls.some(([input]) => String(input).includes('/api/library'))).toBe(
      false
    )
  })
})
