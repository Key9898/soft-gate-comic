import { readStore, writeStore } from './storage'
import type { CommentUser, StoredComment } from './types'

function newCommentId(): string {
  return `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export const SERIES_COMMENT_SUFFIX = 'series'
export const COMMENT_MAX_LENGTH = 500
export const COMMENT_REPLY_TITLE_KEY = 'notificationsPage.commentReply'

export const DEMO_COMMENT_STICKERS = [
  '😀',
  '😂',
  '🥰',
  '🔥',
  '👍',
  '❤️',
  '😮',
  '😢',
  '🎉',
  '💯',
] as const

export function episodeCommentKey(webtoonId: string, episodeNumber: number): string {
  return `${webtoonId}:${episodeNumber}`
}

export function seriesCommentKey(webtoonId: string): string {
  if (!webtoonId) return ''
  return `${webtoonId}:${SERIES_COMMENT_SUFFIX}`
}

export function isCommentKey(key: string): boolean {
  const trimmed = key.trim()
  if (!trimmed) return false
  return /^.+:series$/.test(trimmed) || /^.+:[1-9]\d*$/.test(trimmed)
}

export function hrefFromCommentKey(episodeKey: string): string {
  if (episodeKey.endsWith(`:${SERIES_COMMENT_SUFFIX}`)) {
    return `/webtoon/${episodeKey.slice(0, -(SERIES_COMMENT_SUFFIX.length + 1))}`
  }
  const colon = episodeKey.lastIndexOf(':')
  if (colon === -1) return '/'
  return `/read/${episodeKey.slice(0, colon)}/${episodeKey.slice(colon + 1)}`
}

export function webtoonIdFromCommentKey(episodeKey: string): string {
  const colon = episodeKey.lastIndexOf(':')
  return colon === -1 ? episodeKey : episodeKey.slice(0, colon)
}

export function episodeNumberFromCommentKey(episodeKey: string): number | undefined {
  if (episodeKey.endsWith(`:${SERIES_COMMENT_SUFFIX}`)) return undefined
  const colon = episodeKey.lastIndexOf(':')
  const n = Number(episodeKey.slice(colon + 1))
  return Number.isInteger(n) && n >= 1 ? n : undefined
}

function trimmedContent(content: string): string | null {
  const trimmed = content.trim()
  if (!trimmed || trimmed.length > COMMENT_MAX_LENGTH) return null
  return trimmed
}

export function listComments(episodeKey: string): StoredComment[] {
  if (!episodeKey) return []
  return [...(readStore().byEpisodeKey[episodeKey] ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function addComment(
  episodeKey: string,
  user: CommentUser,
  content: string,
  spoiler = false
): StoredComment[] {
  const trimmed = trimmedContent(content)
  if (!episodeKey || !user.id || !trimmed) return listComments(episodeKey)
  const store = readStore()
  const comment: StoredComment = {
    id: newCommentId(),
    episodeKey,
    userId: user.id,
    user,
    content: trimmed,
    likeCount: 0,
    likedByUserIds: [],
    createdAt: new Date().toISOString(),
    ...(spoiler ? { spoiler: true } : {}),
  }
  store.byEpisodeKey[episodeKey] = [comment, ...(store.byEpisodeKey[episodeKey] ?? [])]
  writeStore(store)
  return listComments(episodeKey)
}

export function addReply(
  episodeKey: string,
  parentId: string,
  user: CommentUser,
  content: string,
  spoiler = false
): StoredComment[] {
  const trimmed = trimmedContent(content)
  if (!episodeKey || !parentId || !user.id || !trimmed) return listComments(episodeKey)
  const store = readStore()
  const existing = store.byEpisodeKey[episodeKey] ?? []
  const parent = existing.find((c) => c.id === parentId)
  if (!parent) return listComments(episodeKey)
  const reply: StoredComment = {
    id: newCommentId(),
    episodeKey,
    userId: user.id,
    user,
    content: trimmed,
    likeCount: 0,
    likedByUserIds: [],
    createdAt: new Date().toISOString(),
    parentId: parent.parentId ?? parent.id,
    ...(spoiler ? { spoiler: true } : {}),
  }
  store.byEpisodeKey[episodeKey] = [reply, ...existing]
  writeStore(store)
  return listComments(episodeKey)
}

export function updateComment(
  episodeKey: string,
  commentId: string,
  userId: string,
  content: string
): StoredComment[] {
  const trimmed = trimmedContent(content)
  if (!episodeKey || !commentId || !trimmed) return listComments(episodeKey)
  const store = readStore()
  store.byEpisodeKey[episodeKey] = (store.byEpisodeKey[episodeKey] ?? []).map((c) =>
    c.id === commentId && c.userId === userId ? { ...c, content: trimmed, isEdited: true } : c
  )
  writeStore(store)
  return listComments(episodeKey)
}

export function deleteComment(
  episodeKey: string,
  commentId: string,
  userId: string
): StoredComment[] {
  if (!episodeKey || !commentId) return listComments(episodeKey)
  const store = readStore()
  const existing = store.byEpisodeKey[episodeKey] ?? []
  const target = existing.find((c) => c.id === commentId && c.userId === userId)
  if (!target) return listComments(episodeKey)
  store.byEpisodeKey[episodeKey] = existing.filter(
    (c) => c.id !== target.id && c.parentId !== target.id
  )
  writeStore(store)
  return listComments(episodeKey)
}

export function toggleCommentLike(
  episodeKey: string,
  commentId: string,
  userId: string
): StoredComment[] {
  if (!episodeKey || !commentId || !userId) return listComments(episodeKey)
  const store = readStore()
  store.byEpisodeKey[episodeKey] = (store.byEpisodeKey[episodeKey] ?? []).map((c) => {
    if (c.id !== commentId) return c
    const liked = c.likedByUserIds ?? []
    const likedByUserIds = liked.includes(userId)
      ? liked.filter((id) => id !== userId)
      : [...liked, userId]
    return {
      ...c,
      likedByUserIds,
      likeCount: likedByUserIds.length,
    }
  })
  writeStore(store)
  return listComments(episodeKey)
}

export function reportComment(episodeKey: string, commentId: string): StoredComment[] {
  if (!episodeKey || !commentId) return listComments(episodeKey)
  const store = readStore()
  store.byEpisodeKey[episodeKey] = (store.byEpisodeKey[episodeKey] ?? []).map((c) =>
    c.id === commentId ? { ...c, reported: true } : c
  )
  writeStore(store)
  return listComments(episodeKey)
}
