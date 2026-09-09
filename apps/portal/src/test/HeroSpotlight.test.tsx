import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from './utils'
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
    const cover = screen.getByTestId('hero-book-cover-link')
    expect(cover).not.toHaveAttribute('href')
    expect(cover).not.toHaveAttribute('tabindex')
    expect(screen.getByRole('button', { name: /start reading/i }).closest('a')).toHaveAttribute(
      'href',
      '/webtoon/1'
    )
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  it('still paints banner chrome and the site heading when slides are empty', () => {
    render(
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
    expect(screen.queryByTestId('hero-book-cover-link')).not.toBeInTheDocument()
    expect(screen.queryByRole('group', { name: /featured webtoons/i })).not.toBeInTheDocument()
  })

  it('uses load-fail copy and omits Help/Creators when unavailable', () => {
    render(
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
    expect(screen.queryByTestId('hero-book-cover-link')).not.toBeInTheDocument()
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

  it('keeps HeroBook3D under a plain width wrapper (no Framer parent)', () => {
    const { container } = render(
      <HeroSpotlight
        slides={slides}
        lang="en"
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />
    )
    const scene = container.querySelector('.hero-book-scene')
    expect(scene).toBeTruthy()
    expect(scene?.className).not.toMatch(/\bhero-book-enter\b/)
    const enterShell = scene?.parentElement
    expect(enterShell?.className).toMatch(/\bhero-book-enter\b/)
    expect(enterShell?.className).toMatch(/\bw-full\b/)
    expect(enterShell?.querySelector(':scope > .hero-book-scene')).toBe(scene)
    const parent = enterShell?.parentElement
    expect(parent?.className).toMatch(/\bw-56\b/)
    expect(parent?.className).toMatch(/\bsm:w-64\b/)
    expect(parent?.className).toMatch(/\blg:w-72\b/)
    expect(parent?.className).toMatch(/\bxl:w-80\b/)
    expect(parent?.className).not.toMatch(/xl:w-96/)
    expect(parent?.className).toMatch(/overflow-visible/)
    expect(parent?.className).toMatch(/\brelative\b/)
    expect(parent?.className).toMatch(/\bz-0\b/)
    expect(parent?.className).toMatch(/\blg:mt-4\b/)
    expect(parent?.className).not.toMatch(/\blg:mt-2\b/)
    expect(parent?.className).not.toMatch(/translate-y-2/)
    expect(parent?.className).not.toMatch(/\btranslate-x-/)
    expect(parent?.querySelector(':scope > .hero-book-enter')).toBe(enterShell)
    expect(parent?.querySelector(':scope > .hero-book-scene')).toBeNull()
    expect(parent?.parentElement?.className).toMatch(/\bhero-spotlight-pair\b/)
    expect(parent?.parentElement?.className).toMatch(/\blg:mt-12\b/)
    expect(parent?.parentElement?.className).toMatch(/\blg:items-center\b/)
    const title = screen.getByText('Alpha Trending')
    expect(title.parentElement?.parentElement?.className).toMatch(/\bz-10\b/)
    expect(title.parentElement?.parentElement?.className).toMatch(/\brelative\b/)
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
