import { useTranslation } from 'react-i18next'
import type { ContentRating } from '@softgate/shared'
import { contentRatingLabelKey } from '../lib/contentRating'

interface ContentRatingBadgeProps {
  rating: ContentRating
  className?: string
}

const ContentRatingBadge = ({ rating, className = '' }: ContentRatingBadgeProps) => {
  const { t } = useTranslation()
  const mature = rating === '18'

  return (
    <span
      data-testid="content-rating-badge"
      data-rating={rating}
      className={`rounded-2xl px-1.5 py-0.5 text-xs font-bold uppercase tabular-nums ${
        mature ? 'bg-rose-600 text-white' : 'bg-black/60 text-white backdrop-blur-sm'
      } ${className}`.trim()}
    >
      {t(contentRatingLabelKey(rating))}
    </span>
  )
}

export default ContentRatingBadge
