import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from './utils'
import userEvent from '@testing-library/user-event'
import SearchAutocomplete from '../components/SearchAutocomplete/SearchAutocomplete'

// 'Zaw' matches a seeded author, so the list is guaranteed non-empty past the debounce.
const TERM = 'Zaw'

const openWith = async (user: ReturnType<typeof userEvent.setup>) => {
  const input = screen.getByRole('combobox')
  await user.click(input)
  await user.type(input, TERM)
  await screen.findByRole('listbox')
  return input
}

describe('SearchAutocomplete keyboard operation', () => {
  it('declares combobox semantics and the popup relationship', async () => {
    const user = userEvent.setup()
    render(<SearchAutocomplete />)
    const input = screen.getByRole('combobox')

    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(input).not.toHaveAttribute('aria-activedescendant')

    await openWith(user)
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(input.getAttribute('aria-controls')).toBe(screen.getByRole('listbox').id)
  })

  it('moves the active option with arrow keys and points aria-activedescendant at it', async () => {
    const user = userEvent.setup()
    render(<SearchAutocomplete />)
    const input = await openWith(user)

    await user.keyboard('{ArrowDown}')
    const active = input.getAttribute('aria-activedescendant')
    expect(active).toBeTruthy()
    expect(document.getElementById(active!)).toHaveAttribute('aria-selected', 'true')

    const selectedCount = screen
      .getAllByRole('option')
      .filter((o) => o.getAttribute('aria-selected') === 'true').length
    expect(selectedCount).toBe(1)
  })

  it('wraps back to the input so the typed query stays reachable', async () => {
    const user = userEvent.setup()
    render(<SearchAutocomplete />)
    const input = await openWith(user)
    const options = screen.getAllByRole('option')

    // options.length presses lands on the last option; one more returns to the input.
    for (let i = 0; i < options.length + 1; i += 1) await user.keyboard('{ArrowDown}')
    // One past the last option returns to "no option active", not to option 0:
    // otherwise Enter can never submit what the visitor actually typed.
    expect(input).not.toHaveAttribute('aria-activedescendant')
  })

  it('closes on Escape without clearing the query', async () => {
    const user = userEvent.setup()
    render(<SearchAutocomplete />)
    const input = await openWith(user)

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(input).toHaveValue(TERM)
  })

  it('keeps options out of the tab order so Tab leaves the field', async () => {
    const user = userEvent.setup()
    render(<SearchAutocomplete />)
    await openWith(user)
    for (const option of screen.getAllByRole('option')) {
      expect(option.querySelector('button')).toHaveAttribute('tabindex', '-1')
    }
  })
})
