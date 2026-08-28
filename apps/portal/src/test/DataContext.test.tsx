import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataProvider, useData } from '../context/DataContext'

const Probe = () => {
  const { isLoading, error, retry, webtoons, episodes } = useData()
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="error">{error ? 'yes' : 'no'}</span>
      <span data-testid="retry">{typeof retry}</span>
      <span data-testid="webtoons">{webtoons.length}</span>
      <span data-testid="episodes">{episodes.length}</span>
      <button type="button" onClick={retry}>
        retry
      </button>
    </div>
  )
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('DataContext mock catalog', () => {
  it('does not set error and exposes retry', async () => {
    render(
      <DataProvider>
        <Probe />
      </DataProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })
    expect(screen.getByTestId('error')).toHaveTextContent('no')
    expect(screen.getByTestId('retry')).toHaveTextContent('function')
  })
})

const httpCatalog = {
  authors: [],
  genres: [],
  webtoons: [
    {
      id: 'w1',
      title: { en: 'T', mm: 'T' },
      description: { en: 'd', mm: 'd' },
      coverColor: '#000000',
      author: {
        id: 'a1',
        name: { en: 'A', mm: 'A' },
        followerCount: 0,
        webtoonCount: 1,
      },
      genres: [],
      tags: [],
      status: 'ongoing' as const,
      isPremium: false,
      viewCount: 0,
      likeCount: 0,
      episodeCount: 1,
      rating: 0,
      contentRating: 'all' as const,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
  ],
  episodes: [
    {
      id: 'e1',
      webtoonId: 'w1',
      webtoonTitle: { en: 'T', mm: 'T' },
      title: { en: 'E', mm: 'E' },
      images: ['/x.png'],
      isPremium: false,
      coinPrice: 0,
      viewCount: 0,
      likeCount: 0,
      episodeNumber: 1,
      status: 'published' as const,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
  ],
}

describe('DataContext HTTP catalog', () => {
  it('loads from GET /api/catalog and never PUTs /api/data', async () => {
    vi.stubEnv('VITE_USE_MOCK_API', 'false')
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.method ?? 'GET').not.toBe('PUT')
      expect(String(input)).toContain('/api/catalog')
      expect(String(input)).not.toContain('/api/data')
      expect(init?.credentials).toBe('include')
      return new Response(JSON.stringify({ data: httpCatalog }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    render(
      <DataProvider>
        <Probe />
      </DataProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })
    expect(screen.getByTestId('error')).toHaveTextContent('no')
    expect(screen.getByTestId('webtoons')).toHaveTextContent('1')
    expect(screen.getByTestId('episodes')).toHaveTextContent('1')
    expect(fetchMock.mock.calls.every(([, init]) => (init?.method ?? 'GET') !== 'PUT')).toBe(true)
  })

  it('sets error on failure and retry refetches', async () => {
    vi.stubEnv('VITE_USE_MOCK_API', 'false')
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 500 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: httpCatalog }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    vi.stubGlobal('fetch', fetchMock)

    render(
      <DataProvider>
        <Probe />
      </DataProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('yes')
    })
    expect(screen.getByTestId('retry')).toHaveTextContent('function')

    await userEvent.click(screen.getByRole('button', { name: 'retry' }))
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('no')
    })
    expect(screen.getByTestId('webtoons')).toHaveTextContent('1')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
