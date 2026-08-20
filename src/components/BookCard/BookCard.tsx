import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import RankMark from '../RankMark'

export interface BookCardProps {
  coverImage?: string
  coverColor?: string
  title: string
  subtitle?: string
  description?: string
  meta?: ReactNode
  badge?: ReactNode
  overlay?: ReactNode
  rank?: number
  className?: string
  coverClassName?: string
  imageLoaded?: boolean
  imageFailed?: boolean
  onImageLoad?: () => void
  onImageError?: () => void
  showCoverLabel?: boolean
  progress?: number
}

const BookCard = ({
  coverImage,
  coverColor = 'bg-gray-700',
  title,
  subtitle,
  description,
  meta,
  badge,
  overlay,
  rank,
  className = '',
  coverClassName = '',
  imageLoaded = true,
  imageFailed = false,
  onImageLoad,
  onImageError,
  showCoverLabel = true,
  progress,
}: BookCardProps) => {
  const { t } = useTranslation()
  const showImage = Boolean(coverImage) && !imageFailed

  return (
    <article className={`group flex flex-col ${className}`}>
      <div
        className={`book-media book-media-shadow relative aspect-[3/4] ${coverColor} ${coverClassName}`}
      >
        {showCoverLabel && (
          <span aria-hidden="true" className="text-sm text-white/60">
            {t('common.cover')}
          </span>
        )}

        {showImage && !imageLoaded && (
          <div className="absolute inset-0 z-0 animate-pulse bg-gray-200" aria-hidden="true" />
        )}

        {showImage ? (
          <img
            src={coverImage}
            alt={title}
            onLoad={onImageLoad}
            onError={onImageError}
            className={`absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          !showCoverLabel && (
            <span className="relative z-0 text-sm text-white/60">{t('common.cover')}</span>
          )
        )}

        {badge}
        {overlay}
        {typeof rank === 'number' ? <RankMark rank={rank} /> : null}

        {typeof progress === 'number' && progress > 0 && (
          <div className="absolute right-0 bottom-0 left-0 z-10 h-[3px] bg-gray-200/90">
            <div
              className="bg-primary-600 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </div>

      <div className="mt-2.5 min-w-0 px-0.5">
        <h3 className="line-clamp-2 text-sm font-semibold break-words text-gray-900 lg:line-clamp-1">
          {title}
        </h3>
        {description ? (
          <p className="min-h-2lh mt-0.5 line-clamp-2 text-xs break-words text-gray-600">
            {description}
          </p>
        ) : null}
        {subtitle ? (
          <p className="mt-0.5 line-clamp-1 text-xs break-words text-gray-500">{subtitle}</p>
        ) : null}
        {meta ? <div className="mt-1.5">{meta}</div> : null}
      </div>
    </article>
  )
}

export default BookCard
