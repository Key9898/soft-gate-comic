import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion, type MotionProps } from 'framer-motion'
import {
  Play,
  Bookmark,
  Share2,
  Star,
  Eye,
  Heart,
  ChevronRight,
  Check,
  Lock,
  ChevronDown,
  BookOpen,
  Sparkles,
  Filter,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/Button'
import Card from '../../components/Card'
import { useData } from '../../context/DataContext'
import { formatCount } from '../../lib/utils/formatters'

type EpisodeTab = 'all' | 'free' | 'premium'
type SortOrder = 'newest' | 'oldest'

const WebtoonDetailPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'
  const { id } = useParams()
  const prefersReducedMotion = useReducedMotion()

  const { webtoons, episodes, isLoading } = useData()
  const sortRef = useRef<HTMLDivElement>(null)

  // ── State ──────────────────────────────────────────────────
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<EpisodeTab>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  // ── Data ───────────────────────────────────────────────────
  const webtoon = webtoons.find((w) => w.id === id) || webtoons[0]

  const allEpisodes = useMemo(
    () => episodes.filter((e) => e.webtoonId === webtoon?.id),
    [webtoon?.id, episodes]
  )

  const readEpisodes = ['1', '2', '3']

  // ── Image handlers ─────────────────────────────────────────
  const handleImageLoad = (imgId: string) => {
    setLoadedImages((prev) => {
      const next = new Set(prev)
      next.add(imgId)
      return next
    })
  }
  const handleImageError = (imgId: string) => {
    setFailedImages((prev) => {
      const next = new Set(prev)
      next.add(imgId)
      return next
    })
  }

  // ── Close sort dropdown on outside click ───────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ── Filtered & sorted episodes ─────────────────────────────
  const filteredEpisodes = useMemo(() => {
    let eps = [...allEpisodes]
    if (activeTab === 'free') eps = eps.filter((e) => !e.isPremium)
    if (activeTab === 'premium') eps = eps.filter((e) => e.isPremium)
    eps.sort((a, b) =>
      sortOrder === 'newest' ? b.episodeNumber - a.episodeNumber : a.episodeNumber - b.episodeNumber
    )
    return eps
  }, [allEpisodes, activeTab, sortOrder])

  // ── Reduced motion helper (matches HomePage) ───────────────
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

  // ── Status badge config ────────────────────────────────────
  const statusConfig: Record<string, { label: string; className: string }> = {
    ongoing: {
      label: t('webtoonDetail.ongoing'),
      className: 'bg-emerald-400/20 text-emerald-300',
    },
    completed: {
      label: t('webtoonDetail.completed'),
      className: 'bg-sky-400/20 text-sky-300',
    },
    hiatus: {
      label: t('webtoonDetail.hiatus'),
      className: 'bg-amber-400/20 text-amber-300',
    },
    draft: {
      label: t('webtoonDetail.draft'),
      className: 'bg-gray-400/20 text-gray-300',
    },
  }
  const status = statusConfig[webtoon.status] || statusConfig.ongoing

  // ── Tab config ─────────────────────────────────────────────
  const tabs: { id: EpisodeTab; label: string; count: number }[] = [
    {
      id: 'all',
      label: t('webtoonDetail.allEpisodes'),
      count: allEpisodes.length,
    },
    {
      id: 'free',
      label: t('webtoonDetail.freeEpisodes'),
      count: allEpisodes.filter((e) => !e.isPremium).length,
    },
    {
      id: 'premium',
      label: t('webtoonDetail.premiumEpisodes'),
      count: allEpisodes.filter((e) => e.isPremium).length,
    },
  ]

  if (isLoading || !webtoon) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="border-primary-600 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    )
  }

  return (
    <>
      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative overflow-hidden bg-gray-900">
        {/* Ambient cover color backdrop */}
        <div
          className={`absolute inset-0 ${webtoon.coverColor} opacity-20 blur-3xl`}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/80 to-gray-900"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-10">
            {/* ── Cover Art ── */}
            <motion.div
              {...getAnimationProps({ opacity: 0, y: 20 }, { opacity: 1, y: 0 }, { duration: 0.5 })}
              className="flex-shrink-0"
            >
              <div className="relative w-48 sm:w-56 lg:w-64 xl:w-72">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur">
                  {/* Skeleton pulse */}
                  {!loadedImages.has(`cover-${webtoon.id}`) &&
                    !failedImages.has(`cover-${webtoon.id}`) && (
                      <div className="absolute inset-0 animate-pulse rounded-2xl bg-white/10" />
                    )}

                  {webtoon.coverImage && !failedImages.has(`cover-${webtoon.id}`) ? (
                    <img
                      src={webtoon.coverImage}
                      alt={webtoon.title[lang]}
                      className={`h-full w-full object-cover transition-opacity duration-300 ${
                        loadedImages.has(`cover-${webtoon.id}`) ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => handleImageLoad(`cover-${webtoon.id}`)}
                      onError={() => handleImageError(`cover-${webtoon.id}`)}
                    />
                  ) : (
                    <div
                      className={`flex h-full w-full items-center justify-center ${webtoon.coverColor}`}
                    >
                      <span className="text-sm text-white/60">Cover</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ── Info Panel ── */}
            <motion.div
              {...getAnimationProps(
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0 },
                { duration: 0.5, delay: 0.1 }
              )}
              className="flex-1 text-center md:text-left"
            >
              {/* Status Badge */}
              <span
                className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${status.className}`}
              >
                {status.label}
              </span>

              {/* Title */}
              <h1 className="mb-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {webtoon.title[lang]}
              </h1>

              {/* Author + Genre Pills */}
              <div className="mb-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <Link
                  to={`/author/${webtoon.author.id}`}
                  className="flex items-center gap-2 rounded-md px-1 transition hover:opacity-80 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
                  aria-label={`${t('webtoonDetail.viewAuthor')} ${webtoon.author.name[lang]}`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <span className="text-sm font-bold text-white">
                      {webtoon.author.name[lang].charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium text-white">{webtoon.author.name[lang]}</span>
                </Link>
                <span className="hidden text-white/40 sm:inline">|</span>
                <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  {webtoon.genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description with toggle */}
              <div className="mb-6 max-w-2xl">
                <p
                  className={`leading-relaxed text-white/70 ${!showFullDescription ? 'line-clamp-3' : ''}`}
                >
                  {webtoon.description[lang]}
                </p>
                {webtoon.description[lang].length > 120 && (
                  <button
                    type="button"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-primary-300 hover:text-primary-200 mt-1 text-sm font-medium transition"
                  >
                    {showFullDescription
                      ? t('webtoonDetail.readLess')
                      : t('webtoonDetail.readMore')}
                  </button>
                )}
              </div>

              {/* Stats Bar — glassmorphic mini-cards */}
              <div className="scrollbar-hide mb-6 flex flex-nowrap items-center justify-center gap-3 overflow-x-auto sm:flex-wrap sm:gap-4 md:justify-start">
                <div className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                  <Eye className="h-4 w-4 text-white/60" />
                  <div>
                    <span className="text-sm font-bold text-white">
                      {formatCount(webtoon.viewCount)}
                    </span>
                    <span className="ml-1 text-xs text-white/50">{t('webtoonDetail.views')}</span>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                  <Heart className="h-4 w-4 text-white/60" />
                  <div>
                    <span className="text-sm font-bold text-white">
                      {formatCount(webtoon.likeCount)}
                    </span>
                    <span className="ml-1 text-xs text-white/50">{t('webtoon.likes')}</span>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                  <BookOpen className="h-4 w-4 text-white/60" />
                  <div>
                    <span className="text-sm font-bold text-white">{webtoon.episodeCount}</span>
                    <span className="ml-1 text-xs text-white/50">{t('webtoon.episodes')}</span>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-white">{webtoon.rating}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <Link
                  to={`/read/${webtoon.id}/1`}
                  className="rounded-full focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
                >
                  <Button size="lg" leftIcon={<Play className="h-5 w-5" />}>
                    {t('webtoonDetail.startReading')}
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant={isBookmarked ? 'secondary' : 'heroOutline'}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  aria-label={isBookmarked ? t('webtoonDetail.saved') : t('webtoonDetail.save')}
                >
                  {isBookmarked ? <Check className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                  {isBookmarked ? t('webtoonDetail.saved') : t('webtoonDetail.save')}
                </Button>
                <Button size="lg" variant="heroOutline" aria-label={t('webtoonDetail.share')}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ EPISODE LIST SECTION ═══════ */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Tab Bar + Sort */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Tabs */}
            <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  aria-label={tab.label}
                >
                  {tab.label}
                  <span
                    className={`ml-1.5 text-xs ${activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'}`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                type="button"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex min-h-[44px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
                aria-label={t('categories.sortBy')}
              >
                <Filter className="h-4 w-4 text-gray-400" />
                {sortOrder === 'newest'
                  ? t('webtoonDetail.newestFirst')
                  : t('webtoonDetail.oldestFirst')}
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
                  >
                    {(['newest', 'oldest'] as SortOrder[]).map((order) => (
                      <button
                        key={order}
                        type="button"
                        onClick={() => {
                          setSortOrder(order)
                          setShowSortDropdown(false)
                        }}
                        className={`flex w-full items-center px-4 py-3 text-sm transition hover:bg-gray-50 ${
                          sortOrder === order
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {order === 'newest'
                          ? t('webtoonDetail.newestFirst')
                          : t('webtoonDetail.oldestFirst')}
                        {sortOrder === order && (
                          <Check className="text-primary-600 ml-auto h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Episode Rows */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {filteredEpisodes.map((episode, index) => {
              const isRead = readEpisodes.includes(episode.id)
              return (
                <Link key={episode.id} to={`/read/${webtoon.id}/${episode.episodeNumber}`}>
                  <motion.div
                    {...getAnimationProps(
                      { opacity: 0, y: 10 },
                      { opacity: 1, y: 0 },
                      { duration: 0.2, delay: index * 0.03 }
                    )}
                    className={`group relative flex cursor-pointer items-center justify-between border-b border-gray-100 p-3 transition-colors last:border-b-0 sm:p-4 ${
                      isRead ? 'bg-primary-50/30' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Reading progress bar at bottom */}
                    {isRead && (
                      <div
                        className="bg-primary-400/40 absolute bottom-0 left-0 h-0.5 w-full"
                        aria-hidden="true"
                      />
                    )}

                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg sm:h-14 sm:w-14 ${
                          isRead
                            ? 'bg-primary-100'
                            : episode.isPremium
                              ? 'bg-gradient-to-br from-amber-50 to-amber-100'
                              : 'bg-primary-50'
                        }`}
                      >
                        {isRead ? (
                          <Check className="text-primary-600 h-5 w-5" />
                        ) : episode.isPremium ? (
                          <Lock className="h-4 w-4 text-amber-500" />
                        ) : (
                          <span className="text-primary-700 text-sm font-bold">
                            {episode.episodeNumber}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="hover:text-primary-700 text-sm font-medium text-gray-900 transition-colors sm:text-base">
                          {episode.title[lang]}
                        </h3>
                        <p className="hidden text-xs text-gray-500 sm:block sm:text-sm">
                          {episode.description?.[lang] || ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="hidden text-xs text-gray-400 sm:block sm:text-sm">
                        {formatCount(episode.viewCount)} {t('webtoonDetail.views')}
                      </span>
                      {episode.isPremium && (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 ring-1 ring-amber-200/50">
                          {episode.coinPrice} {t('webtoonDetail.coins')}
                        </span>
                      )}
                      {isRead && (
                        <span className="bg-primary-50 text-primary-700 ring-primary-200/50 rounded-full px-2.5 py-1 text-xs font-semibold ring-1">
                          {t('webtoonDetail.read')}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-500" />
                    </div>
                  </motion.div>
                </Link>
              )
            })}

            {/* Empty state */}
            {filteredEpisodes.length === 0 && (
              <div className="py-12 text-center text-gray-400">
                <Sparkles className="mx-auto mb-2 h-8 w-8" />
                <p className="text-sm">{t('webtoonDetail.noEpisodes')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════ RELATED WEBTOONS ═══════ */}
      <section className="border-t border-gray-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">{t('home.featured')}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-6">
            {webtoons
              .filter((w) => w.id !== webtoon.id)
              .slice(0, 6)
              .map((w, index) => (
                <motion.div
                  key={w.id}
                  {...getAnimationProps(
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0 },
                    { duration: 0.3, delay: index * 0.05 }
                  )}
                >
                  <Link to={`/webtoon/${w.id}`}>
                    <Card variant="interactive" padding="none" className="group overflow-hidden">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        {/* Skeleton pulse */}
                        {!loadedImages.has(`related-${w.id}`) &&
                          !failedImages.has(`related-${w.id}`) && (
                            <div
                              className={`absolute inset-0 animate-pulse ${w.coverColor} opacity-50`}
                            />
                          )}

                        {w.coverImage && !failedImages.has(`related-${w.id}`) ? (
                          <img
                            src={w.coverImage}
                            alt={w.title[lang]}
                            className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-105 ${
                              loadedImages.has(`related-${w.id}`) ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => handleImageLoad(`related-${w.id}`)}
                            onError={() => handleImageError(`related-${w.id}`)}
                          />
                        ) : (
                          <div
                            className={`flex h-full w-full items-center justify-center ${w.coverColor}`}
                          >
                            <span className="text-sm text-white/60">Cover</span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="truncate text-sm font-semibold text-gray-900">
                          {w.title[lang]}
                        </h3>
                        <p className="truncate text-xs text-gray-500">{w.genres[0]}</p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default WebtoonDetailPage
