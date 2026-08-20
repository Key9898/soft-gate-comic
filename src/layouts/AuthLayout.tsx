import { Link, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'
import AuthAtmosphere from '../features/auth/AuthAtmosphere'
import AuthSplitCard, { type AuthReturnFrom } from '../features/auth/AuthSplitCard'

const AuthLayout = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const isSplit = location.pathname === '/login' || location.pathname === '/register'
  const splitView = location.pathname === '/register' ? 'register' : 'login'
  const from = (location.state as { from?: AuthReturnFrom } | null)?.from

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      <div className="radial-wash-primary pointer-events-none absolute inset-0" aria-hidden />
      <a
        href="#main-content"
        className="skip-link"
        onClick={() => document.getElementById('main-content')?.focus()}
      >
        {t('a11y.skipToContent')}
      </a>
      <header className="relative z-10 border-b border-gray-200/80 bg-white/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-primary-600 focus-visible:ring-primary-500 flex items-center rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
          >
            <img
              src="/logo/logo.svg"
              alt="SoftGate Comic Logo"
              className="h-11 w-auto shrink-0 object-contain"
            />
          </Link>
          <LanguageSwitcher />
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="relative z-10 flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          {isSplit ? (
            <>
              <AuthSplitCard view={splitView} from={from} />
              <div className="mx-auto mt-10 max-w-md lg:hidden">
                <AuthAtmosphere />
                <img
                  src="/auth/reading-room-sm.jpg"
                  alt=""
                  className="mt-6 w-full rounded-3xl object-cover"
                  width={800}
                  height={1000}
                />
              </div>
            </>
          ) : (
            <div className="mx-auto max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <Outlet />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AuthLayout
