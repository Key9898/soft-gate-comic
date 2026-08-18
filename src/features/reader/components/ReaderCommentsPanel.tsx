import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Comments from '../../../components/Comments'
import { useAuth } from '../../../context/AuthContext'
import {
  STORAGE_KEY as COMMENTS_STORAGE_KEY,
  addComment,
  addReply,
  deleteComment,
  episodeCommentKey,
  listComments,
  toggleCommentLike,
  updateComment,
  type StoredComment,
} from '../../../lib/comments'
import { useStorageSync } from '../../../hooks/useStorageSync'

const COMMENTS_SYNC_KEYS = [COMMENTS_STORAGE_KEY]

interface ReaderCommentsPanelProps {
  webtoonId: string
  episodeNumber: number
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

const ReaderCommentsPanel = ({ webtoonId, episodeNumber }: ReaderCommentsPanelProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()
  const episodeKey = episodeCommentKey(webtoonId, episodeNumber)
  const [comments, setComments] = useState(() => listComments(episodeKey))

  const refresh = useCallback(() => {
    setComments(listComments(episodeKey))
  }, [episodeKey])

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
          setComments(addComment(episodeKey, commentUser, content))
        }}
        onReply={(commentId, content) => {
          if (!commentUser) return
          setComments(addReply(episodeKey, commentId, commentUser, content))
        }}
        onEdit={(commentId, content) => {
          if (!user) return
          setComments(updateComment(episodeKey, commentId, user.id, content))
        }}
        onLike={(commentId) => {
          if (!user) return
          setComments(toggleCommentLike(episodeKey, commentId, user.id))
        }}
        onDelete={(commentId) => {
          if (!user) return
          setComments(deleteComment(episodeKey, commentId, user.id))
        }}
      />
    </div>
  )
}

export default ReaderCommentsPanel
