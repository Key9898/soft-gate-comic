import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { emitSpaNotFoundHtml } from '../lib/host/emitSpaNotFoundHtml'
import { SPA_REWRITE_SOURCES } from '../lib/host/spaRewrites'

type VercelConfig = {
  rewrites?: { source: string; destination: string }[]
}

describe('SPA host 404', () => {
  it('keeps vercel.json rewrite sources aligned with SPA_REWRITE_SOURCES', () => {
    const raw = readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf8')
    const config = JSON.parse(raw) as VercelConfig
    const sources = (config.rewrites ?? []).map((rule) => rule.source)
    expect(sources).toEqual([...SPA_REWRITE_SOURCES])
    expect(config.rewrites?.every((rule) => rule.destination === '/index.html')).toBe(true)
    expect(raw).not.toMatch(/"source": "\/\(\.\*\)"/)
  })

  it('copies index.html to 404.html', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'spa-404-'))
    try {
      writeFileSync(path.join(dir, 'index.html'), '<html>spa</html>')
      emitSpaNotFoundHtml(dir)
      expect(readFileSync(path.join(dir, '404.html'), 'utf8')).toBe('<html>spa</html>')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('throws when index.html is missing', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'spa-404-missing-'))
    try {
      expect(() => emitSpaNotFoundHtml(dir)).toThrow(/dist\/index\.html missing/)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
