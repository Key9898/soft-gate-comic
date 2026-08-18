export type NotificationType = 'new_episode' | 'comment_reply' | 'system' | 'promotion'

export interface AppNotification {
  id: string
  type: NotificationType
  titleKey: string
  message: string
  isRead: boolean
  createdAt: string
  href?: string
  data?: {
    webtoonId?: string
    episodeNumber?: number
  }
}

export const NOTIFICATIONS_SCHEMA_VERSION = 1

export interface NotificationsStore {
  schemaVersion: number
  byUserId: Record<string, AppNotification[]>
}
