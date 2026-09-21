import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Episode, Webtoon } from '@softgate/shared'
import Button from '../../../../components/Button'
import { SeriesRatingControl } from '../../../../components/SeriesRating'
import CommentsTeaser from '../../../../components/Comments/CommentsTeaser'
import type { StoredComment } from '../../../../lib/comments'
import EndOfSeries from './EndOfSeries'
import ReportControl from './ReportControl'
import RelatedList from './RelatedList'

export type ReaderCompletePortalProps = {
  webtoonId: string
  darkMode: boolean
  lang: 'mm' | 'en'
  comments: StoredComment[]
  onOpenComments: () => void
  hasNext: boolean
  nextEpisode?: Episode
  nextEpisodeNumber: number
  onNext: () => void
  isAuthenticated: boolean
  fromPath: string
  onGuestRegister: () => void
  related: Webtoon[]
  /** The next scheduled episode, when the series has one. */
  nextDrop?: Episode
  now: number
  seriesHref: string
  isSubscribed: boolean
  onSubscribe: () => void
  reported: boolean
  reportConfirm: boolean
  onAskReport: () => void
  onCancelReport: () => void
  onConfirmReport: () => void
}

const stop = (e: { stopPropagation: () => void }) => {
  e.stopPropagation()
}

const ReaderCompleteCard = ({
  webtoonId,
  darkMode,
  lang,
  comments,
  onOpenComments,
  hasNext,
  nextEpisode,
  nextEpisodeNumber,
  onNext,
  isAuthenticated,
  fromPath,
  onGuestRegister,
  related,
  nextDrop,
  now,
  seriesHref,
  isSubscribed,
  onSubscribe,
  reported,
  reportConfirm,
  onAskReport,
  onCancelReport,
  onConfirmReport,
}: ReaderCompletePortalProps) => {
  const { t } = useTranslation()
  const cardBg = darkMode ? 'bg-gray-900/60 border-white/5' : 'bg-white/80 border-gray-200'
  const muted = darkMode ? 'text-gray-400' : 'text-gray-600'
  const nested = darkMode ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'
  const titleClass = darkMode ? 'text-gray-100' : 'text-gray-900'

  return (
    <div onClick={stop} className={`mt-12 rounded-3xl border p-6 text-center sm:p-8 ${cardBg}`}>
      <h2 className="mb-6 text-xl font-bold tracking-tight sm:text-2xl">
        {t('readerPage.chapterComplete')}
      </h2>

      <div className="mb-6 w-full max-w-md">
        <SeriesRatingControl webtoonId={webtoonId} variant="card" darkMode={darkMode} />
      </div>

      <CommentsTeaser comments={comments} onOpen={onOpenComments} darkMode={darkMode} />

      <div className={`mt-6 w-full max-w-md rounded-2xl border p-4 text-left ${nested}`}>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {t('readerPage.creatorNote')}
        </p>
        <p className={`text-sm ${muted}`}>{t('readerPage.creatorNoteBody')}</p>
        <span className="text-primary-500 mt-2 inline-block text-xs font-semibold">
          {t('common.demo')}
        </span>
      </div>

      {hasNext ? (
        <div className="mt-6 w-full max-w-md">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {t('readerPage.nextChapter')}
          </p>
          <div className={`flex items-center justify-between rounded-2xl border p-4 ${nested}`}>
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 flex h-12 w-12 items-center justify-center rounded-2xl font-semibold text-white">
                {nextEpisodeNumber}
              </div>
              <div className="text-left">
                <span className="text-primary-500 block text-xs font-semibold">
                  {t('readerPage.episodeN', { n: nextEpisodeNumber })}
                </span>
                <span className={`block max-w-[180px] truncate text-sm font-bold ${titleClass}`}>
                  {nextEpisode ? nextEpisode.title[lang] : ''}
                </span>
              </div>
            </div>
            <Button size="sm" onClick={onNext}>
              {t('readerPage.nextEpisode')}
            </Button>
          </div>
        </div>
      ) : (
        <EndOfSeries
          darkMode={darkMode}
          lang={lang}
          nextDrop={nextDrop}
          now={now}
          seriesHref={seriesHref}
          isSubscribed={isSubscribed}
          onSubscribe={onSubscribe}
          nested={nested}
          muted={muted}
          onStop={stop}
        />
      )}

      {!hasNext && related.length > 0 ? (
        <div className="mt-6 w-full max-w-md text-left">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {t('webtoonDetail.youMayAlsoLike')}
          </p>
          <RelatedList related={related} lang={lang} nested={nested} titleClass={titleClass} />
        </div>
      ) : null}

      {!isAuthenticated ? (
        <div className={`mt-6 w-full max-w-md rounded-2xl border p-4 ${nested}`}>
          <p
            className={`mb-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            {t('readerPage.guestNudge')}
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <Button size="sm" onClick={onGuestRegister}>
              {t('readerPage.createFreeAccount')}
            </Button>
            <Link
              to="/login"
              state={{ from: { pathname: fromPath } }}
              className="text-primary-500 hover:text-primary-400 focus-visible:ring-primary-500 flex min-h-11 items-center rounded-2xl px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2"
            >
              {t('nav.login')}
            </Link>
          </div>
        </div>
      ) : null}

      <div className="mt-6 w-full max-w-md">
        <ReportControl
          reported={reported}
          reportConfirm={reportConfirm}
          onAskReport={onAskReport}
          onCancelReport={onCancelReport}
          onConfirmReport={onConfirmReport}
          nested={nested}
          muted={muted}
        />
      </div>
    </div>
  )
}

export default ReaderCompleteCard
