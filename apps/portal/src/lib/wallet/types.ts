export type WalletTxnType = 'purchase' | 'spend' | 'refund' | 'bonus' | 'demo_topup'

export interface WalletTransaction {
  id: string
  type: WalletTxnType
  amount: number
  description: string
  balance: number
  createdAt: string
  packageId?: string
  episodeKey?: string
}

export interface UserWallet {
  balance: number
  seeded: boolean
  transactions: WalletTransaction[]
  unlockedEpisodeKeys: string[]
}

export const WALLET_SCHEMA_VERSION = 1
export const DEFAULT_SEED_BALANCE = 150

export interface WalletStore {
  schemaVersion: number
  byUserId: Record<string, UserWallet>
}

export function episodeUnlockKey(webtoonId: string, episodeNumber: number): string {
  return `${webtoonId}:${episodeNumber}`
}
