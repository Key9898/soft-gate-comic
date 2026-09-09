import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock } from 'lucide-react'
import type { Episode } from '@softgate/shared'
import { episodeThumbSrc } from '../../../lib/catalog'
import ReaderSheet from './ReaderSheet'

type ReaderEpisodeSheetProps = {
  isOpen: boolean
  onClose: () => void
  episodes: Episode[]
  currentEpisodeNumber: number
  seriesCover?: string
  seriesHref: string
  lang: 'mm' | 'en'
  darkMode?: boolean
  onSelect: (episodeNumber: number) => void
  isLocked?: (episode: Episode) => boolean
}

const ReaderEpisodeSheet = ({
  isOpen,
  onClose,
  episodes,
  currentEpisodeNumber,
  seriesCover,
  seriesHref,
  lang,
  darkMode = false,
  onSelect,
  isLocked,
}: ReaderEpisodeSheetProps) => {
  const { t } = useTranslation()
  const ordered = [...episodes].sort((a, b) => a.episodeNumber - b.episodeNumber)
  const first = ordered[0]
  const last = ordered[ordered.length - 1]
  const muted = darkMode ? 'text-gray-400' : 'text-gray-500'
  const titleClass = darkMode ? 'text-gray-100' : 'text-gray-900'
  const idleRow = darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-50'
  const currentRow = darkMode
    ? 'bg-primary-600/15 text-primary-300'
    : 'bg-primary-50 text-primary-700'
  const jumpBtn = darkMode
    ? 'border-white/10 bg-white/5 hover:border-white/20'
    : 'border-gray-200 bg-gray-50 hover:border-gray-300'

  return (
    <ReaderSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t('readerPage.episodeList')}
      darkMode={darkMode}
    >
      {first && last ? (
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            disabled={currentEpisodeNumber === first.episodeNumber}
            onClick={() => {
              onSelect(first.episodeNumber)
              onClose()
            }}
            className={`flex min-h-11 flex-1 items-center justify-center rounded-2xl border px-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${jumpBtn}`}
          >
            {t('readerPage.firstEpisode')}
          </button>
          <button
            type="button"
            disabled={currentEpisodeNumber === last.episodeNumber}
            onClick={() => {
              onSelect(last.episodeNumber)
              onClose()
            }}
            className={`flex min-h-11 flex-1 items-center justify-center rounded-2xl border px-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${jumpBtn}`}
          >
            {t('readerPage.lastEpisode')}
          </button>
        </div>
      ) : null}
      <ul className="space-y-2">
        {ordered.map((episode) => {
          const current = episode.episodeNumber === currentEpisodeNumber
          const thumb = episodeThumbSrc(episode, seriesCover)
          const locked = isLocked?.(episode) ?? false
          return (
            <li key={episode.id}>
              <button
                type="button"
                aria-current={current ? 'true' : undefined}
                onClick={() => {
                  onSelect(episode.episodeNumber)
                  onClose()
                }}
                className={`flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition ${
                  current ? currentRow : idleRow
                }`}
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt=""
                    className="aspect-[202/142] h-14 w-auto shrink-0 rounded-2xl object-cover"
                  />
                ) : null}
                <span className="min-w-0 flex-1">
                  <span className={`block text-xs font-semibold tracking-wider uppercase ${muted}`}>
                    {t('readerPage.episodeN', { n: episode.episodeNumber })}
                  </span>
                  <span className={`block truncate text-sm font-bold ${titleClass}`}>
                    {episode.title[lang]}
                  </span>
                </span>
                {locked ? (
                  <Lock className="text-accent-500 h-4 w-4 shrink-0" aria-hidden="true" />
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
      <Link
        to={seriesHref}
        className="text-primary-600 mt-6 inline-flex min-h-11 items-center text-sm font-semibold"
      >
        {t('reader.backToWebtoon')}
      </Link>
    </ReaderSheet>
  )
}

export default ReaderEpisodeSheet
