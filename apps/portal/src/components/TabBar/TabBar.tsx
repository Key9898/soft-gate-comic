import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookOpen, Search, Bookmark, Coins, User } from 'lucide-react'

/**
 * The persistent mobile navigation (issue #37).
 *
 * Below md the portal had no standing nav — every primary destination sat behind the
 * hamburger. This carries the five of them, so the menu keeps only what the bar does
 * not cover. It is mounted by MainLayout alone: the reader is a full-bleed surface
 * and the auth screens are deliberately single-purpose.
 *
 * Library, Coins and Profile stay visible to guests. Each already sits behind
 * ProtectedRoute, which redirects to sign-in carrying the attempted location, so a
 * guest returns to the tab they picked. Hiding them would be a second, divergent
 * source of truth for who may go where.
 */

type Tab = {
  to: string
  labelKey: string
  Icon: typeof BookOpen
  /** Nested paths belong to the tab too, e.g. /categories/action is still Browse. */
  matchesNested: boolean
}

const TABS: readonly Tab[] = [
  { to: '/', labelKey: 'nav.tabHome', Icon: BookOpen, matchesNested: false },
  { to: '/categories', labelKey: 'nav.tabBrowse', Icon: Search, matchesNested: true },
  { to: '/library', labelKey: 'nav.tabLibrary', Icon: Bookmark, matchesNested: true },
  { to: '/coins', labelKey: 'nav.tabCoins', Icon: Coins, matchesNested: true },
  { to: '/profile', labelKey: 'nav.tabProfile', Icon: User, matchesNested: true },
]

function isActive(tab: Tab, pathname: string): boolean {
  if (!tab.matchesNested) return pathname === tab.to
  return pathname === tab.to || pathname.startsWith(`${tab.to}/`)
}

const TabBar = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  return (
    <nav
      data-testid="tab-bar"
      aria-label={t('nav.menu')}
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-sm md:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {TABS.map((tab) => {
          const active = isActive(tab, pathname)
          return (
            <li key={tab.to} className="flex-1">
              <Link
                to={tab.to}
                aria-current={active ? 'page' : undefined}
                className={`focus-visible:ring-primary-500 flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                  active ? 'text-primary-600' : 'hover:text-primary-600 text-gray-500'
                }`}
              >
                <tab.Icon className="h-5.5 w-5.5 shrink-0" aria-hidden="true" />
                {/* Myanmar runs longer than English, so the label wraps rather than
                    clipping mid-word. */}
                <span className="text-2xs w-full text-balance text-center font-semibold leading-tight">
                  {t(tab.labelKey)}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default TabBar
