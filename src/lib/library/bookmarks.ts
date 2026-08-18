import { readStore, writeStore } from './storage'
import type { BookmarkRecord } from './types'

export function listBookmarks(userId: string): BookmarkRecord[] {
  if (!userId) return []
  return [...(readStore().byUserId[userId] ?? [])].sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  )
}

export function isBookmarked(userId: string, webtoonId: string): boolean {
  if (!userId || !webtoonId) return false
  return (readStore().byUserId[userId] ?? []).some((b) => b.webtoonId === webtoonId)
}

export function toggleBookmark(userId: string, webtoonId: string): BookmarkRecord[] {
  if (!userId || !webtoonId) return listBookmarks(userId)
  const store = readStore()
  const current = store.byUserId[userId] ?? []
  const exists = current.some((b) => b.webtoonId === webtoonId)
  const next = exists
    ? current.filter((b) => b.webtoonId !== webtoonId)
    : [
        { webtoonId, addedAt: new Date().toISOString() },
        ...current.filter((b) => b.webtoonId !== webtoonId),
      ]
  store.byUserId[userId] = next
  writeStore(store)
  return listBookmarks(userId)
}

export function removeBookmark(userId: string, webtoonId: string): BookmarkRecord[] {
  if (!userId || !webtoonId) return listBookmarks(userId)
  const store = readStore()
  store.byUserId[userId] = (store.byUserId[userId] ?? []).filter((b) => b.webtoonId !== webtoonId)
  writeStore(store)
  return listBookmarks(userId)
}

export function removeBookmarks(userId: string, webtoonIds: string[]): BookmarkRecord[] {
  if (!userId || webtoonIds.length === 0) return listBookmarks(userId)
  const drop = new Set(webtoonIds)
  const store = readStore()
  store.byUserId[userId] = (store.byUserId[userId] ?? []).filter((b) => !drop.has(b.webtoonId))
  writeStore(store)
  return listBookmarks(userId)
}
