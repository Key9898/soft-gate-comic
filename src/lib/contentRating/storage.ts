import {
  AGE_CONFIRM_SCHEMA_VERSION,
  AGE_CONFIRM_STORAGE_KEY,
  type AgeConfirmRecord,
  type AgeConfirmStore,
} from './types'

function emptyStore(): AgeConfirmStore {
  return { schemaVersion: AGE_CONFIRM_SCHEMA_VERSION, byUserId: {} }
}

export function readAgeConfirmStore(): AgeConfirmStore {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const raw = window.localStorage.getItem(AGE_CONFIRM_STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return emptyStore()
    const obj = parsed as Partial<AgeConfirmStore>
    if (
      obj.schemaVersion !== AGE_CONFIRM_SCHEMA_VERSION ||
      !obj.byUserId ||
      typeof obj.byUserId !== 'object'
    ) {
      return emptyStore()
    }
    const byUserId: Record<string, AgeConfirmRecord> = {}
    for (const [userId, record] of Object.entries(obj.byUserId)) {
      if (!record || typeof record !== 'object') continue
      const confirmedAt = (record as AgeConfirmRecord).confirmedAt
      if (typeof confirmedAt !== 'string') continue
      byUserId[userId] = { confirmedAt }
    }
    return { schemaVersion: AGE_CONFIRM_SCHEMA_VERSION, byUserId }
  } catch {
    return emptyStore()
  }
}

export function writeAgeConfirmStore(store: AgeConfirmStore): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(AGE_CONFIRM_STORAGE_KEY, JSON.stringify(store))
}
