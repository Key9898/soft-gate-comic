import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { emitSpaNotFoundHtml, prepareSsrClientDist } from '../lib/host/emitSpaNotFoundHtml'
import { SPA_REWRITE_SOURCES, SSR_REWRITE_DESTINATION } from '../lib/host/spaRewrites'

type VercelConfig = {
  rewrites?: { source: string; destination: string }[]
}

describe('SSR host config', () => {
  it('keeps vercel.json rewrite sources aligned with SPA_REWRITE_SOURCES', () => {
    const raw = readFileSync(path.join(import.meta.dirname, '../../../../vercel.json'), 'utf8')
    const config = JSON.parse(raw) as VercelConfig
    const sources = (config.rewrites ?? []).map((rule) => rule.source)
    expect(sources).toEqual([...SPA_REWRITE_SOURCES])
    expect(config.rewrites?.every((rule) => rule.destination === SSR_REWRITE_DESTINATION)).toBe(
      true
    )
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

  it('prepares client dist with 404.html and template.html, no index.html', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'ssr-dist-'))
    try {
      writeFileSync(path.join(dir, 'index.html'), '<html>ssr</html>')
      prepareSsrClientDist(dir)
      expect(readFileSync(path.join(dir, '404.html'), 'utf8')).toBe('<html>ssr</html>')
      expect(readFileSync(path.join(dir, 'template.html'), 'utf8')).toBe('<html>ssr</html>')
      expect(existsSync(path.join(dir, 'index.html'))).toBe(false)
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
