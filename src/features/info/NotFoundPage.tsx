import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, Search, LayoutGrid, Library, Mail } from 'lucide-react'
import SEO from '../../components/SEO/SEO'

const NotFoundPage = () => {
  const { t } = useTranslation()

  const popularLinks = [
    { icon: LayoutGrid, label: t('nav.categories'), to: '/categories' },
    { icon: Library, label: t('nav.library'), to: '/library' },
    { icon: Mail, label: t('footer.contact'), to: '/contact' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SEO noindex title={t('notFound.title')} description={t('notFound.desc')} />
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <p className="text-primary-200 text-7xl font-bold tracking-tight sm:text-8xl" aria-hidden>
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">{t('notFound.title')}</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500">{t('notFound.desc')}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500 flex min-h-[44px] items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-medium text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Home className="h-4 w-4" aria-hidden />
            {t('notFound.goHome')}
          </Link>
          <Link
            to="/search"
            className="focus-visible:ring-primary-500 flex min-h-[44px] items-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Search className="h-4 w-4" aria-hidden />
            {t('notFound.searchCta')}
          </Link>
        </div>

        <div className="mt-12 w-full max-w-md">
          <h2 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
            {t('notFound.popularHeading')}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {popularLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hover:border-primary-300 focus-visible:ring-primary-500 flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <link.icon className="text-primary-500 h-4 w-4" aria-hidden />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
