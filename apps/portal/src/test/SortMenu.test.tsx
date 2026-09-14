import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SortMenu from '../components/SortMenu'

const OPTIONS = [
  { value: 'popular', label: 'Popular' },
  { value: 'new', label: 'Newest' },
  { value: 'rating', label: 'Highest rated' },
] as const

const renderMenu = (value: (typeof OPTIONS)[number]['value'] = 'popular') => {
  const onChange = vi.fn()
  render(<SortMenu options={OPTIONS} value={value} onChange={onChange} label="Sort by" />)
  return { onChange }
}

describe('SortMenu', () => {
  it('names the trigger with its visible selection, not an aria-label override', () => {
    renderMenu('rating')
    expect(screen.getByRole('button', { name: 'Highest rated' })).toBeInTheDocument()
  })

  it('declares the popup relationship only while open', async () => {
    const user = userEvent.setup()
    renderMenu()
    const trigger = screen.getByRole('button', { name: 'Popular' })

    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).not.toHaveAttribute('aria-controls')

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger.getAttribute('aria-controls')).toBe(
      screen.getByRole('menu', { name: 'Sort by' }).id
    )
  })

  it('exposes options as checked radio items', async () => {
    const user = userEvent.setup()
    renderMenu('new')
    await user.click(screen.getByRole('button', { name: 'Newest' }))

    const items = screen.getAllByRole('menuitemradio')
    expect(items).toHaveLength(3)
    expect(screen.getByRole('menuitemradio', { name: 'Newest' })).toHaveAttribute(
      'aria-checked',
      'true'
    )
    expect(screen.getByRole('menuitemradio', { name: 'Popular' })).toHaveAttribute(
      'aria-checked',
      'false'
    )
  })

  it('opens with focus on the current selection rather than the first option', async () => {
    const user = userEvent.setup()
    renderMenu('rating')
    await user.click(screen.getByRole('button', { name: 'Highest rated' }))
    await waitFor(() =>
      expect(screen.getByRole('menuitemradio', { name: 'Highest rated' })).toHaveFocus()
    )
  })

  it('roves with arrow keys and wraps', async () => {
    const user = userEvent.setup()
    renderMenu('popular')
    await user.click(screen.getByRole('button', { name: 'Popular' }))
    await waitFor(() =>
      expect(screen.getByRole('menuitemradio', { name: 'Popular' })).toHaveFocus()
    )

    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitemradio', { name: 'Newest' })).toHaveFocus()

    await user.keyboard('{ArrowUp}{ArrowUp}')
    expect(screen.getByRole('menuitemradio', { name: 'Highest rated' })).toHaveFocus()

    await user.keyboard('{Home}')
    expect(screen.getByRole('menuitemradio', { name: 'Popular' })).toHaveFocus()
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup()
    renderMenu()
    const trigger = screen.getByRole('button', { name: 'Popular' })
    await user.click(trigger)
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it('reports the chosen value and closes', async () => {
    const user = userEvent.setup()
    const { onChange } = renderMenu('popular')
    await user.click(screen.getByRole('button', { name: 'Popular' }))
    await user.click(screen.getByRole('menuitemradio', { name: 'Highest rated' }))

    expect(onChange).toHaveBeenCalledWith('rating')
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  })
})
