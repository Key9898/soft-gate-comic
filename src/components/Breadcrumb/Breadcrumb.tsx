import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

const Breadcrumb = ({ items, className = '' }: BreadcrumbProps) => {
  const { t } = useTranslation()

  if (items.length === 0) return null

  return (
    <nav aria-label={t('a11y.breadcrumb')} className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm font-medium text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" aria-hidden />
              )}
              {isLast ? (
                <span aria-current="page" className="text-gray-900">
                  {item.label}
                </span>
              ) : item.to ? (
                <Link
                  to={item.to}
                  className="hover:text-primary-600 focus:ring-primary-500 rounded-2xl px-1 py-0.5 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="px-1 py-0.5">{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
