import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, type MotionProps } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import type { Episode, UploadDay, Webtoon } from '@softgate/shared'
import { dailyDrops, todayWeekday, UPLOAD_DAY_ORDER } from '../../../lib/catalog'
import DailyDropCard from './DailyDropCard'

const WEEKDAY_KEYS = [
  'home.weekdaySun',
  'home.weekdayMon',
  'home.weekdayTue',
  'home.weekdayWed',
  'home.weekdayThu',
  'home.weekdayFri',
  'home.weekdaySat',
] as const

interface HomeDailyBoardProps {
  webtoons: Webtoon[]
  episodes: Episode[]
  lang: 'mm' | 'en'
  loadedImages: Set<string>
  failedImages: Set<string>
  onImageLoad: (id: string) => void
  onImageError: (id: string) => void
  getAnimationProps: (
    initial: MotionProps['initial'],
    animate: MotionProps['animate'],
    transition: MotionProps['transition']
  ) => MotionProps
}

const HomeDailyBoard = ({
  webtoons,
  episodes,
  lang,
  loadedImages,
  failedImages,
  onImageLoad,
  onImageError,
  getAnimationProps,
}: HomeDailyBoardProps) => {
  const { t } = useTranslation()
  const [day, setDay] = useState<UploadDay>(() => todayWeekday())
  const [now, setNow] = useState(() => Date.now())
  const list = useMemo(() => dailyDrops(webtoons, episodes, day), [webtoons, episodes, day])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section id="home-daily" className="bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 min-w-0">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-primary-600 h-5 w-5 shrink-0" aria-hidden="true" />
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{t('home.daily')}</h2>
          </div>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">{t('home.dailyDesc')}</p>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {UPLOAD_DAY_ORDER.map((value) => {
            const selected = value === day
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => setDay(value)}
                className={`focus:ring-primary-500 inline-flex min-h-11 items-center rounded-2xl px-4 py-2 text-sm font-medium transition focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                  selected
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t(WEEKDAY_KEYS[value])}
              </button>
            )
          })}
        </div>
        {list.length > 0 ? (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {list.map((drop, index) => (
              <motion.li
                key={`${drop.webtoon.id}-${drop.episode.id}`}
                className="list-none"
                {...getAnimationProps(
                  { opacity: 0, y: 20 },
                  { opacity: 1, y: 0 },
                  { duration: 0.3, delay: index * 0.05 }
                )}
              >
                <DailyDropCard
                  webtoon={drop.webtoon}
                  episode={drop.episode}
                  lang={lang}
                  now={now}
                  imageLoaded={loadedImages.has(`daily-${drop.webtoon.id}`)}
                  imageFailed={failedImages.has(`daily-${drop.webtoon.id}`)}
                  onImageLoad={() => onImageLoad(`daily-${drop.webtoon.id}`)}
                  onImageError={() => onImageError(`daily-${drop.webtoon.id}`)}
                />
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">{t('home.dailyEmpty')}</p>
        )}
      </div>
    </section>
  )
}

export default HomeDailyBoard
