import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useEngagement } from '../context/EngagementContext'
import {
  fetchComments,
  postCommentAdd,
  postCommentDelete,
  postCommentEdit,
  postCommentLike,
  postCommentReply,
  postCommentReport,
} from '../lib/api/comments'
import { isMockApi } from '../lib/api/isMockApi'
import {
  COMMENT_REPLY_TITLE_KEY,
  STORAGE_KEY as COMMENTS_STORAGE_KEY,
  addComment,
  addReply,
  deleteComment,
  episodeNumberFromCommentKey,
  hrefFromCommentKey,
  listComments,
  reportComment,
  toggleCommentLike,
  updateComment,
  webtoonIdFromCommentKey,
  type StoredComment,
} from '../lib/comments'
import { DEFAULT_NOTIF_PREFS, addNotification, getNotifPrefs } from '../lib/notifications'
import { useCommentsSsr } from '../lib/ssr/commentsSsr'
import { useStorageSync } from './useStorageSync'

const COMMENTS_SYNC_KEYS = [COMMENTS_STORAGE_KEY]

export type CommentsThreadController = {
  comments: StoredComment[]
  commentKey: string
  add: (content: string, spoiler: boolean) => void
  reply: (commentId: string, content: string, spoiler: boolean) => void
  edit: (commentId: string, content: string) => void
  remove: (commentId: string) => void
  like: (commentId: string) => void
  report: (commentId: string) => void
}

function notifyMockReply(
  parent: StoredComment,
  actorId: string,
  commentKey: string,
  message: string
) {
  if (parent.userId === actorId) return
  const prefs = getNotifPrefs(parent.userId)
  if ((prefs.commentReply ?? DEFAULT_NOTIF_PREFS.commentReply) === false) return
  const episodeNumber = episodeNumberFromCommentKey(commentKey)
  addNotification(parent.userId, {
    id: `comment-reply-${parent.id}-${Date.now()}`,
    type: 'comment_reply',
    titleKey: COMMENT_REPLY_TITLE_KEY,
    message,
    isRead: false,
    createdAt: new Date().toISOString(),
    href: hrefFromCommentKey(commentKey),
    data: {
      webtoonId: webtoonIdFromCommentKey(commentKey),
      ...(episodeNumber ? { episodeNumber } : {}),
    },
  })
}

export function useCommentsThread(commentKey: string): CommentsThreadController {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { reloadInbox } = useEngagement()
  const ssr = useCommentsSsr()
  const mock = isMockApi()
  const [comments, setComments] = useState<StoredComment[]>(() =>
    ssr?.key === commentKey ? ssr.comments : []
  )

  const refreshMock = useCallback(() => {
    if (!commentKey) {
      setComments([])
      return
    }
    setComments(listComments(commentKey))
  }, [commentKey])

  useEffect(() => {
    if (!commentKey) {
      setComments([])
      return
    }
    if (mock) {
      refreshMock()
      return
    }
    if (ssr?.key === commentKey) {
      setComments(ssr.comments)
    }
    let cancelled = false
    void fetchComments(commentKey)
      .then((list) => {
        if (!cancelled) setComments(list)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [commentKey, mock, refreshMock, ssr])

  useStorageSync(mock ? COMMENTS_SYNC_KEYS : [], refreshMock)

  const commentUser = useMemo(
    () =>
      user
        ? {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            avatar: user.avatar,
          }
        : null,
    [user]
  )

  const add = useCallback(
    (content: string, spoiler: boolean) => {
      if (!commentKey || !commentUser) return
      if (mock) {
        setComments(addComment(commentKey, commentUser, content, spoiler))
        return
      }
      void postCommentAdd(commentKey, content, spoiler)
        .then(setComments)
        .catch(() => undefined)
    },
    [commentKey, commentUser, mock]
  )

  const reply = useCallback(
    (commentId: string, content: string, spoiler: boolean) => {
      if (!commentKey || !commentUser) return
      if (mock) {
        const parent = comments.find((c) => c.id === commentId)
        setComments(addReply(commentKey, commentId, commentUser, content, spoiler))
        if (parent) {
          notifyMockReply(
            parent,
            commentUser.id,
            commentKey,
            t('notificationsPage.commentReplyBody')
          )
        }
        reloadInbox()
        return
      }
      void postCommentReply(commentKey, commentId, content, spoiler)
        .then((list) => {
          setComments(list)
          reloadInbox()
        })
        .catch(() => undefined)
    },
    [commentKey, commentUser, comments, mock, reloadInbox, t]
  )

  const edit = useCallback(
    (commentId: string, content: string) => {
      if (!commentKey || !user) return
      if (mock) {
        setComments(updateComment(commentKey, commentId, user.id, content))
        return
      }
      void postCommentEdit(commentKey, commentId, content)
        .then(setComments)
        .catch(() => undefined)
    },
    [commentKey, mock, user]
  )

  const remove = useCallback(
    (commentId: string) => {
      if (!commentKey || !user) return
      if (mock) {
        setComments(deleteComment(commentKey, commentId, user.id))
        return
      }
      void postCommentDelete(commentKey, commentId)
        .then(setComments)
        .catch(() => undefined)
    },
    [commentKey, mock, user]
  )

  const like = useCallback(
    (commentId: string) => {
      if (!commentKey || !user) return
      if (mock) {
        setComments(toggleCommentLike(commentKey, commentId, user.id))
        return
      }
      void postCommentLike(commentKey, commentId)
        .then(setComments)
        .catch(() => undefined)
    },
    [commentKey, mock, user]
  )

  const report = useCallback(
    (commentId: string) => {
      if (!commentKey || !user) return
      if (mock) {
        setComments(reportComment(commentKey, commentId))
        return
      }
      void postCommentReport(commentKey, commentId)
        .then(setComments)
        .catch(() => undefined)
    },
    [commentKey, mock, user]
  )

  return {
    comments,
    commentKey,
    add,
    reply,
    edit,
    remove,
    like,
    report,
  }
}
