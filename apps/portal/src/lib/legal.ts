import { unwrapApiData } from '@softgate/contracts'
import { useEffect, useState } from 'react'
import { isMockApi } from './api/isMockApi'
import { LEGAL_EFFECTIVE_DATE } from './info/legalEffectiveDate'

export type BilingualText = { en: string; mm: string }

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
        const data = unwrapApiData<PortalLegalPage>(payload)
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
