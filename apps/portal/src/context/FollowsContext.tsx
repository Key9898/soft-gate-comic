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
  STORAGE_KEY as FOLLOWS_STORAGE_KEY,
  listFollows,
  toggleFollow as toggleFollowRecord,
  type FollowRecord,
} from '../lib/follows'
import { useStorageSync } from '../hooks/useStorageSync'

const FOLLOWS_SYNC_KEYS = [FOLLOWS_STORAGE_KEY]

interface FollowsContextType {
  follows: FollowRecord[]
  isReady: boolean
  isFollowing: (authorId: string) => boolean
  toggleFollow: (authorId: string) => void
}

const FollowsContext = createContext<FollowsContextType | undefined>(undefined)

export const FollowsProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [follows, setFollows] = useState<FollowRecord[]>([])
  const [isReady, setIsReady] = useState(false)

  const userId = user?.id ?? null

  const refresh = useCallback(() => {
    if (!isAuthenticated || !userId) {
      setFollows([])
      setIsReady(true)
      return
    }
    setFollows(listFollows(userId))
    setIsReady(true)
  }, [isAuthenticated, userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  useStorageSync(FOLLOWS_SYNC_KEYS, refresh)

  const isFollowing = useCallback(
    (authorId: string) => {
      if (!isAuthenticated || !userId) return false
      return follows.some((row) => row.authorId === authorId)
    },
    [follows, isAuthenticated, userId]
  )

  const toggleFollow = useCallback(
    (authorId: string) => {
      if (!isAuthenticated || !userId) {
        navigate('/login', { state: { from: location } })
        return
      }
      setFollows(toggleFollowRecord(userId, authorId))
    },
    [isAuthenticated, userId, navigate, location]
  )

  const value = useMemo(
    () => ({
      follows,
      isReady,
      isFollowing,
      toggleFollow,
    }),
    [follows, isReady, isFollowing, toggleFollow]
  )

  return <FollowsContext.Provider value={value}>{children}</FollowsContext.Provider>
}

export const useFollows = () => {
  const context = useContext(FollowsContext)
  if (context === undefined) {
    throw new Error('useFollows must be used within a FollowsProvider')
  }
  return context
}
