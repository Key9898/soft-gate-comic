import { describe, expect, it } from 'vitest'
import { SWIPE_DX_MIN, SWIPE_DY_MAX, clampPinchScale, swipeEpisodeDelta } from '../lib/reader'

describe('swipeEpisodeDelta', () => {
  it('returns prev for a right swipe and next for a left swipe', () => {
    expect(swipeEpisodeDelta(SWIPE_DX_MIN, 0)).toBe(-1)
    expect(swipeEpisodeDelta(-SWIPE_DX_MIN, 0)).toBe(1)
  })

  it('ignores short, vertical, or too-tall swipes', () => {
    expect(swipeEpisodeDelta(SWIPE_DX_MIN - 1, 0)).toBe(0)
    expect(swipeEpisodeDelta(0, 80)).toBe(0)
    expect(swipeEpisodeDelta(100, 101)).toBe(0)
    expect(swipeEpisodeDelta(100, SWIPE_DY_MAX + 1)).toBe(0)
    expect(swipeEpisodeDelta(100, SWIPE_DY_MAX)).toBe(-1)
  })
})

describe('clampPinchScale', () => {
  it('clamps to 1–3', () => {
    expect(clampPinchScale(0.5)).toBe(1)
    expect(clampPinchScale(1)).toBe(1)
    expect(clampPinchScale(2)).toBe(2)
    expect(clampPinchScale(3)).toBe(3)
    expect(clampPinchScale(4)).toBe(3)
  })
})
