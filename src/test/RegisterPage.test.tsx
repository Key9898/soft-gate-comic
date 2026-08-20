import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from './utils'
import RegisterPage from '../features/auth/RegisterPage'

describe('RegisterPage', () => {
  it('blocks submit until terms are accepted', async () => {
    const user = userEvent.setup({ delay: null })
    render(<RegisterPage />)
    await user.type(screen.getByLabelText(/username/i), 'newreader')
    await user.type(screen.getByLabelText(/display name/i), 'New Reader')
    await user.type(screen.getByLabelText(/email/i), 'new@softgate.test')
    await user.type(screen.getByLabelText(/^password$/i), 'secret12')
    await user.type(screen.getByLabelText(/confirm password/i), 'secret12')
    await user.click(screen.getByRole('button', { name: /create account/i }))
    expect(screen.getByText(/agree to the terms and privacy/i)).toBeInTheDocument()
  })

  it('links to login', () => {
    render(<RegisterPage />)
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login')
  })

  it('does not show OAuth buttons', () => {
    render(<RegisterPage />)
    expect(screen.queryByRole('button', { name: /google/i })).not.toBeInTheDocument()
  })

  it('rejects passwords shorter than 8 characters', async () => {
    const user = userEvent.setup({ delay: null })
    render(<RegisterPage />)
    await user.type(screen.getByLabelText(/username/i), 'newreader')
    await user.type(screen.getByLabelText(/display name/i), 'New Reader')
    await user.type(screen.getByLabelText(/email/i), 'new@softgate.test')
    await user.type(screen.getByLabelText(/^password$/i), 'secret1')
    await user.type(screen.getByLabelText(/confirm password/i), 'secret1')
    const terms = screen.getByRole('checkbox')
    await user.click(terms)
    await user.click(screen.getByRole('button', { name: /create account/i }))
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument()
  })
})
