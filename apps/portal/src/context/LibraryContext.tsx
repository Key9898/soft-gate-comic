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
import { useData } from './DataContext'
import { useAuth } from './AuthContext'
import { authFetch } from '../lib/api/authFetch'
import { isMockApi } from '../lib/api/isMockApi'
import type { LibraryMe } from '../lib/api/libraryMe'
import {
  STORAGE_KEY as LIBRARY_STORAGE_KEY,
  listBookmarks,
  removeBookmark as removeBookmarkRecord,
  removeBookmarks as removeBookmarksRecords,
  setLastNotifiedEpisodeNumber,
  setNotifyMuted as setNotifyMutedRecord,
  toggleBookmark as toggleBookmarkRecord,
  type BookmarkRecord,
} from '../lib/library'
import { latestPublishedEpisode } from '../lib/catalog'
import { useStorageSync } from '../hooks/useStorageSync'

const LIBRARY_SYNC_KEYS = [LIBRARY_STORAGE_KEY]
const NO_SYNC_KEYS: string[] = []

interface LibraryContextType {
  bookmarks: BookmarkRecord[]
  bookmarkIds: string[]
  isReady: boolean
  isBookmarked: (webtoonId: string) => boolean
  toggleBookmark: (webtoonId: string) => void
  setNotifyMuted: (webtoonId: string, muted: boolean) => void
  removeBookmark: (webtoonId: string) => void
  removeBookmarks: (webtoonIds: string[]) => void
  stampLastNotified: (webtoonId: string, episodeNumber: number) => void
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined)

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { episodes } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([])
  const [isReady, setIsReady] = useState(false)

  const userId = user?.id ?? null
  const mock = isMockApi()

  const applyBookmarks = useCallback((next: BookmarkRecord[]) => {
    setBookmarks(next)
  }, [])

  const refreshMock = useCallback(() => {
    if (!isAuthenticated || !userId) {
      setBookmarks([])
      setIsReady(true)
      return
    }
    setBookmarks(listBookmarks(userId))
    setIsReady(true)
  }, [isAuthenticated, userId])

  useEffect(() => {
    if (mock) refreshMock()
  }, [mock, refreshMock])

  useEffect(() => {
    if (mock) return
    if (authLoading) return
    if (!isAuthenticated || !userId) {
      setBookmarks([])
      setIsReady(true)
      return
    }

    let cancelled = false
    setIsReady(false)
    void authFetch<LibraryMe>('/api/library/me')
      .then((data) => {
        if (!cancelled) applyBookmarks(data.bookmarks)
      })
      .catch(() => {
        if (!cancelled) setBookmarks([])
      })
      .finally(() => {
        if (!cancelled) setIsReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [mock, authLoading, isAuthenticated, userId, applyBookmarks])

  useStorageSync(mock ? LIBRARY_SYNC_KEYS : NO_SYNC_KEYS, refreshMock)

  const isBookmarked = useCallback(
    (webtoonId: string) => {
      if (!isAuthenticated || !userId) return false
      return bookmarks.some((b) => b.webtoonId === webtoonId)
    },
    [bookmarks, isAuthenticated, userId]
  )

  const toggleBookmark = useCallback(
    (webtoonId: string) => {
      if (!isAuthenticated || !userId) {
        navigate('/login', { state: { from: location } })
        return
      }
      const latest = latestPublishedEpisode(episodes, webtoonId)
      if (mock) {
        setBookmarks(
          toggleBookmarkRecord(userId, webtoonId, {
            lastNotifiedEpisodeNumber: latest?.episodeNumber,
          })
        )
        return
      }
      void authFetch<LibraryMe>('/api/library/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          webtoonId,
          ...(typeof latest?.episodeNumber === 'number'
            ? { lastNotifiedEpisodeNumber: latest.episodeNumber }
            : {}),
        }),
      })
        .then((data) => applyBookmarks(data.bookmarks))
        .catch(() => undefined)
    },
    [isAuthenticated, userId, navigate, location, episodes, mock, applyBookmarks]
  )

  const setNotifyMuted = useCallback(
    (webtoonId: string, muted: boolean) => {
      if (!isAuthenticated || !userId) {
        navigate('/login', { state: { from: location } })
        return
      }
      if (mock) {
        setBookmarks(setNotifyMutedRecord(userId, webtoonId, muted))
        return
      }
      void authFetch<LibraryMe>('/api/library/mute', {
        method: 'POST',
        body: JSON.stringify({ webtoonId, muted }),
      })
        .then((data) => applyBookmarks(data.bookmarks))
        .catch(() => undefined)
    },
    [isAuthenticated, userId, navigate, location, mock, applyBookmarks]
  )

  const removeBookmark = useCallback(
    (webtoonId: string) => {
      if (!userId) return
      if (mock) {
        setBookmarks(removeBookmarkRecord(userId, webtoonId))
        return
      }
      void authFetch<LibraryMe>('/api/library/remove-bookmarks', {
        method: 'POST',
        body: JSON.stringify({ webtoonIds: [webtoonId] }),
      })
        .then((data) => applyBookmarks(data.bookmarks))
        .catch(() => undefined)
    },
    [userId, mock, applyBookmarks]
  )

  const removeBookmarks = useCallback(
    (webtoonIds: string[]) => {
      if (!userId) return
      if (mock) {
        setBookmarks(removeBookmarksRecords(userId, webtoonIds))
        return
      }
      void authFetch<LibraryMe>('/api/library/remove-bookmarks', {
        method: 'POST',
        body: JSON.stringify({ webtoonIds }),
      })
        .then((data) => applyBookmarks(data.bookmarks))
        .catch(() => undefined)
    },
    [userId, mock, applyBookmarks]
  )

  const stampLastNotified = useCallback(
    (webtoonId: string, episodeNumber: number) => {
      if (!userId) return
      if (mock) {
        setBookmarks(setLastNotifiedEpisodeNumber(userId, webtoonId, episodeNumber))
        return
      }
      void authFetch<LibraryMe>('/api/library/stamp-notified', {
        method: 'POST',
        body: JSON.stringify({ webtoonId, episodeNumber }),
      })
        .then((data) => applyBookmarks(data.bookmarks))
        .catch(() => undefined)
    },
    [userId, mock, applyBookmarks]
  )

  const bookmarkIds = useMemo(() => bookmarks.map((b) => b.webtoonId), [bookmarks])

  const value = useMemo(
    () => ({
      bookmarks,
      bookmarkIds,
      isReady,
      isBookmarked,
      toggleBookmark,
      setNotifyMuted,
      removeBookmark,
      removeBookmarks,
      stampLastNotified,
    }),
    [
      bookmarks,
      bookmarkIds,
      isReady,
      isBookmarked,
      toggleBookmark,
      setNotifyMuted,
      removeBookmark,
      removeBookmarks,
      stampLastNotified,
    ]
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export const useLibrary = () => {
  const context = useContext(LibraryContext)
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider')
  }
  return context
}
