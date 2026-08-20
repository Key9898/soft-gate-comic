import { LIBRARY_SCHEMA_VERSION, type BookmarkRecord, type LibraryStore } from './types'

export const STORAGE_KEY = 'softgate_library_v1'

function emptyStore(): LibraryStore {
  return { schemaVersion: LIBRARY_SCHEMA_VERSION, byUserId: {} }
}

function parseBookmark(item: unknown): BookmarkRecord | null {
  if (!item || typeof item !== 'object') return null
  const rec = item as BookmarkRecord
  if (typeof rec.webtoonId !== 'string' || typeof rec.addedAt !== 'string') return null
  const next: BookmarkRecord = { webtoonId: rec.webtoonId, addedAt: rec.addedAt }
  if (typeof rec.notifyMuted === 'boolean') next.notifyMuted = rec.notifyMuted
  if (
    typeof rec.lastNotifiedEpisodeNumber === 'number' &&
    Number.isFinite(rec.lastNotifiedEpisodeNumber)
  ) {
    next.lastNotifiedEpisodeNumber = rec.lastNotifiedEpisodeNumber
  }
  return next
}

export function readStore(): LibraryStore {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return emptyStore()
    const obj = parsed as Partial<LibraryStore>
    if (
      obj.schemaVersion !== LIBRARY_SCHEMA_VERSION ||
      !obj.byUserId ||
      typeof obj.byUserId !== 'object'
    ) {
      return emptyStore()
    }
    const byUserId: Record<string, BookmarkRecord[]> = {}
    for (const [userId, list] of Object.entries(obj.byUserId)) {
      if (!Array.isArray(list)) continue
      byUserId[userId] = list.flatMap((item) => {
        const parsed = parseBookmark(item)
        return parsed ? [parsed] : []
      })
    }
    return { schemaVersion: LIBRARY_SCHEMA_VERSION, byUserId }
  } catch {
    return emptyStore()
  }
}

export function writeStore(store: LibraryStore): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}
