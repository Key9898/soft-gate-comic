import { useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Search, Bell, User, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../Button'
import LanguageSwitcher from '../LanguageSwitcher'
import { useAuth } from '../../features/auth/useAuth'

const Navigation = () => {
  const { t } = useTranslation()
  const { user, isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const location = useLocation()

  const navLinks = useMemo(
    () => [
      { name: t('categories.title'), path: '/categories' },
      { name: t('home.trendingNow'), path: '/categories?sort=popular' },
      { name: t('home.newReleases'), path: '/categories?sort=new' },
    ],
    [t]
  )

  const isActive = (path: string) => {
    const [linkPathname, linkSearch] = path.split('?')
    if (location.pathname !== linkPathname) return false

    // For links with query params, check if all params match
    if (linkSearch) {
      const linkParams = new URLSearchParams(linkSearch)
      const currentParams = new URLSearchParams(location.search.replace('?', ''))
      for (const [key, value] of linkParams) {
        if (currentParams.get(key) !== value) return false
      }
      return true
    }

    // For links without query params, only active if NO more specific link matches
    const currentParams = new URLSearchParams(location.search.replace('?', ''))
    const hasMoreSpecificMatch = navLinks.some((otherLink) => {
      if (otherLink.path === path) return false
      const [otherPathname, otherSearch] = otherLink.path.split('?')
      if (otherPathname !== linkPathname || !otherSearch) return false
      const otherParams = new URLSearchParams(otherSearch)
      for (const [key, value] of otherParams) {
        if (currentParams.get(key) === value) return true
      }
      return false
    })

    return !hasMoreSpecificMatch
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-primary-600 flex items-center focus:outline-none">
              <img
                src="/logo/logo.jpg"
                alt="Soft-Gate Comic Logo"
                className="h-11 w-11 rounded-xl object-cover shadow-sm"
              />
            </Link>

            <div className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary-600'
                      : 'hover:text-primary-600 text-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder={t('search.placeholder')}
                aria-label={t('search.placeholder')}
                className="focus:ring-primary-500 w-64 rounded-full border-none bg-gray-100 py-2 pr-4 pl-10 text-sm transition-all focus:bg-white focus:ring-2"
              />
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            <button
              type="button"
              title={t('search.title')}
              aria-label={t('search.title')}
              className="hover:text-primary-600 p-2 text-gray-600 transition sm:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </button>

            {isAuthenticated && (
              <Link
                to="/notifications"
                title={t('nav.notifications')}
                aria-label={t('nav.notifications')}
                className="hover:text-primary-600 relative p-2 text-gray-600 transition"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              </Link>
            )}

            <LanguageSwitcher />

            {isAuthenticated && user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  to="/profile"
                  className="bg-primary-50 hover:bg-primary-100 flex items-center gap-2 rounded-full px-3 py-1.5 transition"
                >
                  <div className="bg-primary-600 flex h-6 w-6 items-center justify-center rounded-full">
                    <span className="text-xs font-bold text-white">
                      {user.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-primary-700 text-sm font-medium">{user.displayName}</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="p-2 text-gray-500 transition hover:text-red-600"
                  title={t('nav.logout')}
                  aria-label={t('nav.logout')}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:block">
                <Link to="/login">
                  <Button size="sm">{t('nav.login')}</Button>
                </Link>
              </div>
            )}

            <button
              type="button"
              title={isMenuOpen ? t('common.close') : t('common.viewAll')}
              aria-label={isMenuOpen ? t('common.close') : t('common.viewAll')}
              className="hover:text-primary-600 p-2 text-gray-600 transition md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden sm:hidden"
            >
              <div className="py-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('search.placeholder')}
                    aria-label={t('search.placeholder')}
                    className="focus:ring-primary-500 w-full rounded-full border-none bg-gray-100 py-2 pr-4 pl-10 text-sm transition-all focus:bg-white focus:ring-2"
                  />
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-200 bg-white md:hidden"
          >
            <div className="space-y-3 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary-600'
                      : 'hover:text-primary-600 text-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-3">
                {isAuthenticated && user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="hover:text-primary-600 flex items-center gap-2 py-2 text-sm font-medium text-gray-600"
                    >
                      <User className="h-4 w-4" />
                      {user.displayName}
                    </Link>
                    <Link
                      to="/library"
                      onClick={() => setIsMenuOpen(false)}
                      className="hover:text-primary-600 block py-2 text-sm font-medium text-gray-600"
                    >
                      {t('nav.library')}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center gap-2 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-primary-600 block py-2 text-sm font-medium"
                  >
                    {t('nav.login')}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navigation
