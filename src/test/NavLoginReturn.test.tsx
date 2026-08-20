import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { EngagementProvider } from '../context/EngagementContext'
import { LibraryProvider } from '../context/LibraryContext'
import { WalletProvider } from '../context/WalletContext'
import Navigation from '../components/Navigation/Navigation'

function LoginFromProbe() {
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string; search?: string } } | null)?.from
  return (
    <div>
      <span data-testid="from-path">{from?.pathname ?? ''}</span>
      <span data-testid="from-search">{from?.search ?? ''}</span>
    </div>
  )
}

function renderNavAt(entry: string) {
  return render(
    <HelmetProvider>
      <DataProvider>
        <MemoryRouter initialEntries={[entry]}>
          <AuthProvider>
            <LibraryProvider>
              <WalletProvider>
                <EngagementProvider>
                  <Routes>
                    <Route path="/login" element={<LoginFromProbe />} />
                    <Route path="*" element={<Navigation />} />
                  </Routes>
                </EngagementProvider>
              </WalletProvider>
            </LibraryProvider>
          </AuthProvider>
        </MemoryRouter>
      </DataProvider>
    </HelmetProvider>
  )
}

describe('Nav Login return from (Impl 139)', () => {
  it('passes /author/:id as from when a guest clicks Login', async () => {
    const user = userEvent.setup()
    renderNavAt('/author/1')

    await user.click(screen.getByRole('link', { name: /login/i }))

    expect(screen.getByTestId('from-path')).toHaveTextContent('/author/1')
    expect(screen.getByTestId('from-search')).toHaveTextContent('')
  })

  it('passes /ranking as from when a guest clicks Login', async () => {
    const user = userEvent.setup()
    renderNavAt('/ranking')

    await user.click(screen.getByRole('link', { name: /login/i }))

    expect(screen.getByTestId('from-path')).toHaveTextContent('/ranking')
    expect(screen.getByTestId('from-search')).toHaveTextContent('')
  })
})
