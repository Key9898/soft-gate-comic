import { readStore, writeStore } from './storage'
import type { AppNotification } from './types'
import { getNotifPrefs, isNotificationTypeEnabled } from './prefs'

export function ensureNotifications(userId: string): AppNotification[] {
  if (!userId) return []
  const store = readStore()
  if (store.byUserId[userId]) {
    return [...store.byUserId[userId]].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }
  store.byUserId[userId] = []
  writeStore(store)
  return []
}

function visibleNotifications(userId: string): AppNotification[] {
  const prefs = getNotifPrefs(userId)
  return ensureNotifications(userId).filter((item) => isNotificationTypeEnabled(item.type, prefs))
}

export function listNotifications(userId: string): AppNotification[] {
  return visibleNotifications(userId)
}

export function unreadCount(userId: string): number {
  return visibleNotifications(userId).filter((n) => !n.isRead).length
}

export function addNotification(userId: string, notification: AppNotification): AppNotification[] {
  if (!userId) return []
  const current = ensureNotifications(userId)
  const store = readStore()
  store.byUserId[userId] = [notification, ...current.filter((item) => item.id !== notification.id)]
  writeStore(store)
  return listNotifications(userId)
}

export function markAsRead(userId: string, id: string): AppNotification[] {
  if (!userId || !id) return listNotifications(userId)
  const list = ensureNotifications(userId).map((n) => (n.id === id ? { ...n, isRead: true } : n))
  const store = readStore()
  store.byUserId[userId] = list
  writeStore(store)
  return listNotifications(userId)
}

export function markAllRead(userId: string): AppNotification[] {
  if (!userId) return []
  const list = ensureNotifications(userId).map((n) => ({ ...n, isRead: true }))
  const store = readStore()
  store.byUserId[userId] = list
  writeStore(store)
  return listNotifications(userId)
}

export function deleteNotification(userId: string, id: string): AppNotification[] {
  if (!userId || !id) return listNotifications(userId)
  const list = ensureNotifications(userId).filter((n) => n.id !== id)
  const store = readStore()
  store.byUserId[userId] = list
  writeStore(store)
  return listNotifications(userId)
}

export function clearRead(userId: string): AppNotification[] {
  if (!userId) return []
  const list = ensureNotifications(userId).filter((n) => !n.isRead)
  const store = readStore()
  store.byUserId[userId] = list
  writeStore(store)
  return listNotifications(userId)
}
