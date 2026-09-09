export const READER_AD_MID_MIN_PANELS = 6

export function readerMidAdAfterIndex(panelCount: number): number | null {
  if (!Number.isFinite(panelCount) || panelCount < READER_AD_MID_MIN_PANELS) return null
  return Math.floor(panelCount / 2) - 1
}
