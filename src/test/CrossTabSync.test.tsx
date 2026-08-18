import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from './utils'
import ReaderCommentsPanel from '../features/reader/components/ReaderCommentsPanel'
import { useAuth } from '../context/AuthContext'
import { useWallet } from '../context/WalletContext'
import { useEngagement } from '../context/EngagementContext'
import { DEFAULT_SEED_BALANCE, demoTopUp } from '../lib/wallet'
import { toggleLike } from '../lib/engagement'
import { addComment, episodeCommentKey } from '../lib/comments'

const store = new Map<string, string>()

const sessionUser = {
  id: 'u_tab_a',
  email: 'taba@example.com',
  username: 'taba',
  displayName: 'Tab A',
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

function dispatchStorage(key: string) {
  fireEvent(window, new StorageEvent('storage', { key }))
}

const Probe = () => {
  const { user, isAuthenticated } = useAuth()
  const { balance } = useWallet()
  const { likedWebtoonIds } = useEngagement()
  return (
    <div>
      <span data-testid="auth">{isAuthenticated ? (user?.email ?? '') : 'logged-out'}</span>
      <span data-testid="balance">{balance}</span>
      <span data-testid="likes">{likedWebtoonIds.join(',')}</span>
    </div>
  )
}

describe('cross-tab sync via storage events', () => {
  beforeEach(() => {
    installStorage()
  })

  it('logs out when another tab clears the session', () => {
    signIn()
    render(<Probe />)
    expect(screen.getByTestId('auth')).toHaveTextContent('taba@example.com')

    store.delete('softgate_user')
    dispatchStorage('softgate_user')
    expect(screen.getByTestId('auth')).toHaveTextContent('logged-out')
  })

  it('refreshes wallet balance after another tab tops up', () => {
    signIn()
    render(<Probe />)
    expect(screen.getByTestId('balance')).toHaveTextContent(String(DEFAULT_SEED_BALANCE))

    demoTopUp(sessionUser.id, 50, 'tab B top-up')
    dispatchStorage('softgate_wallet_v1')
    expect(screen.getByTestId('balance')).toHaveTextContent(String(DEFAULT_SEED_BALANCE + 50))
  })

  it('refreshes likes after another tab toggles a like', () => {
    signIn()
    render(<Probe />)
    expect(screen.getByTestId('likes')).toHaveTextContent('')

    toggleLike(sessionUser.id, 'wt-1')
    dispatchStorage('softgate_engage_v1')
    expect(screen.getByTestId('likes')).toHaveTextContent('wt-1')
  })

  it('refreshes comments after another tab posts one', () => {
    signIn()
    render(<ReaderCommentsPanel webtoonId="1" episodeNumber={9} />)
    expect(screen.queryByText('Synced from tab B')).not.toBeInTheDocument()

    addComment(
      episodeCommentKey('1', 9),
      { id: 'u_tab_b', username: 'tabb', displayName: 'Tab B' },
      'Synced from tab B'
    )
    dispatchStorage('softgate_comments_v1')
    expect(screen.getByText('Synced from tab B')).toBeInTheDocument()
  })

  it('ignores unrelated storage keys', () => {
    signIn()
    render(<Probe />)
    expect(screen.getByTestId('balance')).toHaveTextContent(String(DEFAULT_SEED_BALANCE))

    demoTopUp(sessionUser.id, 50, 'tab B top-up')
    dispatchStorage('softgate_recent_searches')
    expect(screen.getByTestId('balance')).toHaveTextContent(String(DEFAULT_SEED_BALANCE))
  })
})
