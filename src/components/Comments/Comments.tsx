import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  Heart,
  Reply,
  MoreHorizontal,
  Send,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../Button'

interface User {
  id: string
  username: string
  displayName: string
  avatar?: string
}

interface Comment {
  id: string
  userId: string
  user: User
  content: string
  likeCount: number
  isLiked: boolean
  replies?: Comment[]
  createdAt: string
  isEdited?: boolean
}

interface CommentsProps {
  comments: Comment[]
  currentUserId?: string
  currentUserName?: string
  onAddComment?: (content: string) => void
  onReply?: (commentId: string, content: string) => void
  onLike?: (commentId: string) => void
  onDelete?: (commentId: string) => void
  onEdit?: (commentId: string, content: string) => void
}

interface CommentItemProps {
  comment: Comment
  isReply?: boolean
  currentUserId?: string
  onReply?: (commentId: string, content: string) => void
  onLike?: (commentId: string) => void
  onDelete?: (commentId: string) => void
  onEdit?: (commentId: string, content: string) => void
}

const useTimeFormatter = () => {
  const { t, i18n } = useTranslation()
  return (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return t('comments.justNow')
    if (diffMins < 60) return `${diffMins}${t('comments.minutesAgo')}`
    if (diffHours < 24) return `${diffHours}${t('comments.hoursAgo')}`
    if (diffDays < 7) return `${diffDays}${t('comments.daysAgo')}`
    return date.toLocaleDateString(i18n.language === 'mm' ? 'my-MM' : 'en-US', {
      month: 'short',
      day: 'numeric',
    })
  }
}

