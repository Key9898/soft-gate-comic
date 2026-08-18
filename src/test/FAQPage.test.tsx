import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from './utils'
import FAQPage from '../features/info/FAQPage'

describe('FAQPage', () => {
  it('renders the page title and localized search input', () => {
    render(<FAQPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Frequently Asked Questions' })
    ).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: /search questions/i })).toBeInTheDocument()
  })

  it('renders localized category tabs including All FAQs', () => {
    render(<FAQPage />)
    expect(screen.getByRole('button', { name: 'All FAQs' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Payments' })).toBeInTheDocument()
  })

  it('opens an accordion item and shows localized feedback widget', () => {
    render(<FAQPage />)
    fireEvent.click(screen.getByRole('button', { name: /what is softgate comic\?/i }))
    expect(screen.getByText(/webtoon service for myanmar readers/i)).toBeInTheDocument()
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }))
    expect(screen.getByText('Thanks for your feedback!')).toBeInTheDocument()
  })

  it('shows honest demo answers for payments', () => {
    render(<FAQPage />)
    fireEvent.click(screen.getByRole('button', { name: /what payment methods are accepted\?/i }))
    expect(screen.getByText(/demo coin top-up only/i)).toBeInTheDocument()
  })

  it('renders new webtoon questions including publish question', () => {
    render(<FAQPage />)
    expect(
      screen.getByRole('button', { name: /how do i unlock premium episodes\?/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /can i publish my own webtoon/i })
    ).toBeInTheDocument()
  })

  it('shows an empty state with contact link when search has no matches', () => {
    render(<FAQPage />)
    fireEvent.change(screen.getByRole('searchbox', { name: /search questions/i }), {
      target: { value: 'zzzznotfoundzzz' },
    })
    expect(screen.getByText(/no questions match your search/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<FAQPage />)
    expect(container.textContent).not.toMatch(/faq\.[a-zA-Z]/)
  })
})
