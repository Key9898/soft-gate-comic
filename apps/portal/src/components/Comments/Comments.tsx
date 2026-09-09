import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  Edit3,
  Flag,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Reply,
  Send,
  Smile,
  Trash2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../Button'
import { isMockApi } from '../../lib/api/isMockApi'
import { COMMENT_MAX_LENGTH, DEMO_COMMENT_STICKERS } from '../../lib/comments'

interface User {
  id: string
  username: string
  displayName: string
  avatar?: string
}

export interface Comment {
  id: string
  userId: string
  user: User
  content: string
  likeCount: number
  isLiked: boolean
  replies?: Comment[]
  createdAt: string
  isEdited?: boolean
  spoiler?: boolean
  reported?: boolean
}

export type CommentSort = 'best' | 'newest' | 'oldest'
export type CommentsHeadingMode = 'title' | 'count'

interface CommentsProps {
  comments: Comment[]
  totalCount?: number
  currentUserId?: string
  currentUserName?: string
  currentUserAvatar?: string
  headingMode?: CommentsHeadingMode
  darkMode?: boolean
  onAddComment?: (content: string, spoiler: boolean) => void
  onReply?: (commentId: string, content: string, spoiler: boolean) => void
  onLike?: (commentId: string) => void
  onDelete?: (commentId: string) => void
  onEdit?: (commentId: string, content: string) => void
  onReport?: (commentId: string) => void
}

