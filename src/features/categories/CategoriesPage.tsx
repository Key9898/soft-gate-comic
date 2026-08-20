import { useState, useEffect, useMemo, useId, useRef } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ListOrdered,
  Clock,
  Sparkles,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  ListFilter,
  LayoutGrid,
} from 'lucide-react'
import type { Webtoon } from '@softgate/shared'
import { CatalogBookCard } from '../../components/BookCard'
import SearchAutocomplete from '../../components/SearchAutocomplete'
import SEO from '../../components/SEO/SEO'
import { buildItemListJsonLd, SITE_URL } from '../../components/SEO/jsonLd'
import { useData } from '../../context/DataContext'
import { useOverflowScrollX } from '../../hooks/useOverflowScrollX'
import {
  capRankingList,
  catalogHref,
  canonicalizeBrowseLocation,
  clampPage,
  locationsEqual,
  newestPublishedIds,
  pageCount,
  pageSlice,
  parsePage,
  rankOnPage,
  showPager,
  type CatalogSort,
} from '../../lib/catalog'
import { webtoonMatchesGenre } from '../../lib/categories'
import NotFoundPage from '../info/NotFoundPage'
import CategoriesPageSkeleton from './components/CategoriesPageSkeleton'

type StatusFilter = 'all' | 'ongoing' | 'completed' | 'hiatus'

const DEST_LINK =
  'hover:border-primary-300 focus-visible:ring-primary-500 flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors focus-visible:ring-2 focus-visible:outline-none'

const DESTINATIONS = [
  { to: '/categories', labelKey: 'nav.categories', icon: LayoutGrid },
  { to: '/ranking', labelKey: 'home.ranking', icon: ListOrdered },
  { to: '/categories?sort=new', labelKey: 'home.newReleases', icon: Sparkles },
] as const

const isCatalogSort = (value: string | null): value is Exclude<CatalogSort, 'browse'> =>
  value === 'popular' || value === 'new' || value === 'recentlyUpdated' || value === 'highestRated'

const CategoriesPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'
  const navigate = useNavigate()
  const location = useLocation()
  const { slug: pathSlug } = useParams<{ slug?: string }>()
  const sortMenuId = useId()
  const sortButtonRef = useRef<HTMLButtonElement>(null)

  const { webtoons, genres, isLoading } = useData()
  const [searchParams] = useSearchParams()
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const {
    ref: genreScrollRef,
    canScrollRight,
    update: updateGenreScroll,
    scrollByPage,
  } = useOverflowScrollX()

  const canonical = useMemo(
    () => canonicalizeBrowseLocation(location.pathname, searchParams),
    [location.pathname, searchParams]
  )
  const urlIsCanonical = locationsEqual(location.pathname, location.search, canonical)

  useEffect(() => {
    if (urlIsCanonical) return
    navigate(`${canonical.pathname}${canonical.search}`, { replace: true })
  }, [canonical.pathname, canonical.search, navigate, urlIsCanonical])

  const isRanking = location.pathname === '/ranking'
  const sortFromUrl = searchParams.get('sort')
  const effectiveSort: CatalogSort = isRanking
    ? 'popular'
    : isCatalogSort(sortFromUrl)
      ? sortFromUrl
      : 'browse'
  const showRanks = effectiveSort === 'popular'
  const selectedGenre = pathSlug && pathSlug !== 'all' ? pathSlug : 'all'
  const selectedStatus = (searchParams.get('status') as StatusFilter | null) || 'all'
  const unknownGenre =
    Boolean(pathSlug) &&
    pathSlug !== 'all' &&
    !isLoading &&
    genres.length > 0 &&
    !genres.some((genre) => genre.slug === pathSlug)

  const handleImageError = (id: string) => {
    setFailedImages((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const goTo = (href: string) => {
    setIsDropdownOpen(false)
    navigate(href)
  }

  const handleSortChange = (value: CatalogSort) => {
    goTo(catalogHref({ sort: value, genreSlug: selectedGenre, status: selectedStatus }))
  }

  const handleGenreChange = (slug: string) => {
    goTo(catalogHref({ sort: effectiveSort, genreSlug: slug, status: selectedStatus }))
  }

  useEffect(() => {
    updateGenreScroll()
  }, [genres, selectedGenre, updateGenreScroll])

  const handleStatusChange = (status: StatusFilter) => {
    goTo(catalogHref({ sort: effectiveSort, genreSlug: selectedGenre, status }))
  }

  const clearFilters = () => {
    navigate('/categories')
  }

  const getPageTitle = () => {
    if (effectiveSort === 'popular') return t('home.ranking')
    if (effectiveSort === 'new') return t('home.newReleases')
    if (effectiveSort === 'recentlyUpdated') return t('categories.recentlyUpdated')
    if (effectiveSort === 'highestRated') return t('categories.highestRated')
    const genreRecord =
      selectedGenre !== 'all' ? genres.find((g) => g.slug === selectedGenre) : undefined
    if (genreRecord) return genreRecord.name[lang]
    return t('categories.browseByGenre')
  }

  const getDeck = () => {
    if (effectiveSort === 'popular') return t('home.rankingDesc')
    if (effectiveSort === 'new') return t('home.newReleasesDesc')
    if (effectiveSort === 'recentlyUpdated') return t('home.updatedDesc')
    if (effectiveSort === 'highestRated') return t('categories.highestRatedDesc')
    return t('categories.browseDesc')
  }

  const getPageIcon = () => {
    if (effectiveSort === 'popular') return ListOrdered
    if (effectiveSort === 'new') return Sparkles
    if (effectiveSort === 'recentlyUpdated') return Clock
    if (effectiveSort === 'highestRated') return Star
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

      return matchesGenre && matchesStatus
    })

    switch (effectiveSort) {
      case 'popular':
      case 'browse':
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
          const dateB = new Date(b.updatedAt || a.createdAt).getTime()
          return dateB - dateA
        })
        break
      case 'highestRated':
        result = result.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }

    return showRanks ? capRankingList(result) : result
  }, [webtoons, genres, selectedGenre, selectedStatus, effectiveSort, showRanks])

  const pagerVisible = showPager(sortedAndFilteredWebtoons.length)
  const rawPage = parsePage(searchParams)
  const currentPage = pagerVisible ? clampPage(rawPage, sortedAndFilteredWebtoons.length) : 1
  const totalPages = pageCount(sortedAndFilteredWebtoons.length)
  const pagedWebtoons = pagerVisible
    ? pageSlice(sortedAndFilteredWebtoons, currentPage)
    : sortedAndFilteredWebtoons

  useEffect(() => {
    if (!urlIsCanonical || isLoading || unknownGenre) return
    const next = new URLSearchParams(searchParams)
    let changed = false
    if (!pagerVisible && next.has('page')) {
      next.delete('page')
      changed = true
    }
    if (pagerVisible) {
      if (currentPage === 1 && next.has('page')) {
        next.delete('page')
        changed = true
      } else if (currentPage > 1 && next.get('page') !== String(currentPage)) {
        next.set('page', String(currentPage))
        changed = true
      }
    }
    if (!changed) return
    const search = next.toString()
    navigate({ pathname: location.pathname, search: search ? `?${search}` : '' }, { replace: true })
  }, [
    currentPage,
    isLoading,
    location.pathname,
    navigate,
    pagerVisible,
    searchParams,
    unknownGenre,
    urlIsCanonical,
  ])

  useEffect(() => {
    if (!isDropdownOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsDropdownOpen(false)
      sortButtonRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isDropdownOpen])

  const newestIds = useMemo(() => newestPublishedIds(webtoons), [webtoons])

  const PageIcon = getPageIcon()
  const pageTitle = getPageTitle()
  const deck = getDeck()

  const countLine = useMemo(() => {
    const parts = [`${sortedAndFilteredWebtoons.length} ${t('categories.webtoons')}`]
    if (selectedGenre !== 'all') {
      const genreRecord = genres.find((g) => g.slug === selectedGenre)
      if (genreRecord) parts.push(genreRecord.name[lang])
    }
    if (selectedStatus === 'ongoing') parts.push(t('categories.statusOngoing'))
    if (selectedStatus === 'completed') parts.push(t('categories.statusCompleted'))
    if (selectedStatus === 'hiatus') parts.push(t('categories.statusHiatus'))
    return parts.join(' · ')
  }, [sortedAndFilteredWebtoons.length, selectedGenre, selectedStatus, genres, lang, t])

  const sortOptions: { value: CatalogSort; label: string }[] = [
    { value: 'browse', label: t('categories.sortBrowse') },
    { value: 'popular', label: t('home.ranking') },
    { value: 'new', label: t('home.newReleases') },
    { value: 'recentlyUpdated', label: t('categories.recentlyUpdated') },
    { value: 'highestRated', label: t('categories.highestRated') },
  ]

  const activeSortLabel =
    sortOptions.find((o) => o.value === effectiveSort)?.label || t('categories.sortBrowse')

  const canonicalUrl = useMemo(() => {
    const params = new URLSearchParams()
    if (!isRanking && isCatalogSort(sortFromUrl)) params.set('sort', sortFromUrl)
    if (pagerVisible && currentPage > 1) params.set('page', String(currentPage))
    const query = params.toString()
    return `${SITE_URL}${location.pathname}${query ? `?${query}` : ''}`
  }, [currentPage, isRanking, location.pathname, pagerVisible, sortFromUrl])

  const itemListJsonLd = useMemo(() => {
    if (!showRanks) return undefined
    return buildItemListJsonLd({
      name: pageTitle,
      url: canonicalUrl,
      items: pagedWebtoons.map((webtoon, index) => ({
        name: webtoon.title[lang],
        url: `${SITE_URL}/webtoon/${webtoon.id}`,
        position: rankOnPage(currentPage, index),
      })),
    })
  }, [canonicalUrl, currentPage, lang, pageTitle, pagedWebtoons, showRanks])

  const statusBadge = (webtoon: Webtoon) => {
    const corner = showRanks ? 'right-2' : 'left-2'
    if (webtoon.status === 'completed') {
      return (
        <span
          className={`text-2xs absolute bottom-2 z-10 rounded-2xl bg-gray-900/80 px-2 py-0.5 font-bold tracking-wider text-white uppercase ${corner}`}
        >
          {t('categories.statusCompleted')}
        </span>
      )
    }
    if (webtoon.status === 'hiatus') {
      return (
        <span
          className={`text-2xs absolute bottom-2 z-10 rounded-2xl bg-gray-500/90 px-2 py-0.5 font-bold tracking-wider text-white uppercase ${corner}`}
        >
          {t('categories.statusHiatus')}
        </span>
      )
    }
    return null
  }

  const goToPage = (page: number) => {
    goTo(
      catalogHref({
        sort: effectiveSort,
        genreSlug: selectedGenre,
        status: selectedStatus,
        page,
      })
    )
  }

  if (isLoading) {
    return <CategoriesPageSkeleton ranked={showRanks} />
  }

  if (unknownGenre) {
    return <NotFoundPage variant="genre" />
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300">
      <SEO title={pageTitle} description={deck} url={canonicalUrl} jsonLd={itemListJsonLd} />
      <section className="relative border-b border-gray-200 bg-white transition-colors duration-300">
        {showRanks ? (
          <div className="radial-wash-primary pointer-events-none absolute inset-0" aria-hidden />
        ) : null}
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {showRanks ? (
            <p className="text-primary-700 mb-1 text-xs font-semibold tracking-wide uppercase">
              {t('categories.rankingEyebrow')}
            </p>
          ) : null}
          <div className="mb-2 flex items-center gap-3">
            {PageIcon && <PageIcon className="text-primary-600 h-8 w-8" />}
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{pageTitle}</h1>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-gray-600">{deck}</p>
        </div>
      </section>

      <div
        data-testid="catalog-filter-band"
        className="sticky-below-nav overflow-visible border-b border-gray-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-2">
            <div
              ref={genreScrollRef}
              role="group"
              aria-label={t('home.genres')}
              className="scrollbar-hide flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain sm:gap-3"
            >
              {genres.map((genre) => {
                const isActive = selectedGenre === genre.slug
                return (
                  <button
                    type="button"
                    key={genre.id}
                    aria-pressed={isActive}
                    onClick={(e) => {
                      handleGenreChange(genre.slug)
                      e.currentTarget.scrollIntoView({
                        inline: 'nearest',
                        block: 'nearest',
                        behavior: 'smooth',
                      })
                    }}
                    className={`relative flex min-h-11 shrink-0 items-center justify-center rounded-2xl px-4.5 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
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
                className="text-primary-600 hover:bg-primary-50 focus:ring-primary-500 flex min-h-11 min-w-11 shrink-0 items-center justify-center self-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/80 transition focus:ring-2 focus:outline-none"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            ) : null}
          </div>

          <div
            className="mb-4 flex flex-wrap gap-2"
            role="group"
            aria-label={t('search.filters.status')}
          >
            {statusOptions.map((option) => {
              const isActive = selectedStatus === option.value
              return (
                <button
                  type="button"
                  key={option.value}
                  aria-pressed={isActive}
                  onClick={() => handleStatusChange(option.value)}
                  className={`min-h-11 rounded-2xl px-4.5 py-2.5 text-xs font-bold transition-all ${
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

          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">{countLine}</h2>

            <div className="relative">
              <button
                ref={sortButtonRef}
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-haspopup="menu"
                aria-expanded={isDropdownOpen}
                aria-controls={sortMenuId}
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
                  onClick={() => {
                    setIsDropdownOpen(false)
                    sortButtonRef.current?.focus()
                  }}
                />
              )}

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    id={sortMenuId}
                    role="menu"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
                  >
                    <div className="space-y-1">
                      {sortOptions.map((option) => {
                        const isSelected = effectiveSort === option.value
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="menuitem"
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
        </div>
      </div>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {showRanks ? (
            <ol className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {pagedWebtoons.map((webtoon, index) => {
                const rank = rankOnPage(currentPage, index)
                return (
                  <motion.li
                    key={webtoon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                  >
                    <Link
                      to={`/webtoon/${webtoon.id}`}
                      className="focus:ring-primary-500 block rounded-[3px] focus:ring-2 focus:ring-offset-2 focus:outline-none"
                      aria-label={`${rank}. ${webtoon.title[lang]}`}
                    >
                      <CatalogBookCard
                        webtoon={webtoon}
                        lang={lang}
                        genres={genres}
                        newestIds={newestIds}
                        imageFailed={failedImages.has(webtoon.id)}
                        onImageError={() => handleImageError(webtoon.id)}
                        rank={rank}
                        overlay={statusBadge(webtoon)}
                        dateKind="createdAt"
                      />
                    </Link>
                  </motion.li>
                )
              })}
            </ol>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {pagedWebtoons.map((webtoon, index) => (
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
                      overlay={statusBadge(webtoon)}
                      dateKind={effectiveSort === 'recentlyUpdated' ? 'updatedAt' : 'createdAt'}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {pagerVisible ? (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label={t('common.previous')}
                className="focus-visible:ring-primary-500 flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <p className="text-sm font-semibold text-gray-700">
                {t('categories.pageOf', { current: currentPage, total: totalPages })}
              </p>
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label={t('common.next')}
                className="focus-visible:ring-primary-500 flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
          ) : null}

          {sortedAndFilteredWebtoons.length === 0 && (
            <div className="mx-auto max-w-2xl py-12 text-center">
              <p className="text-sm font-bold text-gray-500">{t('categories.noWebtoons')}</p>
              <div className="mt-6">
                <SearchAutocomplete className="mx-auto max-w-md" />
              </div>
              <div className="mt-8 w-full text-left">
                <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                  {t('notFound.goHere')}
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {DESTINATIONS.map((item) => (
                    <Link key={item.to} to={item.to} className={DEST_LINK}>
                      <item.icon className="text-primary-500 h-4 w-4" aria-hidden />
                      {t(item.labelKey)}
                    </Link>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="hover:border-primary-300 focus-visible:ring-primary-500 mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                {t('categories.clearFilters')}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default CategoriesPage
