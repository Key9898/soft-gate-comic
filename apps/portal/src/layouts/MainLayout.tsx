import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import TabBar from '../components/TabBar'
import { RouteErrorBoundary } from '../components/ErrorBoundary'

const MainLayout = () => {
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      <a
        href="#main-content"
        className="skip-link"
        onClick={() => document.getElementById('main-content')?.focus()}
      >
        {t('a11y.skipToContent')}
      </a>
      <Navigation />
      {/* pb-16 below md keeps the fixed Tab Bar off the end of the page. */}
      <main id="main-content" tabIndex={-1} className="flex-1 pb-16 md:pb-0">
        <RouteErrorBoundary>
          <Outlet />
        </RouteErrorBoundary>
      </main>
      <Footer />
      <ScrollToTop />
      <TabBar />
    </div>
  )
}

export default MainLayout
