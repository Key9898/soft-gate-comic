import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider } from '../context/AuthContext'
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage'

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function renderForgot() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/forgot-password']}>
        <AuthProvider>
          <Routes>
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    </HelmetProvider>
  )
}

describe('ForgotPasswordPage HTTP', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_USE_MOCK_API', 'false')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('posts forgot and does not show the demo OTP', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (url.endsWith('/api/auth/me') && method === 'GET') {
        return jsonResponse({ error: { code: 'NOT_AUTHENTICATED' } }, 401)
      }
      if (url.endsWith('/api/auth/refresh') && method === 'POST') {
        return jsonResponse({ error: { code: 'NOT_AUTHENTICATED' } }, 401)
      }
      if (url.endsWith('/api/auth/forgot') && method === 'POST') {
        expect(init?.credentials).toBe('include')
        expect(JSON.parse(String(init?.body))).toEqual({ email: 'anyone@example.com' })
        return jsonResponse({ data: { ok: true } }, 200)
      }
      throw new Error(`unexpected ${method} ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup({ delay: null })
    renderForgot()
    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })
    await user.type(screen.getByLabelText(/email/i), 'anyone@example.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))
    expect(await screen.findByText(/if that account exists/i)).toBeInTheDocument()
    expect(screen.queryByText(/not emailed/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/one-time code/i)).not.toBeInTheDocument()
  })
})
