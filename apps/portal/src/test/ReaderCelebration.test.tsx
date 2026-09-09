import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { mockEpisodes } from '@softgate/shared'
import i18n from '../lib/i18n'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { SettingsProvider } from '../context/SettingsContext'
import { LibraryProvider } from '../context/LibraryContext'
import { WalletProvider } from '../context/WalletContext'
import { EngagementProvider } from '../context/EngagementContext'
import ReaderPage from '../features/reader/ReaderPage'

const renderReader = (path: string) =>
  render(
    <HelmetProvider>
      <DataProvider>
        <MemoryRouter initialEntries={[path]}>
          <SettingsProvider>
            <AuthProvider>
              <LibraryProvider>
                <WalletProvider>
                  <EngagementProvider>
                    <Routes>
                      <Route path="/read/:webtoonId/:episodeNumber" element={<ReaderPage />} />
                    </Routes>
                  </EngagementProvider>
                </WalletProvider>
              </LibraryProvider>
            </AuthProvider>
          </SettingsProvider>
        </MemoryRouter>
      </DataProvider>
    </HelmetProvider>
  )

describe('Reader celebration honesty', () => {
  it('shows the real next episode title instead of placeholder copy', () => {
    const nextTitle = mockEpisodes.find((e) => e.webtoonId === '1' && e.episodeNumber === 2)!.title
      .en
    renderReader('/read/1/1')
    expect(screen.getByText(nextTitle)).toBeInTheDocument()
    expect(screen.getByText(/episode 2/i)).toBeInTheDocument()
    expect(screen.queryByText(/chapter continuation/i)).not.toBeInTheDocument()
  })

  it('does not sell a pixel-heuristic reading time', () => {
    renderReader('/read/1/1')
    expect(screen.getByRole('heading', { name: 'Chapter complete' })).toBeInTheDocument()
    expect(screen.queryByText(/🎉/)).not.toBeInTheDocument()
    expect(screen.queryByText(/reading time/i)).not.toBeInTheDocument()
  })

  it('exposes series rating in the chapter complete portal', () => {
    renderReader('/read/1/1')
    expect(screen.getByRole('radiogroup', { name: 'Rate this series' })).toBeInTheDocument()
  })

  it('localizes the end-of-series message in both locales', () => {
    expect(i18n.getFixedT('en')('readerPage.endOfSeries')).not.toBe('readerPage.endOfSeries')
    expect(i18n.getFixedT('mm')('readerPage.endOfSeries')).not.toBe('readerPage.endOfSeries')
  })
})
