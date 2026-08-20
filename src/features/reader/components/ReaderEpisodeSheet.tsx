import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock } from 'lucide-react'
import type { Episode } from '@softgate/shared'
import Modal from '../../../components/Modal'
import { episodeThumbSrc } from '../../../lib/catalog'

type ReaderEpisodeSheetProps = {
  isOpen: boolean
  onClose: () => void
  episodes: Episode[]
  currentEpisodeNumber: number
  seriesCover?: string
  seriesHref: string
  lang: 'mm' | 'en'
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
  onSelect,
  isLocked,
}: ReaderEpisodeSheetProps) => {
  const { t } = useTranslation()
  const ordered = [...episodes].sort((a, b) => a.episodeNumber - b.episodeNumber)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('readerPage.episodeList')} size="lg">
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
                  current ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
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
                  <span className="block text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    {t('readerPage.episodeN', { n: episode.episodeNumber })}
                  </span>
                  <span className="block truncate text-sm font-bold text-gray-900">
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
    </Modal>
  )
}

export default ReaderEpisodeSheet
