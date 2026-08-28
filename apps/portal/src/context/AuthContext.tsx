import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import {
  SESSION_STORAGE_KEY,
  deleteAccountByEmail,
  getAccountByEmail,
  getAccountByUsername,
  MIN_PASSWORD_LENGTH,
  readSession,
  toPublicUser,
  upsertAccount,
  userIdFromEmail,
  writeSession,
  type AuthUser,
} from '../lib/auth'
import { migrateUserData, deleteUserData } from '../lib/account'
import { promoteSessionAgeConfirm } from '../lib/contentRating'
import { useStorageSync } from '../hooks/useStorageSync'
import { authFetch } from '../lib/api/authFetch'
import { isMockApi } from '../lib/api/isMockApi'

export type { AuthUser }

const AUTH_SYNC_KEYS = [SESSION_STORAGE_KEY]
const AUTH_PROFILE_NOT_LIVE = 'AUTH_PROFILE_NOT_LIVE'

interface RegisterData {
  username: string
  displayName: string
  email: string
  password: string
}

interface UpdateProfileData {
  displayName?: string
  email?: string
  bio?: string
  avatar?: string
  username?: string
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  deleteAccount: (password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const applySession = (publicUser: AuthUser) => {
  promoteSessionAgeConfirm(publicUser.id)
  return publicUser
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isMockApi()) {
      setUser(readSession())
      setIsLoading(false)
      return
    }

    let cancelled = false
    const boot = async () => {
      try {
        const me = await authFetch<AuthUser>('/api/auth/me')
        if (!cancelled) setUser(me)
      } catch {
        try {
          await authFetch<{ ok: true }>('/api/auth/refresh', { method: 'POST', body: '{}' })
          const me = await authFetch<AuthUser>('/api/auth/me')
          if (!cancelled) setUser(me)
        } catch {
          if (!cancelled) setUser(null)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    void boot()
    return () => {
      cancelled = true
    }
  }, [])

  const refreshSession = useCallback(() => {
    if (!isMockApi()) return
    setUser(readSession())
  }, [])

  useStorageSync(AUTH_SYNC_KEYS, refreshSession)

  const persistUser = useCallback((next: AuthUser | null) => {
    setUser(next)
    writeSession(next)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      if (!isMockApi()) {
        const publicUser = await authFetch<AuthUser>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        })
        setUser(applySession(publicUser))
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 300))
      const account = getAccountByEmail(email.trim().toLowerCase())
      if (!account || account.password !== password) {
        throw new Error('INVALID_CREDENTIALS')
      }
      const publicUser = toPublicUser(account)
      persistUser(applySession(publicUser))
    },
    [persistUser]
  )

  const register = useCallback(
    async (data: RegisterData) => {
      if (!isMockApi()) {
        const publicUser = await authFetch<AuthUser>('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            username: data.username.trim(),
            displayName: data.displayName.trim(),
            email: data.email.trim().toLowerCase(),
            password: data.password,
          }),
        })
        setUser(applySession(publicUser))
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 300))
      const email = data.email.trim().toLowerCase()
      const username = data.username.trim()
      if (getAccountByEmail(email)) {
        throw new Error('EMAIL_TAKEN')
      }
      if (getAccountByUsername(username)) {
        throw new Error('USERNAME_TAKEN')
      }
      if (data.password.length < MIN_PASSWORD_LENGTH) {
        throw new Error('PASSWORD_TOO_SHORT')
      }
      const account = {
        id: userIdFromEmail(email),
        email,
        username,
        displayName: data.displayName.trim(),
        password: data.password,
        bio: '',
        createdAt: new Date().toISOString(),
      }
      upsertAccount(account)
      persistUser(applySession(toPublicUser(account)))
    },
    [persistUser]
  )

  const logout = useCallback(async () => {
    if (isMockApi()) {
      persistUser(null)
      return
    }
    try {
      await authFetch<{ ok: true }>('/api/auth/logout', { method: 'POST', body: '{}' })
    } finally {
      setUser(null)
    }
  }, [persistUser])

  const updateProfile = useCallback(
    async (data: UpdateProfileData) => {
      if (!isMockApi()) throw new Error(AUTH_PROFILE_NOT_LIVE)
      if (!user) throw new Error('NOT_AUTHENTICATED')
      const account = getAccountByEmail(user.email)
      if (!account) throw new Error('ACCOUNT_MISSING')
      const nextEmail = data.email?.trim().toLowerCase()
      if (nextEmail && nextEmail !== account.email && getAccountByEmail(nextEmail)) {
        throw new Error('EMAIL_TAKEN')
      }
      const updated = {
        ...account,
        displayName: data.displayName?.trim() ?? account.displayName,
        username: data.username?.trim() ?? account.username,
        bio: data.bio ?? account.bio,
        avatar: data.avatar ?? account.avatar,
        email: nextEmail || account.email,
        id: nextEmail && nextEmail !== account.email ? userIdFromEmail(nextEmail) : account.id,
      }
      if (nextEmail && nextEmail !== account.email) {
        migrateUserData(account.id, updated.id)
        deleteAccountByEmail(account.email)
      }
      upsertAccount(updated)
      persistUser(toPublicUser(updated))
    },
    [user, persistUser]
  )

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!isMockApi()) throw new Error(AUTH_PROFILE_NOT_LIVE)
      if (!user) throw new Error('NOT_AUTHENTICATED')
      const account = getAccountByEmail(user.email)
      if (!account || account.password !== currentPassword) {
        throw new Error('INVALID_CREDENTIALS')
      }
      if (newPassword.length < MIN_PASSWORD_LENGTH) {
        throw new Error('PASSWORD_TOO_SHORT')
      }
      upsertAccount({ ...account, password: newPassword })
    },
    [user]
  )

  const deleteAccount = useCallback(
    async (password: string) => {
      if (!isMockApi()) throw new Error(AUTH_PROFILE_NOT_LIVE)
      if (!user) throw new Error('NOT_AUTHENTICATED')
      const account = getAccountByEmail(user.email)
      if (!account || account.password !== password) {
        throw new Error('INVALID_CREDENTIALS')
      }
      deleteUserData(account.id)
      deleteAccountByEmail(user.email)
      persistUser(null)
    },
    [user, persistUser]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        deleteAccount,
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

export const useOptionalAuth = () => useContext(AuthContext)
