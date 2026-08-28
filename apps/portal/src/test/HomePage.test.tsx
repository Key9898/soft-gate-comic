import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from './utils'
import HomePage from '../features/home/HomePage'
import { SESSION_STORAGE_KEY } from '../lib/auth/types'
import { STORAGE_KEY as ENGAGE_STORAGE_KEY } from '../lib/engagement'
import { STORAGE_KEY as LIBRARY_STORAGE_KEY } from '../lib/library'

const sessionUser = {
  id: 'u_test',
  email: 'test@example.com',
  username: 'testuser',
  displayName: 'Test User',
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('HomePage', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders ranking, trending, daily, updated, and new rails', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { name: 'Popular' })).toBeInTheDocument()
    expect(screen.getByText('Trending Now')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Daily' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Updated' })).toBeInTheDocument()
    expect(screen.getByText('New Releases')).toBeInTheDocument()
  })

  it('renders new releases section', () => {
    render(<HomePage />)
    expect(screen.getByText('New Releases')).toBeInTheDocument()
  })

  it('renders genres section', () => {
    render(<HomePage />)
    expect(screen.getByText('Genres:')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^all$/i })).toHaveAttribute('href', '/categories')
    expect(screen.getByRole('link', { name: /^action$/i })).toHaveAttribute(
      'href',
      '/categories/action'
    )
  })

  it('renders start reading button', () => {
    render(<HomePage />)
    expect(screen.getByRole('button', { name: /start reading/i })).toBeInTheDocument()
  })

  it('renders subscribe CTA beside start reading', () => {
    render(<HomePage />)
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  it('renders view all links', () => {
    render(<HomePage />)
    const viewAllLinks = screen.getAllByText('View All')
    expect(viewAllLinks).toHaveLength(3)
    const ranking = screen.getByRole('heading', { name: 'Popular' }).closest('section')
    expect(ranking).toBeTruthy()
    expect(ranking?.querySelector('ol')).toBeTruthy()
    const popularRanks = ranking?.querySelectorAll('[data-testid="rank-mark"]')
    expect(popularRanks?.length).toBe(6)
    expect(popularRanks?.[0]?.className).toMatch(/text-2xl/)
    expect(popularRanks?.[0]?.className).toMatch(/left-1/)
    expect(popularRanks?.[0]?.className).not.toMatch(/text-shadow/)
    expect(popularRanks?.[0]?.className).not.toMatch(/translate-y/)
    expect(popularRanks?.[0]?.className).not.toMatch(/text-4xl/)
    expect(popularRanks?.[0]?.className).not.toMatch(/radial-gradient/)
    expect(popularRanks?.[0]?.className).not.toMatch(/drop-shadow/)
    expect(popularRanks?.[0]?.className).not.toMatch(/blur/)
    const rankBack = popularRanks?.[0]?.querySelector('.origin-center')
    expect(rankBack?.className).toMatch(/scale-\[1\.2\]/)
    expect(rankBack?.className).toMatch(/text-white/)
    expect(popularRanks?.[0]?.children[1]?.className).toMatch(/-webkit-text-stroke:3px_#0e9494/)
    expect(ranking?.querySelector('.text-6xl')).toBeNull()
    expect(ranking?.querySelector('.pl-12')).toBeNull()
    expect(ranking?.querySelector('.book-rank-notch')).toBeNull()
    expect(ranking?.querySelector('ol')?.className).toMatch(/xl:grid-cols-6/)
    const rankingViewAll = ranking?.querySelector('a[href="/ranking"]')
    expect(rankingViewAll).toBeTruthy()
    const trending = screen.getByRole('heading', { name: 'Trending Now' }).closest('section')
    expect(trending).toBeTruthy()
    expect(trending?.textContent).toContain('Titles rising this week, not all-time reads.')
    expect(trending?.textContent).not.toContain('View All')
    const daily = screen.getByRole('heading', { name: 'Daily' }).closest('section')
    expect(daily).toBeTruthy()
    expect(daily?.textContent).toContain('Upcoming episode drops this weekday.')
    expect(daily?.querySelector('.lucide-calendar-days')).toBeTruthy()
    expect(daily?.textContent).not.toContain('View All')
    expect(daily?.querySelector('a[href^="/categories"]')).toBeNull()
    const updated = screen.getByRole('heading', { name: 'Updated' }).closest('section')
    expect(updated).toBeTruthy()
    expect(updated?.textContent).toContain('Latest published episode activity, not new series.')
    expect(updated?.querySelector('.lucide-clock')).toBeTruthy()
    expect(updated?.querySelector('a[href="/categories?sort=recentlyUpdated"]')).toBeTruthy()
    const newReleases = screen.getByRole('heading', { name: 'New Releases' }).closest('section')
    expect(newReleases).toBeTruthy()
    expect(newReleases?.textContent).toContain('Newly added series, not new episodes.')
    expect(newReleases?.querySelector('.lucide-sparkles')).toBeTruthy()
    expect(newReleases?.querySelector('a[href="/categories?sort=new"]')).toBeTruthy()
    const updatedHrefs = [...(updated?.querySelectorAll('a[href^="/webtoon/"]') ?? [])].map(
      (node) => node.getAttribute('href')
    )
    const newHrefs = [...(newReleases?.querySelectorAll('a[href^="/webtoon/"]') ?? [])].map(
      (node) => node.getAttribute('href')
    )
    expect(updatedHrefs.some((href) => href && newHrefs.includes(href))).toBe(false)
    expect(updated?.textContent).toContain('Shadow Knight')
    expect(updated?.textContent).toContain('19 Aug 2026')
    expect(updated?.textContent).not.toContain('Campus Life')
    expect(newReleases?.textContent).toContain('Campus Life')
  })

  it('lists unpublished Daily drops by Yangon weekday, not as links', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-08-19T12:00:00.000Z'))
    render(<HomePage />)
    const daily = screen.getByRole('heading', { name: 'Daily' }).closest('section')
    expect(daily).toBeTruthy()
    const board = within(daily as HTMLElement)
    expect(board.getByRole('button', { name: 'Wed' })).toHaveAttribute('aria-pressed', 'true')
    expect(board.getByText('Shadow Knight')).toBeInTheDocument()
    const countdown = board.getByTestId('daily-drop-countdown')
    expect(countdown).toHaveTextContent('Publishing soon')
    expect(countdown.closest('.book-media')).toBeTruthy()
    expect(board.queryAllByText('Publishing soon')).toHaveLength(1)
    const episodeLine = board.getByText(/Ep 4/)
    expect(episodeLine).toBeInTheDocument()
    expect(episodeLine.closest('.book-media')).toBeNull()
    expect(daily?.querySelector('a[href^="/webtoon/"]')).toBeNull()
    expect(daily?.querySelector('a[href^="/read/"]')).toBeNull()
    fireEvent.click(board.getByRole('button', { name: 'Fri' }))
    expect(board.getByRole('button', { name: 'Fri' })).toHaveAttribute('aria-pressed', 'true')
    expect(board.getByText('The Last Horizon')).toBeInTheDocument()
    expect(board.getByText('Cyber Dreams')).toBeInTheDocument()
    fireEvent.click(board.getByRole('button', { name: 'Tue' }))
    expect(board.getByText('Love in Seoul')).toBeInTheDocument()
    expect(board.queryByText('Golden Age')).not.toBeInTheDocument()
    expect(board.queryByText('Forest Spirit')).not.toBeInTheDocument()
    const updated = screen.getByRole('heading', { name: 'Updated' }).closest('section')
    expect(updated?.textContent).toContain('Latest published episode activity, not new series.')
    expect(updated?.querySelector('.lucide-clock')).toBeTruthy()
  })

  it('shows catalog release dates instead of relative ages', () => {
    render(<HomePage />)
    expect(screen.queryByText(/years ago/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/2023/)).not.toBeInTheDocument()
    expect(screen.queryByText(/2024/)).not.toBeInTheDocument()
    expect(screen.getAllByText(/\d{1,2} [A-Z][a-z]{2} 2026/).length).toBeGreaterThan(0)
  })

  it('badges the newest releases even inside Popular', () => {
    render(<HomePage />)
    const ranking = screen.getByRole('heading', { name: 'Popular' }).closest('section')
    expect(ranking).toBeTruthy()
    expect(ranking?.textContent).toContain('Love in Seoul')
    expect(screen.getByRole('link', { name: '1. Shadow Knight' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '6. Cyber Dreams' })).toBeInTheDocument()
    const newMarks = screen.getAllByText('New')
    expect(newMarks.length).toBeGreaterThanOrEqual(6)
  })

  it('shows a start-here rail for guests, not a Popular eyebrow', () => {
    render(<HomePage />)
    const startHere = screen.getByRole('heading', { name: 'Start here' }).closest('section')
    expect(startHere).toBeTruthy()
    expect(startHere?.textContent).toContain(
      "First episode is free. Titles not in this week's spotlight."
    )
    expect(startHere?.querySelector('.lucide-play')).toBeTruthy()
    const startHrefs = [...(startHere?.querySelectorAll('a[href]') ?? [])].map((node) =>
      node.getAttribute('href')
    )
    expect(startHrefs.length).toBeGreaterThan(0)
    expect(startHrefs.every((href) => href && /^\/read\/[^/]+\/1$/.test(href))).toBe(true)
    expect(startHere?.querySelector('a[href^="/webtoon/"]')).toBeNull()
    expect(startHere?.textContent).not.toContain('Love in Seoul')
    expect(startHere?.textContent).not.toContain('Ocean Dreams')
    expect(startHere?.textContent).not.toContain('Campus Life')
    expect(startHere?.textContent).not.toContain('Shadow Knight')
    expect(startHere?.textContent).not.toContain('Cyber Dreams')
    const ranking = screen.getByRole('heading', { name: 'Popular' }).closest('section')
    expect(ranking?.textContent).not.toContain('Start here')
    expect(ranking?.textContent).toContain('Most-read series on SoftGate Comic')
    expect(screen.getByRole('button', { name: /get started for free/i })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: /softgate comic — myanmar webtoons/i })
    ).toBeInTheDocument()
    expect(screen.getByText("This week's spotlight")).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Love in Seoul' })).toBeInTheDocument()
    expect(screen.getByTestId('hero-book-cover-link')).not.toHaveAttribute('href')
    expect(screen.queryByRole('heading', { name: 'For You' })).not.toBeInTheDocument()
  })

  it('centers hero content in a mid-band shell', () => {
    const { container } = render(<HomePage />)
    const shell = container.querySelector('.hero-landscape-adjust')
    expect(shell).toBeTruthy()
    expect(shell?.className).toMatch(/justify-center/)
    expect(shell?.className).toMatch(/min-h-\[/)
  })
})

