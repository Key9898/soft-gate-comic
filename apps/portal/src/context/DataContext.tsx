import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'
import { unwrapApiData } from '@softgate/contracts'
import {
  SharedData,
  Webtoon,
  Episode,
  User,
  Comment,
  Author,
  Genre,
  CoinPackage,
  loadFromLocalStorage,
  saveToLocalStorage,
  type PublishedCatalog,
} from '@softgate/shared'
import { useOptionalAuth } from './AuthContext'
import {
  mockAuthors,
  mockGenres,
  mockWebtoons,
  mockEpisodes,
  mockUsers,
  mockComments,
} from '../demo/mocks/data'

interface DataContextType {
  webtoons: Webtoon[]
  setWebtoons: Dispatch<SetStateAction<Webtoon[]>>
  episodes: Episode[]
  setEpisodes: Dispatch<SetStateAction<Episode[]>>
  users: User[]
  setUsers: Dispatch<SetStateAction<User[]>>
  comments: Comment[]
  setComments: Dispatch<SetStateAction<Comment[]>>
  authors: Author[]
  setAuthors: Dispatch<SetStateAction<Author[]>>
  genres: Genre[]
  setGenres: Dispatch<SetStateAction<Genre[]>>
  coinPackages?: CoinPackage[]
  isLoading: boolean
  error: Error | null
  retry: () => void
}

const isMockApi = () => import.meta.env.VITE_USE_MOCK_API !== 'false'

const emptyCatalogShell = (): SharedData => ({
  dashboardStats: {
    totalUsers: 0,
    totalWebtoons: 0,
    totalEpisodes: 0,
    totalViews: 0,
    totalRevenue: 0,
    newUsersToday: 0,
    activeUsersToday: 0,
    newEpisodesToday: 0,
  },
  revenueData: [],
  userGrowthData: [],
  popularWebtoons: [],
  authors: [],
  genres: [],
  webtoons: [],
  episodes: [],
  users: [],
  comments: [],
  mediaFiles: [],
  activityLogs: [],
  reports: [],
  transactions: [],
  scheduledEpisodes: [],
})

const mockSeed = (): SharedData => {
  return {
    dashboardStats: {
      totalUsers: mockUsers.length,
      totalWebtoons: mockWebtoons.length,
      totalEpisodes: mockEpisodes.length,
      totalViews: mockWebtoons.reduce((acc, w) => acc + w.viewCount, 0),
      totalRevenue: 0,
      newUsersToday: 0,
      activeUsersToday: 0,
      newEpisodesToday: 0,
    },
    revenueData: [],
    userGrowthData: [],
    popularWebtoons: [],
    authors: mockAuthors,
    genres: mockGenres,
    webtoons: mockWebtoons,
    episodes: mockEpisodes,
    users: mockUsers,
    comments: mockComments,
    mediaFiles: [],
    activityLogs: [],
    reports: [],
    transactions: [],
    scheduledEpisodes: [],
  }
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const auth = useOptionalAuth()
  const [db, setDb] = useState<SharedData>(() => (isMockApi() ? mockSeed() : emptyCatalogShell()))
  const [storageReady, setStorageReady] = useState(() => !isMockApi())
  const [isLoading, setIsLoading] = useState(() => !isMockApi())
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!isMockApi()) return
    const loaded = loadFromLocalStorage()
    if (loaded) setDb(loaded)
    setStorageReady(true)
  }, [])

  const hasAuth = auth !== undefined
  const authLoading = auth?.isLoading ?? false
  const userId = auth?.user?.id ?? null

  const loadCatalog = useCallback(() => {
    if (isMockApi()) {
      setError(null)
      setIsLoading(false)
      return
    }

    if (hasAuth && authLoading) return

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    setError(null)
    setIsLoading(true)
    fetch(`${baseUrl}/api/catalog`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch data')
        return res.json()
      })
      .then((payload: unknown) => {
        const catalog = unwrapApiData<PublishedCatalog>(payload)
        if (
          !catalog ||
          !Array.isArray(catalog.webtoons) ||
          !Array.isArray(catalog.episodes) ||
          !Array.isArray(catalog.authors) ||
          !Array.isArray(catalog.genres)
        ) {
          throw new Error('Failed to fetch data')
        }
        setDb((prev) => ({
          ...prev,
          authors: catalog.authors,
          genres: catalog.genres,
          webtoons: catalog.webtoons,
          episodes: catalog.episodes,
          coinPackages: catalog.coinPackages,
        }))
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'))
        setIsLoading(false)
      })
  }, [hasAuth, authLoading])

  useEffect(() => {
    loadCatalog()
  }, [loadCatalog, userId])

  useEffect(() => {
    if (isMockApi() && storageReady) {
      saveToLocalStorage(db)
    }
  }, [db, storageReady])

  const setWebtoons = (val: SetStateAction<Webtoon[]>) => {
    setDb((prev) => ({
      ...prev,
      webtoons: typeof val === 'function' ? val(prev.webtoons) : val,
    }))
  }

  const setEpisodes = (val: SetStateAction<Episode[]>) => {
    setDb((prev) => ({
      ...prev,
      episodes: typeof val === 'function' ? val(prev.episodes) : val,
    }))
  }

  const setUsers = (val: SetStateAction<User[]>) => {
    setDb((prev) => ({
      ...prev,
      users: typeof val === 'function' ? val(prev.users) : val,
    }))
  }

  const setComments = (val: SetStateAction<Comment[]>) => {
    setDb((prev) => ({
      ...prev,
      comments: typeof val === 'function' ? val(prev.comments) : val,
    }))
  }

  const setAuthors = (val: SetStateAction<Author[]>) => {
    setDb((prev) => ({
      ...prev,
      authors: typeof val === 'function' ? val(prev.authors) : val,
    }))
  }

  const setGenres = (val: SetStateAction<Genre[]>) => {
    setDb((prev) => ({
      ...prev,
      genres: typeof val === 'function' ? val(prev.genres) : val,
    }))
  }

  const contextValue: DataContextType = {
    webtoons: db.webtoons,
    setWebtoons,
    episodes: db.episodes,
    setEpisodes,
    users: db.users,
    setUsers,
    comments: db.comments,
    setComments,
    authors: db.authors,
    setAuthors,
    genres: db.genres,
    setGenres,
    coinPackages: db.coinPackages,
    isLoading,
    error,
    retry: loadCatalog,
  }

  return React.createElement(DataContext.Provider, { value: contextValue }, children)
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
