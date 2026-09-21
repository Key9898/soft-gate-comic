import { beforeEach, describe, expect, it } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { render, screen, within } from './utils'
import WebtoonDetailPage from '../features/webtoon/WebtoonDetailPage'

const store = new Map<string, string>()

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

function renderDetail(path = '/webtoon/1') {
  window.history.pushState({}, '', path)
  return render(
    <Routes>
      <Route path="/webtoon/:id" element={<WebtoonDetailPage />} />
    </Routes>
  )
}

/**
 * Issue #38. The dark series header ran to ~1180px on a 375px viewport because the
 * synopsis, tags, dates and the secondary read CTA all lived inside it. The design
 * keeps them in the header on desktop and moves them into the body on mobile, so the
 * page renders one copy per breakpoint: the desktop copy stays inside the hero, the
 * mobile copy is a sibling that follows it.
 */
describe('series hub overview placement', () => {
  beforeEach(() => {
    installStorage()
  })

  it('keeps the desktop overview inside the hero and puts the mobile overview after it', async () => {
    renderDetail()
    await screen.findByRole('heading', { name: 'The Last Horizon' })

    const hero = screen.getByTestId('hub-hero')
    const desktopOverview = screen.getByTestId('hub-overview-desktop')
    const mobileOverview = screen.getByTestId('hub-overview-mobile')

    expect(hero).toContainElement(desktopOverview)
    expect(hero).not.toContainElement(mobileOverview)
    expect(
      hero.compareDocumentPosition(mobileOverview) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it('carries the synopsis, tags, dates and the latest-episode link in both overviews', async () => {
    renderDetail()
    await screen.findByRole('heading', { name: 'The Last Horizon' })

    for (const testId of ['hub-overview-desktop', 'hub-overview-mobile']) {
      const overview = within(screen.getByTestId(testId))

      expect(overview.getByText(/In a world where magic and technology clash/i)).toBeInTheDocument()
      expect(overview.getByRole('link', { name: 'မှော်' })).toHaveAttribute(
        'href',
        `/search?q=${encodeURIComponent('မှော်')}`
      )
      expect(overview.getByText(/Published/i)).toBeInTheDocument()
      expect(overview.getByText(/Updated/i)).toBeInTheDocument()
      expect(overview.getByRole('link', { name: /latest episode/i })).toHaveAttribute(
        'href',
        '/read/1/5'
      )
    }
  })

  it('keeps the series identity in the header and the synopsis only in the overview', async () => {
    renderDetail()
    await screen.findByRole('heading', { name: 'The Last Horizon' })

    const header = within(screen.getByTestId('hub-hero-header'))
    expect(header.getByRole('heading', { name: 'The Last Horizon' })).toBeInTheDocument()
    expect(header.getByRole('link', { name: /ko zaw/i })).toBeInTheDocument()

    // The hero carries exactly one synopsis, and it belongs to the desktop overview.
    const heroSynopses = within(screen.getByTestId('hub-hero')).getAllByText(
      /In a world where magic and technology clash/i
    )
    expect(heroSynopses).toHaveLength(1)
    expect(screen.getByTestId('hub-overview-desktop')).toContainElement(heroSynopses[0])
  })

  it('hides each overview at the breakpoint the other one serves', async () => {
    renderDetail()
    await screen.findByRole('heading', { name: 'The Last Horizon' })

    // display:none is what keeps the duplicate out of the accessibility tree.
    expect(screen.getByTestId('hub-overview-desktop').className).toMatch(/\bhidden\b/)
    expect(screen.getByTestId('hub-overview-desktop').className).toMatch(/\bmd:flex\b/)
    expect(screen.getByTestId('hub-overview-mobile').closest('section')?.className).toMatch(
      /\bmd:hidden\b/
    )
  })

  it('moves the next drop and the rating control out of the dark hero', async () => {
    renderDetail()
    await screen.findByRole('heading', { name: 'The Last Horizon' })

    const hero = screen.getByTestId('hub-hero')
    const nextDrop = screen.getByTestId('hub-next-drop')
    const rating = screen.getByTestId('hub-rating')

    // Both designs place these below the header: next drop above the episode list,
    // the rating beside it.
    expect(hero).not.toContainElement(nextDrop)
    expect(hero).not.toContainElement(rating)
    expect(hero.compareDocumentPosition(nextDrop) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('pairs the cover with the series identity in one row above the stats', async () => {
    renderDetail()
    await screen.findByRole('heading', { name: 'The Last Horizon' })

    // The cover and the identity share a flex row below md and become grid cells
    // from md up, so the stats and actions run full width under both.
    const identity = screen.getByTestId('hub-hero-header')
    const coverRow = identity.parentElement
    expect(coverRow?.className).toMatch(/\bmd:contents\b/)
    expect(coverRow).toContainElement(screen.getByTestId('hero-book-cover-link'))
  })

  it('drops the published and updated cards from the hero stats bar', async () => {
    renderDetail()
    await screen.findByRole('heading', { name: 'The Last Horizon' })

    // Dates are their own line in the overview now, not two more glass cards.
    const hero = within(screen.getByTestId('hub-hero'))
    expect(hero.getAllByText(/Published/i)).toHaveLength(1)
    expect(hero.getAllByText(/Updated/i)).toHaveLength(1)
  })
})
