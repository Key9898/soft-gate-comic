import { unwrapApiData } from '@softgate/contracts'
import { useEffect, useState } from 'react'
import { isMockApi } from './api/isMockApi'
import {
  asBilingual,
  asNonEmptyString,
  asRecord,
  asSafeUrl,
  parseRows,
  type BilingualText,
} from './parse'

export type { BilingualText }

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

function parseCopy(value: unknown): Record<string, BilingualText> | null {
  const row = asRecord(value)
  if (!row) return null
  const copy: Record<string, BilingualText> = {}
  for (const [key, text] of Object.entries(row)) {
    const bilingual = asBilingual(text)
    if (bilingual) copy[key] = bilingual
  }
  return copy
}

function parseFact(row: unknown): PortalPress['facts'][number] | null {
  const item = asRecord(row)
  if (!item) return null
  const key = asNonEmptyString(item.key)
  const label = asBilingual(item.label)
  const value = asBilingual(item.value)
  if (!key || !label || !value) return null
  const href = asSafeUrl(item.href)
  return href ? { key, label, value, href } : { key, label, value }
}

function parseSwatch(row: unknown): PortalPress['palette'][number] | null {
  const item = asRecord(row)
  if (!item) return null
  const hex = asNonEmptyString(item.hex)
  const label = asBilingual(item.label)
  if (!hex || !label) return null
  return { hex, label }
}

function parseAsset(row: unknown): PortalPress['assets'][number] | null {
  const item = asRecord(row)
  if (!item) return null
  const name = asBilingual(item.name)
  const url = asSafeUrl(item.url)
  const format = asNonEmptyString(item.format)
  if (!name || !url || !format) return null
  return { name, url, format }
}

function parseNewsRow(row: unknown): PortalPress['news'][number] | null {
  const item = asRecord(row)
  if (!item) return null
  const id = asNonEmptyString(item.id)
  const title = asBilingual(item.title)
  const body = asBilingual(item.body)
  if (!id || !title || !body) return null
  const next: PortalPress['news'][number] = { id, title, body }
  const href = asSafeUrl(item.href)
  if (href) next.href = href
  if (item.demoBadge === true) next.demoBadge = true
  return next
}

function parseStill(row: unknown): PortalPress['stills'][number] | null {
  const item = asRecord(row)
  if (!item) return null
  const id = asNonEmptyString(item.id)
  const title = asBilingual(item.title)
  const imageUrl = asSafeUrl(item.imageUrl)
  if (!id || !title || !imageUrl) return null
  const next: PortalPress['stills'][number] = { id, title, imageUrl }
  if (item.demoBadge === true) next.demoBadge = true
  return next
}

function parseSpokesperson(value: unknown): PortalPress['spokesperson'] | undefined {
  const item = asRecord(value)
  if (!item) return undefined
  const name = asBilingual(item.name)
  const role = asBilingual(item.role)
  if (!name || !role) return undefined
  const next: NonNullable<PortalPress['spokesperson']> = { name, role }
  const photoUrl = asSafeUrl(item.photoUrl)
  if (photoUrl) next.photoUrl = photoUrl
  return next
}

export function parsePress(data: unknown): PortalPress | null {
  const root = asRecord(data)
  if (!root) return null

  const copy = parseCopy(root.copy)
  const zipUrl = asSafeUrl(root.zipUrl)
  const contactEmail = asNonEmptyString(root.contactEmail)
  if (!copy || !zipUrl || !contactEmail) return null

  const facts = parseRows(root.facts, parseFact)
  const palette = parseRows(root.palette, parseSwatch)
  const assets = parseRows(root.assets, parseAsset)
  const news = parseRows(root.news, parseNewsRow)
  const stills = parseRows(root.stills, parseStill)
  if (!facts || !palette || !assets || !news || !stills) return null

  const press: PortalPress = { copy, zipUrl, contactEmail, facts, palette, assets, news, stills }
  const spokesperson = parseSpokesperson(root.spokesperson)
  if (spokesperson) press.spokesperson = spokesperson
  return press
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
        const data = parsePress(unwrapApiData<unknown>(payload))
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
