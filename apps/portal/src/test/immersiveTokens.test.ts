import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const TOKENS = [
  'canvas',
  'surface',
  'surface-nested',
  'raised',
  'track',
  'ink',
  'ink-secondary',
  'ink-muted',
  'edge',
  'edge-subtle',
  'danger-surface',
  'danger-edge',
] as const

const css = () => readFileSync(path.resolve(__dirname, '../index.css'), 'utf8')

const themeBlock = () => {
  const contents = css()
  const start = contents.indexOf('@theme {')
  expect(start).toBeGreaterThan(-1)
  return contents.slice(start, contents.indexOf('\n}', start))
}

describe('immersive colour tokens', () => {
  it('declares every semantic token in the theme block', () => {
    const theme = themeBlock()
    for (const token of TOKENS) {
      expect(theme).toContain(`--color-${token}:`)
    }
  })

  it('re-binds every one of them in the immersive scope', () => {
    const scope = css().slice(css().indexOf("[data-theme='immersive']"))
    for (const token of TOKENS) {
      expect(scope).toContain(`--color-${token}:`)
    }
  })

  it('leaves the portal-wide muted tokens out of the immersive scope', () => {
    const start = css().indexOf("[data-theme='immersive']")
    const scope = css().slice(start, css().indexOf('}', start))
    expect(scope).not.toContain('--color-muted')
  })
})
