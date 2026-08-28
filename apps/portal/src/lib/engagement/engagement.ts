import { isValidRating } from '../rating'
import { readStore, writeStore } from './storage'
import type { HistoryRecord, UserEngagement } from './types'

function emptyEngagement(): UserEngagement {
  return { history: [], likedWebtoonIds: [], ratings: {} }
}

function getOrCreate(userId: string): UserEngagement {
  if (!userId) return emptyEngagement()
  const store = readStore()
  const existing = store.byUserId[userId]
  if (existing) {
    return {
      history: [...existing.history],
      likedWebtoonIds: [...existing.likedWebtoonIds],
      ratings: { ...existing.ratings },
    }
  }
  const created = emptyEngagement()
  store.byUserId[userId] = created
  writeStore(store)
  return created
}

export function listHistory(userId: string): HistoryRecord[] {
  return [...getOrCreate(userId).history].sort(
    (a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime()
  )
}

function mergeReadEpisodes(previous: HistoryRecord | undefined, episodeNumber: number): number[] {
  const existing = previous ? (previous.readEpisodeNumbers ?? [previous.episodeNumber]) : []
  return [...new Set([...existing, episodeNumber])].sort((a, b) => a - b)
}

export function recordHistory(
  userId: string,
  webtoonId: string,
  episodeNumber: number
): HistoryRecord[] {
  if (!userId || !webtoonId || !Number.isFinite(episodeNumber)) return listHistory(userId)
  const store = readStore()
  const current = getOrCreate(userId)
  const now = new Date().toISOString()
  const previous = current.history.find((h) => h.webtoonId === webtoonId)
  const sameEpisode = previous?.episodeNumber === episodeNumber
  const without = current.history.filter((h) => h.webtoonId !== webtoonId)
  const next: UserEngagement = {
    ...current,
    history: [
      {
        webtoonId,
        episodeNumber,
        lastReadAt: now,
        scrollRatio: sameEpisode ? (previous?.scrollRatio ?? 0) : 0,
        readEpisodeNumbers: mergeReadEpisodes(previous, episodeNumber),
      },
      ...without,
    ],
  }
  store.byUserId[userId] = next
  writeStore(store)
  return listHistory(userId)
}

export function updateReadingProgress(
  userId: string,
  webtoonId: string,
  episodeNumber: number,
  scrollRatio: number
): HistoryRecord[] {
  if (!userId || !webtoonId || !Number.isFinite(episodeNumber)) return listHistory(userId)
  const ratio = Math.min(1, Math.max(0, Number.isFinite(scrollRatio) ? scrollRatio : 0))
  const store = readStore()
  const current = getOrCreate(userId)
  const now = new Date().toISOString()
  const previous = current.history.find((h) => h.webtoonId === webtoonId)
  const without = current.history.filter((h) => h.webtoonId !== webtoonId)
  const next: UserEngagement = {
    ...current,
    history: [
      {
        webtoonId,
        episodeNumber,
        lastReadAt: now,
        scrollRatio: ratio,
        readEpisodeNumbers: mergeReadEpisodes(previous, episodeNumber),
      },
      ...without,
    ],
  }
  store.byUserId[userId] = next
  writeStore(store)
  return listHistory(userId)
}

export function removeHistory(userId: string, webtoonIds: string[]): HistoryRecord[] {
  if (!userId || webtoonIds.length === 0) return listHistory(userId)
  const drop = new Set(webtoonIds)
  const store = readStore()
  const current = getOrCreate(userId)
  store.byUserId[userId] = {
    ...current,
    history: current.history.filter((h) => !drop.has(h.webtoonId)),
  }
  writeStore(store)
  return listHistory(userId)
}

export function listLikedWebtoonIds(userId: string): string[] {
  return [...getOrCreate(userId).likedWebtoonIds]
}

export function isLiked(userId: string, webtoonId: string): boolean {
  if (!userId || !webtoonId) return false
  return getOrCreate(userId).likedWebtoonIds.includes(webtoonId)
}

export function toggleLike(userId: string, webtoonId: string): string[] {
  if (!userId || !webtoonId) return listLikedWebtoonIds(userId)
  const store = readStore()
  const current = getOrCreate(userId)
  const exists = current.likedWebtoonIds.includes(webtoonId)
  const likedWebtoonIds = exists
    ? current.likedWebtoonIds.filter((id) => id !== webtoonId)
    : [webtoonId, ...current.likedWebtoonIds.filter((id) => id !== webtoonId)]
  store.byUserId[userId] = { ...current, likedWebtoonIds }
  writeStore(store)
  return [...likedWebtoonIds]
}

export function removeLikes(userId: string, webtoonIds: string[]): string[] {
  if (!userId || webtoonIds.length === 0) return listLikedWebtoonIds(userId)
  const drop = new Set(webtoonIds)
  const store = readStore()
  const current = getOrCreate(userId)
  const likedWebtoonIds = current.likedWebtoonIds.filter((id) => !drop.has(id))
  store.byUserId[userId] = { ...current, likedWebtoonIds }
  writeStore(store)
  return [...likedWebtoonIds]
}

export function listRatings(userId: string): Record<string, number> {
  return { ...getOrCreate(userId).ratings }
}

export function getRating(userId: string, webtoonId: string): number | null {
  if (!userId || !webtoonId) return null
  const value = getOrCreate(userId).ratings[webtoonId]
  return isValidRating(value) ? value : null
}

export function setRating(
  userId: string,
  webtoonId: string,
  value: number
): Record<string, number> {
  if (!userId || !webtoonId || !isValidRating(value)) return listRatings(userId)
  const store = readStore()
  const current = getOrCreate(userId)
  const ratings = { ...current.ratings, [webtoonId]: value }
  store.byUserId[userId] = { ...current, ratings }
  writeStore(store)
  return { ...ratings }
}

export function clearRating(userId: string, webtoonId: string): Record<string, number> {
  if (!userId || !webtoonId) return listRatings(userId)
  const store = readStore()
  const current = getOrCreate(userId)
  if (!(webtoonId in current.ratings)) return { ...current.ratings }
  const ratings = { ...current.ratings }
  delete ratings[webtoonId]
  store.byUserId[userId] = { ...current, ratings }
  writeStore(store)
  return { ...ratings }
}
