import { Bookmark, Clock, Heart, SearchX } from 'lucide-react'
import Button from '../../../components/Button'

export type LibraryTab = 'bookmarks' | 'history' | 'likes'

export interface LibraryEmptyStateProps {
  tab: LibraryTab
  title: string
  description: string
  ctaLabel: string
  onCtaClick: () => void
  /**
   * Set when the shelf has items but the current search hides them all. "Your
   * library is empty" is a different sentence from "nothing here matches", and
   * telling a reader with 40 saved titles that their library is empty is simply
   * false — the recovery is to clear the search, not to go browse.
   */
  filtered?: boolean
}

const LibraryEmptyState = ({
  tab,
  title,
  description,
  ctaLabel,
  onCtaClick,
  filtered = false,
}: LibraryEmptyStateProps) => {
  return (
    <div className="py-16 text-center">
      <div className="shape-circle mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-gray-100">
        {filtered ? (
          <SearchX className="text-muted h-8 w-8" aria-hidden="true" />
        ) : (
          <>
            {tab === 'bookmarks' && <Bookmark className="text-muted h-8 w-8" aria-hidden="true" />}
            {tab === 'history' && <Clock className="text-muted h-8 w-8" aria-hidden="true" />}
            {tab === 'likes' && <Heart className="text-muted h-8 w-8" aria-hidden="true" />}
          </>
        )}
      </div>
      <h2 className="mb-2 text-lg font-bold text-gray-900">{title}</h2>
      <p className="text-muted mx-auto mb-6 max-w-sm text-sm">{description}</p>
      <Button variant={filtered ? 'surface' : 'primary'} size="sm" onClick={onCtaClick}>
        {ctaLabel}
      </Button>
    </div>
  )
}

export default LibraryEmptyState
