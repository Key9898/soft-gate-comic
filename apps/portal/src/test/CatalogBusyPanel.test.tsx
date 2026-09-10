import { describe, expect, it } from 'vitest'
import CatalogBusyPanel from '../components/CatalogBusyPanel'
import { render, screen } from './utils'
import en from '../lib/i18n/locales/en/translation.json'

describe('CatalogBusyPanel', () => {
  it('paints the empty-panel shell without empty or unavailable copy', () => {
    render(<CatalogBusyPanel />)
    expect(screen.getByTestId('catalog-busy-panel')).toBeInTheDocument()
    expect(screen.queryByText(en.home.emptyTitle)).not.toBeInTheDocument()
    expect(screen.queryByText(en.home.emptyDesc)).not.toBeInTheDocument()
    expect(screen.queryByText(en.errors.catalogUnavailable)).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /help center/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /publish with us/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
