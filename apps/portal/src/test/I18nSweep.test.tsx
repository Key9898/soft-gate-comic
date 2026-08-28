import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest'
import { render, screen } from './utils'
import i18n from '../lib/i18n'
import HomePage from '../features/home/HomePage'
import ProfilePage from '../features/profile/ProfilePage'
import LibraryPage from '../features/library/LibraryPage'

const store = new Map<string, string>()

const sessionUser = {
  id: 'u_test',
  email: 'test@example.com',
  username: 'testuser',
  displayName: 'Test User',
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('i18n sweep — mm locale renders no hardcoded English', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('mm')
  })

  afterAll(async () => {
    await i18n.changeLanguage('en')
  })

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
  })

  it('ProfilePage shows localized achievements and chart headings', () => {
    const { container } = render(<ProfilePage />)
    expect(screen.getByText('အောင်မြင်မှု တံဆိပ်များ')).toBeInTheDocument()
    expect(screen.getByText('အပတ်စဉ် စာဖတ်မှု')).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/Badges & Achievements/)
    expect(container.textContent).not.toMatch(/Weekly Reading Activity/)
    expect(container.textContent).not.toMatch(/First Step/)
  })

  it('LibraryPage localizes view toggles and empty state', () => {
    const { container } = render(<LibraryPage />)
    expect(screen.getByLabelText('Grid မြင်ကွင်း')).toBeInTheDocument()
    expect(screen.getByLabelText('List မြင်ကွင်း')).toBeInTheDocument()
    expect(screen.queryByLabelText('Grid view')).not.toBeInTheDocument()
    expect(container.textContent).not.toMatch(/Explore webtoons to fill your library/)
  })

  it('HomePage catalog dates stay English day-month-year', () => {
    const { container } = render(<HomePage />)
    expect(container.textContent).not.toMatch(/\d+ (days|months|years) ago/)
    expect(container.textContent).not.toMatch(/Yesterday/)
    expect(container.textContent).toMatch(/\d{1,2} [A-Z][a-z]{2} 2026/)
  })
})

describe('i18n sweep — en locale keeps original copy', () => {
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
  })

  it('ProfilePage shows the English achievements strings', () => {
    render(<ProfilePage />)
    expect(screen.getByText('Badges & Achievements')).toBeInTheDocument()
    expect(screen.getByText('First Step')).toBeInTheDocument()
    expect(screen.getByText('Weekly Reading Activity')).toBeInTheDocument()
  })
})
