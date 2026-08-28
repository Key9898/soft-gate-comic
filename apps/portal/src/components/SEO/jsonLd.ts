import type { ContentRating } from '@softgate/shared'
import { contentRatingSchemaText } from '../../lib/contentRating'

const SITE_NAME = 'SoftGate Comic'
const SITE_URL = 'https://softgatecomic.com'
const DEFAULT_IMAGE = `${SITE_URL}/logo/logo.png`

export function buildCanonical(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildOrganizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    legalName: 'SoftGate',
    url: SITE_URL,
    logo: DEFAULT_IMAGE,
    foundingDate: '2026',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Insein',
      addressRegion: 'Yangon',
      addressCountry: 'MM',
    },
  }
}

export function buildWebsiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildComicSeriesJsonLd(input: {
  title: string
  description: string
  url: string
  image?: string
  authorName?: string
  authorUrl?: string
  genres?: string[]
  inLanguage?: string[]
  rating?: number
  contentRating?: ContentRating
  datePublished?: string
  dateModified?: string
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ComicSeries',
    name: input.title,
    description: input.description,
    url: input.url,
    image: input.image || DEFAULT_IMAGE,
    genre: input.genres && input.genres.length > 0 ? input.genres : undefined,
    inLanguage: input.inLanguage,
    contentRating: input.contentRating ? contentRatingSchemaText(input.contentRating) : undefined,
    author: input.authorName
      ? { '@type': 'Person', name: input.authorName, url: input.authorUrl }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: DEFAULT_IMAGE,
    },
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    aggregateRating:
      typeof input.rating === 'number' && input.rating > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: input.rating,
            bestRating: 5,
          }
        : undefined,
  }
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildCanonical(item.path),
    })),
  }
}

export function buildPersonJsonLd(input: {
  name: string
  description?: string
  url: string
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    description: input.description,
    url: input.url,
  }
}

export function buildItemListJsonLd(input: {
  name: string
  url: string
  items: { name: string; url: string; position: number }[]
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: input.name,
    url: input.url,
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      url: item.url,
      name: item.name,
    })),
  }
}

export { SITE_NAME, SITE_URL, DEFAULT_IMAGE }
