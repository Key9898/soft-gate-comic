function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

/**
 * Blended progress across a series (0–100).
 * episodeNumber is 1-based last opened episode; scrollRatio is 0–1 within that episode.
 */
export function blendedProgressPercent(
  episodeNumber: number,
  episodeCount: number,
  scrollRatio = 0
): number {
  if (!Number.isFinite(episodeNumber) || !Number.isFinite(episodeCount) || episodeCount <= 0) {
    return 0
  }
  const ratio = clamp01(scrollRatio)
  const ep = Math.max(1, episodeNumber)
  return Math.round(((ep - 1 + ratio) / episodeCount) * 100)
}

export function isSeriesCompleteForContinue(
  episodeNumber: number,
  episodeCount: number,
  scrollRatio = 0
): boolean {
  if (!Number.isFinite(episodeCount) || episodeCount <= 0) return false
  if (episodeNumber < episodeCount) return false
  return clamp01(scrollRatio) >= 0.98 || episodeNumber > episodeCount
}

/** Window scroll → 0..1 ratio within the current document. */
export function scrollRatioFromMetrics(
  scrollTop: number,
  scrollHeight: number,
  viewportHeight: number
): number {
  const travel = scrollHeight - viewportHeight
  if (!Number.isFinite(travel) || travel <= 0) return 0
  return clamp01(scrollTop / travel)
}

/** Restore pixel scrollTop from a stored 0..1 ratio. */
export function scrollTopFromRatio(
  scrollRatio: number,
  scrollHeight: number,
  viewportHeight: number
): number {
  const travel = Math.max(0, scrollHeight - viewportHeight)
  return clamp01(scrollRatio) * travel
}
