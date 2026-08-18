import { useState, useMemo, useId } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Search, Bell, BookMarked, Coins, User, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../Button'
import LanguageSwitcher from '../LanguageSwitcher'
import SearchAutocomplete from '../SearchAutocomplete'
import { useAuth } from '../../context/AuthContext'
import { useEngagement } from '../../context/EngagementContext'

const Navigation = () => {
  const { t } = useTranslation()
  const { user, isAuthenticated, logout } = useAuth()
  const { unreadNotificationCount } = useEngagement()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const location = useLocation()
  const menuId = useId()
  const searchPanelId = useId()

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
    <nav className="safe-top sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
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

            <div className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`focus-visible:ring-primary-500 rounded-2xl text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none ${
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

          <div className="flex items-center gap-3 lg:gap-2">
            <SearchAutocomplete className="hidden xl:block" />

            <button
              type="button"
              title={t('search.title')}
              aria-label={t('search.title')}
              aria-expanded={isSearchOpen}
              aria-controls={isSearchOpen ? searchPanelId : undefined}
              className="hover:text-primary-600 focus-visible:ring-primary-500 flex min-h-11 min-w-11 items-center justify-center rounded-2xl p-2 text-gray-600 transition focus-visible:ring-2 focus-visible:outline-none xl:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>

            {isAuthenticated && (
              <>
                <Link
                  to="/library"
                  title={t('nav.library')}
                  aria-label={t('nav.library')}
                  className="hover:text-primary-600 focus-visible:ring-primary-500 hidden min-h-11 min-w-11 shrink-0 items-center justify-center rounded-2xl p-2 text-gray-600 transition focus-visible:ring-2 focus-visible:outline-none lg:flex"
                >
                  <BookMarked className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link
                  to="/coins"
                  title={t('nav.coins')}
                  aria-label={t('nav.coins')}
                  className="hover:text-primary-600 focus-visible:ring-primary-500 hidden min-h-11 min-w-11 shrink-0 items-center justify-center rounded-2xl p-2 text-gray-600 transition focus-visible:ring-2 focus-visible:outline-none lg:flex"
                >
                  <Coins className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link
                  to="/notifications"
                  title={t('nav.notifications')}
                  aria-label={t('nav.notifications')}
                  className="hover:text-primary-600 focus-visible:ring-primary-500 relative flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-2xl p-2 text-gray-600 transition focus-visible:ring-2 focus-visible:outline-none"
                >
                  <Bell className="h-5 w-5" aria-hidden="true" />
                  {unreadNotificationCount > 0 ? (
                    <span className="bg-accent-600 shape-circle absolute top-1 right-1 h-2 w-2" />
                  ) : null}
                </Link>
              </>
            )}

            <LanguageSwitcher />

            {isAuthenticated && user ? (
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  to="/profile"
                  className="bg-primary-50 hover:bg-primary-100 focus-visible:ring-primary-500 flex min-w-0 items-center gap-2 rounded-2xl px-3 py-1.5 transition focus-visible:ring-2 focus-visible:outline-none"
                >
                  <div className="bg-primary-600 shape-circle flex h-6 w-6 shrink-0 items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {user.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-primary-700 max-w-[10ch] truncate text-sm font-medium">
                    {user.displayName}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="focus-visible:ring-primary-500 flex min-h-11 min-w-11 items-center justify-center rounded-2xl p-2 text-gray-500 transition hover:text-red-600 focus-visible:ring-2 focus-visible:outline-none"
                  title={t('nav.logout')}
                  aria-label={t('nav.logout')}
                >
                  <LogOut className="h-5 w-5" aria-hidden="true" />
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
              title={t('nav.menu')}
              aria-label={t('nav.menu')}
              aria-expanded={isMenuOpen}
              aria-controls={isMenuOpen ? menuId : undefined}
              className={`hover:text-primary-600 focus-visible:ring-primary-500 flex min-h-11 min-w-11 items-center justify-center rounded-2xl p-2 text-gray-600 transition focus-visible:ring-2 focus-visible:outline-none ${
                isAuthenticated ? 'lg:hidden' : 'md:hidden'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              id={searchPanelId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden xl:hidden"
            >
              <div className="py-3">
                <SearchAutocomplete
                  autoFocus
                  className="w-full"
                  inputClassName="focus:ring-primary-500 w-full rounded-2xl border-none bg-gray-100 py-2 pr-4 pl-10 text-sm transition-all focus:bg-white focus:ring-2"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id={menuId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`overflow-hidden border-t border-gray-200 bg-white ${
              isAuthenticated ? 'lg:hidden' : 'md:hidden'
            }`}
          >
            <div className="space-y-3 px-4 py-4">
              <div className="space-y-3 md:hidden">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`focus-visible:ring-primary-500 flex min-h-11 items-center rounded-2xl py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                      isActive(link.path)
                        ? 'text-primary-600'
                        : 'hover:text-primary-600 text-gray-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-3">
                {isAuthenticated && user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="hover:text-primary-600 focus-visible:ring-primary-500 flex min-h-11 items-center gap-2 rounded-2xl py-2 text-sm font-medium text-gray-600 focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <User className="h-4 w-4" aria-hidden="true" />
                      {user.displayName}
                    </Link>
                    <Link
                      to="/library"
                      onClick={() => setIsMenuOpen(false)}
                      className="hover:text-primary-600 focus-visible:ring-primary-500 flex min-h-11 items-center rounded-2xl py-2 text-sm font-medium text-gray-600 focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {t('nav.library')}
                    </Link>
                    <Link
                      to="/coins"
                      onClick={() => setIsMenuOpen(false)}
                      className="hover:text-primary-600 focus-visible:ring-primary-500 flex min-h-11 items-center rounded-2xl py-2 text-sm font-medium text-gray-600 focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {t('nav.coins')}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="focus-visible:ring-primary-500 flex min-h-11 items-center gap-2 rounded-2xl py-2 text-sm font-medium text-red-600 hover:text-red-700 focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-primary-600 focus-visible:ring-primary-500 flex min-h-11 items-center rounded-2xl py-2 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
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
