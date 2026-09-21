import { Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Episode } from '@softgate/shared'
import Button from '../../../../components/Button'
import {
  episodeThumbSrc,
  formatWaitFreeAt,
  hasWaitSchedule,
  isWaitFreeNow,
} from '../../../../lib/catalog'

export type NextUpRowProps = {
  episode?: Episode
  episodeNumber: number
  locked: boolean
  seriesCover?: string
  lang: 'mm' | 'en'
  nested: string
  titleClass: string
  onNext: () => void
}

const NextUpRow = ({
  episode,
  episodeNumber,
  locked,
  seriesCover,
  lang,
  nested,
  titleClass,
  onNext,
}: NextUpRowProps) => {
  const { t } = useTranslation()
  const thumb = episode ? episodeThumbSrc(episode, seriesCover) : seriesCover
  const freeAt = episode?.freeAt
  const waiting = Boolean(episode && hasWaitSchedule(episode) && !isWaitFreeNow(episode) && freeAt)

  return (
    <div data-testid="reader-next-up" className="mt-6 w-full max-w-md">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {t('readerPage.nextChapter')}
      </p>
      <div className={`flex items-center justify-between gap-3 rounded-2xl border p-4 ${nested}`}>
        <div className="flex min-w-0 items-center gap-3">
          {thumb ? (
            <img
              src={thumb}
              alt=""
              loading="lazy"
              decoding="async"
              className="aspect-[202/142] h-14 w-auto shrink-0 rounded-2xl object-cover"
            />
          ) : null}
          <div className="min-w-0 text-left">
            <span className="text-primary-500 block text-xs font-semibold">
              {t('readerPage.episodeN', { n: episodeNumber })}
            </span>
            <span className={`block truncate text-sm font-semibold ${titleClass}`}>
              {episode ? episode.title[lang] : ''}
            </span>
            {locked ? (
              <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-gray-500">
                <Lock className="h-3 w-3" aria-hidden="true" />
                {t('readerPage.unlockFor', { coins: episode?.coinPrice ?? 0 })}
              </span>
            ) : null}
            {waiting && freeAt ? (
              <span className="mt-1 block text-xs text-gray-500">
                {t('readerPage.waitFreeWhen', { when: formatWaitFreeAt(freeAt) })}
              </span>
            ) : null}
          </div>
        </div>
        <Button size="sm" onClick={onNext}>
          {t('readerPage.nextEpisode')}
        </Button>
      </div>
    </div>
  )
}

export default NextUpRow
