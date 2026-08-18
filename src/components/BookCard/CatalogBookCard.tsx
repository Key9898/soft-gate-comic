import type { ReactNode } from 'react'
import { Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Genre, Webtoon } from '@softgate/shared'
import { formatCatalogDate } from '../../lib/catalog'
import { resolveGenreLabel } from '../../lib/categories'
import { formatCount } from '../../lib/utils/formatters'
import BookCard from './BookCard'

export interface CatalogBookCardProps {
  webtoon: Webtoon
  lang: 'mm' | 'en'
  genres: Genre[]
  newestIds: Set<string>
  className?: string
  coverClassName?: string
  imageLoaded?: boolean
  imageFailed?: boolean
  onImageLoad?: () => void
  onImageError?: () => void
  showCoverLabel?: boolean
  progress?: number
  extraBadge?: ReactNode
  overlay?: ReactNode
}

const CatalogBookCard = ({
  webtoon,
  lang,
  genres,
  newestIds,
  extraBadge,
  overlay,
  ...bookCardProps
}: CatalogBookCardProps) => {
  const { t } = useTranslation()
  const isNew = newestIds.has(webtoon.id)

  return (
    <BookCard
      {...bookCardProps}
      coverImage={webtoon.coverImage}
      coverColor={webtoon.coverColor}
      title={webtoon.title[lang]}
      description={webtoon.description[lang]}
      subtitle={resolveGenreLabel(webtoon.genres[0] ?? '', genres, lang)}
      overlay={overlay}
      badge={
        <>
          {isNew ? (
            <span className="bg-primary-600 absolute top-2 left-2 z-10 rounded-2xl px-2 py-0.5 text-xs font-medium text-white">
              {t('webtoon.new')}
            </span>
          ) : null}
          {extraBadge}
        </>
      }
      meta={
        <div className="flex items-center justify-between gap-2 text-xs font-medium text-slate-500">
          <div className="flex min-w-0 items-center gap-1">
            <Eye className="h-3 w-3 shrink-0 text-slate-400" aria-hidden="true" />
            <span>{formatCount(webtoon.viewCount)}</span>
          </div>
          <span className="shrink-0">{formatCatalogDate(webtoon.createdAt)}</span>
        </div>
      }
    />
  )
}

export default CatalogBookCard
