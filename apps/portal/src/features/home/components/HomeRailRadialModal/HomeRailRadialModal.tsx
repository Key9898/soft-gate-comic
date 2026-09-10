import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Genre, Webtoon } from '@softgate/shared'
import { CatalogBookCard } from '../../../../components/BookCard'
import useScrollLock from '../../../../hooks/useScrollLock'
import useFocusTrap from '../../../../hooks/useFocusTrap'

export type HomeRailRadialVariant = 'ranking' | 'updated' | 'new'

export interface HomeRailRadialModalProps {
  open: boolean
  onClose: () => void
  title: string
  webtoons: Webtoon[]
  variant: HomeRailRadialVariant
  lang: 'mm' | 'en'
  genres: Genre[]
  newestIds: Set<string>
  loadedImages: Set<string>
  failedImages: Set<string>
  onImageLoad: (id: string) => void
  onImageError: (id: string) => void
}

type RadialSlotStyle = CSSProperties & {
  '--radial-rot': string
  '--radial-x': string
  '--radial-y': string
  '--radial-scale': string
  '--radial-opacity': string
  '--radial-z': number
}

const wrappedOffset = (index: number, active: number, count: number): number => {
  if (count <= 1) return 0
  let delta = index - active
  const half = count / 2
  if (delta > half) delta -= count
  if (delta < -half) delta += count
  return delta
}

const slotStyle = (offset: number): RadialSlotStyle => {
  const abs = Math.abs(offset)
  const scale = offset === 0 ? 1.08 : abs === 1 ? 0.86 : abs === 2 ? 0.72 : 0.56
  const opacity = offset === 0 ? 1 : abs === 1 ? 0.94 : abs === 2 ? 0.48 : 0.18
  return {
    '--radial-rot': `${offset * 15}deg`,
    '--radial-x': `${offset * 6.55}rem`,
    '--radial-y': `${abs * 0.72}rem`,
    '--radial-scale': String(scale),
    '--radial-opacity': String(opacity),
    '--radial-z': 40 - abs,
  }
}

const HomeRailRadialModal = ({
  open,
  onClose,
  title,
  webtoons,
  variant,
  lang,
  genres,
  newestIds,
  loadedImages,
  failedImages,
  onImageLoad,
  onImageError,
}: HomeRailRadialModalProps) => {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const [activeIndex, setActiveIndex] = useState(0)
  const count = webtoons.length
  const showWrap = count > 1
  const dateKind = variant === 'updated' ? 'updatedAt' : 'createdAt'
  const safeIndex = count === 0 ? 0 : ((activeIndex % count) + count) % count

  useScrollLock(open)
  useFocusTrap(dialogRef, open, closeRef)

  useEffect(() => {
    if (open) setActiveIndex(0)
  }, [open])

  useEffect(() => {
    if (count === 0) return
    if (activeIndex >= count) setActiveIndex(0)
  }, [activeIndex, count])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (!showWrap) return
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setActiveIndex((prev) => (prev - 1 + count) % count)
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setActiveIndex((prev) => (prev + 1) % count)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose, showWrap, count])

  if (!open) return null

  const goPrev = () => setActiveIndex((prev) => (prev - 1 + count) % count)
  const goNext = () => setActiveIndex((prev) => (prev + 1) % count)

  return (
    <div className="home-radial-overlay">
      <button
        type="button"
        className="home-radial-backdrop"
        aria-label={t('common.close')}
        data-testid="home-radial-backdrop"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="home-radial-dialog"
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 sm:px-6">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900 sm:text-xl">
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            title={t('common.close')}
            aria-label={t('common.close')}
            onClick={onClose}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-2xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="home-radial-scene">
          <div className="home-radial-stage">
            {webtoons.map((webtoon, index) => {
              const offset = wrappedOffset(index, safeIndex, count)
              const isCenter = offset === 0
              const isFar = Math.abs(offset) > 2
              const label =
                variant === 'ranking' ? `${index + 1}. ${webtoon.title[lang]}` : webtoon.title[lang]
              return (
                <div
                  key={webtoon.id}
                  className={['home-radial-slot', isCenter && 'is-center', isFar && 'is-far']
                    .filter(Boolean)
                    .join(' ')}
                  style={slotStyle(offset)}
                  data-testid={isCenter ? 'home-radial-center' : undefined}
                >
                  <CatalogBookCard
                    webtoon={webtoon}
                    lang={lang}
                    genres={genres}
                    newestIds={newestIds}
                    dateKind={dateKind}
                    rank={variant === 'ranking' ? index + 1 : undefined}
                    imageLoaded={loadedImages.has(webtoon.id)}
                    imageFailed={failedImages.has(webtoon.id)}
                    onImageLoad={() => onImageLoad(webtoon.id)}
                    onImageError={() => onImageError(webtoon.id)}
                  />
                  {isCenter ? (
                    <Link
                      to={`/webtoon/${webtoon.id}`}
                      className="focus:ring-primary-500 absolute inset-0 z-10 rounded-[3px] focus:ring-2 focus:ring-offset-2 focus:outline-none"
                      aria-label={label}
                    />
                  ) : (
                    <button
                      type="button"
                      className="focus:ring-primary-500 absolute inset-0 z-10 rounded-[3px] focus:ring-2 focus:ring-offset-2 focus:outline-none"
                      aria-label={label}
                      tabIndex={isFar ? -1 : 0}
                      onClick={() => setActiveIndex(index)}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
        {showWrap ? (
          <div className="flex items-center justify-center gap-2 px-4 pt-1 pb-5 sm:gap-3 sm:pb-6">
            <button
              type="button"
              onClick={goPrev}
              aria-label={t('common.previous')}
              className="text-primary-700 hover:bg-primary-50 focus:ring-primary-500 flex min-h-11 min-w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/80 transition focus:ring-2 focus:outline-none"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <p
              className="min-w-16 text-center text-sm font-medium text-gray-600 tabular-nums"
              aria-live="polite"
            >
              {t('a11y.radialSlide', { n: safeIndex + 1, total: count })}
            </p>
            <button
              type="button"
              onClick={goNext}
              aria-label={t('common.next')}
              className="text-primary-700 hover:bg-primary-50 focus:ring-primary-500 flex min-h-11 min-w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/80 transition focus:ring-2 focus:outline-none"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default HomeRailRadialModal
