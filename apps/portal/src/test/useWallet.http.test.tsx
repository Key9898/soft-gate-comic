import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { WalletProvider, useWallet } from '../context/WalletContext'
import { STORAGE_KEY as WALLET_STORAGE_KEY } from '../lib/wallet'

const store = new Map<string, string>()

const publicUser = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'reader@example.com',
  username: 'readerone',
  displayName: 'Reader One',
  createdAt: '2026-08-24T00:00:00.000Z',
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
      <WalletProvider>{children}</WalletProvider>
    </AuthProvider>
  </MemoryRouter>
)

describe('useWallet HTTP', () => {
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

  it('loads /api/wallet/me without writing softgate_wallet_v1', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      expect(init?.credentials).toBe('include')
      if (url.endsWith('/api/auth/me') && method === 'GET') {
        return jsonResponse({ data: publicUser }, 200)
      }
      if (url.endsWith('/api/wallet/me') && method === 'GET') {
        return jsonResponse(
          {
            data: {
              balance: 150,
              transactions: [],
              unlockedEpisodeKeys: [],
            },
          },
          200
        )
      }
      throw new Error(`unexpected ${method} ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useWallet(), { wrapper })
    await waitFor(() => {
      expect(result.current.isReady).toBe(true)
    })
    expect(result.current.balance).toBe(150)
    expect(store.has(WALLET_STORAGE_KEY)).toBe(false)
  })

  it('unlocks through the API and ignores localStorage', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (url.endsWith('/api/auth/me') && method === 'GET') {
        return jsonResponse({ data: publicUser }, 200)
      }
      if (url.endsWith('/api/wallet/me') && method === 'GET') {
        return jsonResponse(
          { data: { balance: 150, transactions: [], unlockedEpisodeKeys: [] } },
          200
        )
      }
      if (url.endsWith('/api/wallet/unlock') && method === 'POST') {
        expect(JSON.parse(String(init?.body))).toEqual({ webtoonId: '1', episodeNumber: 4 })
        return jsonResponse(
          {
            data: {
              balance: 145,
              transactions: [],
              unlockedEpisodeKeys: ['1:4'],
            },
          },
          200
        )
      }
      throw new Error(`unexpected ${method} ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useWallet(), { wrapper })
    await waitFor(() => {
      expect(result.current.isReady).toBe(true)
    })

    let unlocked: Awaited<ReturnType<typeof result.current.unlockEpisode>> | undefined
    await act(async () => {
      unlocked = await result.current.unlockEpisode('1', 4, 0, 'ignored')
    })
    expect(unlocked).toEqual({ ok: true })
    expect(result.current.balance).toBe(145)
    expect(result.current.isEpisodeUnlocked('1', 4)).toBe(true)
    expect(store.has(WALLET_STORAGE_KEY)).toBe(false)
  })

  it('does not fetch wallet for a guest', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (url.endsWith('/api/auth/me') && method === 'GET') {
        return jsonResponse({ error: { code: 'NOT_AUTHENTICATED' } }, 401)
      }
      if (url.endsWith('/api/auth/refresh') && method === 'POST') {
        return jsonResponse({ error: { code: 'NOT_AUTHENTICATED' } }, 401)
      }
      throw new Error(`unexpected ${method} ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(
      () => ({
        auth: useAuth(),
        wallet: useWallet(),
      }),
      { wrapper }
    )
    await waitFor(() => {
      expect(result.current.auth.isLoading).toBe(false)
      expect(result.current.wallet.isReady).toBe(true)
    })
    expect(result.current.wallet.balance).toBe(0)
    expect(fetchMock.mock.calls.some(([input]) => String(input).includes('/api/wallet'))).toBe(
      false
    )
  })
})
