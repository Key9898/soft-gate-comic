import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import GenreRailChevron from '../components/GenreRailChevron'

describe('GenreRailChevron', () => {
  it('reserves an inert slot when disabled', () => {
    const { container } = render(<GenreRailChevron enabled={false} size="md" />)
    expect(screen.getByTestId('genre-rail-chevron-slot')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByTestId('genre-rail-chevron-slot').className).toMatch(/min-h-11/)
    expect(container.querySelector('svg')).toBeNull()
  })

  it('renders Show more genres with the same min size when enabled', () => {
    const onClick = vi.fn()
    render(<GenreRailChevron enabled size="sm" onClick={onClick} label="Show more genres" />)
    const button = screen.getByRole('button', { name: 'Show more genres' })
    expect(screen.queryByTestId('genre-rail-chevron-slot')).not.toBeInTheDocument()
    expect(button.className).toMatch(/min-h-\[38px\]/)
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
