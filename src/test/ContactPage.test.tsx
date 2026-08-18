import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from './utils'
import ContactPage from '../features/info/ContactPage'

describe('ContactPage', () => {
  it('renders the page title and honest form hint', () => {
    render(<ContactPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Contact Us' })).toBeInTheDocument()
    expect(screen.getByText(/opens your email app/i)).toBeInTheDocument()
  })

  it('shows localized validation errors on empty submit', () => {
    render(<ContactPage />)
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Subject is required')).toBeInTheDocument()
    expect(screen.getByText('Message text is required')).toBeInTheDocument()
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<ContactPage />)
    expect(container.textContent).not.toMatch(/contact\.[a-zA-Z]/)
  })
})
