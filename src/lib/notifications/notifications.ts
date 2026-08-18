import i18n from '../i18n'
import { readStore, writeStore } from './storage'
import type { AppNotification } from './types'

function seedNotifications(): AppNotification[] {
  const now = Date.now()
  return [
    {
      id: 'n1',
      type: 'new_episode',
      titleKey: 'notificationsPage.newEpisode',
      message: i18n.t('notificationsPage.seedNewEpisode'),
      isRead: false,
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      href: '/webtoon/1',
      data: { webtoonId: '1', episodeNumber: 5 },
    },
    {
      id: 'n2',
      type: 'system',
      titleKey: 'notificationsPage.system',
      message: i18n.t('notificationsPage.seedSystem'),
      isRead: false,
      createdAt: new Date(now - 26 * 60 * 60 * 1000).toISOString(),
      href: '/coins',
    },
    {
      id: 'n3',
      type: 'promotion',
      titleKey: 'notificationsPage.promotion',
      message: i18n.t('notificationsPage.seedPromo'),
      isRead: true,
      createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
      href: '/coins',
    },
  ]
}

export function ensureNotifications(userId: string): AppNotification[] {
  if (!userId) return []
  const store = readStore()
  if (store.byUserId[userId]) {
    return [...store.byUserId[userId]].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }
  const seeded = seedNotifications()
  store.byUserId[userId] = seeded
  writeStore(store)
  return [...seeded]
}

export function listNotifications(userId: string): AppNotification[] {
  return ensureNotifications(userId)
}

export function unreadCount(userId: string): number {
  return ensureNotifications(userId).filter((n) => !n.isRead).length
}

export function markAsRead(userId: string, id: string): AppNotification[] {
  if (!userId || !id) return listNotifications(userId)
  const store = readStore()
  const list = ensureNotifications(userId).map((n) => (n.id === id ? { ...n, isRead: true } : n))
  store.byUserId[userId] = list
  writeStore(store)
  return listNotifications(userId)
}

export function markAllRead(userId: string): AppNotification[] {
  if (!userId) return []
  const store = readStore()
  store.byUserId[userId] = ensureNotifications(userId).map((n) => ({ ...n, isRead: true }))
  writeStore(store)
  return listNotifications(userId)
}

export function deleteNotification(userId: string, id: string): AppNotification[] {
  if (!userId || !id) return listNotifications(userId)
  const store = readStore()
  store.byUserId[userId] = ensureNotifications(userId).filter((n) => n.id !== id)
  writeStore(store)
  return listNotifications(userId)
}

export function clearRead(userId: string): AppNotification[] {
  if (!userId) return []
  const store = readStore()
  store.byUserId[userId] = ensureNotifications(userId).filter((n) => !n.isRead)
  writeStore(store)
  return listNotifications(userId)
}
