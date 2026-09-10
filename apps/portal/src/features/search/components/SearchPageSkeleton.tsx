import { useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Check,
  ChevronDown,
  Clock,
  ListFilter,
  ListOrdered,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import CatalogBusyPanel from '../../../components/CatalogBusyPanel'
import { SkeletonSection } from '../../../components/Skeleton'
import SearchAutocomplete from '../../../components/SearchAutocomplete'
import SEO from '../../../components/SEO/SEO'
import {
  addRecentSearch,
  clearRecentSearches,
  DEMO_SEARCH_CHIPS,
  getRecentSearches,
  type WebtoonSortBy,
} from '../../../lib/search'
import { SEARCH_PAGE_ICON_CLASS, SEARCH_PAGE_INPUT_CLASS } from '../searchDestinations'
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

const LandingRail = ({ title, icon }: { title: string; icon: ReactNode }) => (
  <section className="py-8">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
      </div>
      <SkeletonSection>
        <CatalogBusyPanel />
      </SkeletonSection>
    </div>
  </section>
)

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

          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            {t('search.resultsFor', { query })}
          </h2>

          <SkeletonSection>
            <CatalogBusyPanel />
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
            <CatalogBusyPanel />
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
        </div>
      </section>

      <LandingRail
        title={t('home.ranking')}
        icon={<ListOrdered className="text-primary-600 h-6 w-6" />}
      />
      <LandingRail
        title={t('home.newReleases')}
        icon={<Sparkles className="text-primary-600 h-6 w-6" />}
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
