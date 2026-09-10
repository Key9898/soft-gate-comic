import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, type MotionProps } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { Genre, Webtoon } from '@softgate/shared'
import { CatalogBookCard } from '../../../components/BookCard'
import CatalogEmptyPanel from '../../../components/CatalogEmptyPanel'

export interface HomeCatalogRailProps {
  id?: string
  eyebrow?: string
  title: string
  description?: string
  icon?: ReactNode
  viewAllTo?: string
  onViewAll?: () => void
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
  sectionClassName?: string
  dateKind?: 'createdAt' | 'updatedAt'
  cardTo?: (webtoon: Webtoon) => string
  unavailable?: boolean
}

const HomeCatalogRail = ({
  id,
  eyebrow,
  title,
  description,
  icon,
  viewAllTo,
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
  sectionClassName = 'py-8 sm:py-10',
  dateKind = 'createdAt',
  cardTo = (webtoon) => `/webtoon/${webtoon.id}`,
  unavailable = false,
}: HomeCatalogRailProps) => {
  const { t } = useTranslation()
  const empty = webtoons.length === 0

  return (
    <section id={id} className={sectionClassName}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-primary-700 mb-1 text-xs font-semibold tracking-wide uppercase">
                {eyebrow}
              </p>
            ) : null}
            <div className="flex items-center gap-2">
              {icon}
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
            </div>
            {description ? (
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">{description}</p>
            ) : null}
          </div>
          {!empty && onViewAll ? (
            <button
              type="button"
              onClick={onViewAll}
              className="text-primary-600 hover:text-primary-700 focus:ring-primary-500 flex min-h-[44px] shrink-0 items-center gap-1 rounded-2xl px-3 py-2 font-medium transition focus:ring-2 focus:outline-none"
            >
              {t('common.viewAll')}
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : !empty && viewAllTo ? (
            <Link
              to={viewAllTo}
              className="text-primary-600 hover:text-primary-700 focus:ring-primary-500 flex min-h-[44px] shrink-0 items-center gap-1 rounded-2xl px-3 py-2 font-medium transition focus:ring-2 focus:outline-none"
            >
              {t('common.viewAll')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
        {empty ? (
          <CatalogEmptyPanel title={null} showActions={false} unavailable={unavailable} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {webtoons.map((webtoon, index) => (
              <motion.div
                key={webtoon.id}
                {...getAnimationProps(
                  { opacity: 0, y: 20 },
                  { opacity: 1, y: 0 },
                  { duration: 0.3, delay: index * 0.05 }
                )}
              >
                <Link
                  to={cardTo(webtoon)}
                  className="focus:ring-primary-500 block rounded-[3px] focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                  <CatalogBookCard
                    webtoon={webtoon}
                    lang={lang}
                    genres={genres}
                    newestIds={newestIds}
                    dateKind={dateKind}
                    imageLoaded={loadedImages.has(webtoon.id)}
                    imageFailed={failedImages.has(webtoon.id)}
                    onImageLoad={() => onImageLoad(webtoon.id)}
                    onImageError={() => onImageError(webtoon.id)}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default HomeCatalogRail
