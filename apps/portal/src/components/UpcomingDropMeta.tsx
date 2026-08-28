import type { Episode } from '@softgate/shared'
import { useTranslation } from 'react-i18next'
import { dropRemainingMs, formatDropAtYangon, formatDropCountdown } from '../lib/catalog'

interface UpcomingDropMetaProps {
  episode: Episode
  now: number
  lang: 'mm' | 'en'
  showTitle?: boolean
  showCountdown?: boolean
  tone?: 'page' | 'hero'
  className?: string
}

const UpcomingDropMeta = ({
  episode,
  now,
  lang,
  showTitle = true,
  showCountdown = true,
  tone = 'page',
  className = '',
}: UpcomingDropMetaProps) => {
  const { t } = useTranslation()
  const remaining = dropRemainingMs(episode.scheduledAt ?? '', now)
  const countdown = remaining > 0 ? formatDropCountdown(remaining) : t('home.dailyPublishingSoon')
  const countdownClass = tone === 'hero' ? 'text-primary-200' : 'text-primary-700'
  const episodeClass = tone === 'hero' ? 'text-white/90' : 'text-gray-700'
  const whenClass = tone === 'hero' ? 'text-white/60' : 'text-gray-500'

  return (
    <div className={className}>
      {showCountdown ? (
        <p className={`text-sm font-semibold tabular-nums ${countdownClass}`}>{countdown}</p>
      ) : null}
      <p className={`text-xs font-medium ${showCountdown ? 'mt-0.5' : ''} ${episodeClass}`}>
        {t('home.dailyEpisode', { n: episode.episodeNumber })}
        {showTitle ? ` · ${episode.title[lang]}` : null}
      </p>
      {episode.scheduledAt ? (
        <p className={`mt-0.5 text-xs ${whenClass}`}>{formatDropAtYangon(episode.scheduledAt)}</p>
      ) : null}
    </div>
  )
}

export default UpcomingDropMeta
