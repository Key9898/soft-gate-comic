import { beforeEach, describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from './utils'
import NotificationsPage from '../features/notifications/NotificationsPage'
import { addNotification, setNotifPrefs } from '../lib/notifications'

const store = new Map<string, string>()

const sessionUser = {
  id: 'u_test',
  email: 'test@example.com',
  username: 'testuser',
  displayName: 'Test User',
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('NotificationsPage', () => {
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

  it('renders the page heading', () => {
    render(<NotificationsPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Notifications' })).toBeInTheDocument()
  })

  it('uses the max-w-7xl shell with a left-aligned max-w-3xl inner column', () => {
    const { container } = render(<NotificationsPage />)
    const shell = container.querySelector('div.mx-auto.max-w-7xl')
    expect(shell).toBeTruthy()
    const inner = shell?.querySelector(':scope > div.max-w-3xl')
    expect(inner).toBeTruthy()
    expect(inner?.className).not.toMatch(/mx-auto/)
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<NotificationsPage />)
    expect(container.textContent).not.toMatch(/notificationsPage\.[a-zA-Z]/)
  })

  it('shows an empty first-time inbox with recovery CTAs', async () => {
    render(<NotificationsPage />)
    expect(await screen.findByText(/you.re all caught up/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Webtoons' })).toHaveAttribute('href', '/categories')
    expect(screen.getAllByRole('link', { name: 'Settings' })[0]).toHaveAttribute(
      'href',
      '/profile?tab=settings'
    )
  })

  it('uses a destination link for a new-episode row', async () => {
    addNotification('u_test', {
      id: 'ep-1',
      type: 'new_episode',
      titleKey: 'notificationsPage.newEpisode',
      message: 'Episode ready',
      isRead: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      href: '/webtoon/1',
      data: { webtoonId: '1', episodeNumber: 2 },
    })
    render(<NotificationsPage />)
    expect(await screen.findByRole('link', { name: /new episode available/i })).toHaveAttribute(
      'href',
      '/webtoon/1'
    )
  })

  it('hides promo rows when the promotion pref is off', async () => {
    addNotification('u_test', {
      id: 'promo-hide',
      type: 'promotion',
      titleKey: 'notificationsPage.promotion',
      message: 'Hidden offer',
      isRead: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      href: '/coins',
    })
    setNotifPrefs('u_test', { promotion: false })
    render(<NotificationsPage />)
    expect(await screen.findByText(/you.re all caught up/i)).toBeInTheDocument()
    expect(screen.queryByText('Hidden offer')).not.toBeInTheDocument()
  })

  it('filters the inbox to promo rows', async () => {
    addNotification('u_test', {
      id: 'ep-2',
      type: 'new_episode',
      titleKey: 'notificationsPage.newEpisode',
      message: 'Episode ready',
      isRead: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      href: '/webtoon/1',
    })
    addNotification('u_test', {
      id: 'promo-show',
      type: 'promotion',
      titleKey: 'notificationsPage.promotion',
      message: 'Visible offer',
      isRead: false,
      createdAt: '2026-01-02T00:00:00.000Z',
      href: '/coins',
    })
    const user = userEvent.setup({ delay: null })
    render(<NotificationsPage />)
    await screen.findByText('Visible offer')
    await user.click(screen.getByRole('button', { name: 'Promo' }))
    expect(screen.getByText('Visible offer')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText('Episode ready')).not.toBeInTheDocument()
    })
  })
})
