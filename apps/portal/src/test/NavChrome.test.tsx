import { describe, it, expect, vi, afterEach } from 'vitest'
import { Routes, Route } from 'react-router-dom'
import { render, screen } from './utils'
import i18n from '../lib/i18n'
import { SESSION_STORAGE_KEY } from '../lib/auth/types'
import Navigation from '../components/Navigation/Navigation'
import LanguageSwitcher from '../components/LanguageSwitcher'
import HomePage from '../features/home/HomePage'
import MainLayout from '../layouts/MainLayout'

const seedSession = () => {
  vi.mocked(window.localStorage.getItem).mockImplementation((key: string) =>
    key === SESSION_STORAGE_KEY
      ? JSON.stringify({
          id: 'u_test',
          email: 'test@example.com',
          username: 'tester',
          displayName: 'Tester',
        })
      : null
  )
}

afterEach(() => {
  vi.mocked(window.localStorage.getItem).mockImplementation(() => null)
})

describe('Navigation chrome (Impl 73)', () => {
  it('hides Library/Coins/Notifications shortcuts from guests and shows Login', () => {
    render(<Navigation />)
    expect(screen.queryByRole('link', { name: 'Library' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Coins' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
  })

  it('shows Library and Coins shortcuts next to the bell for authenticated users', () => {
    seedSession()
    render(<Navigation />)
    expect(screen.getByRole('link', { name: 'Library' })).toHaveAttribute('href', '/library')
    expect(screen.getByRole('link', { name: 'Coins' })).toHaveAttribute('href', '/coins')
    expect(screen.getByRole('link', { name: 'Notifications' })).toHaveAttribute(
      'href',
      '/notifications'
    )
  })

  it('applies the safe-top utility to the sticky nav', () => {
    const { container } = render(<Navigation />)
    expect(container.querySelector('nav')?.className).toContain('safe-top')
  })

  it('gives nav icon buttons a 44px minimum target', () => {
    render(<Navigation />)
    const searchButton = screen.getByRole('button', { name: /search/i })
    expect(searchButton.className).toContain('min-h-11')
    expect(searchButton.className).toContain('min-w-11')
  })

  it('marks Categories current on a genre path', () => {
    window.history.pushState({}, '', '/categories/action')
    render(<Navigation />)
    const categories = screen.getAllByRole('link', { name: /^categories$/i })
    expect(categories.some((link) => link.getAttribute('aria-current') === 'page')).toBe(true)
    expect(
      screen
        .getAllByRole('link', { name: /^popular$/i })
        .every((link) => !link.getAttribute('aria-current'))
    ).toBe(true)
  })

  it('marks Popular current on /ranking', () => {
    window.history.pushState({}, '', '/ranking')
    render(<Navigation />)
    expect(
      screen
        .getAllByRole('link', { name: /^popular$/i })
        .some((link) => link.getAttribute('aria-current') === 'page')
    ).toBe(true)
    expect(
      screen
        .getAllByRole('link', { name: /^categories$/i })
        .every((link) => link.getAttribute('aria-current') !== 'page')
    ).toBe(true)
  })
})

describe('MainLayout skip link (Impl 100)', () => {
  it('places a skip-to-content link before nav targeting main', () => {
    const { container } = render(
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="*" element={<div>outlet</div>} />
        </Route>
      </Routes>
    )
    const skip = screen.getByRole('link', { name: /skip to content/i })
    expect(skip).toHaveAttribute('href', '#main-content')
    expect(skip).toHaveClass('skip-link')
    const main = container.querySelector('#main-content')
    expect(main).toHaveAttribute('tabindex', '-1')
    expect(container.querySelector('a')).toBe(skip)
  })
})

describe('LanguageSwitcher compact mode', () => {
  it('hides the language label below xl via hidden xl:inline', () => {
    render(<LanguageSwitcher />)
    const label = screen.getByText(/မြန်မာ|English/)
    expect(label.className).toContain('hidden')
    expect(label.className).toContain('xl:inline')
    expect(screen.getByRole('button', { name: /switch to/i })).toBeInTheDocument()
  })
})

describe('CTA honesty (Impl 73)', () => {
  it('sends guests to /register with the get-started label', () => {
    render(<HomePage />)
    const cta = screen.getByRole('button', { name: i18n.t('home.getStartedFree') })
    expect(cta.closest('a')).toHaveAttribute('href', '/register')
  })

  it('sends authenticated users to /categories with a browse label', () => {
    seedSession()
    render(<HomePage />)
    const cta = screen.getByRole('button', { name: i18n.t('home.browseNow') })
    expect(cta.closest('a')).toHaveAttribute('href', '/categories')
  })

  it('resolves the notification view label in both locales', () => {
    expect(i18n.getFixedT('en')('notificationsPage.view')).toBe('View')
    expect(i18n.getFixedT('mm')('notificationsPage.view')).not.toBe('notificationsPage.view')
  })
})
