import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Comments from './Comments'
import { useAuth } from '../../context/AuthContext'
import {
  STORAGE_KEY as COMMENTS_STORAGE_KEY,
  addComment,
  addReply,
  deleteComment,
  listComments,
  toggleCommentLike,
  updateComment,
  type StoredComment,
} from '../../lib/comments'
import { useStorageSync } from '../../hooks/useStorageSync'

const COMMENTS_SYNC_KEYS = [COMMENTS_STORAGE_KEY]

interface CommentsThreadProps {
  commentKey: string
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
  replies?: UiComment[]
}

const toUiComment = (c: StoredComment, viewerId?: string): UiComment => ({
  id: c.id,
  userId: c.userId,
  user: c.user,
  content: c.content,
  likeCount: (c.likedByUserIds ?? []).length,
  isLiked: viewerId ? (c.likedByUserIds ?? []).includes(viewerId) : false,
  createdAt: c.createdAt,
  isEdited: c.isEdited,
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

const CommentsThread = ({ commentKey }: CommentsThreadProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState(() => listComments(commentKey))

  const refresh = useCallback(() => {
    setComments(listComments(commentKey))
  }, [commentKey])

  useEffect(() => {
    refresh()
  }, [refresh])

  useStorageSync(COMMENTS_SYNC_KEYS, refresh)

  const uiComments = useMemo(() => groupComments(comments, user?.id), [comments, user?.id])

  const commentUser = user
    ? {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
      }
    : null

  return (
    <div className="space-y-3">
      {!isAuthenticated ? (
        <p className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
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
        currentUserId={user?.id}
        currentUserName={user?.displayName}
        onAddComment={(content) => {
          if (!commentUser) return
          setComments(addComment(commentKey, commentUser, content))
        }}
        onReply={(commentId, content) => {
          if (!commentUser) return
          setComments(addReply(commentKey, commentId, commentUser, content))
        }}
        onEdit={(commentId, content) => {
          if (!user) return
          setComments(updateComment(commentKey, commentId, user.id, content))
        }}
        onLike={(commentId) => {
          if (!user) return
          setComments(toggleCommentLike(commentKey, commentId, user.id))
        }}
        onDelete={(commentId) => {
          if (!user) return
          setComments(deleteComment(commentKey, commentId, user.id))
        }}
      />
    </div>
  )
}

export default CommentsThread
