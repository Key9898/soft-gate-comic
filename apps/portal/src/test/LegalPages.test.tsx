import { describe, it, expect } from 'vitest'
import { render, screen } from './utils'
import PrivacyPage from '../features/info/PrivacyPage'
import TermsPage from '../features/info/TermsPage'
import CookiesPage from '../features/info/CookiesPage'

const expectSharedLegalChrome = (
  container: HTMLElement,
  current: 'Privacy Policy' | 'Terms of Service' | 'Cookie Policy'
) => {
  expect(screen.getByRole('heading', { name: /at a glance/i })).toBeInTheDocument()
  expect(container.querySelector('.radial-wash-primary')).toBeTruthy()
  expect(container.textContent).toMatch(/Last updated September 10, 2026/i)
  expect(screen.getAllByRole('link', { name: 'support@softgatecomic.com' }).length).toBeGreaterThan(
    0
  )
  expect(screen.getAllByRole('link', { name: 'Contact page' }).length).toBeGreaterThan(0)
  expect(screen.queryByRole('link', { name: current })).not.toBeInTheDocument()
  const others = (['Privacy Policy', 'Terms of Service', 'Cookie Policy'] as const).filter(
    (label) => label !== current
  )
  for (const label of others) {
    const links = screen.getAllByRole('link', { name: label })
    expect(links.length).toBeGreaterThanOrEqual(2)
  }
  expect(container.textContent).not.toMatch(/cookie settings|GPC|Do Not Sell/i)
  const toc = screen.getByRole('navigation', { name: 'Table of Contents' })
  expect(toc.className).toMatch(/scrollbar-thin-primary/)
  expect(toc.className).not.toMatch(/scrollbar-hide/)
}

describe('PrivacyPage', () => {
  it('renders the h1 and TOC anchor links', () => {
    render(<PrivacyPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument()
    const toc = screen.getByRole('navigation', { name: 'Table of Contents' })
    expect(toc.querySelector('a[href="#glance"]')).toBeInTheDocument()
    expect(toc.querySelector('a[href="#collect"]')).toBeInTheDocument()
    expect(toc.querySelector('a[href="#children"]')).toBeInTheDocument()
  })

  it('states the local-storage honesty note and no data sharing', () => {
    render(<PrivacyPage />)
    expect(screen.getAllByText(/does not send your data to any server/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/we do not share your data with anyone/i).length).toBeGreaterThan(0)
  })

  it('links rights to Profile Security and Contact', () => {
    const { container } = render(<PrivacyPage />)
    expectSharedLegalChrome(container, 'Privacy Policy')
    expect(screen.getByRole('link', { name: 'Profile → Security' })).toHaveAttribute(
      'href',
      '/profile?tab=security'
    )
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
    expect(toc.querySelector('a[href="#changes"]')).toBeInTheDocument()
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

  it('covers changes, guests, Myanmar law, and shared chrome', () => {
    const { container } = render(<TermsPage />)
    expectSharedLegalChrome(container, 'Terms of Service')
    expect(screen.getByRole('heading', { name: 'Changes to These Terms' })).toBeInTheDocument()
    expect(screen.getAllByText(/guests may browse/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/governed by Myanmar law/i).length).toBeGreaterThan(0)
    expect(container.textContent).not.toMatch(/arbitration/i)
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
    const { container } = render(<CookiesPage />)
    expect(screen.getByText(/does not set any tracking cookies/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'What We Store In Your Browser' })
    ).toBeInTheDocument()
    expect(screen.getByText('Coin wallet')).toBeInTheDocument()
    expect(screen.getByText('History, likes & ratings')).toBeInTheDocument()
    expect(screen.getByText('Demo accounts')).toBeInTheDocument()
    expect(screen.getByText('Demo catalog')).toBeInTheDocument()
    expect(screen.getByText('18+ age confirm')).toBeInTheDocument()
    expect(screen.getByText('Notification preferences')).toBeInTheDocument()
    expect(screen.getByText('Episode reports')).toBeInTheDocument()
    expect(screen.getByText('Author follows')).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/Reading progress/)
    expect(container.textContent).not.toMatch(/still in-app until that fan-out/i)
    expect(container.textContent).not.toMatch(/New-episode (rows|notices) are still in-app/i)
  })

  it('declares analytics and marketing as none', () => {
    render(<CookiesPage />)
    expect(screen.getByText(/does not use analytics cookies/i)).toBeInTheDocument()
    expect(screen.getByText(/no advertising or marketing cookies/i)).toBeInTheDocument()
  })

  it('uses shared legal chrome without a cookie preference center', () => {
    const { container } = render(<CookiesPage />)
    expectSharedLegalChrome(container, 'Cookie Policy')
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<CookiesPage />)
    expect(container.textContent).not.toMatch(/static\.[a-zA-Z]/)
    expect(container.textContent).not.toMatch(/legal\.[a-zA-Z]/)
  })
})