interface CommentItemProps {
  comment: Comment
  isReply?: boolean
  currentUserId?: string
  darkMode?: boolean
  onReply?: (commentId: string, content: string, spoiler: boolean) => void
  onLike?: (commentId: string) => void
  onDelete?: (commentId: string) => void
  onEdit?: (commentId: string, content: string) => void
  onReport?: (commentId: string) => void
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

function sortComments(list: Comment[], sort: CommentSort): Comment[] {
  const copy = [...list]
  if (sort === 'oldest') {
    return copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }
  if (sort === 'best') {
    return copy.sort((a, b) => {
      if (b.likeCount !== a.likeCount) return b.likeCount - a.likeCount
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }
  return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

function ComposerAvatar({
  name,
  avatar,
  darkMode,
}: {
  name?: string
  avatar?: string
  darkMode?: boolean
}) {
  if (avatar) {
    return <img src={avatar} alt="" className="shape-circle h-10 w-10 object-cover" />
  }
  if (name) {
    return (
      <div className="from-primary-400 to-primary-600 shape-circle flex h-10 w-10 items-center justify-center bg-gradient-to-br">
        <span className="font-semibold text-white">{name.charAt(0).toUpperCase()}</span>
      </div>
    )
  }
  return (
    <div
      className={`shape-circle flex h-10 w-10 items-center justify-center ${
        darkMode ? 'bg-white/10' : 'bg-gray-100'
      }`}
    >
      <MessageCircle
        className={`h-5 w-5 ${darkMode ? 'text-white' : 'text-gray-500'}`}
        aria-hidden="true"
      />
    </div>
  )
}

function StickerTray({
  onPick,
  darkMode,
}: {
  onPick: (sticker: string) => void
  darkMode?: boolean
}) {
  const { t } = useTranslation()
  return (
    <div
      className={`mt-2 flex flex-wrap gap-1 rounded-2xl p-2 ${
        darkMode ? 'bg-white/5' : 'bg-gray-50'
      }`}
      role="listbox"
      aria-label={t('comments.stickerTray')}
    >
      {DEMO_COMMENT_STICKERS.map((sticker) => (
        <button
          key={sticker}
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-2xl text-lg"
          onClick={() => onPick(sticker)}
          aria-label={t('comments.insertSticker', { sticker })}
        >
          {sticker}
        </button>
      ))}
    </div>
  )
}

function ComposerFields({
  value,
  onChange,
  placeholder,
  label,
  disabled,
  darkMode,
  onSubmit,
}: {
  value: string
  onChange: (next: string) => void
  placeholder: string
  label: string
  disabled: boolean
  darkMode?: boolean
  onSubmit: () => void
}) {
  const { t } = useTranslation()
  const [stickersOpen, setStickersOpen] = useState(false)
  const remaining = COMMENT_MAX_LENGTH - value.length
  const fieldClass = darkMode
    ? 'border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:ring-primary-500'
    : 'border-gray-200 bg-white text-gray-900 focus:ring-primary-500'

  const appendSticker = (sticker: string) => {
    if (disabled) return
    onChange((value + sticker).slice(0, COMMENT_MAX_LENGTH))
  }

  return (
    <div className="flex-1">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, COMMENT_MAX_LENGTH))}
        placeholder={placeholder}
        aria-label={label}
        disabled={disabled}
        maxLength={COMMENT_MAX_LENGTH}
        className={`w-full resize-none rounded-2xl border px-4 py-3 focus:border-transparent focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${fieldClass}`}
        rows={3}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || !e.shiftKey)) {
            e.preventDefault()
            onSubmit()
          }
        }}
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setStickersOpen((open) => !open)}
            className={`flex min-h-11 min-w-11 items-center justify-center rounded-2xl ${
              darkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'
            }`}
            aria-label={t('comments.stickers')}
            aria-expanded={stickersOpen}
          >
            <Smile className="h-5 w-5" aria-hidden="true" />
          </button>
          <span
            className={`text-xs ${remaining < 20 ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            {value.length}/{COMMENT_MAX_LENGTH}
          </span>
        </div>
      </div>
      {stickersOpen ? <StickerTray onPick={appendSticker} darkMode={darkMode} /> : null}
    </div>
  )
}

const CommentItem = ({
  comment,
  isReply = false,
  currentUserId,
  darkMode,
  onReply,
  onLike,
  onDelete,
  onEdit,
  onReport,
}: CommentItemProps) => {
  const { t } = useTranslation()
  const formatTime = useTimeFormatter()
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [replySpoiler, setReplySpoiler] = useState(false)
  const [spoilerOpen, setSpoilerOpen] = useState(false)
  const [confirm, setConfirm] = useState<'delete' | 'report' | null>(null)
  const [visibleReplies, setVisibleReplies] = useState(2)

  const isOwner = Boolean(currentUserId) && comment.userId === currentUserId
  const replies = comment.replies ?? []
  const replyCount = replies.length
  const shownReplies = replies.slice(0, visibleReplies)
  const muted = darkMode ? 'text-gray-400' : 'text-gray-400'
  const body = darkMode ? 'text-gray-200' : 'text-gray-700'
  const name = darkMode ? 'text-white' : 'text-gray-900'

  useEffect(() => {
    if (!menuOpen) return
    const onDoc = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [menuOpen])

  const submitReply = () => {
    if (!replyContent.trim()) return
    onReply?.(comment.id, replyContent, replySpoiler)
    setReplyContent('')
    setReplySpoiler(false)
    setReplyOpen(false)
    setVisibleReplies((count) => Math.max(count, replyCount + 1))
  }

  const submitEdit = () => {
    if (!editContent.trim()) return
    onEdit?.(comment.id, editContent)
    setIsEditing(false)
    setEditContent('')
  }

  return (
    <div className={`${isReply ? 'ml-10 sm:ml-14' : ''}`}>
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
                alt=""
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
            <span className={`truncate text-sm font-semibold ${name}`}>
              {comment.user.displayName}
            </span>
            <span className={`text-xs ${muted}`}>{formatTime(comment.createdAt)}</span>
            {comment.isEdited ? (
              <span className={`text-xs ${muted}`}>{t('comments.edited')}</span>
            ) : null}
            {comment.reported ? (
              <span className={`text-xs ${muted}`}>{t('comments.reported')}</span>
            ) : null}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value.slice(0, COMMENT_MAX_LENGTH))}
                aria-label={t('comments.editComment')}
                maxLength={COMMENT_MAX_LENGTH}
                className={`focus:ring-primary-500 w-full resize-none rounded-2xl border px-3 py-2 text-sm focus:border-transparent focus:ring-2 ${
                  darkMode
                    ? 'border-white/10 bg-white/5 text-white'
                    : 'border-gray-200 bg-white text-gray-900'
                }`}
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || !e.shiftKey)) {
                    e.preventDefault()
                    submitEdit()
                  }
                }}
              />
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="primary" className="min-h-11" onClick={submitEdit}>
                  {t('common.save')}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="min-h-11"
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent('')
                  }}
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          ) : comment.spoiler && !spoilerOpen ? (
            <button
              type="button"
              onClick={() => setSpoilerOpen(true)}
              className={`mt-2 min-h-11 rounded-2xl px-3 text-sm font-semibold ${
                darkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {t('comments.revealSpoiler')}
            </button>
          ) : (
            <p className={`mt-1 text-sm leading-relaxed wrap-anywhere ${body}`}>
              {comment.spoiler ? (
                <span className={`mr-2 text-xs font-semibold uppercase ${muted}`}>
                  {t('comments.spoiler')}
                </span>
              ) : null}
              {comment.content}
            </p>
          )}

          {confirm ? (
            <div
              className={`mt-3 rounded-2xl p-3 text-sm ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}
            >
              <p className={body}>
                {confirm === 'delete' ? t('comments.deleteConfirm') : t('comments.reportConfirm')}
              </p>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant={confirm === 'delete' ? 'danger' : 'primary'}
                  className="min-h-11"
                  onClick={() => {
                    if (confirm === 'delete') onDelete?.(comment.id)
                    else onReport?.(comment.id)
                    setConfirm(null)
                  }}
                >
                  {confirm === 'delete' ? t('comments.confirmDelete') : t('comments.confirmReport')}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="min-h-11"
                  onClick={() => setConfirm(null)}
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          ) : null}

          <div className="mt-2 flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => onLike?.(comment.id)}
              disabled={!currentUserId}
              aria-label={comment.isLiked ? t('comments.unlike') : t('comments.like')}
              className={`flex min-h-11 items-center gap-1 rounded-2xl px-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                comment.isLiked ? 'text-red-500' : muted
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
                className={`flex min-h-11 items-center gap-1 rounded-2xl px-2 text-sm ${muted}`}
              >
                <Reply className="h-4 w-4" aria-hidden="true" />
                <span>{t('comments.reply')}</span>
              </button>
            ) : null}

            {currentUserId && !isEditing ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  title={t('comments.moreOptions')}
                  aria-label={t('comments.moreOptions')}
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className={`flex min-h-11 min-w-11 items-center justify-center rounded-2xl ${muted}`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {menuOpen ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`absolute right-0 z-10 mt-1 w-36 rounded-2xl py-1 shadow-lg ${
                        darkMode
                          ? 'border border-white/10 bg-gray-900'
                          : 'border border-gray-100 bg-white'
                      }`}
                    >
                      {isOwner && onEdit ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(true)
                            setEditContent(comment.content)
                            setMenuOpen(false)
                          }}
                          className={`flex min-h-11 w-full items-center gap-2 px-3 text-sm ${
                            darkMode
                              ? 'text-gray-100 hover:bg-white/5'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Edit3 className="h-4 w-4" />
                          {t('comments.edit')}
                        </button>
                      ) : null}
                      {isOwner ? (
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false)
                            setConfirm('delete')
                          }}
                          className="flex min-h-11 w-full items-center gap-2 px-3 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          {t('comments.delete')}
                        </button>
                      ) : onReport ? (
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false)
                            setConfirm('report')
                          }}
                          className={`flex min-h-11 w-full items-center gap-2 px-3 text-sm ${
                            darkMode
                              ? 'text-gray-100 hover:bg-white/5'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Flag className="h-4 w-4" aria-hidden="true" />
                          {t('comments.report')}
                        </button>
                      ) : null}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : null}
          </div>

          {replyOpen ? (
            <div className="mt-3">
              <ComposerFields
                value={replyContent}
                onChange={setReplyContent}
                placeholder={t('comments.replyPlaceholder')}
                label={t('comments.replyPlaceholder')}
                disabled={false}
                darkMode={darkMode}
                onSubmit={submitReply}
              />
              <label className={`mt-2 flex min-h-11 items-center gap-2 text-sm ${body}`}>
                <input
                  type="checkbox"
                  checked={replySpoiler}
                  onChange={(e) => setReplySpoiler(e.target.checked)}
                />
                {t('comments.markSpoiler')}
              </label>
              <div className="mt-2 flex justify-end">
                <Button
                  size="sm"
                  variant="primary"
                  className="min-h-11"
                  onClick={submitReply}
                  disabled={!replyContent.trim()}
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ) : null}

          {replyCount > 2 && visibleReplies < replyCount && !isReply ? (
            <button
              type="button"
              onClick={() => setVisibleReplies(replyCount)}
              className="text-primary-600 mt-3 flex min-h-11 items-center gap-1 text-sm font-medium"
            >
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
              {t('comments.loadMoreReplies', { count: replyCount - visibleReplies })}
            </button>
          ) : null}
        </div>
      </div>

      {shownReplies.length > 0 && !isReply ? (
        <div className="mt-4 space-y-4">
          {shownReplies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isReply
              currentUserId={currentUserId}
              darkMode={darkMode}
              onLike={onLike}
              onDelete={onDelete}
              onEdit={onEdit}
              onReport={onReport}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

const Comments = ({
  comments = [],
  totalCount,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  headingMode = 'title',
  darkMode = false,
  onAddComment,
  onReply,
  onLike,
  onDelete,
  onEdit,
  onReport,
}: CommentsProps) => {
  const { t } = useTranslation()
  const [newComment, setNewComment] = useState('')
  const [spoiler, setSpoiler] = useState(false)
  const [sort, setSort] = useState<CommentSort>('newest')
  const canComment = Boolean(currentUserId)
  const count =
    totalCount ?? comments.reduce((sum, item) => sum + 1 + (item.replies?.length ?? 0), 0)
  const sorted = useMemo(() => sortComments(comments, sort), [comments, sort])
  const surface = darkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'
  const border = darkMode ? 'border-white/10' : 'border-gray-100'
  const muted = darkMode ? 'text-gray-400' : 'text-gray-500'

  const handleSubmitComment = () => {
    if (!canComment || !newComment.trim()) return
    onAddComment?.(newComment, spoiler)
    setNewComment('')
    setSpoiler(false)
  }

  const sorts: CommentSort[] = ['best', 'newest', 'oldest']

  return (
    <div className={`rounded-2xl ${surface}`}>
      <div className={`border-b ${border} p-4 sm:p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {headingMode === 'title' ? (
            <div className="flex items-center gap-2">
              <MessageCircle className={`h-5 w-5 ${muted}`} aria-hidden="true" />
              <h3 className="text-lg font-semibold">
                {t('comments.title')} ({count})
              </h3>
            </div>
          ) : (
            <h3 className="text-sm font-semibold">
              <span className="sr-only">{t('comments.title')}</span>
              {t('comments.count', { count })}
            </h3>
          )}
          <div className="flex gap-1" role="group" aria-label={t('comments.sort')}>
            {sorts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSort(value)}
                aria-pressed={sort === value}
                className={`min-h-11 rounded-2xl px-3 text-sm font-semibold ${
                  sort === value
                    ? 'bg-primary-600 text-white'
                    : darkMode
                      ? 'text-gray-300 hover:bg-white/10'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t(`comments.sort${value.charAt(0).toUpperCase()}${value.slice(1)}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`border-b ${border} p-4 sm:p-6`}>
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <ComposerAvatar name={currentUserName} avatar={currentUserAvatar} darkMode={darkMode} />
          </div>
          <div className="flex-1">
            <ComposerFields
              value={newComment}
              onChange={setNewComment}
              placeholder={canComment ? t('comments.placeholder') : t('comments.loginToComment')}
              label={t('comments.placeholder')}
              disabled={!canComment}
              darkMode={darkMode}
              onSubmit={handleSubmitComment}
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <label className={`flex min-h-11 items-center gap-2 text-sm ${muted}`}>
                <input
                  type="checkbox"
                  checked={spoiler}
                  disabled={!canComment}
                  onChange={(e) => setSpoiler(e.target.checked)}
                />
                {t('comments.markSpoiler')}
              </label>
              <Button
                variant="primary"
                className="min-h-11"
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
        {sorted.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={currentUserId}
            darkMode={darkMode}
            onReply={onReply}
            onLike={onLike}
            onDelete={onDelete}
            onEdit={onEdit}
            onReport={onReport}
          />
        ))}

        {comments.length === 0 ? (
          <div className="py-8 text-center">
            <MessageCircle className={`mx-auto mb-3 h-12 w-12 ${muted}`} aria-hidden="true" />
            <p className={muted}>
              {isMockApi() ? t('comments.emptyMock') : t('comments.emptyHttp')}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Comments
