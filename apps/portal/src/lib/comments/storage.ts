import { COMMENTS_SCHEMA_VERSION, type CommentsStore, type StoredComment } from './types'

export const STORAGE_KEY = 'softgate_comments_v1'

function emptyStore(): CommentsStore {
  return { schemaVersion: COMMENTS_SCHEMA_VERSION, byEpisodeKey: {} }
}

function isComment(item: unknown): item is StoredComment {
  if (!item || typeof item !== 'object') return false
  const c = item as Partial<StoredComment>
  return (
    typeof c.id === 'string' &&
    typeof c.episodeKey === 'string' &&
    typeof c.userId === 'string' &&
    typeof c.content === 'string' &&
    typeof c.createdAt === 'string' &&
    Boolean(c.user) &&
    typeof c.user === 'object'
  )
}

export function readStore(): CommentsStore {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return emptyStore()
    const obj = parsed as Partial<CommentsStore>
    if (
      obj.schemaVersion !== COMMENTS_SCHEMA_VERSION ||
      !obj.byEpisodeKey ||
      typeof obj.byEpisodeKey !== 'object'
    ) {
      return emptyStore()
    }
    const byEpisodeKey: Record<string, StoredComment[]> = {}
    for (const [key, list] of Object.entries(obj.byEpisodeKey)) {
      if (!Array.isArray(list)) continue
      byEpisodeKey[key] = list.filter(isComment)
    }
    return { schemaVersion: COMMENTS_SCHEMA_VERSION, byEpisodeKey }
  } catch {
    return emptyStore()
  }
}

export function writeStore(store: CommentsStore): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}
