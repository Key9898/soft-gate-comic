import { describe, it, expect } from 'vitest'
import { render, screen } from './utils'
import Breadcrumb from '../components/Breadcrumb'

describe('Breadcrumb', () => {
  it('renders a navigation landmark', () => {
    render(
      <Breadcrumb
        items={[{ label: 'Home', to: '/' }, { label: 'Company' }, { label: 'About Us' }]}
      />
    )
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('links Home to / and marks the current page', () => {
    render(
      <Breadcrumb
        items={[{ label: 'Home', to: '/' }, { label: 'Company' }, { label: 'About Us' }]}
      />
    )

    const home = screen.getByRole('link', { name: 'Home' })
    expect(home).toHaveAttribute('href', '/')

    const current = screen.getByText('About Us')
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(current.tagName).toBe('SPAN')
  })

  it('keeps the middle section as a non-link span', () => {
    render(
      <Breadcrumb
        items={[{ label: 'Home', to: '/' }, { label: 'Support' }, { label: 'Help Center' }]}
      />
    )

    expect(screen.queryByRole('link', { name: 'Support' })).not.toBeInTheDocument()
    expect(screen.getByText('Support').tagName).toBe('SPAN')
  })
})
