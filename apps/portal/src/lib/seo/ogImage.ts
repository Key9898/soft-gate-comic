import type { Webtoon } from '@softgate/shared'
import { SITE_URL } from '../../components/SEO/jsonLd'

/**
 * The single source of truth for which series get a composited OG image.
 *
 * `generate-og-images.ts` imports this rather than repeating the predicate. The
 * two used to be written separately — the page emitted `/og/{id}.png` for any
 * local cover while the generator also skipped drafts — so a draft series with
 * a local cover would have advertised an `og:image` that was never produced,
 * and every share of it would have resolved to a 404. Nothing would have said
 * so: the generator's skip is a console warning inside a build log.
 */
export function hasGeneratedOgImage(webtoon: Webtoon): boolean {
  return webtoon.status !== 'draft' && Boolean(webtoon.coverImage?.startsWith('/webtoon-covers/'))
}

export function ogImageForWebtoon(webtoon: Webtoon): string | undefined {
  if (hasGeneratedOgImage(webtoon)) {
    return `${SITE_URL}/og/${webtoon.id}.png`
  }
  return webtoon.coverImage ? `${SITE_URL}${webtoon.coverImage}` : undefined
}
