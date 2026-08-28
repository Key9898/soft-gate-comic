import { randomUUID } from 'node:crypto'
import { getSharedData, isEpisodeLocked, publishedCatalogFrom } from '@softgate/shared/catalog'
import { STUB_PORTAL_SETTINGS } from '@softgate/shared/settings'
import type { ReaderPublicUser } from './auth/types.js'
import { episodeUnlockKey, redactLockedEpisodeImages } from './paywall.js'

export type StubReaderUser = {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  bio?: string
  passwordHash: string
  createdAt: string
  lastLoginAt?: string
}

export type AuthFlags = {
  allowRegistration?: boolean
  maintenanceMode?: boolean
}

export type StubWalletTxnType = 'purchase' | 'spend' | 'refund' | 'bonus' | 'demo_topup'

export type StubWalletTransaction = {
  id: string
  type: StubWalletTxnType
  amount: number
  description: string
  balance: number
  createdAt: string
  packageId?: string
  episodeKey?: string
}

export type StubWallet = {
  balance: number
  seeded: boolean
  transactions: StubWalletTransaction[]
  unlockedEpisodeKeys: string[]
}

export type StubWalletPublic = {
  balance: number
  transactions: StubWalletTransaction[]
  unlockedEpisodeKeys: string[]
}

export type StubUnlockResult =
  | { ok: true; wallet: StubWalletPublic }
  | {
      ok: false
      reason: 'ALREADY_UNLOCKED' | 'INSUFFICIENT_COINS' | 'NOT_LOCKED' | 'EPISODE_NOT_FOUND'
    }

export const STUB_SEED_BALANCE = 150

const usersById = new Map<string, StubReaderUser>()
const userIdByEmail = new Map<string, string>()
const userIdByUsername = new Map<string, string>()
const refreshUserByJti = new Map<string, string>()
const walletsByUserId = new Map<string, StubWallet>()
let authFlags: AuthFlags = {}

function cloneWallet(wallet: StubWallet): StubWallet {
  return {
    ...wallet,
    transactions: [...wallet.transactions],
    unlockedEpisodeKeys: [...wallet.unlockedEpisodeKeys],
  }
}

function toPublicWallet(wallet: StubWallet): StubWalletPublic {
  return {
    balance: wallet.balance,
    transactions: [...wallet.transactions],
    unlockedEpisodeKeys: [...wallet.unlockedEpisodeKeys],
  }
}

