import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import i18n from '../lib/i18n'

// Initialize i18n with English for tests
i18n.changeLanguage('en')

afterEach(() => {
  cleanup()
})

class IntersectionObserverMock {
  observe() {
    return null
  }
  unobserve() {
    return null
  }
  disconnect() {
    return null
  }
  takeRecords() {
    return []
  }
}

class ResizeObserverMock {
  observe() {
    return null
  }
  unobserve() {
    return null
  }
  disconnect() {
    return null
  }
}

if (typeof window !== 'undefined') {
  window.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver
  window.ResizeObserver = ResizeObserverMock

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
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

  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vi.fn(),
  })

  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => null),
      removeItem: vi.fn(() => null),
      clear: vi.fn(() => null),
      length: 0,
      key: vi.fn(() => null),
    },
  })
}
