import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from './utils'
import ScrollToTop from '../components/ScrollToTop'

describe('ScrollToTop', () => {
  const scrollTo = vi.fn()

  beforeEach(() => {
    scrollTo.mockClear()
    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      writable: true,
      value: scrollTo,
    })
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      writable: true,
      value: 0,
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      writable: true,
      value: 0,
    })
  })

  it('is hidden at the top of the page', () => {
    render(<ScrollToTop />)
    expect(screen.queryByRole('button', { name: /scroll to top/i })).not.toBeInTheDocument()
  })

  it('appears after scrolling past the threshold', () => {
    render(<ScrollToTop threshold={300} />)
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        configurable: true,
        writable: true,
        value: 301,
      })
      fireEvent.scroll(window)
    })
    expect(screen.getByRole('button', { name: /scroll to top/i })).toBeInTheDocument()
  })

  it('scrolls to top on click', () => {
    render(<ScrollToTop threshold={100} />)
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        configurable: true,
        writable: true,
        value: 200,
      })
      fireEvent.scroll(window)
    })
    fireEvent.click(screen.getByRole('button', { name: /scroll to top/i }))
    expect(scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({
        top: 0,
      })
    )
  })
})
