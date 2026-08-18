import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export type SkeletonTone = 'light' | 'dark'

const toneClasses: Record<SkeletonTone, string> = {
  light: 'bg-gray-200',
  dark: 'bg-white/10',
}

interface SkeletonProps {
  tone?: SkeletonTone
  className?: string
}

export const Skeleton = ({ tone = 'light', className = '' }: SkeletonProps) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-2xl ${toneClasses[tone]} ${className}`}
  />
)

export const SkeletonText = ({ tone = 'light', className = 'w-full' }: SkeletonProps) => (
  <Skeleton tone={tone} className={`h-4 rounded-lg ${className}`} />
)

export const SkeletonBookCard = ({ tone = 'light' }: { tone?: SkeletonTone }) => (
  <div className="flex flex-col gap-2">
    <Skeleton tone={tone} className="book-media aspect-[3/4] w-full" />
    <SkeletonText tone={tone} className="w-3/4" />
    <SkeletonText tone={tone} className="h-3 w-full" />
    <SkeletonText tone={tone} className="h-3 w-5/6" />
    <SkeletonText tone={tone} className="h-3 w-1/2" />
    <SkeletonText tone={tone} className="h-3 w-2/3" />
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
