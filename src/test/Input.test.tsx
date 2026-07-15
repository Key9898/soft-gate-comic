import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from './utils'
import Input from '../components/Input'

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter email" />)
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<Input label="Email" error="Invalid email" />)
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })

  it('shows hint message when no error', () => {
    render(<Input label="Email" hint="We will never share your email" />)
    expect(screen.getByText('We will never share your email')).toBeInTheDocument()
  })

  it('does not show hint when error is present', () => {
    render(<Input label="Email" hint="Hint text" error="Error text" />)
    expect(screen.queryByText('Hint text')).not.toBeInTheDocument()
    expect(screen.getByText('Error text')).toBeInTheDocument()
  })

  it('toggles password visibility', () => {
    render(<Input label="Password" type="password" />)
    const input = screen.getByLabelText(/password/i) as HTMLInputElement
    expect(input.type).toBe('password')

    const toggleButton = screen.getByRole('button', { name: '' })
    fireEvent.click(toggleButton)
    expect(input.type).toBe('text')

    fireEvent.click(toggleButton)
    expect(input.type).toBe('password')
  })

  it('renders with left icon', () => {
    render(<Input label="Search" leftIcon={<span data-testid="search-icon">🔍</span>} />)
    expect(screen.getByTestId('search-icon')).toBeInTheDocument()
  })

  it('renders with right icon', () => {
    render(<Input label="Price" rightIcon={<span data-testid="dollar">$</span>} />)
    expect(screen.getByTestId('dollar')).toBeInTheDocument()
  })

  it('calls onChange handler', () => {
    const handleChange = vi.fn()
    render(<Input label="Email" onChange={handleChange} />)
    const input = screen.getByLabelText(/email/i)
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Input label="Email" className="custom-class" />)
    const input = screen.getByLabelText(/email/i)
    expect(input).toHaveClass('custom-class')
  })

  it('applies error styles when error is present', () => {
    render(<Input label="Email" error="Invalid" />)
    const input = screen.getByLabelText(/email/i)
    expect(input).toHaveClass('border-red-500')
  })

  it('applies focus styles when no error', () => {
    render(<Input label="Email" />)
    const input = screen.getByLabelText(/email/i)
    expect(input).toHaveClass('focus:border-primary-500')
  })

  it('disables input when disabled prop is true', () => {
    render(<Input label="Email" disabled />)
    expect(screen.getByLabelText(/email/i)).toBeDisabled()
  })

  it('uses id prop for input', () => {
    render(<Input label="Email" id="custom-email-id" />)
    const input = screen.getByLabelText(/email/i)
    expect(input).toHaveAttribute('id', 'custom-email-id')
  })

  it('generates id from label if not provided', () => {
    render(<Input label="Email Address" />)
    const input = screen.getByLabelText(/email address/i)
    expect(input).toHaveAttribute('id', 'email-address')
  })
})
