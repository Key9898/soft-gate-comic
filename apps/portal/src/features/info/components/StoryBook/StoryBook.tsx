import { useCallback, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { StoryChapter } from '@softgate/shared'

export interface StoryBookProps {
  chapters: StoryChapter[]
}

const splitBody = (body: string) => body.split('\n\n').filter((part) => part.trim().length > 0)

const StoryBook = ({ chapters }: StoryBookProps) => {
  const { t, i18n } = useTranslation()
  const [index, setIndex] = useState(0)
  const lang = i18n.language === 'mm' ? 'mm' : 'en'
  const total = chapters.length

  const goTo = useCallback(
    (nextIndex: number) => {
      if (total === 0) return
      setIndex(Math.min(Math.max(nextIndex, 0), total - 1))
    },
    [total]
  )

  if (total === 0) return null

  const safeIndex = Math.min(index, total - 1)
  const chapter = chapters[safeIndex]
  if (!chapter) return null

  const isFirst = safeIndex === 0
  const isLast = safeIndex === total - 1
  const n = safeIndex + 1
  const title = chapter.title[lang]
  const paragraphs = splitBody(chapter.body[lang])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.target as Node)) return
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goTo(safeIndex + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goTo(safeIndex - 1)
    }
  }

  return (
    <div
      className="story-reader mt-8"
      tabIndex={0}
      aria-label={t('a11y.storyBook')}
      onKeyDown={handleKeyDown}
    >
      <aside className="story-reader-rail">
        <p className="story-reader-rail-label">{t('about.storyEpisodes')}</p>
        {chapters.map((item, itemIndex) => {
          const selected = itemIndex === safeIndex
          return (
            <button
              key={item.id}
              type="button"
              className="story-reader-ep"
              aria-current={selected ? true : undefined}
              onClick={() => goTo(itemIndex)}
            >
              <span className="story-reader-ep-index">
                {String(itemIndex + 1).padStart(2, '0')}
              </span>
              <span className="story-reader-ep-copy">
                <span className="story-reader-ep-title">{item.title[lang]}</span>
                {selected ? (
                  <span className="story-reader-ep-now">{t('about.storyNowReading')}</span>
                ) : null}
              </span>
            </button>
          )
        })}
      </aside>

      <div className="story-reader-pane">
        <div className="story-reader-toolbar">
          <p aria-live="polite">{t('about.storyChapterOf', { n, total })}</p>
          <button
            type="button"
            className="story-reader-turn-prev"
            disabled={isFirst}
            aria-label={t('a11y.storyPrevChapter')}
            onClick={() => goTo(safeIndex - 1)}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            className="story-reader-turn-next"
            disabled={isLast}
            aria-label={t('a11y.storyNextChapter')}
            onClick={() => goTo(safeIndex + 1)}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {chapter.coverImage ? (
          <img src={chapter.coverImage} alt="" className="story-reader-splash" draggable={false} />
        ) : null}

        <h3>{title}</h3>
        <div className="story-reader-ink">
          {paragraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StoryBook
