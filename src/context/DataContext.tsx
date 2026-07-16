import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'
import {
  SharedData,
  Webtoon,
  Episode,
  User,
  Comment,
  Author,
  Genre,
  loadFromLocalStorage,
  saveToLocalStorage,
} from '@softgate/shared'
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
  isLoading: boolean
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [db, setDb] = useState<SharedData>(() => {
    const loaded = loadFromLocalStorage()
    if (loaded) return loaded
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
  })

  const [isLoading, setIsLoading] = useState(true)

  // Load data from backend if VITE_USE_MOCK_API is 'false'
  useEffect(() => {
    const isMock = import.meta.env.VITE_USE_MOCK_API !== 'false'
    if (!isMock) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      setIsLoading(true)
      fetch(`${baseUrl}/api/data`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch data')
          return res.json()
        })
        .then((data) => {
          setDb(data)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error('Error fetching data from backend, falling back to local/mock:', err)
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  // Save shared database to localStorage or Backend on modifications
  useEffect(() => {
    const isMock = import.meta.env.VITE_USE_MOCK_API !== 'false'
    if (isMock) {
      saveToLocalStorage(db)
    } else {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      fetch(`${baseUrl}/api/data`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(db),
      }).catch((err) => {
        console.error('Error saving data to backend:', err)
      })
    }
  }, [db])

  // State setters helpers to trigger re-renders by mutating the db wrapper state
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
    isLoading,
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
