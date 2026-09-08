import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import ResetPasswordPage from '../features/auth/ResetPasswordPage'

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function renderReset(path: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/reset-password/:token?" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  )
}

describe('ResetPasswordPage HTTP', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_USE_MOCK_API', 'false')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('does not call the API when the token is missing', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    renderReset('/reset-password')
    expect(screen.getByRole('heading', { name: /incomplete link/i })).toBeInTheDocument()
    expect(screen.getByText(/missing or no longer valid/i)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('posts the new password with the token', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (url.endsWith('/api/auth/reset') && method === 'POST') {
        expect(JSON.parse(String(init?.body))).toEqual({
          token: 'future-token',
          password: 'changed99',
        })
        return jsonResponse({ data: { ok: true } }, 200)
      }
      throw new Error(`unexpected ${method} ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup({ delay: null })
    renderReset('/reset-password/future-token')
    await user.type(screen.getByLabelText(/^new password$/i), 'changed99')
    await user.type(screen.getByLabelText(/confirm password/i), 'changed99')
    await user.click(screen.getByRole('button', { name: /set new password/i }))
    expect(await screen.findByText(/successfully reset/i)).toBeInTheDocument()
    expect(screen.queryByText(/demo password is unchanged/i)).not.toBeInTheDocument()
  })
})
