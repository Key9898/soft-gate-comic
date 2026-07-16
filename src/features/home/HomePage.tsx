import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion, type MotionProps } from 'framer-motion'
import { Play, Bookmark, Eye, ChevronRight } from 'lucide-react'
import Button from '../../components/Button'
import Card from '../../components/Card'
import { useData } from '../../context/DataContext'
import { formatCount } from '../../lib/utils/formatters'

const HomePage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'
  const prefersReducedMotion = useReducedMotion()

  const { webtoons, genres, isLoading } = useData()

  // Fix 4: Featured webtoon randomization (changes on every visit)
  const [featuredIndex] = useState(() => {
    return webtoons.length > 0 ? Math.floor(Math.random() * webtoons.length) : 0
  })
  const featuredWebtoon = webtoons[featuredIndex] || webtoons[0]

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

  if (isLoading || webtoons.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="border-primary-600 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    )
  }

  const trendingWebtoons = webtoons.slice(0, 6)
  const newReleases = webtoons.slice(3, 9)

  // Format date for new releases
  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 1) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 30) return `${diffDays} days ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

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
      <section
        className="safe-top relative -mt-16 overflow-hidden bg-cover bg-center pt-16 text-white"
        style={{ backgroundImage: `url('/banner/banner.png')` }}
      >
        <div className="to-primary-950/65 pointer-events-none absolute inset-0 bg-gradient-to-br from-gray-950/85 via-gray-950/75" />
        <div className="hero-landscape-adjust relative mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20 xl:py-24">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
            <motion.div
              {...getAnimationProps(
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0 },
                { duration: 0.5 }
              )}
              className="flex-1 text-center lg:text-left"
            >
              <span
                className="mb-4 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur"
                role="status"
                aria-label={t('home.featured')}
              >
                {t('home.featured')}
              </span>
              <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-[2.5rem] lg:text-5xl xl:text-6xl">
                {featuredWebtoon.title[lang]}
              </h1>
              <p className="mb-6 max-w-md text-base text-white/80 sm:max-w-xl sm:text-lg">
                {featuredWebtoon.description[lang]}
              </p>
              <div className="mb-6 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Link
                  to={`/author/${featuredWebtoon.author.id}`}
                  className="focus:ring-offset-primary-700 flex items-center gap-2 rounded-md px-1 transition hover:opacity-80 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
                  aria-label={`View ${featuredWebtoon.author.name[lang]}'s profile`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <span className="text-sm font-bold">
                      {featuredWebtoon.author.name[lang].charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium">{featuredWebtoon.author.name[lang]}</span>
                </Link>
                <span className="hidden text-white/60 sm:inline">|</span>
                <span className="text-white/80">{featuredWebtoon.genres.join(', ')}</span>
                <span className="hidden text-white/60 sm:inline">|</span>
                <span className="text-white/80">
                  {formatCount(featuredWebtoon.viewCount)} {t('webtoon.views')}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Link
                  to={`/webtoon/${featuredWebtoon.id}`}
                  className="focus:ring-offset-primary-700 rounded-full focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
                >
                  <Button variant="secondary" leftIcon={<Play className="h-5 w-5" />}>
                    {t('home.startReading')}
                  </Button>
                </Link>
                <Button variant="heroOutline" leftIcon={<Bookmark className="h-5 w-5" />}>
                  {t('home.addToLibrary')}
                </Button>
              </div>
            </motion.div>
            <motion.div
              {...getAnimationProps(
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0 },
                { duration: 0.5, delay: 0.2 }
              )}
              className="mx-auto block w-48 sm:w-56 lg:mx-0 lg:w-64"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur">
                {featuredWebtoon.coverImage ? (
                  <img
                    src={featuredWebtoon.coverImage}
                    alt={featuredWebtoon.title[lang]}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={`h-full w-full ${featuredWebtoon.coverColor} flex items-center justify-center`}
                  >
                    <span className="text-sm text-white/60">Cover Image</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="scrollbar-hide flex items-center gap-3 overflow-x-auto pb-2">
            <span className="hidden font-medium whitespace-nowrap text-gray-500 sm:inline">
              {t('home.genres')}:
            </span>
            {genres.map((genre) => (
              <Link
                key={genre.id}
                to={`/categories?genre=${genre.slug}`}
                onClick={() => setSelectedGenre(genre.slug)}
                className={`focus:ring-primary-500 inline-flex min-h-[44px] items-center rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                  selectedGenre === genre.slug
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {genre.name[lang]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{t('home.trendingNow')}</h2>
            <Link
              to="/categories?sort=popular"
              className="text-primary-600 hover:text-primary-700 focus:ring-primary-500 flex min-h-[44px] items-center gap-1 rounded-md px-3 py-2 font-medium transition focus:ring-2 focus:outline-none"
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
                  className="focus:ring-primary-500 block rounded-xl focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                  <Card variant="interactive" padding="none" className="group overflow-hidden">
                    <div
                      className={`aspect-[3/4] ${webtoon.coverColor} relative flex items-center justify-center overflow-hidden`}
                    >
                      {webtoon.coverImage ? (
                        <>
                          {/* Cover text - in DOM for accessibility/tests, covered by image when loaded */}
                          <span aria-hidden="true" className="text-sm text-white/60">
                            Cover
                          </span>
                          {!loadedImages.has(webtoon.id) && !failedImages.has(webtoon.id) && (
                            <div className="absolute inset-0 animate-pulse bg-gray-200" />
                          )}
                          <img
                            src={webtoon.coverImage}
                            alt={webtoon.title[lang]}
                            onLoad={() => handleImageLoad(webtoon.id)}
                            onError={() => handleImageError(webtoon.id)}
                            className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 group-hover:scale-105 ${
                              loadedImages.has(webtoon.id) ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        </>
                      ) : (
                        <span className="text-sm text-white/60">Cover</span>
                      )}
                    </div>
                    <div className="p-3 sm:p-3.5">
                      <h3
                        className="truncate text-sm font-semibold text-gray-900"
                        title={webtoon.title[lang]}
                      >
                        {webtoon.title[lang]}
                      </h3>
                      <p className="truncate text-xs text-gray-500" title={webtoon.genres[0]}>
                        {webtoon.genres[0]}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Eye className="h-3 w-3 text-slate-400" />
                        <span>{formatCount(webtoon.viewCount)}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {t('home.newReleases')}
              </h2>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Latest webtoons added to Soft-Gate Comic
              </p>
            </div>
            <Link
              to="/categories?sort=new"
              className="text-primary-600 hover:text-primary-700 focus:ring-primary-500 flex min-h-[44px] items-center gap-1 rounded-md px-3 py-2 font-medium transition focus:ring-2 focus:outline-none"
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
                  className="focus:ring-primary-500 block rounded-xl focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                  <Card variant="interactive" padding="none" className="group overflow-hidden">
                    <div
                      className={`aspect-[3/4] ${webtoon.coverColor} relative flex items-center justify-center overflow-hidden`}
                    >
                      {webtoon.coverImage ? (
                        <>
                          {/* Cover text - in DOM for accessibility/tests, covered by image when loaded */}
                          <span aria-hidden="true" className="text-sm text-white/60">
                            Cover
                          </span>
                          {!loadedImages.has(webtoon.id) && !failedImages.has(webtoon.id) && (
                            <div className="absolute inset-0 animate-pulse bg-gray-200" />
                          )}
                          <img
                            src={webtoon.coverImage}
                            alt={webtoon.title[lang]}
                            onLoad={() => handleImageLoad(webtoon.id)}
                            onError={() => handleImageError(webtoon.id)}
                            className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 group-hover:scale-105 ${
                              loadedImages.has(webtoon.id) ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        </>
                      ) : (
                        <span className="text-sm text-white/60">Cover</span>
                      )}
                      <span className="absolute top-2 left-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                        {t('webtoon.new')}
                      </span>
                    </div>
                    <div className="p-3 sm:p-3.5">
                      <h3
                        className="truncate text-sm font-semibold text-gray-900"
                        title={webtoon.title[lang]}
                      >
                        {webtoon.title[lang]}
                      </h3>
                      <p className="truncate text-xs text-gray-500" title={webtoon.genres[0]}>
                        {webtoon.genres[0]}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-slate-400" />
                          <span>{formatCount(webtoon.viewCount)}</span>
                        </div>
                        <span className="font-medium text-slate-500">
                          {formatReleaseDate(webtoon.createdAt)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="from-primary-600 to-primary-700 rounded-2xl bg-gradient-to-r p-6 text-center text-white sm:p-8 md:p-10 lg:p-12">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              {t('home.startJourney')}
            </h2>
            <p className="mx-auto mb-6 max-w-xl text-white">{t('home.joinDescription')}</p>
            <Link
              to="/register"
              className="focus:ring-offset-primary-700 inline-block rounded-full focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
            >
              <Button variant="secondary">{t('home.getStartedFree')}</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
