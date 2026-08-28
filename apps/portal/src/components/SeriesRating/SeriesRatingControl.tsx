import type { KeyboardEvent } from 'react'
import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { useEngagement } from '../../context/EngagementContext'
import { adjacentRating, formatRating, starFill, type RatingValue } from '../../lib/rating'

interface SeriesRatingControlProps {
  webtoonId: string
  variant: 'hero' | 'card'
  darkMode?: boolean
}

const STAR_INDEXES = [1, 2, 3, 4, 5] as const

const SeriesRatingControl = ({
  webtoonId,
  variant,
  darkMode = false,
}: SeriesRatingControlProps) => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const { getRating, setRating, clearRating, readEpisodeNumbers } = useEngagement()
  const value = getRating(webtoonId)
  const hasRead = readEpisodeNumbers(webtoonId).length > 0
  const disabled = isAuthenticated && value == null && !hasRead
  const isHero = variant === 'hero'
  const onDark = isHero || darkMode
  const emptyStarClass = onDark ? 'text-white/35' : 'text-gray-300'
  const labelClass = onDark ? 'text-white/80' : 'text-gray-700'
  const hintClass = onDark ? 'text-white/55' : 'text-gray-500'
  const focusRing = isHero ? 'focus-visible:ring-white' : 'focus-visible:ring-primary-500'

  const select = (step: RatingValue) => {
    if (disabled) return
    setRating(webtoonId, step)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (
      event.key !== 'ArrowRight' &&
      event.key !== 'ArrowUp' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowDown'
    ) {
      return
    }
    event.preventDefault()
    const delta = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 0.5 : -0.5
    select(adjacentRating(value, delta))
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2 md:items-start">
      <p className={`text-xs font-semibold tracking-wide uppercase ${labelClass}`}>
        {t('rating.rateSeries')}
      </p>
      <div
        role="radiogroup"
        aria-label={t('rating.rateSeries')}
        aria-disabled={disabled}
        className="flex items-center gap-0.5"
      >
        {STAR_INDEXES.map((index) => {
          const left = (index - 0.5) as RatingValue
          const right = index as RatingValue
          const fill = starFill(value, index)
          return (
            <span key={index} className="relative inline-flex h-11 w-12 shrink-0">
              <span
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <Star className={`h-11 w-11 ${emptyStarClass}`} />
                {fill !== 'empty' ? (
                  <span
                    className={`absolute inset-y-0 left-0 overflow-hidden ${
                      fill === 'half' ? 'w-1/2' : 'w-full'
                    }`}
                  >
                    <span className="flex h-11 w-12 shrink-0 items-center justify-center">
                      <Star className="h-11 w-11 fill-yellow-400 text-yellow-400" />
                    </span>
                  </span>
                ) : null}
              </span>
              <button
                type="button"
                role="radio"
                aria-checked={value === left}
                aria-label={t('rating.stars', { n: formatRating(left) })}
                disabled={disabled}
                tabIndex={
                  disabled ? -1 : value === left || (value == null && left === 0.5) ? 0 : -1
                }
                onClick={() => select(left)}
                onKeyDown={onKeyDown}
                className={`absolute inset-y-0 left-0 z-10 w-1/2 rounded-l-sm ${focusRing} focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed`}
              />
              <button
                type="button"
                role="radio"
                aria-checked={value === right}
                aria-label={t('rating.stars', { n: formatRating(right) })}
                disabled={disabled}
                tabIndex={disabled ? -1 : value === right ? 0 : -1}
                onClick={() => select(right)}
                onKeyDown={onKeyDown}
                className={`absolute inset-y-0 right-0 z-10 w-1/2 rounded-r-sm ${focusRing} focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed`}
              />
            </span>
          )
        })}
      </div>
      {disabled ? (
        <p className={`text-sm ${hintClass}`}>{t('rating.readToRate')}</p>
      ) : value != null ? (
        <div className="flex flex-wrap items-center gap-3">
          <p className={`text-sm font-medium ${labelClass}`}>
            {t('rating.youRated', { n: formatRating(value) })}
          </p>
          <button
            type="button"
            onClick={() => clearRating(webtoonId)}
            className={`min-h-11 rounded-2xl px-2 text-sm font-semibold ${
              isHero
                ? 'text-white/80 hover:text-white focus-visible:ring-white'
                : 'text-primary-600 hover:text-primary-500 focus-visible:ring-primary-500'
            } focus-visible:ring-2 focus-visible:outline-none`}
          >
            {t('rating.clear')}
          </button>
        </div>
      ) : null}
      <p className={`text-xs ${hintClass}`}>{t('rating.demoNote')}</p>
    </div>
  )
}

export default SeriesRatingControl
