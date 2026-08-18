import {
  NOTIFICATIONS_SCHEMA_VERSION,
  type AppNotification,
  type NotificationsStore,
} from './types'

export const STORAGE_KEY = 'softgate_notifications_v1'

function emptyStore(): NotificationsStore {
  return { schemaVersion: NOTIFICATIONS_SCHEMA_VERSION, byUserId: {} }
}

function isNotification(item: unknown): item is AppNotification {
  if (!item || typeof item !== 'object') return false
  const n = item as Partial<AppNotification>
  return (
    typeof n.id === 'string' &&
    typeof n.type === 'string' &&
    typeof n.titleKey === 'string' &&
    typeof n.message === 'string' &&
    typeof n.isRead === 'boolean' &&
    typeof n.createdAt === 'string'
  )
}

export function readStore(): NotificationsStore {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return emptyStore()
    const obj = parsed as Partial<NotificationsStore>
    if (
      obj.schemaVersion !== NOTIFICATIONS_SCHEMA_VERSION ||
      !obj.byUserId ||
      typeof obj.byUserId !== 'object'
    ) {
      return emptyStore()
    }
    const byUserId: Record<string, AppNotification[]> = {}
    for (const [userId, list] of Object.entries(obj.byUserId)) {
      if (!Array.isArray(list)) continue
      byUserId[userId] = list.filter(isNotification)
    }
    return { schemaVersion: NOTIFICATIONS_SCHEMA_VERSION, byUserId }
  } catch {
    return emptyStore()
  }
}

export function writeStore(store: NotificationsStore): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}
