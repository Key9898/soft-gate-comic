import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, type MotionProps } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { Genre, Webtoon } from '@softgate/shared'
import { CatalogBookCard } from '../../../components/BookCard'
import CatalogEmptyPanel from '../../../components/CatalogEmptyPanel'

export interface HomeRankingChartProps {
  id?: string
  eyebrow?: string
  title: string
  description?: string
  onViewAll: () => void
  webtoons: Webtoon[]
  lang: 'mm' | 'en'
  genres: Genre[]
  newestIds: Set<string>
  loadedImages: Set<string>
  failedImages: Set<string>
  onImageLoad: (id: string) => void
  onImageError: (id: string) => void
  getAnimationProps: (
    initial: MotionProps['initial'],
    animate: MotionProps['animate'],
    transition: MotionProps['transition']
  ) => MotionProps
  unavailable?: boolean
}

const HomeRankingChart = ({
  id,
  eyebrow,
  title,
  description,
  onViewAll,
  webtoons,
  lang,
  genres,
  newestIds,
  loadedImages,
  failedImages,
  onImageLoad,
  onImageError,
  getAnimationProps,
  unavailable = false,
}: HomeRankingChartProps) => {
  const { t } = useTranslation()
  const empty = webtoons.length === 0

  return (
    <section id={id} className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-primary-700 mb-1 text-xs font-semibold tracking-wide uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
            {description ? (
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">{description}</p>
            ) : null}
          </div>
          {empty ? null : (
            <button
              type="button"
              onClick={onViewAll}
              className="text-primary-600 hover:text-primary-700 focus:ring-primary-500 flex min-h-[44px] shrink-0 items-center gap-1 rounded-2xl px-3 py-2 font-medium transition focus:ring-2 focus:outline-none"
            >
              {t('common.viewAll')}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
        {empty ? (
          <CatalogEmptyPanel title={null} showActions={false} unavailable={unavailable} />
        ) : (
          <ol className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {webtoons.map((webtoon, index) => {
              const rank = index + 1
              return (
                <motion.li
                  key={webtoon.id}
                  {...getAnimationProps(
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0 },
                    { duration: 0.3, delay: index * 0.05 }
                  )}
                >
                  <Link
                    to={`/webtoon/${webtoon.id}`}
                    className="focus:ring-primary-500 block rounded-[3px] focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    aria-label={`${rank}. ${webtoon.title[lang]}`}
                  >
                    <CatalogBookCard
                      webtoon={webtoon}
                      lang={lang}
                      genres={genres}
                      newestIds={newestIds}
                      rank={rank}
                      imageLoaded={loadedImages.has(webtoon.id)}
                      imageFailed={failedImages.has(webtoon.id)}
                      onImageLoad={() => onImageLoad(webtoon.id)}
                      onImageError={() => onImageError(webtoon.id)}
                    />
                  </Link>
                </motion.li>
              )
            })}
          </ol>
        )}
      </div>
    </section>
  )
}

export default HomeRankingChart
