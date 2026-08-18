import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from './utils'
import ProfilePage from '../features/profile/ProfilePage'

const store = new Map<string, string>()

const sessionUser = {
  id: 'u_test',
  email: 'test@example.com',
  username: 'testuser',
  displayName: 'Test User',
  createdAt: '2026-01-01T00:00:00.000Z',
}

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
})
