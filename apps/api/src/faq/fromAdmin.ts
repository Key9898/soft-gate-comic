import { Prisma } from '@prisma/client'
import { asBilingual } from '../catalog/fromAdmin.js'
import {
  DEFAULT_FAQ_ITEMS,
  isFaqCategory,
  isFaqRelatedPath,
  type FaqCategory,
  type FaqRelatedPath,
} from './seed.js'

export type BilingualText = { en: string; mm: string }

export type PortalFaqItem = {
  id: string
  category: FaqCategory
  question: BilingualText
  answer: BilingualText
  relatedTo?: FaqRelatedPath
  relatedLabel?: BilingualText
  sortOrder: number
}

export type PortalFaq = {
  items: PortalFaqItem[]
}

export type AdminFaqMetaRow = {
  id: string
  nextItemNumber: number
}

export type AdminFaqItemRow = {
  id: string
  category: string
  question: unknown
  answer: unknown
  relatedTo?: string | null
  relatedLabel?: unknown | null
  sortOrder: number
  published: boolean
}

function portalItemFromAdmin(row: AdminFaqItemRow): PortalFaqItem | null {
  if (!row.published || !isFaqCategory(row.category)) return null
  const item: PortalFaqItem = {
    id: row.id,
    category: row.category,
    question: asBilingual(row.question),
    answer: asBilingual(row.answer),
    sortOrder: row.sortOrder,
  }
  if (row.relatedTo && isFaqRelatedPath(row.relatedTo)) {
    item.relatedTo = row.relatedTo
    if (row.relatedLabel) item.relatedLabel = asBilingual(row.relatedLabel)
  }
  return item
}

export function portalItemsFromAdminRows(rows: AdminFaqItemRow[]): PortalFaqItem[] {
  return rows
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))
    .map(portalItemFromAdmin)
    .filter((row): row is PortalFaqItem => row !== null)
}

function stubItemFromSeed(row: (typeof DEFAULT_FAQ_ITEMS)[number]): PortalFaqItem {
  const item: PortalFaqItem = {
    id: row.id,
    category: row.category,
    question: { en: row.question.en, mm: row.question.mm },
    answer: { en: row.answer.en, mm: row.answer.mm },
    sortOrder: row.sortOrder,
  }
  if (row.relatedTo) item.relatedTo = row.relatedTo
  if (row.relatedLabel) item.relatedLabel = { en: row.relatedLabel.en, mm: row.relatedLabel.mm }
  return item
}

export const STUB_FAQ: PortalFaq = {
  items: DEFAULT_FAQ_ITEMS.filter((row) => row.published).map(stubItemFromSeed),
}

export function portalFaqFromAdmin(input: {
  meta: AdminFaqMetaRow | null
  items: AdminFaqItemRow[]
}): PortalFaq {
  if (!input.meta && input.items.length === 0) return STUB_FAQ
  return { items: portalItemsFromAdminRows(input.items) }
}

export function isMissingFaqTable(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021'
}
