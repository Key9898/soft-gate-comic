import { unwrapApiData } from '@softgate/contracts'
import { useEffect, useState } from 'react'
import { isMockApi } from './api/isMockApi'
import { LEGAL_EFFECTIVE_DATE } from './info/legalEffectiveDate'
import {
  asBilingual,
  asBilingualList,
  asNonEmptyString,
  asRecord,
  asSortOrder,
  parseRows,
  type BilingualText,
} from './parse'

export type { BilingualText }

export type PortalLegalSection = {
  id: string
  slug: string
  kind: 'body' | 'bullets' | 'privacy-rights'
  headingLevel: 'h2' | 'h3'
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

export function pickLegalText(text: BilingualText, language: string): string {
  return language.startsWith('mm') ? text.mm : text.en
}

export function parseLegalDate(iso: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!match) return LEGAL_EFFECTIVE_DATE
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

function asSectionKind(value: unknown): PortalLegalSection['kind'] {
  return value === 'bullets' || value === 'privacy-rights' ? value : 'body'
}

function asHeadingLevel(value: unknown): PortalLegalSection['headingLevel'] {
  return value === 'h3' ? 'h3' : 'h2'
}

function parseSection(row: unknown): PortalLegalSection | null {
  const item = asRecord(row)
  if (!item) return null
  const id = asNonEmptyString(item.id)
  const slug = asNonEmptyString(item.slug)
  const title = asBilingual(item.title)
  const body = asBilingual(item.body)
  if (!id || !slug || !title || !body) return null
  return {
    id,
    slug,
    kind: asSectionKind(item.kind),
    headingLevel: asHeadingLevel(item.headingLevel),
    title,
    body,
    bullets: asBilingualList(item.bullets),
    sortOrder: asSortOrder(item.sortOrder),
  }
}

export function parseLegalPage(data: unknown): PortalLegalPage | null {
  const root = asRecord(data)
  if (!root) return null
  const seoDesc = asBilingual(root.seoDesc)
  const effectiveDate = asNonEmptyString(root.effectiveDate)
  if (!seoDesc || !effectiveDate) return null
  if (!Array.isArray(root.glance)) return null
  const sections = parseRows(root.sections, parseSection)
  if (!sections) return null
  return { seoDesc, glance: asBilingualList(root.glance), effectiveDate, sections }
}

export function useLegal(doc: 'privacy' | 'terms'): PortalLegalPage | null {
  const mock = isMockApi()
  const [live, setLive] = useState<PortalLegalPage | null>(null)

  useEffect(() => {
    if (mock) return
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    let cancelled = false
    fetch(`${baseUrl}/api/legal/${doc}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch legal')
        return res.json()
      })
      .then((payload: unknown) => {
        const data = parseLegalPage(unwrapApiData<unknown>(payload))
        if (!cancelled && data) setLive(data)
      })
      .catch(() => {
        if (!cancelled) setLive(null)
      })
    return () => {
      cancelled = true
    }
  }, [mock, doc])

  return live
}
