import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from './utils'
import HelpPage from '../features/info/HelpPage'

describe('HelpPage', () => {
  it('renders the page title and honest intro', () => {
    render(<HelpPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Help Center' })).toBeInTheDocument()
    expect(screen.getByText(/demo portal/i)).toBeInTheDocument()
  })

  it('renders topic cards into the FAQ funnel with category queries', () => {
    render(<HelpPage />)
    const gettingStarted = screen.getByRole('link', { name: /getting started/i })
    expect(gettingStarted).toHaveAttribute('href', '/faq?cat=general')
    expect(gettingStarted.className).toMatch(/focus-visible:ring-2/)
    expect(screen.getByRole('link', { name: /payments/i })).toHaveAttribute(
      'href',
      '/faq?cat=payments'
    )
    expect(screen.getByRole('link', { name: /account security/i })).toHaveAttribute(
      'href',
      '/faq?cat=account'
    )
    expect(screen.getByRole('link', { name: /library/i })).toHaveAttribute('href', '/faq#q16')
    expect(screen.getByRole('link', { name: /safety/i })).toHaveAttribute('href', '/faq#q18')
  })

  it('renders popular articles linking to FAQ hashes', () => {
    render(<HelpPage />)
    expect(screen.getByRole('heading', { name: /popular articles/i })).toBeInTheDocument()
    const articleLink = screen.getByRole('link', { name: /how do i unlock premium episodes/i })
    expect(articleLink).toHaveAttribute('href', '/faq#q12')
  })

  it('searches the catalog and links matches to FAQ hashes', () => {
    render(<HelpPage />)
    fireEvent.change(screen.getByRole('searchbox', { name: /search help topics/i }), {
      target: { value: 'premium' },
    })
    const links = screen.getAllByRole('link', { name: /how do i unlock premium episodes/i })
    expect(links.length).toBeGreaterThanOrEqual(2)
    for (const link of links) {
      expect(link).toHaveAttribute('href', '/faq#q12')
    }
  })

  it('renders need-more-help CTA linking to contact', () => {
    render(<HelpPage />)
    expect(screen.getByRole('heading', { name: /need more help/i })).toBeInTheDocument()
    expect(screen.getByText(/open contact to write the team/i)).toBeInTheDocument()
    expect(screen.queryByText(/support@softgatecomic.com/i)).not.toBeInTheDocument()
    const ctaLinks = screen
      .getAllByRole('link', { name: /contact/i })
      .filter((link) => link.getAttribute('href') === '/contact')
    expect(ctaLinks.length).toBeGreaterThanOrEqual(2)
  })

  it('links browse-all-questions to the FAQ page', () => {
    render(<HelpPage />)
    expect(screen.getByRole('link', { name: /browse all questions/i })).toHaveAttribute(
      'href',
      '/faq'
    )
    expect(screen.getByText(/opens the full FAQ/i)).toBeInTheDocument()
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<HelpPage />)
    expect(container.textContent).not.toMatch(/help\.[a-zA-Z]/)
    expect(container.textContent).not.toMatch(/faq\.[a-zA-Z]/)
  })
})
