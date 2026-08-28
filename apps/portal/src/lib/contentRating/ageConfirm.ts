import { AGE_CONFIRM_SESSION_KEY } from './types'
import { readAgeConfirmStore, writeAgeConfirmStore } from './storage'

function sessionConfirmed(): boolean {
  if (typeof window === 'undefined') return false
  return window.sessionStorage.getItem(AGE_CONFIRM_SESSION_KEY) === '1'
}

function writeSessionConfirm(): void {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(AGE_CONFIRM_SESSION_KEY, '1')
}

export function hasAgeConfirm(userId: string | null): boolean {
  if (userId) {
    return Boolean(readAgeConfirmStore().byUserId[userId]?.confirmedAt)
  }
  return sessionConfirmed()
}

export function confirmAge(userId: string | null): void {
  if (userId) {
    const store = readAgeConfirmStore()
    store.byUserId[userId] = { confirmedAt: new Date().toISOString() }
    writeAgeConfirmStore(store)
    return
  }
  writeSessionConfirm()
}

export function promoteSessionAgeConfirm(userId: string): void {
  if (!userId || !sessionConfirmed()) return
  confirmAge(userId)
}
