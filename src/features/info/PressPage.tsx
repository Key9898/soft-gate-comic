import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Copy, Download, Mail } from 'lucide-react'
import SEO from '../../components/SEO/SEO'
import { buildOrganizationJsonLd } from '../../components/SEO/jsonLd'
import Breadcrumb from '../../components/Breadcrumb'
import PageHeader from '../../components/PageHeader'
import { getInfoPageMeta } from '../../lib/info/pageMeta'

const SECTION_HEADING =
  'flex items-center gap-2 text-xl font-bold tracking-wider text-gray-900 uppercase'

const CARD = 'rounded-3xl border border-gray-200/60 bg-white shadow-sm'

const PRIMARY_CTA =
  'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-medium text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none'

const BODY = 'mt-3 max-w-3xl text-sm leading-relaxed font-medium text-gray-500'

const PressPage = () => {
  const { t } = useTranslation()
  const page = getInfoPageMeta('press', t)
  const [copied, setCopied] = useState(false)

  const brandAssets = [
    { nameKey: 'press.assetLogoSvg' as const, file: '/logo/logo.svg', format: 'SVG' },
    { nameKey: 'press.assetLogoPng' as const, file: '/logo/logo.png', format: 'PNG' },
    { nameKey: 'press.assetIconPng' as const, file: '/favicon/icon-512.png', format: 'PNG' },
  ]

  const facts = [
    {
      labelKey: 'press.factLegalNameLabel' as const,
      valueKey: 'press.factLegalNameValue' as const,
    },
    { labelKey: 'press.factProductLabel' as const, valueKey: 'press.factProductValue' as const },
    { labelKey: 'press.factStageLabel' as const, valueKey: 'press.factStageValue' as const },
    { labelKey: 'press.factMarketLabel' as const, valueKey: 'press.factMarketValue' as const },
    { labelKey: 'press.factHqLabel' as const, valueKey: 'press.factHqValue' as const },
    { labelKey: 'press.factFoundedLabel' as const, valueKey: 'press.factFoundedValue' as const },
    {
      labelKey: 'press.factPlatformsLabel' as const,
      valueKey: 'press.factPlatformsValue' as const,
    },
    {
      labelKey: 'press.factLanguagesLabel' as const,
      valueKey: 'press.factLanguagesValue' as const,
    },
    { labelKey: 'press.factWebsiteLabel' as const, valueKey: 'press.factWebsiteValue' as const },
  ]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(t('press.boilerplate'))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 pb-20 transition-colors duration-300">
      <SEO
        title={t('footer.press')}
        description={t('press.intro')}
        url="https://softgatecomic.com/press"
        jsonLd={buildOrganizationJsonLd()}
      />
      <div className="radial-wash-primary pointer-events-none absolute top-0 left-1/2 h-[450px] w-full max-w-7xl -translate-x-1/2" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 text-left sm:px-6 lg:px-8">
        <Breadcrumb items={page.breadcrumbs} className="mb-6" />
        <PageHeader variant="masthead" eyebrow={page.eyebrow} title={page.title} deck={page.deck} />

        <section className="mb-16">
          <h2 className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {t('press.boilerplateTitle')}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed font-medium text-gray-600">
            {t('press.boilerplate')}
          </p>
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="link mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold"
          >
            <Copy className="h-4 w-4" aria-hidden />
            {copied ? t('press.copied') : t('press.copy')}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? t('press.copied') : ''}
          </span>
        </section>

        <section className="mb-16 border-t border-gray-200/60 pt-14">
          <h2 className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {t('press.factSheet')}
          </h2>
          <dl className={`${CARD} mt-8 grid gap-x-8 gap-y-6 p-8 sm:grid-cols-2 lg:grid-cols-3`}>
            {facts.map((fact) => (
              <div key={fact.labelKey}>
                <dt className="text-2xs font-bold tracking-widest text-gray-400 uppercase">
                  {t(fact.labelKey)}
                </dt>
                <dd className="mt-1.5 text-sm font-semibold text-gray-900">{t(fact.valueKey)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mb-16 border-t border-gray-200/60 pt-14">
          <h2 className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {t('press.newsTitle')}
          </h2>
          <p className={BODY}>{t('press.noReleases')}</p>
        </section>

        <section className="mb-16 border-t border-gray-200/60 pt-14">
          <h2 className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {t('press.mediaKit')}
          </h2>
          <p className={BODY}>{t('press.mediaKitDesc')}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {brandAssets.map((asset) => (
              <div key={asset.file} className={`${CARD} flex flex-col p-6`}>
                <div className="bg-primary-50 flex h-28 items-center justify-center rounded-2xl p-4">
                  <img src={asset.file} alt="" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-gray-900">{t(asset.nameKey)}</p>
                  <span className="text-2xs rounded-2xl bg-gray-100 px-2 py-1 font-bold tracking-wider text-gray-500 uppercase">
                    {asset.format}
                  </span>
                </div>
                <a
                  href={asset.file}
                  download
                  className="link mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  {t('press.download')}
                </a>
              </div>
            ))}
          </div>
          <h3 className="mt-10 text-sm font-bold tracking-wider text-gray-900 uppercase">
            {t('press.usageTitle')}
          </h3>
          <div className="mt-4 grid max-w-3xl gap-8 sm:grid-cols-2">
            <div>
              <p className="text-sm font-bold tracking-wider text-gray-900 uppercase">
                {t('press.usageDoTitle')}
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed font-medium text-gray-500">
                <li>{t('press.usageDo1')}</li>
                <li>{t('press.usageDo2')}</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-bold tracking-wider text-gray-900 uppercase">
                {t('press.usageDontTitle')}
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed font-medium text-gray-500">
                <li>{t('press.usageDont1')}</li>
                <li>{t('press.usageDont2')}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16 border-t border-gray-200/60 pt-14">
          <h2 className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {t('press.screenshotsTitle')}
          </h2>
          <p className={BODY}>{t('press.screenshotsEmpty')}</p>
        </section>

        <section className="mb-16 border-t border-gray-200/60 pt-14">
          <h2 className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {t('press.spokespersonTitle')}
          </h2>
          <p className={BODY}>{t('press.spokespersonEmpty')}</p>
        </section>

        <section className="border-t border-gray-200/60 pt-14">
          <div className={`${CARD} mx-auto max-w-2xl p-8 text-center`}>
            <div className="bg-primary-50 text-primary-600 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
              <Mail className="h-6 w-6" aria-hidden />
            </div>
            <h2 className="text-xl font-bold text-balance text-gray-900">{t('press.contact')}</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{t('press.contactDesc')}</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{t('press.contactHours')}</p>
            <a href="mailto:press@softgatecomic.com" className={`${PRIMARY_CTA} mt-6`}>
              <span translate="no">press@softgatecomic.com</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              {t('press.otherInquiries')}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6">
              <Link
                to="/about"
                className="link inline-flex min-h-11 items-center text-sm font-semibold"
              >
                {t('footer.about')}
              </Link>
              <Link
                to="/contact"
                className="link inline-flex min-h-11 items-center text-sm font-semibold"
              >
                {t('footer.contact')}
              </Link>
              <Link
                to="/creators"
                className="link inline-flex min-h-11 items-center text-sm font-semibold"
              >
                {t('footer.creators')}
              </Link>
            </div>
          </div>
          <p className="mt-4 text-center text-xs leading-relaxed text-gray-400">
            {t('press.updated')}
          </p>
        </section>
      </div>
    </div>
  )
}

export default PressPage
