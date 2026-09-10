import { Prisma } from '@prisma/client'
import { asBilingual } from '../catalog/fromAdmin.js'
import {
  COOKIE_COPY_KEYS,
  DEFAULT_COOKIE_META,
  DEFAULT_COOKIE_ROWS,
  isCookieStorageKey,
  type CookieCopy,
  type CookieCopyKey,
  type CookieStorageKey,
} from './seed.js'

export type BilingualText = { en: string; mm: string }

export type PortalCookieRow = {
  id: string
  storageKey: CookieStorageKey
  label: BilingualText
  description: BilingualText
  sortOrder: number
}

export type PortalCookies = {
  effectiveDate: string
  copy: CookieCopy
  glance: BilingualText[]
  rows: PortalCookieRow[]
}

export type AdminCookieMetaRow = {
  id: string
  effectiveDate: string
  copy: unknown
  glance: unknown
}

export type AdminCookieRow = {
  id: string
  storageKey: string
  label: unknown
  description: unknown
  sortOrder: number
}

function cloneBi(row: BilingualText): BilingualText {
  return { en: row.en, mm: row.mm }
}

function cloneCopy(row: CookieCopy): CookieCopy {
  const next = {} as CookieCopy
  for (const key of COOKIE_COPY_KEYS) {
    next[key] = cloneBi(row[key])
  }
  return next
}

function asCopy(value: unknown): CookieCopy {
  const next = cloneCopy(DEFAULT_COOKIE_META.copy)
  if (!value || typeof value !== 'object' || Array.isArray(value)) return next
  const row = value as Partial<Record<CookieCopyKey, unknown>>
  for (const key of COOKIE_COPY_KEYS) {
    if (key in row) next[key] = asBilingual(row[key])
  }
  return next
}

function asGlance(value: unknown): BilingualText[] {
  if (!Array.isArray(value) || value.length !== 5) return DEFAULT_COOKIE_META.glance.map(cloneBi)
  return value.map((item) => asBilingual(item))
}

function asEffectiveDate(value: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : DEFAULT_COOKIE_META.effectiveDate
}

function portalRowFromAdmin(row: AdminCookieRow): PortalCookieRow | null {
  if (!isCookieStorageKey(row.storageKey)) return null
  return {
    id: row.id,
    storageKey: row.storageKey,
    label: asBilingual(row.label),
    description: asBilingual(row.description),
    sortOrder: row.sortOrder,
  }
}

export function portalRowsFromAdminRows(rows: AdminCookieRow[]): PortalCookieRow[] {
  return rows
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))
    .map(portalRowFromAdmin)
    .filter((row): row is PortalCookieRow => row !== null)
}

export const STUB_COOKIES: PortalCookies = {
  effectiveDate: DEFAULT_COOKIE_META.effectiveDate,
  copy: cloneCopy(DEFAULT_COOKIE_META.copy),
  glance: DEFAULT_COOKIE_META.glance.map(cloneBi),
  rows: DEFAULT_COOKIE_ROWS.map((row) => ({
    id: row.id,
    storageKey: row.storageKey,
    label: cloneBi(row.label),
    description: cloneBi(row.description),
    sortOrder: row.sortOrder,
  })),
}

export function portalCookiesFromAdmin(input: {
  meta: AdminCookieMetaRow | null
  rows: AdminCookieRow[]
}): PortalCookies {
  if (!input.meta && input.rows.length === 0) return STUB_COOKIES
  const rows = portalRowsFromAdminRows(input.rows)
  if (!input.meta) {
    return {
      ...STUB_COOKIES,
      glance: STUB_COOKIES.glance.map(cloneBi),
      copy: cloneCopy(STUB_COOKIES.copy),
      rows,
    }
  }
  return {
    effectiveDate: asEffectiveDate(input.meta.effectiveDate),
    copy: asCopy(input.meta.copy),
    glance: asGlance(input.meta.glance),
    rows,
  }
}

export function isMissingCookieTable(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021'
}

export { COOKIE_COPY_KEYS }
