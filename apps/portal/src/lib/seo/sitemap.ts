import { mockAuthors, mockGenres, mockWebtoons } from '@softgate/shared'
import { SITE_URL } from '../../components/SEO/jsonLd'
import { localizePath } from '../locale/locale'

const STATIC_PATHS = [
  '/',
  '/categories',
  '/ranking',
  '/about',
  '/creators',
  '/press',
  '/help',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
  '/cookies',
] as const

export interface SitemapEntry {
  path: string
  lastmod?: string
  image?: string
}

const CATALOG_DRIVEN_PATHS = new Set(['/', '/categories', '/ranking'])

const toLastmodDate = (value: string): string | undefined => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return undefined
  return parsed.toISOString().slice(0, 10)
}

export function buildSitemapEntries(): SitemapEntry[] {
  const published = mockWebtoons.filter((webtoon) => webtoon.status !== 'draft')
  const latestCatalogUpdate = published
    .map((webtoon) => toLastmodDate(webtoon.updatedAt))
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1)

  const entries: SitemapEntry[] = STATIC_PATHS.map((path) => ({
    path,
    lastmod: CATALOG_DRIVEN_PATHS.has(path) ? latestCatalogUpdate : undefined,
  }))

  for (const genre of mockGenres) {
    if (genre.slug === 'all') continue
    entries.push({ path: `/categories/${genre.slug}`, lastmod: latestCatalogUpdate })
  }

  for (const webtoon of published) {
    entries.push({
      path: `/webtoon/${webtoon.id}`,
      lastmod: toLastmodDate(webtoon.updatedAt),
      image: webtoon.coverImage ? `${SITE_URL}${webtoon.coverImage}` : undefined,
    })
  }

  for (const author of mockAuthors) {
    if (author.status !== 'active') continue
    if (!published.some((webtoon) => webtoon.author.id === author.id)) continue
    entries.push({ path: `/author/${author.id}` })
  }

  return entries
}

const escapeXml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

const alternateLinks = (path: string): string[] => {
  const enHref = escapeXml(`${SITE_URL}${localizePath(path, 'en')}`)
  const mmHref = escapeXml(`${SITE_URL}${localizePath(path, 'mm')}`)
  return [
    `    <xhtml:link rel="alternate" hreflang="en" href="${enHref}"/>`,
    `    <xhtml:link rel="alternate" hreflang="my" href="${mmHref}"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${enHref}"/>`,
  ]
}

export function buildSitemapXml(): string {
  const urls = buildSitemapEntries()
    .flatMap((entry) =>
      (['en', 'mm'] as const).map((locale) => {
        const parts = [
          `    <loc>${escapeXml(`${SITE_URL}${localizePath(entry.path, locale)}`)}</loc>`,
          ...alternateLinks(entry.path),
        ]
        if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`)
        if (entry.image) {
          parts.push(
            `    <image:image>\n      <image:loc>${escapeXml(entry.image)}</image:loc>\n    </image:image>`
          )
        }
        return `  <url>\n${parts.join('\n')}\n  </url>`
      })
    )
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    urls,
    '</urlset>',
    '',
  ].join('\n')
}
