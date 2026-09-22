import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from './utils'
import type { Webtoon } from '@softgate/shared'
import HeroSpotlight, { AUTOPLAY_MS } from '../features/home/components/HeroSpotlight'

function makeSlide(id: string, titleEn: string, viewCount: number): Webtoon {
  return {
    id,
    title: { en: titleEn, mm: titleEn },
    description: { en: `${titleEn} description`, mm: `${titleEn} description` },
    coverColor: '#123456',
    author: {
      id: 'a1',
      name: { en: 'Author', mm: 'Author' },
      followerCount: 0,
      webtoonCount: 1,
    },
    genres: ['Action'],
    tags: [],
    status: 'ongoing',
    isPremium: false,
    viewCount,
    likeCount: 0,
    rating: 4,
    contentRating: '13',
    episodeCount: 10,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }
}

const slides = [
  makeSlide('1', 'Alpha Trending', 300),
  makeSlide('2', 'Beta Trending', 200),
  makeSlide('3', 'Gamma Trending', 100),
]

describe('HeroSpotlight', () => {
  const isBookmarked = vi.fn(() => false)
  const toggleBookmark = vi.fn()

  beforeEach(() => {
    isBookmarked.mockClear()
    toggleBookmark.mockClear()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('renders the first trending slide title', () => {
    render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    expect(
      screen.getByRole('heading', { level: 1, name: /softgate comic — myanmar webtoons/i })
    ).toBeInTheDocument()
    expect(screen.getByText("This week's spotlight")).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Alpha Trending' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start reading/i }).closest('a')).toHaveAttribute(
      'href',
      '/webtoon/1'
    )
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  it('still paints banner chrome and the site heading when slides are empty', () => {
    const { container } = render(
      <HeroSpotlight
        slides={[]}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    expect(
      screen.getByRole('heading', { level: 1, name: /softgate comic — myanmar webtoons/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/published series will appear here when softgate comic adds titles/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /help center/i }).closest('a')).toHaveAttribute(
      'href',
      '/help'
    )
    expect(screen.getByRole('button', { name: /publish with us/i }).closest('a')).toHaveAttribute(
      'href',
      '/creators'
    )
    expect(screen.queryByRole('button', { name: /start reading/i })).not.toBeInTheDocument()
    expect(container.querySelector('[data-testid="hero-backdrop-banner"]')).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: /featured webtoons/i })).not.toBeInTheDocument()
  })

  it('uses load-fail copy and omits Help/Creators when unavailable', () => {
    const { container } = render(
      <HeroSpotlight
        slides={[]}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
        unavailable
      />
    )
    expect(
      screen.getByRole('heading', { level: 1, name: /softgate comic — myanmar webtoons/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/titles cannot show until the catalog request succeeds/i)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/published series will appear here when softgate comic adds titles/i)
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /help center/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /publish with us/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /start reading/i })).not.toBeInTheDocument()
    expect(container.querySelector('[data-testid="hero-backdrop-banner"]')).toBeInTheDocument()
  })

  it('jumps to a slide when a dot is clicked', () => {
    render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    fireEvent.click(screen.getByRole('tab', { name: /spotlight 2 of 3/i }))
    expect(screen.getByText('Beta Trending')).toBeInTheDocument()
  })

  it('advances and wraps with the next button', () => {
    render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const next = screen.getByRole('button', { name: /next spotlight/i })
    fireEvent.click(next)
    expect(screen.getByText('Beta Trending')).toBeInTheDocument()
    fireEvent.click(next)
    fireEvent.click(next)
    expect(screen.getByText('Alpha Trending')).toBeInTheDocument()
  })

  it('autoplays after the interval and pauses on hover', () => {
    vi.useFakeTimers()
    render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const region = screen.getByRole('region', { name: /featured webtoons/i })
    act(() => {
      vi.advanceTimersByTime(AUTOPLAY_MS)
    })
    expect(screen.getByText('Beta Trending')).toBeInTheDocument()

    fireEvent.mouseEnter(region)
    act(() => {
      vi.advanceTimersByTime(AUTOPLAY_MS * 2)
    })
    expect(screen.getByText('Beta Trending')).toBeInTheDocument()

    fireEvent.mouseLeave(region)
    act(() => {
      vi.advanceTimersByTime(AUTOPLAY_MS)
    })
    expect(screen.getByText('Gamma Trending')).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('keeps autoplay paused after Pause click even when the pointer leaves', () => {
    vi.useFakeTimers()
    render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const region = screen.getByRole('region', { name: /featured webtoons/i })
    fireEvent.click(screen.getByRole('button', { name: /pause spotlight/i }))
    act(() => {
      vi.advanceTimersByTime(AUTOPLAY_MS)
    })
    expect(screen.getByText('Alpha Trending')).toBeInTheDocument()

    fireEvent.mouseLeave(region)
    act(() => {
      vi.advanceTimersByTime(AUTOPLAY_MS)
    })
    expect(screen.getByText('Alpha Trending')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /play spotlight/i }))
    act(() => {
      vi.advanceTimersByTime(AUTOPLAY_MS)
    })
    expect(screen.getByText('Beta Trending')).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('does not autoplay when prefers-reduced-motion is set', () => {
    vi.useFakeTimers()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    act(() => {
      vi.advanceTimersByTime(AUTOPLAY_MS)
    })
    expect(screen.getByText('Alpha Trending')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /pause spotlight/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next spotlight/i })).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('keeps the copy column positioned above the backdrop', () => {
    render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const title = screen.getByText('Alpha Trending')
    expect(title.parentElement?.parentElement?.className).toMatch(/\bz-10\b/)
    expect(title.parentElement?.parentElement?.className).toMatch(/\brelative\b/)
  })

  it('constrains the copy column to a left column on lg+, matching the empty-state max width', () => {
    render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const title = screen.getByRole('heading', { level: 2, name: 'Alpha Trending' })
    const copyColumn = title.parentElement?.parentElement
    expect(copyColumn?.className).toMatch(/\blg:max-w-2xl\b/)
    expect(copyColumn?.className).not.toMatch(/\bflex-1\b/)
    // Below lg the copy stays full width and centred, unchanged from today.
    expect(copyColumn?.className).toMatch(/\bw-full\b/)
    expect(copyColumn?.className).toMatch(/\btext-center\b/)
    expect(copyColumn?.className).toMatch(/\blg:text-left\b/)
  })

  it('clamps hero title and deck without slicing catalog copy', () => {
    const longTitle = 'The Unreasonably Long Spotlight Title That Must Remain Intact In The DOM'
    const longDeck =
      'An elite soldier emerges from the shadows to protect the nation while also explaining several extra plot stakes that would otherwise wrap past two lines.'
    const longSlides: Webtoon[] = [
      {
        ...makeSlide('long', longTitle, 999),
        description: { en: longDeck, mm: longDeck },
      },
    ]

    render(
      <HeroSpotlight
        slides={longSlides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )

    const title = screen.getByText(longTitle)
    expect(title).toBeInTheDocument()
    expect(title.className).toMatch(/\bline-clamp-2\b/)
    expect(title.className).toMatch(/\blg:line-clamp-1\b/)
    expect(title.className).toMatch(/\bbreak-words\b/)
    expect(title.className).not.toMatch(/\btruncate\b/)

    const deck = screen.getByText(longDeck)
    expect(deck.className).toMatch(/\bline-clamp-2\b/)
    expect(deck.className).toMatch(/\bmin-h-2lh\b/)
    expect(deck.className).toMatch(/\bbreak-words\b/)

    const group = title.parentElement
    expect(group?.className).toMatch(/\bmin-w-0\b/)
    expect(group?.className).toMatch(/\bw-full\b/)
    expect(group?.parentElement?.className).toMatch(/\bmin-w-0\b/)
  })
})

describe('hero backdrop', () => {
  const isBookmarked = vi.fn(() => false)
  const toggleBookmark = vi.fn()

  beforeEach(() => {
    isBookmarked.mockClear()
    toggleBookmark.mockClear()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('paints the first slide cover as the backdrop, eager and high priority', () => {
    const backdropSlides = [
      { ...slides[0], keyArt: '/hero-key-art/alpha-key-art.jpg' },
      ...slides.slice(1),
    ]
    const { container } = render(
      <HeroSpotlight
        slides={backdropSlides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const backdrop = container.querySelector('[data-testid="hero-backdrop"] img')
    expect(backdrop).toBeInTheDocument()
    expect(backdrop).toHaveAttribute('fetchpriority', 'high')
    expect(backdrop).not.toHaveAttribute('loading', 'lazy')
  })

  it('keeps banner chrome when there are no slides', () => {
    const { container } = render(
      <HeroSpotlight
        slides={[]}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    expect(container.querySelector('[data-testid="hero-backdrop-banner"]')).toBeInTheDocument()
  })

  // Pins the opacity/blur pairing that keeps the blurred cover wash visible as
  // artwork (not a near-flat dark slab) while the deck and title text stay above
  // WCAG AA contrast — see the comment above this class list in HeroBackdrop.tsx.
  // A future edit that silently drops back toward the original opacity-45 +
  // blur-[60px] should fail here rather than only be caught by eyeballing it.
  it('renders a slide with only coverImage at the tuned blurred-wash opacity and blur', () => {
    const backdropSlides = [
      { ...slides[0], coverImage: '/webtoon-covers/alpha-cover.jpg' },
      ...slides.slice(1),
    ]
    const { container } = render(
      <HeroSpotlight
        slides={backdropSlides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const backdrop = container.querySelector('[data-testid="hero-backdrop"] img')
    expect(backdrop).toBeInTheDocument()
    expect(backdrop?.className).toMatch(/\bopacity-65\b/)
    expect(backdrop?.className).toMatch(/\bblur-\[40px\]/)
    expect(backdrop?.className).toMatch(/\bscale-125\b/)
    expect(backdrop?.className).not.toMatch(/\bopacity-45\b/)
    expect(backdrop?.className).not.toMatch(/\bblur-\[60px\]/)
  })

  // The blurred wash is indistinguishable across the cover variant ladder's rungs (see
  // the opacity/blur comment above), so it lies about its display size to pin srcset
  // selection to a small rung instead of the 768w top of the ladder that a `100vw` hint
  // resolves to for nearly every visitor.
  it('gives the blurred branch a small-rung sizes hint instead of 100vw', () => {
    const backdropSlides = [
      { ...slides[0], coverImage: '/webtoon-covers/alpha-cover.jpg' },
      ...slides.slice(1),
    ]
    const { container } = render(
      <HeroSpotlight
        slides={backdropSlides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const sources = container.querySelectorAll('[data-testid="hero-backdrop"] picture source')
    expect(sources.length).toBeGreaterThan(0)
    sources.forEach((source) => {
      expect(source).toHaveAttribute('sizes', '192px')
    })
  })

  // The keyArt (sharp) branch's own treatment is untouched by the visibility fix:
  // no opacity/blur classes, still object-right.
  it('renders a slide with keyArt sharp, with no opacity or blur classes', () => {
    const backdropSlides = [
      { ...slides[0], keyArt: '/hero-key-art/alpha-key-art.jpg' },
      ...slides.slice(1),
    ]
    const { container } = render(
      <HeroSpotlight
        slides={backdropSlides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const backdrop = container.querySelector('[data-testid="hero-backdrop"] img')
    expect(backdrop?.className).toMatch(/\bobject-right\b/)
    expect(backdrop?.className).not.toMatch(/\bopacity-/)
    expect(backdrop?.className).not.toMatch(/\bblur-/)
  })

  // coverSources() is backed by a variant job that crops to 3:4 and caps at 768px wide -
  // a portrait ladder sized for card slots. It must never apply to keyArt, even if a
  // keyArt asset happened to live under /webtoon-covers/ (the path coverSources matches
  // on): keyArt is landscape and wants to render sharp and full width, not centre-cropped
  // to portrait and capped at 768px. Guards against a regression that would route sharp
  // key art back through the cover pipeline regardless of where the asset is hosted.
  it('never routes keyArt through coverSources, even under a /webtoon-covers/ path', () => {
    const backdropSlides = [
      { ...slides[0], keyArt: '/webtoon-covers/alpha-key-art.jpg' },
      ...slides.slice(1),
    ]
    const { container } = render(
      <HeroSpotlight
        slides={backdropSlides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const picture = container.querySelector('[data-testid="hero-backdrop"] picture')
    expect(picture?.querySelector('source')).not.toBeInTheDocument()
    const backdrop = picture?.querySelector('img')
    expect(backdrop).toHaveAttribute('src', '/webtoon-covers/alpha-key-art.jpg')
  })

  // Pins the softened lg+ slide-branch scrim (halved from the pre-existing /70 /30 /45
  // stack, which was tuned for the sharp, full-opacity banner and quadruple-darkened
  // the blurred cover wash into a near-flat slab when stacked on top of it).
  it('softens the slide-branch scrim so it no longer stacks with the backdrop dimming', () => {
    const { container } = render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const scrim = container.querySelector(
      '[data-testid="hero-pointer-target"] > div.bg-gradient-to-t'
    )
    expect(scrim).toBeInTheDocument()
    const classes = scrim?.className.split(' ') ?? []
    expect(classes).toContain('lg:bg-gradient-to-r')
    expect(classes).toContain('lg:from-gray-950/50')
    expect(classes).toContain('lg:via-gray-950/20')
    expect(classes).toContain('lg:to-gray-950/30')
  })

  // Design spec (wiki/notes/2026-09-22-home-hero-full-bleed-design.md, Layout): "Mobile:
  // bottom scrim, copy over it." Below lg the copy column is centred, so it sits over the
  // weakest middle stop of the lg+ left-to-right ramp - this pins the dedicated bottom-up
  // gradient instead, strong enough (per the rasterized worst case across the demo catalog:
  // 5.64:1 deck, 6.00:1 title at 375x812, both clearing WCAG AA's 4.5:1 / 3:1) to carry the
  // vertically-centred copy, which sits in the upper half of the hero box.
  it('uses a bottom-up scrim below lg, carrying the vertically-centred mobile copy', () => {
    const { container } = render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const scrim = container.querySelector(
      '[data-testid="hero-pointer-target"] > div.bg-gradient-to-t'
    )
    expect(scrim).toBeInTheDocument()
    const classes = scrim?.className.split(' ') ?? []
    expect(classes).toContain('bg-gradient-to-t')
    expect(classes).toContain('from-gray-950/75')
    expect(classes).toContain('via-gray-950/55')
    expect(classes).toContain('to-gray-950/30')
  })

  // The empty/load-fail state's scrim sits over the sharp, full-opacity banner and
  // is untouched by this fix: it must keep its original, stronger stack.
  it('keeps the empty-state scrim at its original strength over the banner', () => {
    const { container } = render(
      <HeroSpotlight
        slides={[]}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const scrim = container.querySelector('div.bg-gradient-to-r')
    expect(scrim).toBeInTheDocument()
    expect(scrim?.className).toMatch(/\bfrom-gray-950\/70\b/)
    expect(scrim?.className).toMatch(/\bvia-gray-950\/30\b/)
    expect(scrim?.className).toMatch(/\bto-gray-950\/45\b/)
  })

  it('cuts the backdrop crossfade under reduced motion', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
    const backdropSlides = [
      { ...slides[0], keyArt: '/hero-key-art/alpha-key-art.jpg' },
      ...slides.slice(1),
    ]
    const { container } = render(
      <HeroSpotlight
        slides={backdropSlides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const backdrop = container.querySelector('[data-testid="hero-backdrop"]')
    expect(backdrop?.className).not.toMatch(/transition/)
  })

  it('crossfades the backdrop when motion is allowed', () => {
    const backdropSlides = [
      { ...slides[0], keyArt: '/hero-key-art/alpha-key-art.jpg' },
      ...slides.slice(1),
    ]
    const { container } = render(
      <HeroSpotlight
        slides={backdropSlides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const backdrop = container.querySelector('[data-testid="hero-backdrop"]')
    expect(backdrop?.className).toMatch(/duration-400/)
  })

  it('crossfades the backdrop image when the slide changes, not a hard cut', async () => {
    const backdropSlides = [
      { ...slides[0], keyArt: '/hero-key-art/alpha-key-art.jpg' },
      { ...slides[1], keyArt: '/hero-key-art/beta-key-art.jpg' },
    ]
    const { container } = render(
      <HeroSpotlight
        slides={backdropSlides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const firstImg = container.querySelector('[data-testid="hero-backdrop"] img')
    expect(firstImg).toHaveAttribute('src', '/hero-key-art/alpha-key-art.jpg')

    fireEvent.click(screen.getByRole('button', { name: /next spotlight/i }))

    const outgoingImg = container.querySelector('[data-testid="hero-backdrop-outgoing"] img')
    expect(outgoingImg).toHaveAttribute('src', '/hero-key-art/alpha-key-art.jpg')
    const incomingImg = container.querySelector('[data-testid="hero-backdrop"] img')
    expect(incomingImg).toHaveAttribute('src', '/hero-key-art/beta-key-art.jpg')

    await waitFor(() => {
      expect(
        container.querySelector('[data-testid="hero-backdrop-outgoing"]')
      ).not.toBeInTheDocument()
    })
  })
})

describe('hero pointer-only navigation', () => {
  const isBookmarked = vi.fn(() => false)
  const toggleBookmark = vi.fn()

  beforeEach(() => {
    isBookmarked.mockClear()
    toggleBookmark.mockClear()
    window.history.pushState({}, '', '/')
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('navigates to the series hub when clicking the hero background', () => {
    const { container } = render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const pointerTarget = container.querySelector('[data-testid="hero-pointer-target"]')
    expect(pointerTarget).toBeInTheDocument()
    fireEvent.click(pointerTarget as Element)
    expect(window.location.pathname).toBe('/webtoon/1')
  })

  it('is a pointer-only div: no href, not tabbable, and adds no link to the accessibility tree', () => {
    const { container } = render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const pointerTarget = container.querySelector('[data-testid="hero-pointer-target"]')
    expect(pointerTarget).toBeInTheDocument()
    expect(pointerTarget?.tagName).toBe('DIV')
    expect(pointerTarget).not.toHaveAttribute('href')
    expect(pointerTarget).not.toHaveAttribute('tabindex')
    expect((pointerTarget as HTMLElement).tabIndex).toBe(-1)

    // Only the real Start Reading link should be exposed to the SR link list.
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', '/webtoon/1')
  })

  it('does not navigate when clicking Pause, and Pause still pauses autoplay', () => {
    vi.useFakeTimers()
    render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /pause spotlight/i }))
    expect(window.location.pathname).toBe('/')

    act(() => {
      vi.advanceTimersByTime(AUTOPLAY_MS)
    })
    expect(screen.getByText('Alpha Trending')).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('does not navigate when clicking Save/bookmark', () => {
    render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }))
    expect(window.location.pathname).toBe('/')
    expect(toggleBookmark).toHaveBeenCalledWith('1')
  })

  it('does not navigate when clicking a pager dot', () => {
    render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    fireEvent.click(screen.getByRole('tab', { name: /spotlight 2 of 3/i }))
    expect(window.location.pathname).toBe('/')
    expect(screen.getByText('Beta Trending')).toBeInTheDocument()
  })

  it('does not navigate when clicking the next arrow', () => {
    render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /next spotlight/i }))
    expect(window.location.pathname).toBe('/')
  })

  it('does not navigate when clicking Start Reading directly (Link handles its own navigation)', () => {
    render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /start reading/i }))
    // Still ends up at the hub via the real Link, not a duplicate navigate() call.
    expect(window.location.pathname).toBe('/webtoon/1')
  })
})
