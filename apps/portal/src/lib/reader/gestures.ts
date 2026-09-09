export const SWIPE_DX_MIN = 64
export const SWIPE_DY_MAX = 48

export type SwipeEpisodeDelta = -1 | 0 | 1

export type PanOffset = { x: number; y: number }

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

export function clampPanOffset(
  x: number,
  y: number,
  scale: number,
  width: number,
  height: number
): PanOffset {
  if (!Number.isFinite(scale) || scale <= 1) return { x: 0, y: 0 }
  const maxX = Number.isFinite(width) && width > 0 ? ((scale - 1) * width) / 2 : 0
  const maxY = Number.isFinite(height) && height > 0 ? ((scale - 1) * height) / 2 : 0
  return {
    x: Math.min(maxX, Math.max(-maxX, x)),
    y: Math.min(maxY, Math.max(-maxY, y)),
  }
}
