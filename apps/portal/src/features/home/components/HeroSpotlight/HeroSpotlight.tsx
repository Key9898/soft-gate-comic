import { useCallback, useEffect, useState, type FocusEvent, type MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Play, Pause, ChevronRight, Bookmark, Check } from 'lucide-react'
import type { Webtoon } from '@softgate/shared'
import Button from '../../../../components/Button'
import HeroBackdrop from './HeroBackdrop'

const AUTOPLAY_MS = 5000

export interface HeroSpotlightProps {
  slides: Webtoon[]
  lang: 'mm' | 'en'
  isBookmarked: (webtoonId: string) => boolean
  toggleBookmark: (webtoonId: string) => void
  unavailable?: boolean
}

const HeroSpotlight = ({
  slides,
  lang,
  isBookmarked,
  toggleBookmark,
  unavailable = false,
}: HeroSpotlightProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
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

  // Whole-hero pointer-only path to the hub (hero-spotlight-full-bleed-design.md,
  // Layout). A div, never a Link: it must not enter the tab order or the
  // screen-reader link list. Keyboard users reach the hub through Start Reading.
  // Any click that originates on an interactive control (Start Reading, Save,
  // a pager dot, Pause/Play, the next arrow) is excluded via closest('a, button')
  // so those controls keep their own behaviour instead of also navigating.
  const handleHeroPointerNavigate = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (target.closest('a, button')) return
    navigate(`/webtoon/${current.id}`)
  }

  if (!current) {
    return (
      <section className="safe-top relative -mt-16 overflow-visible pt-16 text-white">
        <HeroBackdrop priority reducedMotion={prefersReducedMotion} />
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-r from-gray-950/70 via-gray-950/30 to-gray-950/45"
          aria-hidden="true"
        />
        <div className="hero-landscape-adjust relative mx-auto flex min-h-[22rem] max-w-7xl flex-col justify-center px-4 py-10 sm:min-h-[26rem] sm:px-6 sm:py-12 lg:min-h-[32rem] lg:px-8 lg:py-14 xl:min-h-[36rem] xl:py-16">
          <div className="relative z-10 flex w-full min-w-0 max-w-2xl flex-col text-center lg:text-left">
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t('home.pageHeading')}
            </h1>
            <p className="mx-auto mb-8 max-w-md text-base text-white/80 sm:text-lg lg:mx-0">
              {unavailable ? t('errors.catalogUnavailable') : t('home.emptyDesc')}
            </p>
            {unavailable ? null : (
              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Link
                  to="/help"
                  className="focus:ring-offset-primary-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                >
                  <Button variant="secondary">{t('footer.help')}</Button>
                </Link>
                <Link
                  to="/creators"
                  className="focus:ring-offset-primary-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                >
                  <Button variant="heroOutline">{t('footer.creators')}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

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
      <div data-testid="hero-pointer-target" onClick={handleHeroPointerNavigate}>
        <HeroBackdrop slide={current} priority={index === 0} reducedMotion={prefersReducedMotion} />
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-r from-gray-950/70 via-gray-950/30 to-gray-950/45"
          aria-hidden="true"
        />
        <div className="hero-landscape-adjust relative mx-auto flex min-h-[22rem] max-w-7xl flex-col justify-center px-4 py-10 sm:min-h-[26rem] sm:px-6 sm:py-12 lg:min-h-[32rem] lg:px-8 lg:py-14 xl:min-h-[36rem] xl:py-16">
          <div className="hero-spotlight-pair flex flex-col items-center gap-8 lg:mt-12 lg:flex-row lg:items-center lg:gap-12">
            <div className="relative z-10 flex w-full min-w-0 flex-col text-center lg:max-w-2xl lg:text-left">
              <div
                key={current.id}
                role="group"
                aria-roledescription="slide"
                aria-label={t('a11y.heroSlide', { n: safeIndex + 1, total: count })}
                className="w-full min-w-0"
              >
                {/* The stable page h1 stays (hero-spotlight.md: it must not rotate with
                  the carousel) but is no longer painted: it was a second uppercase
                  micro-line stacked under the kicker, in near-identical styling, while
                  the site name already sits in the nav logo directly above. That
                  doubling is what made the real headline look demoted. */}
                <h1 className="sr-only">{t('home.pageHeading')}</h1>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/80">
                  {t('home.spotlightKicker')}
                </p>
                <h2 className="mb-4 line-clamp-2 break-words text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.5rem] lg:line-clamp-1 lg:text-5xl xl:text-6xl">
                  {current.title[lang]}
                </h2>
                <p className="min-h-2lh mx-auto mb-8 line-clamp-2 max-w-md break-words text-base text-white/80 sm:max-w-lg sm:text-lg lg:mx-0">
                  {current.description[lang]}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                  <Link
                    to={`/webtoon/${current.id}`}
                    className="focus:ring-offset-primary-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
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
                          className="focus:ring-primary-400 flex min-h-11 min-w-11 items-center justify-center rounded-2xl focus:outline-none focus:ring-2"
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
                      className="shape-circle focus:ring-primary-400 flex min-h-11 min-w-11 shrink-0 items-center justify-center bg-white/10 text-white shadow-sm ring-1 ring-white/20 transition hover:bg-white/20 focus:outline-none focus:ring-2"
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
                    className="shape-circle focus:ring-primary-400 flex min-h-11 min-w-11 shrink-0 items-center justify-center bg-white/10 text-white shadow-sm ring-1 ring-white/20 transition hover:bg-white/20 focus:outline-none focus:ring-2"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSpotlight
export { AUTOPLAY_MS }
