import type { Webtoon } from '@softgate/shared'
import { SITE_URL } from '../../components/SEO/jsonLd'

export function ogImageForWebtoon(webtoon: Webtoon): string | undefined {
  if (webtoon.coverImage?.startsWith('/webtoon-covers/')) {
    return `${SITE_URL}/og/${webtoon.id}.png`
  }
  return webtoon.coverImage ? `${SITE_URL}${webtoon.coverImage}` : undefined
}
