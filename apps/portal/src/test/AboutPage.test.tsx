import { describe, it, expect } from 'vitest'
import { render, screen } from './utils'
import AboutPage from '../features/info/AboutPage'

describe('AboutPage', () => {
  it('uses Who we are as the page heading and About Us in the breadcrumb', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Who we are' })).toBeInTheDocument()
    expect(screen.getByText('About Us')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: 'About Us' })).not.toBeInTheDocument()
  })

  it('renders fact chips instead of a trophy stats grid', () => {
    const { container } = render(<AboutPage />)
    const facts = container.querySelector('dl')
    expect(facts?.textContent).toContain('Demo portal')
    expect(facts?.textContent).toContain('Myanmar')
    expect(facts?.textContent).toContain('English and Myanmar')
    expect(facts?.textContent).toContain('Webtoon reading portal')
    expect(facts?.textContent).not.toMatch(/(^|[^0-9])9([^0-9]|$)/)
    expect(screen.queryByText('Join Us')).not.toBeInTheDocument()
  })

  it('explains how the portal works, including the demo wallet', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { name: 'How this portal works' })).toBeInTheDocument()
    expect(screen.getByText(/local demo wallet on this device/i)).toBeInTheDocument()
    expect(screen.getByText(/not a live payment network/i)).toBeInTheDocument()
  })

  it('renders a skim timeline with the studio photo', () => {
    const { container } = render(<AboutPage />)
    expect(screen.getByRole('heading', { name: 'Our history' })).toBeInTheDocument()
    expect(screen.getAllByText('2026').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Next')).toBeInTheDocument()
    expect(container.querySelector('img[src="/about/team/studio-workspace.jpg"]')).toBeTruthy()
  })

  it('renders the stand-in team with the four portrait files', () => {
    const { container } = render(<AboutPage />)
    expect(screen.getByRole('heading', { name: 'Our team' })).toBeInTheDocument()
    expect(screen.getByText(/stand-ins until the studio publishes/i)).toBeInTheDocument()
    expect(container.querySelector('img[src="/about/team/team-founder.jpg"]')).toBeTruthy()
    expect(container.querySelector('img[src="/about/team/team-editorial.jpg"]')).toBeTruthy()
    expect(container.querySelector('img[src="/about/team/team-product.jpg"]')).toBeTruthy()
    expect(container.querySelector('img[src="/about/team/team-creators.jpg"]')).toBeTruthy()
    expect(container.querySelector('img[src="/about/team/team-creator.jpg"]')).toBeNull()
  })

  it('renders mission and vision cards', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { name: 'Our Mission' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Our Vision' })).toBeInTheDocument()
    expect(screen.getByText(/clear path to publish/i)).toBeInTheDocument()
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

  it('renders Get involved CTAs', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { name: /get involved/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /publish with us/i })).toHaveAttribute(
      'href',
      '/creators'
    )
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute('href', '/contact')
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
  })
})
