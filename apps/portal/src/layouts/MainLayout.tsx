import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'

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
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default MainLayout
