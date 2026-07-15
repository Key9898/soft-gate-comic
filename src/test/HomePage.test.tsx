import { describe, it, expect } from 'vitest'
import { render, screen } from './utils'
import HomePage from '../features/home/HomePage'

describe('HomePage', () => {
  it('renders featured webtoon section', () => {
    render(<HomePage />)
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

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

  it('renders add to library button', () => {
    render(<HomePage />)
    expect(screen.getByRole('button', { name: /add to library/i })).toBeInTheDocument()
  })

  it('renders view all links', () => {
    render(<HomePage />)
    const viewAllLinks = screen.getAllByText('View All')
    expect(viewAllLinks.length).toBeGreaterThanOrEqual(2)
  })

  it('renders CTA section', () => {
    render(<HomePage />)
    expect(screen.getByText('Start Your Reading Journey')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /get started for free/i })).toBeInTheDocument()
  })

  it('renders webtoon cards in trending section', () => {
    render(<HomePage />)
    const covers = screen.getAllByText('Cover')
    expect(covers.length).toBeGreaterThan(0)
  })
})
