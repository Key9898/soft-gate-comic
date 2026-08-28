import {
  WALLET_SCHEMA_VERSION,
  type UserWallet,
  type WalletStore,
  type WalletTransaction,
} from './types'

export const STORAGE_KEY = 'softgate_wallet_v1'

function emptyStore(): WalletStore {
  return { schemaVersion: WALLET_SCHEMA_VERSION, byUserId: {} }
}

function isTxn(item: unknown): item is WalletTransaction {
  if (!item || typeof item !== 'object') return false
  const t = item as Partial<WalletTransaction>
  return (
    typeof t.id === 'string' &&
    typeof t.type === 'string' &&
    typeof t.amount === 'number' &&
    typeof t.description === 'string' &&
    typeof t.balance === 'number' &&
    typeof t.createdAt === 'string'
  )
}

function normalizeWallet(raw: unknown): UserWallet | null {
  if (!raw || typeof raw !== 'object') return null
  const w = raw as Partial<UserWallet>
  if (typeof w.balance !== 'number' || !Array.isArray(w.transactions)) return null
  const unlocked = Array.isArray(w.unlockedEpisodeKeys)
    ? w.unlockedEpisodeKeys.filter((k): k is string => typeof k === 'string')
    : []
  return {
    balance: w.balance,
    seeded: Boolean(w.seeded),
    transactions: w.transactions.filter(isTxn),
    unlockedEpisodeKeys: unlocked,
  }
}

export function readStore(): WalletStore {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return emptyStore()
    const obj = parsed as Partial<WalletStore>
    if (
      obj.schemaVersion !== WALLET_SCHEMA_VERSION ||
      !obj.byUserId ||
      typeof obj.byUserId !== 'object'
    ) {
      return emptyStore()
    }
    const byUserId: Record<string, UserWallet> = {}
    for (const [userId, wallet] of Object.entries(obj.byUserId)) {
      const normalized = normalizeWallet(wallet)
      if (normalized) byUserId[userId] = normalized
    }
    return { schemaVersion: WALLET_SCHEMA_VERSION, byUserId }
  } catch {
    return emptyStore()
  }
}

export function writeStore(store: WalletStore): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}
