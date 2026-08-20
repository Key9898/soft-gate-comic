import { describe, it, expect } from 'vitest'
import { mockGenres, mockWebtoons } from '@softgate/shared'
import { render, screen, fireEvent } from './utils'
import BookCard, { CatalogBookCard } from '../components/BookCard'
import HeroBook3D from '../components/HeroBook3D'

const horizon = mockWebtoons.find((webtoon) => webtoon.id === '1')!
const bloodMoon = mockWebtoons.find((webtoon) => webtoon.id === '7')!

const renderCatalog = (webtoon: (typeof mockWebtoons)[number], newestIds: Set<string>) =>
  render(<CatalogBookCard webtoon={webtoon} lang="en" genres={mockGenres} newestIds={newestIds} />)

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

describe('CatalogBookCard cover chips', () => {
  it('leaves the left column empty when neither New nor Premium applies', () => {
    const { container } = renderCatalog(horizon, new Set())
    expect(container.querySelector('.left-2')).toBeNull()
    expect(screen.queryByText(/^premium$/i)).not.toBeInTheDocument()
    expect(container.querySelector('.right-2')).toContainElement(screen.getByTestId('rating-chip'))
  })

  it('puts New alone in the left column', () => {
    const { container } = renderCatalog(horizon, new Set(['1']))
    const left = container.querySelector('.left-2')
    expect(left?.className).toMatch(/gap-1/)
    expect(left).toHaveTextContent(/^New$/)
    expect(screen.queryByText(/^premium$/i)).not.toBeInTheDocument()
  })

  it('puts Premium alone in the left column, not under the age chip', () => {
    const { container } = renderCatalog(bloodMoon, new Set())
    const left = container.querySelector('.left-2')
    const right = container.querySelector('.right-2')
    expect(left?.className).toMatch(/left-2/)
    expect(left).toHaveTextContent(/^Premium$/)
    expect(right).not.toHaveTextContent(/premium/i)
    expect(right).toContainElement(screen.getByTestId('rating-chip'))
  })

  it('stacks New above Premium in the left column with the same gap as the right stack', () => {
    const { container } = renderCatalog(bloodMoon, new Set(['7']))
    const left = container.querySelector('.left-2')
    expect(left?.className).toMatch(/gap-1/)
    expect(left?.className).toMatch(/left-2/)
    const labels = [...(left?.querySelectorAll(':scope > span') ?? [])].map(
      (node) => node.textContent
    )
    expect(labels).toEqual(['New', 'Premium'])
    expect(container.querySelector('.right-2')).not.toHaveTextContent(/premium/i)
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

  it('uses a pointer-only cover when a sibling CTA exists', () => {
    render(
      <HeroBook3D
        title="Featured Title"
        href="/webtoon/1"
        ctaLabel="Start Reading"
        coverTabbable={false}
      />
    )
    const cover = screen.getByTestId('hero-book-cover-link')
    expect(cover).not.toHaveAttribute('href')
    expect(cover).not.toHaveAttribute('tabindex')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    fireEvent.click(cover)
    expect(window.location.pathname).toBe('/webtoon/1')
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
    expect(container.querySelector('.hero-book-motion > .hero-book')).toBeTruthy()
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
    const shell = scene?.parentElement
    expect(shell).toHaveAttribute('aria-hidden', 'true')
    expect(scene).not.toHaveAttribute('aria-hidden')
    expect(scene?.className).not.toMatch(/\bhero-book-enter\b/)
    expect(shell?.className).not.toMatch(/\bhero-book-enter\b/)
    expect(container.querySelector('.hero-book-motion > .hero-book')).toBeTruthy()
    expect(container.querySelector('.hero-book-pages')).toBeTruthy()
    expect(container.querySelector('.hero-book-back')).toBeTruthy()
    expect(screen.queryByTestId('rating-chip')).not.toBeInTheDocument()
  })
})
