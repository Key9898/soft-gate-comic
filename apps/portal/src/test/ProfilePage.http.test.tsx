import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { LibraryProvider } from '../context/LibraryContext'
import { WalletProvider } from '../context/WalletContext'
import { EngagementProvider } from '../context/EngagementContext'
import ProfilePage from '../features/profile/ProfilePage'
import type { ReactNode } from 'react'

const publicUser = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'reader@example.com',
  username: 'readerone',
  displayName: 'Reader One',
  bio: 'Hi',
  createdAt: '2026-08-24T00:00:00.000Z',
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

const tree = ({ children }: { children: ReactNode }) => (
  <HelmetProvider>
    <DataProvider>
      <MemoryRouter initialEntries={['/profile']}>
        <AuthProvider>
          <LibraryProvider>
            <WalletProvider>
              <EngagementProvider>{children}</EngagementProvider>
            </WalletProvider>
          </LibraryProvider>
        </AuthProvider>
      </MemoryRouter>
    </DataProvider>
  </HelmetProvider>
)

describe('ProfilePage HTTP', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_USE_MOCK_API', 'false')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('saves on the API and does not show demo-device copy', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (url.endsWith('/api/auth/me') && method === 'GET') {
        return jsonResponse({ data: publicUser }, 200)
      }
      if (url.endsWith('/api/catalog') && method === 'GET') {
        return jsonResponse({ data: httpCatalog }, 200)
      }
      if (url.endsWith('/api/wallet/me') && method === 'GET') {
        return jsonResponse(
          { data: { balance: 150, transactions: [], unlockedEpisodeKeys: [] } },
          200
        )
      }
      if (url.endsWith('/api/library/me') && method === 'GET') {
        return jsonResponse({ data: { bookmarks: [], history: [], likedWebtoonIds: [] } }, 200)
      }
      if (url.endsWith('/api/notifications/me') && method === 'GET') {
        return jsonResponse({ data: { notifications: [] } }, 200)
      }
      if (url.endsWith('/api/prefs/me') && method === 'GET') {
        return jsonResponse(
          {
            data: {
              notifPrefs: { newEpisode: true, commentReply: true, promotion: true },
              readerPrefs: { darkMode: true, brightness: 0.9, fontSize: 'md', imageFit: 'fit' },
            },
          },
          200
        )
      }
      if (url.endsWith('/api/auth/profile') && method === 'POST') {
        expect(JSON.parse(String(init?.body))).toEqual({
          displayName: 'Reader One',
          email: 'reader@example.com',
          bio: 'Hi',
        })
        return jsonResponse({ data: publicUser }, 200)
      }
      throw new Error(`unexpected ${method} ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup({ delay: null })
    render(<ProfilePage />, { wrapper: tree })
    expect(await screen.findByRole('heading', { level: 1, name: 'Reader One' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /edit profile/i }))
    await user.click(screen.getByRole('button', { name: /save changes/i }))
    expect(await screen.findByText('Profile saved.')).toBeInTheDocument()
    expect(screen.queryByText('Profile saved on this device.')).not.toBeInTheDocument()
    expect(screen.queryByText(/not saved on the API yet/i)).not.toBeInTheDocument()
  })
})
