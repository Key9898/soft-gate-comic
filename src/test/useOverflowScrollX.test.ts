import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOverflowScrollX } from '../hooks/useOverflowScrollX'

function makeScrollEl(overrides: {
  scrollLeft: number
  scrollWidth: number
  clientWidth: number
  scrollBy?: ReturnType<typeof vi.fn>
}) {
  const el = document.createElement('div')
  const scrollBy = overrides.scrollBy ?? vi.fn()
  Object.defineProperties(el, {
    scrollLeft: { configurable: true, get: () => overrides.scrollLeft },
    scrollWidth: { configurable: true, get: () => overrides.scrollWidth },
    clientWidth: { configurable: true, get: () => overrides.clientWidth },
    scrollBy: { configurable: true, value: scrollBy },
  })
  return { el, scrollBy }
}

describe('useOverflowScrollX', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    class ResizeObserverMock {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    }
    vi.stubGlobal('ResizeObserver', ResizeObserverMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reports canScrollRight when content overflows', () => {
    const { result } = renderHook(() => useOverflowScrollX())
    const { el } = makeScrollEl({ scrollLeft: 0, scrollWidth: 800, clientWidth: 300 })

    act(() => {
      result.current.ref(el)
    })

    expect(result.current.canScrollRight).toBe(true)
    expect(result.current.canScrollLeft).toBe(false)
  })

  it('clears canScrollRight at the end of the scroll range', () => {
    const { result } = renderHook(() => useOverflowScrollX())
    const { el } = makeScrollEl({ scrollLeft: 500, scrollWidth: 800, clientWidth: 300 })

    act(() => {
      result.current.ref(el)
    })

    expect(result.current.canScrollRight).toBe(false)
    expect(result.current.canScrollLeft).toBe(true)
  })

  it('scrollByPage(right) calls scrollBy with a positive left offset', () => {
    const { result } = renderHook(() => useOverflowScrollX())
    const { el, scrollBy } = makeScrollEl({
      scrollLeft: 0,
      scrollWidth: 800,
      clientWidth: 300,
    })

    act(() => {
      result.current.ref(el)
    })

    act(() => {
      result.current.scrollByPage('right')
    })

    expect(scrollBy).toHaveBeenCalledWith(
      expect.objectContaining({ left: 300 * 0.7, behavior: 'smooth' })
    )
  })
})
