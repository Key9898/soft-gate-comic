import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

interface RegisterData {
  username: string
  displayName: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('softgate_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, _password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const mockUser: User = {
      id: '1',
      email,
      username: email.split('@')[0],
      displayName: email.split('@')[0],
    }
    setUser(mockUser)
    localStorage.setItem('softgate_user', JSON.stringify(mockUser))
  }

  const register = async (data: RegisterData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const mockUser: User = {
      id: '1',
      email: data.email,
      username: data.username,
      displayName: data.displayName,
    }
    setUser(mockUser)
    localStorage.setItem('softgate_user', JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('softgate_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
