export interface AuthUser {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  bio?: string
  createdAt: string
}

export interface AuthAccount extends AuthUser {
  password: string
}

export interface AccountsStore {
  schemaVersion: number
  byEmail: Record<string, AuthAccount>
}

export const AUTH_SCHEMA_VERSION = 1
export const ACCOUNTS_STORAGE_KEY = 'softgate_accounts_v1'
export const SESSION_STORAGE_KEY = 'softgate_user'
