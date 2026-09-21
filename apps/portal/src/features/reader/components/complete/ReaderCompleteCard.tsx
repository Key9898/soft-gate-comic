import { useTranslation } from 'react-i18next'
import type { Episode, Webtoon } from '@softgate/shared'
import type { StoredComment } from '../../../../lib/comments'
import { ButtonLink } from '../../../../components/Button'
import RatingControl from './RatingControl'
import EpisodeReactions from './EpisodeReactions'
import CompleteComments from './CompleteComments'
import CreatorNote from './CreatorNote'
import NextUpRow from './NextUpRow'
import EndOfSeries from './EndOfSeries'
import RelatedList from './RelatedList'
import GuestNudge from './GuestNudge'
import ReportControl from './ReportControl'

export type ReaderCompletePortalProps = {
  webtoonId: string
  episodeNumber: number
  darkMode: boolean
  lang: 'mm' | 'en'
  comments: StoredComment[]
  onOpenComments: () => void
  onAddComment: (content: string, spoiler: boolean) => void
  hasNext: boolean
  nextEpisode?: Episode
  nextEpisodeNumber: number
  nextEpisodeLocked: boolean
  seriesCover?: string
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
  episodeNumber,
  darkMode,
  lang,
  comments,
  onOpenComments,
  onAddComment,
  hasNext,
  nextEpisode,
  nextEpisodeNumber,
  nextEpisodeLocked,
  seriesCover,
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
    <div
      onClick={stop}
      data-testid="reader-complete-card"
      className={`mt-12 rounded-3xl border p-6 text-center sm:p-8 ${cardBg}`}
    >
      <h2 className="mb-6 text-xl font-bold tracking-tight sm:text-2xl">
        {t('readerPage.chapterComplete')}
      </h2>

      <RatingControl webtoonId={webtoonId} darkMode={darkMode} />

      <EpisodeReactions
        webtoonId={webtoonId}
        episodeNumber={episodeNumber}
        darkMode={darkMode}
        nested={nested}
      />

      {hasNext ? (
        <NextUpRow
          episode={nextEpisode}
          episodeNumber={nextEpisodeNumber}
          locked={nextEpisodeLocked}
          seriesCover={seriesCover}
          lang={lang}
          onNext={onNext}
          nested={nested}
          titleClass={titleClass}
        />
      ) : (
        <EndOfSeries
          darkMode={darkMode}
          lang={lang}
          nextDrop={nextDrop}
          now={now}
          isSubscribed={isSubscribed}
          onSubscribe={onSubscribe}
          nested={nested}
          muted={muted}
        />
      )}

      <CreatorNote nested={nested} muted={muted} />

      <CompleteComments
        comments={comments}
        onOpen={onOpenComments}
        onAdd={onAddComment}
        isAuthenticated={isAuthenticated}
        darkMode={darkMode}
        nested={nested}
      />

      {related.length > 0 ? (
        <div className="mt-6 w-full max-w-md text-left">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {t('webtoonDetail.youMayAlsoLike')}
          </p>
          <RelatedList related={related} lang={lang} nested={nested} titleClass={titleClass} />
        </div>
      ) : null}

      {!isAuthenticated ? (
        <GuestNudge
          darkMode={darkMode}
          fromPath={fromPath}
          onGuestRegister={onGuestRegister}
          nested={nested}
        />
      ) : null}

      <div className="mt-6 flex w-full max-w-md flex-col items-center gap-2">
        <ButtonLink size="sm" variant="surface" to={seriesHref} onClick={stop}>
          {t('reader.backToWebtoon')}
        </ButtonLink>
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
