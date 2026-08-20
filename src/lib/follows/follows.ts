import { readStore, writeStore } from './storage'
import type { FollowRecord } from './types'

export function listFollows(userId: string): FollowRecord[] {
  if (!userId) return []
  return [...(readStore().byUserId[userId] ?? [])].sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  )
}

export function isFollowing(userId: string, authorId: string): boolean {
  if (!userId || !authorId) return false
  return (readStore().byUserId[userId] ?? []).some((row) => row.authorId === authorId)
}

export function toggleFollow(userId: string, authorId: string): FollowRecord[] {
  if (!userId || !authorId) return listFollows(userId)
  const store = readStore()
  const current = store.byUserId[userId] ?? []
  const exists = current.some((row) => row.authorId === authorId)
  store.byUserId[userId] = exists
    ? current.filter((row) => row.authorId !== authorId)
    : [{ authorId, addedAt: new Date().toISOString() }, ...current]
  writeStore(store)
  return listFollows(userId)
}
