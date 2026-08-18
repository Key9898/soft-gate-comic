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
  STORAGE_KEY as WALLET_STORAGE_KEY,
  demoTopUp as demoTopUpRecord,
  ensureWallet,
  episodeUnlockKey,
  isEpisodeUnlocked as isEpisodeUnlockedRecord,
  unlockEpisode as unlockEpisodeRecord,
  type UnlockResult,
  type UserWallet,
  type WalletTransaction,
} from '../lib/wallet'
import { useStorageSync } from '../hooks/useStorageSync'

const WALLET_SYNC_KEYS = [WALLET_STORAGE_KEY]

interface WalletContextType {
  balance: number
  transactions: WalletTransaction[]
  unlockedEpisodeKeys: string[]
  isReady: boolean
  isEpisodeUnlocked: (webtoonId: string, episodeNumber: number) => boolean
  demoTopUp: (coins: number, description: string, packageId?: string) => void
  unlockEpisode: (
    webtoonId: string,
    episodeNumber: number,
    coinPrice: number,
    description: string
  ) => UnlockResult | { ok: false; reason: 'NOT_AUTHENTICATED' }
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

function applyWallet(wallet: UserWallet) {
  return {
    balance: wallet.balance,
    transactions: [...wallet.transactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    unlockedEpisodeKeys: [...wallet.unlockedEpisodeKeys],
  }
}

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [unlockedEpisodeKeys, setUnlockedEpisodeKeys] = useState<string[]>([])
  const [isReady, setIsReady] = useState(false)

  const userId = user?.id ?? null

  const refresh = useCallback(() => {
    if (!isAuthenticated || !userId) {
      setBalance(0)
      setTransactions([])
      setUnlockedEpisodeKeys([])
      setIsReady(true)
      return
    }
    const wallet = ensureWallet(userId)
    const next = applyWallet(wallet)
    setBalance(next.balance)
    setTransactions(next.transactions)
    setUnlockedEpisodeKeys(next.unlockedEpisodeKeys)
    setIsReady(true)
  }, [isAuthenticated, userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  useStorageSync(WALLET_SYNC_KEYS, refresh)

  const sync = useCallback((wallet: UserWallet) => {
    const next = applyWallet(wallet)
    setBalance(next.balance)
    setTransactions(next.transactions)
    setUnlockedEpisodeKeys(next.unlockedEpisodeKeys)
  }, [])

  const isEpisodeUnlocked = useCallback(
    (webtoonId: string, episodeNumber: number) => {
      if (!isAuthenticated || !userId) return false
      const key = episodeUnlockKey(webtoonId, episodeNumber)
      return (
        unlockedEpisodeKeys.includes(key) ||
        isEpisodeUnlockedRecord(userId, webtoonId, episodeNumber)
      )
    },
    [isAuthenticated, userId, unlockedEpisodeKeys]
  )

  const demoTopUp = useCallback(
    (coins: number, description: string, packageId?: string) => {
      if (!isAuthenticated || !userId) {
        navigate('/login', { state: { from: location } })
        return
      }
      sync(demoTopUpRecord(userId, coins, description, packageId))
    },
    [isAuthenticated, userId, navigate, location, sync]
  )

  const unlockEpisode = useCallback(
    (
      webtoonId: string,
      episodeNumber: number,
      coinPrice: number,
      description: string
    ): UnlockResult | { ok: false; reason: 'NOT_AUTHENTICATED' } => {
      if (!isAuthenticated || !userId) {
        navigate('/login', { state: { from: location } })
        return { ok: false, reason: 'NOT_AUTHENTICATED' }
      }
      const result = unlockEpisodeRecord(userId, webtoonId, episodeNumber, coinPrice, description)
      if (result.ok) sync(result.wallet)
      return result
    },
    [isAuthenticated, userId, navigate, location, sync]
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
