import { describe, it, expect } from 'vitest'
import { render, screen } from './utils'
import AboutPage from '../features/info/AboutPage'

describe('AboutPage', () => {
  it('renders mission and vision cards', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { name: 'Our Mission' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Our Vision' })).toBeInTheDocument()
  })

  it('renders Our Story with the episode reader', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { name: /our story/i })).toBeInTheDocument()
    expect(screen.getByLabelText('Our Story')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next chapter' })).toBeInTheDocument()
    expect(screen.getByText(/In 2026 we started SoftGate Comic/)).toBeInTheDocument()
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<AboutPage />)
    expect(container.textContent).not.toMatch(/about\.[a-zA-Z]/)
  })

  it('renders localized CTA links', () => {
    render(<AboutPage />)
    expect(screen.getByRole('link', { name: /publish with us/i })).toHaveAttribute(
      'href',
      '/creators'
    )
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute('href', '/contact')
  })

  it('renders values grid with honest descriptions', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { name: /our values/i })).toBeInTheDocument()
    expect(screen.getByText(/curated catalog/i)).toBeInTheDocument()
  })

  it('keeps Our Story as an episode reader without HeroBook3D', () => {
    const { container } = render(<AboutPage />)
    const heading = screen.getByRole('heading', { name: /our story/i })
    const section = heading.closest('section')
    expect(section?.querySelector('.story-reader')).toBeTruthy()
    expect(section?.querySelector('.hero-book-scene')).toBeNull()
    expect(section?.querySelector('img[src="/about/our-story-splash.jpg"]')).toBeTruthy()
    expect(section?.querySelector('img[src="/about/story-cover.svg"]')).toBeNull()
    expect(section?.querySelector('.story-reader a')).toBeNull()
    expect(container.firstElementChild?.className).not.toContain('overflow-hidden')
    expect(container.innerHTML).not.toContain('story-book.svg')
    expect(screen.getByRole('link', { name: /publish with us/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /get in touch/i })).toBeInTheDocument()
  })
})
