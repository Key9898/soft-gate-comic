import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SettingsProvider, useSettings } from '../context/SettingsContext'
import { FALLBACK_CONTACT_EMAIL } from '@softgate/shared'

const Probe = () => {
  const {
    isLoading,
    error,
    retry,
    maintenanceMode,
    allowRegistration,
    contactEmail,
    contactEmailFromSettings,
  } = useSettings()
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="error">{error ? 'yes' : 'no'}</span>
      <span data-testid="maintenance">{String(maintenanceMode)}</span>
      <span data-testid="register">{String(allowRegistration)}</span>
      <span data-testid="email">{contactEmail}</span>
      <span data-testid="from-settings">{String(contactEmailFromSettings)}</span>
      <button type="button" onClick={retry}>
        retry
      </button>
    </div>
  )
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('SettingsContext mock', () => {
  it('fails open with fallback email and no fetch', async () => {
    render(
      <SettingsProvider>
        <Probe />
      </SettingsProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })
    expect(screen.getByTestId('maintenance')).toHaveTextContent('false')
    expect(screen.getByTestId('register')).toHaveTextContent('true')
    expect(screen.getByTestId('email')).toHaveTextContent(FALLBACK_CONTACT_EMAIL)
    expect(screen.getByTestId('from-settings')).toHaveTextContent('false')
    expect(screen.getByTestId('error')).toHaveTextContent('no')
  })
})

describe('SettingsContext HTTP', () => {
  it('uses a present contactEmail and does not PUT', async () => {
    vi.stubEnv('VITE_USE_MOCK_API', 'false')
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.method ?? 'GET').not.toBe('PUT')
      expect(String(input)).toContain('/api/settings')
      expect(String(input)).not.toContain('/api/data')
      return new Response(
        JSON.stringify({
          data: {
            maintenanceMode: false,
            allowRegistration: true,
            contactEmail: 'ops@example.com',
            defaultLanguage: 'en',
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    render(
      <SettingsProvider>
        <Probe />
      </SettingsProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })
    expect(screen.getByTestId('email')).toHaveTextContent('ops@example.com')
    expect(screen.getByTestId('from-settings')).toHaveTextContent('true')
  })

  it('falls back when contactEmail is missing and fails open on error', async () => {
    vi.stubEnv('VITE_USE_MOCK_API', 'false')
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { maintenanceMode: true } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
      .mockResolvedValueOnce(new Response('', { status: 500 }))
    vi.stubGlobal('fetch', fetchMock)

    render(
      <SettingsProvider>
        <Probe />
      </SettingsProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('maintenance')).toHaveTextContent('true')
    })
    expect(screen.getByTestId('email')).toHaveTextContent(FALLBACK_CONTACT_EMAIL)
    expect(screen.getByTestId('from-settings')).toHaveTextContent('false')

    await userEvent.click(screen.getByRole('button', { name: 'retry' }))
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('yes')
    })
    expect(screen.getByTestId('maintenance')).toHaveTextContent('false')
    expect(screen.getByTestId('register')).toHaveTextContent('true')
    expect(screen.getByTestId('email')).toHaveTextContent(FALLBACK_CONTACT_EMAIL)
  })
})
