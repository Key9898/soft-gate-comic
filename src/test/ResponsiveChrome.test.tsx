import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from './utils'
import i18n from '../lib/i18n'
import Navigation from '../components/Navigation/Navigation'
import LibraryPage from '../features/library/LibraryPage'
import ReaderCommentsPanel from '../features/reader/components/ReaderCommentsPanel'
import { addComment, episodeCommentKey } from '../lib/comments'

const store = new Map<string, string>()

const sessionUser = {
  id: 'u_test',
  email: 'test@example.com',
  username: 'testuser',
  displayName: 'Thiri Aung Kyaw',
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
  window.history.pushState({}, '', '/')
})

const signIn = () => store.set('softgate_user', JSON.stringify(sessionUser))

const navRow = (container: HTMLElement) => container.querySelector('nav .flex.h-16') as HTMLElement

const leftGroup = (container: HTMLElement) => navRow(container).firstElementChild as HTMLElement

const rightCluster = (container: HTMLElement) => navRow(container).lastElementChild as HTMLElement

describe('Responsive chrome — breakpoint ladder (Impl 77)', () => {
  it('promotes the member icon cluster from sm to lg', () => {
    signIn()
    const { container } = render(<Navigation />)
    const library = screen.getByRole('link', { name: 'Library' })
    const coins = screen.getByRole('link', { name: 'Coins' })
    for (const link of [library, coins]) {
      expect(link.className).toContain('lg:flex')
      expect(link.className).not.toContain('sm:flex')
    }
    const profileWrapper = container.querySelector('a[href="/profile"]')?.parentElement
    expect(profileWrapper?.className).toContain('lg:flex')
    expect(profileWrapper?.className).not.toContain('sm:flex')
  })

  it('keeps the desktop search box at xl and the toggle below it', () => {
    const { container } = render(<Navigation />)
    const searchBox = container.querySelector('nav div[class*="xl:block"]')
    expect(searchBox?.className).toContain('hidden')
    const toggle = container.querySelector('nav button[class*="xl:hidden"]')
    expect(toggle).toBeTruthy()
    expect(toggle?.getAttribute('aria-expanded')).toBe('false')
  })

  it('hides the hamburger at lg for members and at md for guests', () => {
    const { container: guestNav } = render(<Navigation />)
    const guestBurger = guestNav.querySelector(
      'nav button[aria-controls], nav button[aria-expanded]'
    )
    expect(screen.getByRole('button', { name: i18n.t('nav.menu') }).className).toContain(
      'md:hidden'
    )
    expect(guestBurger).toBeTruthy()

    signIn()
    const { container } = render(<Navigation />)
    const memberBurger = container.querySelectorAll('nav button')
    const burger = [...memberBurger].find(
      (b) => b.getAttribute('aria-label') === i18n.t('nav.menu')
    )
    expect(burger?.className).toContain('lg:hidden')
    expect(burger?.className).not.toContain('md:hidden')
  })

  it('drops the language label until xl', () => {
    render(<Navigation />)
    const label = screen.getByText(/မြန်မာ|English/)
    expect(label.className).toContain('xl:inline')
  })
})

describe('Responsive chrome — flex safety nets (Impl 77)', () => {
  it('pins the logo so a wide right cluster cannot squeeze it', () => {
    signIn()
    const { container } = render(<Navigation />)
    expect(container.querySelector('nav img')?.className).toContain('shrink-0')
  })

  it('keeps icon links rigid and nav labels on one line', () => {
    signIn()
    const { container } = render(<Navigation />)
    for (const name of ['Library', 'Coins', 'Notifications']) {
      expect(screen.getByRole('link', { name }).className).toContain('shrink-0')
    }
    const barLinks = [...leftGroup(container).querySelectorAll('a')].filter(
      (a) => a.getAttribute('href') !== '/'
    )
    expect(barLinks.length).toBeGreaterThan(0)
    for (const link of barLinks) {
      expect(link.className).toContain('whitespace-nowrap')
    }
  })

  it('truncates the display name instead of widening the row', () => {
    signIn()
    const { container } = render(<Navigation />)
    const profileLink = container.querySelector('a[href="/profile"]') as HTMLElement
    expect(profileLink.className).toContain('min-w-0')
    const name = screen.getByText(sessionUser.displayName)
    expect(name.className).toContain('truncate')
    expect(name.className).toContain('max-w-[10ch]')
  })

  it('never puts min-w-0 on the icon cluster itself', () => {
    signIn()
    const { container } = render(<Navigation />)
    expect(rightCluster(container).className).not.toContain('min-w-0')
    expect(rightCluster(container).className).toContain('lg:gap-2')
  })
})

describe('Responsive chrome — disclosure semantics (Impl 77)', () => {
  it('exposes the menu state and target on the hamburger', () => {
    const { container } = render(<Navigation />)
    const burger = screen.getByRole('button', { name: i18n.t('nav.menu') })
    expect(burger).toHaveAttribute('aria-expanded', 'false')
    expect(burger).not.toHaveAttribute('aria-controls')

    fireEvent.click(burger)
    expect(burger).toHaveAttribute('aria-expanded', 'true')
    const controls = burger.getAttribute('aria-controls')
    expect(controls).toBeTruthy()
    expect(container.querySelector(`#${CSS.escape(controls as string)}`)).toBeTruthy()
  })

  it('hides the duplicated nav links inside the menu from md up', () => {
    signIn()
    const { container } = render(<Navigation />)
    fireEvent.click(screen.getByRole('button', { name: i18n.t('nav.menu') }))
    const linksBlock = [...container.querySelectorAll('div')].find(
      (el) => el.className.includes('space-y-3') && el.className.includes('md:hidden')
    )
    expect(linksBlock).toBeTruthy()
    expect(screen.getAllByRole('link', { name: /coins/i }).length).toBeGreaterThan(1)
    expect(screen.getAllByRole('link', { name: /library/i }).length).toBeGreaterThan(1)
  })

  it('resolves the menu label in both locales', () => {
    expect(i18n.getFixedT('en')('nav.menu')).toBe('Menu')
    expect(i18n.getFixedT('mm')('nav.menu')).not.toBe('nav.menu')
  })
})

describe('Responsive chrome — overflow utilities (Impl 77)', () => {
  it('uses the real scrollbar utility on the Library tab rail', async () => {
    signIn()
    store.set(
      'softgate_library_v1',
      JSON.stringify({
        schemaVersion: 1,
        byUserId: { u_test: [{ webtoonId: '1', addedAt: '2026-08-01T00:00:00.000Z' }] },
      })
    )
    const { container } = render(<LibraryPage />)
    await waitFor(() => {
      expect(container.querySelector('[class*="scrollbar-hide"]')).toBeTruthy()
    })
    expect(container.innerHTML).not.toContain('scrollbar-none')
  })

  it('breaks unbreakable comment text and truncates commenter names', () => {
    addComment(
      episodeCommentKey('1', 77),
      { id: 'u_seed', username: 'seed', displayName: 'Seed Commenter With A Long Name' },
      'Seeded comment'
    )
    render(<ReaderCommentsPanel webtoonId="1" episodeNumber={77} />)
    expect(screen.getByText('Seeded comment').className).toContain('wrap-anywhere')
    expect(screen.getByText('Seed Commenter With A Long Name').className).toContain('truncate')
  })
})
