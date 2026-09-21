import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import { render, screen, within } from './utils'
import MainLayout from '../layouts/MainLayout'
import ReaderLayout from '../layouts/ReaderLayout'
import HomePage from '../features/home/HomePage'
import Navigation from '../components/Navigation/Navigation'

function renderAt(path: string, layout: 'main' | 'reader' = 'main') {
  window.history.pushState({}, '', path)
  const Layout = layout === 'main' ? MainLayout : ReaderLayout
  return render(
    <Routes>
      <Route element={<Layout />}>
        <Route path={path} element={<HomePage />} />
      </Route>
    </Routes>
  )
}

const TABS: ReadonlyArray<[label: RegExp, href: string]> = [
  [/^home$/i, '/'],
  [/^browse$/i, '/categories'],
  [/^library$/i, '/library'],
  [/^coins$/i, '/coins'],
  [/^profile$/i, '/profile'],
]

/**
 * Issue #37. Below md the portal had no persistent navigation — every primary
 * destination sat behind the hamburger. The Tab Bar carries the five of them, so the
 * mobile menu keeps only what the bar does not cover.
 */
describe('mobile Tab Bar', () => {
  it('links each tab to its destination', () => {
    renderAt('/')
    const bar = within(screen.getByTestId('tab-bar'))

    for (const [label, href] of TABS) {
      expect(bar.getByRole('link', { name: label })).toHaveAttribute('href', href)
    }
  })

  it('marks only the current destination with aria-current', () => {
    renderAt('/categories')
    const bar = within(screen.getByTestId('tab-bar'))

    expect(bar.getByRole('link', { name: /^browse$/i })).toHaveAttribute('aria-current', 'page')
    expect(bar.getByRole('link', { name: /^home$/i })).not.toHaveAttribute('aria-current')
  })

  it('treats a nested browse route as Browse', () => {
    renderAt('/categories/action')
    expect(
      within(screen.getByTestId('tab-bar')).getByRole('link', { name: /^browse$/i })
    ).toHaveAttribute('aria-current', 'page')
  })

  it('stays out of the reader, which is a full-bleed surface', () => {
    renderAt('/read/1/1', 'reader')
    expect(screen.queryByTestId('tab-bar')).not.toBeInTheDocument()
  })

  it('shows every tab to guests, letting ProtectedRoute handle the redirect', () => {
    renderAt('/')
    const bar = within(screen.getByTestId('tab-bar'))
    expect(bar.getAllByRole('link')).toHaveLength(TABS.length)
  })
})

describe('mobile menu after the Tab Bar', () => {
  async function openMenu() {
    const user = userEvent.setup()
    render(<Navigation />)
    await user.click(screen.getByRole('button', { name: /menu/i }))
    return screen.getByTestId('nav-mobile-menu')
  }

  it('drops the destinations the bar already carries', async () => {
    const menu = await openMenu()

    for (const name of [/^home$/i, /^categories$/i, /^library$/i, /^coins$/i]) {
      expect(within(menu).queryByRole('link', { name })).toBeNull()
    }
  })

  it('keeps what the bar does not cover', async () => {
    const menu = within(await openMenu())

    expect(menu.getByRole('link', { name: /most read/i })).toHaveAttribute('href', '/ranking')
    expect(menu.getByRole('link', { name: /new series/i })).toBeInTheDocument()
  })
})
