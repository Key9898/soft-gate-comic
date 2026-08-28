import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, type MotionProps } from 'framer-motion'
import {
  Check,
  ChevronDown,
  Clock,
  ListFilter,
  ListOrdered,
  Lock,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Genre, Webtoon } from '@softgate/shared'
import { CatalogBookCard } from '../../components/BookCard'
import GenreRailChevron from '../../components/GenreRailChevron'
import SearchAutocomplete from '../../components/SearchAutocomplete'
import SEO from '../../components/SEO/SEO'
import { useData } from '../../context/DataContext'
import { useWallet } from '../../context/WalletContext'
import { useOverflowScrollX } from '../../hooks/useOverflowScrollX'
import HomeCatalogRail from '../home/components/HomeCatalogRail'
import {
  addRecentSearch,
  clearRecentSearches,
  DEMO_SEARCH_CHIPS,
  getRecentSearches,
  searchAuthors,
  searchEpisodes,
  searchWebtoons,
  type WebtoonSortBy,
} from '../../lib/search'
import {
  episodeThumbSrc,
  newestPublishedIds,
  newReleaseWebtoons,
  rankingWebtoons,
} from '../../lib/catalog'
import SearchPageSkeleton from './components/SearchPageSkeleton'
import {
  SEARCH_DESTINATIONS,
  SEARCH_DEST_LINK,
  SEARCH_PAGE_ICON_CLASS,
  SEARCH_PAGE_INPUT_CLASS,
} from './searchDestinations'
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
  SEARCH_DEFAULT_SORT,
  type SearchTab,
  type StatusFilter,
} from './searchParams'

