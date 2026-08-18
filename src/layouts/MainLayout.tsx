import { Outlet } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default MainLayout
