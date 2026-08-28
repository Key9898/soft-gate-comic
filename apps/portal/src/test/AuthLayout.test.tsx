import { describe, it, expect } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { SettingsProvider } from '../context/SettingsContext'
import { LibraryProvider } from '../context/LibraryContext'
import AuthLayout from '../layouts/AuthLayout'
import LoginPage from '../features/auth/LoginPage'
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage'
import RegisterPage from '../features/auth/RegisterPage'

function renderAuth(path: string) {
  return render(
    <HelmetProvider>
      <DataProvider>
        <MemoryRouter initialEntries={[path]}>
          <SettingsProvider>
            <AuthProvider>
              <LibraryProvider>
                <Routes>
                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  </Route>
                </Routes>
              </LibraryProvider>
            </AuthProvider>
          </SettingsProvider>
        </MemoryRouter>
      </DataProvider>
    </HelmetProvider>
  )
}

describe('AuthLayout', () => {
  it('shows skip link, logo home, and language switch without catalog nav', () => {
    renderAuth('/login')
    expect(screen.getByRole('link', { name: /skip to/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /softgate comic logo/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('button', { name: /switch to/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /^categories$/i })).not.toBeInTheDocument()
  })

  it('puts the reading-room photo on the split card, not the page wash', () => {
    const { container } = renderAuth('/login')
    expect(container.querySelector('.radial-wash-primary')).toBeTruthy()
    expect(container.firstElementChild?.className).not.toContain(
      "bg-[url('/auth/reading-room-lg.jpg')]"
    )
    expect(screen.getByTestId('auth-split-card')).toHaveAttribute('data-view', 'login')
    expect(screen.getByTestId('auth-split-bg').className).toContain(
      "bg-[url('/auth/reading-room-lg.jpg')]"
    )
  })

  it('does not use the split card on forgot-password', () => {
    renderAuth('/forgot-password')
    expect(screen.queryByTestId('auth-split-card')).not.toBeInTheDocument()
  })

  it('keeps both forms glued and only slides the photo on login', () => {
    renderAuth('/login')
    const loginPane = screen.getByTestId('auth-split-form-login')
    const registerPane = screen.getByTestId('auth-split-form-register')
    expect(loginPane.className).not.toMatch(/translate-x-full/)
    expect(registerPane.className).not.toMatch(/translate-x-full/)
    expect(loginPane.className).toMatch(/lg:left-0/)
    expect(registerPane.className).toMatch(/lg:left-1\/2/)
    expect(screen.getByTestId('auth-split-bg').className).toMatch(/translate-x-full/)
    expect(screen.getByRole('heading', { name: /continue in this browser/i })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /create a reader account/i })
    ).not.toBeInTheDocument()
  })

  it('slides the photo left on register without moving the form panes', () => {
    renderAuth('/register')
    expect(screen.getByTestId('auth-split-card')).toHaveAttribute('data-view', 'register')
    expect(screen.getByTestId('auth-split-form-login').className).not.toMatch(/translate-x-full/)
    expect(screen.getByTestId('auth-split-form-register').className).not.toMatch(/translate-x-full/)
    expect(screen.getByTestId('auth-split-bg').className).not.toMatch(/translate-x-full/)
    expect(screen.getByRole('heading', { name: /create a reader account/i })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /continue in this browser/i })
    ).not.toBeInTheDocument()
  })
})
