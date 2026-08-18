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
  type HistoryRecord,
} from '../lib/engagement'
import {
  STORAGE_KEY as NOTIFICATIONS_STORAGE_KEY,
  clearRead as clearReadStore,
  deleteNotification as deleteNotificationStore,
  listNotifications,
  markAllRead as markAllReadStore,
  markAsRead as markAsReadStore,
  unreadCount as unreadCountStore,
  type AppNotification,
} from '../lib/notifications'
import { useStorageSync } from '../hooks/useStorageSync'

const ENGAGE_SYNC_KEYS = [ENGAGE_STORAGE_KEY, NOTIFICATIONS_STORAGE_KEY]

interface EngagementContextType {
  history: HistoryRecord[]
  likedWebtoonIds: string[]
  notifications: AppNotification[]
  unreadNotificationCount: number
  isReady: boolean
  isLiked: (webtoonId: string) => boolean
  toggleLike: (webtoonId: string) => void
  removeLikes: (webtoonIds: string[]) => void
  recordHistory: (webtoonId: string, episodeNumber: number) => void
  updateReadingProgress: (webtoonId: string, episodeNumber: number, scrollRatio: number) => void
  removeHistory: (webtoonIds: string[]) => void
  readEpisodeNumbers: (webtoonId: string) => number[]
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  deleteNotification: (id: string) => void
  clearReadNotifications: () => void
}

const EngagementContext = createContext<EngagementContextType | undefined>(undefined)

export const EngagementProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [likedWebtoonIds, setLikedWebtoonIds] = useState<string[]>([])
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)
  const [isReady, setIsReady] = useState(false)

  const userId = user?.id ?? null

  const refresh = useCallback(() => {
    if (!isAuthenticated || !userId) {
      setHistory([])
      setLikedWebtoonIds([])
      setNotifications([])
      setUnreadNotificationCount(0)
      setIsReady(true)
      return
    }
    setHistory(listHistory(userId))
    setLikedWebtoonIds(listLikedWebtoonIds(userId))
    setNotifications(listNotifications(userId))
    setUnreadNotificationCount(unreadCountStore(userId))
    setIsReady(true)
  }, [isAuthenticated, userId])

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

  const value = useMemo(
    () => ({
      history,
      likedWebtoonIds,
      notifications,
      unreadNotificationCount,
      isReady,
      isLiked,
      toggleLike,
      removeLikes,
      recordHistory,
      updateReadingProgress,
      removeHistory,
      readEpisodeNumbers,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      clearReadNotifications,
    }),
    [
      history,
      likedWebtoonIds,
      notifications,
      unreadNotificationCount,
      isReady,
      isLiked,
      toggleLike,
      removeLikes,
      recordHistory,
      updateReadingProgress,
      removeHistory,
      readEpisodeNumbers,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      clearReadNotifications,
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
