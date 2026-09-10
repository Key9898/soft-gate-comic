import { describe, it, expect, vi, afterEach } from 'vitest'
import { render as renderPlain, screen } from '@testing-library/react'
import { render } from './utils'
import HomePage from '../features/home/HomePage'
import HomePageSkeleton from '../features/home/components/HomePageSkeleton'
import CategoriesPageSkeleton from '../features/categories/components/CategoriesPageSkeleton'
import WebtoonDetailSkeleton from '../features/webtoon/components/WebtoonDetailSkeleton'
import SearchPageSkeleton from '../features/search/components/SearchPageSkeleton'
import LibraryPageSkeleton from '../features/library/components/LibraryPageSkeleton'
import ReaderSkeleton from '../features/reader/components/ReaderSkeleton'
import AuthorPageSkeleton from '../features/author/components/AuthorPageSkeleton'
import NotificationsPageSkeleton from '../features/notifications/components/NotificationsPageSkeleton'
import CoinsPageSkeleton from '../features/coins/components/CoinsPageSkeleton'
import ProfilePageSkeleton from '../features/profile/components/ProfilePageSkeleton'
import en from '../lib/i18n/locales/en/translation.json'

const emptySharedData = JSON.stringify({
  schemaVersion: 14,
  data: {
    webtoons: [],
    episodes: [],
    users: [],
    comments: [],
    authors: [],
    genres: [],
  },
})

afterEach(() => {
  vi.mocked(window.localStorage.getItem).mockImplementation(() => null)
})

const expectNoInventoryBones = (container: HTMLElement) => {
  expect(container.querySelectorAll('.book-media')).toHaveLength(0)
  expect(container.querySelectorAll('[data-testid="rank-mark"]')).toHaveLength(0)
  expect(screen.queryByText(en.home.emptyTitle)).not.toBeInTheDocument()
  expect(screen.queryByText(en.home.emptyDesc)).not.toBeInTheDocument()
  expect(screen.queryByText(en.errors.catalogUnavailable)).not.toBeInTheDocument()
}

