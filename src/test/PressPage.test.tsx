import { describe, it, expect } from 'vitest'
import { render, screen } from './utils'
import PressPage from '../features/info/PressPage'

describe('PressPage', () => {
  it('renders the masthead title and boilerplate section', () => {
    render(<PressPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Press' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'About SoftGate Comic' })).toBeInTheDocument()
    expect(
      screen.getByText(/webtoon reading portal designed for readers in Myanmar/i)
    ).toBeInTheDocument()
  })

  it('renders brand asset download links pointing to real logo files', () => {
    render(<PressPage />)
    const downloadLinks = screen.getAllByRole('link', { name: /download/i })
    const hrefs = downloadLinks.map((link) => link.getAttribute('href'))
    expect(hrefs).toEqual(
      expect.arrayContaining(['/logo/logo.svg', '/logo/logo.jpg', '/logo/logo-v2.jpg'])
    )
    downloadLinks.forEach((link) => {
      expect(link).toHaveAttribute('download')
    })
  })

  it('renders the fact sheet with honest values', () => {
    render(<PressPage />)
    expect(screen.getByRole('heading', { name: /fact sheet/i })).toBeInTheDocument()
    expect(screen.getByText('Demo portal — in development')).toBeInTheDocument()
    expect(screen.getByText('Myanmar')).toBeInTheDocument()
  })

  it('renders the media contact mailto CTA', () => {
    render(<PressPage />)
    const cta = screen.getByRole('link', { name: /press@softgatecomic\.com/i })
    expect(cta).toHaveAttribute('href', 'mailto:press@softgatecomic.com')
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<PressPage />)
    expect(container.textContent).not.toMatch(/press\.[a-zA-Z]/)
  })
})
