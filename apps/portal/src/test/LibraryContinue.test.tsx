import { beforeEach, describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from './utils'
import LibraryPage from '../features/library/LibraryPage'
import { recordHistory } from '../lib/engagement'

const store = new Map<string, string>()

const sessionUser = {
  id: 'u_test',
  email: 'test@example.com',
  username: 'testuser',
  displayName: 'Test User',
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('Library history Continue', () => {
  beforeEach(() => {
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
    store.set('softgate_user', JSON.stringify(sessionUser))
    recordHistory('u_test', '1', 3)
  })

  it('opens the last-read episode from History Continue', async () => {
    const user = userEvent.setup({ delay: null })
    render(<LibraryPage />)
    await user.click(await screen.findByRole('button', { name: /history/i }))
    const continueLink = await screen.findByRole('link', { name: /continue reading/i })
    expect(continueLink).toHaveAttribute('href', '/read/1/3')
  })
})
