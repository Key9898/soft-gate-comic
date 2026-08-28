import { describe, it, expect } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { render, screen, waitFor } from './utils'
import NotFoundPage from '../features/info/NotFoundPage'
import WebtoonDetailPage from '../features/webtoon/WebtoonDetailPage'
import ReaderPage from '../features/reader/ReaderPage'

describe('NotFoundPage', () => {
  it('renders localized title and description', () => {
    render(<NotFoundPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByText(/does not exist or may have moved/i)).toBeInTheDocument()
  })

  it('renders home recovery, a search heading, and a search field', () => {
    render(<NotFoundPage />)
    expect(screen.getByRole('link', { name: /go home/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('heading', { name: /^search$/i })).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('renders guest-safe destinations without Library', () => {
    render(<NotFoundPage />)
    expect(screen.getByRole('link', { name: /^categories$/i })).toHaveAttribute(
      'href',
      '/categories'
    )
    expect(screen.getByRole('link', { name: /^popular$/i })).toHaveAttribute('href', '/ranking')
    expect(screen.getByRole('link', { name: /^new releases$/i })).toHaveAttribute(
      'href',
      '/categories?sort=new'
    )
    expect(screen.getByRole('link', { name: /help center/i })).toHaveAttribute('href', '/help')
    expect(screen.getByRole('link', { name: /^contact$/i })).toHaveAttribute('href', '/contact')
    expect(screen.queryByRole('link', { name: /library/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })

  it('shows demo catalog covers and honesty copy', () => {
    const { container } = render(<NotFoundPage />)
    expect(screen.getByText(/demo catalog covers/i)).toBeInTheDocument()
    expect(container.querySelector('img[src^="/webtoon-covers/"]')).toBeTruthy()
  })

  it('renders series, episode, and author variant headings', () => {
    const { rerender } = render(<NotFoundPage variant="series" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Series not found' })).toBeInTheDocument()
    rerender(<NotFoundPage variant="episode" seriesHref="/webtoon/1" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Episode not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to series/i })).toHaveAttribute(
      'href',
      '/webtoon/1'
    )
    rerender(<NotFoundPage variant="author" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Author not found' })).toBeInTheDocument()
    rerender(<NotFoundPage variant="genre" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Genre not found' })).toBeInTheDocument()
  })

  it('does not emit JSON-LD, canonical, keywords, or social tags', async () => {
    render(<NotFoundPage />)
    await waitFor(() => {
      expect(document.querySelector('script[type="application/ld+json"]')).toBeNull()
      expect(document.querySelector('link[rel="canonical"]')).toBeNull()
      expect(document.querySelector('meta[name="keywords"]')).toBeNull()
      expect(document.querySelector('meta[name="twitter:card"]')).toBeNull()
      expect(document.querySelector('meta[property="og:image"]')).toBeNull()
    })
  })

  it('does not render raw i18n keys', () => {
    const { container } = render(<NotFoundPage />)
    expect(container.textContent).not.toMatch(/notFound\.[a-zA-Z]/)
  })

  it('uses shared series recovery when a webtoon id is missing', async () => {
    window.history.pushState({}, '', '/webtoon/missing-id')
    render(
      <Routes>
        <Route path="/webtoon/:id" element={<WebtoonDetailPage />} />
      </Routes>
    )
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Series not found' })
    ).toBeInTheDocument()
  })

  it('uses shared series recovery when a read series is missing', async () => {
    window.history.pushState({}, '', '/read/missing/1')
    render(
      <Routes>
        <Route path="/read/:webtoonId/:episodeNumber" element={<ReaderPage />} />
      </Routes>
    )
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Series not found' })
    ).toBeInTheDocument()
  })

  it('uses episode recovery when the series exists but the episode does not', async () => {
    window.history.pushState({}, '', '/read/1/999')
    render(
      <Routes>
        <Route path="/read/:webtoonId/:episodeNumber" element={<ReaderPage />} />
      </Routes>
    )
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Episode not found' })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to series/i })).toHaveAttribute(
      'href',
      '/webtoon/1'
    )
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
