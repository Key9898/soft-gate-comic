import { useTranslation } from 'react-i18next'
import type { Episode } from '@softgate/shared'
import Button, { ButtonLink } from '../../../../components/Button'
import UpcomingDropMeta from '../../../../components/UpcomingDropMeta'

export type EndOfSeriesProps = {
  darkMode: boolean
  lang: 'mm' | 'en'
  nextDrop?: Episode
  now: number
  seriesHref: string
  isSubscribed: boolean
  onSubscribe: () => void
  nested: string
  muted: string
  onStop: (e: { stopPropagation: () => void }) => void
}

// The end of a series is the product's peak-end moment and it used to be a single line of pink
// text followed by a Report button. nextDropForSeries and UpcomingDropMeta already existed and
// were used on the hub.
const EndOfSeries = ({
  darkMode,
  lang,
  nextDrop,
  now,
  seriesHref,
  isSubscribed,
  onSubscribe,
  nested,
  muted,
  onStop,
}: EndOfSeriesProps) => {
  const { t } = useTranslation()

  return (
    <div
      data-testid="reader-end-of-series"
      className={`mt-6 w-full max-w-md rounded-2xl border p-4 text-left ${nested}`}
    >
      <p className="text-primary-500 text-sm font-bold">{t('readerPage.endOfSeries')}</p>
      {nextDrop ? (
        <div className="mt-3">
          <p className={`text-xs font-semibold uppercase tracking-wide ${muted}`}>
            {t('webtoonDetail.nextDrop')}
          </p>
          <UpcomingDropMeta
            className="mt-1"
            episode={nextDrop}
            now={now}
            lang={lang}
            tone={darkMode ? 'hero' : 'page'}
          />
        </div>
      ) : (
        <p className={`mt-2 text-sm ${muted}`}>{t('readerPage.endOfSeriesWait')}</p>
      )}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button size="sm" variant={isSubscribed ? 'surface' : 'primary'} onClick={onSubscribe}>
          {isSubscribed ? t('webtoonDetail.subscribed') : t('webtoonDetail.subscribe')}
        </Button>
        <ButtonLink size="sm" variant="surface" to={seriesHref} onClick={onStop}>
          {t('reader.backToWebtoon')}
        </ButtonLink>
      </div>
    </div>
  )
}

export default EndOfSeries
