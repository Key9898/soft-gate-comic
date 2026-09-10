import { unwrapApiData } from '@softgate/contracts'
import { useEffect, useState } from 'react'
import { isMockApi } from './api/isMockApi'

export type BilingualText = { en: string; mm: string }

export type PortalPress = {
  copy: Record<string, BilingualText>
  zipUrl: string
  contactEmail: string
  facts: Array<{ key: string; label: BilingualText; value: BilingualText; href?: string }>
  palette: Array<{ hex: string; label: BilingualText }>
  assets: Array<{ name: BilingualText; url: string; format: string }>
  news: Array<{
    id: string
    title: BilingualText
    body: BilingualText
    href?: string
    demoBadge?: boolean
  }>
  stills: Array<{
    id: string
    title: BilingualText
    imageUrl: string
    demoBadge?: boolean
  }>
  spokesperson?: {
    name: BilingualText
    role: BilingualText
    photoUrl?: string
  }
}

export function pickPressText(text: BilingualText, language: string): string {
  return language.startsWith('mm') ? text.mm : text.en
}

export function usePress(): PortalPress | null {
  const mock = isMockApi()
  const [live, setLive] = useState<PortalPress | null>(null)

  useEffect(() => {
    if (mock) return
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    let cancelled = false
    fetch(`${baseUrl}/api/press`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch press')
        return res.json()
      })
      .then((payload: unknown) => {
        const data = unwrapApiData<PortalPress>(payload)
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
