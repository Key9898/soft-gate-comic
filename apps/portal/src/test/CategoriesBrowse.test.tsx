import { describe, expect, it } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { render, screen, waitFor } from './utils'
import CategoriesPage from '../features/categories/CategoriesPage'

function renderBrowse(path: string) {
  window.history.pushState({}, '', path)
  return render(
    <Routes>
      <Route path="/ranking" element={<CategoriesPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/categories/:slug" element={<CategoriesPage />} />
    </Routes>
  )
}

describe('Categories browse polish', () => {
  it('does not render a header search field', async () => {
    renderBrowse('/categories')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Browse by Genre' })
    ).toBeInTheDocument()
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
  })

  it('titles a genre path without sort as the genre name', async () => {
    renderBrowse('/categories/action')
    expect(await screen.findByRole('heading', { level: 1, name: 'Action' })).toBeInTheDocument()
  })

  it('includes the status label in the count line', async () => {
    renderBrowse('/categories?status=ongoing')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Browse by Genre' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /Webtoons · Ongoing/ })
    ).toBeInTheDocument()
  })

  it('shows recovery when the filter set is empty', async () => {
    renderBrowse('/categories/not-a-genre')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Genre not found' })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^categories$/i })).toHaveAttribute(
      'href',
      '/categories'
    )
    expect(screen.getByRole('link', { name: /^popular$/i })).toHaveAttribute('href', '/ranking')
    expect(screen.getByRole('link', { name: /^new releases$/i })).toHaveAttribute(
      'href',
      '/categories?sort=new'
    )
  })

  it('uses the browse SEO description, not the empty copy', async () => {
    renderBrowse('/categories')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Browse by Genre' })
    ).toBeInTheDocument()
    await waitFor(() => {
      const meta = document.querySelector('meta[name="description"]')
      expect(meta).toBeTruthy()
      expect(meta?.getAttribute('content')).not.toBe('No webtoons found matching your criteria.')
      expect(meta?.getAttribute('content')).toBe(
        'Filter by genre and status. Sorted by all-time reads — open Popular for the numbered chart.'
      )
    })
  })
})
