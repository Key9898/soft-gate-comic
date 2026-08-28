import { useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  ListFilter,
  ListOrdered,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import GenreRailChevron from '../../../components/GenreRailChevron'
import {
  Skeleton,
  SkeletonBookCard,
  SkeletonSection,
  SkeletonText,
} from '../../../components/Skeleton'
import SearchAutocomplete from '../../../components/SearchAutocomplete'
import SEO from '../../../components/SEO/SEO'
import {
  addRecentSearch,
  clearRecentSearches,
  DEMO_SEARCH_CHIPS,
  getRecentSearches,
  type WebtoonSortBy,
} from '../../../lib/search'
import { DISCOVERY_RAIL_CAP } from '../../../lib/catalog'
import {
  SEARCH_DESTINATIONS,
  SEARCH_DEST_LINK,
  SEARCH_PAGE_ICON_CLASS,
  SEARCH_PAGE_INPUT_CLASS,
} from '../searchDestinations'
import {
  applySearchGenre,
  applySearchSort,
  applySearchStatus,
  applySearchTab,
  parseSearchGenre,
  parseSearchQuery,
  parseSearchSort,
  parseSearchStatus,
  parseSearchTab,
  SEARCH_TABS,
  type SearchTab,
  type StatusFilter,
} from '../searchParams'

const GENRE_SKELETON_CAP = 8
const QUERY_WEBTOON_CARD_CAP = 12
const QUERY_HIT_ROW_CAP = 6

const CATALOG_GRID =
  'grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'

const LANDING_RAIL_GRID =
  'grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'

const LandingRailBones = ({
  title,
  icon,
  viewAllTo,
}: {
  title: string
  icon: ReactNode
  viewAllTo: string
}) => {
  const { t } = useTranslation()
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
          </div>
          <Link
            to={viewAllTo}
            className="text-primary-600 hover:text-primary-700 focus:ring-primary-500 flex min-h-[44px] shrink-0 items-center gap-1 rounded-2xl px-3 py-2 font-medium transition focus:ring-2 focus:outline-none"
          >
            {t('common.viewAll')}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <SkeletonSection>
          <div className={LANDING_RAIL_GRID}>
            {Array.from({ length: DISCOVERY_RAIL_CAP }, (_, i) => (
              <SkeletonBookCard key={i} />
            ))}
          </div>
        </SkeletonSection>
      </div>
    </section>
  )
}

