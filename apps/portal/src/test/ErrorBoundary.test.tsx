import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, Link } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from '../lib/i18n'
import ErrorBoundary, { RouteErrorBoundary } from '../components/ErrorBoundary'

const Boom = ({ when = true }: { when?: boolean }) => {
  if (when) throw new Error('kaboom')
  return <p>safe content</p>
}

// React logs the caught error to console.error; silence it so a passing run
// stays readable and a real unexpected log still stands out.
let consoleError: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  consoleError.mockRestore()
})

const withI18n = (node: React.ReactNode) => <I18nextProvider i18n={i18n}>{node}</I18nextProvider>

describe('ErrorBoundary', () => {
  it('renders its children when nothing throws', () => {
    render(withI18n(<ErrorBoundary>{<Boom when={false} />}</ErrorBoundary>))
    expect(screen.getByText('safe content')).toBeInTheDocument()
  })

  it('renders a fallback instead of unmounting the tree when a child throws', () => {
    render(
      withI18n(
        <div>
          <p>sibling chrome</p>
          <ErrorBoundary>
            <Boom />
          </ErrorBoundary>
        </div>
      )
    )
    expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument()
    expect(screen.getByText('sibling chrome')).toBeInTheDocument()
    expect(screen.queryByText('kaboom')).not.toBeInTheDocument()
  })

  it('does not render raw i18n keys in the fallback', () => {
    const { container } = render(
      withI18n(
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      )
    )
    expect(container.textContent).not.toMatch(/errors\.[a-zA-Z]/)
    expect(container.textContent).not.toMatch(/common\.[a-zA-Z]/)
  })

  it('offers a retry that re-renders the subtree', async () => {
    const user = userEvent.setup()
    let shouldThrow = true
    const Flaky = () => {
      if (shouldThrow) throw new Error('kaboom')
      return <p>recovered</p>
    }

    render(
      withI18n(
        <ErrorBoundary>
          <Flaky />
        </ErrorBoundary>
      )
    )
    expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument()

    shouldThrow = false
    await user.click(screen.getByRole('button', { name: /try again/i }))
    expect(screen.getByText('recovered')).toBeInTheDocument()
  })

  it('clears the fallback when resetKey changes', () => {
    const { rerender } = render(
      withI18n(
        <ErrorBoundary resetKey="/a">
          <Boom />
        </ErrorBoundary>
      )
    )
    expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument()

    rerender(
      withI18n(
        <ErrorBoundary resetKey="/b">
          <Boom when={false} />
        </ErrorBoundary>
      )
    )
    expect(screen.getByText('safe content')).toBeInTheDocument()
  })

  it('reports the error through onError so a crash is not swallowed silently', () => {
    const onError = vi.fn()
    render(
      withI18n(
        <ErrorBoundary onError={onError}>
          <Boom />
        </ErrorBoundary>
      )
    )
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError.mock.calls[0]?.[0]).toBeInstanceOf(Error)
  })
})

describe('RouteErrorBoundary', () => {
  it('recovers when the reader navigates to another route', async () => {
    const user = userEvent.setup()

    render(
      withI18n(
        <MemoryRouter initialEntries={['/broken']}>
          <Link to="/safe">go safe</Link>
          <RouteErrorBoundary>
            <Routes>
              <Route path="/broken" element={<Boom />} />
              <Route path="/safe" element={<p>safe content</p>} />
            </Routes>
          </RouteErrorBoundary>
        </MemoryRouter>
      )
    )
    expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'go safe' }))
    expect(screen.getByText('safe content')).toBeInTheDocument()
  })
})

describe('layout wiring', () => {
  it('keeps the navigation and footer when a page under MainLayout crashes', async () => {
    const { MemoryRouter: Router, Routes: R, Route: Rt } = await import('react-router-dom')
    const { HelmetProvider } = await import('react-helmet-async')
    const MainLayout = (await import('../layouts/MainLayout')).default
    const { SettingsProvider } = await import('../context/SettingsContext')
    const { AuthProvider } = await import('../context/AuthContext')
    const { DataProvider } = await import('../context/DataContext')
    const { LibraryProvider } = await import('../context/LibraryContext')
    const { FollowsProvider } = await import('../context/FollowsContext')
    const { WalletProvider } = await import('../context/WalletContext')
    const { EngagementProvider } = await import('../context/EngagementContext')

    render(
      withI18n(
        <HelmetProvider>
          <Router initialEntries={['/broken']}>
            <SettingsProvider>
              <AuthProvider>
                <DataProvider>
                  <LibraryProvider>
                    <FollowsProvider>
                      <WalletProvider>
                        <EngagementProvider>
                          <R>
                            <Rt element={<MainLayout />}>
                              <Rt path="/broken" element={<Boom />} />
                            </Rt>
                          </R>
                        </EngagementProvider>
                      </WalletProvider>
                    </FollowsProvider>
                  </LibraryProvider>
                </DataProvider>
              </AuthProvider>
            </SettingsProvider>
          </Router>
        </HelmetProvider>
      )
    )

    expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument()
    expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
