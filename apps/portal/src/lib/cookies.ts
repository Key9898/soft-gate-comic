import { unwrapApiData } from '@softgate/contracts'
import { useEffect, useState } from 'react'
import { isMockApi } from './api/isMockApi'

export type BilingualText = { en: string; mm: string }

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
        const data = unwrapApiData<PortalCookies>(payload)
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
