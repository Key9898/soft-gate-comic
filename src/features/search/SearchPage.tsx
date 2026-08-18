import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, X, TrendingUp, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CatalogBookCard } from '../../components/BookCard'
import SEO from '../../components/SEO/SEO'
import { useData } from '../../context/DataContext'
import {
  addRecentSearch,
  getRecentSearches,
  searchAuthors,
  searchEpisodes,
  searchWebtoons,
  type WebtoonSortBy,
} from '../../lib/search'
import { newestPublishedIds } from '../../lib/catalog'
import SearchPageSkeleton from './components/SearchPageSkeleton'

type SearchTab = 'webtoons' | 'authors' | 'episodes'
type StatusFilter = 'all' | 'ongoing' | 'completed' | 'hiatus'

const DEFAULT_SORT: WebtoonSortBy = 'popular'

const SearchPage = () => {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language === 'mm' ? 'mm' : 'en') as 'mm' | 'en'
  const navigate = useNavigate()
  const { webtoons, authors, episodes, genres, isLoading } = useData()
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') || ''
  const tab = (searchParams.get('tab') as SearchTab) || 'webtoons'
  const status = (searchParams.get('status') as StatusFilter | null) || 'all'
  const genre = searchParams.get('genre') || ''
  const sortFromUrl = searchParams.get('sort') as WebtoonSortBy | null
  const sortBy: WebtoonSortBy =
    sortFromUrl === 'latest' ||
    sortFromUrl === 'rating' ||
    sortFromUrl === 'title' ||
    sortFromUrl === 'popular'
      ? sortFromUrl
      : DEFAULT_SORT

  const [searchQuery, setSearchQuery] = useState(query)
  const [recent, setRecent] = useState<string[]>(() => getRecentSearches())

  useEffect(() => {
    setSearchQuery(query)
  }, [query])

  const trendingGenres = useMemo(() => genres.filter((g) => g.slug !== 'all').slice(0, 5), [genres])

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

  const authorHits = useMemo(
    () => (query.trim() ? searchAuthors(authors, query, lang) : []),
    [authors, query, lang]
  )

  const episodeHits = useMemo(
    () => (query.trim() ? searchEpisodes(episodes, webtoons, query, lang) : []),
    [episodes, webtoons, query, lang]
  )

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
    if (sortBy !== DEFAULT_SORT) params.set('sort', sortBy)
    setSearchParams(params)
  }

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    applySearch(searchQuery, tab)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchParams({})
  }

  const setActiveTab = (next: SearchTab) => {
    patchSearchParams((params) => {
      if (next === 'webtoons') params.delete('tab')
      else params.set('tab', next)
    })
  }

  const setStatusFilter = (next: StatusFilter) => {
    patchSearchParams((params) => {
      if (next === 'all') params.delete('status')
      else params.set('status', next)
    })
  }

  const setGenreFilter = (next: string) => {
    patchSearchParams((params) => {
      if (!next) params.delete('genre')
      else params.set('genre', next)
    })
  }

  const setSortFilter = (next: WebtoonSortBy) => {
    patchSearchParams((params) => {
      if (next === DEFAULT_SORT) params.delete('sort')
      else params.set('sort', next)
    })
  }

  if (isLoading) {
    return <SearchPageSkeleton />
  }

  const resultCount =
    tab === 'webtoons'
      ? webtoonHits.length
      : tab === 'authors'
        ? authorHits.length
        : episodeHits.length

  return (
    <>
      <SEO
        title={query ? t('search.resultsFor', { query }) : t('search.title')}
        description={t('search.seoDescription')}
        url="https://softgatecomic.com/search"
      />

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="sr-only">{t('nav.search')}</h1>
          <form onSubmit={handleSearch} className="relative mx-auto max-w-2xl">
            <input
              type="search"
              placeholder={t('search.placeholder')}
              aria-label={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus:ring-primary-500 w-full rounded-2xl border-none bg-gray-100 py-4 pr-12 pl-12 text-lg transition focus:bg-white focus:ring-2"
            />
            <Search
              className="absolute top-1/2 left-4 h-6 w-6 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            {searchQuery && (
              <button
                type="button"
                title={t('common.close')}
                aria-label={t('common.close')}
                onClick={clearSearch}
                className="absolute top-1/2 right-4 -translate-y-1/2 p-1 text-gray-400 transition hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </form>

          {query && (
            <div className="mx-auto mt-4 flex max-w-2xl flex-wrap gap-2">
              <select
                aria-label={t('search.filters.status')}
                value={status}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <option value="all">{t('search.filters.allStatuses')}</option>
                <option value="ongoing">{t('search.filters.ongoing')}</option>
                <option value="completed">{t('search.filters.completed')}</option>
                <option value="hiatus">{t('search.filters.hiatus')}</option>
              </select>
              <select
                aria-label={t('search.filters.genre')}
                value={genre}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">{t('search.filters.allGenres')}</option>
                {genres
                  .filter((g) => g.slug !== 'all')
                  .map((g) => (
                    <option key={g.id} value={g.slug}>
                      {g.name[lang]}
                    </option>
                  ))}
              </select>
              <select
                aria-label={t('search.filters.sort')}
                value={sortBy}
                onChange={(e) => setSortFilter(e.target.value as WebtoonSortBy)}
                className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <option value="popular">{t('search.filters.sortPopular')}</option>
                <option value="latest">{t('search.filters.sortLatest')}</option>
                <option value="rating">{t('search.filters.sortRating')}</option>
                <option value="title">{t('search.filters.sortTitle')}</option>
              </select>
            </div>
          )}
        </div>
      </section>

      {!query ? (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp className="text-primary-600 h-5 w-5" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t('search.trendingSearches')}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingGenres.map((g) => (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => navigate(`/categories/${g.slug}`)}
                      className="bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-2xl px-4 py-2 text-sm font-medium transition"
                    >
                      {g.name[lang]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t('search.recentSearches')}
                  </h2>
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
                        className="rounded-2xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                      >
                        {term}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
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
                  className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                    tab === key
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>

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
                        />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyQuery query={query} t={t} />
              ))}

            {tab === 'authors' &&
              (authorHits.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {authorHits.map((author) => (
                    <button
                      key={author.id}
                      type="button"
                      onClick={() => applySearch(author.name[lang], 'webtoons')}
                      className="hover:border-primary-300 rounded-2xl border border-gray-200 bg-white p-4 text-left transition hover:shadow-sm"
                    >
                      <p className="font-semibold text-gray-900">{author.name[lang]}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                        {author.bio?.[lang] || t('search.authorFallback')}
                      </p>
                      <p className="text-primary-600 mt-2 text-xs font-medium">
                        {author.webtoonCount} {t('search.tabs.webtoons')}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyQuery query={query} t={t} />
              ))}

            {tab === 'episodes' &&
              (episodeHits.length > 0 ? (
                <div className="space-y-3">
                  {episodeHits.map((hit) => (
                    <Link
                      key={hit.episode.id}
                      to={`/read/${hit.episode.webtoonId}/${hit.episode.episodeNumber}`}
                      className="hover:border-primary-300 block rounded-2xl border border-gray-200 bg-white p-4 transition hover:shadow-sm"
                    >
                      <p className="text-sm text-gray-500">{hit.episode.webtoonTitle[lang]}</p>
                      <p className="font-semibold text-gray-900">
                        Ep. {hit.episode.episodeNumber} — {hit.episode.title[lang]}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">{hit.snippet}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyQuery query={query} t={t} />
              ))}
          </div>
        </section>
      )}
    </>
  )
}

function EmptyQuery({ query, t }: { query: string; t: (key: string) => string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
      <p className="text-gray-500">{t('search.noResults')}</p>
      <p className="mt-1 text-sm text-gray-400">{query}</p>
    </div>
  )
}

export default SearchPage
