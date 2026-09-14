import { Star } from 'lucide-react'
import { formatRating } from '../../lib/rating'

interface RatingChipProps {
  rating: number
}

const RatingChip = ({ rating }: RatingChipProps) => {
  return (
    <span
      data-testid="rating-chip"
      className="flex items-center gap-0.5 rounded-2xl bg-black/75 px-1.5 py-0.5 text-xs font-bold tabular-nums text-white backdrop-blur-sm"
      aria-hidden="true"
    >
      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
      {formatRating(rating)}
    </span>
  )
}

export default RatingChip
