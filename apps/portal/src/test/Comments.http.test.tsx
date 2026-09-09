import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from './utils'
import ReaderCommentsPanel from '../features/reader/components/ReaderCommentsPanel'
import { STORAGE_KEY as COMMENTS_STORAGE_KEY, type StoredComment } from '../lib/comments'

const publicUser = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'reader@example.com',
  username: 'readerone',
  displayName: 'Reader One',
  createdAt: '2026-08-24T00:00:00.000Z',
}

const emptyCatalog = {
  authors: [],
  genres: [],
  webtoons: [],
  episodes: [],
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function commentRow(content: string): StoredComment {
  return {
    id: 'c-http-1',
    episodeKey: '1:1',
    userId: publicUser.id,
    user: {
      id: publicUser.id,
      username: publicUser.username,
      displayName: publicUser.displayName,
    },
    content,
    likeCount: 0,
    likedByUserIds: [] as string[],
    createdAt: '2026-09-09T00:00:00.000Z',
  }
}

describe('comments HTTP', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_USE_MOCK_API', 'false')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('loads a guest thread from GET and does not write softgate_comments_v1', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (url.includes('/api/auth/me')) {
        return jsonResponse({ error: { code: 'NOT_AUTHENTICATED' } }, 401)
      }
      if (url.includes('/api/auth/refresh')) {
        return jsonResponse({ error: { code: 'NOT_AUTHENTICATED' } }, 401)
      }
      if (url.includes('/api/catalog')) {
        return jsonResponse({ data: emptyCatalog }, 200)
      }
      if (url.includes('/api/settings')) {
        return jsonResponse({ data: {} }, 200)
      }
      if (url.includes('/api/comments')) {
        expect(method).toBe('GET')
        expect(url).toContain('key=1%3A1')
        return jsonResponse({ data: { comments: [commentRow('From API')] } }, 200)
      }
      throw new Error(`unexpected ${method} ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<ReaderCommentsPanel webtoonId="1" episodeNumber={1} />)
    expect(await screen.findByText('From API')).toBeInTheDocument()
    expect(window.localStorage.getItem(COMMENTS_STORAGE_KEY)).toBeNull()
  })

  it('posts through the comments API when signed in', async () => {
    let comments = [commentRow('Existing')]
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? 'GET'
      if (url.includes('/api/auth/me')) {
        return jsonResponse({ data: publicUser }, 200)
      }
      if (url.includes('/api/catalog')) {
        return jsonResponse({ data: emptyCatalog }, 200)
      }
      if (url.includes('/api/settings')) {
        return jsonResponse({ data: {} }, 200)
      }
      if (url.includes('/api/library/me')) {
        return jsonResponse({ data: { bookmarks: [], history: [], likedWebtoonIds: [] } }, 200)
      }
      if (url.includes('/api/wallet/me')) {
        return jsonResponse(
          { data: { balance: 0, transactions: [], unlockedEpisodeKeys: [] } },
          200
        )
      }
      if (url.includes('/api/notifications/me')) {
        return jsonResponse({ data: { notifications: [] } }, 200)
      }
      if (url.includes('/api/prefs/me')) {
        return jsonResponse(
          {
            data: {
              notifPrefs: { newEpisode: true, commentReply: true, promotion: true },
              readerPrefs: { darkMode: true, brightness: 0.9, fontSize: 'md', imageFit: 'fit' },
            },
          },
          200
        )
      }
      if (url.includes('/api/comments/add') && method === 'POST') {
        const body = JSON.parse(String(init?.body)) as { content: string; spoiler?: boolean }
        comments = [
          {
            ...commentRow(body.content),
            id: 'c-http-2',
            createdAt: '2026-09-09T01:00:00.000Z',
            spoiler: body.spoiler === true,
          },
          ...comments,
        ]
        return jsonResponse({ data: { comments } }, 200)
      }
      if (url.includes('/api/comments')) {
        return jsonResponse({ data: { comments } }, 200)
      }
      throw new Error(`unexpected ${method} ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup()
    render(<ReaderCommentsPanel webtoonId="1" episodeNumber={1} />)
    expect(await screen.findByText('Existing')).toBeInTheDocument()
    await user.type(screen.getByLabelText('Share your thoughts...'), 'HTTP post')
    await user.click(screen.getByRole('button', { name: /post comment/i }))
    expect(await screen.findByText('HTTP post')).toBeInTheDocument()
    expect(window.localStorage.getItem(COMMENTS_STORAGE_KEY)).toBeNull()
    expect(
      fetchMock.mock.calls.some(
        ([input, init]) => String(input).includes('/api/comments/add') && init?.method === 'POST'
      )
    ).toBe(true)
  })
})
