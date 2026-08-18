import { describe, it, expect } from 'vitest'
import { render, screen } from './utils'
import NotFoundPage from '../features/info/NotFoundPage'

describe('NotFoundPage', () => {
  it('renders localized title and description', () => {
    render(<NotFoundPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByText(/does not exist or may have moved/i)).toBeInTheDocument()
  })

  it('renders home and search recovery actions as client-side links', () => {
    render(<NotFoundPage />)
    expect(screen.getByRole('link', { name: /go home/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /search webtoons/i })).toHaveAttribute(
      'href',
      '/search'
    )
  })

  it('renders popular page links', () => {
    render(<NotFoundPage />)
    expect(screen.getByRole('link', { name: /categories/i })).toHaveAttribute('href', '/categories')
    expect(screen.getByRole('link', { name: /library/i })).toHaveAttribute('href', '/library')
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact')
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<NotFoundPage />)
    expect(container.textContent).not.toMatch(/notFound\.[a-zA-Z]/)
  })
})
