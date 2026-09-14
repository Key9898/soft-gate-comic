import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, waitFor } from './utils'
import { act } from '@testing-library/react'
import CatalogStatus from '../components/CatalogStatus/CatalogStatus'
import CatalogEmptyPanel from '../components/CatalogEmptyPanel'
import en from '../lib/i18n/locales/en/translation.json'

const setOnline = (value: boolean) => {
  Object.defineProperty(window.navigator, 'onLine', { configurable: true, value })
}

afterEach(() => {
  setOnline(true)
})

describe('Phase 4 — a failed fetch is stated once, not eight times', () => {
  it('marks an unavailable section slimly instead of restating the full sentence', () => {
    render(<CatalogEmptyPanel unavailable />)
    const note = screen.getByTestId('catalog-unavailable-note')
    expect(note).toHaveTextContent(en.errors.catalogUnavailableShort)
    // The full sentence belongs to the hero and the top banner; a section that
    // repeats it under every rail punishes the reader for a server problem.
    expect(screen.queryByText(en.errors.catalogUnavailable)).not.toBeInTheDocument()
  })

  it('keeps the full copy for the success-empty case', () => {
    render(<CatalogEmptyPanel />)
    expect(screen.queryByTestId('catalog-unavailable-note')).not.toBeInTheDocument()
    expect(screen.getByText(en.home.emptyDesc)).toBeInTheDocument()
  })
})

describe('Phase 4 — offline is named as offline', () => {
  it('says the connection dropped rather than blaming the catalog', async () => {
    setOnline(false)
    render(<CatalogStatus />)

    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    await waitFor(() => expect(screen.getByTestId('catalog-status')).toBeInTheDocument())
    expect(screen.getByText(en.errors.offline)).toBeInTheDocument()
    expect(screen.queryByText(en.errors.catalogLoad)).not.toBeInTheDocument()
    expect(screen.getByTestId('catalog-status')).toHaveAttribute('role', 'alert')
  })

  it('clears itself when the connection returns', async () => {
    setOnline(false)
    render(<CatalogStatus />)
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })
    await waitFor(() => expect(screen.getByText(en.errors.offline)).toBeInTheDocument())

    setOnline(true)
    act(() => {
      window.dispatchEvent(new Event('online'))
    })
    await waitFor(() => expect(screen.queryByText(en.errors.offline)).not.toBeInTheDocument())
  })
})
