export const SWIPE_DX_MIN = 64
export const SWIPE_DY_MAX = 48

export type SwipeEpisodeDelta = -1 | 0 | 1

export function swipeEpisodeDelta(dx: number, dy: number): SwipeEpisodeDelta {
  if (Math.abs(dy) > Math.abs(dx)) return 0
  if (Math.abs(dy) > SWIPE_DY_MAX) return 0
  if (Math.abs(dx) < SWIPE_DX_MIN) return 0
  return dx > 0 ? -1 : 1
}

export function clampPinchScale(scale: number): number {
  if (!Number.isFinite(scale)) return 1
  return Math.min(3, Math.max(1, scale))
}