describe('HomePage continue XOR start here', () => {
  afterEach(() => {
    vi.mocked(window.localStorage.getItem).mockImplementation(() => null)
  })

  it('shows Continue instead of Start here when history exists', () => {
    vi.mocked(window.localStorage.getItem).mockImplementation((key: string) => {
      if (key === SESSION_STORAGE_KEY) {
        return JSON.stringify(sessionUser)
      }
      if (key === ENGAGE_STORAGE_KEY) {
        return JSON.stringify({
          schemaVersion: 3,
          byUserId: {
            u_test: {
              history: [
                {
                  webtoonId: '1',
                  episodeNumber: 1,
                  lastReadAt: '2026-08-19T00:00:00.000Z',
                  scrollRatio: 0.2,
                  readEpisodeNumbers: [1],
                },
              ],
              likedWebtoonIds: [],
              ratings: {},
            },
          },
        })
      }
      return null
    })
    render(<HomePage />)
    expect(screen.getByRole('heading', { name: 'Continue Reading' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Start here' })).not.toBeInTheDocument()
  })

  it('shows For You when signed in with a subscription', () => {
    vi.mocked(window.localStorage.getItem).mockImplementation((key: string) => {
      if (key === SESSION_STORAGE_KEY) {
        return JSON.stringify(sessionUser)
      }
      if (key === LIBRARY_STORAGE_KEY) {
        return JSON.stringify({
          schemaVersion: 1,
          byUserId: {
            u_test: [{ webtoonId: '1', addedAt: '2026-08-01T00:00:00.000Z' }],
          },
        })
      }
      return null
    })
    render(<HomePage />)
    const forYou = screen.getByRole('heading', { name: 'For You' }).closest('section')
    expect(forYou).toBeTruthy()
    expect(forYou?.textContent).toContain(
      'From your subscriptions, likes, and reading — not weekly views.'
    )
    expect(forYou?.querySelector('ol')).toBeNull()
    expect(forYou?.querySelector('a[href="/ranking"]')).toBeNull()
    expect(screen.getByRole('heading', { name: 'Popular' })).toBeInTheDocument()
  })
})
