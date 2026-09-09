import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useLibrary } from './LibraryContext'
import { authFetch } from '../lib/api/authFetch'
import { isMockApi } from '../lib/api/isMockApi'
import type { LibraryMe } from '../lib/api/libraryMe'
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
  isNotificationTypeEnabled,
  listNotifications,
  markAllRead as markAllReadStore,
  markAsRead as markAsReadStore,
  unreadCount as unreadCountStore,
  syncSubscribeNotifications,
  type AppNotification,
  type NotifPrefs,
  type SubscribeInboxIo,
} from '../lib/notifications'
import { useStorageSync } from '../hooks/useStorageSync'
import { useData } from './DataContext'
import { DEFAULT_READER_PREFS, type ReaderPrefs } from '../lib/reader'

const MOCK_SYNC_KEYS = [ENGAGE_STORAGE_KEY, NOTIFICATIONS_STORAGE_KEY, PREFS_STORAGE_KEY]
const HTTP_SYNC_KEYS = [ENGAGE_STORAGE_KEY]

type NotificationsMe = { notifications: AppNotification[] }

type PrefsMe = {
  notifPrefs: NotifPrefs
  readerPrefs: {
    darkMode: boolean
    brightness: number
    fontSize: ReaderPrefs['fontSize']
    imageFit: ReaderPrefs['imageFit']
  }
}

function toReaderPrefs(reader: PrefsMe['readerPrefs']): ReaderPrefs {
  return {
    schemaVersion: 1,
    darkMode: reader.darkMode,
    brightness: reader.brightness,
    fontSize: reader.fontSize,
    imageFit: reader.imageFit,
  }
}

function visibleInbox(list: AppNotification[], prefs: NotifPrefs) {
  return list.filter((item) => isNotificationTypeEnabled(item.type, prefs))
}

function unreadFrom(list: AppNotification[], prefs: NotifPrefs) {
  return visibleInbox(list, prefs).filter((item) => !item.isRead).length
}

function memoryInbox(list: AppNotification[], newEpisode: boolean): SubscribeInboxIo {
  return {
    readList: () => list,
    persist: () => undefined,
    newEpisode,
  }
}

async function upsertAdded(
  previous: AppNotification[],
  next: AppNotification[]
): Promise<AppNotification[]> {
  const existing = new Set(previous.map((item) => item.id))
  const added = next.filter((item) => !existing.has(item.id))
  let snapshot = previous
  for (const notification of added) {
    snapshot = (
      await authFetch<NotificationsMe>('/api/notifications/upsert', {
        method: 'POST',
        body: JSON.stringify({ notification }),
      })
    ).notifications
  }
  return snapshot
}

interface EngagementContextType {
  history: HistoryRecord[]
  likedWebtoonIds: string[]
  ratings: Record<string, number>
  notifications: AppNotification[]
  unreadNotificationCount: number
  notifPrefs: NotifPrefs
  readerPrefs: ReaderPrefs
  prefsHydrated: boolean
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
  setReaderPrefs: (prefs: ReaderPrefs) => void
  reloadInbox: () => void
}

const EngagementContext = createContext<EngagementContextType | undefined>(undefined)

