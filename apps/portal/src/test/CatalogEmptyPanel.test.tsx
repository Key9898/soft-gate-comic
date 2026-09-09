import { describe, expect, it } from 'vitest'
import CatalogEmptyPanel from '../components/CatalogEmptyPanel'
import { render, screen } from './utils'
import en from '../lib/i18n/locales/en/translation.json'

describe('CatalogEmptyPanel', () => {
  it('uses success-empty copy and omits Help/Creators by default', () => {
    render(<CatalogEmptyPanel />)
    expect(screen.getByText(en.home.emptyTitle)).toBeInTheDocument()
    expect(screen.getByText(en.home.emptyDesc)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /help center/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /publish with us/i })).not.toBeInTheDocument()
  })

  it('shows Help and Creators when showActions is set', () => {
    render(<CatalogEmptyPanel showActions />)
    expect(screen.getByRole('link', { name: /help center/i })).toHaveAttribute('href', '/help')
    expect(screen.getByRole('link', { name: /publish with us/i })).toHaveAttribute(
      'href',
      '/creators'
    )
  })

  it('uses load-fail copy and forces actions off when unavailable', () => {
    render(
      <CatalogEmptyPanel
        title="Library empty"
        description="Should not show"
        showActions
        unavailable
      />
    )
    expect(screen.getByText(en.errors.catalogUnavailable)).toBeInTheDocument()
    expect(screen.queryByText('Library empty')).not.toBeInTheDocument()
    expect(screen.queryByText('Should not show')).not.toBeInTheDocument()
    expect(screen.queryByText(en.home.emptyDesc)).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /help center/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /publish with us/i })).not.toBeInTheDocument()
  })
})

describe('catalog load-fail banner copy', () => {
  it('does not claim cached or demo data is showing', () => {
    expect(en.errors.catalogLoad).toBe('The catalog request failed.')
    expect(en.errors.catalogLoad.toLowerCase()).not.toMatch(/cached|demo/)
  })
})
