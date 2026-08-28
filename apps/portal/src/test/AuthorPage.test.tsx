import { describe, expect, it, beforeEach } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { render, screen } from './utils'
import AuthorPage from '../features/author/AuthorPage'

const store = new Map<string, string>()

const sessionUser = {
  id: 'u_follow',
  email: 'follow@example.com',
  username: 'followuser',
  displayName: 'Follow User',
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

function renderAuthor(path: string) {
  window.history.pushState({}, '', path)
  return render(
    <Routes>
      <Route path="/author/:id" element={<AuthorPage />} />
      <Route path="/login" element={<p>Login</p>} />
    </Routes>
  )
}

describe('AuthorPage', () => {
  beforeEach(() => {
    installStorage()
  })

  it('shows Ko Zaw, bio, and at least one series without Publish with Us', async () => {
    renderAuthor('/author/1')
    expect(await screen.findByRole('heading', { level: 1, name: 'Ko Zaw' })).toBeInTheDocument()
    expect(screen.getByText('Webtoon artist and storyteller')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Works' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /the last horizon/i })).toHaveAttribute(
      'href',
      '/webtoon/1'
    )
    expect(screen.queryByText('Publish with Us')).not.toBeInTheDocument()
  })

  it('uses author 404 when the id is missing', async () => {
    renderAuthor('/author/missing')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Author not found' })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^categories$/i })).toHaveAttribute(
      'href',
      '/categories'
    )
    expect(screen.getByRole('link', { name: /^popular$/i })).toHaveAttribute('href', '/ranking')
    expect(screen.getByRole('link', { name: /^new releases$/i })).toHaveAttribute(
      'href',
      '/categories?sort=new'
    )
  })

  it('shows Follow without a public follower count and sends guests to login', async () => {
    const user = userEvent.setup()
    renderAuthor('/author/1')
    expect(await screen.findByRole('button', { name: 'Follow' })).toBeInTheDocument()
    expect(
      screen.getByText('This Follow stays on this browser. It is not a public follower count.')
    ).toBeInTheDocument()
    expect(screen.queryByText(/125,?000/)).not.toBeInTheDocument()
    expect(screen.queryByText(/followers/i)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Follow' }))
    expect(window.location.pathname).toBe('/login')
  })

  it('toggles Following for a signed-in reader without writing Library', async () => {
    const user = userEvent.setup()
    store.set('softgate_user', JSON.stringify(sessionUser))
    renderAuthor('/author/1')
    const follow = await screen.findByRole('button', { name: 'Follow' })
    await user.click(follow)
    expect(await screen.findByRole('button', { name: 'Following' })).toBeInTheDocument()
    expect(store.get('softgate_follows_v1')).toContain('"authorId":"1"')
    expect(store.get('softgate_library_v1')).toBeUndefined()
    await user.click(screen.getByRole('button', { name: 'Following' }))
    expect(await screen.findByRole('button', { name: 'Follow' })).toBeInTheDocument()
  })
})
