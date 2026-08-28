import type { ReactNode } from 'react'

export type PageHeaderVariant = 'masthead' | 'compact' | 'document'

export interface PageHeaderProps {
  eyebrow?: string
  title: string
  deck?: string
  meta?: string
  children?: ReactNode
  variant?: PageHeaderVariant
  className?: string
}

const PageHeader = ({
  eyebrow,
  title,
  deck,
  meta,
  children,
  variant = 'compact',
  className = '',
}: PageHeaderProps) => {
  const isMasthead = variant === 'masthead'
  const isDocument = variant === 'document'

  return (
    <header
      className={`${isMasthead ? 'pt-6 pb-12 sm:pt-8 sm:pb-16' : isDocument ? 'pb-6' : 'pt-2 pb-6'} ${className}`}
    >
      {eyebrow ? (
        <p className="text-primary-500 text-xs font-bold tracking-widest uppercase">{eyebrow}</p>
      ) : null}

      <h1
        className={`${eyebrow ? 'mt-2.5' : ''} font-bold tracking-tight text-gray-900 ${
          isMasthead
            ? 'text-3xl sm:text-5xl'
            : isDocument
              ? 'text-2xl sm:text-3xl'
              : 'text-2xl sm:text-3xl'
        }`}
      >
        {title}
      </h1>

      {meta ? (
        <p
          className={`text-2xs font-bold tracking-wider text-gray-400 uppercase ${
            isDocument ? 'mt-2' : 'mt-1.5'
          }`}
        >
          {meta}
        </p>
      ) : null}

      {deck ? (
        <p
          className={`max-w-3xl leading-relaxed text-gray-600 ${
            isMasthead
              ? 'border-primary-500 mt-6 border-l-4 pl-6 text-lg font-bold sm:text-xl'
              : 'mt-3 text-sm font-semibold sm:text-base'
          }`}
        >
          {deck}
        </p>
      ) : null}

      {children ? <div className="mt-5">{children}</div> : null}
    </header>
  )
}

export default PageHeader