export const persist = {
  kind: 'stub' as const,
  async ping() {
    return { ok: true as const }
  },
  getUnstrippedPublishedCatalog() {
    return publishedCatalogFrom(getSharedData())
  },
  getPublishedCatalog(userId?: string) {
    const catalog = persist.getUnstrippedPublishedCatalog()
    const keys = userId ? (walletsByUserId.get(userId)?.unlockedEpisodeKeys ?? []) : []
    return redactLockedEpisodeImages(catalog, new Set(keys))
  },
  getPortalSettings() {
    return STUB_PORTAL_SETTINGS
  },
  clearAuth() {
    usersById.clear()
    userIdByEmail.clear()
    userIdByUsername.clear()
    refreshUserByJti.clear()
    walletsByUserId.clear()
    authFlags = {}
  },
  setAuthFlags(flags: AuthFlags) {
    authFlags = { ...authFlags, ...flags }
  },
  isRegistrationOpen() {
    const settings = persist.getPortalSettings()
    const allowRegistration = authFlags.allowRegistration ?? settings.allowRegistration
    const maintenanceMode = authFlags.maintenanceMode ?? settings.maintenanceMode
    return allowRegistration && !maintenanceMode
  },
  findUserById(id: string) {
    return usersById.get(id)
  },
  findUserByEmail(email: string) {
    const id = userIdByEmail.get(email.trim().toLowerCase())
    return id ? usersById.get(id) : undefined
  },
  findUserByUsername(username: string) {
    const id = userIdByUsername.get(username.trim().toLowerCase())
    return id ? usersById.get(id) : undefined
  },
  createUser(input: {
    email: string
    username: string
    displayName: string
    passwordHash: string
  }): StubReaderUser {
    const id = randomUUID()
    const email = input.email.trim().toLowerCase()
    const username = input.username.trim()
    const user: StubReaderUser = {
      id,
      email,
      username,
      displayName: input.displayName.trim(),
      bio: '',
      passwordHash: input.passwordHash,
      createdAt: new Date().toISOString(),
    }
    usersById.set(id, user)
    userIdByEmail.set(email, id)
    userIdByUsername.set(username.toLowerCase(), id)
    return user
  },
  touchLastLogin(id: string) {
    const user = usersById.get(id)
    if (!user) return
    usersById.set(id, { ...user, lastLoginAt: new Date().toISOString() })
  },
  saveRefreshJti(jti: string, userId: string) {
    refreshUserByJti.set(jti, userId)
  },
  consumeRefreshJti(jti: string) {
    const userId = refreshUserByJti.get(jti)
    if (!userId) return undefined
    refreshUserByJti.delete(jti)
    return userId
  },
  revokeRefreshJti(jti: string) {
    refreshUserByJti.delete(jti)
  },
  toPublicUser(user: StubReaderUser): ReaderPublicUser {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
    }
  },
  ensureWallet(userId: string): StubWallet {
    const existing = walletsByUserId.get(userId)
    if (existing?.seeded) return cloneWallet(existing)
    const seeded: StubWallet = {
      balance: STUB_SEED_BALANCE,
      seeded: true,
      transactions: [
        {
          id: `seed-${userId}`,
          type: 'bonus',
          amount: STUB_SEED_BALANCE,
          description: 'Welcome demo balance',
          balance: STUB_SEED_BALANCE,
          createdAt: new Date().toISOString(),
        },
      ],
      unlockedEpisodeKeys: existing?.unlockedEpisodeKeys ?? [],
    }
    walletsByUserId.set(userId, seeded)
    return cloneWallet(seeded)
  },
  getWallet(userId: string): StubWalletPublic {
    return toPublicWallet(persist.ensureWallet(userId))
  },
  setWalletBalance(userId: string, balance: number) {
    const wallet = persist.ensureWallet(userId)
    walletsByUserId.set(userId, { ...wallet, balance })
  },
  demoTopUp(
    userId: string,
    coins: number,
    description: string,
    packageId?: string
  ): StubWalletPublic {
    const wallet = persist.ensureWallet(userId)
    const balance = wallet.balance + coins
    const txn: StubWalletTransaction = {
      id: `topup-${randomUUID()}`,
      type: 'demo_topup',
      amount: coins,
      description,
      balance,
      createdAt: new Date().toISOString(),
      packageId,
    }
    const next: StubWallet = {
      ...wallet,
      balance,
      transactions: [txn, ...wallet.transactions],
    }
    walletsByUserId.set(userId, next)
    return toPublicWallet(next)
  },
  unlockEpisode(userId: string, webtoonId: string, episodeNumber: number): StubUnlockResult {
    const catalog = persist.getUnstrippedPublishedCatalog()
    const episode = catalog.episodes.find(
      (row) => row.webtoonId === webtoonId && row.episodeNumber === episodeNumber
    )
    if (!episode) return { ok: false, reason: 'EPISODE_NOT_FOUND' }

    const key = episodeUnlockKey(webtoonId, episodeNumber)
    const wallet = persist.ensureWallet(userId)
    if (wallet.unlockedEpisodeKeys.includes(key)) {
      return { ok: false, reason: 'ALREADY_UNLOCKED' }
    }
    if (!isEpisodeLocked(episode, false)) {
      return { ok: false, reason: 'NOT_LOCKED' }
    }
    if (wallet.balance < episode.coinPrice) {
      return { ok: false, reason: 'INSUFFICIENT_COINS' }
    }

    const balance = wallet.balance - episode.coinPrice
    const txn: StubWalletTransaction = {
      id: `unlock-${randomUUID()}`,
      type: 'spend',
      amount: -episode.coinPrice,
      description: `Unlock episode ${episodeNumber}`,
      balance,
      createdAt: new Date().toISOString(),
      episodeKey: key,
    }
    const next: StubWallet = {
      ...wallet,
      balance,
      transactions: [txn, ...wallet.transactions],
      unlockedEpisodeKeys: [key, ...wallet.unlockedEpisodeKeys],
    }
    walletsByUserId.set(userId, next)
    return { ok: true, wallet: toPublicWallet(next) }
  },
}

export type PersistPort = typeof persist
