import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from './utils'
import ProfilePage from '../features/profile/ProfilePage'
import SearchPage from '../features/search/SearchPage'
import CoinsPage from '../features/coins/CoinsPage'
import LibraryPage from '../features/library/LibraryPage'

const store = new Map<string, string>()

const sessionUser = {
  id: 'u_test',
  email: 'test@example.com',
  username: 'testuser',
  displayName: 'Test User',
  createdAt: '2026-01-01T00:00:00.000Z',
}

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
  window.history.pushState({}, '', '/')
})

describe('A11y structure — page h1s', () => {
  it('ProfilePage exposes the display name as the h1', () => {
    render(<ProfilePage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Test User' })).toBeInTheDocument()
  })

  it('SearchPage has a visible Search h1', () => {
    render(<SearchPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Search' })).toBeInTheDocument()
  })

  it('CoinsPage has an sr-only h1', () => {
    render(<CoinsPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Coins' })).toBeInTheDocument()
  })
})

const findLibraryCard = async () =>
  waitFor(() => {
    const card = screen
      .getAllByRole('button')
      .find((el) => el.tagName === 'DIV' && el.getAttribute('tabindex') === '0')
    expect(card).toBeTruthy()
    return card as HTMLElement
  })

describe('A11y structure — keyboard access', () => {
  it('activates a Library card with the Enter key', async () => {
    store.set(
      'softgate_library_v1',
      JSON.stringify({
        schemaVersion: 1,
        byUserId: {
          u_test: [{ webtoonId: '1', addedAt: '2026-08-01T00:00:00.000Z' }],
        },
      })
    )
    render(<LibraryPage />)
    const card = await findLibraryCard()
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(window.location.pathname).toBe('/webtoon/1')
  })
})

describe('A11y structure — status regions', () => {
  it('announces the Library delete toast via role=status', async () => {
    store.set(
      'softgate_library_v1',
      JSON.stringify({
        schemaVersion: 1,
        byUserId: {
          u_test: [{ webtoonId: '1', addedAt: '2026-08-01T00:00:00.000Z' }],
        },
      })
    )
    render(<LibraryPage />)
    await findLibraryCard()
    fireEvent.click(screen.getByText('Edit'))
    fireEvent.click(screen.getByText('Select All'))
    fireEvent.click(screen.getByText('Delete'))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    fireEvent.click(screen.getAllByText('Delete').find((el) => dialog.contains(el))!)
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/collection updated/i)
    })
  })

  it('wires FloatingInput errors as alerts linked to the input', () => {
    render(<ProfilePage />)
    fireEvent.click(screen.getByText('Edit Profile'))
    const nameInput = screen.getByLabelText('Display Name')
    fireEvent.change(nameInput, { target: { value: '' } })
    fireEvent.click(screen.getByText('Save Changes'))
    const alerts = screen.getAllByRole('alert')
    expect(alerts.length).toBeGreaterThan(0)
    expect(nameInput).toHaveAttribute('aria-invalid', 'true')
    expect(nameInput.getAttribute('aria-describedby')).toBeTruthy()
  })
})
