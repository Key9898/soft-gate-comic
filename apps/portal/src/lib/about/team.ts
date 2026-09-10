import type { BilingualText } from './history'

export type PortalAboutMember = {
  id: string
  name: BilingualText
  role: BilingualText
  sortOrder: number
  photoUrl?: string
}

export type PortalAboutMeta = {
  deck: BilingualText
  standInNote: BilingualText
  standInVisible: boolean
}

function asBilingual(value: unknown): BilingualText | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const row = value as { en?: unknown; mm?: unknown }
  return {
    en: typeof row.en === 'string' ? row.en : '',
    mm: typeof row.mm === 'string' ? row.mm : '',
  }
}

function compareMember(a: PortalAboutMember, b: PortalAboutMember): number {
  if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
  return a.id.localeCompare(b.id)
}

export function parseAboutMembers(data: unknown): PortalAboutMember[] | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null
  const members = (data as { members?: unknown }).members
  if (!Array.isArray(members)) return null

  const mapped: PortalAboutMember[] = []
  for (const row of members) {
    if (!row || typeof row !== 'object' || Array.isArray(row)) continue
    const item = row as Record<string, unknown>
    if (typeof item.id !== 'string' || item.id.length === 0) continue
    const name = asBilingual(item.name)
    const role = asBilingual(item.role)
    if (!name || !role) continue
    const next: PortalAboutMember = {
      id: item.id,
      name,
      role,
      sortOrder:
        typeof item.sortOrder === 'number' && Number.isFinite(item.sortOrder) ? item.sortOrder : 0,
    }
    if (typeof item.photoUrl === 'string' && item.photoUrl) next.photoUrl = item.photoUrl
    mapped.push(next)
  }
  return mapped.sort(compareMember)
}

export function parseAboutMeta(data: unknown): PortalAboutMeta | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null
  const meta = (data as { meta?: unknown }).meta
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) return null
  const row = meta as Record<string, unknown>
  const deck = asBilingual(row.deck)
  const standInNote = asBilingual(row.standInNote)
  if (!deck || !standInNote) return null
  return {
    deck,
    standInNote,
    standInVisible: row.standInVisible === true,
  }
}
