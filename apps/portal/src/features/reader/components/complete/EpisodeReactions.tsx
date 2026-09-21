import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  REACTIONS,
  reactionCount,
  readReaction,
  toggleReaction,
  type Reaction,
} from '../../../../lib/reader'

const LABEL_KEY: Record<Reaction, string> = {
  '😍': 'readerPage.reactionLove',
  '😭': 'readerPage.reactionSad',
  '😂': 'readerPage.reactionFunny',
  '😱': 'readerPage.reactionShock',
  '🔥': 'readerPage.reactionFire',
}

export type EpisodeReactionsProps = {
  webtoonId: string
  episodeNumber: number
  darkMode: boolean
  nested: string
}

const EpisodeReactions = ({
  webtoonId,
  episodeNumber,
  darkMode,
  nested,
}: EpisodeReactionsProps) => {
  const { t } = useTranslation()
  // Never seed from localStorage: the reader server-renders and the server has no store.
  const [picked, setPicked] = useState<Reaction | undefined>(undefined)

  useEffect(() => {
    setPicked(readReaction(webtoonId, episodeNumber))
  }, [webtoonId, episodeNumber])

  return (
    <div
      data-testid="reader-reactions"
      className={`mt-6 w-full max-w-md rounded-2xl border p-4 text-left ${nested}`}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {t('readerPage.reactions')}
      </p>
      <ul className="flex flex-wrap gap-2">
        {REACTIONS.map((reaction) => {
          const isPicked = picked === reaction
          return (
            <li key={reaction}>
              <button
                type="button"
                aria-pressed={isPicked}
                aria-label={t(LABEL_KEY[reaction])}
                onClick={() => setPicked(toggleReaction(webtoonId, episodeNumber, reaction))}
                className={`flex min-h-11 items-center gap-1.5 rounded-2xl border px-3 text-sm transition-colors ${
                  isPicked
                    ? 'border-primary-500 text-primary-600'
                    : darkMode
                      ? 'border-white/10 text-gray-300'
                      : 'border-gray-200 text-gray-700'
                }`}
              >
                <span aria-hidden="true">{reaction}</span>
                <span className="text-xs font-semibold tabular-nums">
                  {reactionCount(webtoonId, episodeNumber, reaction, isPicked)}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <span className="text-primary-500 mt-2 inline-block text-xs font-semibold">
        {t('common.demo')}
      </span>
    </div>
  )
}

export default EpisodeReactions
