import { describe, it, expect, beforeEach } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { render, screen } from './utils'
import WebtoonDetailPage from '../features/webtoon/WebtoonDetailPage'
import { unlockEpisode } from '../lib/wallet'

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

function renderDetail() {
  window.history.pushState({}, '', '/webtoon/1')
  return render(
    <Routes>
      <Route path="/webtoon/:id" element={<WebtoonDetailPage />} />
    </Routes>
  )
}

function lockCountFor(title: string, container: HTMLElement): number {
  const row = screen.getByText(title).closest('a')
  expect(row).not.toBeNull()
  expect(container.contains(row)).toBe(true)
  return row ? row.querySelectorAll('.lucide-lock').length : -1
}

describe('WebtoonDetailPage unlock state', () => {
  beforeEach(() => {
    installStorage()
  })

  it('shows Lock on all premium episodes when logged out', () => {
    const { container } = renderDetail()
    expect(lockCountFor('Training', container)).toBe(1)
    expect(lockCountFor('Dark Secrets', container)).toBe(1)
  })

  it('hides Lock for a purchased premium episode', () => {
    store.set('softgate_user', JSON.stringify(sessionUser))
    const result = unlockEpisode(sessionUser.id, '1', 4, 5, 'test unlock')
    expect(result.ok).toBe(true)

    const { container } = renderDetail()
    expect(lockCountFor('Training', container)).toBe(0)
    expect(lockCountFor('Dark Secrets', container)).toBe(1)
  })
})
