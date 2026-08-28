import { readStore, writeStore } from './storage'
import {
  DEFAULT_SEED_BALANCE,
  episodeUnlockKey,
  type UserWallet,
  type WalletTransaction,
} from './types'

function emptyWallet(): UserWallet {
  return {
    balance: 0,
    seeded: false,
    transactions: [],
    unlockedEpisodeKeys: [],
  }
}

export function ensureWallet(userId: string): UserWallet {
  if (!userId) return emptyWallet()
  const store = readStore()
  const existing = store.byUserId[userId]
  if (existing?.seeded) {
    return {
      ...existing,
      transactions: [...existing.transactions],
      unlockedEpisodeKeys: [...existing.unlockedEpisodeKeys],
    }
  }
  const seeded: UserWallet = {
    balance: DEFAULT_SEED_BALANCE,
    seeded: true,
    transactions: [
      {
        id: `seed-${userId}`,
        type: 'bonus',
        amount: DEFAULT_SEED_BALANCE,
        description: 'Welcome demo balance',
        balance: DEFAULT_SEED_BALANCE,
        createdAt: new Date().toISOString(),
      },
    ],
    unlockedEpisodeKeys: existing?.unlockedEpisodeKeys ?? [],
  }
  store.byUserId[userId] = seeded
  writeStore(store)
  return {
    ...seeded,
    transactions: [...seeded.transactions],
    unlockedEpisodeKeys: [...seeded.unlockedEpisodeKeys],
  }
}

export function getWallet(userId: string): UserWallet {
  return ensureWallet(userId)
}

export function listTransactions(userId: string): WalletTransaction[] {
  return [...ensureWallet(userId).transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function isEpisodeUnlocked(
  userId: string,
  webtoonId: string,
  episodeNumber: number
): boolean {
  if (!userId || !webtoonId) return false
  const key = episodeUnlockKey(webtoonId, episodeNumber)
  return ensureWallet(userId).unlockedEpisodeKeys.includes(key)
}

export function demoTopUp(
  userId: string,
  coins: number,
  description: string,
  packageId?: string
): UserWallet {
  if (!userId || coins <= 0) return ensureWallet(userId)
  const store = readStore()
  const wallet = ensureWallet(userId)
  const balance = wallet.balance + coins
  const txn: WalletTransaction = {
    id: `topup-${Date.now()}`,
    type: 'demo_topup',
    amount: coins,
    description,
    balance,
    createdAt: new Date().toISOString(),
    packageId,
  }
  const next: UserWallet = {
    ...wallet,
    balance,
    transactions: [txn, ...wallet.transactions],
  }
  store.byUserId[userId] = next
  writeStore(store)
  return {
    ...next,
    transactions: [...next.transactions],
    unlockedEpisodeKeys: [...next.unlockedEpisodeKeys],
  }
}

export type UnlockResult =
  | { ok: true; wallet: UserWallet }
  | { ok: false; reason: 'NOT_AUTHENTICATED' | 'ALREADY_UNLOCKED' | 'INSUFFICIENT_COINS' }

export function unlockEpisode(
  userId: string,
  webtoonId: string,
  episodeNumber: number,
  coinPrice: number,
  description: string
): UnlockResult {
  if (!userId) return { ok: false, reason: 'NOT_AUTHENTICATED' }
  const key = episodeUnlockKey(webtoonId, episodeNumber)
  const store = readStore()
  const wallet = ensureWallet(userId)
  if (wallet.unlockedEpisodeKeys.includes(key)) {
    return { ok: false, reason: 'ALREADY_UNLOCKED' }
  }
  const cost = Math.max(0, coinPrice)
  if (wallet.balance < cost) {
    return { ok: false, reason: 'INSUFFICIENT_COINS' }
  }
  const balance = wallet.balance - cost
  const txn: WalletTransaction = {
    id: `unlock-${Date.now()}`,
    type: 'spend',
    amount: -cost,
    description,
    balance,
    createdAt: new Date().toISOString(),
    episodeKey: key,
  }
  const next: UserWallet = {
    ...wallet,
    balance,
    transactions: [txn, ...wallet.transactions],
    unlockedEpisodeKeys: [key, ...wallet.unlockedEpisodeKeys],
  }
  store.byUserId[userId] = next
  writeStore(store)
  return {
    ok: true,
    wallet: {
      ...next,
      transactions: [...next.transactions],
      unlockedEpisodeKeys: [...next.unlockedEpisodeKeys],
    },
  }
}
