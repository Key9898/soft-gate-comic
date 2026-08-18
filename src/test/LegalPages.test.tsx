import { describe, it, expect } from 'vitest'
import { render, screen } from './utils'
import PrivacyPage from '../features/info/PrivacyPage'
import TermsPage from '../features/info/TermsPage'
import CookiesPage from '../features/info/CookiesPage'

describe('PrivacyPage', () => {
  it('renders the h1 and TOC anchor links', () => {
    render(<PrivacyPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument()
    const toc = screen.getByRole('navigation', { name: 'Table of Contents' })
    expect(toc.querySelector('a[href="#collect"]')).toBeInTheDocument()
    expect(toc.querySelector('a[href="#children"]')).toBeInTheDocument()
  })

  it('states the local-storage honesty note and no data sharing', () => {
    render(<PrivacyPage />)
    expect(screen.getByText(/does not send your data to any server/i)).toBeInTheDocument()
    expect(screen.getByText(/we do not share your data with anyone/i)).toBeInTheDocument()
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<PrivacyPage />)
    expect(container.textContent).not.toMatch(/static\.[a-zA-Z]/)
    expect(container.textContent).not.toMatch(/legal\.[a-zA-Z]/)
  })
})

describe('TermsPage', () => {
  it('renders the h1 and TOC anchor links', () => {
    render(<TermsPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Terms of Service' })).toBeInTheDocument()
    const toc = screen.getByRole('navigation', { name: 'Table of Contents' })
    expect(toc.querySelector('a[href="#eligibility"]')).toBeInTheDocument()
    expect(toc.querySelector('a[href="#coins"]')).toBeInTheDocument()
  })

  it('renders the coins section with the demo honesty line', () => {
    render(<TermsPage />)
    expect(screen.getByRole('heading', { name: 'Coins & Virtual Items' })).toBeInTheDocument()
    expect(screen.getByText(/no real payment is taken/i)).toBeInTheDocument()
    expect(screen.getByText(/no real-world monetary value/i)).toBeInTheDocument()
  })

  it('renders eligibility, comments, and anti-piracy items', () => {
    render(<TermsPage />)
    expect(screen.getByRole('heading', { name: 'Eligibility & Age' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Your Comments' })).toBeInTheDocument()
    expect(screen.getByText(/scrape, bulk-download, or re-upload/i)).toBeInTheDocument()
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<TermsPage />)
    expect(container.textContent).not.toMatch(/static\.[a-zA-Z]/)
    expect(container.textContent).not.toMatch(/legal\.[a-zA-Z]/)
  })
})

describe('CookiesPage', () => {
  it('renders the h1 and TOC anchor links', () => {
    render(<CookiesPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Cookie Policy' })).toBeInTheDocument()
    const toc = screen.getByRole('navigation', { name: 'Table of Contents' })
    expect(toc.querySelector('a[href="#storage"]')).toBeInTheDocument()
    expect(toc.querySelector('a[href="#managing"]')).toBeInTheDocument()
  })

  it('states the no-tracking-cookies truth and storage table', () => {
    render(<CookiesPage />)
    expect(screen.getByText(/does not set any tracking cookies/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'What We Store In Your Browser' })
    ).toBeInTheDocument()
    expect(screen.getByText('Coin wallet')).toBeInTheDocument()
    expect(screen.getByText('Reading progress')).toBeInTheDocument()
  })

  it('declares analytics and marketing as none', () => {
    render(<CookiesPage />)
    expect(screen.getByText(/does not use analytics cookies/i)).toBeInTheDocument()
    expect(screen.getByText(/no advertising or marketing cookies/i)).toBeInTheDocument()
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<CookiesPage />)
    expect(container.textContent).not.toMatch(/static\.[a-zA-Z]/)
    expect(container.textContent).not.toMatch(/legal\.[a-zA-Z]/)
  })
})