const QuerySkeleton = ({ tab: tabFallback = 'webtoons' }: { tab?: SearchTab }) => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isSortOpen, setIsSortOpen] = useState(false)

  const query = parseSearchQuery(searchParams)
  const tab = searchParams.has('tab') ? parseSearchTab(searchParams) : tabFallback
  const status = parseSearchStatus(searchParams)
  const genre = parseSearchGenre(searchParams)
  const sortBy = parseSearchSort(searchParams)

  const patchSearchParams = (mutate: (params: URLSearchParams) => void) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        mutate(next)
        return next
      },
      { replace: true }
    )
  }

  const sortOptions: { value: WebtoonSortBy; label: string }[] = [
    { value: 'popular', label: t('search.filters.sortPopular') },
    { value: 'latest', label: t('search.filters.sortLatest') },
    { value: 'rating', label: t('search.filters.sortRating') },
    { value: 'title', label: t('search.filters.sortTitle') },
  ]

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: t('search.filters.allStatuses') },
    { value: 'ongoing', label: t('search.filters.ongoing') },
    { value: 'completed', label: t('search.filters.completed') },
    { value: 'hiatus', label: t('search.filters.hiatus') },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={query ? t('search.resultsFor', { query }) : t('search.title')}
        description={t('search.seoDescription')}
        path="/search"
      />
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">{t('search.title')}</h1>
          <div className="relative mx-auto max-w-2xl">
            <SearchAutocomplete
              className="w-full"
              defaultQuery={query}
              inputClassName={SEARCH_PAGE_INPUT_CLASS}
              iconClassName={SEARCH_PAGE_ICON_CLASS}
            />
            {query ? (
              <button
                type="button"
                title={t('common.close')}
                aria-label={t('common.close')}
                onClick={() => setSearchParams({})}
                className="absolute top-1/2 right-4 z-10 -translate-y-1/2 p-1 text-gray-400 transition hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 pb-3">
            {SEARCH_TABS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => patchSearchParams((params) => applySearchTab(params, key))}
                className={`min-h-11 rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  tab === key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t(`search.tabs.${key}`)}
              </button>
            ))}
          </div>

          {tab === 'webtoons' ? (
            <div className="mb-6 space-y-3">
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => {
                  const isActive = status === option.value
                  return (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() =>
                        patchSearchParams((params) => applySearchStatus(params, option.value))
                      }
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
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => patchSearchParams((params) => applySearchGenre(params, ''))}
                  className={`min-h-[38px] rounded-2xl px-4.5 py-2.5 text-xs font-bold transition-all ${
                    !genre
                      ? 'bg-primary-50 text-primary-700 ring-primary-200 ring-1'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {t('search.filters.allGenres')}
                </button>
                <SkeletonSection>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: GENRE_SKELETON_CAP }, (_, i) => (
                      <Skeleton key={i} className="min-h-[38px] w-20" />
                    ))}
                  </div>
                </SkeletonSection>
              </div>
              <div className="relative flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsSortOpen((open) => !open)}
                  className="flex min-h-[44px] items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4.5 py-2.5 text-xs font-bold tracking-wider text-gray-800 uppercase shadow-sm transition-all hover:bg-gray-50"
                >
                  <ListFilter className="text-primary-500 h-4.5 w-4.5" />
                  <span>{sortOptions.find((o) => o.value === sortBy)?.label}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isSortOpen ? (
                  <div className="absolute right-0 z-20 mt-12 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setIsSortOpen(false)
                          patchSearchParams((params) => applySearchSort(params, option.value))
                        }}
                        className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-left text-xs font-bold ${
                          sortBy === option.value
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{option.label}</span>
                        {sortBy === option.value ? (
                          <Check className="text-primary-600 h-4 w-4 stroke-[3]" />
                        ) : null}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {query ? (
            <h2 className="mb-6 text-lg font-semibold text-gray-900">
              {t('search.resultsFor', { query })}
            </h2>
          ) : (
            <Skeleton className="mb-6 h-6 w-64 rounded-lg" />
          )}

          <SkeletonSection>
            {tab === 'webtoons' ? (
              <div className={CATALOG_GRID}>
                {Array.from({ length: QUERY_WEBTOON_CARD_CAP }, (_, i) => (
                  <SkeletonBookCard key={i} />
                ))}
              </div>
            ) : null}

            {tab === 'authors' ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: QUERY_HIT_ROW_CAP }, (_, i) => (
                  <div
                    key={i}
                    className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-4"
                  >
                    <Skeleton className="shape-circle h-12 w-12 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <SkeletonText className="w-2/3" />
                      <SkeletonText className="mt-2 h-3 w-full" />
                      <SkeletonText className="mt-2 h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {tab === 'episodes' ? (
              <div className="space-y-3">
                {Array.from({ length: QUERY_HIT_ROW_CAP }, (_, i) => (
                  <div
                    key={i}
                    className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-4"
                  >
                    <Skeleton className="aspect-[202/142] w-20 shrink-0 rounded-2xl sm:w-24" />
                    <div className="min-w-0 flex-1">
                      <SkeletonText className="h-3 w-1/3" />
                      <SkeletonText className="mt-2 w-2/3" />
                      <SkeletonText className="mt-2 h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </SkeletonSection>
        </div>
      </section>
    </div>
  )
}

const LandingSkeleton = () => {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language === 'mm' ? 'mm' : 'en') as 'mm' | 'en'
  const [, setSearchParams] = useSearchParams()
  const [recent, setRecent] = useState<string[]>(() => getRecentSearches())

  const applySearch = (term: string) => {
    const q = term.trim()
    if (!q) return
    addRecentSearch(q)
    setRecent(getRecentSearches())
    setSearchParams({ q })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title={t('search.title')} description={t('search.seoDescription')} path="/search" />
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">{t('search.title')}</h1>
          <div className="relative mx-auto max-w-2xl">
            <SearchAutocomplete
              className="w-full"
              inputClassName={SEARCH_PAGE_INPUT_CLASS}
              iconClassName={SEARCH_PAGE_ICON_CLASS}
            />
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="mb-1 flex items-center gap-2">
              <Search className="h-5 w-5 text-gray-500" aria-hidden />
              <h2 className="text-lg font-semibold text-gray-900">{t('search.demoSearches')}</h2>
            </div>
            <p className="mb-4 text-sm text-gray-500">{t('search.demoSearchesDesc')}</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_SEARCH_CHIPS.map((chip) => {
                const term = chip[lang]
                return (
                  <button
                    type="button"
                    key={chip.en}
                    onClick={() => applySearch(term)}
                    className="hover:border-primary-300 focus-visible:ring-primary-500 min-h-11 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {term}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('search.browseGenres')}</h2>
          </div>
          <SkeletonSection className="mb-8">
            <div className="flex items-center gap-2">
              <div className="scrollbar-hide flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain">
                {Array.from({ length: GENRE_SKELETON_CAP }, (_, i) => (
                  <Skeleton key={i} className="min-h-11 w-24 shrink-0" />
                ))}
              </div>
              <GenreRailChevron enabled={false} size="sm" />
            </div>
          </SkeletonSection>

          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('search.recentSearches')}
                </h2>
              </div>
              {recent.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    clearRecentSearches()
                    setRecent([])
                  }}
                  className="text-primary-600 hover:bg-primary-50 min-h-11 rounded-2xl px-3 text-sm font-semibold"
                >
                  {t('search.clearRecent')}
                </button>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {recent.length === 0 ? (
                <p className="text-sm text-gray-400">{t('search.noRecent')}</p>
              ) : (
                recent.map((term) => (
                  <button
                    type="button"
                    key={term}
                    onClick={() => applySearch(term)}
                    className="min-h-11 rounded-2xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                  >
                    {term}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 w-full">
            <h2 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
              {t('notFound.goHere')}
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {SEARCH_DESTINATIONS.map((item) => (
                <Link key={item.to} to={item.to} className={SEARCH_DEST_LINK}>
                  <item.icon className="text-primary-500 h-4 w-4" aria-hidden />
                  {t(item.labelKey)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LandingRailBones
        title={t('home.ranking')}
        icon={<ListOrdered className="text-primary-600 h-6 w-6" />}
        viewAllTo="/ranking"
      />
      <LandingRailBones
        title={t('home.newReleases')}
        icon={<Sparkles className="text-primary-600 h-6 w-6" />}
        viewAllTo="/categories?sort=new"
      />
    </div>
  )
}

const SearchPageSkeleton = ({
  hasQuery = false,
  tab = 'webtoons',
}: {
  hasQuery?: boolean
  tab?: SearchTab
}) => (hasQuery ? <QuerySkeleton tab={tab} /> : <LandingSkeleton />)

export default SearchPageSkeleton
