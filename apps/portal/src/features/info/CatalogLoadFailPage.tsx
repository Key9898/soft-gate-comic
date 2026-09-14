import { RefreshCw, ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button, { ButtonLink } from '../../components/Button'
import SEO from '../../components/SEO/SEO'

export interface CatalogLoadFailPageProps {
  onRetry: () => void
  /** Where "back" goes when the series is known but its record could not load. */
  backHref?: string
}

/**
 * Shown when the catalog request failed, as distinct from the thing genuinely not
 * existing. The reader used to render `NotFoundPage variant="series"` here, which
 * tells a visitor their series was deleted when in fact the network dropped — and
 * sends them away from something that is still there.
 */
const CatalogLoadFailPage = ({ onRetry, backHref }: CatalogLoadFailPageProps) => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50 pb-16" data-testid="catalog-load-fail">
      <SEO noindex omitJsonLd omitCanonical title={t('errors.catalogLoad')} />
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <div className="shape-circle mb-6 flex h-16 w-16 items-center justify-center bg-amber-100">
          <RefreshCw className="h-8 w-8 text-amber-700" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t('errors.catalogLoad')}</h1>
        <p className="text-muted mt-3 max-w-xl text-sm leading-relaxed">
          {t('errors.catalogUnavailable')}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={onRetry} leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}>
            {t('a11y.retry')}
          </Button>
          {backHref ? (
            <ButtonLink to={backHref} variant="surface">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t('reader.backToWebtoon')}
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default CatalogLoadFailPage
