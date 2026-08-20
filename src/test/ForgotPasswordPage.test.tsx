import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { LibraryProvider } from '../context/LibraryContext'
import {
  DEMO_PASSWORD_RESET_OTP,
  getAccountByEmail,
  upsertAccount,
  userIdFromEmail,
  writeSession,
} from '../lib/auth'
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage'

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

function renderForgot() {
  return render(
    <HelmetProvider>
      <DataProvider>
        <MemoryRouter initialEntries={['/forgot-password']}>
          <AuthProvider>
            <LibraryProvider>
              <Routes>
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              </Routes>
            </LibraryProvider>
          </AuthProvider>
        </MemoryRouter>
      </DataProvider>
    </HelmetProvider>
  )
}

describe('ForgotPasswordPage', () => {
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

  it('walks email, mock OTP, and password without saving a new password', async () => {
    const user = userEvent.setup({ delay: null })
    renderForgot()
    await user.type(screen.getByLabelText(/email/i), 'anyone@example.com')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByText(/not emailed/i)).toBeInTheDocument()
    expect(screen.queryByText(/email not found/i)).not.toBeInTheDocument()
    await user.type(screen.getByLabelText(/one-time code/i), DEMO_PASSWORD_RESET_OTP)
    await user.click(screen.getByRole('button', { name: /verify code/i }))
    await user.type(screen.getByLabelText(/^new password$/i), 'changed99')
    await user.type(screen.getByLabelText(/confirm password/i), 'changed99')
    await user.click(screen.getByRole('button', { name: /set new password/i }))
    expect(screen.getByText(/demo password is unchanged/i)).toBeInTheDocument()
    expect(getAccountByEmail('reader@softgate.test')?.password).toBe('secret12')
  })

  it('locks email to the session mailbox when signed in', async () => {
    writeSession({
      id: userIdFromEmail('reader@softgate.test'),
      email: 'reader@softgate.test',
      username: 'reader',
      displayName: 'Reader',
      createdAt: new Date().toISOString(),
    })
    renderForgot()
    const email = await screen.findByLabelText(/email/i)
    expect(email).toHaveValue('reader@softgate.test')
    expect(email).toHaveAttribute('readonly')
  })

  it('links to help, contact, and login', () => {
    renderForgot()
    expect(screen.getByRole('link', { name: /help center/i })).toHaveAttribute('href', '/help')
    expect(screen.getByRole('link', { name: /^contact$/i })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: /back to login/i })).toHaveAttribute('href', '/login')
  })
})
