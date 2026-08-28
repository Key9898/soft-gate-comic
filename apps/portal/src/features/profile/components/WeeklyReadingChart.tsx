import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { HistoryRecord } from '../../../lib/engagement'

interface WeeklyReadingChartProps {
  history?: HistoryRecord[]
  demoLabel?: string
}

export const WeeklyReadingChart = ({ history = [], demoLabel }: WeeklyReadingChartProps) => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const data = useMemo(() => {
    const weekdayFormatter = new Intl.DateTimeFormat(lang === 'mm' ? 'my-MM' : 'en-US', {
      weekday: 'short',
      timeZone: 'UTC',
    })
    // 2021-08-01 (UTC) is a Sunday, so index 0..6 maps to Sun..Sat
    const dayName = (dayIndex: number) =>
      weekdayFormatter.format(new Date(Date.UTC(2021, 7, 1 + dayIndex)))
    const counts = Array.from({ length: 7 }, () => 0)
    const now = new Date()
    for (const record of history) {
      const d = new Date(record.lastReadAt)
      const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays >= 0 && diffDays < 7) {
        counts[d.getDay()] += record.readEpisodeNumbers?.length ?? 1
      }
    }
    return [1, 2, 3, 4, 5, 6, 0].map((dayIndex) => ({
      day: dayName(dayIndex),
      count: counts[dayIndex],
    }))
  }, [history, lang])

  const maxCount = Math.max(5, ...data.map((d) => d.count))
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 text-left shadow-sm">
      <h4 className="mb-5 flex items-center gap-2 text-sm font-bold tracking-wider text-gray-400 uppercase">
        <TrendingUp className="text-primary-500 h-4.5 w-4.5" aria-hidden="true" />
        {t('profilePage.weeklyActivity')}
        {demoLabel ? (
          <span className="text-2xs rounded-2xl bg-gray-100 px-2 py-0.5 font-bold text-gray-500">
            {demoLabel}
          </span>
        ) : null}
      </h4>

      <div className="relative flex h-52 items-end justify-between gap-2.5 px-3 pt-6 pb-2.5">
        <div className="pointer-events-none absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-full border-t border-dashed border-gray-100" />
          ))}
        </div>

        {data.map((d, index) => {
          const heightPercent = Math.max(4, (d.count / maxCount) * 100)
          const isHovered = hoveredIndex === index
          return (
            <div
              key={d.day}
              className="group relative flex flex-1 cursor-pointer flex-col items-center"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: -35, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="text-2xs absolute top-0 z-30 rounded-2xl bg-gray-950 px-2.5 py-1.5 font-bold whitespace-nowrap text-white shadow-lg"
                  >
                    {t('profilePage.episodesUnit', { count: d.count })}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative flex h-36 w-7 items-end sm:w-8.5">
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20, delay: index * 0.08 }}
                  className="from-primary-600 to-primary-400 w-full origin-bottom rounded-t-3xl bg-gradient-to-t shadow-md transition-all group-hover:brightness-110"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              <span className="text-2xs mt-2 font-bold text-gray-400 uppercase">{d.day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WeeklyReadingChart
