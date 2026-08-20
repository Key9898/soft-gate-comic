import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from './utils'
import LoginPage from '../features/auth/LoginPage'

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('does not show OAuth buttons', () => {
    render(<LoginPage />)
    expect(screen.queryByRole('button', { name: /google/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /facebook/i })).not.toBeInTheDocument()
  })

  it('has link to register page', () => {
    render(<LoginPage />)
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/register')
  })

  it('has link to forgot password page', () => {
    render(<LoginPage />)
    expect(screen.getByRole('link', { name: /forgot password/i })).toHaveAttribute(
      'href',
      '/forgot-password'
    )
  })

  it('renders job-based heading', () => {
    render(<LoginPage />)
    expect(screen.getByRole('heading', { name: /continue in this browser/i })).toBeInTheDocument()
  })

  it('renders sign in subtitle', () => {
    render(<LoginPage />)
    expect(screen.getByText(/sign in to your softgate comic reader account/i)).toBeInTheDocument()
  })

  it('rejects passwords shorter than 8 characters', async () => {
    const user = userEvent.setup({ delay: null })
    render(<LoginPage />)
    await user.type(screen.getByLabelText(/email/i), 'a@b.co')
    await user.type(screen.getByLabelText(/^password$/i), 'secret1')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument()
  })
})
