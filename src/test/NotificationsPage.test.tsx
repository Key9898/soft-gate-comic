import { describe, it, expect } from 'vitest'
import { render, screen } from './utils'
import NotificationsPage from '../features/notifications/NotificationsPage'

describe('NotificationsPage', () => {
  it('renders the page heading', () => {
    render(<NotificationsPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Notifications' })).toBeInTheDocument()
  })

  it('uses the max-w-7xl shell with a left-aligned max-w-3xl inner column', () => {
    const { container } = render(<NotificationsPage />)
    const shell = container.querySelector('div.mx-auto.max-w-7xl')
    expect(shell).toBeTruthy()
    const inner = shell?.querySelector(':scope > div.max-w-3xl')
    expect(inner).toBeTruthy()
    expect(inner?.className).not.toMatch(/mx-auto/)
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<NotificationsPage />)
    expect(container.textContent).not.toMatch(/notificationsPage\.[a-zA-Z]/)
  })
})
