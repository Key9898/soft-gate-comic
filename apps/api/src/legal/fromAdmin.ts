import { Prisma } from '@prisma/client'
import { asBilingual } from '../catalog/fromAdmin.js'
import {
  DEFAULT_PRIVACY_META,
  DEFAULT_TERMS_META,
  LEGAL_EFFECTIVE_DATE,
  seedSectionsFor,
  type BilingualText,
  type LegalDoc,
  type LegalHeadingLevel,
  type LegalSectionKind,
} from './seed.js'

export type PortalLegalSection = {
  id: string
  slug: string
  kind: LegalSectionKind
  headingLevel: LegalHeadingLevel
  title: BilingualText
  body: BilingualText
  bullets: BilingualText[]
  sortOrder: number
}

export type PortalLegalPage = {
  seoDesc: BilingualText
  glance: BilingualText[]
  effectiveDate: string
  sections: PortalLegalSection[]
}

export type AdminLegalMetaRow = {
  id: string
  seoDesc: unknown
  glance: unknown
  effectiveDate: Date | string
}

export type AdminLegalSectionRow = {
  id: string
  slug: string
  kind: string
  headingLevel: string
  title: unknown
  body: unknown
  bullets: unknown
  sortOrder: number
  published: boolean
}

function asKind(value: string): LegalSectionKind {
  if (value === 'bullets' || value === 'privacy-rights') return value
  return 'body'
}

function asHeading(value: string): LegalHeadingLevel {
  return value === 'h3' ? 'h3' : 'h2'
}

function asGlance(value: unknown): BilingualText[] {
  if (!Array.isArray(value) || value.length === 0) return []
  return value.map((item) => asBilingual(item))
}

function asBullets(value: unknown): BilingualText[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => asBilingual(item))
}

function toIsoDate(value: Date | string): string {
  if (typeof value === 'string') {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
    return match ? `${match[1]}-${match[2]}-${match[3]}` : LEGAL_EFFECTIVE_DATE
  }
  return value.toISOString().slice(0, 10)
}

function portalSectionFromAdmin(row: AdminLegalSectionRow): PortalLegalSection {
  return {
    id: row.id,
    slug: row.slug,
    kind: asKind(row.kind),
    headingLevel: asHeading(row.headingLevel),
    title: asBilingual(row.title),
    body: asBilingual(row.body),
    bullets: asBullets(row.bullets),
    sortOrder: row.sortOrder,
  }
}

export function portalSectionsFromAdminRows(rows: AdminLegalSectionRow[]): PortalLegalSection[] {
  return rows
    .filter((row) => row.published)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))
    .map(portalSectionFromAdmin)
}

function stubFromSeed(doc: LegalDoc): PortalLegalPage {
  const meta = doc === 'privacy' ? DEFAULT_PRIVACY_META : DEFAULT_TERMS_META
  return {
    seoDesc: { en: meta.seoDesc.en, mm: meta.seoDesc.mm },
    glance: meta.glance.map((item) => ({ en: item.en, mm: item.mm })),
    effectiveDate: meta.effectiveDate,
    sections: seedSectionsFor(doc).map((row) => ({
      id: row.id,
      slug: row.slug,
      kind: row.kind,
      headingLevel: row.headingLevel,
      title: { en: row.title.en, mm: row.title.mm },
      body: { en: row.body.en, mm: row.body.mm },
      bullets: row.bullets.map((item) => ({ en: item.en, mm: item.mm })),
      sortOrder: row.sortOrder,
    })),
  }
}

export const STUB_PRIVACY: PortalLegalPage = stubFromSeed('privacy')
export const STUB_TERMS: PortalLegalPage = stubFromSeed('terms')

export function portalLegalFromAdmin(
  stub: PortalLegalPage,
  input: { meta: AdminLegalMetaRow | null; sections: AdminLegalSectionRow[] }
): PortalLegalPage {
  if (!input.meta && input.sections.length === 0) return stub
  const sections = portalSectionsFromAdminRows(input.sections)
  if (!input.meta) {
    return { ...stub, sections }
  }
  return {
    seoDesc: asBilingual(input.meta.seoDesc),
    glance: asGlance(input.meta.glance).length > 0 ? asGlance(input.meta.glance) : stub.glance,
    effectiveDate: toIsoDate(input.meta.effectiveDate) || stub.effectiveDate,
    sections,
  }
}

export function isMissingLegalTable(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021'
}