const SearchPage = () => {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language === 'mm' ? 'mm' : 'en') as 'mm' | 'en'
  const { webtoons, authors, episodes, genres, isLoading } = useData()
  const { isEpisodeUnlocked } = useWallet()
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    ref: genreScrollRef,
    canScrollRight,
    update: updateGenreScroll,
    scrollByPage,
  } = useOverflowScrollX()

  const query = parseSearchQuery(searchParams)
  const tab = parseSearchTab(searchParams)
  const status = parseSearchStatus(searchParams)
  const genre = parseSearchGenre(searchParams)
  const sortBy = parseSearchSort(searchParams)

  const [recent, setRecent] = useState<string[]>(() => getRecentSearches())
  const [isSortOpen, setIsSortOpen] = useState(false)
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

  const browseGenres = useMemo(() => genres.filter((g) => g.slug !== 'all'), [genres])

  const webtoonHits = useMemo(
    () =>
      searchWebtoons(webtoons, {
        q: query,
        status,
        genre: genre || undefined,
        genres,
        sortBy,
        lang,
      }),
    [webtoons, query, status, genre, genres, sortBy, lang]
  )

  const newestIds = useMemo(() => newestPublishedIds(webtoons), [webtoons])
  const popularRail = useMemo(() => rankingWebtoons(webtoons), [webtoons])
  const newRail = useMemo(() => newReleaseWebtoons(webtoons), [webtoons])
  const popularRecover = useMemo(() => rankingWebtoons(webtoons, 3), [webtoons])

  const authorHits = useMemo(
    () => (query.trim() ? searchAuthors(authors, query, lang) : []),
    [authors, query, lang]
  )

  const episodeHits = useMemo(
    () => (query.trim() ? searchEpisodes(episodes, webtoons, query, lang) : []),
    [episodes, webtoons, query, lang]
  )

  useEffect(() => {
    updateGenreScroll()
  }, [browseGenres, updateGenreScroll])

  const patchSearchParams = (
    mutate: (params: URLSearchParams) => void,
    options?: { replace?: boolean }
  ) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        mutate(next)
        return next
      },
      { replace: options?.replace ?? true }
    )
  }

  const applySearch = (term: string, nextTab: SearchTab = tab) => {
    const q = term.trim()
    const params = new URLSearchParams()
    if (q) {
      params.set('q', q)
      addRecentSearch(q)
      setRecent(getRecentSearches())
    }
    if (nextTab !== 'webtoons') params.set('tab', nextTab)
    if (status !== 'all') params.set('status', status)
    if (genre) params.set('genre', genre)
    if (sortBy !== SEARCH_DEFAULT_SORT) params.set('sort', sortBy)
    setSearchParams(params)
  }

  const clearSearch = () => {
    setSearchParams({})
  }

  const setActiveTab = (next: SearchTab) => {
    patchSearchParams((params) => {
      applySearchTab(params, next)
    })
  }

  const setStatusFilter = (next: StatusFilter) => {
    patchSearchParams((params) => {
      applySearchStatus(params, next)
    })
  }

  const setGenreFilter = (next: string) => {
    patchSearchParams((params) => {
      applySearchGenre(params, next)
    })
  }

  const setSortFilter = (next: WebtoonSortBy) => {
    setIsSortOpen(false)
    patchSearchParams((params) => {
      applySearchSort(params, next)
    })
  }

  const getAnimationProps = (
    initial: MotionProps['initial'],
    animate: MotionProps['animate'],
    transition: MotionProps['transition']
  ): MotionProps => ({ initial, animate, transition })

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

  if (isLoading) {
    return <SearchPageSkeleton hasQuery={Boolean(query)} tab={tab} />
  }

  const resultCount =
    tab === 'webtoons'
      ? webtoonHits.length
      : tab === 'authors'
        ? authorHits.length
        : episodeHits.length

  const recovery = (
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
  )

  return (
    <>
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
                onClick={clearSearch}
                className="absolute top-1/2 right-4 z-10 -translate-y-1/2 p-1 text-gray-400 transition hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {!query ? (
        <>
          <section className="py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <div className="mb-1 flex items-center gap-2">
                  <Search className="h-5 w-5 text-gray-500" aria-hidden />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t('search.demoSearches')}
                  </h2>
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
              <div className="mb-8 flex items-center gap-2">
                <div
                  ref={genreScrollRef}
                  className="scrollbar-hide flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain"
                >
                  {browseGenres.map((g) => (
                    <Link
                      key={g.id}
                      to={`/categories/${g.slug}`}
                      className="bg-primary-50 text-primary-700 hover:bg-primary-100 inline-flex min-h-11 shrink-0 items-center rounded-2xl px-4 py-2 text-sm font-medium transition"
                    >
                      {g.name[lang]}
                    </Link>
                  ))}
                </div>
                <GenreRailChevron
                  enabled={canScrollRight}
                  size="sm"
                  onClick={() => scrollByPage('right')}
                  label={t('a11y.scrollGenresRight')}
                />
              </div>

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
              {recovery}
            </div>
          </section>

          <HomeCatalogRail
            title={t('home.ranking')}
            icon={<ListOrdered className="text-primary-600 h-6 w-6" />}
            viewAllTo="/ranking"
            webtoons={popularRail}
            lang={lang}
            genres={genres}
            newestIds={newestIds}
            loadedImages={loadedImages}
            failedImages={failedImages}
            onImageLoad={handleImageLoad}
            onImageError={handleImageError}
            getAnimationProps={getAnimationProps}
            sectionClassName="py-8"
          />
          <HomeCatalogRail
            title={t('home.newReleases')}
            icon={<Sparkles className="text-primary-600 h-6 w-6" />}
            viewAllTo="/categories?sort=new"
            webtoons={newRail}
            lang={lang}
            genres={genres}
            newestIds={newestIds}
            loadedImages={loadedImages}
            failedImages={failedImages}
            onImageLoad={handleImageLoad}
            onImageError={handleImageError}
            getAnimationProps={getAnimationProps}
            sectionClassName="py-8"
          />
        </>
      ) : (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 pb-3">
              {(
                [
                  ['webtoons', t('search.tabs.webtoons'), webtoonHits.length],
                  ['authors', t('search.tabs.authors'), authorHits.length],
                  ['episodes', t('search.tabs.episodes'), episodeHits.length],
                ] as const
              ).map(([key, label, count]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`min-h-11 rounded-2xl px-4 py-2 text-sm font-medium transition ${
                    tab === key
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label} ({count})
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
                        onClick={() => setStatusFilter(option.value)}
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
                    onClick={() => setGenreFilter('')}
                    className={`min-h-[38px] rounded-2xl px-4.5 py-2.5 text-xs font-bold transition-all ${
                      !genre
                        ? 'bg-primary-50 text-primary-700 ring-primary-200 ring-1'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {t('search.filters.allGenres')}
                  </button>
                  {browseGenres.map((g) => {
                    const isActive = genre === g.slug
                    return (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => setGenreFilter(g.slug)}
                        className={`min-h-[38px] rounded-2xl px-4.5 py-2.5 text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 ring-primary-200 ring-1'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {g.name[lang]}
                      </button>
                    )
                  })}
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
                          onClick={() => setSortFilter(option.value)}
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
              {resultCount} {t('search.resultsFor', { query })}
            </h2>

            {tab === 'webtoons' &&
              (webtoonHits.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {webtoonHits.map((webtoon, index) => (
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
                          imageLoaded={loadedImages.has(webtoon.id)}
                          imageFailed={failedImages.has(webtoon.id)}
                          onImageLoad={() => handleImageLoad(webtoon.id)}
                          onImageError={() => handleImageError(webtoon.id)}
                        />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <SearchNoResults
                  query={query}
                  popular={popularRecover}
                  lang={lang}
                  genres={genres}
                  newestIds={newestIds}
                  loadedImages={loadedImages}
                  failedImages={failedImages}
                  onImageLoad={handleImageLoad}
                  onImageError={handleImageError}
                  recovery={recovery}
                />
              ))}

            {tab === 'authors' &&
              (authorHits.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {authorHits.map((author) => (
                    <Link
                      key={author.id}
                      to={`/author/${author.id}`}
                      className="hover:border-primary-300 flex min-h-11 gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-left transition hover:shadow-sm"
                    >
                      {author.avatar ? (
                        <img
                          src={author.avatar}
                          alt=""
                          className="shape-circle h-12 w-12 shrink-0 object-cover"
                        />
                      ) : (
                        <div className="bg-primary-50 text-primary-700 shape-circle flex h-12 w-12 shrink-0 items-center justify-center font-bold">
                          {author.name[lang].charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">{author.name[lang]}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                          {author.bio?.[lang] || t('search.authorFallback')}
                        </p>
                        <p className="text-primary-600 mt-2 text-xs font-medium">
                          {author.webtoonCount} {t('search.tabs.webtoons')}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <SearchNoResults
                  query={query}
                  popular={popularRecover}
                  lang={lang}
                  genres={genres}
                  newestIds={newestIds}
                  loadedImages={loadedImages}
                  failedImages={failedImages}
                  onImageLoad={handleImageLoad}
                  onImageError={handleImageError}
                  recovery={recovery}
                />
              ))}

            {tab === 'episodes' &&
              (episodeHits.length > 0 ? (
                <div className="space-y-3">
                  {episodeHits.map((hit) => {
                    const thumb = episodeThumbSrc(hit.episode, hit.webtoon?.coverImage)
                    const locked =
                      hit.episode.isPremium &&
                      !isEpisodeUnlocked(hit.episode.webtoonId, hit.episode.episodeNumber)
                    return (
                      <Link
                        key={hit.episode.id}
                        to={`/read/${hit.episode.webtoonId}/${hit.episode.episodeNumber}`}
                        className="hover:border-primary-300 flex gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition hover:shadow-sm"
                      >
                        <div className="relative w-20 shrink-0 sm:w-24">
                          <div className="aspect-[202/142] overflow-hidden rounded-2xl bg-gray-100">
                            {thumb ? (
                              <img src={thumb} alt="" className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                          {locked ? (
                            <span className="bg-accent-600/90 absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-2xl text-white">
                              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-gray-500">{hit.episode.webtoonTitle[lang]}</p>
                          <p className="font-semibold text-gray-900">
                            Ep. {hit.episode.episodeNumber} — {hit.episode.title[lang]}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">{hit.snippet}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <SearchNoResults
                  query={query}
                  popular={popularRecover}
                  lang={lang}
                  genres={genres}
                  newestIds={newestIds}
                  loadedImages={loadedImages}
                  failedImages={failedImages}
                  onImageLoad={handleImageLoad}
                  onImageError={handleImageError}
                  recovery={recovery}
                />
              ))}
          </div>
        </section>
      )}
    </>
  )
}

function SearchNoResults({
  query,
  popular,
  lang,
  genres,
  newestIds,
  loadedImages,
  failedImages,
  onImageLoad,
  onImageError,
  recovery,
}: {
  query: string
  popular: Webtoon[]
  lang: 'mm' | 'en'
  genres: Genre[]
  newestIds: Set<string>
  loadedImages: Set<string>
  failedImages: Set<string>
  onImageLoad: (id: string) => void
  onImageError: (id: string) => void
  recovery: ReactNode
}) {
  const { t } = useTranslation()
  return (
    <div>
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center">
        <p className="text-gray-500">{t('search.noResults')}</p>
        <p className="mt-1 text-sm text-gray-400">{query}</p>
      </div>
      <div className="mt-6">
        <SearchAutocomplete className="mx-auto max-w-md" />
      </div>
      {recovery}
      {popular.length > 0 ? (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('home.ranking')}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {popular.map((webtoon) => (
              <Link
                key={webtoon.id}
                to={`/webtoon/${webtoon.id}`}
                className="focus:ring-primary-500 block rounded-[3px] focus:ring-2 focus:outline-none"
              >
                <CatalogBookCard
                  webtoon={webtoon}
                  lang={lang}
                  genres={genres}
                  newestIds={newestIds}
                  imageLoaded={loadedImages.has(webtoon.id)}
                  imageFailed={failedImages.has(webtoon.id)}
                  onImageLoad={() => onImageLoad(webtoon.id)}
                  onImageError={() => onImageError(webtoon.id)}
                />
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default SearchPage
