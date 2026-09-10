// @vitest-environment node
import { existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const kitDir = path.join(import.meta.dirname, '../../public/press-kit')

describe('press kit files', () => {
  it('ships a real ZIP larger than 1KB', () => {
    const zipPath = path.join(kitDir, 'softgate-comic-press-kit.zip')
    expect(existsSync(zipPath)).toBe(true)
    expect(statSync(zipPath).size).toBeGreaterThan(1024)
  })

  it('ships three Demo still files', () => {
    for (const name of ['still-home.png', 'still-hub.png', 'still-reader.png']) {
      const stillPath = path.join(kitDir, name)
      expect(existsSync(stillPath)).toBe(true)
      expect(statSync(stillPath).size).toBeGreaterThan(1024)
    }
  })
})
