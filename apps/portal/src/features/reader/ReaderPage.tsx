import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type PointerEvent as ReactPointerEvent,
} from 'react'
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
  Maximize2,
  RectangleHorizontal,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import SEO from '../../components/SEO/SEO'
import { SeriesRatingControl } from '../../components/SeriesRating'
import { useAuth } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import { isRegistrationOpen } from '../../lib/settings/maintenance'
import { useData } from '../../context/DataContext'
import { useLibrary } from '../../context/LibraryContext'
import { useWallet } from '../../context/WalletContext'
import { useEngagement } from '../../context/EngagementContext'
import { scrollRatioFromMetrics, scrollTopFromRatio } from '../../lib/engagement'
import {
  formatWaitFreeAt,
  hasWaitSchedule,
  isEpisodeLocked,
  isPublishedEpisode,
  panelPixelSize,
  publishedEpisodesForSeries,
} from '../../lib/catalog'
import { confirmAge, hasAgeConfirm, requiresAgeConfirm } from '../../lib/contentRating'
import {
  DEFAULT_READER_PREFS,
  loadReaderPrefs,
  saveReaderPrefs,
  swipeEpisodeDelta,
  clampPinchScale,
  type ReaderImageFit,
  type ReaderPrefs,
} from '../../lib/reader'
import { isMockApi } from '../../lib/api/isMockApi'
import { episodeCommentKey, listComments } from '../../lib/comments'
import useScrollLock from '../../hooks/useScrollLock'
import ReaderCommentsPanel from './components/ReaderCommentsPanel'
import ReaderEpisodeSheet from './components/ReaderEpisodeSheet'
import ReaderSkeleton from './components/ReaderSkeleton'
import NotFoundPage from '../info/NotFoundPage'

function isEditableReaderTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

function sameReaderChrome(a: ReaderPrefs, b: ReaderPrefs) {
  return (
    a.darkMode === b.darkMode &&
    a.brightness === b.brightness &&
    a.fontSize === b.fontSize &&
    a.imageFit === b.imageFit
  )
}

const ReaderPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'
  const { webtoonId, episodeNumber } = useParams()
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()
  const { webtoons, episodes, isLoading, retry } = useData()
  const { isBookmarked, toggleBookmark } = useLibrary()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const { maintenanceMode, allowRegistration } = useSettings()
  const registrationOpen = isRegistrationOpen(maintenanceMode, allowRegistration)
  const { balance, isEpisodeUnlocked, unlockEpisode } = useWallet()
  const {
    isLiked,
    toggleLike,
    recordHistory,
    updateReadingProgress,
    history,
    isReady: engagementReady,
    readerPrefs,
    setReaderPrefs,
    prefsHydrated,
  } = useEngagement()
  const mock = isMockApi()
  const [deviceHydrated, setDeviceHydrated] = useState(false)

  // ── States ─────────────────────────────────────────────────
  const [showHeader, setShowHeader] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showEpisodeSheet, setShowEpisodeSheet] = useState(false)
  const [darkMode, setDarkMode] = useState(DEFAULT_READER_PREFS.darkMode)
  const [fontSize, setFontSize] = useState(DEFAULT_READER_PREFS.fontSize)
  const [showComments, setShowComments] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [brightness, setBrightness] = useState(DEFAULT_READER_PREFS.brightness)
  const [imageFit, setImageFit] = useState<ReaderImageFit>(DEFAULT_READER_PREFS.imageFit)
  const [commentCount, setCommentCount] = useState(0)
  const [estMinutesLeft, setEstMinutesLeft] = useState<number>(3)
  const [totalEstMinutes, setTotalEstMinutes] = useState<number>(1)
  const [unlockError, setUnlockError] = useState('')
  const [ageOk, setAgeOk] = useState(() => hasAgeConfirm(null))

  // Last scroll track
  const lastScrollPos = useRef<number>(0)
  const restoreDoneRef = useRef(false)
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastPersistedRatioRef = useRef<number | null>(null)
  const historyRef = useRef(history)
  historyRef.current = history
  const [pinchScale, setPinchScale] = useState(1)
  const [pinchOrigin, setPinchOrigin] = useState({ x: 0, y: 0 })
  const pinchScaleRef = useRef(1)
  pinchScaleRef.current = pinchScale
  const pointersRef = useRef(new Map<number, { x: number; y: number }>())
  const swipeOriginRef = useRef<{ x: number; y: number; type: string } | null>(null)
  const pinchStartRef = useRef<{ dist: number; scale: number } | null>(null)
  const consumeClickRef = useRef(false)
  const lastTapRef = useRef<{ t: number; x: number; y: number } | null>(null)

  useEffect(() => {
    setAgeOk(hasAgeConfirm(user?.id ?? null))
  }, [user?.id])

  // ── Webtoon & Episode Data ────────────────────────────────
  const webtoon = webtoons.find((w) => w.id === webtoonId)
  const currentEpisode = episodes.find(
    (e) => e.webtoonId === webtoonId && e.episodeNumber === Number(episodeNumber)
  )
  const nextEpisode = episodes.find(
    (e) => e.webtoonId === webtoonId && e.episodeNumber === Number(episodeNumber) + 1
  )
  const ageBlocked = Boolean(webtoon && requiresAgeConfirm(webtoon) && !ageOk)

  const episodeNum = Number(episodeNumber)
  const publishedEpisodes = webtoonId ? publishedEpisodesForSeries(episodes, webtoonId) : []
  const hasPrev = publishedEpisodes.some((e) => e.episodeNumber === episodeNum - 1)
  const hasNext = publishedEpisodes.some((e) => e.episodeNumber === episodeNum + 1)
  const coinUnlocked = typeof webtoonId === 'string' && isEpisodeUnlocked(webtoonId, episodeNum)
  const locked = currentEpisode ? isEpisodeLocked(currentEpisode, coinUnlocked) : false
  const episodeKey = `${webtoonId ?? ''}:${currentEpisode?.episodeNumber ?? episodeNum}`

  useEffect(() => {
    if (locked) return
    const urls = currentEpisode?.images
    if (!urls?.length) return
    urls.slice(2, 5).forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [currentEpisode, locked])

  const flushReadingProgress = useCallback(() => {
    if (!isAuthenticated || !webtoonId || !currentEpisode || locked || ageBlocked) return
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
  }, [isAuthenticated, webtoonId, currentEpisode, locked, ageBlocked, updateReadingProgress])

  const schedulePersist = useCallback(() => {
    if (persistTimerRef.current) clearTimeout(persistTimerRef.current)
    persistTimerRef.current = setTimeout(() => {
      persistTimerRef.current = null
      flushReadingProgress()
    }, 1000)
  }, [flushReadingProgress])

  const goToEpisode = useCallback(
    (num: number) => {
      navigate(`/read/${webtoonId}/${num}`)
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    },
    [navigate, webtoonId]
  )

  useEffect(() => {
    restoreDoneRef.current = false
    lastPersistedRatioRef.current = null
    setPinchScale(1)
    pointersRef.current.clear()
    swipeOriginRef.current = null
    pinchStartRef.current = null
    lastTapRef.current = null
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

  const applyChrome = (prefs: ReaderPrefs) => {
    setDarkMode(prefs.darkMode)
    setFontSize(prefs.fontSize)
    setBrightness(prefs.brightness)
    setImageFit(prefs.imageFit)
  }

  useEffect(() => {
    if (authLoading) {
      applyChrome(DEFAULT_READER_PREFS)
      setDeviceHydrated(false)
      return
    }
    if (!mock && isAuthenticated) {
      setDeviceHydrated(false)
      if (!prefsHydrated) {
        applyChrome(DEFAULT_READER_PREFS)
        return
      }
      applyChrome(readerPrefs)
      return
    }
    applyChrome(loadReaderPrefs())
    setDeviceHydrated(true)
  }, [authLoading, mock, isAuthenticated, prefsHydrated, readerPrefs])

  useEffect(() => {
    if (authLoading) return
    const current: ReaderPrefs = {
      schemaVersion: 1,
      darkMode,
      brightness,
      fontSize,
      imageFit,
    }
    if (!mock && isAuthenticated) {
      if (!prefsHydrated) return
      if (sameReaderChrome(current, readerPrefs)) return
      setReaderPrefs(current)
      return
    }
    if (!deviceHydrated) return
    saveReaderPrefs(current)
  }, [
    authLoading,
    mock,
    isAuthenticated,
    prefsHydrated,
    deviceHydrated,
    darkMode,
    brightness,
    fontSize,
    imageFit,
    readerPrefs,
    setReaderPrefs,
  ])

  useEffect(() => {
    if (!webtoonId || Number.isNaN(episodeNum)) {
      setCommentCount(0)
      return
    }
    setCommentCount(listComments(episodeCommentKey(webtoonId, episodeNum)).length)
  }, [webtoonId, episodeNum, showComments])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if (showSettings || showComments || showEpisodeSheet) return
      const target = e.target as HTMLElement | null
      if (target) {
        const tag = target.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) {
          return
        }
      }
      if (e.key === 'ArrowLeft' && hasPrev) {
        e.preventDefault()
        goToEpisode(episodeNum - 1)
      }
      if (e.key === 'ArrowRight' && hasNext) {
        e.preventDefault()
        goToEpisode(episodeNum + 1)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [showSettings, showComments, showEpisodeSheet, hasPrev, hasNext, goToEpisode, episodeNum])

  useEffect(() => {
    if (!webtoonId || !currentEpisode || locked || ageBlocked) return
    if (!isAuthenticated) return
    recordHistory(webtoonId, currentEpisode.episodeNumber)
  }, [webtoonId, currentEpisode, locked, ageBlocked, isAuthenticated, recordHistory])

  useEffect(() => {
    if (!engagementReady || !webtoon || !currentEpisode || !webtoonId) return

    if (locked || !isAuthenticated || ageBlocked) {
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
    ageBlocked,
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

      if (!locked && !ageBlocked && isAuthenticated && restoreDoneRef.current) {
        schedulePersist()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [webtoon, currentEpisode, locked, ageBlocked, isAuthenticated, schedulePersist])

  if (isLoading) {
    return (
      <ReaderSkeleton
        webtoonId={webtoonId}
        darkMode={authLoading || (!mock && isAuthenticated) ? darkMode : undefined}
        imageFit={authLoading || (!mock && isAuthenticated) ? imageFit : undefined}
      />
    )
  }

  if (!webtoon) {
    return <NotFoundPage variant="series" withSiteChrome />
  }

  if (!currentEpisode || !isPublishedEpisode(currentEpisode)) {
    return <NotFoundPage variant="episode" seriesHref={`/webtoon/${webtoon.id}`} withSiteChrome />
  }

  if (ageBlocked) {
    const hubHref = `/webtoon/${webtoon.id}`
    return (
      <>
        <SEO title={webtoon.title[lang]} description={webtoon.description[lang]} noindex />
        <Modal
          isOpen
          title={t('ageGate.title')}
          onClose={() => navigate(hubHref)}
          closeOnOverlayClick
        >
          <div data-testid="age-gate" className="space-y-4">
            <p className="text-sm leading-relaxed text-gray-600">{t('ageGate.body')}</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => navigate(hubHref)}>
                {t('ageGate.cancel')}
              </Button>
              <Button
                onClick={() => {
                  confirmAge(user?.id ?? null)
                  setAgeOk(true)
                }}
              >
                {t('ageGate.confirm')}
              </Button>
            </div>
          </div>
        </Modal>
      </>
    )
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

  const overlaysOpen = showSettings || showComments || showEpisodeSheet

  const onStripPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (overlaysOpen || isEditableReaderTarget(e.target)) return
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      void 0
    }
    if (pointersRef.current.size === 2) {
      consumeClickRef.current = true
      const pts = [...pointersRef.current.values()]
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      pinchStartRef.current = { dist: dist || 1, scale: pinchScaleRef.current }
      const rect = e.currentTarget.getBoundingClientRect()
      setPinchOrigin({
        x: (pts[0].x + pts[1].x) / 2 - rect.left,
        y: (pts[0].y + pts[1].y) / 2 - rect.top,
      })
      swipeOriginRef.current = null
      return
    }
    if (e.pointerType === 'touch' || e.pointerType === 'pen') {
      swipeOriginRef.current = { x: e.clientX, y: e.clientY, type: e.pointerType }
    }
  }

  const onStripPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointersRef.current.size < 2 || !pinchStartRef.current) return
    consumeClickRef.current = true
    const pts = [...pointersRef.current.values()]
    const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
    setPinchScale(
      clampPinchScale(pinchStartRef.current.scale * (dist / pinchStartRef.current.dist))
    )
  }

  const onStripPointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeOriginRef.current
    pointersRef.current.delete(e.pointerId)
    if (pointersRef.current.size < 2) pinchStartRef.current = null
    if (
      typeof e.currentTarget.hasPointerCapture === 'function' &&
      e.currentTarget.hasPointerCapture(e.pointerId)
    ) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    if (overlaysOpen || isEditableReaderTarget(e.target)) {
      swipeOriginRef.current = null
      return
    }
    if (
      !start ||
      (start.type !== 'touch' && start.type !== 'pen') ||
      pointersRef.current.size > 0
    ) {
      return
    }
    swipeOriginRef.current = null
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    const delta = swipeEpisodeDelta(dx, dy)
    if (delta !== 0) {
      consumeClickRef.current = true
      lastTapRef.current = null
      if (delta < 0 && hasPrev) goToEpisode(episodeNum - 1)
      if (delta > 0 && hasNext) goToEpisode(episodeNum + 1)
      return
    }
    const now = Date.now()
    const prev = lastTapRef.current
    if (prev && now - prev.t <= 300 && Math.hypot(e.clientX - prev.x, e.clientY - prev.y) <= 24) {
      consumeClickRef.current = true
      lastTapRef.current = null
      setPinchScale(1)
      return
    }
    lastTapRef.current = { t: now, x: e.clientX, y: e.clientY }
  }

  const onStripClick = (e: { stopPropagation: () => void }) => {
    if (!consumeClickRef.current) return
    e.stopPropagation()
    consumeClickRef.current = false
  }

  // ── UI Theme classes ───────────────────────────────────────
  const bgClass = darkMode ? 'bg-gray-950' : 'bg-gray-50'
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900'
  const cardBgClass = darkMode ? 'bg-gray-900/60 border-white/5' : 'bg-white/80 border-gray-200'
  const fontClass = fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg' : 'text-base'
  const liked = Boolean(webtoonId && isLiked(webtoonId))

  const handleUnlock = async () => {
    if (!webtoonId || !currentEpisode) return
    setUnlockError('')
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/read/${webtoonId}/${episodeNumber}` } } })
      return
    }
    const result = await unlockEpisode(
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
      return
    }
    retry()
  }

  return (
    <div
      className={`min-h-screen ${bgClass} ${textClass} ${fontClass} transition-colors duration-300`}
    >
      <SEO
        title={`${webtoon?.title[lang] ?? ''} — #${episodeNumber} ${currentEpisode?.title[lang] ?? ''}`}
        description={currentEpisode?.description?.[lang] || webtoon?.description[lang]}
        noindex
        omitJsonLd
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
                    className={`flex min-h-11 items-center gap-1 rounded-2xl px-2.5 py-2.5 transition ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-xs font-bold">{commentCount}</span>
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
        className={`${imageFit === 'full' ? 'w-full' : 'mx-auto max-w-2xl'} px-0 pt-20 pb-16 sm:px-2 md:pt-24`}
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
            {hasWaitSchedule(currentEpisode) && currentEpisode.freeAt ? (
              <p
                className={`mb-4 max-w-sm text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {t('readerPage.waitFreeWhen', {
                  when: formatWaitFreeAt(currentEpisode.freeAt),
                })}
              </p>
            ) : null}
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
          <div
            data-testid="reader-strip-stack"
            className={`flex flex-col gap-0 shadow-xl sm:rounded-2xl ${
              imageFit === 'full' ? 'w-full' : ''
            } ${pinchScale > 1 ? 'overflow-visible' : 'overflow-hidden'} touch-pan-y`}
            style={
              pinchScale === 1
                ? undefined
                : {
                    transform: `scale(${pinchScale})`,
                    transformOrigin: `${pinchOrigin.x}px ${pinchOrigin.y}px`,
                  }
            }
            onPointerDown={onStripPointerDown}
            onPointerMove={onStripPointerMove}
            onPointerUp={onStripPointerEnd}
            onPointerCancel={onStripPointerEnd}
            onClick={onStripClick}
          >
            {currentEpisode.images.map((src, index) => {
              const size = panelPixelSize(
                currentEpisode.images.length,
                currentEpisode.imageSizes,
                index
              )
              return (
                <ReaderPanelImage
                  key={`${src}-${index}`}
                  src={src}
                  alt={`${currentEpisode.title[lang]} strip ${index + 1}`}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  priority={index === 0}
                  width={size?.width}
                  height={size?.height}
                />
              )
            })}
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
                className={`mb-4 max-w-sm text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {t('readerPage.readingTime')}: {t('readerPage.minutes', { mins: totalEstMinutes })}
              </p>

              {webtoonId ? (
                <div className="mb-6 w-full max-w-md">
                  <SeriesRatingControl webtoonId={webtoonId} variant="card" darkMode={darkMode} />
                </div>
              ) : null}

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
                        navigate(registrationOpen ? '/register' : '/login', {
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
                        ? t('webtoonDetail.subscribed')
                        : t('webtoonDetail.subscribe')
                    }
                    aria-label={
                      webtoonId && isBookmarked(webtoonId)
                        ? t('webtoonDetail.subscribed')
                        : t('webtoonDetail.subscribe')
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

                  <button
                    type="button"
                    title={t('readerPage.episodeList')}
                    aria-label={t('readerPage.episodeList')}
                    onClick={() => setShowEpisodeSheet(true)}
                    className={`flex min-h-[44px] items-center gap-1 rounded-2xl px-4 py-2 transition ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
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

                  <div>
                    <label className="mb-3 block text-sm font-semibold tracking-wider text-gray-400 uppercase">
                      {t('readerPage.imageFit')}
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setImageFit('fit')}
                        className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 font-semibold transition ${
                          imageFit === 'fit'
                            ? 'border-primary-500 bg-primary-600/10 text-primary-500'
                            : 'border-white/5 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <RectangleHorizontal className="h-5 w-5" />
                        {t('readerPage.fit')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageFit('full')}
                        className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 font-semibold transition ${
                          imageFit === 'full'
                            ? 'border-primary-500 bg-primary-600/10 text-primary-500'
                            : 'border-white/5 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <Maximize2 className="h-5 w-5" />
                        {t('readerPage.fullWidth')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════ COMMENTS SLIDE OVER MODAL ═══════ */}
      <ReaderEpisodeSheet
        isOpen={showEpisodeSheet}
        onClose={() => setShowEpisodeSheet(false)}
        episodes={publishedEpisodes}
        currentEpisodeNumber={episodeNum}
        seriesCover={webtoon.coverImage}
        seriesHref={`/webtoon/${webtoonId}`}
        lang={lang}
        onSelect={goToEpisode}
        isLocked={(episode) =>
          isEpisodeLocked(
            episode,
            typeof webtoonId === 'string' && isEpisodeUnlocked(webtoonId, episode.episodeNumber)
          )
        }
      />

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

const ReaderPanelImage = ({
  src,
  alt,
  loading,
  priority = false,
  width,
  height,
}: {
  src: string
  alt: string
  loading: 'eager' | 'lazy'
  priority?: boolean
  width?: number
  height?: number
}) => {
  const { t } = useTranslation()
  const [failed, setFailed] = useState(false)
  const [nonce, setNonce] = useState(0)

  if (failed) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3 bg-gray-900 py-16">
        <button
          type="button"
          onClick={() => {
            setFailed(false)
            setNonce((n) => n + 1)
          }}
          className="min-h-11 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-gray-900"
        >
          {t('readerPage.retryPanel')}
        </button>
      </div>
    )
  }

  return (
    <img
      key={nonce}
      src={src}
      alt={alt}
      className="block h-auto w-full"
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      onError={() => setFailed(true)}
    />
  )
}
