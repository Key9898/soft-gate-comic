import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import {
  STORAGE_KEY as ENGAGE_STORAGE_KEY,
  listHistory,
  listLikedWebtoonIds,
  recordHistory as recordHistoryStore,
  updateReadingProgress as updateReadingProgressStore,
  removeHistory as removeHistoryStore,
  removeLikes as removeLikesStore,
  toggleLike as toggleLikeStore,
  listRatings as listRatingsStore,
  setRating as setRatingStore,
  clearRating as clearRatingStore,
  type HistoryRecord,
} from '../lib/engagement'
import { isValidRating } from '../lib/rating'
import { listBookmarks } from '../lib/library'
import {
  STORAGE_KEY as NOTIFICATIONS_STORAGE_KEY,
  PREFS_STORAGE_KEY,
  DEFAULT_NOTIF_PREFS,
  clearRead as clearReadStore,
  deleteNotification as deleteNotificationStore,
  getNotifPrefs,
  setNotifPrefs as writeNotifPrefs,
  listNotifications,
  markAllRead as markAllReadStore,
  markAsRead as markAsReadStore,
  unreadCount as unreadCountStore,
  syncSubscribeNotifications,
  type AppNotification,
  type NotifPrefs,
} from '../lib/notifications'
import { useStorageSync } from '../hooks/useStorageSync'
import { useData } from './DataContext'

const ENGAGE_SYNC_KEYS = [ENGAGE_STORAGE_KEY, NOTIFICATIONS_STORAGE_KEY, PREFS_STORAGE_KEY]

interface EngagementContextType {
  history: HistoryRecord[]
  likedWebtoonIds: string[]
  ratings: Record<string, number>
  notifications: AppNotification[]
  unreadNotificationCount: number
  notifPrefs: NotifPrefs
  isReady: boolean
  isLiked: (webtoonId: string) => boolean
  toggleLike: (webtoonId: string) => void
  removeLikes: (webtoonIds: string[]) => void
  getRating: (webtoonId: string) => number | null
  setRating: (webtoonId: string, value: number) => void
  clearRating: (webtoonId: string) => void
  recordHistory: (webtoonId: string, episodeNumber: number) => void
  updateReadingProgress: (webtoonId: string, episodeNumber: number, scrollRatio: number) => void
  removeHistory: (webtoonIds: string[]) => void
  readEpisodeNumbers: (webtoonId: string) => number[]
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  deleteNotification: (id: string) => void
  clearReadNotifications: () => void
  setNotifPrefs: (patch: Partial<NotifPrefs>) => void
}

const EngagementContext = createContext<EngagementContextType | undefined>(undefined)

