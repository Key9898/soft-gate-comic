import {
  ACCOUNTS_STORAGE_KEY,
  AUTH_SCHEMA_VERSION,
  SESSION_STORAGE_KEY,
  type AccountsStore,
  type AuthAccount,
  type AuthUser,
} from './types'

function emptyAccounts(): AccountsStore {
  return { schemaVersion: AUTH_SCHEMA_VERSION, byEmail: {} }
}

export function userIdFromEmail(email: string): string {
  const normalized = email.trim().toLowerCase()
  let hash = 0
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0
  }
  return `u_${hash.toString(16)}`
}

export function toPublicUser(account: AuthAccount): AuthUser {
  return {
    id: account.id,
    email: account.email,
    username: account.username,
    displayName: account.displayName,
    avatar: account.avatar,
    bio: account.bio,
    createdAt: account.createdAt,
  }
}

export function readAccounts(): AccountsStore {
  if (typeof window === 'undefined') return emptyAccounts()
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY)
    if (!raw) return emptyAccounts()
    const parsed = JSON.parse(raw) as Partial<AccountsStore>
    if (parsed.schemaVersion !== AUTH_SCHEMA_VERSION || !parsed.byEmail) return emptyAccounts()
    return { schemaVersion: AUTH_SCHEMA_VERSION, byEmail: parsed.byEmail }
  } catch {
    return emptyAccounts()
  }
}

export function writeAccounts(store: AccountsStore): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(store))
}

export function readSession(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<AuthUser>
    if (!parsed?.id || !parsed.email) return null
    return {
      id: parsed.id,
      email: parsed.email,
      username: parsed.username || parsed.email.split('@')[0],
      displayName: parsed.displayName || parsed.username || parsed.email.split('@')[0],
      avatar: parsed.avatar,
      bio: parsed.bio,
      createdAt: parsed.createdAt || new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function writeSession(user: AuthUser | null): void {
  if (typeof window === 'undefined') return
  if (!user) {
    window.localStorage.removeItem(SESSION_STORAGE_KEY)
    return
  }
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))
}

export function upsertAccount(account: AuthAccount): void {
  const store = readAccounts()
  store.byEmail[account.email.trim().toLowerCase()] = account
  writeAccounts(store)
}

export function getAccountByEmail(email: string): AuthAccount | null {
  return readAccounts().byEmail[email.trim().toLowerCase()] ?? null
}

export function deleteAccountByEmail(email: string): void {
  const store = readAccounts()
  delete store.byEmail[email.trim().toLowerCase()]
  writeAccounts(store)
}
