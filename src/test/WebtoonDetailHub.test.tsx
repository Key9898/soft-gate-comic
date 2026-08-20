import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { render, screen, fireEvent, within } from './utils'
import WebtoonDetailPage from '../features/webtoon/WebtoonDetailPage'
import ReaderPage from '../features/reader/ReaderPage'
import { ENGAGEMENT_SCHEMA_VERSION, STORAGE_KEY as ENGAGE_STORAGE_KEY } from '../lib/engagement'
import { addComment, episodeCommentKey, listComments, seriesCommentKey } from '../lib/comments'

const store = new Map<string, string>()

const sessionUser = {
  id: 'u_tester',
  email: 'tester@example.com',
  username: 'tester',
  displayName: 'Tester',
  createdAt: '2026-01-01T00:00:00.000Z',
}

function installStorage() {
  store.clear()
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value)
      },
      removeItem: (key: string) => {
        store.delete(key)
      },
      clear: () => store.clear(),
      length: 0,
      key: () => null,
    },
  })
}

function seedHistory(episodeNumber: number, scrollRatio = 0.4) {
  store.set('softgate_user', JSON.stringify(sessionUser))
  store.set(
    ENGAGE_STORAGE_KEY,
    JSON.stringify({
      schemaVersion: ENGAGEMENT_SCHEMA_VERSION,
      byUserId: {
        [sessionUser.id]: {
          history: [
            {
              webtoonId: '1',
              episodeNumber,
              lastReadAt: '2026-08-01T00:00:00.000Z',
              scrollRatio,
              readEpisodeNumbers: [episodeNumber],
            },
          ],
          likedWebtoonIds: [],
          ratings: {},
        },
      },
    })
  )
}

function renderDetail(path = '/webtoon/1') {
  window.history.pushState({}, '', path)
  return render(
    <Routes>
      <Route path="/webtoon/:id" element={<WebtoonDetailPage />} />
    </Routes>
  )
}

describe('WebtoonDetailPage series hub', () => {
  beforeEach(() => {
    installStorage()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('continues at the last-read episode instead of episode 1', async () => {
    seedHistory(3)
    renderDetail()
    const continueLinks = await screen.findAllByRole('link', { name: /continue reading/i })
    expect(continueLinks.length).toBeGreaterThan(0)
    continueLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/read/1/3')
    })
    expect(screen.getByTestId('hero-book-cover-link')).toHaveAttribute('href', '/read/1/3')
    expect(screen.queryByRole('link', { name: /^start reading$/i })).not.toBeInTheDocument()
  })

  it('links genres to category browse and tags to search', async () => {
    renderDetail()
    expect(await screen.findByRole('link', { name: 'Action' })).toHaveAttribute(
      'href',
      '/categories/action'
    )
    expect(screen.getByRole('link', { name: 'မှော်' })).toHaveAttribute(
      'href',
      `/search?q=${encodeURIComponent('မှော်')}`
    )
  })

  it('titles related series as you may also like, not Featured', async () => {
    renderDetail()
    expect(await screen.findByRole('heading', { name: 'You may also like' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Featured' })).not.toBeInTheDocument()
  })

  it('links the author chip to the author profile', async () => {
    renderDetail()
    expect(await screen.findByRole('link', { name: /view profile of ko zaw/i })).toHaveAttribute(
      'href',
      '/author/1'
    )
  })

  it('shows other works by the same author', async () => {
    renderDetail()
    expect(await screen.findByRole('heading', { name: 'Other works' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^view all$/i })).toHaveAttribute('href', '/author/1')
    const otherWorks = await screen.findAllByRole('link', { name: /forest spirit/i })
    expect(otherWorks.length).toBeGreaterThan(0)
    otherWorks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/webtoon/6')
    })
  })

  it('omits Latest when it would duplicate the primary read target', async () => {
    seedHistory(5, 0.4)
    renderDetail()
    const continueLinks = await screen.findAllByRole('link', { name: /continue reading/i })
    continueLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/read/1/5')
    })
    expect(screen.queryByRole('link', { name: /latest episode/i })).not.toBeInTheDocument()
  })

  it('shows episode dates and views on the row without a sm-only class', async () => {
    renderDetail()
    const dates = await screen.findAllByText('22 Jan 2026')
    expect(dates.some((node) => !node.className.includes('hidden'))).toBe(true)
    const views = screen.getByText(/125K views/i)
    expect(views.className).not.toMatch(/\bhidden\b/)
  })

  it('does not list draft episodes on the series hub', async () => {
    renderDetail()
    await screen.findByRole('heading', { level: 1, name: 'The Last Horizon' })
    expect(screen.queryByText('Draft episode')).not.toBeInTheDocument()
  })

  it('renames Save to Subscribe and shows mute after subscribe', async () => {
    store.set('softgate_user', JSON.stringify(sessionUser))
    renderDetail()
    const subscribe = await screen.findByRole('button', { name: 'Subscribe' })
    fireEvent.click(subscribe)
    expect(await screen.findByRole('button', { name: 'Subscribed' })).toBeInTheDocument()
    expect(screen.getByTestId('notify-mute')).toBeInTheDocument()
  })

  it('shows an 18+ badge on Blood Moon without an age modal on the hub', async () => {
    renderDetail('/webtoon/7')
    expect(await screen.findByRole('heading', { name: 'Blood Moon' })).toBeInTheDocument()
    const badges = screen.getAllByTestId('content-rating-badge')
    expect(badges.some((node) => node.getAttribute('data-rating') === '18')).toBe(true)
    expect(screen.queryByTestId('age-gate')).not.toBeInTheDocument()
    expect(screen.getByTestId('hub-comments')).toBeInTheDocument()
  })

  it('shows the next scheduled drop without linking to the unpublished episode', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-08-19T12:00:00.000Z'))
    renderDetail('/webtoon/1')
    expect(await screen.findByTestId('hub-next-drop')).toBeInTheDocument()
    expect(screen.getByText('Next drop')).toBeInTheDocument()
    expect(screen.getByText(/Ep 7/)).toBeInTheDocument()
    expect(screen.getByText(/After the Storm/)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /After the Storm/ })).not.toBeInTheDocument()
  })

  it('hides next drop when no episode is scheduled', async () => {
    renderDetail('/webtoon/5')
    expect(await screen.findByRole('heading', { name: 'Golden Age' })).toBeInTheDocument()
    expect(screen.queryByTestId('hub-next-drop')).not.toBeInTheDocument()
  })
})

