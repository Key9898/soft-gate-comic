import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/AuthContext'

const store = new Map<string, string>()

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
  })

  it('provides initial unauthenticated state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    expect(result.current.isLoading).toBe(false)
  })

  it('sets isLoading to false after initialization', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    expect(result.current.isLoading).toBe(false)
  })

  it('register then login sets user with stable id', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    await act(async () => {
      await result.current.register({
        username: 'testuser',
        displayName: 'Test User',
        email: 'test@example.com',
        password: 'password',
      })
    })
    expect(result.current.user).not.toBeNull()
    expect(result.current.user?.username).toBe('testuser')
    expect(result.current.user?.id).toMatch(/^u_/)
    expect(result.current.isAuthenticated).toBe(true)

    act(() => {
      result.current.logout()
    })

    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })
    expect(result.current.user?.email).toBe('test@example.com')
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('login rejects wrong password', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    await act(async () => {
      await result.current.register({
        username: 'testuser',
        displayName: 'Test User',
        email: 'test@example.com',
        password: 'password',
      })
    })
    act(() => {
      result.current.logout()
    })
    await expect(
      act(async () => {
        await result.current.login('test@example.com', 'wrongpass')
      })
    ).rejects.toThrow()
  })

  it('logout function clears user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    await act(async () => {
      await result.current.register({
        username: 'testuser',
        displayName: 'Test User',
        email: 'test@example.com',
        password: 'password',
      })
    })
    expect(result.current.isAuthenticated).toBe(true)
    act(() => {
      result.current.logout()
    })
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('throws error when used outside AuthProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')
    consoleError.mockRestore()
  })
})
