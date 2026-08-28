// @vitest-environment node
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { mockWebtoons } from '@softgate/shared'
import { buildSitemapEntries, buildSitemapXml } from '../lib/seo/sitemap'

describe('dynamic sitemap', () => {
  const entries = buildSitemapEntries()
  const xml = buildSitemapXml()

  it('starts with the XML declaration and urlset with image namespace', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
    expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"')
  })

  it('lists every published webtoon hub with lastmod and cover image', () => {
    const published = mockWebtoons.filter((w) => w.status !== 'draft')
    expect(published.length).toBeGreaterThan(0)
    for (const webtoon of published) {
      const entry = entries.find((e) => e.path === `/webtoon/${webtoon.id}`)
      expect(entry).toBeDefined()
      expect(entry?.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      if (webtoon.coverImage) {
        expect(entry?.image).toBe(`https://softgatecomic.com${webtoon.coverImage}`)
      }
    }
  })

  it('excludes draft webtoons', () => {
    const drafts = mockWebtoons.filter((w) => w.status === 'draft')
    for (const draft of drafts) {
      expect(entries.some((e) => e.path === `/webtoon/${draft.id}`)).toBe(false)
    }
  })

  it('includes static, category, and author pages but never reader or private paths', () => {
    const paths = entries.map((e) => e.path)
    expect(paths).toContain('/')
    expect(paths).toContain('/categories')
    expect(paths).toContain('/ranking')
    expect(paths).toContain('/categories/action')
    expect(paths).toContain('/author/1')
    expect(paths).toContain('/privacy')
    expect(paths.some((p) => p.startsWith('/read/'))).toBe(false)
    expect(paths.some((p) => p.startsWith('/login'))).toBe(false)
    expect(paths.some((p) => p.startsWith('/coins'))).toBe(false)
    expect(paths).not.toContain('/categories/all')
  })

  it('emits both locale URLs with hreflang alternates', () => {
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')
    expect(xml).toContain('<loc>https://softgatecomic.com/webtoon/1</loc>')
    expect(xml).toContain('<loc>https://softgatecomic.com/mm/webtoon/1</loc>')
    expect(xml).toContain(
      '<xhtml:link rel="alternate" hreflang="my" href="https://softgatecomic.com/mm/webtoon/1"/>'
    )
    expect(xml).toContain(
      '<xhtml:link rel="alternate" hreflang="x-default" href="https://softgatecomic.com/webtoon/1"/>'
    )
  })

  it('keeps robots.txt disallowing reader and private paths with the sitemap reference', () => {
    const robots = readFileSync(path.join(import.meta.dirname, '../../public/robots.txt'), 'utf8')
    expect(robots).toContain('Disallow: /read/')
    expect(robots).toContain('Disallow: /coins')
    expect(robots).toContain('Disallow: /maintenance')
    expect(robots).toContain('Sitemap: https://softgatecomic.com/sitemap.xml')
  })
})
