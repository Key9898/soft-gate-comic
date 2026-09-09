import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Comments from './Comments'
import { useAuth } from '../../context/AuthContext'
import { useCommentsThread, type CommentsThreadController } from '../../hooks/useCommentsThread'
import type { StoredComment } from '../../lib/comments'

interface CommentsThreadProps {
  commentKey: string
  controller?: CommentsThreadController
  headingMode?: 'title' | 'count'
  darkMode?: boolean
}

interface UiComment {
  id: string
  userId: string
  user: StoredComment['user']
  content: string
  likeCount: number
  isLiked: boolean
  createdAt: string
  isEdited?: boolean
  spoiler?: boolean
  reported?: boolean
  replies?: UiComment[]
}

const likeCountOf = (c: StoredComment) =>
  Array.isArray(c.likedByUserIds) ? c.likedByUserIds.length : c.likeCount

const toUiComment = (c: StoredComment, viewerId?: string): UiComment => ({
  id: c.id,
  userId: c.userId,
  user: c.user,
  content: c.content,
  likeCount: likeCountOf(c),
  isLiked: viewerId ? (c.likedByUserIds ?? []).includes(viewerId) : false,
  createdAt: c.createdAt,
  isEdited: c.isEdited,
  spoiler: c.spoiler,
  reported: c.reported,
})

const groupComments = (flat: StoredComment[], viewerId?: string): UiComment[] => {
  const topLevel = flat.filter((c) => !c.parentId).map((c) => toUiComment(c, viewerId))
  const byId = new Map(topLevel.map((c) => [c.id, c]))
  const replies = flat
    .filter((c) => c.parentId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  for (const reply of replies) {
    const parent = byId.get(reply.parentId as string)
    if (!parent) continue
    parent.replies = [...(parent.replies ?? []), toUiComment(reply, viewerId)]
  }
  return topLevel
}

const CommentsThread = ({
  commentKey,
  controller,
  headingMode = 'count',
  darkMode = false,
}: CommentsThreadProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()
  const owned = useCommentsThread(controller ? '' : commentKey)
  const thread = controller ?? owned
  const uiComments = groupComments(thread.comments, user?.id)

  return (
    <div className="space-y-3">
      {!isAuthenticated ? (
        <p
          className={`rounded-2xl px-4 py-3 text-sm ${
            darkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-50 text-gray-600'
          }`}
        >
          {t('comments.loginToComment')}{' '}
          <button
            type="button"
            className="text-primary-600 font-semibold underline"
            onClick={() => navigate('/login', { state: { from: location } })}
          >
            {t('nav.login')}
          </button>
        </p>
      ) : null}
      <Comments
        comments={uiComments}
        totalCount={thread.comments.length}
        currentUserId={user?.id}
        currentUserName={user?.displayName}
        currentUserAvatar={user?.avatar}
        headingMode={headingMode}
        darkMode={darkMode}
        onAddComment={(content, spoiler) => thread.add(content, spoiler)}
        onReply={(commentId, content, spoiler) => thread.reply(commentId, content, spoiler)}
        onEdit={(commentId, content) => thread.edit(commentId, content)}
        onLike={(commentId) => thread.like(commentId)}
        onDelete={(commentId) => thread.remove(commentId)}
        onReport={(commentId) => thread.report(commentId)}
      />
    </div>
  )
}

export default CommentsThread
