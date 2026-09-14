import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Chip from '../components/Chip'

describe('Chip', () => {
  it('exposes selection state rather than relying on colour alone', () => {
    render(
      <>
        <Chip selected onClick={() => {}}>
          Ongoing
        </Chip>
        <Chip selected={false} onClick={() => {}}>
          Completed
        </Chip>
      </>
    )
    expect(screen.getByRole('button', { name: 'Ongoing' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Completed' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('reports as a radio inside a radiogroup when asked', () => {
    render(
      <div role="radiogroup" aria-label="Status">
        <Chip semantics="radio" selected onClick={() => {}}>
          All
        </Chip>
      </div>
    )
    expect(screen.getByRole('radio', { name: 'All' })).toHaveAttribute('aria-checked', 'true')
  })

  it('clears the 44pt touch floor in both tones', () => {
    render(
      <>
        <Chip selected={false} onClick={() => {}}>
          Filter
        </Chip>
        <Chip tone="genre" selected onClick={() => {}}>
          Genre
        </Chip>
      </>
    )
    for (const name of ['Filter', 'Genre']) {
      expect(screen.getByRole('button', { name }).className).toMatch(/min-h-11/)
    }
  })

  it('is a real button that fires once per click', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Chip selected={false} onClick={onClick}>
        Romance
      </Chip>
    )
    await user.click(screen.getByRole('button', { name: 'Romance' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Romance' })).toHaveAttribute('type', 'button')
  })
})
