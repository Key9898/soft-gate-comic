import { describe, it, expect } from 'vitest'
import {
  blendedProgressPercent,
  isSeriesCompleteForContinue,
  scrollRatioFromMetrics,
  scrollTopFromRatio,
} from '../lib/engagement/progress'

describe('engagement progress helpers', () => {
  it('blendedProgressPercent mixes episode and scroll', () => {
    expect(blendedProgressPercent(1, 10, 0)).toBe(0)
    expect(blendedProgressPercent(1, 10, 0.5)).toBe(5)
    expect(blendedProgressPercent(2, 10, 0)).toBe(10)
    expect(blendedProgressPercent(10, 10, 1)).toBe(100)
  })

  it('isSeriesCompleteForContinue requires last episode near end', () => {
    expect(isSeriesCompleteForContinue(9, 10, 1)).toBe(false)
    expect(isSeriesCompleteForContinue(10, 10, 0.5)).toBe(false)
    expect(isSeriesCompleteForContinue(10, 10, 0)).toBe(false)
    expect(isSeriesCompleteForContinue(10, 10, 0.98)).toBe(true)
  })

  it('scrollRatioFromMetrics and scrollTopFromRatio round-trip', () => {
    expect(scrollRatioFromMetrics(0, 1000, 200)).toBe(0)
    expect(scrollRatioFromMetrics(400, 1000, 200)).toBe(0.5)
    expect(scrollRatioFromMetrics(800, 1000, 200)).toBe(1)
    expect(scrollRatioFromMetrics(10, 100, 200)).toBe(0)
    expect(scrollTopFromRatio(0.5, 1000, 200)).toBe(400)
  })
})
