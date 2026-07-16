import { useState, useEffect, useRef } from 'react'
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
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { useData } from '../../context/DataContext'

const ReaderPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'
  const { webtoonId, episodeNumber } = useParams()
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()
  const { webtoons, episodes, isLoading } = useData()

  // ── States ─────────────────────────────────────────────────
  const [showHeader, setShowHeader] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [darkMode, setDarkMode] = useState(true) // Default to dark mode for reading
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [showComments, setShowComments] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [brightness, setBrightness] = useState<number>(0.9) // 0.25 to 1.0
  const [hasSound, setHasSound] = useState(false)
  const [estMinutesLeft, setEstMinutesLeft] = useState<number>(3)

  // Last scroll track
  const lastScrollPos = useRef<number>(0)

  // ── Webtoon & Episode Data ────────────────────────────────
  const webtoon = webtoons.find((w) => w.id === webtoonId) || webtoons[0]
  const currentEpisode =
    episodes.find((e) => e.webtoonId === webtoonId && e.episodeNumber === Number(episodeNumber)) ||
    episodes[0]

  const totalEpisodes = episodes.filter((e) => e.webtoonId === webtoonId).length
  const hasPrev = Number(episodeNumber) > 1
  const hasNext = Number(episodeNumber) < totalEpisodes

  // ── Scroll Listener & Reader Metrics ──────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
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
      const remainingScroll = Math.max(0, docHeight - scrollTop)
      // Assuming avg scroll reading speed is 50px per second (3000px per minute)
      const speed = 3000 // pixels per minute
      const minutes = Math.max(1, Math.ceil(remainingScroll / speed))
      setEstMinutesLeft(progress >= 98 ? 0 : minutes)

      lastScrollPos.current = scrollTop
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isLoading || !webtoon || !currentEpisode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="border-primary-600 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
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

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} transition-colors duration-300`}>
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
            className={`fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
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
                    className={`rounded-xl p-2.5 transition ${
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
                      <span>Ep. {episodeNumber}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Reading Time Estimator HUD */}
                  <div
                    className={`hidden rounded-lg px-2.5 py-1.5 text-xs font-semibold sm:block ${
                      darkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {estMinutesLeft > 0
                      ? t('readerPage.minsLeft', { mins: estMinutesLeft })
                      : t('readerPage.read')}
                  </div>

                  <button
                    type="button"
                    title="Toggle Music track"
                    aria-label="Toggle Music track"
                    onClick={() => setHasSound(!hasSound)}
                    className={`rounded-xl p-2.5 transition ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    } ${hasSound ? 'text-primary-500' : 'text-gray-400'}`}
                  >
                    {hasSound ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </button>

                  <button
                    type="button"
                    title={t('readerPage.settings')}
                    aria-label={t('readerPage.settings')}
                    onClick={() => setShowSettings(!showSettings)}
                    className={`rounded-xl p-2.5 transition ${
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
                    className={`rounded-xl p-2.5 transition ${
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
                  className="progress-bar from-primary-500 h-full bg-gradient-to-r to-purple-600 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
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
        onClick={() => setShowHeader(!showHeader)} // Margin tap toggles headers
      >
        {currentEpisode.isPremium ? (
          <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
            <div
              className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full shadow-lg backdrop-blur ${
                darkMode
                  ? 'border border-white/10 bg-white/5'
                  : 'border border-gray-200 bg-gray-100'
              }`}
            >
              <Lock className="h-10 w-10 animate-pulse text-amber-500" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">{t('readerPage.premiumEpisode')}</h2>
            <p className={`mb-8 max-w-xs text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('readerPage.unlockFor', { coins: currentEpisode.coinPrice })}
            </p>
            <Button size="lg">{t('readerPage.unlockWithCoins')}</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-0 overflow-hidden shadow-xl sm:rounded-2xl">
            {/* Dynamic Interactive Webtoon Stripes */}
            {[
              {
                id: 1,
                gradient: 'from-purple-900 to-indigo-900',
                text: 'A silent twilight covers the cityscape...',
                isSpeech: true,
              },
              {
                id: 2,
                gradient: 'from-indigo-900 to-blue-900',
                text: 'Who stands at the gate of shadows?',
                isSpeech: false,
              },
              {
                id: 3,
                gradient: 'from-blue-900 to-cyan-900',
                text: 'Wait! Did you hear that sound?',
                isSpeech: true,
              },
              {
                id: 4,
                gradient: 'from-cyan-950 to-gray-950',
                text: 'The prophecy is coming true.',
                isSpeech: false,
              },
              {
                id: 5,
                gradient: 'from-gray-950 to-purple-950',
                text: 'We must run, before the lock breaks!',
                isSpeech: true,
              },
              {
                id: 6,
                gradient: 'from-purple-950 to-fuchsia-950',
                text: 'Suddenly, a bright spark lights up the sky!',
                isSpeech: false,
              },
              {
                id: 7,
                gradient: 'from-fuchsia-950 to-indigo-950',
                text: 'Everything changes from this moment.',
                isSpeech: true,
              },
              {
                id: 8,
                gradient: 'from-indigo-950 to-gray-900',
                text: 'To be continued...',
                isSpeech: false,
              },
            ].map((panel) => (
              <div
                key={panel.id}
                className={`relative flex aspect-[2/3] w-full flex-col justify-between bg-gradient-to-b ${panel.gradient} border-b border-black/20 p-8 select-none`}
              >
                <div className="absolute top-4 right-4 text-xs font-semibold text-white/20">
                  Panel {panel.id}
                </div>

                {/* Simulated Comic Bubble elements */}
                {panel.isSpeech ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-10%' }}
                    className="mx-auto mt-8 max-w-xs rounded-2xl bg-white p-4 shadow-xl ring-2 ring-black"
                  >
                    <p className="text-center text-sm font-bold text-gray-950">{panel.text}</p>
                    <div className="ring-b-2 ring-r-2 absolute bottom-[-10px] left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white ring-black" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: '-10%' }}
                    className="mt-auto max-w-sm rounded-lg bg-black/45 p-4 text-center backdrop-blur-xs"
                  >
                    <p className="text-xs font-semibold tracking-wider text-white/95 uppercase">
                      {panel.text}
                    </p>
                  </motion.div>
                )}

                {/* Decorative Comic elements */}
                <div className="mx-auto flex h-32 w-32 items-center justify-center opacity-30">
                  <Sparkles className="h-16 w-16 animate-pulse text-white" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══════ CHAPTER COMPLETE CELEBRATION PORTAL ═══════ */}
        {!currentEpisode.isPremium && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className={`mt-12 rounded-3xl border p-6 text-center sm:p-8 ${cardBgClass} relative overflow-hidden`}
          >
            <div
              className="bg-primary-500/10 absolute -top-12 -right-12 h-36 w-36 rounded-full blur-2xl"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-purple-500/10 blur-2xl"
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-primary-500/10 text-primary-500 mb-4 animate-bounce rounded-full p-4">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="mb-2 text-xl font-black tracking-tight sm:text-2xl">
                {t('readerPage.chapterComplete')}
              </h2>
              <p
                className={`mb-6 max-w-sm text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {t('readerPage.readingTime')}: 3 mins
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
                      <div className="bg-primary-600 flex h-12 w-12 items-center justify-center rounded-xl font-bold text-white">
                        {Number(episodeNumber) + 1}
                      </div>
                      <div className="text-left">
                        <span className="text-primary-500 block text-xs font-semibold">
                          Episode {Number(episodeNumber) + 1}
                        </span>
                        <span className="block max-w-[180px] truncate text-sm font-bold text-gray-100">
                          Chapter Continuation
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
                  You have reached the end of this webtoon!
                </p>
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
            className={`fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur-md transition-colors duration-300 ${
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
                  className={`flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 transition ${
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
                    title={isLiked ? t('webtoon.likes') : t('webtoon.likes')}
                    aria-label={isLiked ? t('webtoon.likes') : t('webtoon.likes')}
                    onClick={() => setIsLiked(!isLiked)}
                    className={`flex min-h-[44px] items-center gap-1 rounded-xl px-4 py-2 transition ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    } ${isLiked ? 'text-red-500' : ''}`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'animate-pulse fill-current' : ''}`} />
                  </button>

                  <button
                    type="button"
                    title={isBookmarked ? t('webtoonDetail.saved') : t('webtoonDetail.save')}
                    aria-label={isBookmarked ? t('webtoonDetail.saved') : t('webtoonDetail.save')}
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex min-h-[44px] items-center gap-1 rounded-xl px-4 py-2 transition ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    } ${isBookmarked ? 'text-primary-500' : ''}`}
                  >
                    <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>

                  <Link
                    to={`/webtoon/${webtoonId}`}
                    title={t('readerPage.episodeList')}
                    aria-label={t('readerPage.episodeList')}
                    className={`flex min-h-[44px] items-center gap-1 rounded-xl px-4 py-2 transition ${
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
                  className={`flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 transition ${
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
              className={`fixed right-0 bottom-0 left-0 z-50 rounded-t-3xl border-t p-6 shadow-[0_-12px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-colors duration-300 ${
                darkMode
                  ? 'border-white/10 bg-gray-950/90 text-white'
                  : 'border-gray-200 bg-white/90 text-gray-900'
              }`}
            >
              <div className="mx-auto max-w-md">
                {/* Drag handle decoration */}
                <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-400/30" />

                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-bold">{t('readerPage.settings')}</h3>
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className={`rounded-full p-1.5 transition ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className="h-5 w-5" />
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
                        className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 transition ${
                          !darkMode
                            ? 'border-primary-500 bg-primary-600/10 text-primary-500 font-bold'
                            : 'border-white/5 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <Sun className="h-5 w-5" />
                        {t('reader.lightMode')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDarkMode(true)}
                        className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 transition ${
                          darkMode
                            ? 'border-primary-500 bg-primary-600/10 text-primary-500 font-bold'
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
                        className="accent-primary-500 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
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
                          className={`min-h-[44px] flex-1 rounded-xl border px-3 py-2.5 transition ${
                            fontSize === size
                              ? 'border-primary-500 bg-primary-600/10 text-primary-500 font-bold'
                              : 'border-white/5 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <Type className="mx-auto h-4 w-4" />
                          <span className="mt-1 block text-xs">
                            {size === 'sm'
                              ? t('categories.all')
                              : size === 'md'
                                ? 'Medium'
                                : 'Large'}
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
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="bg-primary-100 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
              <span className="text-primary-700 text-sm font-bold">U</span>
            </div>
            <div className="flex-1">
              <textarea
                placeholder={t('comments.placeholder')}
                aria-label={t('comments.placeholder')}
                className="focus:ring-primary-500 focus:border-primary-500 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:ring-2"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <Button size="sm">{t('comments.post')}</Button>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                <span className="text-sm font-bold text-gray-600">B</span>
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-medium text-gray-900">Book Lover</span>
                  <span className="text-xs text-gray-400">2 {t('notificationsPage.hoursAgo')}</span>
                </div>
                <p className="text-sm text-gray-600">This is amazing! I love the story so far.</p>
                <button type="button" className="hover:text-primary-600 mt-1 text-xs text-gray-500">
                  {t('comments.reply')}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                <span className="text-sm font-bold text-gray-600">W</span>
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-medium text-gray-900">Webtoon Fan</span>
                  <span className="text-xs text-gray-400">5 {t('notificationsPage.hoursAgo')}</span>
                </div>
                <p className="text-sm text-gray-600">The art style is incredible!</p>
                <button type="button" className="hover:text-primary-600 mt-1 text-xs text-gray-500">
                  {t('comments.reply')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ReaderPage
