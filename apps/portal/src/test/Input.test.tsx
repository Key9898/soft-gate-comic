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
    const input = screen.getByLabelText(/^password$/i) as HTMLInputElement
    expect(input.type).toBe('password')

    fireEvent.click(screen.getByRole('button', { name: /show password/i }))
    expect(input.type).toBe('text')

    fireEvent.click(screen.getByRole('button', { name: /hide password/i }))
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

  it('associates the label without deriving the id from its text', () => {
    render(<Input label="Email Address" />)
    const input = screen.getByLabelText(/email address/i)
    expect(input).toHaveAttribute('id')
    // Deriving the id from the label is what let two fields both labelled
    // "Password" share an id, so every htmlFor pointed at the first one.
    expect(input.getAttribute('id')).not.toBe('email-address')
  })

  it('gives two identically labelled fields distinct ids', () => {
    render(
      <>
        <Input label="Password" type="password" />
        <Input label="Password" type="password" />
      </>
    )
    const [first, second] = screen.getAllByLabelText('Password')
    expect(first.getAttribute('id')).toBeTruthy()
    expect(first.getAttribute('id')).not.toBe(second.getAttribute('id'))
  })

  it('points aria-describedby at the error it renders', () => {
    render(<Input label="Email" error="Invalid email" />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    const describedBy = input.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy!)).toHaveTextContent('Invalid email')
  })

  it('renders the floating variant with the same label association', () => {
    render(<Input variant="floating" label="Display name" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Display name')).toBeInTheDocument()
  })
})
