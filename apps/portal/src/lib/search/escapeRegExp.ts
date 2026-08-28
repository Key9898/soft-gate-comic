export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function matchesQuery(haystack: string, query: string): boolean {
  const q = query.trim()
  if (!q) return false
  try {
    return new RegExp(escapeRegExp(q), 'i').test(haystack)
  } catch {
    return haystack.toLowerCase().includes(q.toLowerCase())
  }
}
