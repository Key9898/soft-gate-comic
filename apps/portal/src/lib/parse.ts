export type BilingualText = { en: string; mm: string }

const SAFE_URL_SCHEME = /^(https?:|mailto:|tel:)/i

export function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

export function asBilingual(value: unknown): BilingualText | null {
  const row = asRecord(value)
  if (!row) return null
  return {
    en: typeof row.en === 'string' ? row.en : '',
    mm: typeof row.mm === 'string' ? row.mm : '',
  }
}

export function asBilingualList(value: unknown): BilingualText[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => asBilingual(item))
    .filter((item): item is BilingualText => item !== null)
}

export function asNonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

export function asSortOrder(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

/**
 * CMS-authored links land in `href`/`src`, so anything that is not an absolute
 * http(s)/mailto/tel URL or a site-relative path is dropped rather than rendered.
 */
export function asSafeUrl(value: unknown): string | null {
  const url = asNonEmptyString(value)
  if (!url) return null
  if (url.startsWith('/')) return url.startsWith('//') ? null : url
  return SAFE_URL_SCHEME.test(url) ? url : null
}

export function parseRows<T>(value: unknown, parseRow: (row: unknown) => T | null): T[] | null {
  if (!Array.isArray(value)) return null
  const mapped: T[] = []
  for (const row of value) {
    const parsed = parseRow(row)
    if (parsed) mapped.push(parsed)
  }
  return mapped
}
