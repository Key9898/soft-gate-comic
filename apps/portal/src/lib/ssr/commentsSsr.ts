import { createContext, useContext } from 'react'
import { episodeCommentKey, isCommentKey, seriesCommentKey, type StoredComment } from '../comments'
import { stripLocalePrefix } from '../locale'

export type CommentsSsrSeed = {
  key: string
  comments: StoredComment[]
} | null

export const CommentsSsrContext = createContext<CommentsSsrSeed>(null)

export const useCommentsSsr = () => useContext(CommentsSsrContext)

export function commentKeyFromPathname(url: string): string | null {
  const path = stripLocalePrefix(url.split('?')[0].split('#')[0])
  const webtoon = path.match(/^\/webtoon\/([^/]+)$/)
  if (webtoon?.[1]) {
    const key = seriesCommentKey(webtoon[1])
    return isCommentKey(key) ? key : null
  }
  const read = path.match(/^\/read\/([^/]+)\/([1-9]\d*)$/)
  if (read?.[1] && read[2]) {
    const key = episodeCommentKey(read[1], Number(read[2]))
    return isCommentKey(key) ? key : null
  }
  return null
}

function apiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
}

export async function loadCommentsSsrSeed(url: string): Promise<CommentsSsrSeed> {
  const key = commentKeyFromPathname(url)
  if (!key) return null
  try {
    const res = await fetch(`${apiBaseUrl()}/api/comments?key=${encodeURIComponent(key)}`, {
      signal: AbortSignal.timeout(400),
    })
    const payload: unknown = await res.json().catch(() => null)
    if (!res.ok || !payload || typeof payload !== 'object' || !('data' in payload)) {
      return { key, comments: [] }
    }
    const data = (payload as { data?: { comments?: unknown } }).data
    const comments = Array.isArray(data?.comments) ? (data.comments as StoredComment[]) : []
    return { key, comments }
  } catch {
    return { key, comments: [] }
  }
}

export function commentsSsrInlineScript(seed: CommentsSsrSeed): string {
  const json = JSON.stringify(seed).replace(/</g, '\\u003c')
  return `<script>window.__SG_COMMENTS_SSR__=${json}</script>`
}

export function readClientCommentsSsrSeed(): CommentsSsrSeed {
  if (typeof window === 'undefined') return null
  return window.__SG_COMMENTS_SSR__ ?? null
}

declare global {
  interface Window {
    __SG_COMMENTS_SSR__?: CommentsSsrSeed
  }
}
