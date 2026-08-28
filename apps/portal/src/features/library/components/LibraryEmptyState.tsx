import { Bookmark, Clock, Heart } from 'lucide-react'
import Button from '../../../components/Button'

export type LibraryTab = 'bookmarks' | 'history' | 'likes'

export interface LibraryEmptyStateProps {
  tab: LibraryTab
  title: string
  description: string
  ctaLabel: string
  onCtaClick: () => void
}

const LibraryEmptyState = ({
  tab,
  title,
  description,
  ctaLabel,
  onCtaClick,
}: LibraryEmptyStateProps) => {
  return (
    <div className="py-16 text-center">
      <div className="shape-circle mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-gray-100">
        {tab === 'bookmarks' && <Bookmark className="h-8 w-8 text-gray-400" aria-hidden="true" />}
        {tab === 'history' && <Clock className="h-8 w-8 text-gray-400" aria-hidden="true" />}
        {tab === 'likes' && <Heart className="h-8 w-8 text-gray-400" aria-hidden="true" />}
      </div>
      <h2 className="mb-2 text-lg font-bold text-gray-900">{title}</h2>
      <p className="mb-6 text-sm text-gray-500">{description}</p>
      <Button variant="primary" size="sm" onClick={onCtaClick}>
        {ctaLabel}
      </Button>
    </div>
  )
}

export default LibraryEmptyState
