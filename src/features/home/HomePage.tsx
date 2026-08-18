import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion, type MotionProps } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Button from '../../components/Button'
import { CatalogBookCard } from '../../components/BookCard'
import SEO from '../../components/SEO/SEO'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useEngagement } from '../../context/EngagementContext'
import { useLibrary } from '../../context/LibraryContext'
import { useOverflowScrollX } from '../../hooks/useOverflowScrollX'
import { blendedProgressPercent, isSeriesCompleteForContinue } from '../../lib/engagement'
import { newestPublishedIds } from '../../lib/catalog'
import HeroSpotlight from './components/HeroSpotlight'
import HomePageSkeleton from './components/HomePageSkeleton'
import HomeEmptyState from './components/HomeEmptyState'

const CONTINUE_CAP = 12
const HERO_SLIDE_CAP = 5

const HomePage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'
  const prefersReducedMotion = useReducedMotion()

  const { webtoons, genres, isLoading } = useData()
  const { isBookmarked, toggleBookmark } = useLibrary()
  const { isAuthenticated } = useAuth()
  const { history } = useEngagement()
  const {
    ref: genreScrollRef,
    canScrollRight: canScrollGenreRight,
    scrollByPage: scrollGenreByPage,
    update: updateGenreScroll,
  } = useOverflowScrollX()
  const {
    ref: continueScrollRef,
    canScrollRight: canScrollContinueRight,
    scrollByPage: scrollContinueByPage,
  } = useOverflowScrollX()

  useEffect(() => {
    updateGenreScroll()
  }, [genres, updateGenreScroll])

  // Fix 5: Genre active state
  const [selectedGenre, setSelectedGenre] = useState('all')

  // Fix 8: Loading skeleton state
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }
  const handleImageError = (id: string) => {
    setFailedImages((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const continueItems = useMemo(() => {
    if (!isAuthenticated || history.length === 0) return []
    const byId = new Map(webtoons.map((w) => [w.id, w]))
    const items = []
    for (const record of history) {
      const w = byId.get(record.webtoonId)
      if (!w || w.status === 'draft') continue
      const scrollRatio = record.scrollRatio ?? 0
      if (isSeriesCompleteForContinue(record.episodeNumber, w.episodeCount, scrollRatio)) {
        continue
      }
      const progress = blendedProgressPercent(record.episodeNumber, w.episodeCount, scrollRatio)
      items.push({ webtoon: w, record, progress })
      if (items.length >= CONTINUE_CAP) break
    }
    return items
  }, [isAuthenticated, history, webtoons])

  const publishedByViews = useMemo(
    () =>
      [...webtoons].filter((w) => w.status !== 'draft').sort((a, b) => b.viewCount - a.viewCount),
    [webtoons]
  )
  const newestIds = useMemo(() => newestPublishedIds(webtoons), [webtoons])

  if (isLoading) {
    return <HomePageSkeleton />
  }

  if (webtoons.length === 0) {
    return <HomeEmptyState />
  }

  const heroSlides = publishedByViews.slice(0, HERO_SLIDE_CAP)
  const trendingWebtoons = publishedByViews.slice(0, 6)
  const newReleases = [...webtoons]
    .filter((w) => w.status !== 'draft')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  // Fix 13: Reduced motion helper
  const getAnimationProps = (
    initial: MotionProps['initial'],
    animate: MotionProps['animate'],
    transition: MotionProps['transition']
  ): MotionProps => {
    if (prefersReducedMotion) {
      return { initial: false, animate, transition: { duration: 0 } }
    }
    return { initial, animate, transition }
  }

  return (
    <>
      <SEO
        title={t('nav.home')}
        description={t('footer.description')}
        url="https://softgatecomic.com/"
      />
      <HeroSpotlight
        slides={heroSlides}
        lang={lang}
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
      />

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="hidden shrink-0 font-medium whitespace-nowrap text-gray-500 sm:inline">
              {t('home.genres')}:
            </span>
            <div
              ref={genreScrollRef}
              className="scrollbar-hide flex min-w-0 flex-1 flex-nowrap items-center gap-3 overflow-x-auto overscroll-x-contain pb-2"
            >
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  to={`/categories?genre=${genre.slug}`}
                  onClick={() => setSelectedGenre(genre.slug)}
                  className={`focus:ring-primary-500 inline-flex min-h-[44px] shrink-0 items-center rounded-2xl px-4 py-2 text-sm font-medium whitespace-nowrap transition focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                    selectedGenre === genre.slug
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {genre.name[lang]}
                </Link>
              ))}
            </div>
            {canScrollGenreRight ? (
              <button
                type="button"
                onClick={() => scrollGenreByPage('right')}
                aria-label={t('a11y.scrollGenresRight')}
                className="text-primary-600 hover:bg-primary-50 focus:ring-primary-500 flex min-h-[38px] min-w-[38px] shrink-0 items-center justify-center self-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/80 transition focus:ring-2 focus:outline-none"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {continueItems.length > 0 ? (
        <section className="bg-white py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
              {t('home.continueReading')}
            </h2>
            <div className="flex items-center gap-2">
              <div
                ref={continueScrollRef}
                className="scrollbar-hide flex min-w-0 flex-1 flex-nowrap items-stretch gap-4 overflow-x-auto overscroll-x-contain sm:gap-5"
              >
                {continueItems.map(({ webtoon, record, progress }) => (
                  <Link
                    key={webtoon.id}
                    to={`/read/${webtoon.id}/${record.episodeNumber}`}
                    className="focus:ring-primary-500 block w-36 shrink-0 rounded-[3px] focus:ring-2 focus:ring-offset-2 focus:outline-none sm:w-40"
                  >
                    <CatalogBookCard
                      webtoon={webtoon}
                      lang={lang}
                      genres={genres}
                      newestIds={newestIds}
                      imageLoaded={loadedImages.has(`continue-${webtoon.id}`)}
                      imageFailed={failedImages.has(`continue-${webtoon.id}`)}
                      onImageLoad={() => handleImageLoad(`continue-${webtoon.id}`)}
                      onImageError={() => handleImageError(`continue-${webtoon.id}`)}
                      progress={Math.max(progress, 1)}
                      showCoverLabel={false}
                    />
                  </Link>
                ))}
              </div>
              {canScrollContinueRight ? (
                <button
                  type="button"
                  onClick={() => scrollContinueByPage('right')}
                  aria-label={t('a11y.scrollContinueRight')}
                  className="text-primary-600 hover:bg-primary-50 focus:ring-primary-500 flex min-h-[38px] min-w-[38px] shrink-0 items-center justify-center self-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/80 transition focus:ring-2 focus:outline-none"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{t('home.trendingNow')}</h2>
            <Link
              to="/categories?sort=popular"
              className="text-primary-600 hover:text-primary-700 focus:ring-primary-500 flex min-h-[44px] items-center gap-1 rounded-2xl px-3 py-2 font-medium transition focus:ring-2 focus:outline-none"
            >
              {t('common.viewAll')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {trendingWebtoons.map((webtoon, index) => (
              <motion.div
                key={webtoon.id}
                {...getAnimationProps(
                  { opacity: 0, y: 20 },
                  { opacity: 1, y: 0 },
                  { duration: 0.3, delay: index * 0.05 }
                )}
              >
                <Link
                  to={`/webtoon/${webtoon.id}`}
                  className="focus:ring-primary-500 block rounded-[3px] focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                  <CatalogBookCard
                    webtoon={webtoon}
                    lang={lang}
                    genres={genres}
                    newestIds={newestIds}
                    imageLoaded={loadedImages.has(webtoon.id)}
                    imageFailed={failedImages.has(webtoon.id)}
                    onImageLoad={() => handleImageLoad(webtoon.id)}
                    onImageError={() => handleImageError(webtoon.id)}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {t('home.newReleases')}
              </h2>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">{t('home.newReleasesDesc')}</p>
            </div>
            <Link
              to="/categories?sort=new"
              className="text-primary-600 hover:text-primary-700 focus:ring-primary-500 flex min-h-[44px] items-center gap-1 rounded-2xl px-3 py-2 font-medium transition focus:ring-2 focus:outline-none"
            >
              {t('common.viewAll')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {newReleases.map((webtoon, index) => (
              <motion.div
                key={webtoon.id}
                {...getAnimationProps(
                  { opacity: 0, y: 20 },
                  { opacity: 1, y: 0 },
                  { duration: 0.3, delay: index * 0.05 }
                )}
              >
                <Link
                  to={`/webtoon/${webtoon.id}`}
                  className="focus:ring-primary-500 block rounded-[3px] focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                  <CatalogBookCard
                    webtoon={webtoon}
                    lang={lang}
                    genres={genres}
                    newestIds={newestIds}
                    imageLoaded={loadedImages.has(webtoon.id)}
                    imageFailed={failedImages.has(webtoon.id)}
                    onImageLoad={() => handleImageLoad(webtoon.id)}
                    onImageError={() => handleImageError(webtoon.id)}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="from-primary-600 to-primary-700 rounded-3xl bg-gradient-to-r p-6 text-center text-white sm:p-8 md:p-10">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              {t('home.startJourney')}
            </h2>
            <p className="mx-auto mb-6 max-w-xl text-white">{t('home.joinDescription')}</p>
            <Link
              to={isAuthenticated ? '/categories' : '/register'}
              className="focus:ring-offset-primary-700 inline-block rounded-2xl focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
            >
              <Button variant="secondary">
                {isAuthenticated ? t('home.browseNow') : t('home.getStartedFree')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