describe('series hub comments', () => {
  beforeEach(() => {
    installStorage()
  })

  it('shows series discussion on the hub', async () => {
    renderDetail()
    expect(await screen.findByTestId('hub-comments')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Series discussion' })).toBeInTheDocument()
  })

  it('prompts guests to sign in before posting on the hub', async () => {
    renderDetail()
    const hub = await screen.findByTestId('hub-comments')
    expect(within(hub).getByText(/sign in to join the discussion/i)).toBeInTheDocument()
    expect(within(hub).getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('keeps hub posts off the episode reader thread', async () => {
    store.set('softgate_user', JSON.stringify(sessionUser))
    const user = userEvent.setup()
    const first = renderDetail()
    await screen.findByTestId('hub-comments')
    await user.type(screen.getByLabelText('Share your thoughts...'), 'Hub only')
    await user.click(screen.getByRole('button', { name: /post comment/i }))
    expect(screen.getByText('Hub only')).toBeInTheDocument()
    first.unmount()
    const second = renderDetail()
    expect(await screen.findByText('Hub only')).toBeInTheDocument()
    expect(listComments(seriesCommentKey('1')).map((c) => c.content)).toEqual(['Hub only'])
    expect(listComments(episodeCommentKey('1', 1))).toEqual([])
    second.unmount()
    window.history.pushState({}, '', '/read/1/1')
    render(
      <Routes>
        <Route path="/read/:webtoonId/:episodeNumber" element={<ReaderPage />} />
      </Routes>
    )
    fireEvent.click(await screen.findByRole('button', { name: 'Comments' }))
    expect(await screen.findByLabelText('Share your thoughts...')).toBeInTheDocument()
    expect(screen.queryByText('Hub only')).not.toBeInTheDocument()
  })

  it('does not show episode comments on the hub thread', async () => {
    addComment(
      episodeCommentKey('1', 1),
      {
        id: sessionUser.id,
        username: sessionUser.username,
        displayName: sessionUser.displayName,
      },
      'Episode only'
    )
    renderDetail()
    expect(await screen.findByTestId('hub-comments')).toBeInTheDocument()
    expect(screen.queryByText('Episode only')).not.toBeInTheDocument()
  })
})

describe('unpublished episode recovery', () => {
  beforeEach(() => {
    installStorage()
  })

  it('returns episode 404 for a draft episode route', async () => {
    window.history.pushState({}, '', '/read/1/99')
    render(
      <Routes>
        <Route path="/read/:webtoonId/:episodeNumber" element={<ReaderPage />} />
      </Routes>
    )
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Episode not found' })
    ).toBeInTheDocument()
  })

  it('returns episode 404 for a scheduled episode route', async () => {
    window.history.pushState({}, '', '/read/3/4')
    render(
      <Routes>
        <Route path="/read/:webtoonId/:episodeNumber" element={<ReaderPage />} />
      </Routes>
    )
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Episode not found' })
    ).toBeInTheDocument()
  })
})
