import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/AuthContext'

const store = new Map<string, string>()

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

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

describe('useAuth HTTP', () => {
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

  it('logs in from the API without writing softgate_user', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      expect(init?.credentials).toBe('include')
      if (url.endsWith('/api/auth/me') && method === 'GET') {
        return jsonResponse({ error: { code: 'NOT_AUTHENTICATED' } }, 401)
      }
      if (url.endsWith('/api/auth/refresh') && method === 'POST') {
        return jsonResponse({ error: { code: 'NOT_AUTHENTICATED' } }, 401)
      }
      if (url.endsWith('/api/auth/login') && method === 'POST') {
        return jsonResponse({ data: publicUser }, 200)
      }
      throw new Error(`unexpected ${method} ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.login('reader@example.com', 'password1')
    })

    expect(result.current.user?.email).toBe('reader@example.com')
    expect(result.current.isAuthenticated).toBe(true)
    expect(store.has('softgate_user')).toBe(false)
    expect(store.has('softgate_accounts_v1')).toBe(false)
  })

  it('posts profile writers without writing softgate_user', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (url.endsWith('/api/auth/me') && method === 'GET') {
        return jsonResponse({ data: publicUser }, 200)
      }
      if (url.endsWith('/api/auth/profile') && method === 'POST') {
        expect(JSON.parse(String(init?.body))).toEqual({ displayName: 'Next' })
        return jsonResponse({ data: { ...publicUser, displayName: 'Next' } }, 200)
      }
      if (url.endsWith('/api/auth/password') && method === 'POST') {
        expect(JSON.parse(String(init?.body))).toEqual({
          currentPassword: 'oldpass1',
          newPassword: 'newpass1',
        })
        return jsonResponse({ data: { ok: true } }, 200)
      }
      if (url.endsWith('/api/auth/delete-account') && method === 'POST') {
        expect(JSON.parse(String(init?.body))).toEqual({ password: 'password1' })
        return jsonResponse({ data: { ok: true } }, 200)
      }
      throw new Error(`unexpected ${method} ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => {
      expect(result.current.user?.email).toBe('reader@example.com')
    })

    await act(async () => {
      await result.current.updateProfile({ displayName: 'Next' })
    })
    expect(result.current.user?.displayName).toBe('Next')

    await act(async () => {
      await result.current.changePassword('oldpass1', 'newpass1')
    })

    await act(async () => {
      await result.current.deleteAccount('password1')
    })
    expect(result.current.user).toBeNull()
    expect(store.has('softgate_user')).toBe(false)
  })
})
