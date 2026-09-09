import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export interface CatalogEmptyPanelProps {
  title?: string | null
  description?: string | null
  showActions?: boolean
  unavailable?: boolean
}

const CatalogEmptyPanel = ({
  title,
  description,
  showActions = false,
  unavailable = false,
}: CatalogEmptyPanelProps) => {
  const { t } = useTranslation()
  const heading = unavailable ? null : title === undefined ? t('home.emptyTitle') : title
  const deck = unavailable
    ? t('errors.catalogUnavailable')
    : description === undefined
      ? t('home.emptyDesc')
      : description
  const actions = unavailable ? false : showActions

  return (
    <div className="rounded-3xl border border-gray-200 bg-white px-6 py-10 text-center sm:px-8 sm:py-12">
      <div className="shape-circle mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-gray-100">
        <BookOpen className="h-8 w-8 text-gray-400" aria-hidden="true" />
      </div>
      {heading ? <p className="text-lg font-bold text-gray-900">{heading}</p> : null}
      {deck ? (
        <p className={`mx-auto max-w-md text-sm text-gray-500 ${heading ? 'mt-2' : ''}`}>{deck}</p>
      ) : null}
      {actions ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/help"
            className="bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500 inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-white transition focus-visible:ring-2 focus-visible:outline-none"
          >
            {t('footer.help')}
          </Link>
          <Link
            to="/creators"
            className="focus-visible:ring-primary-500 inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-gray-800 ring-1 ring-gray-200 transition hover:bg-gray-50 focus-visible:ring-2 focus-visible:outline-none"
          >
            {t('footer.creators')}
          </Link>
        </div>
      ) : null}
    </div>
  )
}

export default CatalogEmptyPanel
