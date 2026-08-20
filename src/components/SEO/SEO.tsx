import { Helmet } from 'react-helmet-async'
import { buildWebsiteJsonLd, DEFAULT_IMAGE, SITE_NAME, SITE_URL } from './jsonLd'

export type SeoType = 'website' | 'article' | 'book'

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  url?: string
  image?: string
  type?: SeoType
  author?: string
  noindex?: boolean
  omitJsonLd?: boolean
  omitCanonical?: boolean
  omitKeywords?: boolean
  omitSocial?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

const SEO = ({
  title,
  description = 'Discover, read, and enjoy amazing webtoons on SoftGate Comic.',
  keywords = 'webtoon, myanmar webtoon, softgate comic, comics',
  url,
  image = DEFAULT_IMAGE,
  type = 'website',
  author,
  noindex = false,
  omitJsonLd = false,
  omitCanonical = false,
  omitKeywords = false,
  omitSocial = false,
  jsonLd,
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Myanmar Webtoon Platform`
  const canonical =
    url || (typeof window !== 'undefined' ? window.location.href.split('?')[0] : SITE_URL)
  const payload = omitJsonLd
    ? undefined
    : (jsonLd ?? (type === 'website' ? buildWebsiteJsonLd() : undefined))
  const ogType = type === 'book' ? 'book' : type === 'article' ? 'article' : 'website'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {!omitKeywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      {!omitCanonical && <link rel="canonical" href={canonical} />}
      <meta name="theme-color" content="#0e9494" />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {!omitCanonical && <meta property="og:url" content={canonical} />}
      {!omitSocial && <meta property="og:image" content={image} />}
      <meta property="og:locale" content="en_US" />

      {!omitSocial && <meta name="twitter:card" content="summary_large_image" />}
      {!omitSocial && <meta name="twitter:title" content={fullTitle} />}
      {!omitSocial && <meta name="twitter:description" content={description} />}
      {!omitSocial && <meta name="twitter:image" content={image} />}

      {payload && <script type="application/ld+json">{JSON.stringify(payload)}</script>}
    </Helmet>
  )
}

export default SEO
