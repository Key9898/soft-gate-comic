import { unwrapApiData } from '@softgate/contracts'
import { useEffect, useState } from 'react'
import { isMockApi } from './api/isMockApi'
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

export type CookieCopyKey =
  | 'cookiesTitle'
  | 'cookiesSeoDesc'
  | 'whatAreCookies'
  | 'whatAreCookiesDesc'
  | 'howWeUseCookies'
  | 'howWeUseCookiesDesc'
  | 'essentialCookies'
  | 'essentialCookiesDesc'
  | 'functionalCookies'
  | 'functionalCookiesDesc'
  | 'analyticsCookies'
  | 'analyticsCookiesDesc'
  | 'marketingCookies'
  | 'marketingCookiesDesc'
  | 'storageDetails'
  | 'storageDetailsDesc'
  | 'managingCookies'
  | 'managingCookiesDesc'
  | 'thirdPartyCookies'
  | 'thirdPartyCookiesDesc'
  | 'updatesPolicy'
  | 'updatesPolicyDesc'

export type PortalCookieRow = {
  id: string
  storageKey: string
  label: BilingualText
  description: BilingualText
  sortOrder: number
}

export type PortalCookies = {
  effectiveDate: string
  copy: Record<CookieCopyKey, BilingualText>
  glance: BilingualText[]
  rows: PortalCookieRow[]
}

function parseCookieRow(row: unknown): PortalCookieRow | null {
  const item = asRecord(row)
  if (!item) return null
  const id = asNonEmptyString(item.id)
  const storageKey = asNonEmptyString(item.storageKey)
  const label = asBilingual(item.label)
  const description = asBilingual(item.description)
  if (!id || !storageKey || !label || !description) return null
  return { id, storageKey, label, description, sortOrder: asSortOrder(item.sortOrder) }
}

export function parseCookies(data: unknown): PortalCookies | null {
  const root = asRecord(data)
  if (!root) return null
  const effectiveDate = asNonEmptyString(root.effectiveDate)
  const copyRow = asRecord(root.copy)
  if (!effectiveDate || !copyRow) return null
  if (!Array.isArray(root.glance)) return null
  const rows = parseRows(root.rows, parseCookieRow)
  if (!rows) return null

  const copy: Record<string, BilingualText> = {}
  for (const [key, text] of Object.entries(copyRow)) {
    const bilingual = asBilingual(text)
    if (bilingual) copy[key] = bilingual
  }

  return {
    effectiveDate,
    copy: copy as PortalCookies['copy'],
    glance: asBilingualList(root.glance),
    rows,
  }
}

export function useCookies(): PortalCookies | null {
  const mock = isMockApi()
  const [live, setLive] = useState<PortalCookies | null>(null)

  useEffect(() => {
    if (mock) return
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    let cancelled = false
    fetch(`${baseUrl}/api/cookies`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch cookies')
        return res.json()
      })
      .then((payload: unknown) => {
        const data = parseCookies(unwrapApiData<unknown>(payload))
        if (!cancelled && data) setLive(data)
      })
      .catch(() => {
        if (!cancelled) setLive(null)
      })
    return () => {
      cancelled = true
    }
  }, [mock])

  return live
}
