import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { render, screen } from '@testing-library/react'
import { render as renderApp, fireEvent as fireApp } from './utils'
import FAQPage from '../features/info/FAQPage'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { LibraryProvider } from '../context/LibraryContext'
import { WalletProvider } from '../context/WalletContext'
import { EngagementProvider } from '../context/EngagementContext'

function renderFaqAt(path: string) {
  return render(
    <HelmetProvider>
      <DataProvider>
        <MemoryRouter initialEntries={[path]}>
          <AuthProvider>
            <LibraryProvider>
              <WalletProvider>
                <EngagementProvider>
                  <FAQPage />
                </EngagementProvider>
              </WalletProvider>
            </LibraryProvider>
          </AuthProvider>
        </MemoryRouter>
      </DataProvider>
    </HelmetProvider>
  )
}

describe('FAQPage', () => {
  it('renders the page title and localized search input', () => {
    renderApp(<FAQPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Frequently Asked Questions' })
    ).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: /search questions/i })).toBeInTheDocument()
  })

  it('renders localized category tabs including All FAQs', () => {
    renderApp(<FAQPage />)
    expect(screen.getByRole('button', { name: 'All FAQs' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Payments' })).toBeInTheDocument()
  })

  it('opens an accordion item and shows localized feedback widget', () => {
    renderApp(<FAQPage />)
    const closed = screen.getByRole('button', { name: /what is softgate comic\?/i })
    expect(closed).toHaveAttribute('aria-expanded', 'false')
    fireApp.click(closed)
    expect(closed).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/webtoon reading portal/i)).toBeInTheDocument()
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument()
    fireApp.click(screen.getByRole('button', { name: 'Yes' }))
    expect(screen.getByText(/this page only/i)).toBeInTheDocument()
  })

  it('shows honest demo answers for payments', () => {
    renderApp(<FAQPage />)
    fireApp.click(screen.getByRole('button', { name: /what payment methods are accepted\?/i }))
    expect(screen.getByText(/demo coin top-up only/i)).toBeInTheDocument()
    fireApp.click(screen.getByRole('button', { name: /how do i buy coins/i }))
    expect(screen.getByText(/this browser only/i)).toBeInTheDocument()
    expect(screen.queryByText(/choose a payment method/i)).not.toBeInTheDocument()
    fireApp.click(screen.getByRole('button', { name: /are coins refundable/i }))
    expect(screen.getByText(/not live purchases/i)).toBeInTheDocument()
  })

  it('renders new webtoon questions including publish question', () => {
    renderApp(<FAQPage />)
    expect(
      screen.getByRole('button', { name: /how do i unlock premium episodes\?/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /can i publish my own webtoon/i })
    ).toBeInTheDocument()
  })

  it('explains there is no in-portal upload and links to Publish with Us', () => {
    renderApp(<FAQPage />)
    fireApp.click(screen.getByRole('button', { name: /can i publish my own webtoon/i }))
    expect(screen.getByText(/in-portal upload/i)).toBeInTheDocument()
    expect(screen.getByText(/Send your pitch/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Publish with Us' })).toHaveAttribute(
      'href',
      '/creators'
    )
  })

  it('renders guest, library, notification, report, language, and local-data questions', () => {
    renderApp(<FAQPage />)
    expect(
      screen.getByRole('button', { name: /can i read without an account/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /where is subscribe and library/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /how do notifications work/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /how do i report a content concern/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /how do i change language/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /where is my data stored in this demo/i })
    ).toBeInTheDocument()
  })

  it('fills thin account, new-release, and request answers', () => {
    renderApp(<FAQPage />)
    fireApp.click(screen.getByRole('button', { name: /can i delete my account/i }))
    expect(screen.getByText(/Profile → Security/)).toBeInTheDocument()
    fireApp.click(screen.getByRole('button', { name: /when are new webtoons released/i }))
    expect(screen.getByText(/Home New Releases/)).toBeInTheDocument()
    const homeLinks = screen.getAllByRole('link', { name: 'Home' })
    expect(homeLinks.some((link) => link.getAttribute('href') === '/')).toBe(true)
    fireApp.click(screen.getByRole('button', { name: /how do i request a webtoon/i }))
    expect(screen.getByText(/not a promise/i)).toBeInTheDocument()
  })

  it('opens the premium unlock item from hash q12 and shows a Coins related link', () => {
    renderFaqAt('/faq#q12')
    const premium = screen.getByRole('button', { name: /how do i unlock premium episodes\?/i })
    expect(premium).toHaveAttribute('id', 'q12')
    expect(premium).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'Coins' })).toHaveAttribute('href', '/coins')
  })

  it('selects a category tab from the cat query', () => {
    renderFaqAt('/faq?cat=payments')
    expect(
      screen.queryByRole('button', { name: /what is softgate comic\?/i })
    ).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /how do i buy coins/i })).toBeInTheDocument()
  })

  it('always shows a still-need-help Contact CTA', () => {
    renderApp(<FAQPage />)
    expect(screen.getByRole('heading', { name: /still need help/i })).toBeInTheDocument()
    const contactLinks = screen
      .getAllByRole('link', { name: 'Contact' })
      .filter((link) => link.getAttribute('href') === '/contact')
    expect(contactLinks.length).toBeGreaterThanOrEqual(1)
  })

  it('shows an empty state with contact link when search has no matches', () => {
    renderApp(<FAQPage />)
    fireApp.change(screen.getByRole('searchbox', { name: /search questions/i }), {
      target: { value: 'zzzznotfoundzzz' },
    })
    expect(screen.getByText(/no questions match your search/i)).toBeInTheDocument()
    const contactLinks = screen
      .getAllByRole('link', { name: 'Contact' })
      .filter((link) => link.getAttribute('href') === '/contact')
    expect(contactLinks.length).toBeGreaterThanOrEqual(1)
  })

  it('does not render raw i18n keys', () => {
    const { container } = renderApp(<FAQPage />)
    expect(container.textContent).not.toMatch(/faq\.[a-zA-Z]/)
  })
})
