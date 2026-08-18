import { readStore, writeStore } from './storage'
import type { CommentUser, StoredComment } from './types'

function newCommentId(): string {
  return `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function episodeCommentKey(webtoonId: string, episodeNumber: number): string {
  return `${webtoonId}:${episodeNumber}`
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
  content: string
): StoredComment[] {
  const trimmed = content.trim()
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
  }
  store.byEpisodeKey[episodeKey] = [comment, ...(store.byEpisodeKey[episodeKey] ?? [])]
  writeStore(store)
  return listComments(episodeKey)
}

export function addReply(
  episodeKey: string,
  parentId: string,
  user: CommentUser,
  content: string
): StoredComment[] {
  const trimmed = content.trim()
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
  const trimmed = content.trim()
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
