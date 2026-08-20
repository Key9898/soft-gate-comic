import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { LibraryProvider } from '../context/LibraryContext'
import { FollowsProvider } from '../context/FollowsContext'
import { WalletProvider } from '../context/WalletContext'
import { EngagementProvider } from '../context/EngagementContext'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <HelmetProvider>
      <DataProvider>
        <BrowserRouter>
          <AuthProvider>
            <LibraryProvider>
              <FollowsProvider>
                <WalletProvider>
                  <EngagementProvider>{children}</EngagementProvider>
                </WalletProvider>
              </FollowsProvider>
            </LibraryProvider>
          </AuthProvider>
        </BrowserRouter>
      </DataProvider>
    </HelmetProvider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
