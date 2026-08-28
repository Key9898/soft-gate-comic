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
import { authFetch, AuthApiError } from '../lib/api/authFetch'
import { isMockApi } from '../lib/api/isMockApi'
import {
  STORAGE_KEY as WALLET_STORAGE_KEY,
  demoTopUp as demoTopUpRecord,
  ensureWallet,
  episodeUnlockKey,
  isEpisodeUnlocked as isEpisodeUnlockedRecord,
  unlockEpisode as unlockEpisodeRecord,
  type UserWallet,
  type WalletTransaction,
} from '../lib/wallet'
import { useStorageSync } from '../hooks/useStorageSync'

const WALLET_SYNC_KEYS = [WALLET_STORAGE_KEY]
const NO_SYNC_KEYS: string[] = []

export type WalletUnlockResult =
  | { ok: true }
  | {
      ok: false
      reason:
        | 'NOT_AUTHENTICATED'
        | 'ALREADY_UNLOCKED'
        | 'INSUFFICIENT_COINS'
        | 'NOT_LOCKED'
        | 'EPISODE_NOT_FOUND'
    }

type WalletMe = {
  balance: number
  transactions: WalletTransaction[]
  unlockedEpisodeKeys: string[]
}

interface WalletContextType {
  balance: number
  transactions: WalletTransaction[]
  unlockedEpisodeKeys: string[]
  isReady: boolean
  isEpisodeUnlocked: (webtoonId: string, episodeNumber: number) => boolean
  demoTopUp: (coins: number, description: string, packageId?: string) => Promise<void>
  unlockEpisode: (
    webtoonId: string,
    episodeNumber: number,
    coinPrice: number,
    description: string
  ) => Promise<WalletUnlockResult>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

function applyWallet(wallet: UserWallet | WalletMe) {
  return {
    balance: wallet.balance,
    transactions: [...wallet.transactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    unlockedEpisodeKeys: [...wallet.unlockedEpisodeKeys],
  }
}

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [unlockedEpisodeKeys, setUnlockedEpisodeKeys] = useState<string[]>([])
  const [isReady, setIsReady] = useState(false)

  const userId = user?.id ?? null
  const mock = isMockApi()

  const applyState = useCallback((wallet: UserWallet | WalletMe) => {
    const next = applyWallet(wallet)
    setBalance(next.balance)
    setTransactions(next.transactions)
    setUnlockedEpisodeKeys(next.unlockedEpisodeKeys)
  }, [])

  const refreshMock = useCallback(() => {
    if (!isAuthenticated || !userId) {
      setBalance(0)
      setTransactions([])
      setUnlockedEpisodeKeys([])
      setIsReady(true)
      return
    }
    applyState(ensureWallet(userId))
    setIsReady(true)
  }, [applyState, isAuthenticated, userId])

  useEffect(() => {
    if (mock) {
      refreshMock()
    }
  }, [mock, refreshMock])

  useEffect(() => {
    if (mock) return
    if (authLoading) return
    if (!isAuthenticated || !userId) {
      setBalance(0)
      setTransactions([])
      setUnlockedEpisodeKeys([])
      setIsReady(true)
      return
    }

    let cancelled = false
    setIsReady(false)
    void authFetch<WalletMe>('/api/wallet/me')
      .then((wallet) => {
        if (!cancelled) applyState(wallet)
      })
      .catch(() => {
        if (!cancelled) {
          setBalance(0)
          setTransactions([])
          setUnlockedEpisodeKeys([])
        }
      })
      .finally(() => {
        if (!cancelled) setIsReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [mock, authLoading, isAuthenticated, userId, applyState])

  useStorageSync(mock ? WALLET_SYNC_KEYS : NO_SYNC_KEYS, refreshMock)

  const isEpisodeUnlocked = useCallback(
    (webtoonId: string, episodeNumber: number) => {
      if (!isAuthenticated || !userId) return false
      const key = episodeUnlockKey(webtoonId, episodeNumber)
      if (unlockedEpisodeKeys.includes(key)) return true
      if (!mock) return false
      return isEpisodeUnlockedRecord(userId, webtoonId, episodeNumber)
    },
    [isAuthenticated, userId, unlockedEpisodeKeys, mock]
  )

  const demoTopUp = useCallback(
    async (coins: number, description: string, packageId?: string) => {
      if (!isAuthenticated || !userId) {
        navigate('/login', { state: { from: location } })
        return
      }
      if (mock) {
        applyState(demoTopUpRecord(userId, coins, description, packageId))
        return
      }
      applyState(
        await authFetch<WalletMe>('/api/wallet/demo-topup', {
          method: 'POST',
          body: JSON.stringify({ coins, description, packageId }),
        })
      )
    },
    [isAuthenticated, userId, navigate, location, mock, applyState]
  )

  const unlockEpisode = useCallback(
    async (
      webtoonId: string,
      episodeNumber: number,
      coinPrice: number,
      description: string
    ): Promise<WalletUnlockResult> => {
      if (!isAuthenticated || !userId) {
        navigate('/login', { state: { from: location } })
        return { ok: false, reason: 'NOT_AUTHENTICATED' }
      }
      if (mock) {
        const result = unlockEpisodeRecord(userId, webtoonId, episodeNumber, coinPrice, description)
        if (result.ok) applyState(result.wallet)
        return result.ok ? { ok: true } : result
      }
      try {
        applyState(
          await authFetch<WalletMe>('/api/wallet/unlock', {
            method: 'POST',
            body: JSON.stringify({ webtoonId, episodeNumber }),
          })
        )
        return { ok: true }
      } catch (err) {
        if (err instanceof AuthApiError) {
          if (
            err.code === 'INSUFFICIENT_COINS' ||
            err.code === 'ALREADY_UNLOCKED' ||
            err.code === 'NOT_LOCKED' ||
            err.code === 'EPISODE_NOT_FOUND'
          ) {
            return { ok: false, reason: err.code }
          }
        }
        throw err
      }
    },
    [isAuthenticated, userId, navigate, location, mock, applyState]
  )

  const value = useMemo(
    () => ({
      balance,
      transactions,
      unlockedEpisodeKeys,
      isReady,
      isEpisodeUnlocked,
      demoTopUp,
      unlockEpisode,
    }),
    [
      balance,
      transactions,
      unlockedEpisodeKeys,
      isReady,
      isEpisodeUnlocked,
      demoTopUp,
      unlockEpisode,
    ]
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
