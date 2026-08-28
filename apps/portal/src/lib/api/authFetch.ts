import { unwrapApiData } from '@softgate/contracts'

const apiBaseUrl = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export class AuthApiError extends Error {
  readonly code: string
  readonly status: number

  constructor(code: string, status: number) {
    super(code)
    this.name = 'AuthApiError'
    this.code = code
    this.status = status
  }
}

function errorCodeFrom(payload: unknown) {
  if (payload && typeof payload === 'object' && 'error' in payload) {
    const error = (payload as { error?: { code?: unknown } }).error
    if (error && typeof error.code === 'string') return error.code
  }
  return 'AUTH_REQUEST_FAILED'
}

export async function authFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  })

  const payload: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    throw new AuthApiError(errorCodeFrom(payload), res.status)
  }

  const data = unwrapApiData<T>(payload)
  if (data == null) {
    throw new AuthApiError('AUTH_REQUEST_FAILED', res.status)
  }
  return data
}
