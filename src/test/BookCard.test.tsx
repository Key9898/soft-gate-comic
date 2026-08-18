import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from './utils'
import BookCard from '../components/BookCard'
import HeroBook3D from '../components/HeroBook3D'

describe('BookCard', () => {
  it('renders title and cover label', () => {
    render(<BookCard title="Moon Path" subtitle="Romance" />)
    expect(screen.getByText('Moon Path')).toBeInTheDocument()
    expect(screen.getByText('Romance')).toBeInTheDocument()
    expect(screen.getAllByText('Cover').length).toBeGreaterThan(0)
  })

  it('clamps title and description without truncate or title tooltip', () => {
    const { container } = render(
      <BookCard title="Long Title" subtitle="Romance" description="A two-line catalog deck." />
    )
    const heading = container.querySelector('h3')
    const deck = screen.getByText('A two-line catalog deck.')
    expect(heading?.className).toMatch(/line-clamp-2/)
    expect(heading?.className).toMatch(/break-words/)
    expect(heading?.className).not.toMatch(/\btruncate\b/)
    expect(heading).not.toHaveAttribute('title')
    expect(deck.className).toMatch(/line-clamp-2/)
    expect(deck.className).toMatch(/min-h-2lh/)
  })

  it('applies book-media class for hardcover treatment', () => {
    const { container } = render(<BookCard title="Test" />)
    expect(container.querySelector('.book-media')).toBeTruthy()
  })

  it('renders cover image when provided', () => {
    render(<BookCard title="Covered" coverImage="/covers/test.jpg" />)
    expect(screen.getByRole('img', { name: 'Covered' })).toHaveAttribute('src', '/covers/test.jpg')
  })
})

describe('HeroBook3D', () => {
  it('exposes cover as a direct link CTA without role=button wrapper', () => {
    render(
      <HeroBook3D
        title="Featured Title"
        description="A long story"
        href="/webtoon/1"
        ctaLabel="Start Reading"
      />
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    const cover = screen.getByTestId('hero-book-cover-link')
    expect(cover).toHaveAttribute('href', '/webtoon/1')
    expect(cover).toHaveAccessibleName(/Featured Title.*Start Reading/i)
  })

  it('keeps a static hardcover scene without open or reduced classes', () => {
    const { container } = render(
      <HeroBook3D
        title="Static Book"
        href="/webtoon/2"
        ctaLabel="Start Reading"
        coverImage="/covers/hero.jpg"
      />
    )
    expect(container.querySelector('.book-media')).toBeNull()
    expect(container.querySelector('.hero-book-scene')).toBeTruthy()
    expect(container.querySelector('.hero-book-scene')?.className).not.toMatch(
      /\bhero-book-enter\b/
    )
    expect(container.querySelector('.hero-book-float-shadow')).toBeTruthy()
    expect(container.querySelector('.hero-book')).toBeTruthy()
    expect(container.querySelector('.hero-book-pages')).toBeTruthy()
    expect(container.querySelector('.hero-book-back')).toBeTruthy()
    expect(container.querySelector('.hero-book.is-open')).toBeNull()
    expect(container.querySelector('.hero-book--reduced')).toBeNull()
    fireEvent.pointerEnter(container.querySelector('.hero-book-scene') as HTMLElement)
    expect(container.querySelector('.hero-book.is-open')).toBeNull()
    expect(container.querySelector('.hero-book-pages')).toBeTruthy()
    expect(container.querySelector('.hero-book-back')).toBeTruthy()
  })

  it('navigates via cover link only (no inner page CTA)', () => {
    render(<HeroBook3D title="Solo CTA" href="/webtoon/3" ctaLabel="Start Reading" />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', '/webtoon/3')
  })

  it('renders a decorative hardcover without a cover link', () => {
    const { container } = render(
      <HeroBook3D title="Our Story" coverImage="/about/story-cover.svg" />
    )
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByTestId('hero-book-cover-link')).not.toBeInTheDocument()
    const scene = container.querySelector('.hero-book-scene')
    expect(scene).toHaveAttribute('aria-hidden', 'true')
    expect(scene?.className).not.toMatch(/\bhero-book-enter\b/)
    expect(container.querySelector('.hero-book-pages')).toBeTruthy()
    expect(container.querySelector('.hero-book-back')).toBeTruthy()
  })
})
