import { MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { StoredComment } from '../../lib/comments'

interface CommentsTeaserProps {
  comments: StoredComment[]
  onOpen: () => void
  darkMode?: boolean
}

const CommentsTeaser = ({ comments, onOpen, darkMode = false }: CommentsTeaserProps) => {
  const { t } = useTranslation()
  const newest = [...comments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)
  const muted = darkMode ? 'text-gray-400' : 'text-gray-600'
  const card = darkMode ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'

  return (
    <div className={`mt-6 w-full max-w-md rounded-2xl border p-4 text-left ${card}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          {t('comments.teaserTitle', { count: comments.length })}
        </p>
        <button
          type="button"
          onClick={onOpen}
          className="text-primary-600 min-h-11 rounded-2xl px-3 text-sm font-semibold"
        >
          {t('comments.openThread')}
        </button>
      </div>
      {newest.length === 0 ? (
        <p className={`text-sm ${muted}`}>{t('comments.teaserEmpty')}</p>
      ) : (
        <ul className="space-y-2">
          {newest.map((comment) => (
            <li key={comment.id} className="text-sm">
              <span className="font-semibold">{comment.user.displayName}</span>
              <span className={`ml-2 ${muted}`}>
                {comment.spoiler ? t('comments.spoilerHidden') : comment.content}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CommentsTeaser
