import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { render, screen, waitFor } from '@testing-library/react'
import { DataProvider } from '../context/DataContext'
import CategoriesPage from '../features/categories/CategoriesPage'

function renderCategories(path: string) {
  return render(
    <HelmetProvider>
      <DataProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/ranking" element={<CategoriesPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:slug" element={<CategoriesPage />} />
          </Routes>
        </MemoryRouter>
      </DataProvider>
    </HelmetProvider>
  )
}

describe('Categories ranking chrome', () => {
  it('ranks on /ranking and labels the sort control Popular', async () => {
    renderCategories('/ranking')
    expect(await screen.findByRole('heading', { level: 1, name: 'Popular' })).toBeInTheDocument()
    expect(screen.getByText('Most-read series on SoftGate Comic')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Popular' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Popular' })).toHaveAttribute(
      'aria-expanded',
      'false'
    )
    expect(screen.queryByText('Most Popular')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: '1. Shadow Knight' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '9. Campus Life' })).toBeInTheDocument()
    const tileRank = document.querySelector('[data-testid="rank-mark"]')
    expect(tileRank?.className).toMatch(/left-1/)
    expect(tileRank?.className).toMatch(/bottom-0/)
    expect(screen.queryByLabelText('Previous')).not.toBeInTheDocument()
  })

  it('uses an ordered chart grid and sticky filters on /ranking', async () => {
    renderCategories('/ranking')
    expect(await screen.findByRole('heading', { level: 1, name: 'Popular' })).toBeInTheDocument()
    expect(screen.getByText('Numbered chart')).toBeInTheDocument()
    expect(document.querySelector('.radial-wash-primary')).toBeTruthy()
    expect(document.querySelector('ol')).toBeTruthy()
    const filterBand = document.querySelector('[data-testid="catalog-filter-band"]')
    expect(filterBand?.className).toContain('sticky-below-nav')
    const genreGroup = screen.getByRole('group', { name: 'Genres' })
    const firstGenre = genreGroup.querySelector('button')
    expect(firstGenre?.className).toMatch(/min-h-11/)
    expect(firstGenre?.className).not.toMatch(/uppercase/)
  })

  it('replace-navigates all-genre sort=popular to /ranking', async () => {
    renderCategories('/categories?sort=popular')
    expect(await screen.findByRole('heading', { level: 1, name: 'Popular' })).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByRole('link', { name: '1. Shadow Knight' })).toBeInTheDocument()
    })
  })

  it('does not rank Browse by Genre without a sort query', async () => {
    renderCategories('/categories')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Browse by Genre' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Browse' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '1. Shadow Knight' })).not.toBeInTheDocument()
    const launchTile = screen.getByRole('link', { name: /Shadow Knight/ })
    expect(launchTile.textContent).toContain('8 Jan 2026')
    expect(launchTile.textContent).not.toContain('19 Aug 2026')
    expect(document.querySelector('ol')).toBeNull()
    expect(document.querySelector('.radial-wash-primary')).toBeNull()
  })

  it('does not rank New Releases sort', async () => {
    renderCategories('/categories?sort=new')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'New Releases' })
    ).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '1. Campus Life' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '1. Shadow Knight' })).not.toBeInTheDocument()
    expect(document.querySelector('ol')).toBeNull()
  })

  it('titles Recently Updated without ranks', async () => {
    renderCategories('/categories?sort=recentlyUpdated')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Recently Updated' })
    ).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '1. Shadow Knight' })).not.toBeInTheDocument()
    const movedTile = screen.getByRole('link', { name: /Shadow Knight/ })
    expect(movedTile.textContent).toContain('19 Aug 2026')
    expect(movedTile.textContent).not.toContain('8 Jan 2026')
  })

  it('titles Highest Rated without ranks', async () => {
    renderCategories('/categories?sort=highestRated')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Highest Rated' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Highest Rated' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '1. Shadow Knight' })).not.toBeInTheDocument()
  })
})
