import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Check,
  ListFilter,
} from 'lucide-react'
import type { Webtoon } from '@softgate/shared'
import { CatalogBookCard } from '../../components/BookCard'
import SEO from '../../components/SEO/SEO'
import { useData } from '../../context/DataContext'
import { useOverflowScrollX } from '../../hooks/useOverflowScrollX'
import { newestPublishedIds } from '../../lib/catalog'
import { webtoonMatchesGenre } from '../../lib/categories'
import { matchesQuery } from '../../lib/search'
import CategoriesPageSkeleton from './components/CategoriesPageSkeleton'

type SortOption = 'popular' | 'new' | 'recentlyUpdated' | 'highestRated'
type StatusFilter = 'all' | 'ongoing' | 'completed' | 'hiatus'

const CategoriesPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'
  const navigate = useNavigate()
  const { slug: pathSlug } = useParams<{ slug?: string }>()

  const { webtoons, genres, isLoading } = useData()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const {
    ref: genreScrollRef,
    canScrollRight,
    update: updateGenreScroll,
    scrollByPage,
  } = useOverflowScrollX()

  const handleImageError = (id: string) => {
    setFailedImages((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const selectedGenre = pathSlug || searchParams.get('genre') || 'all'
  const selectedStatus = (searchParams.get('status') as StatusFilter | null) || 'all'

  const sortFromUrl = searchParams.get('sort') as SortOption | null
  const [sortBy, setSortBy] = useState<SortOption>(sortFromUrl || 'popular')

  useEffect(() => {
    if (sortFromUrl) {
      setSortBy(sortFromUrl as SortOption)
    }
  }, [sortFromUrl])

  const handleSortChange = (value: SortOption) => {
    setSortBy(value)
    const next = new URLSearchParams(searchParams)
    next.set('sort', value)
    setSearchParams(next)
    setIsDropdownOpen(false)
  }

  const handleGenreChange = (slug: string) => {
    const next = new URLSearchParams(searchParams)
    next.delete('genre')
    const search = next.toString() ? `?${next.toString()}` : ''
    if (slug === 'all') {
      navigate({ pathname: '/categories', search })
    } else {
      navigate({ pathname: `/categories/${slug}`, search })
    }
  }

  useEffect(() => {
    updateGenreScroll()
  }, [genres, selectedGenre, updateGenreScroll])

  const handleStatusChange = (status: StatusFilter) => {
    const next = new URLSearchParams(searchParams)
    if (status === 'all') {
      next.delete('status')
    } else {
      next.set('status', status)
    }
    setSearchParams(next)
  }

  const getPageTitle = () => {
    if (sortFromUrl === 'popular') return t('home.trendingNow')
    if (sortFromUrl === 'new') return t('home.newReleases')
    return t('categories.browseByGenre')
  }

  const getPageIcon = () => {
    if (sortFromUrl === 'popular') return TrendingUp
    if (sortFromUrl === 'new') return Sparkles
    return null
  }

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: t('categories.statusAll') },
    { value: 'ongoing', label: t('categories.statusOngoing') },
    { value: 'completed', label: t('categories.statusCompleted') },
    { value: 'hiatus', label: t('categories.statusHiatus') },
  ]

  const sortedAndFilteredWebtoons = useMemo(() => {
    const genreRecord =
      selectedGenre === 'all' ? undefined : genres.find((g) => g.slug === selectedGenre)

    let result = webtoons.filter((webtoon) => {
      if (webtoon.status === 'draft') return false

      const matchesGenre =
        selectedGenre === 'all' || (genreRecord ? webtoonMatchesGenre(webtoon, genreRecord) : false)

      const matchesStatus = selectedStatus === 'all' || webtoon.status === selectedStatus

      const matchesSearch =
        searchQuery === '' ||
        matchesQuery(
          [webtoon.title.mm, webtoon.title.en, webtoon.author.name.mm, webtoon.author.name.en].join(
            ' '
          ),
          searchQuery
        )

      return matchesGenre && matchesStatus && matchesSearch
    })

    switch (sortBy) {
      case 'popular':
        result = result.sort((a, b) => b.viewCount - a.viewCount)
        break
      case 'new':
        result = result.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return dateB - dateA
        })
        break
      case 'recentlyUpdated':
        result = result.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt).getTime()
          const dateB = new Date(b.updatedAt || b.createdAt).getTime()
          return dateB - dateA
        })
        break
      case 'highestRated':
        result = result.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }

    return result
  }, [webtoons, genres, selectedGenre, selectedStatus, searchQuery, sortBy])

  const newestIds = useMemo(() => newestPublishedIds(webtoons), [webtoons])

  const PageIcon = getPageIcon()

  const sortOptions = [
    { value: 'popular' as SortOption, label: t('categories.mostPopular') },
    { value: 'new' as SortOption, label: t('home.newReleases') },
    { value: 'recentlyUpdated' as SortOption, label: t('categories.recentlyUpdated') },
    { value: 'highestRated' as SortOption, label: t('categories.highestRated') },
  ]

  const activeSortLabel =
    sortOptions.find((o) => o.value === sortBy)?.label || t('categories.mostPopular')

  const statusBadge = (webtoon: Webtoon) => {
    if (webtoon.status === 'completed') {
      return (
        <span className="text-2xs absolute bottom-2 left-2 z-10 rounded-2xl bg-gray-900/80 px-2 py-0.5 font-bold tracking-wider text-white uppercase">
          {t('categories.statusCompleted')}
        </span>
      )
    }
    if (webtoon.status === 'hiatus') {
      return (
        <span className="text-2xs absolute bottom-2 left-2 z-10 rounded-2xl bg-gray-500/90 px-2 py-0.5 font-bold tracking-wider text-white uppercase">
          {t('categories.statusHiatus')}
        </span>
      )
    }
    return null
  }

  if (isLoading) {
    return <CategoriesPageSkeleton />
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300">
      <SEO
        title={getPageTitle()}
        description={t('categories.noWebtoons')}
        url="https://softgatecomic.com/categories"
      />
      <section className="border-b border-gray-200 bg-white transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            {PageIcon && <PageIcon className="text-primary-600 h-8 w-8" />}
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{getPageTitle()}</h1>
          </div>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder={t('search.placeholder')}
              aria-label={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus:ring-primary-500 w-full rounded-2xl border-none bg-gray-100 py-3 pr-4 pl-10 text-sm font-bold text-gray-950 transition placeholder:text-gray-400 focus:bg-white focus:ring-2"
            />
            <Search className="absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="mb-4 flex items-center gap-2">
            <div
              ref={genreScrollRef}
              className="scrollbar-hide flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain sm:gap-3"
            >
              {genres.map((genre) => {
                const isActive = selectedGenre === genre.slug
                return (
                  <button
                    type="button"
                    key={genre.id}
                    onClick={(e) => {
                      handleGenreChange(genre.slug)
                      e.currentTarget.scrollIntoView({
                        inline: 'nearest',
                        block: 'nearest',
                        behavior: 'smooth',
                      })
                    }}
                    className={`relative flex min-h-[38px] shrink-0 items-center justify-center rounded-2xl px-4.5 py-2.5 text-xs font-bold tracking-wider whitespace-nowrap uppercase transition-all ${
                      isActive ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="relative z-10">{genre.name[lang]}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeGenreBackground"
                        className="bg-primary-600 absolute inset-0 rounded-2xl"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
            {canScrollRight ? (
              <button
                type="button"
                onClick={() => scrollByPage('right')}
                aria-label={t('a11y.scrollGenresRight')}
                className="text-primary-600 hover:bg-primary-50 focus:ring-primary-500 flex min-h-[38px] min-w-[38px] shrink-0 items-center justify-center self-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/80 transition focus:ring-2 focus:outline-none"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => {
              const isActive = selectedStatus === option.value
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`min-h-[38px] rounded-2xl px-4.5 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 ring-primary-200 ring-1'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              {sortedAndFilteredWebtoons.length} {t('categories.webtoons')}
            </h2>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex min-h-[44px] items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4.5 py-2.5 text-xs font-bold tracking-wider text-gray-800 uppercase shadow-sm transition-all hover:bg-gray-50"
              >
                <ListFilter className="text-primary-500 h-4.5 w-4.5" />
                <span>{activeSortLabel}</span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isDropdownOpen && (
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setIsDropdownOpen(false)}
                />
              )}

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
                  >
                    <div className="space-y-1">
                      {sortOptions.map((option) => {
                        const isSelected = sortBy === option.value
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSortChange(option.value)}
                            className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-left text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span>{option.label}</span>
                            {isSelected && (
                              <Check className="text-primary-600 h-4 w-4 stroke-[3]" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {sortedAndFilteredWebtoons.map((webtoon, index) => (
              <motion.div
                key={webtoon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
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
                    imageFailed={failedImages.has(webtoon.id)}
                    onImageError={() => handleImageError(webtoon.id)}
                    extraBadge={
                      webtoon.isPremium ? (
                        <span className="bg-accent-600 text-2xs absolute top-2 right-2 z-10 rounded-2xl px-2 py-0.5 font-bold text-white uppercase shadow-sm">
                          {t('webtoon.premium')}
                        </span>
                      ) : null
                    }
                    overlay={statusBadge(webtoon)}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {sortedAndFilteredWebtoons.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm font-bold text-gray-500">{t('categories.noWebtoons')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default CategoriesPage
