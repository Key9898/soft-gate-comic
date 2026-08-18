const STORAGE_KEY = 'softgate_recent_searches'
const MAX_RECENT = 8

function normalize(term: string): string {
  return term.trim().replace(/\s+/g, ' ')
}

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return dedupe(parsed.filter((x): x is string => typeof x === 'string').map(normalize))
  } catch {
    return []
  }
}

export function addRecentSearch(term: string): string[] {
  const normalized = normalize(term)
  if (!normalized) return getRecentSearches()
  const next = dedupe([normalized, ...getRecentSearches()]).slice(0, MAX_RECENT)
  persist(next)
  return next
}

export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}

function dedupe(items: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of items) {
    const key = item.toLowerCase()
    if (!item || seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

function persist(items: string[]): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