export const EngagementProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { bookmarks, isReady: libraryReady, stampLastNotified } = useLibrary()
  const { webtoons, episodes } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [likedWebtoonIds, setLikedWebtoonIds] = useState<string[]>([])
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [inboxAll, setInboxAll] = useState<AppNotification[]>([])
  const [inboxHydrated, setInboxHydrated] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)
  const [notifPrefs, setNotifPrefsState] = useState<NotifPrefs>({ ...DEFAULT_NOTIF_PREFS })
  const [readerPrefs, setReaderPrefsState] = useState<ReaderPrefs>({ ...DEFAULT_READER_PREFS })
  const [prefsHydrated, setPrefsHydrated] = useState(false)
  const [inboxFetched, setInboxFetched] = useState(false)
  const [pendingInbox, setPendingInbox] = useState<AppNotification[]>([])
  const [isReady, setIsReady] = useState(false)

  const userId = user?.id ?? null
  const mock = isMockApi()
  const notifPrefsRef = useRef(notifPrefs)
  notifPrefsRef.current = notifPrefs
  const inboxAllRef = useRef(inboxAll)
  inboxAllRef.current = inboxAll
  const notifPostSeq = useRef(0)
  const readerPostSeq = useRef(0)

  const applyInbox = useCallback((list: AppNotification[], prefs: NotifPrefs) => {
    setInboxAll(list)
    setNotifications(visibleInbox(list, prefs))
    setUnreadNotificationCount(unreadFrom(list, prefs))
  }, [])

  const refreshRatingsAndNotifs = useCallback(() => {
    if (!isAuthenticated || !userId) {
      setRatings({})
      setInboxAll([])
      setNotifications([])
      setUnreadNotificationCount(0)
      setNotifPrefsState({ ...DEFAULT_NOTIF_PREFS })
      setReaderPrefsState({ ...DEFAULT_READER_PREFS })
      return
    }
    setRatings(listRatingsStore(userId))
    if (mock) {
      const prefs = getNotifPrefs(userId)
      setNotifPrefsState(prefs)
      setNotifications(listNotifications(userId))
      setUnreadNotificationCount(unreadCountStore(userId))
      return
    }
    const prefs = notifPrefsRef.current
    setNotifications(visibleInbox(inboxAll, prefs))
    setUnreadNotificationCount(unreadFrom(inboxAll, prefs))
  }, [isAuthenticated, userId, mock, inboxAll])

  const refreshMock = useCallback(() => {
    if (!isAuthenticated || !userId) {
      setHistory([])
      setLikedWebtoonIds([])
      setRatings({})
      setInboxAll([])
      setNotifications([])
      setUnreadNotificationCount(0)
      setNotifPrefsState({ ...DEFAULT_NOTIF_PREFS })
      setReaderPrefsState({ ...DEFAULT_READER_PREFS })
      setPrefsHydrated(true)
      setIsReady(true)
      return
    }
    setHistory(listHistory(userId))
    setLikedWebtoonIds(listLikedWebtoonIds(userId))
    setRatings(listRatingsStore(userId))
    setNotifPrefsState(getNotifPrefs(userId))
    setReaderPrefsState({ ...DEFAULT_READER_PREFS })
    setPrefsHydrated(true)
    syncSubscribeNotifications(userId, listBookmarks(userId), webtoons, episodes)
    setNotifications(listNotifications(userId))
    setUnreadNotificationCount(unreadCountStore(userId))
    setIsReady(true)
  }, [isAuthenticated, userId, webtoons, episodes])

  useEffect(() => {
    if (mock) refreshMock()
  }, [mock, refreshMock])

  useEffect(() => {
    if (mock) return
    if (authLoading) return
    if (!isAuthenticated || !userId) {
      setHistory([])
      setLikedWebtoonIds([])
      setRatings({})
      setInboxAll([])
      setInboxHydrated(false)
      setInboxFetched(false)
      setPendingInbox([])
      setNotifications([])
      setUnreadNotificationCount(0)
      setNotifPrefsState({ ...DEFAULT_NOTIF_PREFS })
      setReaderPrefsState({ ...DEFAULT_READER_PREFS })
      setPrefsHydrated(true)
      setIsReady(true)
      return
    }

    let cancelled = false
    setIsReady(false)
    setRatings(listRatingsStore(userId))
    void authFetch<LibraryMe>('/api/library/me')
      .then((data) => {
        if (!cancelled) {
          setHistory(data.history)
          setLikedWebtoonIds(data.likedWebtoonIds)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHistory([])
          setLikedWebtoonIds([])
        }
      })
      .finally(() => {
        if (!cancelled) setIsReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [mock, authLoading, isAuthenticated, userId])

  useEffect(() => {
    if (mock) return
    if (authLoading) return
    if (!isAuthenticated || !userId) return

    let cancelled = false
    setPrefsHydrated(false)
    void authFetch<PrefsMe>('/api/prefs/me')
      .then((data) => {
        if (cancelled) return
        setNotifPrefsState(data.notifPrefs)
        setReaderPrefsState(toReaderPrefs(data.readerPrefs))
        setPrefsHydrated(true)
      })
      .catch(() => {
        if (cancelled) return
        setNotifPrefsState({ ...DEFAULT_NOTIF_PREFS })
        setReaderPrefsState({ ...DEFAULT_READER_PREFS })
        setPrefsHydrated(true)
      })

    return () => {
      cancelled = true
    }
  }, [mock, authLoading, isAuthenticated, userId])

  useEffect(() => {
    if (mock) return
    if (authLoading) return
    if (!isAuthenticated || !userId) return

    let cancelled = false
    setInboxHydrated(false)
    setInboxFetched(false)
    setPendingInbox([])
    void authFetch<NotificationsMe>('/api/notifications/me')
      .then((data) => {
        if (cancelled) return
        setPendingInbox(data.notifications)
        setInboxFetched(true)
      })
      .catch(() => {
        if (cancelled) return
        setPendingInbox([])
        setInboxFetched(true)
      })

    return () => {
      cancelled = true
    }
  }, [mock, authLoading, isAuthenticated, userId])

  useEffect(() => {
    if (mock) return
    if (!isAuthenticated || !userId || !prefsHydrated || !inboxFetched || inboxHydrated) return
    applyInbox(pendingInbox, notifPrefs)
    setInboxHydrated(true)
  }, [
    mock,
    isAuthenticated,
    userId,
    prefsHydrated,
    inboxFetched,
    inboxHydrated,
    pendingInbox,
    notifPrefs,
    applyInbox,
  ])

  useEffect(() => {
    if (mock) return
    if (!isAuthenticated || !userId || !libraryReady || !inboxHydrated || !prefsHydrated) return
    const previous = inboxAll
    const next = syncSubscribeNotifications(
      userId,
      bookmarks,
      webtoons,
      episodes,
      (_uid, webtoonId, episodeNumber) => stampLastNotified(webtoonId, episodeNumber),
      memoryInbox(previous, notifPrefs.newEpisode)
    )
    const added = next.filter((item) => !previous.some((row) => row.id === item.id))
    if (added.length === 0) return
    let cancelled = false
    void upsertAdded(previous, next)
      .then((snapshot) => {
        if (cancelled) return
        applyInbox(snapshot, notifPrefsRef.current)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [
    mock,
    isAuthenticated,
    userId,
    libraryReady,
    inboxHydrated,
    prefsHydrated,
    bookmarks,
    webtoons,
    episodes,
    stampLastNotified,
    inboxAll,
    notifPrefs.newEpisode,
    applyInbox,
  ])

  const refreshHttpLocal = useCallback(() => {
    if (mock) return
    refreshRatingsAndNotifs()
  }, [mock, refreshRatingsAndNotifs])

  useStorageSync(mock ? MOCK_SYNC_KEYS : HTTP_SYNC_KEYS, mock ? refreshMock : refreshHttpLocal)

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
      if (mock) {
        setLikedWebtoonIds(toggleLikeStore(userId, webtoonId))
        return
      }
      void authFetch<LibraryMe>('/api/library/like', {
        method: 'POST',
        body: JSON.stringify({ webtoonId }),
      })
        .then((data) => setLikedWebtoonIds(data.likedWebtoonIds))
        .catch(() => undefined)
    },
    [isAuthenticated, userId, navigate, location, mock]
  )

  const removeLikes = useCallback(
    (webtoonIds: string[]) => {
      if (!userId) return
      if (mock) {
        setLikedWebtoonIds(removeLikesStore(userId, webtoonIds))
        return
      }
      void authFetch<LibraryMe>('/api/library/remove-likes', {
        method: 'POST',
        body: JSON.stringify({ webtoonIds }),
      })
        .then((data) => setLikedWebtoonIds(data.likedWebtoonIds))
        .catch(() => undefined)
    },
    [userId, mock]
  )

  const recordHistory = useCallback(
    (webtoonId: string, episodeNumber: number) => {
      if (!isAuthenticated || !userId) return
      if (mock) {
        setHistory(recordHistoryStore(userId, webtoonId, episodeNumber))
        return
      }
      void authFetch<LibraryMe>('/api/library/history', {
        method: 'POST',
        body: JSON.stringify({ webtoonId, episodeNumber }),
      })
        .then((data) => setHistory(data.history))
        .catch(() => undefined)
    },
    [isAuthenticated, userId, mock]
  )

  const updateReadingProgress = useCallback(
    (webtoonId: string, episodeNumber: number, scrollRatio: number) => {
      if (!isAuthenticated || !userId) return
      if (mock) {
        setHistory(updateReadingProgressStore(userId, webtoonId, episodeNumber, scrollRatio))
        return
      }
      void authFetch<LibraryMe>('/api/library/history', {
        method: 'POST',
        body: JSON.stringify({ webtoonId, episodeNumber, scrollRatio }),
      })
        .then((data) => setHistory(data.history))
        .catch(() => undefined)
    },
    [isAuthenticated, userId, mock]
  )

  const removeHistory = useCallback(
    (webtoonIds: string[]) => {
      if (!userId) return
      if (mock) {
        setHistory(removeHistoryStore(userId, webtoonIds))
        return
      }
      void authFetch<LibraryMe>('/api/library/remove-history', {
        method: 'POST',
        body: JSON.stringify({ webtoonIds }),
      })
        .then((data) => setHistory(data.history))
        .catch(() => undefined)
    },
    [userId, mock]
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

  const reloadInbox = useCallback(() => {
    if (!userId) return
    if (mock) {
      refreshNotifications()
      return
    }
    void authFetch<NotificationsMe>('/api/notifications/me')
      .then((data) => applyInbox(data.notifications, notifPrefsRef.current))
      .catch(() => undefined)
  }, [userId, mock, refreshNotifications, applyInbox])

  const markNotificationRead = useCallback(
    (id: string) => {
      if (!userId) return
      if (mock) {
        markAsReadStore(userId, id)
        refreshNotifications()
        return
      }
      void authFetch<NotificationsMe>('/api/notifications/read', {
        method: 'POST',
        body: JSON.stringify({ id }),
      })
        .then((data) => applyInbox(data.notifications, notifPrefsRef.current))
        .catch(() => undefined)
    },
    [userId, mock, refreshNotifications, applyInbox]
  )

  const markAllNotificationsRead = useCallback(() => {
    if (!userId) return
    if (mock) {
      markAllReadStore(userId)
      refreshNotifications()
      return
    }
    void authFetch<NotificationsMe>('/api/notifications/read-all', {
      method: 'POST',
      body: JSON.stringify({}),
    })
      .then((data) => applyInbox(data.notifications, notifPrefsRef.current))
      .catch(() => undefined)
  }, [userId, mock, refreshNotifications, applyInbox])

  const deleteNotification = useCallback(
    (id: string) => {
      if (!userId) return
      if (mock) {
        deleteNotificationStore(userId, id)
        refreshNotifications()
        return
      }
      void authFetch<NotificationsMe>('/api/notifications/delete', {
        method: 'POST',
        body: JSON.stringify({ id }),
      })
        .then((data) => applyInbox(data.notifications, notifPrefsRef.current))
        .catch(() => undefined)
    },
    [userId, mock, refreshNotifications, applyInbox]
  )

  const clearReadNotifications = useCallback(() => {
    if (!userId) return
    if (mock) {
      clearReadStore(userId)
      refreshNotifications()
      return
    }
    void authFetch<NotificationsMe>('/api/notifications/clear-read', {
      method: 'POST',
      body: JSON.stringify({}),
    })
      .then((data) => applyInbox(data.notifications, notifPrefsRef.current))
      .catch(() => undefined)
  }, [userId, mock, refreshNotifications, applyInbox])

  const setNotifPrefs = useCallback(
    (patch: Partial<NotifPrefs>) => {
      if (!userId) return
      if (mock) {
        writeNotifPrefs(userId, patch)
        refreshMock()
        return
      }
      const seq = ++notifPostSeq.current
      void authFetch<PrefsMe>('/api/prefs/notif', {
        method: 'POST',
        body: JSON.stringify(patch),
      })
        .then((data) => {
          if (seq !== notifPostSeq.current) return
          setNotifPrefsState(data.notifPrefs)
          setReaderPrefsState(toReaderPrefs(data.readerPrefs))
          applyInbox(inboxAllRef.current, data.notifPrefs)
          if (!libraryReady || !inboxHydrated || !prefsHydrated) return
          const next = syncSubscribeNotifications(
            userId,
            bookmarks,
            webtoons,
            episodes,
            (_uid, webtoonId, episodeNumber) => stampLastNotified(webtoonId, episodeNumber),
            memoryInbox(inboxAllRef.current, data.notifPrefs.newEpisode)
          )
          const added = next.filter(
            (item) => !inboxAllRef.current.some((row) => row.id === item.id)
          )
          if (added.length === 0) return
          void upsertAdded(inboxAllRef.current, next)
            .then((snapshot) => applyInbox(snapshot, notifPrefsRef.current))
            .catch(() => undefined)
        })
        .catch(() => undefined)
    },
    [
      userId,
      mock,
      refreshMock,
      libraryReady,
      inboxHydrated,
      prefsHydrated,
      bookmarks,
      webtoons,
      episodes,
      stampLastNotified,
      applyInbox,
    ]
  )

  const setReaderPrefs = useCallback(
    (prefs: ReaderPrefs) => {
      if (!userId || mock) return
      const seq = ++readerPostSeq.current
      void authFetch<PrefsMe>('/api/prefs/reader', {
        method: 'POST',
        body: JSON.stringify({
          darkMode: prefs.darkMode,
          brightness: prefs.brightness,
          fontSize: prefs.fontSize,
          imageFit: prefs.imageFit,
        }),
      })
        .then((data) => {
          if (seq !== readerPostSeq.current) return
          setNotifPrefsState(data.notifPrefs)
          setReaderPrefsState(toReaderPrefs(data.readerPrefs))
          applyInbox(inboxAllRef.current, data.notifPrefs)
        })
        .catch(() => undefined)
    },
    [userId, mock, applyInbox]
  )

  const value = useMemo(
    () => ({
      history,
      likedWebtoonIds,
      ratings,
      notifications,
      unreadNotificationCount,
      notifPrefs,
      readerPrefs,
      prefsHydrated,
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
      setReaderPrefs,
      reloadInbox,
    }),
    [
      history,
      likedWebtoonIds,
      ratings,
      notifications,
      unreadNotificationCount,
      notifPrefs,
      readerPrefs,
      prefsHydrated,
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
      setReaderPrefs,
      reloadInbox,
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
