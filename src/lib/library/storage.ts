import { LIBRARY_SCHEMA_VERSION, type BookmarkRecord, type LibraryStore } from './types'

export const STORAGE_KEY = 'softgate_library_v1'

function emptyStore(): LibraryStore {
  return { schemaVersion: LIBRARY_SCHEMA_VERSION, byUserId: {} }
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
      byUserId[userId] = list.filter(
        (item): item is BookmarkRecord =>
          Boolean(item) &&
          typeof item === 'object' &&
          typeof (item as BookmarkRecord).webtoonId === 'string' &&
          typeof (item as BookmarkRecord).addedAt === 'string'
      )
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
