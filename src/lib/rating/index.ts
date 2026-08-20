export const RATING_STEPS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const

export type RatingValue = (typeof RATING_STEPS)[number]

export type StarFill = 'empty' | 'half' | 'full'

export function isValidRating(value: unknown): value is RatingValue {
  return typeof value === 'number' && (RATING_STEPS as readonly number[]).includes(value)
}

export function formatRating(value: number): string {
  if (!Number.isFinite(value)) return '0.0'
  return value.toFixed(1)
}

export function starFill(value: number | null, index: number): StarFill {
  if (value == null || !Number.isFinite(value)) return 'empty'
  if (value >= index) return 'full'
  if (value >= index - 0.5) return 'half'
  return 'empty'
}

export function adjacentRating(current: number | null, delta: -0.5 | 0.5): RatingValue {
  if (current == null || !isValidRating(current)) {
    return delta > 0 ? 0.5 : 5
  }
  const idx = RATING_STEPS.indexOf(current)
  const next = Math.min(RATING_STEPS.length - 1, Math.max(0, idx + (delta > 0 ? 1 : -1)))
  return RATING_STEPS[next]
}
