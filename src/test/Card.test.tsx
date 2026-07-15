import { describe, it, expect } from 'vitest'
import { render, screen } from './utils'
import Card from '../components/Card'

describe('Card', () => {
  it('renders with children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies default variant styles', () => {
    render(<Card data-testid="card">Default</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('shadow-sm')
  })

  it('applies hover variant styles', () => {
    render(
      <Card variant="hover" data-testid="card">
        Hover
      </Card>
    )
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('hover:shadow-md')
  })

  it('applies interactive variant styles', () => {
    render(
      <Card variant="interactive" data-testid="card">
        Interactive
      </Card>
    )
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('hover:-translate-y-0.5')
    expect(card).toHaveClass('cursor-pointer')
  })

  it('applies padding styles', () => {
    const { rerender } = render(
      <Card padding="none" data-testid="card">
        No padding
      </Card>
    )
    expect(screen.getByTestId('card')).not.toHaveClass('p-3')

    rerender(
      <Card padding="sm" data-testid="card">
        Small padding
      </Card>
    )
    expect(screen.getByTestId('card')).toHaveClass('p-3')

    rerender(
      <Card padding="md" data-testid="card">
        Medium padding
      </Card>
    )
    expect(screen.getByTestId('card')).toHaveClass('p-4')

    rerender(
      <Card padding="lg" data-testid="card">
        Large padding
      </Card>
    )
    expect(screen.getByTestId('card')).toHaveClass('p-5')
  })

  it('applies custom className', () => {
    render(
      <Card className="custom-class" data-testid="card">
        Custom
      </Card>
    )
    expect(screen.getByTestId('card')).toHaveClass('custom-class')
  })

  it('has correct base styles', () => {
    render(<Card data-testid="card">Base</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('bg-white')
    expect(card).toHaveClass('rounded-xl')
    expect(card).toHaveClass('border')
    expect(card).toHaveClass('border-gray-200')
  })

  it('spreads additional props', () => {
    render(
      <Card data-testid="card" aria-label="Test card">
        Content
      </Card>
    )
    expect(screen.getByTestId('card')).toHaveAttribute('aria-label', 'Test card')
  })
})
