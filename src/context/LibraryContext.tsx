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
import {
  STORAGE_KEY as LIBRARY_STORAGE_KEY,
  listBookmarks,
  removeBookmark as removeBookmarkRecord,
  removeBookmarks as removeBookmarksRecords,
  setNotifyMuted as setNotifyMutedRecord,
  toggleBookmark as toggleBookmarkRecord,
  type BookmarkRecord,
} from '../lib/library'
import { latestPublishedEpisode } from '../lib/catalog'
import { useStorageSync } from '../hooks/useStorageSync'

const LIBRARY_SYNC_KEYS = [LIBRARY_STORAGE_KEY]

interface LibraryContextType {
  bookmarks: BookmarkRecord[]
  bookmarkIds: string[]
  isReady: boolean
  isBookmarked: (webtoonId: string) => boolean
  toggleBookmark: (webtoonId: string) => void
  setNotifyMuted: (webtoonId: string, muted: boolean) => void
  removeBookmark: (webtoonId: string) => void
  removeBookmarks: (webtoonIds: string[]) => void
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined)

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth()
  const { episodes } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([])
  const [isReady, setIsReady] = useState(false)

  const userId = user?.id ?? null

  const refresh = useCallback(() => {
    if (!isAuthenticated || !userId) {
      setBookmarks([])
      setIsReady(true)
      return
    }
    setBookmarks(listBookmarks(userId))
    setIsReady(true)
  }, [isAuthenticated, userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  useStorageSync(LIBRARY_SYNC_KEYS, refresh)

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
      setBookmarks(
        toggleBookmarkRecord(userId, webtoonId, {
          lastNotifiedEpisodeNumber: latest?.episodeNumber,
        })
      )
    },
    [isAuthenticated, userId, navigate, location, episodes]
  )

  const setNotifyMuted = useCallback(
    (webtoonId: string, muted: boolean) => {
      if (!isAuthenticated || !userId) {
        navigate('/login', { state: { from: location } })
        return
      }
      setBookmarks(setNotifyMutedRecord(userId, webtoonId, muted))
    },
    [isAuthenticated, userId, navigate, location]
  )

  const removeBookmark = useCallback(
    (webtoonId: string) => {
      if (!userId) return
      setBookmarks(removeBookmarkRecord(userId, webtoonId))
    },
    [userId]
  )

  const removeBookmarks = useCallback(
    (webtoonIds: string[]) => {
      if (!userId) return
      setBookmarks(removeBookmarksRecords(userId, webtoonIds))
    },
    [userId]
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
