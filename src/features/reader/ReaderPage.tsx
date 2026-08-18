import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion, type MotionProps } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  List,
  Settings,
  Sun,
  Moon,
  Type,
  X,
  Heart,
  MessageCircle,
  Bookmark,
  Lock,
  Sparkles,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import SEO from '../../components/SEO/SEO'
import { buildArticleJsonLd } from '../../components/SEO/jsonLd'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useLibrary } from '../../context/LibraryContext'
import { useWallet } from '../../context/WalletContext'
import { useEngagement } from '../../context/EngagementContext'
import { scrollRatioFromMetrics, scrollTopFromRatio } from '../../lib/engagement'
import useScrollLock from '../../hooks/useScrollLock'
import ReaderCommentsPanel from './components/ReaderCommentsPanel'
import ReaderSkeleton from './components/ReaderSkeleton'

const ReaderPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'
  const { webtoonId, episodeNumber } = useParams()
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()
  const { webtoons, episodes, isLoading } = useData()
  const { isBookmarked, toggleBookmark } = useLibrary()
  const { isAuthenticated } = useAuth()
  const { balance, isEpisodeUnlocked, unlockEpisode } = useWallet()
  const {
    isLiked,
    toggleLike,
    recordHistory,
    updateReadingProgress,
    history,
    isReady: engagementReady,
  } = useEngagement()

  // ── States ─────────────────────────────────────────────────
  const [showHeader, setShowHeader] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [darkMode, setDarkMode] = useState(true) // Default to dark mode for reading
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [showComments, setShowComments] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [brightness, setBrightness] = useState<number>(0.9) // 0.25 to 1.0
  const [estMinutesLeft, setEstMinutesLeft] = useState<number>(3)
  const [totalEstMinutes, setTotalEstMinutes] = useState<number>(1)
  const [unlockError, setUnlockError] = useState('')

  // Last scroll track
  const lastScrollPos = useRef<number>(0)
  const restoreDoneRef = useRef(false)
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastPersistedRatioRef = useRef<number | null>(null)
  const historyRef = useRef(history)
  historyRef.current = history

  // ── Webtoon & Episode Data ────────────────────────────────
  const webtoon = webtoons.find((w) => w.id === webtoonId)
  const currentEpisode = episodes.find(
    (e) => e.webtoonId === webtoonId && e.episodeNumber === Number(episodeNumber)
  )
  const nextEpisode = episodes.find(
    (e) => e.webtoonId === webtoonId && e.episodeNumber === Number(episodeNumber) + 1
  )

  const totalEpisodes = episodes.filter((e) => e.webtoonId === webtoonId).length
  const hasPrev = Number(episodeNumber) > 1
  const hasNext = Number(episodeNumber) < totalEpisodes
  const episodeNum = Number(episodeNumber)
  const locked =
    Boolean(currentEpisode?.isPremium) &&
    Boolean(webtoonId) &&
    !isEpisodeUnlocked(webtoonId!, episodeNum)
  const episodeKey = `${webtoonId ?? ''}:${currentEpisode?.episodeNumber ?? episodeNum}`

  const flushReadingProgress = useCallback(() => {
    if (!isAuthenticated || !webtoonId || !currentEpisode || locked) return
    if (!restoreDoneRef.current) return
    const ratio = scrollRatioFromMetrics(
      window.scrollY,
      document.documentElement.scrollHeight,
      window.innerHeight
    )
    if (
      lastPersistedRatioRef.current !== null &&
      Math.abs(lastPersistedRatioRef.current - ratio) < 0.005
    ) {
      return
    }
    lastPersistedRatioRef.current = ratio
    updateReadingProgress(webtoonId, currentEpisode.episodeNumber, ratio)
  }, [isAuthenticated, webtoonId, currentEpisode, locked, updateReadingProgress])

  const schedulePersist = useCallback(() => {
    if (persistTimerRef.current) clearTimeout(persistTimerRef.current)
    persistTimerRef.current = setTimeout(() => {
      persistTimerRef.current = null
      flushReadingProgress()
    }, 1000)
  }, [flushReadingProgress])

  useEffect(() => {
    restoreDoneRef.current = false
    lastPersistedRatioRef.current = null
    if (persistTimerRef.current) {
      clearTimeout(persistTimerRef.current)
      persistTimerRef.current = null
    }
  }, [episodeKey])

  useScrollLock(showSettings)

  useEffect(() => {
    if (!showSettings) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSettings(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showSettings])

  useEffect(() => {
    if (!webtoonId || !currentEpisode || locked) return
    if (!isAuthenticated) return
    recordHistory(webtoonId, currentEpisode.episodeNumber)
  }, [webtoonId, currentEpisode, locked, isAuthenticated, recordHistory])

  useEffect(() => {
    if (!engagementReady || !webtoon || !currentEpisode || !webtoonId) return

    if (locked || !isAuthenticated) {
      restoreDoneRef.current = true
      return
    }

    let cancelled = false
    const record = historyRef.current.find(
      (h) => h.webtoonId === webtoonId && h.episodeNumber === currentEpisode.episodeNumber
    )
    const ratio = record?.scrollRatio ?? 0

    if (ratio <= 0.02) {
      restoreDoneRef.current = true
      return
    }

    const timeoutId = window.setTimeout(
      () => {
        requestAnimationFrame(() => {
          if (cancelled) return
          const top = scrollTopFromRatio(
            ratio,
            document.documentElement.scrollHeight,
            window.innerHeight
          )
          window.scrollTo({ top, behavior: 'instant' as ScrollBehavior })
          restoreDoneRef.current = true
        })
      },
      prefersReducedMotion ? 0 : 80
    )

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [
    engagementReady,
    episodeKey,
    locked,
    isAuthenticated,
    webtoon,
    currentEpisode,
    webtoonId,
    prefersReducedMotion,
  ])

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState !== 'hidden') return
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current)
        persistTimerRef.current = null
      }
      flushReadingProgress()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current)
        persistTimerRef.current = null
      }
      flushReadingProgress()
    }
  }, [flushReadingProgress, episodeKey])

  // ── Scroll Listener & Reader Metrics ──────────────────────
  useEffect(() => {
    if (!webtoon || !currentEpisode) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight
      const ratio = scrollRatioFromMetrics(scrollTop, scrollHeight, viewportHeight)
      const progress = ratio * 100
      setReadingProgress(Math.min(progress, 100))

      // Auto-hide bars when scrolling down, show when scrolling up
      if (scrollTop > 120) {
        if (scrollTop > lastScrollPos.current) {
          setShowHeader(false)
        } else {
          setShowHeader(true)
        }
      } else {
        setShowHeader(true)
      }

      // Est remaining reading time calculation
      const remainingScroll = Math.max(0, scrollHeight - viewportHeight - scrollTop)
      // Assuming avg scroll reading speed is 50px per second (3000px per minute)
      const speed = 3000 // pixels per minute
      const minutes = Math.max(1, Math.ceil(remainingScroll / speed))
      setEstMinutesLeft(progress >= 98 ? 0 : minutes)
      setTotalEstMinutes(Math.max(1, Math.ceil((scrollHeight - viewportHeight) / speed)))

      lastScrollPos.current = scrollTop

      if (!locked && isAuthenticated && restoreDoneRef.current) {
        schedulePersist()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [webtoon, currentEpisode, locked, isAuthenticated, schedulePersist])

  if (isLoading) {
    return <ReaderSkeleton />
  }

  if (!webtoon || !currentEpisode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">{t('reader.notFound')}</h1>
          <p className="mt-2 text-white/70">{t('reader.notFoundDesc')}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="bg-primary-600 hover:bg-primary-700 rounded-2xl px-5 py-2.5 text-sm font-medium transition"
            >
              {t('nav.home')}
            </Link>
            {webtoon ? (
              <Link
                to={`/webtoon/${webtoon.id}`}
                className="rounded-2xl border border-white/20 px-5 py-2.5 text-sm font-medium transition hover:bg-white/10"
              >
                {t('reader.backToWebtoon')}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  // ── Actions ────────────────────────────────────────────────
  const goToEpisode = (num: number) => {
    navigate(`/read/${webtoonId}/${num}`)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }

  // Animation Helper
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

  // ── UI Theme classes ───────────────────────────────────────
  const bgClass = darkMode ? 'bg-gray-950' : 'bg-gray-50'
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900'
  const cardBgClass = darkMode ? 'bg-gray-900/60 border-white/5' : 'bg-white/80 border-gray-200'
  const fontClass = fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg' : 'text-base'
  const liked = Boolean(webtoonId && isLiked(webtoonId))

  const handleUnlock = () => {
    if (!webtoonId || !currentEpisode) return
    setUnlockError('')
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/read/${webtoonId}/${episodeNumber}` } } })
      return
    }
    const result = unlockEpisode(
      webtoonId,
      currentEpisode.episodeNumber,
      currentEpisode.coinPrice,
      t('readerPage.unlockTxnDesc', {
        n: currentEpisode.episodeNumber,
        title: webtoon?.title[lang] ?? webtoonId,
      })
    )
    if (!result.ok) {
      if (result.reason === 'INSUFFICIENT_COINS') {
        setUnlockError(t('readerPage.insufficientCoins', { balance }))
        navigate('/coins')
      }
    }
  }

  return (
    <div
      className={`min-h-screen ${bgClass} ${textClass} ${fontClass} transition-colors duration-300`}
    >
      <SEO
        title={`${webtoon?.title[lang] ?? ''} — #${episodeNumber} ${currentEpisode?.title[lang] ?? ''}`}
        description={currentEpisode?.description?.[lang] || webtoon?.description[lang]}
        url={`https://softgatecomic.com/read/${webtoonId}/${episodeNumber}`}
        type="article"
        jsonLd={buildArticleJsonLd({
          title: `${webtoon?.title[lang] ?? ''} #${episodeNumber}`,
          description: currentEpisode?.title[lang] || '',
          url: `https://softgatecomic.com/read/${webtoonId}/${episodeNumber}`,
        })}
      />
      {/* Simulated Brightness Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[100] bg-black transition-opacity duration-150"
        style={{ opacity: 1 - brightness }}
        aria-hidden="true"
      />

      {/* ═══════ HEADER BAR ═══════ */}
      <AnimatePresence>
        {showHeader && (
          <motion.header
            {...getAnimationProps(
              { y: -100, opacity: 0 },
              { y: 0, opacity: 1 },
              { type: 'spring', stiffness: 260, damping: 22 }
            )}
            exit={{ y: -100, opacity: 0 }}
            className={`safe-top fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
              darkMode
                ? 'border-white/5 bg-gray-950/75 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]'
                : 'border-gray-200 bg-white/75 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)]'
            }`}
          >
            <div className="relative mx-auto max-w-4xl px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/webtoon/${webtoonId}`}
                    title={t('readerPage.closeReader')}
                    aria-label={t('readerPage.closeReader')}
                    className={`rounded-2xl p-2.5 transition ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className="h-5 w-5" />
                  </Link>
                  <div>
                    <h1 className="max-w-[160px] truncate text-sm font-bold sm:max-w-[300px] sm:text-base">
                      {currentEpisode.title[lang]}
                    </h1>
                    <p
                      className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1.5`}
                    >
                      <span className="font-semibold">{webtoon.title[lang]}</span>
                      <span>•</span>
                      <span>{t('readerPage.epShort', { n: episodeNumber })}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Reading Time Estimator HUD */}
                  <div
                    className={`hidden rounded-2xl px-2.5 py-1.5 text-xs font-semibold sm:block ${
                      darkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {estMinutesLeft > 0
                      ? t('readerPage.minsLeft', { mins: estMinutesLeft })
                      : t('readerPage.read')}
                  </div>

                  <button
                    type="button"
                    title={t('readerPage.settings')}
                    aria-label={t('readerPage.settings')}
                    onClick={() => setShowSettings(!showSettings)}
                    className={`rounded-2xl p-2.5 transition ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    } ${showSettings ? 'text-primary-500' : ''}`}
                  >
                    <Settings className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    title={t('readerPage.comments')}
                    aria-label={t('readerPage.comments')}
                    onClick={() => setShowComments(true)}
                    className={`rounded-2xl p-2.5 transition ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    <MessageCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Progress indicator with a neon glow effect */}
              <div className="absolute right-0 bottom-0 left-0 h-[3px] bg-gray-200/20">
                <div
                  className="progress-bar from-primary-500 to-accent-600 h-full bg-gradient-to-r shadow-[0_0_12px_rgba(238,57,104,0.55)]"
                  style={{ width: `${readingProgress}%` }}
                  role="progressbar"
                  aria-label={`${t('reader.readingProgress')}: ${Math.round(readingProgress)}%`}
                />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ═══════ WEBTOON COMIC STRIPS ═══════ */}
      <main
        className="mx-auto max-w-2xl px-0 pt-20 pb-16 sm:px-2 md:pt-24"
        onClick={() => setShowHeader(!showHeader)}
      >
        {locked ? (
          <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
            <div
              className={`shape-circle mb-6 flex h-24 w-24 items-center justify-center shadow-lg backdrop-blur ${
                darkMode
                  ? 'border border-white/10 bg-white/5'
                  : 'border border-gray-200 bg-gray-100'
              }`}
            >
              <Lock className="text-accent-500 h-10 w-10 animate-pulse" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">{t('readerPage.premiumEpisode')}</h2>
            <p className={`mb-4 max-w-xs text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('readerPage.unlockFor', { coins: currentEpisode.coinPrice })}
            </p>
            {isAuthenticated && (
              <p className={`mb-6 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {t('coinsPage.yourBalance')}: {balance}
              </p>
            )}
            {unlockError ? (
              <p role="alert" className="mb-3 text-sm font-semibold text-red-500">
                {unlockError}
              </p>
            ) : null}
            <Button
              size="lg"
              onClick={(e) => {
                e.stopPropagation()
                handleUnlock()
              }}
            >
              {isAuthenticated ? t('readerPage.unlockWithCoins') : t('readerPage.loginToUnlock')}
            </Button>
          </div>
        ) : currentEpisode.images.length > 0 ? (
          <div className="flex flex-col gap-0 overflow-hidden shadow-xl sm:rounded-2xl">
            {currentEpisode.images.map((src, index) => (
              <img
                key={`${src}-${index}`}
                src={src}
                alt={`${currentEpisode.title[lang]} strip ${index + 1}`}
                className="block w-full"
                loading={index < 2 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('readerPage.noImages')}
            </p>
          </div>
        )}

        {/* ═══════ CHAPTER COMPLETE CELEBRATION PORTAL ═══════ */}
        {!locked && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className={`mt-12 rounded-3xl border p-6 text-center sm:p-8 ${cardBgClass} relative overflow-hidden`}
          >
            <div
              className="bg-primary-500/10 shape-circle absolute -top-12 -right-12 h-36 w-36 blur-2xl"
              aria-hidden="true"
            />
            <div
              className="bg-accent-500/10 shape-circle absolute -bottom-12 -left-12 h-36 w-36 blur-2xl"
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-primary-500/10 text-primary-500 mb-4 animate-bounce rounded-2xl p-4">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="mb-2 text-xl font-bold tracking-tight sm:text-2xl">
                {t('readerPage.chapterComplete')}
              </h2>
              <p
                className={`mb-6 max-w-sm text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {t('readerPage.readingTime')}: {t('readerPage.minutes', { mins: totalEstMinutes })}
              </p>

              {hasNext ? (
                <div className="w-full max-w-md">
                  <p className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    {t('readerPage.nextChapter')}
                  </p>
                  <div
                    className={`flex items-center justify-between rounded-2xl border p-4 transition hover:bg-white/5 ${
                      darkMode ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-600 flex h-12 w-12 items-center justify-center rounded-2xl font-bold text-white">
                        {Number(episodeNumber) + 1}
                      </div>
                      <div className="text-left">
                        <span className="text-primary-500 block text-xs font-semibold">
                          {t('readerPage.episodeN', { n: Number(episodeNumber) + 1 })}
                        </span>
                        <span
                          className={`block max-w-[180px] truncate text-sm font-bold ${
                            darkMode ? 'text-gray-100' : 'text-gray-900'
                          }`}
                        >
                          {nextEpisode ? nextEpisode.title[lang] : ''}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        goToEpisode(Number(episodeNumber) + 1)
                      }}
                    >
                      {t('readerPage.nextEpisode')}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-primary-500 text-sm font-semibold">
                  {t('readerPage.endOfSeries')}
                </p>
              )}

              {!isAuthenticated && (
                <div
                  className={`mt-6 w-full max-w-md rounded-2xl border p-4 ${
                    darkMode ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <p
                    className={`mb-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('readerPage.guestNudge')}
                  </p>
                  <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('/register', {
                          state: { from: { pathname: `/read/${webtoonId}/${episodeNumber}` } },
                        })
                      }}
                    >
                      {t('readerPage.createFreeAccount')}
                    </Button>
                    <Link
                      to="/login"
                      state={{ from: { pathname: `/read/${webtoonId}/${episodeNumber}` } }}
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary-500 hover:text-primary-400 focus-visible:ring-primary-500 flex min-h-11 items-center rounded-2xl px-3 text-sm font-semibold focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {t('nav.login')}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* ═══════ FOOTER BAR ═══════ */}
      <AnimatePresence>
        {showHeader && (
          <motion.div
            {...getAnimationProps(
              { y: 100, opacity: 0 },
              { y: 0, opacity: 1 },
              { type: 'spring', stiffness: 260, damping: 22 }
            )}
            exit={{ y: 100, opacity: 0 }}
            className={`safe-bottom fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur-md transition-colors duration-300 ${
              darkMode
                ? 'border-white/5 bg-gray-950/75 shadow-[0_-8px_32px_0_rgba(0,0,0,0.37)]'
                : 'border-gray-200 bg-white/75 shadow-[0_-8px_32px_0_rgba(31,38,135,0.08)]'
            }`}
          >
            <div className="mx-auto max-w-4xl px-4 py-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  title={t('reader.previousEpisode')}
                  aria-label={t('reader.previousEpisode')}
                  onClick={() => goToEpisode(Number(episodeNumber) - 1)}
                  disabled={!hasPrev}
                  className={`flex min-h-[44px] items-center gap-2 rounded-2xl px-4 py-2 transition ${
                    hasPrev
                      ? darkMode
                        ? 'hover:bg-white/10'
                        : 'hover:bg-gray-100'
                      : 'cursor-not-allowed opacity-30'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="hidden sm:inline">{t('readerPage.prevEpisode')}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    title={t('webtoon.likes')}
                    aria-label={t('webtoon.likes')}
                    onClick={() => {
                      if (webtoonId) toggleLike(webtoonId)
                    }}
                    className={`flex min-h-[44px] items-center gap-1 rounded-2xl px-4 py-2 transition ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    } ${liked ? 'text-red-500' : ''}`}
                  >
                    <Heart className={`h-5 w-5 ${liked ? 'animate-pulse fill-current' : ''}`} />
                  </button>

                  <button
                    type="button"
                    title={
                      webtoonId && isBookmarked(webtoonId)
                        ? t('webtoonDetail.saved')
                        : t('webtoonDetail.save')
                    }
                    aria-label={
                      webtoonId && isBookmarked(webtoonId)
                        ? t('webtoonDetail.saved')
                        : t('webtoonDetail.save')
                    }
                    onClick={() => {
                      if (webtoonId) toggleBookmark(webtoonId)
                    }}
                    className={`flex min-h-[44px] items-center gap-1 rounded-2xl px-4 py-2 transition ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    } ${webtoonId && isBookmarked(webtoonId) ? 'text-primary-500' : ''}`}
                  >
                    <Bookmark
                      className={`h-5 w-5 ${webtoonId && isBookmarked(webtoonId) ? 'fill-current' : ''}`}
                    />
                  </button>

                  <Link
                    to={`/webtoon/${webtoonId}`}
                    title={t('readerPage.episodeList')}
                    aria-label={t('readerPage.episodeList')}
                    className={`flex min-h-[44px] items-center gap-1 rounded-2xl px-4 py-2 transition ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </Link>
                </div>

                <button
                  type="button"
                  title={t('reader.nextEpisode')}
                  aria-label={t('reader.nextEpisode')}
                  onClick={() => goToEpisode(Number(episodeNumber) + 1)}
                  disabled={!hasNext}
                  className={`flex min-h-[44px] items-center gap-2 rounded-2xl px-4 py-2 transition ${
                    hasNext
                      ? darkMode
                        ? 'hover:bg-white/10'
                        : 'hover:bg-gray-100'
                      : 'cursor-not-allowed opacity-30'
                  }`}
                >
                  <span className="hidden sm:inline">{t('readerPage.nextEpisode')}</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ GLASSMORPHIC SETTINGS BOTTOM SHEET ═══════ */}
      <AnimatePresence>
        {showSettings && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
            />
            {/* Sheet drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`safe-bottom fixed right-0 bottom-0 left-0 z-50 rounded-t-3xl border-t p-6 shadow-[0_-12px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-colors duration-300 ${
                darkMode
                  ? 'border-white/10 bg-gray-950/90 text-white'
                  : 'border-gray-200 bg-white/90 text-gray-900'
              }`}
            >
              <div className="mx-auto max-w-md">
                {/* Drag handle decoration */}
                <div className="mx-auto mb-5 h-1.5 w-12 rounded-2xl bg-gray-400/30" />

                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-bold">{t('readerPage.settings')}</h3>
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    aria-label={t('readerPage.settings')}
                    className={`rounded-2xl p-2 transition ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Theme Mode Preferences */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold tracking-wider text-gray-400 uppercase">
                      {t('profilePage.preferences')}
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setDarkMode(false)}
                        className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 font-semibold transition ${
                          !darkMode
                            ? 'border-primary-500 bg-primary-600/10 text-primary-500'
                            : 'border-white/5 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <Sun className="h-5 w-5" />
                        {t('reader.lightMode')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDarkMode(true)}
                        className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 font-semibold transition ${
                          darkMode
                            ? 'border-primary-500 bg-primary-600/10 text-primary-500'
                            : 'border-white/5 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <Moon className="h-5 w-5" />
                        {t('reader.darkMode')}
                      </button>
                    </div>
                  </div>

                  {/* Simulated Brightness Overlay Slider */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
                        {t('readerPage.brightness')}
                      </label>
                      <span className="text-primary-500 text-xs font-bold">
                        {Math.round(brightness * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Sun className="h-4 w-4 text-gray-400" />
                      <input
                        type="range"
                        min="0.25"
                        max="1"
                        step="0.05"
                        value={brightness}
                        onChange={(e) => setBrightness(parseFloat(e.target.value))}
                        className={`accent-primary-500 h-1.5 w-full cursor-pointer appearance-none rounded-2xl ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}
                        aria-label={t('readerPage.brightness')}
                      />
                      <Sun className="h-5 w-5 text-gray-300" />
                    </div>
                  </div>

                  {/* Font Sizes controls */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold tracking-wider text-gray-400 uppercase">
                      {t('reader.fontSize')}
                    </label>
                    <div className="flex gap-3">
                      {(['sm', 'md', 'lg'] as const).map((size) => (
                        <button
                          type="button"
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={`min-h-[44px] flex-1 rounded-2xl border px-3 py-2.5 font-semibold transition ${
                            fontSize === size
                              ? 'border-primary-500 bg-primary-600/10 text-primary-500'
                              : 'border-white/5 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <Type className="mx-auto h-4 w-4" />
                          <span className="mt-1 block text-xs">
                            {size === 'sm'
                              ? t('legal.sizeSmall')
                              : size === 'md'
                                ? t('legal.sizeMedium')
                                : t('legal.sizeLarge')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════ COMMENTS SLIDE OVER MODAL ═══════ */}
      <Modal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        title={t('readerPage.comments')}
        size="md"
      >
        <ReaderCommentsPanel webtoonId={webtoonId!} episodeNumber={episodeNum} />
      </Modal>
    </div>
  )
}

export default ReaderPage
