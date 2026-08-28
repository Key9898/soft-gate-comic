import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SettingsProvider } from '../context/SettingsContext'
import MaintenanceGate from '../components/MaintenanceGate'
import RegisterPage from '../features/auth/RegisterPage'
import { AuthProvider } from '../context/AuthContext'
import { HelmetProvider } from 'react-helmet-async'

const jsonOk = (data: unknown) =>
  new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })

const stubSettings = (settings: Record<string, unknown>) => {
  vi.stubEnv('VITE_USE_MOCK_API', 'false')
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      expect(String(input)).toContain('/api/settings')
      return jsonOk(settings)
    })
  )
}

const renderGate = (path: string) =>
  render(
    <SettingsProvider>
      <MemoryRouter initialEntries={[path]}>
        <MaintenanceGate>
          <Routes>
            <Route path="/" element={<div>home-open</div>} />
            <Route path="/maintenance" element={<div>site-closed</div>} />
            <Route path="/read/:webtoonId/:episodeNumber" element={<div>reader-open</div>} />
            <Route path="/register" element={<div>register-open</div>} />
            <Route path="/login" element={<div>login-open</div>} />
            <Route path="/contact" element={<div>contact-open</div>} />
          </Routes>
        </MaintenanceGate>
      </MemoryRouter>
    </SettingsProvider>
  )

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('MaintenanceGate', () => {
  it('redirects product and register paths when maintenance is on', async () => {
    stubSettings({
      maintenanceMode: true,
      allowRegistration: true,
      contactEmail: 'ops@example.com',
    })
    renderGate('/')
    expect(await screen.findByText('site-closed')).toBeInTheDocument()
  })

  it('redirects the reader when maintenance is on', async () => {
    stubSettings({ maintenanceMode: true })
    renderGate('/read/1/1')
    expect(await screen.findByText('site-closed')).toBeInTheDocument()
  })

  it('keeps login and contact open during maintenance', async () => {
    stubSettings({ maintenanceMode: true })
    const login = renderGate('/login')
    expect(await screen.findByText('login-open')).toBeInTheDocument()
    login.unmount()
    renderGate('/contact')
    expect(await screen.findByText('contact-open')).toBeInTheDocument()
  })

  it('sends /register to maintenance during site close', async () => {
    stubSettings({ maintenanceMode: true, allowRegistration: true })
    renderGate('/register')
    expect(await screen.findByText('site-closed')).toBeInTheDocument()
  })
})

describe('RegisterPage closed panel', () => {
  it('shows the sign-up paused panel when allowRegistration is false', async () => {
    stubSettings({ maintenanceMode: false, allowRegistration: false })
    render(
      <HelmetProvider>
        <SettingsProvider>
          <MemoryRouter initialEntries={['/register']}>
            <AuthProvider>
              <RegisterPage />
            </AuthProvider>
          </MemoryRouter>
        </SettingsProvider>
      </HelmetProvider>
    )
    expect(
      await screen.findByRole('heading', { name: /new accounts are paused/i })
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /create account/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in instead/i })).toHaveAttribute('href', '/login')
  })

  it('keeps the form open in mock defaults', async () => {
    render(
      <HelmetProvider>
        <SettingsProvider>
          <MemoryRouter initialEntries={['/register']}>
            <AuthProvider>
              <RegisterPage />
            </AuthProvider>
          </MemoryRouter>
        </SettingsProvider>
      </HelmetProvider>
    )
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })
  })
})
