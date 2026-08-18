import { describe, it, expect } from 'vitest'
import { render, screen } from './utils'
import HomePage from '../features/home/HomePage'

describe('HomePage', () => {
  it('renders trending section', () => {
    render(<HomePage />)
    expect(screen.getByText('Trending Now')).toBeInTheDocument()
  })

  it('renders new releases section', () => {
    render(<HomePage />)
    expect(screen.getByText('New Releases')).toBeInTheDocument()
  })

  it('renders genres section', () => {
    render(<HomePage />)
    expect(screen.getByText('Genres:')).toBeInTheDocument()
  })

  it('renders start reading button', () => {
    render(<HomePage />)
    expect(screen.getByRole('button', { name: /start reading/i })).toBeInTheDocument()
  })

  it('renders add to library CTA beside start reading', () => {
    render(<HomePage />)
    expect(screen.getByRole('button', { name: /add to library/i })).toBeInTheDocument()
  })

  it('renders view all links', () => {
    render(<HomePage />)
    const viewAllLinks = screen.getAllByText('View All')
    expect(viewAllLinks.length).toBeGreaterThanOrEqual(2)
  })

  it('shows catalog release dates instead of relative ages', () => {
    render(<HomePage />)
    expect(screen.queryByText(/years ago/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/2023/)).not.toBeInTheDocument()
    expect(screen.queryByText(/2024/)).not.toBeInTheDocument()
    expect(screen.getAllByText(/\d{1,2} [A-Z][a-z]{2} 2026/).length).toBeGreaterThan(0)
  })

  it('badges the newest releases even inside Trending Now', () => {
    render(<HomePage />)
    const trending = screen.getByRole('heading', { name: 'Trending Now' }).closest('section')
    expect(trending).toBeTruthy()
    expect(trending?.textContent).toContain('Love in Seoul')
    const newMarks = screen.getAllByText('New')
    expect(newMarks.length).toBeGreaterThanOrEqual(6)
  })

  it('centers hero content in a mid-band shell', () => {
    const { container } = render(<HomePage />)
    const shell = container.querySelector('.hero-landscape-adjust')
    expect(shell).toBeTruthy()
    expect(shell?.className).toMatch(/justify-center/)
    expect(shell?.className).toMatch(/min-h-\[/)
  })
})