const CommentItem = ({
  comment,
  isReply = false,
  currentUserId,
  onReply,
  onLike,
  onDelete,
  onEdit,
}: CommentItemProps) => {
  const { t } = useTranslation()
  const formatTime = useTimeFormatter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [showReplies, setShowReplies] = useState(false)

  const isOwner = Boolean(currentUserId) && comment.userId === currentUserId
  const replyCount = comment.replies?.length || 0

  const submitReply = () => {
    if (!replyContent.trim()) return
    onReply?.(comment.id, replyContent)
    setReplyContent('')
    setReplyOpen(false)
    setShowReplies(true)
  }

  const submitEdit = () => {
    if (!editContent.trim()) return
    onEdit?.(comment.id, editContent)
    setIsEditing(false)
    setEditContent('')
  }

  return (
    <div className={`${isReply ? 'ml-12 sm:ml-16' : ''}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div
            className={`${
              isReply ? 'h-8 w-8' : 'h-10 w-10'
            } from-primary-400 to-primary-600 shape-circle flex items-center justify-center bg-gradient-to-br`}
          >
            {comment.user.avatar ? (
              <img
                src={comment.user.avatar}
                alt={comment.user.displayName}
                className="shape-circle h-full w-full object-cover"
              />
            ) : (
              <span className={`${isReply ? 'text-sm' : 'text-base'} font-semibold text-white`}>
                {comment.user.displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-gray-900">
              {comment.user.displayName}
            </span>
            <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
            {comment.isEdited && (
              <span className="text-xs text-gray-400">{t('comments.edited')}</span>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                aria-label={t('comments.editComment')}
                className="focus:ring-primary-500 w-full resize-none rounded-2xl border border-gray-200 px-3 py-2 text-sm focus:border-transparent focus:ring-2"
                rows={2}
              />
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="primary" onClick={submitEdit}>
                  {t('common.save')}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent('')
                  }}
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm leading-relaxed wrap-anywhere text-gray-700">
              {comment.content}
            </p>
          )}

          <div className="mt-2 flex items-center gap-4">
            <button
              type="button"
              onClick={() => onLike?.(comment.id)}
              disabled={!currentUserId}
              aria-label={comment.isLiked ? t('comments.unlike') : t('comments.like')}
              className={`flex items-center gap-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                comment.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Heart
                className={`h-4 w-4 ${comment.isLiked ? 'fill-current' : ''}`}
                aria-hidden="true"
              />
              <span>{comment.likeCount > 0 ? comment.likeCount : ''}</span>
            </button>

            {!isReply && onReply && currentUserId ? (
              <button
                type="button"
                onClick={() => setReplyOpen((prev) => !prev)}
                className="flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-gray-600"
              >
                <Reply className="h-4 w-4" aria-hidden="true" />
                <span>{t('comments.reply')}</span>
              </button>
            ) : null}

            {isOwner && !isEditing && (
              <div className="relative">
                <button
                  type="button"
                  title={t('comments.moreOptions')}
                  aria-label={t('comments.moreOptions')}
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="p-1 text-gray-400 transition-colors hover:text-gray-600"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 z-10 mt-1 w-32 rounded-2xl border border-gray-100 bg-white py-1 shadow-lg"
                    >
                      {onEdit ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(true)
                            setEditContent(comment.content)
                            setMenuOpen(false)
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Edit3 className="h-4 w-4" />
                          {t('comments.edit')}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false)
                          onDelete?.(comment.id)
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        {t('comments.delete')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {replyOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={t('comments.replyPlaceholder')}
                  aria-label={t('comments.replyPlaceholder')}
                  className="focus:ring-primary-500 flex-1 rounded-2xl border border-gray-200 px-3 py-2 text-sm focus:border-transparent focus:ring-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      submitReply()
                    }
                  }}
                />
                <Button size="sm" variant="primary" onClick={submitReply}>
                  <Send className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </motion.div>
          )}

          {replyCount > 0 && !isReply && (
            <button
              type="button"
              onClick={() => setShowReplies((prev) => !prev)}
              className="text-primary-600 hover:text-primary-700 mt-3 flex items-center gap-1 text-sm font-medium"
            >
              {showReplies ? (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
              {t('comments.replyCount', { count: replyCount })}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showReplies && comment.replies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4"
          >
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                isReply
                currentUserId={currentUserId}
                onLike={onLike}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Comments = ({
  comments = [],
  currentUserId,
  currentUserName,
  onAddComment,
  onReply,
  onLike,
  onDelete,
  onEdit,
}: CommentsProps) => {
  const { t } = useTranslation()
  const [newComment, setNewComment] = useState('')
  const canComment = Boolean(currentUserId)

  const handleSubmitComment = () => {
    if (!canComment || !newComment.trim()) return
    onAddComment?.(newComment)
    setNewComment('')
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm">
      <div className="border-b border-gray-100 p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-gray-600" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-gray-900">
            {t('comments.title')} ({comments.length})
          </h3>
        </div>
      </div>

      <div className="border-b border-gray-100 p-4 sm:p-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="from-primary-400 to-primary-600 shape-circle flex h-10 w-10 items-center justify-center bg-gradient-to-br">
              {currentUserName ? (
                <span className="font-semibold text-white">
                  {currentUserName.charAt(0).toUpperCase()}
                </span>
              ) : (
                <MessageCircle className="h-5 w-5 text-white" aria-hidden="true" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={canComment ? t('comments.placeholder') : t('comments.loginToComment')}
              aria-label={t('comments.placeholder')}
              disabled={!canComment}
              className="focus:ring-primary-500 w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50"
              rows={3}
            />
            <div className="mt-2 flex justify-end">
              <Button
                variant="primary"
                onClick={handleSubmitComment}
                disabled={!canComment || !newComment.trim()}
              >
                <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                {t('comments.post')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-4 sm:p-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={currentUserId}
            onReply={onReply}
            onLike={onLike}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}

        {comments.length === 0 && (
          <div className="py-8 text-center">
            <MessageCircle className="mx-auto mb-3 h-12 w-12 text-gray-300" aria-hidden="true" />
            <p className="text-gray-500">{t('comments.noComments')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Comments
