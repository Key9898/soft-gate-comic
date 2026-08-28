import { useCallback, useEffect, useState, type FocusEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Play, Pause, ChevronRight, Bookmark, Check } from 'lucide-react'
import type { Webtoon } from '@softgate/shared'
import Button from '../../../../components/Button'
import HeroBook3D from '../../../../components/HeroBook3D'

const AUTOPLAY_MS = 5000

export interface HeroSpotlightProps {
  slides: Webtoon[]
  lang: 'mm' | 'en'
  isBookmarked: (webtoonId: string) => boolean
  toggleBookmark: (webtoonId: string) => void
}

const HeroSpotlight = ({ slides, lang, isBookmarked, toggleBookmark }: HeroSpotlightProps) => {
  const { t } = useTranslation()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [index, setIndex] = useState(0)
  const [hoverPaused, setHoverPaused] = useState(false)
  const [userPaused, setUserPaused] = useState(false)

  const count = slides.length
  const safeIndex = count > 0 ? index % count : 0
  const current = slides[safeIndex]

  useEffect(() => {
    setIndex(0)
  }, [slides])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setPrefersReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    setPrefersReducedMotion(mq.matches)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const goTo = useCallback(
    (nextIndex: number) => {
      if (count === 0) return
      setIndex(((nextIndex % count) + count) % count)
    },
    [count]
  )

  const goNext = useCallback(() => {
    goTo(safeIndex + 1)
  }, [goTo, safeIndex])

  useEffect(() => {
    if (count <= 1 || hoverPaused || userPaused || prefersReducedMotion) return
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % count)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [count, hoverPaused, userPaused, prefersReducedMotion, index])

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget as Node | null
    if (next && event.currentTarget.contains(next)) return
    setHoverPaused(false)
  }

  if (!current) return null

  const showControls = count > 1

  return (
    <section
      className="safe-top relative -mt-16 overflow-visible pt-16 text-white"
      aria-roledescription="carousel"
      aria-label={t('a11y.heroCarousel')}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocus={() => setHoverPaused(true)}
      onBlur={handleBlur}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url('/banner/banner.png')` }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-r from-gray-950/70 via-gray-950/30 to-gray-950/45"
        aria-hidden="true"
      />
      <div className="hero-landscape-adjust relative mx-auto flex min-h-[22rem] max-w-7xl flex-col justify-center px-4 py-10 sm:min-h-[26rem] sm:px-6 sm:py-12 lg:min-h-[32rem] lg:px-8 lg:py-14 xl:min-h-[36rem] xl:py-16">
        <div className="hero-spotlight-pair flex flex-col items-center gap-8 lg:mt-12 lg:flex-row lg:items-center lg:gap-12">
          <div className="relative z-10 flex w-full min-w-0 flex-1 flex-col text-center lg:text-left">
            <div
              key={current.id}
              role="group"
              aria-roledescription="slide"
              aria-label={t('a11y.heroSlide', { n: safeIndex + 1, total: count })}
              className="w-full min-w-0"
            >
              <p className="mb-1 text-xs font-semibold tracking-wide text-white/80 uppercase">
                {t('home.spotlightKicker')}
              </p>
              <h1 className="mb-3 text-sm font-semibold tracking-wide text-white/80 uppercase">
                {t('home.pageHeading')}
              </h1>
              <h2 className="mb-4 line-clamp-2 text-3xl font-bold tracking-tight break-words sm:text-4xl md:text-[2.5rem] lg:line-clamp-1 lg:text-5xl xl:text-6xl">
                {current.title[lang]}
              </h2>
              <p className="min-h-2lh mx-auto mb-8 line-clamp-2 max-w-md text-base break-words text-white/80 sm:max-w-lg sm:text-lg lg:mx-0">
                {current.description[lang]}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Link
                  to={`/webtoon/${current.id}`}
                  className="focus:ring-offset-primary-700 rounded-2xl focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
                >
                  <Button variant="secondary" leftIcon={<Play className="h-5 w-5" />}>
                    {t('home.startReading')}
                  </Button>
                </Link>
                <Button
                  variant={isBookmarked(current.id) ? 'secondary' : 'heroOutline'}
                  onClick={() => toggleBookmark(current.id)}
                  leftIcon={
                    isBookmarked(current.id) ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )
                  }
                  aria-label={
                    isBookmarked(current.id)
                      ? t('webtoonDetail.subscribed')
                      : t('home.addToLibrary')
                  }
                >
                  {isBookmarked(current.id)
                    ? t('webtoonDetail.subscribed')
                    : t('home.addToLibrary')}
                </Button>
              </div>
            </div>

            {showControls ? (
              <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
                <div
                  className="flex items-center gap-1"
                  role="tablist"
                  aria-label={t('a11y.heroCarousel')}
                >
                  {slides.map((slide, i) => {
                    const active = i === safeIndex
                    return (
                      <button
                        key={slide.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-label={t('a11y.heroSlide', { n: i + 1, total: count })}
                        onClick={() => goTo(i)}
                        className="focus:ring-primary-400 flex min-h-11 min-w-11 items-center justify-center rounded-2xl focus:ring-2 focus:outline-none"
                      >
                        <span
                          className={`block h-2.5 w-2.5 rounded-2xl transition ${
                            active ? 'bg-primary-600' : 'bg-white/40'
                          }`}
                          aria-hidden
                        />
                      </button>
                    )
                  })}
                </div>
                {!prefersReducedMotion ? (
                  <button
                    type="button"
                    onClick={() => setUserPaused((prev) => !prev)}
                    aria-label={userPaused ? t('a11y.heroPlay') : t('a11y.heroPause')}
                    className="shape-circle focus:ring-primary-400 flex min-h-11 min-w-11 shrink-0 items-center justify-center bg-white/10 text-white shadow-sm ring-1 ring-white/20 transition hover:bg-white/20 focus:ring-2 focus:outline-none"
                  >
                    {userPaused ? (
                      <Play className="h-5 w-5" aria-hidden />
                    ) : (
                      <Pause className="h-5 w-5" aria-hidden />
                    )}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={goNext}
                  aria-label={t('a11y.heroNext')}
                  className="shape-circle focus:ring-primary-400 flex min-h-11 min-w-11 shrink-0 items-center justify-center bg-white/10 text-white shadow-sm ring-1 ring-white/20 transition hover:bg-white/20 focus:ring-2 focus:outline-none"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
              </div>
            ) : null}
          </div>

          <div className="relative z-0 mx-auto block w-56 overflow-visible px-2 sm:w-64 lg:mx-0 lg:mt-4 lg:w-72 xl:w-80">
            <HeroBook3D
              key={current.id}
              className="hero-book-enter"
              coverImage={current.coverImage}
              coverColor={current.coverColor}
              title={current.title[lang]}
              description={current.description[lang]}
              href={`/webtoon/${current.id}`}
              ctaLabel={t('home.startReading')}
              coverTabbable={false}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSpotlight
export { AUTOPLAY_MS }
