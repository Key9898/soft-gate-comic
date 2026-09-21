import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { render, screen } from './utils'
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

function setVisibility(state: DocumentVisibilityState) {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => state,
  })
  Object.defineProperty(document, 'hidden', {
    configurable: true,
    get: () => state === 'hidden',
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
 * Issue #46. Framer Motion drives an entrance from `opacity: 0` with
 * requestAnimationFrame, which does not run in a hidden tab, and it writes the
 * initial style into the server-rendered markup. Either way the hero copy is in the
 * DOM but invisible. The animation is an enhancement, so it may only start from a
 * hidden state when we know a frame will actually run.
 */
describe('hero entrance visibility', () => {
  beforeEach(() => {
    installStorage()
    setVisibility('visible')
  })

  afterEach(() => {
    setVisibility('visible')
  })

  it('renders the hero copy opaque when the tab is hidden at load', async () => {
    setVisibility('hidden')
    renderDetail()
    await screen.findByRole('heading', { name: 'The Last Horizon' })

    const header = screen.getByTestId('hub-hero-header')
    expect(header.style.opacity === '' || header.style.opacity === '1').toBe(true)
  })

  it('still plays an entrance, moving the hero copy rather than fading it', async () => {
    renderDetail()
    await screen.findByRole('heading', { name: 'The Last Horizon' })

    const header = screen.getByTestId('hub-hero-header')
    expect(header.style.opacity === '' || header.style.opacity === '1').toBe(true)
    expect(header.style.transform).toMatch(/translateY/)
  })
})
