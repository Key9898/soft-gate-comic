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
  jsonLd,
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Myanmar Webtoon Platform`
  const canonical =
    url || (typeof window !== 'undefined' ? window.location.href.split('?')[0] : SITE_URL)
  const payload = jsonLd ?? (type === 'website' ? buildWebsiteJsonLd() : undefined)
  const ogType = type === 'book' ? 'book' : type === 'article' ? 'article' : 'website'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {author && <meta name="author" content={author} />}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonical} />
      <meta name="theme-color" content="#0e9494" />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {payload && <script type="application/ld+json">{JSON.stringify(payload)}</script>}
    </Helmet>
  )
}

export default SEO