export const EngagementProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth()
  const { webtoons, episodes } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [likedWebtoonIds, setLikedWebtoonIds] = useState<string[]>([])
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)
  const [notifPrefs, setNotifPrefsState] = useState<NotifPrefs>({ ...DEFAULT_NOTIF_PREFS })
  const [isReady, setIsReady] = useState(false)

  const userId = user?.id ?? null

  const refresh = useCallback(() => {
    if (!isAuthenticated || !userId) {
      setHistory([])
      setLikedWebtoonIds([])
      setRatings({})
      setNotifications([])
      setUnreadNotificationCount(0)
      setNotifPrefsState({ ...DEFAULT_NOTIF_PREFS })
      setIsReady(true)
      return
    }
    setHistory(listHistory(userId))
    setLikedWebtoonIds(listLikedWebtoonIds(userId))
    setRatings(listRatingsStore(userId))
    setNotifPrefsState(getNotifPrefs(userId))
    syncSubscribeNotifications(userId, listBookmarks(userId), webtoons, episodes)
    setNotifications(listNotifications(userId))
    setUnreadNotificationCount(unreadCountStore(userId))
    setIsReady(true)
  }, [isAuthenticated, userId, webtoons, episodes])

  useEffect(() => {
    refresh()
  }, [refresh])

  useStorageSync(ENGAGE_SYNC_KEYS, refresh)

  const isLiked = useCallback(
    (webtoonId: string) => {
      if (!isAuthenticated || !userId) return false
      return likedWebtoonIds.includes(webtoonId)
    },
    [isAuthenticated, userId, likedWebtoonIds]
  )

  const toggleLike = useCallback(
    (webtoonId: string) => {
      if (!isAuthenticated || !userId) {
        navigate('/login', { state: { from: location } })
        return
      }
      setLikedWebtoonIds(toggleLikeStore(userId, webtoonId))
    },
    [isAuthenticated, userId, navigate, location]
  )

  const removeLikes = useCallback(
    (webtoonIds: string[]) => {
      if (!userId) return
      setLikedWebtoonIds(removeLikesStore(userId, webtoonIds))
    },
    [userId]
  )

  const recordHistory = useCallback(
    (webtoonId: string, episodeNumber: number) => {
      if (!isAuthenticated || !userId) return
      setHistory(recordHistoryStore(userId, webtoonId, episodeNumber))
    },
    [isAuthenticated, userId]
  )

  const updateReadingProgress = useCallback(
    (webtoonId: string, episodeNumber: number, scrollRatio: number) => {
      if (!isAuthenticated || !userId) return
      setHistory(updateReadingProgressStore(userId, webtoonId, episodeNumber, scrollRatio))
    },
    [isAuthenticated, userId]
  )

  const removeHistory = useCallback(
    (webtoonIds: string[]) => {
      if (!userId) return
      setHistory(removeHistoryStore(userId, webtoonIds))
    },
    [userId]
  )

  const readEpisodeNumbers = useCallback(
    (webtoonId: string) => {
      const record = history.find((h) => h.webtoonId === webtoonId)
      if (!record) return []
      return record.readEpisodeNumbers ?? [record.episodeNumber]
    },
    [history]
  )

  const getRating = useCallback(
    (webtoonId: string) => {
      const value = ratings[webtoonId]
      return isValidRating(value) ? value : null
    },
    [ratings]
  )

  const setRating = useCallback(
    (webtoonId: string, value: number) => {
      if (!isAuthenticated || !userId) {
        navigate('/login', { state: { from: location } })
        return
      }
      const existing = ratings[webtoonId]
      const hasExisting = isValidRating(existing)
      const record = history.find((h) => h.webtoonId === webtoonId)
      const hasRead =
        (record?.readEpisodeNumbers ?? (record ? [record.episodeNumber] : [])).length > 0
      if (!hasExisting && !hasRead) return
      setRatings(setRatingStore(userId, webtoonId, value))
    },
    [isAuthenticated, userId, ratings, history, navigate, location]
  )

  const clearRating = useCallback(
    (webtoonId: string) => {
      if (!isAuthenticated || !userId) {
        navigate('/login', { state: { from: location } })
        return
      }
      if (!isValidRating(ratings[webtoonId])) return
      setRatings(clearRatingStore(userId, webtoonId))
    },
    [isAuthenticated, userId, ratings, navigate, location]
  )

  const refreshNotifications = useCallback(() => {
    if (!userId) return
    setNotifications(listNotifications(userId))
    setUnreadNotificationCount(unreadCountStore(userId))
  }, [userId])

  const markNotificationRead = useCallback(
    (id: string) => {
      if (!userId) return
      markAsReadStore(userId, id)
      refreshNotifications()
    },
    [userId, refreshNotifications]
  )

  const markAllNotificationsRead = useCallback(() => {
    if (!userId) return
    markAllReadStore(userId)
    refreshNotifications()
  }, [userId, refreshNotifications])

  const deleteNotification = useCallback(
    (id: string) => {
      if (!userId) return
      deleteNotificationStore(userId, id)
      refreshNotifications()
    },
    [userId, refreshNotifications]
  )

  const clearReadNotifications = useCallback(() => {
    if (!userId) return
    clearReadStore(userId)
    refreshNotifications()
  }, [userId, refreshNotifications])

  const setNotifPrefs = useCallback(
    (patch: Partial<NotifPrefs>) => {
      if (!userId) return
      writeNotifPrefs(userId, patch)
      refresh()
    },
    [userId, refresh]
  )

  const value = useMemo(
    () => ({
      history,
      likedWebtoonIds,
      ratings,
      notifications,
      unreadNotificationCount,
      notifPrefs,
      isReady,
      isLiked,
      toggleLike,
      removeLikes,
      getRating,
      setRating,
      clearRating,
      recordHistory,
      updateReadingProgress,
      removeHistory,
      readEpisodeNumbers,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      clearReadNotifications,
      setNotifPrefs,
    }),
    [
      history,
      likedWebtoonIds,
      ratings,
      notifications,
      unreadNotificationCount,
      notifPrefs,
      isReady,
      isLiked,
      toggleLike,
      removeLikes,
      getRating,
      setRating,
      clearRating,
      recordHistory,
      updateReadingProgress,
      removeHistory,
      readEpisodeNumbers,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      clearReadNotifications,
      setNotifPrefs,
    ]
  )

  return <EngagementContext.Provider value={value}>{children}</EngagementContext.Provider>
}

export const useEngagement = () => {
  const context = useContext(EngagementContext)
  if (context === undefined) {
    throw new Error('useEngagement must be used within an EngagementProvider')
  }
  return context
}
