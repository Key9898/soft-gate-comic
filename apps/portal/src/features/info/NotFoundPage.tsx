import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Home, LayoutGrid, ListOrdered, Sparkles, BookOpen } from 'lucide-react'
import SEO from '../../components/SEO/SEO'
import SearchAutocomplete from '../../components/SearchAutocomplete'
import BookCard from '../../components/BookCard'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import ScrollToTop from '../../components/ScrollToTop'
import { useData } from '../../context/DataContext'
import { rankingWebtoons } from '../../lib/catalog/discovery'
import { useSsrResponse } from '../../lib/ssr/ssrResponse'
import { buttonClasses } from '../../components/Button'
import { DESTINATION_TILE } from './components/infoStyles'

export type NotFoundVariant = 'page' | 'series' | 'episode' | 'author' | 'genre'

interface NotFoundPageProps {
  variant?: NotFoundVariant
  seriesHref?: string
  withSiteChrome?: boolean
}

const DEST_LINK = DESTINATION_TILE

const PRIMARY_CTA = buttonClasses({ variant: 'primary', size: 'md' })

const SECONDARY_CTA = buttonClasses({ variant: 'surface', size: 'md' })

const COPY = {
  page: { titleKey: 'notFound.pageTitle', descKey: 'notFound.pageDesc' },
  series: { titleKey: 'notFound.seriesTitle', descKey: 'notFound.seriesDesc' },
  episode: { titleKey: 'notFound.episodeTitle', descKey: 'notFound.episodeDesc' },
  author: { titleKey: 'notFound.authorTitle', descKey: 'notFound.authorDesc' },
  genre: { titleKey: 'notFound.genreTitle', descKey: 'notFound.genreDesc' },
} as const

const DESTINATIONS = [
  { to: '/categories', labelKey: 'nav.categories', icon: LayoutGrid },
  { to: '/ranking', labelKey: 'home.ranking', icon: ListOrdered },
  { to: '/categories?sort=new', labelKey: 'home.newReleases', icon: Sparkles },
] as const

const NotFoundPage = ({
  variant = 'page',
  seriesHref,
  withSiteChrome = false,
}: NotFoundPageProps) => {
  const { t, i18n } = useTranslation()
  const { webtoons } = useData()
  const ssrResponse = useSsrResponse()
  if (ssrResponse) ssrResponse.status = 404
  const lang = i18n.language.startsWith('mm') ? 'mm' : 'en'
  const copy = COPY[variant]
  const examples = rankingWebtoons(webtoons, 3)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  const recovery = (
    <div className="bg-gray-50 pb-16">
      <SEO
        noindex
        omitJsonLd
        omitCanonical
        omitKeywords
        omitSocial
        title={t(copy.titleKey)}
        description={t(copy.descKey)}
      />
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <p className="text-primary-700 text-7xl font-bold tracking-tight sm:text-8xl" aria-hidden>
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">{t(copy.titleKey)}</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-500">{t(copy.descKey)}</p>

        <div className="mt-8 w-full max-w-md text-left">
          <h2 className="text-muted text-xs font-bold uppercase tracking-wider">
            {t('search.title')}
          </h2>
          <div className="mt-4">
            <SearchAutocomplete className="w-full" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className={PRIMARY_CTA}>
            <Home className="h-4 w-4" aria-hidden />
            {t('notFound.goHome')}
          </Link>
          {variant === 'episode' && seriesHref ? (
            <Link to={seriesHref} className={SECONDARY_CTA}>
              <BookOpen className="h-4 w-4" aria-hidden />
              {t('reader.backToWebtoon')}
            </Link>
          ) : null}
        </div>

        <div className="mt-12 w-full max-w-3xl">
          <h2 className="text-muted text-xs font-bold uppercase tracking-wider">
            {t('notFound.goHere')}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {DESTINATIONS.map((item) => (
              <Link key={item.to} to={item.to} className={DEST_LINK}>
                <item.icon className="text-primary-500 h-4 w-4" aria-hidden />
                {t(item.labelKey)}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 w-full max-w-3xl text-left">
          <h2 className="text-muted text-center text-xs font-bold uppercase tracking-wider">
            {t('notFound.tryTitle')}
          </h2>
          <p className="mt-3 text-center text-sm leading-relaxed text-gray-500">
            {t('notFound.tryNote')}
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {examples.map((webtoon) => (
              <li key={webtoon.id}>
                <Link
                  to={`/webtoon/${webtoon.id}`}
                  className="focus-visible:ring-primary-500 block rounded-2xl focus-visible:outline-none focus-visible:ring-2"
                >
                  <BookCard
                    coverImage={webtoon.coverImage}
                    coverColor={webtoon.coverColor}
                    title={webtoon.title[lang]}
                    showCoverLabel={false}
                    imageLoaded={loadedImages.has(webtoon.id)}
                    imageFailed={failedImages.has(webtoon.id)}
                    onImageLoad={() =>
                      setLoadedImages((prev) => {
                        const next = new Set(prev)
                        next.add(webtoon.id)
                        return next
                      })
                    }
                    onImageError={() =>
                      setFailedImages((prev) => {
                        const next = new Set(prev)
                        next.add(webtoon.id)
                        return next
                      })
                    }
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 w-full max-w-xl">
          <h2 className="text-muted text-xs font-bold uppercase tracking-wider">
            {t('notFound.helpTitle')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">{t('notFound.helpDesc')}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link to="/help" className={SECONDARY_CTA}>
              {t('footer.help')}
            </Link>
            <Link to="/contact" className={SECONDARY_CTA}>
              {t('footer.contact')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  if (!withSiteChrome) {
    return recovery
  }

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
        {recovery}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default NotFoundPage
