import { describe, it, expect } from 'vitest'
import { render, screen } from './utils'
import CoinsPage from '../features/coins/CoinsPage'

describe('CoinsPage', () => {
  it('renders the balance card and buy tab by default', () => {
    render(<CoinsPage />)
    expect(screen.getByText(/your balance/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Coins' })).toBeInTheDocument()
  })

  it('uses the max-w-7xl shell with a left-aligned max-w-4xl inner column', () => {
    const { container } = render(<CoinsPage />)
    const shell = container.querySelector('div.mx-auto.max-w-7xl')
    expect(shell).toBeTruthy()
    const inner = shell?.querySelector(':scope > div.max-w-4xl')
    expect(inner).toBeTruthy()
    expect(inner?.className).not.toMatch(/mx-auto/)
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<CoinsPage />)
    expect(container.textContent).not.toMatch(/coinsPage\.[a-zA-Z]/)
  })
})
