import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import userEvent from '@testing-library/user-event'
import { render as renderRtl, screen as screenRtl } from '@testing-library/react'
import { render, screen } from './utils'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { LibraryProvider } from '../context/LibraryContext'
import { WalletProvider } from '../context/WalletContext'
import { EngagementProvider } from '../context/EngagementContext'
import ProfilePage from '../features/profile/ProfilePage'
import Navigation from '../components/Navigation/Navigation'
import { addNotification, getNotifPrefs } from '../lib/notifications'
import { loadReaderPrefs } from '../lib/reader'
import type { ReactNode } from 'react'

const store = new Map<string, string>()

const sessionUser = {
  id: 'u_test',
  email: 'test@example.com',
  username: 'testuser',
  displayName: 'Test User',
  createdAt: '2026-01-01T00:00:00.000Z',
}

const AccountTree = ({ children, entry }: { children: ReactNode; entry: string }) => (
  <HelmetProvider>
    <DataProvider>
      <MemoryRouter initialEntries={[entry]}>
        <AuthProvider>
          <LibraryProvider>
            <WalletProvider>
              <EngagementProvider>{children}</EngagementProvider>
            </WalletProvider>
          </LibraryProvider>
        </AuthProvider>
      </MemoryRouter>
    </DataProvider>
  </HelmetProvider>
)

describe('ProfilePage', () => {
  beforeEach(() => {
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
    store.set('softgate_user', JSON.stringify(sessionUser))
  })

  it('renders the profile card for a logged-in user', () => {
    render(<ProfilePage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Test User' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument()
  })

  it('uses the max-w-7xl shell with the sidebar grid intact', () => {
    const { container } = render(<ProfilePage />)
    const shell = container.querySelector('div.mx-auto.max-w-7xl')
    expect(shell).toBeTruthy()
    expect(shell?.querySelector('.lg\\:grid-cols-4')).toBeTruthy()
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<ProfilePage />)
    expect(container.textContent).not.toMatch(/profilePage\.[a-zA-Z]/)
    expect(container.textContent).not.toMatch(/common\.[a-zA-Z]/)
  })

  it('opens Security when tab=security', () => {
    renderRtl(
      <AccountTree entry="/profile?tab=security">
        <ProfilePage />
      </AccountTree>
    )
    expect(screenRtl.getByRole('heading', { name: 'Delete Account' })).toBeInTheDocument()
  })

  it('persists in-app notification toggles from Settings', async () => {
    const user = userEvent.setup({ delay: null })
    renderRtl(
      <AccountTree entry="/profile?tab=settings">
        <ProfilePage />
      </AccountTree>
    )
    await user.click(screenRtl.getByRole('switch', { name: 'Promotions' }))
    expect(getNotifPrefs('u_test').promotion).toBe(false)
    expect(screenRtl.getAllByText('Same as this switch').length).toBeGreaterThan(0)
    expect(screenRtl.queryByText('When mail ships')).not.toBeInTheDocument()
  })

  it('writes reader prefs from the Preferences tab', async () => {
    const user = userEvent.setup({ delay: null })
    renderRtl(
      <AccountTree entry="/profile?tab=preferences">
        <ProfilePage />
      </AccountTree>
    )
    await user.click(screenRtl.getByRole('button', { name: /light mode/i }))
    expect(loadReaderPrefs().darkMode).toBe(false)
  })

  it('drops the nav unread dot when promotions are toggled off', async () => {
    addNotification('u_test', {
      id: 'promo-1',
      type: 'promotion',
      titleKey: 'notificationsPage.promotion',
      message: 'Demo offer',
      isRead: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      href: '/coins',
    })
    const user = userEvent.setup({ delay: null })
    renderRtl(
      <AccountTree entry="/profile?tab=settings">
        <Navigation />
        <ProfilePage />
      </AccountTree>
    )
    const bell = screenRtl.getByRole('link', { name: 'Notifications' })
    expect(bell.querySelector('.bg-accent-600')).toBeTruthy()
    await user.click(screenRtl.getByRole('switch', { name: 'Promotions' }))
    expect(bell.querySelector('.bg-accent-600')).toBeFalsy()
  })

  it('rejects an oversized jpeg on the avatar picker', async () => {
    const user = userEvent.setup({ delay: null })
    render(<ProfilePage />)
    const input = screen.getByLabelText('Change avatar')
    const file = new File([new Uint8Array(524289)], 'a.jpg', { type: 'image/jpeg' })
    await user.upload(input, file)
    expect(await screen.findByText('Use a JPEG, PNG, or WebP under 512 KB.')).toBeInTheDocument()
  })
})
