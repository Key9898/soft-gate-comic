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

const emptySharedData = JSON.stringify({
  schemaVersion: 7,
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

describe('page skeletons', () => {
  const skeletons = [
    ['HomePageSkeleton', <HomePageSkeleton key="h" />],
    ['CategoriesPageSkeleton', <CategoriesPageSkeleton key="c" />],
    ['WebtoonDetailSkeleton', <WebtoonDetailSkeleton key="w" />],
    ['SearchPageSkeleton', <SearchPageSkeleton key="s" />],
    ['LibraryPageSkeleton', <LibraryPageSkeleton key="l" />],
    ['ReaderSkeleton', <ReaderSkeleton key="r" />],
  ] as const

  it.each(skeletons)('%s renders an accessible busy region with no text', (_name, element) => {
    const { container, unmount } = renderPlain(element)
    const region = screen.getByRole('status')
    expect(region).toHaveAttribute('aria-busy', 'true')
    expect(region).toHaveAttribute('aria-label')
    expect(container.textContent).toBe('')
    unmount()
  })
})

describe('HomePage loading vs empty resolution', () => {
  it('shows the empty state, not a skeleton, when shared data has zero webtoons', () => {
    vi.mocked(window.localStorage.getItem).mockImplementation((key: string) =>
      key === 'softgate-shared-data' ? emptySharedData : null
    )
    render(<HomePage />)
    expect(screen.getByText(/no webtoons here yet/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('renders real content with mock data and no busy region', () => {
    render(<HomePage />)
    expect(screen.getByText(/trending now/i)).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
