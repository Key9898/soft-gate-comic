import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, X, TrendingUp, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Card from '../../components/Card'
import { mockWebtoons, mockGenres } from '../../demo/mocks/data'

const SearchPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(query)

  const trendingSearches = mockGenres.slice(1, 6).map((g) => g.name[lang])
  const recentSearches = mockWebtoons.slice(0, 3).map((w) => w.title[lang])

  const searchResults = mockWebtoons.filter(
    (webtoon) =>
      webtoon.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
      webtoon.author.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
      webtoon.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery })
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchParams({})
  }

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="relative mx-auto max-w-2xl">
            <input
              type="text"
              placeholder={t('search.placeholder')}
              aria-label={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus:ring-primary-500 w-full rounded-2xl border-none bg-gray-100 py-4 pr-12 pl-12 text-lg transition focus:bg-white focus:ring-2"
            />
            <Search className="absolute top-1/2 left-4 h-6 w-6 -translate-y-1/2 text-gray-400" />
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
        </div>
      </section>

      {!searchQuery ? (
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
                  {trendingSearches.map((term) => (
                    <button
                      type="button"
                      key={term}
                      onClick={() => {
                        setSearchQuery(term)
                        setSearchParams({ q: term })
                      }}
                      className="bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-full px-4 py-2 text-sm font-medium transition"
                    >
                      {term}
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
                  {recentSearches.map((term) => (
                    <button
                      type="button"
                      key={term}
                      onClick={() => {
                        setSearchQuery(term)
                        setSearchParams({ q: term })
                      }}
                      className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">
              {searchResults.length} {t('search.resultsFor', { query: searchQuery })}
            </h2>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {searchResults.map((webtoon, index) => (
                  <motion.div
                    key={webtoon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                  >
                    <Link to={`/webtoon/${webtoon.id}`}>
                      <Card variant="interactive" padding="none" className="overflow-hidden">
                        <div
                          className={`aspect-[3/4] ${webtoon.coverColor} flex items-center justify-center`}
                        >
                          {webtoon.coverImage ? (
                            <img
                              src={webtoon.coverImage}
                              alt={webtoon.title[lang]}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm text-white/60">Cover</span>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="truncate text-sm font-semibold text-gray-900">
                            {webtoon.title[lang]}
                          </h3>
                          <p className="truncate text-xs text-gray-500">{webtoon.genres[0]}</p>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="mb-4 text-gray-500">
                  {t('search.noResults')} &quot;{searchQuery}&quot;
                </p>
                <p className="text-sm text-gray-400">{t('categories.noWebtoons')}</p>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}

export default SearchPage
