import { describe, it, expect, afterEach, vi } from 'vitest'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { render as renderRtl, screen as screenRtl, waitFor } from '@testing-library/react'
import { fireEvent, render, screen } from './utils'
import { SettingsProvider } from '../context/SettingsContext'
import ContactPage from '../features/info/ContactPage'

describe('ContactPage', () => {
  it('renders the page title and honest form hint', () => {
    render(<ContactPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Contact Us' })).toBeInTheDocument()
    expect(screen.getAllByText(/opens your email app/i).length).toBeGreaterThan(0)
  })

  it('shows localized validation errors on empty submit', () => {
    render(<ContactPage />)
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Subject is required')).toBeInTheDocument()
    expect(screen.getByText('Message text is required')).toBeInTheDocument()
  })

  it('shows the Insein headquarters address', () => {
    render(<ContactPage />)
    expect(screen.getByText(/Insein, Yangon/)).toBeInTheDocument()
    expect(screen.getAllByText(/Yangon time/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Inbox hours \(Demo\)/i)).toBeInTheDocument()
  })

  it('makes support email a mailto link and offers Help, FAQ, Press, and Creators paths', () => {
    render(<ContactPage />)
    expect(screen.getByRole('link', { name: /support@softgatecomic.com/i })).toHaveAttribute(
      'href',
      'mailto:support@softgatecomic.com'
    )
    expect(screen.getByRole('link', { name: 'Help Center' })).toHaveAttribute('href', '/help')
    expect(screen.getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '/faq')
    expect(screen.getByRole('link', { name: /publish with us/i })).toHaveAttribute(
      'href',
      '/creators'
    )
    expect(screen.getByRole('link', { name: /media and interview/i })).toHaveAttribute(
      'href',
      '/press'
    )
  })

  it('shows a reader checklist without extra form fields', () => {
    render(<ContactPage />)
    expect(screen.getByText('What to include')).toBeInTheDocument()
    expect(screen.getByText('What you were doing')).toBeInTheDocument()
    expect(screen.getByText('Which page or series')).toBeInTheDocument()
    expect(screen.getByText(/Language \(English or Myanmar\)/)).toBeInTheDocument()
    expect(screen.getAllByRole('textbox').length).toBe(4)
    expect(screen.queryByRole('link', { name: /format handbook/i })).not.toBeInTheDocument()
  })

  it('prefills a series-submission pitch when intent=submit', () => {
    renderRtl(
      <HelmetProvider>
        <SettingsProvider>
          <MemoryRouter initialEntries={['/contact?intent=submit']}>
            <ContactPage />
          </MemoryRouter>
        </SettingsProvider>
      </HelmetProvider>
    )
    expect(screenRtl.getByDisplayValue('Series submission')).toBeInTheDocument()
    expect(screenRtl.getByLabelText('Series title')).toBeInTheDocument()
    expect(screenRtl.getByLabelText('Genre')).toBeInTheDocument()
    expect(screenRtl.getByLabelText('Finished episodes')).toHaveAttribute('min', '3')
    expect(screenRtl.getByLabelText('Synopsis')).toBeInTheDocument()
    expect(screenRtl.getByRole('link', { name: /format handbook/i })).toHaveAttribute(
      'href',
      '/creators#creators-specs'
    )
    expect(screenRtl.queryByDisplayValue(/Genre:/)).not.toBeInTheDocument()
    fireEvent.click(screenRtl.getByRole('button', { name: /send/i }))
    expect(screenRtl.getByText('Series title is required')).toBeInTheDocument()
    expect(screenRtl.queryByText('Message text is required')).not.toBeInTheDocument()
  })

  it('rejects a pitch with fewer than 3 finished episodes', () => {
    renderRtl(
      <HelmetProvider>
        <SettingsProvider>
          <MemoryRouter initialEntries={['/contact?intent=submit']}>
            <ContactPage />
          </MemoryRouter>
        </SettingsProvider>
      </HelmetProvider>
    )
    fireEvent.change(screenRtl.getByLabelText('Finished episodes'), { target: { value: '2' } })
    fireEvent.click(screenRtl.getByRole('button', { name: /send/i }))
    expect(screenRtl.getByText('Enter at least 3 finished episodes')).toBeInTheDocument()
  })

  it('does not require a series title on the default contact form', () => {
    render(<ContactPage />)
    expect(screen.queryByLabelText('Series title')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(screen.queryByText('Series title is required')).not.toBeInTheDocument()
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<ContactPage />)
    expect(container.textContent).not.toMatch(/contact\.[a-zA-Z]/)
  })
})

describe('ContactPage settings email', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('uses API contactEmail when present', async () => {
    vi.stubEnv('VITE_USE_MOCK_API', 'false')
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ data: { contactEmail: 'ops@example.com' } }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
      )
    )
    renderRtl(
      <HelmetProvider>
        <SettingsProvider>
          <MemoryRouter>
            <ContactPage />
          </MemoryRouter>
        </SettingsProvider>
      </HelmetProvider>
    )
    expect(await screenRtl.findByRole('link', { name: /ops@example.com/i })).toHaveAttribute(
      'href',
      'mailto:ops@example.com'
    )
    await waitFor(() => {
      expect(
        screenRtl.queryByRole('link', { name: /support@softgatecomic.com/i })
      ).not.toBeInTheDocument()
    })
  })
})
