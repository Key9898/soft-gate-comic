import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  List,
  Settings,
  X,
  Heart,
  MessageCircle,
  Bookmark,
  Lock,
  Share2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button, { ButtonLink } from '../../components/Button'
import Modal from '../../components/Modal'
import SEO from '../../components/SEO/SEO'
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
  isPlaceholderStrip,
  nextDropForSeries,
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
  clampPanOffset,
  readerMidAdAfterIndex,
  addEpisodeReport,
  hasEpisodeReport,
  type ReaderImageFit,
  type ReaderPrefs,
} from '../../lib/reader'
import { isMockApi } from '../../lib/api/isMockApi'
import { episodeCommentKey } from '../../lib/comments'
import { useCommentsThread } from '../../hooks/useCommentsThread'
import { formatCount } from '../../lib/utils/formatters'
import CommentsSheet from '../../components/Comments/CommentsSheet'
import ReaderCommentsPanel from './components/ReaderCommentsPanel'
import ReaderEpisodeSheet from './components/ReaderEpisodeSheet'
import ReaderSettingsSheet from './components/ReaderSettingsSheet'
import ReaderSkeleton from './components/ReaderSkeleton'
import ReaderAdSlot from './components/ReaderAdSlot'
import ReaderCompletePortal from './components/ReaderCompletePortal'
import NotFoundPage from '../info/NotFoundPage'
import CatalogLoadFailPage from '../info/CatalogLoadFailPage'

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

const chromeSpring = { type: 'spring' as const, stiffness: 260, damping: 22 }

/** Matches the system back/forward edge-swipe zone on iOS and Android. */
const SYSTEM_EDGE_GUTTER_PX = 24

const ReaderPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'
  const { webtoonId, episodeNumber } = useParams()
  const navigate = useNavigate()
  const { webtoons, episodes, isLoading, error: catalogError, retry } = useData()
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

  const [showHeader, setShowHeader] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showEpisodeSheet, setShowEpisodeSheet] = useState(false)
  const [darkMode, setDarkMode] = useState(DEFAULT_READER_PREFS.darkMode)
  const [fontSize, setFontSize] = useState(DEFAULT_READER_PREFS.fontSize)
  const [showComments, setShowComments] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [brightness, setBrightness] = useState(DEFAULT_READER_PREFS.brightness)
  const [imageFit, setImageFit] = useState<ReaderImageFit>(DEFAULT_READER_PREFS.imageFit)
  const [unlockError, setUnlockError] = useState('')
  const [unlockPending, setUnlockPending] = useState(false)
  const [unlockConfirm, setUnlockConfirm] = useState(false)
  const [unlockNotice, setUnlockNotice] = useState('')
  const [unlockShortfall, setUnlockShortfall] = useState(0)
  const [ageOk, setAgeOk] = useState(() => hasAgeConfirm(null))
  const [shareStatus, setShareStatus] = useState('')
  const [reported, setReported] = useState(false)
  const [reportConfirm, setReportConfirm] = useState(false)

  const lastScrollPos = useRef<number>(0)
  const restoreDoneRef = useRef(false)
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastPersistedRatioRef = useRef<number | null>(null)
  const historyRef = useRef(history)
  historyRef.current = history
  const [pinchScale, setPinchScale] = useState(1)
  const [pinchOrigin, setPinchOrigin] = useState({ x: 0, y: 0 })
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const pinchScaleRef = useRef(1)
  pinchScaleRef.current = pinchScale
  const panRef = useRef(pan)
  panRef.current = pan
  const pointersRef = useRef(new Map<number, { x: number; y: number }>())
  const swipeOriginRef = useRef<{ x: number; y: number; type: string } | null>(null)
  const pinchStartRef = useRef<{ dist: number; scale: number } | null>(null)
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)
  const consumeClickRef = useRef(false)
  const lastTapRef = useRef<{ t: number; x: number; y: number } | null>(null)

  useEffect(() => {
    setAgeOk(hasAgeConfirm(user?.id ?? null))
  }, [user?.id])

  const webtoon = webtoons.find((w) => w.id === webtoonId)
  const currentEpisode = episodes.find(
    (e) => e.webtoonId === webtoonId && e.episodeNumber === Number(episodeNumber)
  )
  const nextEpisode = episodes.find(
    (e) => e.webtoonId === webtoonId && e.episodeNumber === Number(episodeNumber) + 1
  )
  const ageBlocked = Boolean(webtoon && requiresAgeConfirm(webtoon) && !ageOk)

  const episodeNum = Number(episodeNumber)
  const commentKey =
    typeof webtoonId === 'string' && Number.isInteger(episodeNum) && episodeNum >= 1
      ? episodeCommentKey(webtoonId, episodeNum)
      : ''
  const commentsThread = useCommentsThread(commentKey)
  const publishedEpisodes = webtoonId ? publishedEpisodesForSeries(episodes, webtoonId) : []
  const hasPrev = publishedEpisodes.some((e) => e.episodeNumber === episodeNum - 1)
  const hasNext = publishedEpisodes.some((e) => e.episodeNumber === episodeNum + 1)
  const coinUnlocked = typeof webtoonId === 'string' && isEpisodeUnlocked(webtoonId, episodeNum)
  const locked = currentEpisode ? isEpisodeLocked(currentEpisode, coinUnlocked) : false
  const episodeKey = `${webtoonId ?? ''}:${currentEpisode?.episodeNumber ?? episodeNum}`
  const fromPath = `/read/${webtoonId}/${episodeNumber}`
  const midAdAfter = currentEpisode ? readerMidAdAfterIndex(currentEpisode.images.length) : null
  const endOfSeriesDrop = !hasNext && webtoonId ? nextDropForSeries(episodes, webtoonId) : undefined
  const [nowTick, setNowTick] = useState(() => Date.now())
  useEffect(() => {
    // Only ticks once the reader is actually at the end of a series with a drop
    // scheduled — no interval running behind every page of every episode.
    if (!endOfSeriesDrop) return
    const timer = window.setInterval(() => setNowTick(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [endOfSeriesDrop])

  const related = useMemo(() => {
    if (!webtoon) return []
    const tokens = new Set(webtoon.genres.map((g) => g.trim().toLowerCase()).filter(Boolean))
    return [...webtoons]
      .filter((w) => w.id !== webtoon.id && w.status !== 'draft')
      .filter((w) => w.genres.some((g) => tokens.has(g.trim().toLowerCase())))
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 6)
  }, [webtoons, webtoon])

  useEffect(() => {
    if (typeof webtoonId === 'string' && Number.isInteger(episodeNum)) {
      setReported(hasEpisodeReport(webtoonId, episodeNum))
      setReportConfirm(false)
    }
  }, [webtoonId, episodeNum])

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
    setPan({ x: 0, y: 0 })
    pointersRef.current.clear()
    swipeOriginRef.current = null
    pinchStartRef.current = null
    panStartRef.current = null
    lastTapRef.current = null
    if (persistTimerRef.current) {
      clearTimeout(persistTimerRef.current)
      persistTimerRef.current = null
    }
  }, [episodeKey])

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
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key !== 'ArrowLeft' &&
        e.key !== 'ArrowRight' &&
        e.key !== 't' &&
        e.key !== 'T' &&
        e.key !== 'Escape'
      ) {
        return
      }
      if (showSettings || showComments || showEpisodeSheet) return
      if (isEditableReaderTarget(e.target)) return
      // Chrome could only be recovered by scrolling up, so a keyboard reader who
      // scrolled down had no way back to the toolbar, and no way out of the reader.
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault()
        setShowHeader((open) => !open)
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        navigate(`/webtoon/${webtoonId}`)
        return
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
  }, [
    showSettings,
    showComments,
    showEpisodeSheet,
    hasPrev,
    hasNext,
    goToEpisode,
    episodeNum,
    navigate,
    webtoonId,
  ])

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

    const timeoutId = window.setTimeout(() => {
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
    }, 50)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [engagementReady, webtoon, currentEpisode, webtoonId, locked, ageBlocked, isAuthenticated])

  useEffect(() => {
    if (!webtoon || !currentEpisode) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight
      const ratio = scrollRatioFromMetrics(scrollTop, scrollHeight, viewportHeight)
      const progress = ratio * 100
      setReadingProgress(Math.min(progress, 100))

      if (scrollTop > 120) {
        if (scrollTop > lastScrollPos.current) {
          setShowHeader(false)
        } else {
          setShowHeader(true)
        }
      } else {
        setShowHeader(true)
      }

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
    // A failed catalog fetch is not a deleted series. Telling a reader their series
    // does not exist, when the truth is the request failed, sends them away from
    // something that is still there — and `retry` was already in scope, unused.
    if (catalogError) {
      return <CatalogLoadFailPage onRetry={retry} backHref={`/webtoon/${webtoonId ?? ''}`} />
    }
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
      panStartRef.current = null
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
    if (pinchScaleRef.current > 1) {
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: panRef.current.x,
        panY: panRef.current.y,
      }
      swipeOriginRef.current = null
      return
    }
    if (e.pointerType === 'touch' || e.pointerType === 'pen') {
      // A swipe that starts in the screen-edge gutter belongs to the OS: on iOS a
      // right-swipe from the left edge is Back, and claiming it as "previous episode"
      // makes both gestures unreliable.
      const inEdgeGutter =
        e.clientX <= SYSTEM_EDGE_GUTTER_PX || e.clientX >= window.innerWidth - SYSTEM_EDGE_GUTTER_PX
      swipeOriginRef.current = inEdgeGutter
        ? null
        : { x: e.clientX, y: e.clientY, type: e.pointerType }
    }
  }

  const onStripPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointersRef.current.size >= 2 && pinchStartRef.current) {
      consumeClickRef.current = true
      const pts = [...pointersRef.current.values()]
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const next = clampPinchScale(
        pinchStartRef.current.scale * (dist / pinchStartRef.current.dist)
      )
      setPinchScale(next)
      if (next <= 1) setPan({ x: 0, y: 0 })
      return
    }
    const panStart = panStartRef.current
    if (panStart && pinchScaleRef.current > 1 && pointersRef.current.size === 1) {
      consumeClickRef.current = true
      const rect = e.currentTarget.getBoundingClientRect()
      setPan(
        clampPanOffset(
          panStart.panX + (e.clientX - panStart.x),
          panStart.panY + (e.clientY - panStart.y),
          pinchScaleRef.current,
          rect.width,
          rect.height
        )
      )
    }
  }

  const onStripPointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeOriginRef.current
    const wasPanning = Boolean(panStartRef.current)
    pointersRef.current.delete(e.pointerId)
    if (pointersRef.current.size < 2) pinchStartRef.current = null
    panStartRef.current = null
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
    const now = Date.now()
    const prev = lastTapRef.current
    if (prev && now - prev.t <= 300 && Math.hypot(e.clientX - prev.x, e.clientY - prev.y) <= 24) {
      consumeClickRef.current = true
      lastTapRef.current = null
      setPinchScale(1)
      setPan({ x: 0, y: 0 })
      swipeOriginRef.current = null
      return
    }
    lastTapRef.current = { t: now, x: e.clientX, y: e.clientY }
    if (wasPanning || pinchScaleRef.current > 1) {
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
    }
  }

  const onStripClick = (e: { stopPropagation: () => void }) => {
    if (!consumeClickRef.current) return
    e.stopPropagation()
    consumeClickRef.current = false
  }

  const bgClass = 'bg-canvas'
  const textClass = 'text-ink'
  const fontClass = fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg' : 'text-base'
  const liked = Boolean(webtoonId && isLiked(webtoonId))
  const chromeHover = 'hover:bg-raised'
  const scaled = pinchScale > 1

  const handleUnlock = async () => {
    if (!webtoonId || !currentEpisode) return
    setUnlockError('')
    setUnlockShortfall(0)
    if (!isAuthenticated) {
      // The end card offers register-first while this offered login-first: two
      // different answers to the same question. Both carry the reason now.
      navigate(registrationOpen ? '/register' : '/login', {
        state: {
          from: { pathname: fromPath },
          reason: t('auth.reasonUnlockEpisode', { n: currentEpisode.episodeNumber }),
        },
      })
      return
    }
    setUnlockPending(true)
    try {
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
          setUnlockShortfall(Math.max(0, currentEpisode.coinPrice - balance))
          setUnlockError(t('readerPage.insufficientCoins', { balance }))
        }
        setUnlockConfirm(false)
        return
      }
      setUnlockConfirm(false)
      setUnlockNotice(
        t('readerPage.unlockedAnnounce', {
          n: currentEpisode.episodeNumber,
          balance: Math.max(0, balance - currentEpisode.coinPrice),
        })
      )
      retry()
    } finally {
      setUnlockPending(false)
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}${fromPath}`
    const title = `${webtoon.title[lang]} — ${currentEpisode.title[lang]}`
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
      window.setTimeout(() => setShareStatus(''), 2000)
    } catch {
      setShareStatus('')
    }
  }

  const handleAskReport = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: fromPath } } })
      return
    }
    setReportConfirm(true)
  }

  const handleConfirmReport = () => {
    if (!webtoonId) return
    addEpisodeReport(webtoonId, episodeNum)
    setReported(true)
    setReportConfirm(false)
  }

  return (
    <div
      data-testid="reader-root"
      data-theme={darkMode ? 'immersive' : undefined}
      className={`min-h-screen ${bgClass} ${textClass} ${fontClass} transition-colors duration-300`}
    >
      <SEO
        title={`${webtoon?.title[lang] ?? ''} — #${episodeNumber} ${currentEpisode?.title[lang] ?? ''}`}
        description={currentEpisode?.description?.[lang] || webtoon?.description[lang]}
        noindex
        omitJsonLd
      />
      <div
        className="pointer-events-none fixed inset-0 z-[60] bg-black transition-opacity duration-150"
        style={{ opacity: 1 - brightness }}
        aria-hidden="true"
      />

      <p role="status" aria-live="polite" className="sr-only">
        {unlockNotice}
      </p>

      <AnimatePresence>
        {showHeader && (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={chromeSpring}
            className={`safe-top border-edge fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
              darkMode
                ? 'bg-gray-950/75 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]'
                : 'bg-white/75 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)]'
            }`}
          >
            <div className="relative mx-auto max-w-4xl px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/webtoon/${webtoonId}`}
                    title={t('readerPage.closeReader')}
                    aria-label={t('readerPage.closeReader')}
                    className={`flex min-h-11 min-w-11 items-center justify-center rounded-2xl transition ${chromeHover}`}
                  >
                    <X className="h-5 w-5" />
                  </Link>
                  <div>
                    <h1 className="max-w-[160px] truncate text-sm font-bold sm:max-w-[300px] sm:text-base">
                      {currentEpisode.title[lang]}
                    </h1>
                    <p className="text-ink-muted flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="font-semibold">{webtoon.title[lang]}</span>
                      <span>•</span>
                      <Link
                        to={`/author/${webtoon.author.id}`}
                        className="hover:text-primary-500 font-semibold"
                      >
                        {webtoon.author.name[lang]}
                      </Link>
                      <span>•</span>
                      <span>{t('readerPage.epShort', { n: episodeNumber })}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    title={t('readerPage.settings')}
                    aria-label={t('readerPage.settings')}
                    onClick={() => setShowSettings(!showSettings)}
                    className={`flex min-h-11 min-w-11 items-center justify-center rounded-2xl transition ${chromeHover} ${
                      showSettings ? 'text-primary-500' : ''
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    title={t('readerPage.comments')}
                    aria-label={t('readerPage.comments')}
                    onClick={() => setShowComments(true)}
                    className={`flex min-h-11 items-center gap-1 rounded-2xl px-2.5 py-2.5 transition ${chromeHover}`}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-xs font-semibold">{commentsThread.comments.length}</span>
                  </button>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-200/20">
                <div
                  className="progress-bar from-primary-500 to-accent-600 h-full bg-gradient-to-r"
                  style={{
                    transform: `scaleX(${Math.max(0, Math.min(100, readingProgress)) / 100})`,
                  }}
                  role="progressbar"
                  aria-valuenow={Math.round(readingProgress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={t('reader.readingProgress')}
                />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <button
        type="button"
        title={t('reader.previousEpisode')}
        aria-label={t('reader.previousEpisode')}
        disabled={!hasPrev}
        onClick={(e) => {
          e.stopPropagation()
          goToEpisode(episodeNum - 1)
        }}
        className={`fixed left-2 top-1/2 z-[45] hidden min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-2xl md:flex ${chromeHover} ${
          hasPrev ? '' : 'cursor-not-allowed opacity-30'
        } text-ink ring-1 ${darkMode ? 'bg-gray-950/80 ring-white/15' : 'bg-white/90 ring-gray-900/10'} shadow-md`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        title={t('reader.nextEpisode')}
        aria-label={t('reader.nextEpisode')}
        disabled={!hasNext}
        onClick={(e) => {
          e.stopPropagation()
          goToEpisode(episodeNum + 1)
        }}
        className={`fixed right-2 top-1/2 z-[45] hidden min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-2xl md:flex ${chromeHover} ${
          hasNext ? '' : 'cursor-not-allowed opacity-30'
        } text-ink ring-1 ${darkMode ? 'bg-gray-950/80 ring-white/15' : 'bg-white/90 ring-gray-900/10'} shadow-md`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Padding is constant: the chrome is fixed, so tying page padding to its
          visibility moved the strip ~72px under the reader's finger on every tap. */}
      <main
        className={`${imageFit === 'full' ? 'w-full' : 'mx-auto max-w-2xl'} px-0 pb-16 pt-20 sm:px-2 md:pt-24`}
        onClick={() => setShowHeader(!showHeader)}
      >
        {locked ? (
          <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
            <div className="shape-circle border-edge bg-raised mb-6 flex h-24 w-24 items-center justify-center border shadow-lg backdrop-blur">
              <Lock className="text-accent-500 h-10 w-10" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">{t('readerPage.premiumEpisode')}</h2>
            <p className="text-ink-muted mb-4 max-w-xs text-sm">
              {t('readerPage.unlockFor', { coins: currentEpisode.coinPrice })}
            </p>
            {hasWaitSchedule(currentEpisode) && currentEpisode.freeAt ? (
              <p className="text-ink-muted mb-4 max-w-sm text-sm">
                {t('readerPage.waitFreeWhen', {
                  when: formatWaitFreeAt(currentEpisode.freeAt),
                })}
              </p>
            ) : null}
            {isAuthenticated ? (
              <div className="text-ink-muted mb-6 space-y-1 text-xs">
                <p>
                  {t('coinsPage.yourBalance')}: <span className="tabular-nums">{balance}</span>
                </p>
                {balance >= currentEpisode.coinPrice ? (
                  <p>{t('readerPage.balanceAfter', { n: balance - currentEpisode.coinPrice })}</p>
                ) : null}
              </div>
            ) : null}
            {unlockError ? (
              <div
                role="alert"
                className="border-danger-edge bg-danger-surface mb-4 w-full max-w-sm rounded-2xl border px-4 py-3 text-left"
              >
                <p className="text-sm font-semibold text-red-500">{unlockError}</p>
                {unlockShortfall > 0 ? (
                  <>
                    <p className="text-ink-secondary mt-1 text-sm">
                      {t('readerPage.shortfall', { n: unlockShortfall })}
                    </p>
                    <ButtonLink
                      to="/coins"
                      state={{
                        from: fromPath,
                        needCoins: unlockShortfall,
                        episodeNumber: currentEpisode.episodeNumber,
                        seriesTitle: webtoon?.title[lang] ?? '',
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 font-semibold"
                    >
                      {t('readerPage.topUpAndReturn')}
                    </ButtonLink>
                  </>
                ) : null}
              </div>
            ) : null}
            {unlockConfirm && isAuthenticated ? (
              <div className="w-full max-w-sm">
                <p className="text-ink-secondary mb-3 text-sm">
                  {t('readerPage.confirmUnlockBody', {
                    n: currentEpisode.episodeNumber,
                    coins: currentEpisode.coinPrice,
                    after: Math.max(0, balance - currentEpisode.coinPrice),
                  })}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button
                    size="lg"
                    isLoading={unlockPending}
                    onClick={(e) => {
                      e.stopPropagation()
                      void handleUnlock()
                    }}
                  >
                    {t('readerPage.unlockCta', { coins: currentEpisode.coinPrice })}
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    disabled={unlockPending}
                    onClick={(e) => {
                      e.stopPropagation()
                      setUnlockConfirm(false)
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size="lg"
                isLoading={unlockPending}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isAuthenticated) {
                    void handleUnlock()
                    return
                  }
                  setUnlockError('')
                  setUnlockShortfall(0)
                  setUnlockConfirm(true)
                }}
              >
                {isAuthenticated
                  ? t('readerPage.unlockCta', { coins: currentEpisode.coinPrice })
                  : t('readerPage.loginToUnlock')}
              </Button>
            )}
          </div>
        ) : currentEpisode.images.length > 0 ? (
          <>
            {isPlaceholderStrip(currentEpisode, webtoon.coverImage) ? (
              <p
                data-testid="reader-strip-demo"
                className="text-ink-muted mx-auto mb-2 max-w-2xl px-4 text-center text-xs font-semibold"
              >
                {t('readerPage.stripDemo')}
              </p>
            ) : null}
            <div
              data-testid="reader-strip-stack"
              className={`flex flex-col gap-0 ${imageFit === 'full' ? 'w-full' : ''} ${
                scaled ? 'overflow-visible' : 'overflow-hidden'
              } ${scaled ? '' : 'touch-pan-y'}`}
              style={
                pinchScale === 1 && pan.x === 0 && pan.y === 0
                  ? undefined
                  : {
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${pinchScale})`,
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
                  <div key={`${src}-${index}`}>
                    <ReaderPanelImage
                      src={src}
                      alt={`${currentEpisode.title[lang]} strip ${index + 1}`}
                      loading={index < 2 ? 'eager' : 'lazy'}
                      priority={index === 0}
                      width={size?.width}
                      height={size?.height}
                    />
                    {midAdAfter === index ? <ReaderAdSlot variant="mid" /> : null}
                  </div>
                )
              })}
              <ReaderAdSlot variant="end" />
            </div>
          </>
        ) : (
          <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
            <p className="text-ink-muted text-sm">{t('readerPage.noImages')}</p>
          </div>
        )}

        {!locked ? (
          <ReaderCompletePortal
            webtoonId={webtoonId!}
            episodeNumber={episodeNum}
            darkMode={darkMode}
            lang={lang}
            comments={commentsThread.comments}
            onOpenComments={() => setShowComments(true)}
            onAddComment={commentsThread.add}
            hasNext={hasNext}
            nextEpisode={nextEpisode}
            nextEpisodeNumber={episodeNum + 1}
            nextEpisodeLocked={
              nextEpisode
                ? isEpisodeLocked(
                    nextEpisode,
                    typeof webtoonId === 'string' &&
                      isEpisodeUnlocked(webtoonId, nextEpisode.episodeNumber)
                  )
                : false
            }
            seriesCover={webtoon?.coverImage}
            onNext={() => goToEpisode(episodeNum + 1)}
            isAuthenticated={isAuthenticated}
            fromPath={fromPath}
            onGuestRegister={() =>
              navigate(registrationOpen ? '/register' : '/login', {
                state: { from: { pathname: fromPath } },
              })
            }
            related={related}
            nextDrop={endOfSeriesDrop}
            now={nowTick}
            seriesHref={`/webtoon/${webtoonId}`}
            isSubscribed={Boolean(webtoonId && isBookmarked(webtoonId))}
            onSubscribe={() => webtoonId && toggleBookmark(webtoonId)}
            reported={reported}
            reportConfirm={reportConfirm}
            onAskReport={handleAskReport}
            onCancelReport={() => setReportConfirm(false)}
            onConfirmReport={handleConfirmReport}
          />
        ) : null}
      </main>

      <AnimatePresence>
        {showHeader && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={chromeSpring}
            className={`safe-bottom border-edge fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md transition-colors duration-300 ${
              darkMode
                ? 'bg-gray-950/75 shadow-[0_-8px_32px_0_rgba(0,0,0,0.37)]'
                : 'bg-white/75 shadow-[0_-8px_32px_0_rgba(31,38,135,0.08)]'
            }`}
          >
            <div className="mx-auto max-w-4xl px-4 py-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  title={t('reader.previousEpisode')}
                  aria-label={t('reader.previousEpisode')}
                  onClick={() => goToEpisode(episodeNum - 1)}
                  disabled={!hasPrev}
                  className={`flex min-h-[44px] items-center gap-2 rounded-2xl px-4 py-2 transition ${
                    hasPrev ? chromeHover : 'cursor-not-allowed opacity-30'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="hidden sm:inline">{t('readerPage.prevEpisode')}</span>
                </button>

                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="px-1 text-xs font-semibold tabular-nums">
                    {t('readerPage.progressIndex', {
                      n: episodeNum,
                      total: publishedEpisodes.length,
                    })}
                  </span>
                  <button
                    type="button"
                    title={t('webtoon.likes')}
                    aria-label={t('webtoon.likes')}
                    onClick={() => {
                      if (webtoonId) toggleLike(webtoonId)
                    }}
                    className={`flex min-h-[44px] items-center gap-1 rounded-2xl px-2 py-2 transition sm:px-4 ${chromeHover} ${
                      liked ? 'text-red-500' : ''
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${liked ? 'animate-pulse fill-current' : ''}`} />
                    <span className="text-xs font-semibold">{formatCount(webtoon.likeCount)}</span>
                  </button>

                  <button
                    type="button"
                    title={t('webtoonDetail.share')}
                    aria-label={t('webtoonDetail.share')}
                    onClick={() => {
                      void handleShare()
                    }}
                    className={`flex min-h-[44px] items-center justify-center rounded-2xl px-2 py-2 transition sm:px-3 ${chromeHover}`}
                  >
                    <Share2 className="h-5 w-5" />
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
                    className={`flex min-h-[44px] items-center gap-1 rounded-2xl px-2 py-2 transition sm:px-4 ${chromeHover} ${
                      webtoonId && isBookmarked(webtoonId) ? 'text-primary-500' : ''
                    }`}
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
                    className={`flex min-h-[44px] items-center gap-1 rounded-2xl px-2 py-2 transition sm:px-4 ${chromeHover}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>

                <button
                  type="button"
                  title={t('reader.nextEpisode')}
                  aria-label={t('reader.nextEpisode')}
                  onClick={() => goToEpisode(episodeNum + 1)}
                  disabled={!hasNext}
                  className={`flex min-h-[44px] items-center gap-2 rounded-2xl px-4 py-2 transition ${
                    hasNext ? chromeHover : 'cursor-not-allowed opacity-30'
                  }`}
                >
                  <span className="hidden sm:inline">{t('readerPage.nextEpisode')}</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              {shareStatus ? (
                <p
                  className="text-primary-500 mt-1 text-center text-xs font-semibold"
                  role="status"
                >
                  {shareStatus}
                </p>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReaderSettingsSheet
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        darkMode={darkMode}
        brightness={brightness}
        imageFit={imageFit}
        fontSize={fontSize}
        onDarkMode={setDarkMode}
        onBrightness={setBrightness}
        onImageFit={setImageFit}
        onFontSize={setFontSize}
      />

      <ReaderEpisodeSheet
        isOpen={showEpisodeSheet}
        onClose={() => setShowEpisodeSheet(false)}
        episodes={publishedEpisodes}
        currentEpisodeNumber={episodeNum}
        seriesCover={webtoon.coverImage}
        seriesHref={`/webtoon/${webtoonId}`}
        lang={lang}
        darkMode={darkMode}
        onSelect={goToEpisode}
        isLocked={(episode) =>
          isEpisodeLocked(
            episode,
            typeof webtoonId === 'string' && isEpisodeUnlocked(webtoonId, episode.episodeNumber)
          )
        }
      />

      <CommentsSheet
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        title={t('readerPage.episodeComments')}
        darkMode={darkMode}
      >
        <ReaderCommentsPanel
          webtoonId={webtoonId!}
          episodeNumber={episodeNum}
          controller={commentsThread}
          darkMode={darkMode}
        />
      </CommentsSheet>
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
      // React 18 does not recognise the camelCase prop on <img>: it warns once per
      // panel and drops the hint entirely. Lowercase is passed through as-is.
      {...(priority ? ({ fetchpriority: 'high' } as Record<string, string>) : {})}
      onError={() => setFailed(true)}
    />
  )
}
