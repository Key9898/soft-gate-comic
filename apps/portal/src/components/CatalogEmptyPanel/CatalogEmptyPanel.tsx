import { BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ButtonLink } from '../../components/Button'

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

  // One failed fetch used to render this full-height panel under every section —
  // about eight identical restatements of a single fact. CatalogStatus already owns
  // the message and the retry at the top of the page, so each section only needs a
  // slim marker that its content could not load.
  if (unavailable) {
    return (
      <p
        data-testid="catalog-unavailable-note"
        className="text-muted rounded-2xl border border-dashed border-gray-200 px-4 py-3 text-sm"
      >
        {t('errors.catalogUnavailableShort')}
      </p>
    )
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white px-6 py-10 text-center sm:px-8 sm:py-12">
      <div className="shape-circle mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-gray-100">
        <BookOpen className="text-muted h-8 w-8" aria-hidden="true" />
      </div>
      {heading ? <p className="text-lg font-bold text-gray-900">{heading}</p> : null}
      {deck ? (
        <p className={`mx-auto max-w-md text-sm text-gray-500 ${heading ? 'mt-2' : ''}`}>{deck}</p>
      ) : null}
      {actions ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink to="/help" className="font-semibold">
            {t('footer.help')}
          </ButtonLink>
          <ButtonLink to="/creators" variant="surface" className="font-semibold">
            {t('footer.creators')}
          </ButtonLink>
        </div>
      ) : null}
    </div>
  )
}

export default CatalogEmptyPanel
