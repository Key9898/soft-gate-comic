import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import RankMark from '../RankMark'

export type SkeletonTone = 'light' | 'dark'

const toneClasses: Record<SkeletonTone, string> = {
  light: 'bg-gray-200',
  dark: 'bg-white/10',
}

interface SkeletonProps {
  tone?: SkeletonTone
  className?: string
  children?: ReactNode
}

export const Skeleton = ({ tone = 'light', className = '', children }: SkeletonProps) => (
  <div aria-hidden="true" className={`animate-pulse rounded-2xl ${toneClasses[tone]} ${className}`}>
    {children}
  </div>
)

export const SkeletonText = ({ tone = 'light', className = 'w-full' }: SkeletonProps) => (
  <Skeleton tone={tone} className={`h-4 rounded-lg ${className}`} />
)

export const SkeletonBookCard = ({
  tone = 'light',
  rank,
}: {
  tone?: SkeletonTone
  rank?: number
}) => (
  <div className="flex flex-col gap-2">
    {typeof rank === 'number' ? (
      <Skeleton tone={tone} className="book-media aspect-[3/4] w-full">
        <RankMark rank={rank} />
      </Skeleton>
    ) : (
      <Skeleton tone={tone} className="book-media aspect-[3/4] w-full" />
    )}
    <SkeletonText tone={tone} className="w-3/4" />
    <SkeletonText tone={tone} className="h-3 w-full" />
    <SkeletonText tone={tone} className="h-3 w-5/6" />
    <SkeletonText tone={tone} className="h-3 w-1/2" />
    <SkeletonText tone={tone} className="h-3 w-2/3" />
  </div>
)

export const SkeletonDailyDropCard = ({ tone = 'light' }: { tone?: SkeletonTone }) => (
  <div className="flex flex-col" data-testid="home-daily-drop">
    <Skeleton tone={tone} className="book-media relative aspect-[3/4] w-full overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-12 rounded-none bg-black/25" />
      <div className="absolute inset-x-8 bottom-2.5 h-4 rounded-lg bg-white/25" />
    </Skeleton>
    <div className="mt-2.5 flex flex-col gap-1.5 px-0.5">
      <SkeletonText tone={tone} className="w-3/4" />
      <SkeletonText tone={tone} className="h-3 w-1/2" />
      <SkeletonText tone={tone} className="h-3 w-2/3" />
    </div>
  </div>
)

interface SkeletonSectionProps {
  children: ReactNode
  className?: string
}

export const SkeletonSection = ({ children, className = '' }: SkeletonSectionProps) => {
  const { t } = useTranslation()
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={t('a11y.loading')}
      className={`skeleton-appear ${className}`}
    >
      {children}
    </div>
  )
}
