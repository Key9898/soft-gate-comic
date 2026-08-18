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
  Calendar,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/Button'
import { CatalogBookCard } from '../../components/BookCard'
import HeroBook3D from '../../components/HeroBook3D'
import SEO from '../../components/SEO/SEO'
import { buildBookJsonLd } from '../../components/SEO/jsonLd'
import { useData } from '../../context/DataContext'
import { useLibrary } from '../../context/LibraryContext'
import { useEngagement } from '../../context/EngagementContext'
import { useWallet } from '../../context/WalletContext'
import { formatCount } from '../../lib/utils/formatters'
import { formatCatalogDate, newestPublishedIds } from '../../lib/catalog'
import { resolveGenreLabel } from '../../lib/categories'
import WebtoonDetailSkeleton from './components/WebtoonDetailSkeleton'

type EpisodeTab = 'all' | 'free' | 'premium'
type SortOrder = 'newest' | 'oldest'

const WebtoonDetailPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'
  const { id } = useParams()
  const prefersReducedMotion = useReducedMotion()

  const { webtoons, episodes, genres, isLoading } = useData()
  const { isBookmarked, toggleBookmark } = useLibrary()
  const { readEpisodeNumbers } = useEngagement()
  const { isEpisodeUnlocked } = useWallet()
  const sortRef = useRef<HTMLDivElement>(null)

  // ── State ──────────────────────────────────────────────────
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<EpisodeTab>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [shareStatus, setShareStatus] = useState('')

  // ── Data ───────────────────────────────────────────────────
  const webtoon = webtoons.find((w) => w.id === id)

  const allEpisodes = useMemo(
    () => episodes.filter((e) => e.webtoonId === webtoon?.id),
    [webtoon?.id, episodes]
  )

  const readEpisodes = useMemo(() => {
    if (!webtoon) return [] as string[]
    return readEpisodeNumbers(webtoon.id).map(String)
  }, [webtoon, readEpisodeNumbers])

  const relatedWebtoons = useMemo(() => {
    if (!webtoon) return []
    const tokens = new Set(webtoon.genres.map((g) => g.trim().toLowerCase()).filter(Boolean))
    return [...webtoons]
      .filter((w) => w.id !== webtoon.id && w.status !== 'draft')
      .filter((w) => w.genres.some((g) => tokens.has(g.trim().toLowerCase())))
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 6)
  }, [webtoons, webtoon])

  const newestIds = useMemo(() => newestPublishedIds(webtoons), [webtoons])

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

  if (isLoading) {
    return <WebtoonDetailSkeleton />
  }

  if (!webtoon) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('webtoonDetail.notFound')}</h1>
          <p className="mt-2 text-gray-500">{t('webtoonDetail.notFoundDesc')}</p>
          <Link
            to="/"
            className="bg-primary-600 mt-6 inline-block rounded-2xl px-5 py-2.5 text-sm font-medium text-white"
          >
            {t('nav.home')}
          </Link>
        </div>
      </div>
    )
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

  return (
    <>
      <SEO
        title={webtoon.title[lang]}
        description={webtoon.description[lang]}
        url={`https://softgatecomic.com/webtoon/${webtoon.id}`}
        image={webtoon.coverImage ? `https://softgatecomic.com${webtoon.coverImage}` : undefined}
        type="book"
        author={webtoon.author.name[lang]}
        jsonLd={buildBookJsonLd({
          title: webtoon.title[lang],
          description: webtoon.description[lang],
          url: `https://softgatecomic.com/webtoon/${webtoon.id}`,
          image: webtoon.coverImage ? `https://softgatecomic.com${webtoon.coverImage}` : undefined,
          authorName: webtoon.author.name[lang],
          rating: webtoon.rating,
        })}
      />
      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative overflow-visible bg-gray-900">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className={`absolute inset-0 ${webtoon.coverColor} opacity-20 blur-3xl`} />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/80 to-gray-900" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-10">
            {/* ── Cover Art ── */}
            <div className="w-56 flex-shrink-0 overflow-visible px-2 sm:w-72 lg:w-80 xl:w-96">
              <HeroBook3D
                coverImage={
                  webtoon.coverImage && !failedImages.has(`cover-${webtoon.id}`)
                    ? webtoon.coverImage
                    : undefined
                }
                coverColor={webtoon.coverColor}
                title={webtoon.title[lang]}
                description={webtoon.description[lang]}
                href={`/read/${webtoon.id}/1`}
                ctaLabel={t('webtoonDetail.startReading')}
              />
            </div>

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
                className={`mb-3 inline-block rounded-2xl px-3 py-1 text-xs font-semibold backdrop-blur ${status.className}`}
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
                  to={`/search?q=${encodeURIComponent(webtoon.author.name[lang])}&tab=webtoons`}
                  className="flex items-center gap-2 rounded-2xl px-1 transition hover:opacity-80 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
                  aria-label={
                    lang === 'mm'
                      ? `${webtoon.author.name[lang]} ရေးသားသော ဇာတ်လမ်းများ ရှာရန်`
                      : `Search titles by ${webtoon.author.name[lang]}`
                  }
                >
                  <div className="shape-circle flex h-8 w-8 items-center justify-center bg-white/20">
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
                      className="rounded-2xl bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
                    >
                      {resolveGenreLabel(genre, genres, lang)}
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
                <div className="flex flex-shrink-0 items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                  <Eye className="h-4 w-4 text-white/60" />
                  <div>
                    <span className="text-sm font-bold text-white">
                      {formatCount(webtoon.viewCount)}
                    </span>
                    <span className="ml-1 text-xs text-white/50">{t('webtoonDetail.views')}</span>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                  <Heart className="h-4 w-4 text-white/60" />
                  <div>
                    <span className="text-sm font-bold text-white">
                      {formatCount(webtoon.likeCount)}
                    </span>
                    <span className="ml-1 text-xs text-white/50">{t('webtoon.likes')}</span>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                  <BookOpen className="h-4 w-4 text-white/60" />
                  <div>
                    <span className="text-sm font-bold text-white">{webtoon.episodeCount}</span>
                    <span className="ml-1 text-xs text-white/50">{t('webtoon.episodes')}</span>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-white">{webtoon.rating}</span>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                  <Calendar className="h-4 w-4 text-white/60" aria-hidden="true" />
                  <span className="text-sm font-bold text-white">
                    {formatCatalogDate(webtoon.createdAt)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <Link
                  to={`/read/${webtoon.id}/1`}
                  className="rounded-2xl focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
                >
                  <Button size="lg" leftIcon={<Play className="h-5 w-5" />}>
                    {t('webtoonDetail.startReading')}
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant={isBookmarked(webtoon.id) ? 'secondary' : 'heroOutline'}
                  onClick={() => toggleBookmark(webtoon.id)}
                  aria-label={
                    isBookmarked(webtoon.id) ? t('webtoonDetail.saved') : t('webtoonDetail.save')
                  }
                >
                  {isBookmarked(webtoon.id) ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                  {isBookmarked(webtoon.id) ? t('webtoonDetail.saved') : t('webtoonDetail.save')}
                </Button>
                <Button
                  size="lg"
                  variant="heroOutline"
                  aria-label={t('webtoonDetail.share')}
                  onClick={async () => {
                    const url = `${window.location.origin}/webtoon/${webtoon.id}`
                    const title = webtoon.title[lang]
                    try {
                      if (navigator.share) {
                        await navigator.share({ title, url })
                        return
                      }
                    } catch {
                      /* cancelled */
                    }
                    try {
                      await navigator.clipboard.writeText(url)
                      setShareStatus(t('webtoonDetail.linkCopied'))
                      setTimeout(() => setShareStatus(''), 2000)
                    } catch {
                      setShareStatus('')
                    }
                  }}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                {shareStatus ? (
                  <span className="text-xs font-semibold text-emerald-300">{shareStatus}</span>
                ) : null}
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
            <div className="flex items-center gap-1 rounded-2xl bg-gray-100 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-[44px] rounded-2xl px-4 py-2 text-sm font-medium transition-all ${
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
                className="flex min-h-[44px] items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
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
                    className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl"
                  >
                    {(['newest', 'oldest'] as SortOrder[]).map((order) => (
                      <button
                        key={order}
                        type="button"
                        onClick={() => {
                          setSortOrder(order)
                          setShowSortDropdown(false)
                        }}
                        className={`flex w-full items-center px-4 py-3 text-sm font-medium transition hover:bg-gray-50 ${
                          sortOrder === order ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
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
              const isRead = readEpisodes.includes(String(episode.episodeNumber))
              const locked =
                episode.isPremium && !isEpisodeUnlocked(webtoon.id, episode.episodeNumber)
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
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${
                          isRead
                            ? 'bg-primary-100'
                            : locked
                              ? 'from-accent-500/10 to-accent-600/10 bg-gradient-to-br'
                              : 'bg-primary-50'
                        }`}
                      >
                        {isRead ? (
                          <Check className="text-primary-600 h-5 w-5" />
                        ) : locked ? (
                          <Lock className="text-accent-600 h-4 w-4" aria-hidden="true" />
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
                        {formatCatalogDate(episode.createdAt)}
                      </span>
                      <span className="hidden text-xs text-gray-400 sm:block sm:text-sm">
                        {formatCount(episode.viewCount)} {t('webtoonDetail.views')}
                      </span>
                      {episode.isPremium && (
                        <span className="bg-accent-500/10 text-accent-700 ring-accent-500/20 rounded-2xl px-2.5 py-1 text-xs font-semibold ring-1">
                          {episode.coinPrice} {t('webtoonDetail.coins')}
                        </span>
                      )}
                      {isRead && (
                        <span className="bg-primary-50 text-primary-700 ring-primary-200/50 rounded-2xl px-2.5 py-1 text-xs font-semibold ring-1">
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
      {relatedWebtoons.length > 0 ? (
        <section className="border-t border-gray-100 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-xl font-bold text-gray-900">{t('home.featured')}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-6">
              {relatedWebtoons.map((w, index) => (
                <motion.div
                  key={w.id}
                  {...getAnimationProps(
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0 },
                    { duration: 0.3, delay: index * 0.05 }
                  )}
                >
                  <Link
                    to={`/webtoon/${w.id}`}
                    className="focus:ring-primary-500 block rounded-[3px] focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  >
                    <CatalogBookCard
                      webtoon={w}
                      lang={lang}
                      genres={genres}
                      newestIds={newestIds}
                      imageLoaded={loadedImages.has(`related-${w.id}`)}
                      imageFailed={failedImages.has(`related-${w.id}`)}
                      onImageLoad={() => handleImageLoad(`related-${w.id}`)}
                      onImageError={() => handleImageError(`related-${w.id}`)}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

export default WebtoonDetailPage
