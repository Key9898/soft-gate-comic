import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, ChevronDown, ListFilter } from 'lucide-react'
import GenreRailChevron from '../../../components/GenreRailChevron'
import SEO from '../../../components/SEO/SEO'
import {
  Skeleton,
  SkeletonBookCard,
  SkeletonSection,
  SkeletonText,
} from '../../../components/Skeleton'
import { catalogHref, PAGE_SIZE, rankOnPage, type CatalogSort } from '../../../lib/catalog'
import { getBrowseMasthead } from '../browseMasthead'

const GENRE_SKELETON_CAP = 8

const CATALOG_GRID =
  'grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'

type StatusFilter = 'all' | 'ongoing' | 'completed' | 'hiatus'

const CategoriesPageSkeleton = ({
  ranked = false,
  page = 1,
  sort = 'browse',
  status = 'all',
  genreSlug = 'all',
}: {
  ranked?: boolean
  page?: number
  sort?: CatalogSort
  status?: StatusFilter
  genreSlug?: string
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const sortMenuId = useId()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const isRanked = ranked || sort === 'popular'
  const mastheadSort: CatalogSort = isRanked ? 'popular' : sort
  const masthead = getBrowseMasthead({ sort: mastheadSort, genreSlug, t })
  const PageIcon = masthead.icon
  const seoTitle = masthead.title ?? t('categories.browseByGenre')

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: t('categories.statusAll') },
    { value: 'ongoing', label: t('categories.statusOngoing') },
    { value: 'completed', label: t('categories.statusCompleted') },
    { value: 'hiatus', label: t('categories.statusHiatus') },
  ]

  const sortOptions: { value: CatalogSort; label: string }[] = [
    { value: 'browse', label: t('categories.sortBrowse') },
    { value: 'popular', label: t('home.ranking') },
    { value: 'new', label: t('home.newReleases') },
    { value: 'recentlyUpdated', label: t('categories.recentlyUpdated') },
    { value: 'highestRated', label: t('categories.highestRated') },
  ]

  const activeSortLabel =
    sortOptions.find((option) => option.value === mastheadSort)?.label || t('categories.sortBrowse')

  const goTo = (href: string) => {
    setIsDropdownOpen(false)
    navigate(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title={seoTitle} description={masthead.deck} />
      <section className="relative border-b border-gray-200 bg-white">
        {isRanked ? (
          <div className="radial-wash-primary pointer-events-none absolute inset-0" aria-hidden />
        ) : null}
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {isRanked ? (
            <p className="text-primary-700 mb-1 text-xs font-semibold tracking-wide uppercase">
              {t('categories.rankingEyebrow')}
            </p>
          ) : null}
          <div className="mb-2 flex items-center gap-3">
            {PageIcon ? <PageIcon className="text-primary-600 h-8 w-8" /> : null}
            {masthead.title ? (
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{masthead.title}</h1>
            ) : (
              <Skeleton className="h-8 w-52 rounded-lg sm:h-9" />
            )}
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-gray-600">{masthead.deck}</p>
        </div>
      </section>

      <div
        data-testid="catalog-filter-band"
        className="sticky-below-nav overflow-visible border-b border-gray-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-2">
            <SkeletonSection className="min-w-0 flex-1">
              <div
                role="group"
                aria-label={t('home.genres')}
                className="scrollbar-hide flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain sm:gap-3"
              >
                {Array.from({ length: GENRE_SKELETON_CAP }, (_, i) => (
                  <Skeleton key={i} className="min-h-11 w-24 shrink-0" />
                ))}
              </div>
            </SkeletonSection>
            <GenreRailChevron enabled={false} size="md" />
          </div>

          <div
            className="mb-4 flex flex-wrap gap-2"
            role="group"
            aria-label={t('search.filters.status')}
          >
            {statusOptions.map((option) => {
              const isActive = status === option.value
              return (
                <button
                  type="button"
                  key={option.value}
                  aria-pressed={isActive}
                  onClick={() =>
                    goTo(catalogHref({ sort: mastheadSort, genreSlug, status: option.value }))
                  }
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
            <SkeletonText className="w-32" />

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((open) => !open)}
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

              {isDropdownOpen ? (
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setIsDropdownOpen(false)}
                />
              ) : null}

              {isDropdownOpen ? (
                <div
                  id={sortMenuId}
                  role="menu"
                  className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
                >
                  <div className="space-y-1">
                    {sortOptions.map((option) => {
                      const isSelected = mastheadSort === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="menuitem"
                          onClick={() =>
                            goTo(
                              catalogHref({
                                sort: option.value,
                                genreSlug,
                                status,
                              })
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-left text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-primary-50 text-primary-600'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span>{option.label}</span>
                          {isSelected ? (
                            <Check className="text-primary-600 h-4 w-4 stroke-[3]" />
                          ) : null}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SkeletonSection>
            <div className={CATALOG_GRID}>
              {Array.from({ length: PAGE_SIZE }, (_, i) => (
                <SkeletonBookCard key={i} rank={isRanked ? rankOnPage(page, i) : undefined} />
              ))}
            </div>
          </SkeletonSection>
        </div>
      </div>
    </div>
  )
}

export default CategoriesPageSkeleton
