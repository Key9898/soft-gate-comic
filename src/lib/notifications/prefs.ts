export type NotifPrefs = {
  newEpisode: boolean
  commentReply: boolean
  promotion: boolean
}

export interface NotifPrefsStore {
  schemaVersion: number
  byUserId: Record<string, NotifPrefs>
}

export const PREFS_STORAGE_KEY = 'softgate_notif_prefs_v1'
export const PREFS_SCHEMA_VERSION = 1

export const DEFAULT_NOTIF_PREFS: NotifPrefs = {
  newEpisode: true,
  commentReply: true,
  promotion: true,
}

function emptyStore(): NotifPrefsStore {
  return { schemaVersion: PREFS_SCHEMA_VERSION, byUserId: {} }
}

function isPrefs(value: unknown): value is NotifPrefs {
  if (!value || typeof value !== 'object') return false
  const prefs = value as Partial<NotifPrefs>
  return (
    typeof prefs.newEpisode === 'boolean' &&
    typeof prefs.commentReply === 'boolean' &&
    typeof prefs.promotion === 'boolean'
  )
}

export function readPrefsStore(): NotifPrefsStore {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const raw = window.localStorage.getItem(PREFS_STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return emptyStore()
    const obj = parsed as Partial<NotifPrefsStore>
    if (
      obj.schemaVersion !== PREFS_SCHEMA_VERSION ||
      !obj.byUserId ||
      typeof obj.byUserId !== 'object'
    ) {
      return emptyStore()
    }
    const byUserId: Record<string, NotifPrefs> = {}
    for (const [userId, prefs] of Object.entries(obj.byUserId)) {
      if (isPrefs(prefs)) byUserId[userId] = prefs
    }
    return { schemaVersion: PREFS_SCHEMA_VERSION, byUserId }
  } catch {
    return emptyStore()
  }
}

export function writePrefsStore(store: NotifPrefsStore): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(store))
}

export function getNotifPrefs(userId: string): NotifPrefs {
  if (!userId) return { ...DEFAULT_NOTIF_PREFS }
  const stored = readPrefsStore().byUserId[userId]
  return stored ? { ...stored } : { ...DEFAULT_NOTIF_PREFS }
}

export function setNotifPrefs(userId: string, patch: Partial<NotifPrefs>): NotifPrefs {
  if (!userId) return { ...DEFAULT_NOTIF_PREFS }
  const store = readPrefsStore()
  const next = { ...getNotifPrefs(userId), ...patch }
  store.byUserId[userId] = next
  writePrefsStore(store)
  return { ...next }
}

export function isNotificationTypeEnabled(type: string, prefs: NotifPrefs): boolean {
  if (type === 'new_episode') return prefs.newEpisode
  if (type === 'comment_reply') return prefs.commentReply
  if (type === 'promotion') return prefs.promotion
  return true
}
