import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Eye, TrendingUp, Sparkles, ChevronDown, Check, ListFilter } from 'lucide-react'
import Card from '../../components/Card'
import { useData } from '../../context/DataContext'
import { formatCount } from '../../lib/utils/formatters'

type SortOption = 'popular' | 'new' | 'recentlyUpdated' | 'highestRated'

const CategoriesPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'

  const { webtoons, genres, isLoading } = useData()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleImageError = (id: string) => {
    setFailedImages((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  // Read genre from URL (source of truth)
  const genreFromUrl = searchParams.get('genre') || 'all'
  const selectedGenre = genreFromUrl

  const sortFromUrl = searchParams.get('sort') as SortOption | null
  const [sortBy, setSortBy] = useState<SortOption>(sortFromUrl || 'popular')

  useEffect(() => {
    if (sortFromUrl) {
      setSortBy(sortFromUrl as SortOption)
    }
  }, [sortFromUrl])

  const handleSortChange = (value: SortOption) => {
    setSortBy(value)
    setSearchParams({ ...Object.fromEntries(searchParams.entries()), sort: value })
    setIsDropdownOpen(false)
  }

  // Get the Myanmar genre name from the selected slug
  const selectedGenreName = useMemo(() => {
    const genre = genres.find((g) => g.slug === selectedGenre)
    return genre?.name[lang] || ''
  }, [selectedGenre, lang])

  const handleGenreChange = (slug: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (slug === 'all') {
      newParams.delete('genre')
    } else {
      newParams.set('genre', slug)
    }
    setSearchParams(newParams)
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

  const sortedAndFilteredWebtoons = useMemo(() => {
    let result = webtoons.filter((webtoon) => {
      const matchesGenre = selectedGenre === 'all' || webtoon.genres.includes(selectedGenreName)
      const matchesSearch =
        webtoon.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        webtoon.author.name[lang].toLowerCase().includes(searchQuery.toLowerCase())
      return matchesGenre && (searchQuery === '' || matchesSearch)
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
  }, [selectedGenre, selectedGenreName, searchQuery, sortBy, lang])

  const PageIcon = getPageIcon()

  const sortOptions = [
    { value: 'popular' as SortOption, label: t('categories.mostPopular') },
    { value: 'new' as SortOption, label: t('home.newReleases') },
    { value: 'recentlyUpdated' as SortOption, label: t('categories.recentlyUpdated') },
    { value: 'highestRated' as SortOption, label: t('categories.highestRated') },
  ]

  const activeSortLabel =
    sortOptions.find((o) => o.value === sortBy)?.label || t('categories.mostPopular')

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="border-primary-600 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
      {/* HEADER SECTION PANEL */}
      <section className="border-b border-gray-200 bg-white transition-colors duration-300 dark:border-white/5 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            {PageIcon && <PageIcon className="text-primary-600 dark:text-primary-400 h-8 w-8" />}
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl dark:text-white">
              {getPageTitle()}
            </h1>
          </div>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder={t('search.placeholder')}
              aria-label={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus:ring-primary-500 dark:focus:ring-primary-500 w-full rounded-2xl border-none bg-gray-100 py-3 pr-4 pl-10 text-sm font-bold text-gray-950 transition placeholder:text-gray-400 focus:bg-white focus:ring-2 dark:bg-white/5 dark:text-white dark:focus:bg-gray-900"
            />
            <Search className="absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>

          {/* Genre pills list with gliding indicators */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {genres.map((genre) => {
              const isActive = selectedGenre === genre.slug
              return (
                <button
                  type="button"
                  key={genre.id}
                  onClick={() => handleGenreChange(genre.slug)}
                  className={`relative flex min-h-[38px] items-center justify-center rounded-full px-4.5 py-2.5 text-xs font-black tracking-wider uppercase transition-all ${
                    isActive
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10'
                  }`}
                >
                  <span className="relative z-10">{genre.name[lang]}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeGenreBackground"
                      className="bg-primary-600 dark:bg-primary-500 absolute inset-0 rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* WEBTOONS GRID SECTION */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
              {sortedAndFilteredWebtoons.length} {t('categories.webtoons')}
            </h2>

            {/* CUSTOM PREMIUM POP-OVER DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex min-h-[44px] items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4.5 py-2.5 text-xs font-black tracking-wider text-gray-800 uppercase shadow-sm transition-all hover:bg-gray-50 dark:border-white/5 dark:bg-gray-900 dark:text-white dark:hover:bg-white/5"
              >
                <ListFilter className="text-primary-500 h-4.5 w-4.5" />
                <span>{activeSortLabel}</span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Popover screen-blocker click listener */}
              {isDropdownOpen && (
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setIsDropdownOpen(false)}
                />
              )}

              {/* Dropdown Options floating menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-xl dark:border-white/5 dark:bg-gray-900"
                  >
                    <div className="space-y-1">
                      {sortOptions.map((option) => {
                        const isSelected = sortBy === option.value
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSortChange(option.value)}
                            className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/20 dark:text-primary-400'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5'
                            }`}
                          >
                            <span>{option.label}</span>
                            {isSelected && (
                              <Check className="text-primary-600 dark:text-primary-400 h-4 w-4 stroke-[3]" />
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

          {/* Webtoons grid layout */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {sortedAndFilteredWebtoons.map((webtoon, index) => (
              <motion.div
                key={webtoon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <Link to={`/webtoon/${webtoon.id}`}>
                  <Card
                    variant="interactive"
                    padding="none"
                    className="overflow-hidden border dark:border-white/5 dark:bg-gray-900"
                  >
                    <div
                      className={`aspect-[3/4] ${webtoon.coverColor} relative flex items-center justify-center`}
                    >
                      {webtoon.coverImage && !failedImages.has(webtoon.id) ? (
                        <img
                          src={webtoon.coverImage}
                          alt={webtoon.title[lang]}
                          onError={() => handleImageError(webtoon.id)}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <span className="text-xs font-bold text-white/60">Cover</span>
                      )}
                      {webtoon.isPremium && (
                        <span className="bg-accent-600 absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-black text-white uppercase shadow-sm">
                          {t('webtoon.premium')}
                        </span>
                      )}
                    </div>
                    <div className="p-3.5">
                      <h3 className="truncate text-sm font-extrabold text-gray-900 dark:text-white">
                        {webtoon.title[lang]}
                      </h3>
                      <p className="mt-0.5 truncate text-xs font-bold text-gray-400 dark:text-gray-500">
                        {webtoon.genres[0]}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{formatCount(webtoon.viewCount)}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {sortedAndFilteredWebtoons.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                {t('categories.noWebtoons')}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default CategoriesPage
