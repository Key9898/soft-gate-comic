import { unwrapApiData } from '@softgate/contracts'
import type { StoredComment } from '../comments/types'
import { authFetch } from './authFetch'

const apiBaseUrl = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

type CommentsPayload = { comments: StoredComment[] }

function commentsOf(payload: CommentsPayload | null | undefined): StoredComment[] {
  return Array.isArray(payload?.comments) ? payload.comments : []
}

export async function fetchComments(key: string): Promise<StoredComment[]> {
  const res = await fetch(`${apiBaseUrl()}/api/comments?key=${encodeURIComponent(key)}`, {
    credentials: 'include',
  })
  const payload: unknown = await res.json().catch(() => null)
  if (!res.ok) return []
  return commentsOf(unwrapApiData<CommentsPayload>(payload))
}

export async function postCommentAdd(
  key: string,
  content: string,
  spoiler: boolean
): Promise<StoredComment[]> {
  const data = await authFetch<CommentsPayload>('/api/comments/add', {
    method: 'POST',
    body: JSON.stringify({ key, content, spoiler }),
  })
  return commentsOf(data)
}

export async function postCommentReply(
  key: string,
  parentId: string,
  content: string,
  spoiler: boolean
): Promise<StoredComment[]> {
  const data = await authFetch<CommentsPayload>('/api/comments/reply', {
    method: 'POST',
    body: JSON.stringify({ key, parentId, content, spoiler }),
  })
  return commentsOf(data)
}

export async function postCommentEdit(
  key: string,
  commentId: string,
  content: string
): Promise<StoredComment[]> {
  const data = await authFetch<CommentsPayload>('/api/comments/edit', {
    method: 'POST',
    body: JSON.stringify({ key, commentId, content }),
  })
  return commentsOf(data)
}

export async function postCommentDelete(key: string, commentId: string): Promise<StoredComment[]> {
  const data = await authFetch<CommentsPayload>('/api/comments/delete', {
    method: 'POST',
    body: JSON.stringify({ key, commentId }),
  })
  return commentsOf(data)
}

export async function postCommentLike(key: string, commentId: string): Promise<StoredComment[]> {
  const data = await authFetch<CommentsPayload>('/api/comments/like', {
    method: 'POST',
    body: JSON.stringify({ key, commentId }),
  })
  return commentsOf(data)
}

export async function postCommentReport(key: string, commentId: string): Promise<StoredComment[]> {
  const data = await authFetch<CommentsPayload>('/api/comments/report', {
    method: 'POST',
    body: JSON.stringify({ key, commentId }),
  })
  return commentsOf(data)
}
