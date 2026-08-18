import { describe, it, expect } from 'vitest'
import { render, screen } from './utils'
import HelpPage from '../features/info/HelpPage'

describe('HelpPage', () => {
  it('renders the page title and honest intro', () => {
    render(<HelpPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Help Center' })).toBeInTheDocument()
    expect(screen.getByText(/demo portal/i)).toBeInTheDocument()
  })

  it('renders four topic cards with correct destinations and focus styles', () => {
    render(<HelpPage />)
    const gettingStarted = screen.getByRole('link', { name: /getting started/i })
    expect(gettingStarted).toHaveAttribute('href', '/faq')
    expect(gettingStarted.className).toMatch(/focus-visible:ring-2/)
    expect(screen.getByRole('link', { name: /payments/i })).toHaveAttribute('href', '/coins')
    expect(screen.getByRole('link', { name: /account security/i })).toHaveAttribute(
      'href',
      '/profile'
    )
  })

  it('renders popular articles linking to FAQ', () => {
    render(<HelpPage />)
    expect(screen.getByRole('heading', { name: /popular articles/i })).toBeInTheDocument()
    const articleLink = screen.getByRole('link', { name: /how do i unlock premium episodes/i })
    expect(articleLink).toHaveAttribute('href', '/faq')
  })

  it('renders need-more-help CTA linking to contact', () => {
    render(<HelpPage />)
    expect(screen.getByRole('heading', { name: /need more help/i })).toBeInTheDocument()
    const ctaLinks = screen
      .getAllByRole('link', { name: /contact/i })
      .filter((link) => link.getAttribute('href') === '/contact')
    expect(ctaLinks.length).toBeGreaterThanOrEqual(2)
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<HelpPage />)
    expect(container.textContent).not.toMatch(/help\.[a-zA-Z]/)
    expect(container.textContent).not.toMatch(/faq\.[a-zA-Z]/)
  })
})
