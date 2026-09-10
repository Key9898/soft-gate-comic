export type BilingualText = { en: string; mm: string }

export type PortalAboutHistory = {
  id: string
  year: number
  month: number
  title: BilingualText
  description: BilingualText
  sortOrder: number
  photoUrl?: string
}

export type HistoryYearGroup = {
  year: number
  items: PortalAboutHistory[]
}

export const ABOUT_MONTH_KEYS = [
  'about.month1',
  'about.month2',
  'about.month3',
  'about.month4',
  'about.month5',
  'about.month6',
  'about.month7',
  'about.month8',
  'about.month9',
  'about.month10',
  'about.month11',
  'about.month12',
] as const

export type AboutMonthKey = (typeof ABOUT_MONTH_KEYS)[number]

export function pickBilingual(value: BilingualText, lang: string): string {
  if (lang.startsWith('mm') && value.mm) return value.mm
  return value.en || value.mm
}

export function aboutMonthKey(month: number): AboutMonthKey | null {
  if (!Number.isInteger(month) || month < 1 || month > 12) return null
  return ABOUT_MONTH_KEYS[month - 1]
}

function compareHistory(a: PortalAboutHistory, b: PortalAboutHistory): number {
  if (a.year !== b.year) return a.year - b.year
  if (a.month !== b.month) return a.month - b.month
  if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
  return a.id.localeCompare(b.id)
}

export function groupHistoriesByYear(rows: PortalAboutHistory[]): HistoryYearGroup[] {
  const groups: HistoryYearGroup[] = []
  for (const row of rows.slice().sort(compareHistory)) {
    const last = groups[groups.length - 1]
    if (last && last.year === row.year) last.items.push(row)
    else groups.push({ year: row.year, items: [row] })
  }
  return groups
}

function asBilingual(value: unknown): BilingualText | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const row = value as { en?: unknown; mm?: unknown }
  return {
    en: typeof row.en === 'string' ? row.en : '',
    mm: typeof row.mm === 'string' ? row.mm : '',
  }
}

export function parseAboutHistories(data: unknown): PortalAboutHistory[] | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null
  const histories = (data as { histories?: unknown }).histories
  if (!Array.isArray(histories)) return null

  const mapped: PortalAboutHistory[] = []
  for (const row of histories) {
    if (!row || typeof row !== 'object' || Array.isArray(row)) continue
    const item = row as Record<string, unknown>
    if (typeof item.id !== 'string' || item.id.length === 0) continue
    if (typeof item.year !== 'number' || !Number.isFinite(item.year)) continue
    if (typeof item.month !== 'number' || !Number.isFinite(item.month)) continue
    const title = asBilingual(item.title)
    const description = asBilingual(item.description)
    if (!title || !description) continue
    const next: PortalAboutHistory = {
      id: item.id,
      year: item.year,
      month: item.month,
      title,
      description,
      sortOrder:
        typeof item.sortOrder === 'number' && Number.isFinite(item.sortOrder) ? item.sortOrder : 0,
    }
    if (typeof item.photoUrl === 'string' && item.photoUrl) next.photoUrl = item.photoUrl
    mapped.push(next)
  }
  return mapped
}
