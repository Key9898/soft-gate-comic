import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { Episode, Webtoon } from '@softgate/shared'
import ContentRatingBadge from '../../../components/ContentRatingBadge'
import UpcomingDropMeta from '../../../components/UpcomingDropMeta'
import { dropRemainingMs, formatDropCountdown } from '../../../lib/catalog'

interface DailyDropCardProps {
  webtoon: Webtoon
  episode: Episode
  lang: 'mm' | 'en'
  now: number
  imageLoaded?: boolean
  imageFailed?: boolean
  onImageLoad?: () => void
  onImageError?: () => void
}

const DailyDropCard = ({
  webtoon,
  episode,
  lang,
  now,
  imageLoaded = true,
  imageFailed = false,
  onImageLoad,
  onImageError,
}: DailyDropCardProps) => {
  const { t } = useTranslation()
  const imgRef = useRef<HTMLImageElement>(null)
  const title = webtoon.title[lang]
  const remaining = dropRemainingMs(episode.scheduledAt ?? '', now)
  const countdown = remaining > 0 ? formatDropCountdown(remaining) : t('home.dailyPublishingSoon')
  // The countdown is deliberately not part of the accessible name. It changes every
  // second, and a name that changes every second re-announces the whole card to a
  // screen-reader user who happens to be sitting on it. It stays visible in the
  // gradient strip below, where sighted readers get it without the interruption.
  const label = [title, t('home.dailyEpisode', { n: episode.episodeNumber }), episode.title[lang]]
    .filter(Boolean)
    .join(', ')
  const showImage = Boolean(webtoon.coverImage) && !imageFailed

  useEffect(() => {
    if (imageLoaded || imageFailed || !webtoon.coverImage) return
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) {
      onImageLoad?.()
    }
  }, [webtoon.coverImage, imageLoaded, imageFailed, onImageLoad])

  return (
    <article className="flex cursor-default flex-col" aria-label={label}>
      <div className={`book-media relative aspect-[3/4] shadow-md ${webtoon.coverColor}`}>
        {showImage && !imageLoaded ? (
          <div className="absolute inset-0 z-0 animate-pulse bg-gray-200" aria-hidden="true" />
        ) : null}
        {showImage ? (
          <img
            ref={imgRef}
            src={webtoon.coverImage}
            alt=""
            onLoad={onImageLoad}
            onError={onImageError}
            className={`absolute inset-0 z-0 h-full w-full object-cover ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <span className="relative z-0 text-sm text-white/60">{t('common.cover')}</span>
        )}
        <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-col items-start gap-1">
          {webtoon.isPremium ? (
            <span className="bg-accent-600 text-2xs rounded-2xl px-2 py-0.5 font-bold uppercase text-white shadow-sm">
              {t('webtoon.premium')}
            </span>
          ) : null}
        </div>
        <div className="pointer-events-none absolute right-2 top-2 z-10">
          <ContentRatingBadge rating={webtoon.contentRating} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-2 pb-2.5 pt-10">
          <p
            data-testid="daily-drop-countdown"
            aria-hidden="true"
            className="text-center text-sm font-semibold tabular-nums text-white"
          >
            {countdown}
          </p>
        </div>
      </div>
      <div className="mt-2.5 min-w-0 px-0.5">
        <h3 className="line-clamp-2 break-words text-sm font-semibold text-gray-900 lg:line-clamp-1">
          {title}
        </h3>
        <UpcomingDropMeta
          className="mt-1.5"
          episode={episode}
          now={now}
          lang={lang}
          showCountdown={false}
        />
      </div>
    </article>
  )
}

export default DailyDropCard
