import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { LibraryProvider } from '../context/LibraryContext'
import { EngagementProvider, useEngagement } from '../context/EngagementContext'
import { STORAGE_KEY as LIBRARY_STORAGE_KEY } from '../lib/library'
import { STORAGE_KEY as NOTIFICATIONS_STORAGE_KEY, PREFS_STORAGE_KEY } from '../lib/notifications'

const store = new Map<string, string>()

const publicUser = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'reader@example.com',
  username: 'readerone',
  displayName: 'Reader One',
  createdAt: '2026-08-24T00:00:00.000Z',
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

const emptyPrefs = {
  notifPrefs: { newEpisode: true, commentReply: true, promotion: true },
  readerPrefs: { darkMode: true, brightness: 0.9, fontSize: 'md', imageFit: 'fit' },
}

const notice = {
  id: 'sub-wt-1-4',
  type: 'new_episode',
  titleKey: 'notificationsPage.newEpisode',
  message: 'Episode 4 of Title is out.',
  isRead: false,
  createdAt: '2026-09-08T12:00:00.000Z',
  href: '/webtoon/wt-1',
  data: { webtoonId: 'wt-1', episodeNumber: 4 },
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

describe('notifications HTTP', () => {
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

  it('does not catalog-scan subscribe notices; GET /me is source of truth', async () => {
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
      expect(result.current.isReady).toBe(true)
      expect(result.current.prefsHydrated).toBe(true)
    })
    expect(result.current.notifications.some((item) => item.id === 'sub-wt-1-4')).toBe(false)
    expect(store.has(NOTIFICATIONS_STORAGE_KEY)).toBe(false)
    expect(store.has(LIBRARY_STORAGE_KEY)).toBe(false)
    expect(
      fetchMock.mock.calls.some(
        ([input, init]) =>
          String(input).endsWith('/api/notifications/upsert') && init?.method === 'POST'
      )
    ).toBe(false)
  })

  it('marks read through POST and saves prefs on the API', async () => {
    let inbox = [{ ...notice }]
    let prefs = { ...emptyPrefs }
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
        return jsonResponse({ data: { notifications: inbox } }, 200)
      }
      if (url.endsWith('/api/prefs/me') && method === 'GET') {
        return jsonResponse({ data: prefs }, 200)
      }
      if (url.endsWith('/api/prefs/notif') && method === 'POST') {
        expect(JSON.parse(String(init?.body))).toEqual({ newEpisode: false })
        prefs = {
          ...prefs,
          notifPrefs: { ...prefs.notifPrefs, newEpisode: false },
        }
        return jsonResponse({ data: prefs }, 200)
      }
      if (url.endsWith('/api/notifications/upsert') && method === 'POST') {
        const body = JSON.parse(String(init?.body)) as { notification: typeof notice }
        inbox = [body.notification]
        return jsonResponse({ data: { notifications: inbox } }, 200)
      }
      if (url.endsWith('/api/notifications/read') && method === 'POST') {
        expect(JSON.parse(String(init?.body))).toEqual({ id: 'sub-wt-1-4' })
        inbox = inbox.map((item) => ({ ...item, isRead: true }))
        return jsonResponse({ data: { notifications: inbox } }, 200)
      }
      throw new Error(`unexpected ${method} ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useEngagement(), { wrapper })
    await waitFor(() => {
      expect(result.current.notifications.some((item) => item.id === 'sub-wt-1-4')).toBe(true)
    })
    act(() => {
      result.current.markNotificationRead('sub-wt-1-4')
    })
    await waitFor(() => {
      expect(result.current.notifications.find((item) => item.id === 'sub-wt-1-4')?.isRead).toBe(
        true
      )
    })
    expect(store.has(NOTIFICATIONS_STORAGE_KEY)).toBe(false)

    act(() => {
      result.current.setNotifPrefs({ newEpisode: false })
    })
    await waitFor(() => {
      expect(result.current.notifPrefs.newEpisode).toBe(false)
    })
    expect(store.has(PREFS_STORAGE_KEY)).toBe(false)
    expect(store.has(NOTIFICATIONS_STORAGE_KEY)).toBe(false)
  })
})
