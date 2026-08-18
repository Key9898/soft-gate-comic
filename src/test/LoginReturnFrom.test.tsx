import { describe, expect, it, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { LibraryProvider } from '../context/LibraryContext'
import { upsertAccount, userIdFromEmail } from '../lib/auth'
import LoginPage from '../features/auth/LoginPage'

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

function renderLoginAtFrom(fromPath: string) {
  return render(
    <HelmetProvider>
      <DataProvider>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/login',
              state: { from: { pathname: fromPath, search: '' } },
            },
          ]}
        >
          <AuthProvider>
            <LibraryProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path={fromPath} element={<div>Returned to detail</div>} />
                <Route path="/" element={<div>Home fallback</div>} />
              </Routes>
            </LibraryProvider>
          </AuthProvider>
        </MemoryRouter>
      </DataProvider>
    </HelmetProvider>
  )
}

describe('LoginPage return from', () => {
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

  it('navigates back to ProtectedRoute from location after login', async () => {
    const user = userEvent.setup()
    renderLoginAtFrom('/webtoon/wt-1')

    await user.type(screen.getByLabelText(/^email$/i), 'reader@softgate.test')
    await user.type(screen.getByLabelText(/^password$/i), 'secret12')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(
      () => {
        expect(screen.getByText('Returned to detail')).toBeInTheDocument()
      },
      { timeout: 4000 }
    )
  })
})
