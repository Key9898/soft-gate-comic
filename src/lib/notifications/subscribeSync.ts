import type { Episode, Webtoon } from '@softgate/shared'
import i18n from '../i18n'
import { latestPublishedEpisode } from '../catalog'
import { setLastNotifiedEpisodeNumber, type BookmarkRecord } from '../library'
import { readStore, writeStore } from './storage'
import type { AppNotification } from './types'
import { ensureNotifications } from './notifications'
import { getNotifPrefs } from './prefs'

function subscribeNotificationId(webtoonId: string, episodeNumber: number): string {
  return `sub-${webtoonId}-${episodeNumber}`
}

export function syncSubscribeNotifications(
  userId: string,
  bookmarks: BookmarkRecord[],
  webtoons: Webtoon[],
  episodes: Episode[]
): AppNotification[] {
  if (!userId) return []
  if (!getNotifPrefs(userId).newEpisode) return ensureNotifications(userId)
  const list = ensureNotifications(userId)
  const titles = new Map(webtoons.map((webtoon) => [webtoon.id, webtoon.title]))
  let next = [...list]
  let changed = false

  for (const bookmark of bookmarks) {
    if (bookmark.notifyMuted) continue
    const latest = latestPublishedEpisode(episodes, bookmark.webtoonId)
    if (!latest) continue
    const last = bookmark.lastNotifiedEpisodeNumber
    if (last == null) {
      setLastNotifiedEpisodeNumber(userId, bookmark.webtoonId, latest.episodeNumber)
      continue
    }
    if (latest.episodeNumber <= last) continue
    const id = subscribeNotificationId(bookmark.webtoonId, latest.episodeNumber)
    if (next.some((item) => item.id === id)) {
      setLastNotifiedEpisodeNumber(userId, bookmark.webtoonId, latest.episodeNumber)
      continue
    }
    const title =
      titles.get(bookmark.webtoonId)?.[i18n.language.startsWith('mm') ? 'mm' : 'en'] ??
      titles.get(bookmark.webtoonId)?.en ??
      bookmark.webtoonId
    const notification: AppNotification = {
      id,
      type: 'new_episode',
      titleKey: 'notificationsPage.newEpisode',
      message: i18n.t('notificationsPage.subscribeNewEpisode', {
        title,
        n: latest.episodeNumber,
      }),
      isRead: false,
      createdAt: new Date().toISOString(),
      href: `/webtoon/${bookmark.webtoonId}`,
      data: { webtoonId: bookmark.webtoonId, episodeNumber: latest.episodeNumber },
    }
    next = [notification, ...next]
    changed = true
    setLastNotifiedEpisodeNumber(userId, bookmark.webtoonId, latest.episodeNumber)
  }

  if (changed) {
    const store = readStore()
    store.byUserId[userId] = next
    writeStore(store)
  }

  return ensureNotifications(userId)
}
