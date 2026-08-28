import { describe, it, expect, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from './utils'
import ReaderCommentsPanel from '../features/reader/components/ReaderCommentsPanel'
import { addComment, episodeCommentKey } from '../lib/comments'

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

function signIn() {
  store.set('softgate_user', JSON.stringify(sessionUser))
}

describe('ReaderCommentsPanel', () => {
  beforeEach(() => {
    installStorage()
  })

  it('persists a new comment across remounts', async () => {
    signIn()
    const user = userEvent.setup()
    const { unmount } = render(<ReaderCommentsPanel webtoonId="1" episodeNumber={1} />)

    await user.type(screen.getByLabelText('Share your thoughts...'), 'Hello world')
    await user.click(screen.getByRole('button', { name: /post comment/i }))
    expect(screen.getByText('Hello world')).toBeInTheDocument()

    unmount()
    render(<ReaderCommentsPanel webtoonId="1" episodeNumber={1} />)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('persists a reply under its parent', async () => {
    signIn()
    const user = userEvent.setup()
    const { unmount } = render(<ReaderCommentsPanel webtoonId="1" episodeNumber={2} />)

    await user.type(screen.getByLabelText('Share your thoughts...'), 'Parent comment')
    await user.click(screen.getByRole('button', { name: /post comment/i }))

    await user.click(screen.getByRole('button', { name: /^reply$/i }))
    await user.type(screen.getByLabelText('Write a reply...'), 'Nice one{Enter}')
    expect(screen.getByText('Nice one')).toBeInTheDocument()

    unmount()
    render(<ReaderCommentsPanel webtoonId="1" episodeNumber={2} />)
    await user.click(screen.getByRole('button', { name: /1 reply/i }))
    expect(screen.getByText('Nice one')).toBeInTheDocument()
  })

  it('persists an edit and shows the edited marker', async () => {
    signIn()
    const user = userEvent.setup()
    const { unmount } = render(<ReaderCommentsPanel webtoonId="1" episodeNumber={3} />)

    await user.type(screen.getByLabelText('Share your thoughts...'), 'First draft')
    await user.click(screen.getByRole('button', { name: /post comment/i }))

    await user.click(screen.getByRole('button', { name: /more options/i }))
    await user.click(screen.getByRole('button', { name: /^edit$/i }))
    const editBox = screen.getByLabelText('Edit comment')
    await user.clear(editBox)
    await user.type(editBox, 'Updated text')
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    expect(screen.getByText('Updated text')).toBeInTheDocument()
    expect(screen.getByText('(edited)')).toBeInTheDocument()

    unmount()
    render(<ReaderCommentsPanel webtoonId="1" episodeNumber={3} />)
    expect(screen.getByText('Updated text')).toBeInTheDocument()
    expect(screen.getByText('(edited)')).toBeInTheDocument()
  })

  it('deleting a top-level comment removes its replies too', async () => {
    signIn()
    const user = userEvent.setup()
    render(<ReaderCommentsPanel webtoonId="1" episodeNumber={4} />)

    await user.type(screen.getByLabelText('Share your thoughts...'), 'Doomed parent')
    await user.click(screen.getByRole('button', { name: /post comment/i }))
    await user.click(screen.getByRole('button', { name: /^reply$/i }))
    await user.type(screen.getByLabelText('Write a reply...'), 'Doomed reply{Enter}')

    await user.click(screen.getAllByRole('button', { name: /more options/i })[0])
    await user.click(screen.getByRole('button', { name: /^delete$/i }))

    expect(screen.queryByText('Doomed parent')).not.toBeInTheDocument()
    expect(screen.queryByText('Doomed reply')).not.toBeInTheDocument()
    expect(screen.getByText(/no comments yet/i)).toBeInTheDocument()
  })

  it('disables the composer and shows sign-in prompt when logged out', () => {
    render(<ReaderCommentsPanel webtoonId="1" episodeNumber={5} />)

    const textarea = screen.getByLabelText('Share your thoughts...')
    expect(textarea).toBeDisabled()
    expect(screen.getByRole('button', { name: /post comment/i })).toBeDisabled()
    expect(screen.getByText(/sign in to join the discussion/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('does not render raw i18n keys', () => {
    signIn()
    const { container } = render(<ReaderCommentsPanel webtoonId="1" episodeNumber={6} />)
    expect(container.textContent).not.toMatch(/comments\.[a-zA-Z]/)
  })

  it('tracks likes per user', async () => {
    signIn()
    const user = userEvent.setup()
    const { unmount } = render(<ReaderCommentsPanel webtoonId="1" episodeNumber={7} />)

    await user.type(screen.getByLabelText('Share your thoughts...'), 'Like target')
    await user.click(screen.getByRole('button', { name: /post comment/i }))
    await user.click(screen.getByRole('button', { name: /^like$/i }))
    expect(screen.getByRole('button', { name: /^unlike$/i })).toHaveTextContent('1')

    unmount()
    store.set(
      'softgate_user',
      JSON.stringify({ ...sessionUser, id: 'u_other', email: 'other@example.com' })
    )
    render(<ReaderCommentsPanel webtoonId="1" episodeNumber={7} />)
    expect(screen.getByRole('button', { name: /^like$/i })).toHaveTextContent('1')
    expect(screen.queryByRole('button', { name: /^unlike$/i })).not.toBeInTheDocument()
  })

  it('disables the like button when logged out', () => {
    addComment(
      episodeCommentKey('1', 8),
      { id: 'u_seed', username: 'seed', displayName: 'Seed' },
      'Seeded comment'
    )
    render(<ReaderCommentsPanel webtoonId="1" episodeNumber={8} />)
    expect(screen.getByRole('button', { name: /^like$/i })).toBeDisabled()
  })
})
