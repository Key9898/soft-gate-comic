import { readStore as readEngagement, writeStore as writeEngagement } from '../engagement'
import { readStore as readWallet, writeStore as writeWallet } from '../wallet'
import { readStore as readLibrary, writeStore as writeLibrary } from '../library'
import { readStore as readFollows, writeStore as writeFollows } from '../follows'
import { readStore as readNotifications, writeStore as writeNotifications } from '../notifications'
import { readPrefsStore, writePrefsStore } from '../notifications/prefs'
import { readAgeConfirmStore, writeAgeConfirmStore } from '../contentRating'
import { readStore as readComments, writeStore as writeComments } from '../comments'
import type { StoredComment } from '../comments'

interface ByUserStore<T> {
  byUserId: Record<string, T>
}

function moveUserEntry<T, S extends ByUserStore<T>>(
  read: () => S,
  write: (store: S) => void,
  oldUserId: string,
  newUserId: string
): void {
  const store = read()
  const entry = store.byUserId[oldUserId]
  if (entry === undefined) return
  store.byUserId[newUserId] = entry
  delete store.byUserId[oldUserId]
  write(store)
}

function deleteUserEntry<T, S extends ByUserStore<T>>(
  read: () => S,
  write: (store: S) => void,
  userId: string
): void {
  const store = read()
  if (!(userId in store.byUserId)) return
  delete store.byUserId[userId]
  write(store)
}

function replaceLikerId(comment: StoredComment, oldUserId: string, newUserId: string) {
  const liked = comment.likedByUserIds
  if (!liked?.includes(oldUserId)) return comment
  const likedByUserIds = [...new Set(liked.map((id) => (id === oldUserId ? newUserId : id)))]
  return { ...comment, likedByUserIds, likeCount: likedByUserIds.length }
}

/**
 * Moves every per-user store entry from the old (email-hash) userId to the new
 * one and rewrites comment authorship/likes. If the new id already holds stale
 * data, the migrated data wins — the active account's continuity takes priority.
 */
export function migrateUserData(oldUserId: string, newUserId: string): void {
  if (!oldUserId || !newUserId || oldUserId === newUserId) return
  moveUserEntry(readEngagement, writeEngagement, oldUserId, newUserId)
  moveUserEntry(readWallet, writeWallet, oldUserId, newUserId)
  moveUserEntry(readLibrary, writeLibrary, oldUserId, newUserId)
  moveUserEntry(readFollows, writeFollows, oldUserId, newUserId)
  moveUserEntry(readNotifications, writeNotifications, oldUserId, newUserId)
  moveUserEntry(readPrefsStore, writePrefsStore, oldUserId, newUserId)
  moveUserEntry(readAgeConfirmStore, writeAgeConfirmStore, oldUserId, newUserId)

  const comments = readComments()
  let changed = false
  for (const [episodeKey, list] of Object.entries(comments.byEpisodeKey)) {
    const next = list.map((c) => {
      let updated =
        c.userId === oldUserId ? { ...c, userId: newUserId, user: { ...c.user, id: newUserId } } : c
      updated = replaceLikerId(updated, oldUserId, newUserId)
      if (updated !== c) changed = true
      return updated
    })
    comments.byEpisodeKey[episodeKey] = next
  }
  if (changed) writeComments(comments)
}

/**
 * Cascade-deletes every trace of a user: the four byUserId stores, their
 * comments (plus replies to them, matching single-level threading semantics),
 * and their likes on other users' comments.
 */
export function deleteUserData(userId: string): void {
  if (!userId) return
  deleteUserEntry(readEngagement, writeEngagement, userId)
  deleteUserEntry(readWallet, writeWallet, userId)
  deleteUserEntry(readLibrary, writeLibrary, userId)
  deleteUserEntry(readFollows, writeFollows, userId)
  deleteUserEntry(readNotifications, writeNotifications, userId)
  deleteUserEntry(readPrefsStore, writePrefsStore, userId)
  deleteUserEntry(readAgeConfirmStore, writeAgeConfirmStore, userId)

  const comments = readComments()
  let changed = false
  for (const [episodeKey, list] of Object.entries(comments.byEpisodeKey)) {
    const ownIds = new Set(list.filter((c) => c.userId === userId).map((c) => c.id))
    const kept = list
      .filter((c) => c.userId !== userId && !(c.parentId && ownIds.has(c.parentId)))
      .map((c) => {
        if (!c.likedByUserIds?.includes(userId)) return c
        const likedByUserIds = c.likedByUserIds.filter((id) => id !== userId)
        return { ...c, likedByUserIds, likeCount: likedByUserIds.length }
      })
    if (kept.length !== list.length || kept.some((c, i) => c !== list[i])) {
      changed = true
      if (kept.length === 0) delete comments.byEpisodeKey[episodeKey]
      else comments.byEpisodeKey[episodeKey] = kept
    }
  }
  if (changed) writeComments(comments)
}
