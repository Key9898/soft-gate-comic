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
  Clock,
  Bell,
  BellOff,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/Button'
import { CatalogBookCard } from '../../components/BookCard'
import { SeriesRatingControl } from '../../components/SeriesRating'
import ContentRatingBadge from '../../components/ContentRatingBadge'
import CommentsThread from '../../components/Comments/CommentsThread'
import HeroBook3D from '../../components/HeroBook3D'
import SEO from '../../components/SEO/SEO'
import UpcomingDropMeta from '../../components/UpcomingDropMeta'
import { buildBreadcrumbJsonLd, buildComicSeriesJsonLd } from '../../components/SEO/jsonLd'
import { ogImageForWebtoon } from '../../lib/seo/ogImage'
import { useData } from '../../context/DataContext'
import { useLibrary } from '../../context/LibraryContext'
import { useEngagement } from '../../context/EngagementContext'
import { useWallet } from '../../context/WalletContext'
import { formatCount } from '../../lib/utils/formatters'
import { formatRating } from '../../lib/rating'
import {
  episodeThumbSrc,
  formatCatalogDate,
  formatWaitFreeAt,
  hasWaitSchedule,
  isEpisodeLocked,
  isWaitFreeNow,
  latestPublishedEpisode,
  newestPublishedIds,
  nextDropForSeries,
  publishedEpisodesForSeries,
  seriesPrimaryRead,
} from '../../lib/catalog'
import { findGenreByToken, resolveGenreLabel } from '../../lib/categories'
import { seriesCommentKey } from '../../lib/comments'
import WebtoonDetailSkeleton from './components/WebtoonDetailSkeleton'
import NotFoundPage from '../info/NotFoundPage'

type EpisodeTab = 'all' | 'free' | 'premium'
type SortOrder = 'newest' | 'oldest'

const WebtoonDetailPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'
  const { id } = useParams()
  const prefersReducedMotion = useReducedMotion()

  const { webtoons, episodes, genres, isLoading } = useData()
  const { isBookmarked, toggleBookmark, setNotifyMuted, bookmarks } = useLibrary()
  const { readEpisodeNumbers, history } = useEngagement()
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
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  // ── Data ───────────────────────────────────────────────────
  const webtoon = webtoons.find((w) => w.id === id)

  const allEpisodes = useMemo(
    () => (webtoon ? publishedEpisodesForSeries(episodes, webtoon.id) : []),
    [webtoon, episodes]
  )

  const readEpisodes = useMemo(() => {
    if (!webtoon) return [] as string[]
    return readEpisodeNumbers(webtoon.id).map(String)
  }, [webtoon, readEpisodeNumbers])

  const historyRecord = useMemo(
    () => (webtoon ? history.find((record) => record.webtoonId === webtoon.id) : undefined),
    [history, webtoon]
  )

  const primaryRead = useMemo(
    () => seriesPrimaryRead(historyRecord, allEpisodes.length),
    [historyRecord, allEpisodes.length]
  )

  const latestEpisode = useMemo(
    () => (webtoon ? latestPublishedEpisode(episodes, webtoon.id) : undefined),
    [episodes, webtoon]
  )

  const nextDrop = useMemo(
    () => (webtoon ? nextDropForSeries(episodes, webtoon.id) : undefined),
    [episodes, webtoon]
  )

  const subscribedRecord = useMemo(
    () => bookmarks.find((record) => record.webtoonId === webtoon?.id),
    [bookmarks, webtoon]
  )
  const notifyMuted = Boolean(subscribedRecord?.notifyMuted)

  const showLatestCta = Boolean(
    latestEpisode && latestEpisode.episodeNumber !== primaryRead.episodeNumber
  )

  const primaryHref = webtoon ? `/read/${webtoon.id}/${primaryRead.episodeNumber}` : '/'
  const primaryLabel =
    primaryRead.kind === 'continue'
      ? `${t('webtoonDetail.continueReading')} · ${t('readerPage.episodeN', { n: primaryRead.episodeNumber })}`
      : t('webtoonDetail.startReading')

  const relatedWebtoons = useMemo(() => {
    if (!webtoon) return []
    const tokens = new Set(webtoon.genres.map((g) => g.trim().toLowerCase()).filter(Boolean))
    return [...webtoons]
      .filter((w) => w.id !== webtoon.id && w.status !== 'draft')
      .filter((w) => w.genres.some((g) => tokens.has(g.trim().toLowerCase())))
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 6)
  }, [webtoons, webtoon])

  const authorWorks = useMemo(() => {
    if (!webtoon) return []
    return [...webtoons]
      .filter(
        (w) => w.id !== webtoon.id && w.status !== 'draft' && w.author.id === webtoon.author.id
      )
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
    return <NotFoundPage variant="series" />
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
        path={`/webtoon/${webtoon.id}`}
        image={ogImageForWebtoon(webtoon)}
        type="book"
        author={webtoon.author.name[lang]}
        jsonLd={[
          buildComicSeriesJsonLd({
            title: webtoon.title[lang],
            description: webtoon.description[lang],
            url: `https://softgatecomic.com/webtoon/${webtoon.id}`,
            image: webtoon.coverImage
              ? `https://softgatecomic.com${webtoon.coverImage}`
              : undefined,
            authorName: webtoon.author.name[lang],
            authorUrl: `https://softgatecomic.com/author/${webtoon.author.id}`,
            genres: webtoon.genres.map((g) => resolveGenreLabel(g, genres, 'en')),
            inLanguage: ['my', 'en'],
            rating: webtoon.rating,
            contentRating: webtoon.contentRating,
            datePublished: webtoon.createdAt,
            dateModified: webtoon.updatedAt,
          }),
          buildBreadcrumbJsonLd([
            { name: t('nav.home'), path: '/' },
            { name: t('nav.categories'), path: '/categories' },
            { name: webtoon.title[lang], path: `/webtoon/${webtoon.id}` },
          ]),
        ]}
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
                href={primaryHref}
                ctaLabel={primaryLabel}
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
              <ContentRatingBadge
                rating={webtoon.contentRating}
                className="mb-3 ml-2 inline-block"
              />

              {/* Title */}
              <h1 className="mb-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {webtoon.title[lang]}
              </h1>

              {/* Author + Genre Pills */}
              <div className="mb-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <Link
                  to={`/author/${webtoon.author.id}`}
                  className="flex items-center gap-2 rounded-2xl px-1 transition hover:opacity-80 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
                  aria-label={`${t('webtoonDetail.viewAuthor')} ${webtoon.author.name[lang]}`}
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
                  {webtoon.genres.map((genre) => {
                    const catalogGenre = findGenreByToken(genres, genre)
                    const label = resolveGenreLabel(genre, genres, lang)
                    const className =
                      'rounded-2xl bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm'
                    if (!catalogGenre || catalogGenre.slug === 'all') {
                      return (
                        <span key={genre} className={className}>
                          {label}
                        </span>
                      )
                    }
                    return (
                      <Link
                        key={genre}
                        to={`/categories/${catalogGenre.slug}`}
                        className={`${className} inline-flex min-h-11 items-center transition hover:bg-white/20 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none`}
                      >
                        {label}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {webtoon.tags.length > 0 ? (
                <div className="mb-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  {webtoon.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/search?q=${encodeURIComponent(tag)}`}
                      className="inline-flex min-h-11 items-center rounded-2xl bg-white/5 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/10 transition hover:bg-white/15 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              ) : null}

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
                    <span className="text-sm font-bold text-white">{allEpisodes.length}</span>
                    <span className="ml-1 text-xs text-white/50">{t('webtoon.episodes')}</span>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <div>
                    <span className="text-sm font-bold text-white">
                      {formatRating(webtoon.rating)}
                    </span>
                    <span className="ml-1 text-xs text-white/50">{t('rating.community')}</span>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                  <Calendar className="h-4 w-4 text-white/60" aria-hidden="true" />
                  <div>
                    <span className="text-sm font-bold text-white">
                      {formatCatalogDate(webtoon.createdAt)}
                    </span>
                    <span className="ml-1 text-xs text-white/50">
                      {t('webtoonDetail.published')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                  <Clock className="h-4 w-4 text-white/60" aria-hidden="true" />
                  <div>
                    <span className="text-sm font-bold text-white">
                      {formatCatalogDate(webtoon.updatedAt)}
                    </span>
                    <span className="ml-1 text-xs text-white/50">{t('webtoonDetail.updated')}</span>
                  </div>
                </div>
              </div>

              {nextDrop ? (
                <div
                  data-testid="hub-next-drop"
                  className="mb-6 rounded-2xl bg-white/10 px-4 py-3 text-left backdrop-blur-sm"
                >
                  <p className="text-xs font-medium tracking-wide text-white/60 uppercase">
                    {t('webtoonDetail.nextDrop')}
                  </p>
                  <UpcomingDropMeta
                    className="mt-1"
                    episode={nextDrop}
                    now={now}
                    lang={lang}
                    tone="hero"
                  />
                </div>
              ) : null}

              <div className="mb-6 flex justify-center md:justify-start">
                <SeriesRatingControl webtoonId={webtoon.id} variant="hero" />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <Link
                  to={primaryHref}
                  className="rounded-2xl focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
                >
                  <Button size="lg" leftIcon={<Play className="h-5 w-5" />}>
                    {primaryLabel}
                  </Button>
                </Link>
                {showLatestCta && latestEpisode ? (
                  <Link
                    to={`/read/${webtoon.id}/${latestEpisode.episodeNumber}`}
                    className="rounded-2xl focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
                  >
                    <Button size="lg" variant="heroOutline">
                      {t('webtoonDetail.latestEpisode')}
                    </Button>
                  </Link>
                ) : null}
                <Button
                  size="lg"
                  variant={isBookmarked(webtoon.id) ? 'secondary' : 'heroOutline'}
                  onClick={() => toggleBookmark(webtoon.id)}
                  aria-label={
                    isBookmarked(webtoon.id)
                      ? t('webtoonDetail.subscribed')
                      : t('webtoonDetail.subscribe')
                  }
                >
                  {isBookmarked(webtoon.id) ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                  {isBookmarked(webtoon.id)
                    ? t('webtoonDetail.subscribed')
                    : t('webtoonDetail.subscribe')}
                </Button>
                {isBookmarked(webtoon.id) ? (
                  <Button
                    size="lg"
                    variant="heroOutline"
                    data-testid="notify-mute"
                    aria-label={
                      notifyMuted ? t('webtoonDetail.notifyOff') : t('webtoonDetail.notifyOn')
                    }
                    onClick={() => setNotifyMuted(webtoon.id, !notifyMuted)}
                  >
                    {notifyMuted ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                  </Button>
                ) : null}
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
              const coinUnlocked = isEpisodeUnlocked(webtoon.id, episode.episodeNumber)
              const locked = isEpisodeLocked(episode, coinUnlocked)
              const waitFree = isWaitFreeNow(episode)
              const waiting = hasWaitSchedule(episode) && !waitFree
              const thumbSrc = episodeThumbSrc(episode, webtoon.coverImage)
              return (
                <Link key={episode.id} to={`/read/${webtoon.id}/${episode.episodeNumber}`}>
                  <motion.div
                    {...getAnimationProps(
                      { opacity: 0, y: 10 },
                      { opacity: 1, y: 0 },
                      { duration: 0.2, delay: index * 0.03 }
                    )}
                    className={`group relative flex cursor-pointer items-center justify-between gap-3 border-b border-gray-100 p-3 transition-colors last:border-b-0 sm:gap-4 sm:p-4 ${
                      isRead ? 'bg-primary-50/30' : 'hover:bg-gray-50'
                    }`}
                  >
                    {isRead && (
                      <div
                        className="bg-primary-400/40 absolute bottom-0 left-0 h-0.5 w-full"
                        aria-hidden="true"
                      />
                    )}

                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <div className="relative w-20 shrink-0 sm:w-24">
                        <div className="aspect-[202/142] overflow-hidden rounded-2xl bg-gray-100">
                          {thumbSrc ? (
                            <img src={thumbSrc} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div
                              className={`flex h-full w-full items-center justify-center ${webtoon.coverColor}`}
                            />
                          )}
                        </div>
                        {locked ? (
                          <span className="bg-accent-600/90 absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-2xl text-white">
                            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                        ) : null}
                        {isRead ? (
                          <span className="bg-primary-600 absolute bottom-1 left-1 flex h-6 w-6 items-center justify-center rounded-2xl text-white">
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                        ) : (
                          <span className="text-2xs absolute bottom-1 left-1 rounded-2xl bg-black/60 px-1.5 py-0.5 font-bold text-white">
                            {episode.episodeNumber}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="hover:text-primary-700 text-sm font-medium text-gray-900 transition-colors sm:text-base">
                          {episode.title[lang]}
                        </h3>
                        <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 sm:text-sm">
                          {episode.description?.[lang] || ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
                      <span className="text-xs text-gray-400 sm:text-sm">
                        {formatCatalogDate(episode.createdAt)}
                      </span>
                      <span className="text-xs text-gray-400 sm:text-sm">
                        {formatCount(episode.viewCount)} {t('webtoonDetail.views')}
                      </span>
                      {waitFree ? (
                        <span className="rounded-2xl bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
                          {t('webtoonDetail.waitFreeNow')}
                        </span>
                      ) : null}
                      {waiting && episode.freeAt ? (
                        <span className="rounded-2xl bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
                          {t('webtoonDetail.waitFreeOn', {
                            when: formatWaitFreeAt(episode.freeAt),
                          })}
                        </span>
                      ) : null}
                      {episode.isPremium && !waitFree && (
                        <span className="bg-accent-500/10 text-accent-700 ring-accent-500/20 rounded-2xl px-2.5 py-1 text-xs font-semibold ring-1">
                          {episode.coinPrice} {t('webtoonDetail.coins')}
                        </span>
                      )}
                      {isRead && (
                        <span className="bg-primary-50 text-primary-700 ring-primary-200/50 rounded-2xl px-2.5 py-1 text-xs font-semibold ring-1">
                          {t('webtoonDetail.read')}
                        </span>
                      )}
                      <ChevronRight className="hidden h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-500 sm:block" />
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

      <section
        data-testid="hub-comments"
        className="border-t border-gray-100 py-8"
        aria-labelledby="hub-comments-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="hub-comments-heading" className="mb-6 text-xl font-bold text-gray-900">
            {t('webtoonDetail.comments')}
          </h2>
          <CommentsThread commentKey={seriesCommentKey(webtoon.id)} />
        </div>
      </section>

      {authorWorks.length > 0 ? (
        <section className="border-t border-gray-100 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-gray-900">{t('webtoonDetail.otherWorks')}</h2>
              <Link
                to={`/author/${webtoon.author.id}`}
                className="text-primary-600 hover:text-primary-700 focus-visible:ring-primary-500 text-sm font-semibold focus-visible:ring-2 focus-visible:outline-none"
              >
                {t('common.viewAll')}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-6">
              {authorWorks.map((w, index) => (
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
                      imageLoaded={loadedImages.has(`author-${w.id}`)}
                      imageFailed={failedImages.has(`author-${w.id}`)}
                      onImageLoad={() => handleImageLoad(`author-${w.id}`)}
                      onImageError={() => handleImageError(`author-${w.id}`)}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedWebtoons.length > 0 ? (
        <section className="border-t border-gray-100 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              {t('webtoonDetail.youMayAlsoLike')}
            </h2>
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