describe('page skeletons', () => {
  const accountSkeletons = [
    ['NotificationsPageSkeleton', <NotificationsPageSkeleton key="n" />],
    ['CoinsPageSkeleton', <CoinsPageSkeleton key="co" />],
    ['ProfilePageSkeleton', <ProfilePageSkeleton key="p" />],
  ] as const

  it.each(accountSkeletons)(
    '%s renders an accessible busy region with no copy',
    (_name, element) => {
      const { container, unmount } = renderPlain(element)
      const region = screen.getByRole('status')
      expect(region).toHaveAttribute('aria-busy', 'true')
      expect(region).toHaveAttribute('aria-label')
      expect(container.textContent).toBe('')
      unmount()
    }
  )

  it.each([
    ['HomePageSkeleton', <HomePageSkeleton key="h" />],
    ['WebtoonDetailSkeleton', <WebtoonDetailSkeleton key="w" />],
    ['LibraryPageSkeleton', <LibraryPageSkeleton key="l" />],
    ['AuthorPageSkeleton', <AuthorPageSkeleton key="a" />],
  ] as const)('%s uses busy wells without inventory bones or empty copy', (_name, element) => {
    const { container, unmount } = render(element)
    const regions = screen.getAllByRole('status')
    expect(regions.length).toBeGreaterThan(0)
    regions.forEach((region) => {
      expect(region).toHaveAttribute('aria-busy', 'true')
      expect(region).toHaveAttribute('aria-label')
    })
    expectNoInventoryBones(container)
    expect(screen.getAllByTestId('catalog-busy-panel').length).toBeGreaterThan(0)
    unmount()
  })

  it('HomePageSkeleton Daily uses live weekday chips and a busy well', () => {
    const { container, unmount } = render(<HomePageSkeleton />)
    expect(container.querySelectorAll('[data-testid="home-daily-weekday"]')).toHaveLength(7)
    expect(container.querySelectorAll('[data-testid="home-daily-drop"]')).toHaveLength(0)
    expect(screen.getByRole('heading', { name: /^daily$/i })).toBeInTheDocument()
    unmount()
  })

  it('HomePageSkeleton hero uses live banner chrome not a solid gray-950 section', () => {
    const { container, unmount } = render(<HomePageSkeleton />)
    const hero = container.querySelector('section.safe-top')
    expect(hero).toBeTruthy()
    expect(hero?.classList.contains('bg-gray-950')).toBe(false)
    const withBanner = Array.from(hero?.querySelectorAll('[style]') ?? []).some((el) =>
      (el.getAttribute('style') ?? '').includes('/banner/banner.png')
    )
    expect(withBanner).toBe(true)
    const withGradient = Array.from(hero?.querySelectorAll('div') ?? []).some((el) =>
      el.className.includes('from-gray-950/70')
    )
    expect(withGradient).toBe(true)
    expect(hero?.querySelectorAll('.book-media')).toHaveLength(0)
    expect(
      screen.getByRole('heading', { level: 1, name: /softgate comic — myanmar webtoons/i })
    ).toBeInTheDocument()
    expect(screen.queryByText(en.home.emptyDesc)).not.toBeInTheDocument()
    unmount()
  })

  it('HomePageSkeleton guest has Start here and omits Continue and For You', () => {
    const { container, unmount } = render(<HomePageSkeleton />)
    expect(screen.getByTestId('home-start-here')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /start here/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^popular$/i })).toBeInTheDocument()
    expect(screen.queryByTestId('home-continue')).not.toBeInTheDocument()
    expect(screen.queryByTestId('home-for-you')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /for you/i })).not.toBeInTheDocument()
    expect(screen.getByTestId('genre-rail-chevron-slot')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /view all/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /get started for free/i })).toBeInTheDocument()
    expectNoInventoryBones(container)
    unmount()
  })

  it('HomePageSkeleton signed-in with history uses Continue well and omits For You', () => {
    const { container, unmount } = render(<HomePageSkeleton signedIn hasContinueHistory />)
    expect(screen.getByTestId('home-continue')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /continue reading/i })).toBeInTheDocument()
    expect(screen.queryByTestId('home-start-here')).not.toBeInTheDocument()
    expect(screen.queryByTestId('home-continue-card')).not.toBeInTheDocument()
    expect(screen.queryByTestId('home-for-you')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /browse webtoons/i })).toBeInTheDocument()
    expectNoInventoryBones(container)
    unmount()
  })

  it('HomePageSkeleton signed-in without history uses Start here and omits For You', () => {
    const { unmount } = render(<HomePageSkeleton signedIn />)
    expect(screen.getByTestId('home-start-here')).toBeInTheDocument()
    expect(screen.queryByTestId('home-continue')).not.toBeInTheDocument()
    expect(screen.queryByTestId('home-for-you')).not.toBeInTheDocument()
    unmount()
  })

  it('WebtoonDetailSkeleton has three episode tabs and no next-drop slot', () => {
    const { container, unmount } = render(<WebtoonDetailSkeleton />)
    expect(screen.queryByTestId('hub-next-drop-slot')).not.toBeInTheDocument()
    expect(screen.getByTestId('hub-episode-tabs').children).toHaveLength(3)
    expect(screen.getByText(en.webtoonDetail.allEpisodes)).toBeInTheDocument()
    expect(screen.getByText(en.webtoonDetail.freeEpisodes)).toBeInTheDocument()
    expect(screen.getByText(en.webtoonDetail.premiumEpisodes)).toBeInTheDocument()
    expectNoInventoryBones(container)
    unmount()
  })

  it('LibraryPageSkeleton has three live tabs', () => {
    const { container, unmount } = render(<LibraryPageSkeleton />)
    expect(screen.getAllByTestId('library-tab')).toHaveLength(3)
    expect(screen.getByText(en.libraryPage.bookmarks)).toBeInTheDocument()
    expect(screen.getByText(en.libraryPage.history)).toBeInTheDocument()
    expect(screen.getByText(en.libraryPage.likes)).toBeInTheDocument()
    expectNoInventoryBones(container)
    unmount()
  })

  it('Categories browse skeleton paints live chrome and a grid well', () => {
    const { container, unmount } = render(<CategoriesPageSkeleton />)
    expect(screen.getByRole('heading', { level: 1, name: 'Browse by Genre' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Browse' })).toBeInTheDocument()
    expect(container.querySelector('.radial-wash-primary')).toBeNull()
    expect(screen.queryByText('Numbered chart')).not.toBeInTheDocument()
    expectNoInventoryBones(container)
    expect(screen.getByTestId('catalog-busy-panel')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Show more genres' })).not.toBeInTheDocument()
    expect(screen.getByTestId('genre-rail-chevron-slot')).toBeInTheDocument()
    expect(
      screen.queryByText(new RegExp(`\\d+\\s+${en.categories.webtoons}`))
    ).not.toBeInTheDocument()
    const allStatuses = screen.getByRole('button', { name: /all statuses/i })
    const sort = screen.getByRole('button', { name: 'Browse' })
    const regions = screen.getAllByRole('status')
    expect(regions.length).toBeGreaterThan(0)
    regions.forEach((region) => {
      expect(region).not.toContainElement(allStatuses)
      expect(region).not.toContainElement(sort)
    })
    unmount()
  })

  it('Categories ranked skeleton paints chart wash without rank bones', () => {
    const { container, unmount } = render(<CategoriesPageSkeleton ranked />)
    expect(container.querySelector('.radial-wash-primary')).toBeTruthy()
    expect(screen.getByText('Numbered chart')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Popular' })).toBeInTheDocument()
    expectNoInventoryBones(container)
    expect(screen.getByTestId('genre-rail-chevron-slot')).toBeInTheDocument()
    unmount()
  })

  it('Categories skeleton status follows the URL-known chip', () => {
    const { unmount } = render(<CategoriesPageSkeleton status="ongoing" />)
    expect(screen.getByRole('button', { name: /^ongoing$/i }).className).toMatch(/bg-primary-50/)
    expect(screen.getByRole('button', { name: /all statuses/i }).className).not.toMatch(
      /bg-primary-50/
    )
    unmount()
  })

  it('Categories genre-slug skeleton does not lie Browse by Genre as the heading', () => {
    const { container, unmount } = render(
      <CategoriesPageSkeleton genreSlug="action" sort="browse" />
    )
    expect(screen.queryByRole('heading', { name: 'Browse by Genre' })).not.toBeInTheDocument()
    expectNoInventoryBones(container)
    unmount()
  })

  it('Categories skeleton sort button follows the sort job', () => {
    const { unmount } = render(<CategoriesPageSkeleton sort="new" />)
    expect(screen.getByRole('heading', { level: 1, name: 'New Releases' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'New Releases' })).toBeInTheDocument()
    unmount()
  })

  it('Search landing skeleton paints live chrome without catalog rails or Go Here', () => {
    const { unmount } = render(<SearchPageSkeleton />)
    expect(screen.getByRole('heading', { level: 1, name: 'Search' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Demo searches' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Browse genres' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Popular' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'New Releases' })).toBeInTheDocument()
    expect(screen.getByText(/no recent searches yet/i)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /view all/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /go here/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Horizon' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Seoul' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Shadow Knight' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Blood Moon' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cyber Dreams' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ko Zaw' })).toBeInTheDocument()
    const search = screen.getByRole('searchbox')
    const statuses = screen.getAllByRole('status')
    expect(statuses.length).toBeGreaterThan(0)
    statuses.forEach((region) => {
      expect(region).not.toContainElement(search)
    })
    expect(document.querySelectorAll('.book-media')).toHaveLength(0)
    expect(screen.queryByTestId('genre-rail-chevron-slot')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('catalog-busy-panel').length).toBeGreaterThan(0)
    expect(screen.queryByText(en.search.catalogEmpty)).not.toBeInTheDocument()
    unmount()
  })

  it('Search landing skeleton reads recent searches from localStorage', () => {
    vi.mocked(window.localStorage.getItem).mockImplementation((key: string) =>
      key === 'softgate_recent_searches' ? JSON.stringify(['Forest']) : null
    )
    const { unmount } = render(<SearchPageSkeleton />)
    expect(screen.getByRole('button', { name: 'Forest' })).toBeInTheDocument()
    expect(screen.queryByText(/no recent searches yet/i)).not.toBeInTheDocument()
    unmount()
  })

  it('Search query skeleton paints live chrome and a result well', () => {
    window.history.pushState({}, '', '/search?q=Horizon')
    const { unmount } = render(<SearchPageSkeleton hasQuery />)
    expect(screen.getByRole('heading', { level: 1, name: 'Search' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toHaveValue('Horizon')
    expect(screen.getByRole('button', { name: /^close$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^webtoons$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^authors$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^episodes$/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /webtoons \(/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /all statuses/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /all genres/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /results for "horizon"/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /^\d+\s+results for/i })).not.toBeInTheDocument()
    const search = screen.getByRole('searchbox')
    const statuses = screen.getAllByRole('status')
    expect(statuses.length).toBeGreaterThan(0)
    statuses.forEach((region) => {
      expect(region).not.toContainElement(search)
    })
    expect(document.querySelectorAll('.book-media')).toHaveLength(0)
    expect(screen.queryByTestId('genre-rail-chevron-slot')).not.toBeInTheDocument()
    expect(screen.getByTestId('catalog-busy-panel')).toBeInTheDocument()
    unmount()
  })

  it('Search query skeleton authors tab hides webtoon filters', () => {
    window.history.pushState({}, '', '/search?q=Horizon&tab=authors')
    const { container, unmount } = render(<SearchPageSkeleton hasQuery />)
    expect(screen.queryByRole('button', { name: /all statuses/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /all genres/i })).not.toBeInTheDocument()
    expect(container.querySelectorAll('.book-media')).toHaveLength(0)
    expect(screen.getByTestId('catalog-busy-panel')).toBeInTheDocument()
    unmount()
  })

  it('Search query skeleton episodes tab uses a busy well', () => {
    window.history.pushState({}, '', '/search?q=Horizon&tab=episodes')
    const { container, unmount } = render(<SearchPageSkeleton hasQuery />)
    expect(screen.queryByRole('button', { name: /all statuses/i })).not.toBeInTheDocument()
    expect(container.querySelectorAll('.book-media')).toHaveLength(0)
    expect(container.querySelectorAll('[class*="aspect-[202/142]"]')).toHaveLength(0)
    expect(screen.getByTestId('catalog-busy-panel')).toBeInTheDocument()
    unmount()
  })

  it('Search query skeleton status and genre follow the URL', () => {
    window.history.pushState({}, '', '/search?q=Horizon&status=ongoing&genre=romance')
    const { unmount } = render(<SearchPageSkeleton hasQuery />)
    expect(screen.getByRole('button', { name: /^ongoing$/i }).className).toMatch(/bg-primary-50/)
    expect(screen.getByRole('button', { name: /all statuses/i }).className).not.toMatch(
      /bg-primary-50/
    )
    expect(screen.getByRole('button', { name: /all genres/i }).className).not.toMatch(
      /bg-primary-50/
    )
    unmount()
  })

  it('ReaderSkeleton paints header and footer chrome without strip tiles', () => {
    const { container, unmount } = renderPlain(<ReaderSkeleton />)
    expect(screen.getByTestId('reader-skeleton-header')).toBeInTheDocument()
    expect(screen.getByTestId('reader-skeleton-footer')).toBeInTheDocument()
    expect(container.firstElementChild?.className).toMatch(/bg-gray-950/)
    expect(container.querySelectorAll('img')).toHaveLength(0)
    expect(container.querySelectorAll('.book-media')).toHaveLength(0)
    unmount()
  })

  it('ReaderSkeleton close uses the series id from the route', () => {
    const { unmount } = renderPlain(<ReaderSkeleton webtoonId="1" />)
    expect(screen.getByRole('link', { name: /close reader/i })).toHaveAttribute(
      'href',
      '/webtoon/1'
    )
    unmount()
  })
})

describe('HomePage loading vs empty resolution', () => {
  it('keeps live Home chrome with empty panels when shared data has zero webtoons', async () => {
    vi.mocked(window.localStorage.getItem).mockImplementation((key: string) =>
      key === 'softgate-shared-data' ? emptySharedData : null
    )
    render(<HomePage />)
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /softgate comic — myanmar webtoons/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /start here/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^popular$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /trending now/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^daily$/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /for you/i })).not.toBeInTheDocument()
    expect(
      screen.getAllByText(/published series will appear here when softgate comic adds titles/i)
        .length
    ).toBeGreaterThan(0)
    expect(screen.queryByRole('button', { name: /refresh/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('renders real content with mock data and no busy region', () => {
    render(<HomePage />)
    expect(screen.getByText(/trending now/i)).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
