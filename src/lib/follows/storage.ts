import { FOLLOWS_SCHEMA_VERSION, type FollowRecord, type FollowsStore } from './types'

export const STORAGE_KEY = 'softgate_follows_v1'

function emptyStore(): FollowsStore {
  return { schemaVersion: FOLLOWS_SCHEMA_VERSION, byUserId: {} }
}

function parseFollow(item: unknown): FollowRecord | null {
  if (!item || typeof item !== 'object') return null
  const rec = item as FollowRecord
  if (typeof rec.authorId !== 'string' || typeof rec.addedAt !== 'string') return null
  return { authorId: rec.authorId, addedAt: rec.addedAt }
}

export function readStore(): FollowsStore {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return emptyStore()
    const obj = parsed as Partial<FollowsStore>
    if (
      obj.schemaVersion !== FOLLOWS_SCHEMA_VERSION ||
      !obj.byUserId ||
      typeof obj.byUserId !== 'object'
    ) {
      return emptyStore()
    }
    const byUserId: Record<string, FollowRecord[]> = {}
    for (const [userId, list] of Object.entries(obj.byUserId)) {
      if (!Array.isArray(list)) continue
      byUserId[userId] = list.flatMap((item) => {
        const row = parseFollow(item)
        return row ? [row] : []
      })
    }
    return { schemaVersion: FOLLOWS_SCHEMA_VERSION, byUserId }
  } catch {
    return emptyStore()
  }
}

export function writeStore(store: FollowsStore): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}
