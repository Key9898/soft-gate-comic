import { describe, expect, it } from 'vitest'
import { THREADPOOL_MAX, THREADPOOL_MIN, resolveThreadpoolSize } from '../threadpool.js'

describe('resolveThreadpoolSize', () => {
  it('leaves an explicit UV_THREADPOOL_SIZE alone', () => {
    // A deployment that has tuned this knows its box better than we do.
    expect(resolveThreadpoolSize({ current: '32', cpus: 2 })).toBeNull()
    expect(resolveThreadpoolSize({ current: '1', cpus: 64 })).toBeNull()
  })

  it('ignores a value that is not a usable number', () => {
    expect(resolveThreadpoolSize({ current: '', cpus: 8 })).toBe(8)
    expect(resolveThreadpoolSize({ current: 'lots', cpus: 8 })).toBe(8)
    expect(resolveThreadpoolSize({ current: '0', cpus: 8 })).toBe(8)
    expect(resolveThreadpoolSize({ current: '-4', cpus: 8 })).toBe(8)
  })

  it('tracks the core count when nothing is set', () => {
    expect(resolveThreadpoolSize({ current: undefined, cpus: 8 })).toBe(8)
    expect(resolveThreadpoolSize({ current: undefined, cpus: 12 })).toBe(12)
  })

  it('never drops below libuv default so it cannot make things worse', () => {
    expect(resolveThreadpoolSize({ current: undefined, cpus: 1 })).toBe(THREADPOOL_MIN)
    expect(resolveThreadpoolSize({ current: undefined, cpus: 2 })).toBe(THREADPOOL_MIN)
    expect(THREADPOOL_MIN).toBe(4)
  })

  it('caps the size so a large host does not spawn a silly pool', () => {
    expect(resolveThreadpoolSize({ current: undefined, cpus: 128 })).toBe(THREADPOOL_MAX)
    expect(THREADPOOL_MAX).toBe(16)
  })

  it('falls back to the default when the core count is unknown', () => {
    expect(resolveThreadpoolSize({ current: undefined, cpus: 0 })).toBe(THREADPOOL_MIN)
    expect(resolveThreadpoolSize({ current: undefined, cpus: Number.NaN })).toBe(THREADPOOL_MIN)
  })
})
