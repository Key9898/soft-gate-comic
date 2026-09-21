import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * Synopsis, tags, dates and the secondary read CTA.
 *
 * The design keeps this block inside the dark series header on desktop and moves it
 * into the light body on mobile, where the header is capped near 400px (issue #38).
 * Rather than branch on a media query at runtime — which would mismatch during SSR
 * hydration — the page renders one copy per breakpoint and hides the other with
 * `display: none`, so only one reaches the accessibility tree.
 */

/** Below this length the description already fits the clamp, so no toggle is shown. */
const READ_MORE_THRESHOLD = 120

export type SeriesOverviewTone = 'hero' | 'body'

export interface SeriesOverviewProps {
  description: string
  tags: readonly string[]
  publishedOn: string
  updatedOn: string
  /** Omitted when the latest episode is already the primary read target. */
  latestEpisodeHref?: string
  tone: SeriesOverviewTone
  className?: string
  testId: string
}

const TONE_STYLES: Record<
  SeriesOverviewTone,
  { body: string; tag: string; meta: string; link: string }
> = {
  hero: {
    body: 'text-white/70',
    tag: 'bg-white/5 text-white/80 ring-white/10 hover:bg-white/15 focus-visible:ring-white',
    meta: 'text-white/50',
    link: 'text-primary-300 hover:text-primary-200 focus-visible:ring-white',
  },
  body: {
    body: 'text-gray-600',
    tag: 'bg-gray-50 text-gray-700 ring-gray-200 hover:bg-gray-100 focus-visible:ring-primary-500',
    meta: 'text-gray-500',
    link: 'text-primary-600 hover:text-primary-700 focus-visible:ring-primary-500',
  },
}

const SeriesOverview = ({
  description,
  tags,
  publishedOn,
  updatedOn,
  latestEpisodeHref,
  tone,
  className = '',
  testId,
}: SeriesOverviewProps) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const styles = TONE_STYLES[tone]

  return (
    <div data-testid={testId} className={`flex flex-col gap-4 ${className}`}>
      {/* Tags lead on desktop, the synopsis leads on mobile — see the design frames. */}
      {tags.length > 0 ? (
        <ul className="order-2 flex flex-wrap items-center justify-center gap-2 md:order-1 md:justify-start">
          {tags.map((tag) => (
            <li key={tag}>
              <Link
                to={`/search?q=${encodeURIComponent(tag)}`}
                className={`inline-flex min-h-11 items-center rounded-2xl px-3 py-1 text-xs font-medium ring-1 transition focus:outline-none focus-visible:ring-2 ${styles.tag}`}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="order-1 max-w-2xl md:order-2">
        <p className={`leading-relaxed ${styles.body} ${isExpanded ? '' : 'line-clamp-3'}`}>
          {description}
        </p>
        {description.length > READ_MORE_THRESHOLD ? (
          <button
            type="button"
            onClick={() => setIsExpanded((expanded) => !expanded)}
            aria-expanded={isExpanded}
            className={`mt-1 rounded-2xl text-sm font-medium transition focus:outline-none focus-visible:ring-2 ${styles.link}`}
          >
            {isExpanded ? t('webtoonDetail.readLess') : t('webtoonDetail.readMore')}
          </button>
        ) : null}
      </div>

      <p className={`order-3 text-xs font-medium ${styles.meta}`}>
        {t('webtoonDetail.published')} {publishedOn}
        <span aria-hidden="true"> · </span>
        {t('webtoonDetail.updated')} {updatedOn}
      </p>

      {latestEpisodeHref ? (
        <p className="order-4">
          <Link
            to={latestEpisodeHref}
            className={`inline-flex min-h-11 items-center rounded-2xl text-sm font-semibold transition focus:outline-none focus-visible:ring-2 ${styles.link}`}
          >
            {t('webtoonDetail.latestEpisode')}
          </Link>
        </p>
      ) : null}
    </div>
  )
}

export default SeriesOverview
