import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { LibraryProvider } from '../context/LibraryContext'
import { getAccountByEmail, upsertAccount, userIdFromEmail } from '../lib/auth'
import ResetPasswordPage from '../features/auth/ResetPasswordPage'

const store = new Map<string, string>()

function installStorage() {
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
}

function renderReset(path: string) {
  return render(
    <HelmetProvider>
      <DataProvider>
        <MemoryRouter initialEntries={[path]}>
          <AuthProvider>
            <LibraryProvider>
              <Routes>
                <Route path="/reset-password/:token?" element={<ResetPasswordPage />} />
              </Routes>
            </LibraryProvider>
          </AuthProvider>
        </MemoryRouter>
      </DataProvider>
    </HelmetProvider>
  )
}

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    installStorage()
    upsertAccount({
      id: userIdFromEmail('reader@softgate.test'),
      email: 'reader@softgate.test',
      username: 'reader',
      displayName: 'Reader',
      password: 'secret12',
      bio: '',
      createdAt: new Date().toISOString(),
    })
  })

  it('shows an incomplete link when no token is present', () => {
    renderReset('/reset-password')
    expect(screen.getByRole('heading', { name: /incomplete link/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /go to forgot password/i })).toHaveAttribute(
      'href',
      '/forgot-password'
    )
  })

  it('accepts new password fields with a token without saving', async () => {
    const user = userEvent.setup({ delay: null })
    renderReset('/reset-password/future-token')
    await user.type(screen.getByLabelText(/^new password$/i), 'changed99')
    await user.type(screen.getByLabelText(/confirm password/i), 'changed99')
    await user.click(screen.getByRole('button', { name: /set new password/i }))
    expect(screen.getByText(/demo password is unchanged/i)).toBeInTheDocument()
    expect(getAccountByEmail('reader@softgate.test')?.password).toBe('secret12')
  })
})
