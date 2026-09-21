import { useTranslation } from 'react-i18next'
import type { Episode } from '@softgate/shared'
import Button from '../../../../components/Button'

export type NextEpisodeBlockProps = {
  nextEpisode?: Episode
  nextEpisodeNumber: number
  lang: 'mm' | 'en'
  onNext: () => void
  nested: string
  titleClass: string
}

const NextEpisodeBlock = ({
  nextEpisode,
  nextEpisodeNumber,
  lang,
  onNext,
  nested,
  titleClass,
}: NextEpisodeBlockProps) => {
  const { t } = useTranslation()

  return (
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
  )
}

export default NextEpisodeBlock
