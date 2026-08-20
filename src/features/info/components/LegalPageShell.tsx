import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from '../../../components/SEO/SEO'
import Breadcrumb from '../../../components/Breadcrumb'
import PageHeader from '../../../components/PageHeader'
import { getInfoPageMeta, type InfoPageKey } from '../../../lib/info/pageMeta'
import { formatLegalEffectiveDate } from '../../../lib/info/legalEffectiveDate'
import LegalTocSidebar, { type LegalTocSection } from './LegalTocSidebar'
import ReadabilityControls from './ReadabilityControls'
import { LEGAL_SIZE_CLASSES, LEGAL_THEME_CLASSES, useLegalReadability } from './useLegalReadability'

export const LEGAL_H2_CLASS = 'scroll-mt-24 border-b border-gray-200/60 pb-2 text-lg font-bold'
export const LEGAL_H3_CLASS = 'scroll-mt-24 text-base font-bold'

export type LegalPageId = Extract<InfoPageKey, 'privacy' | 'terms' | 'cookies'>

const POLICY_LINKS: {
  id: LegalPageId
  to: string
  labelKey: 'footer.privacy' | 'footer.terms' | 'footer.cookies'
}[] = [
  { id: 'privacy', to: '/privacy', labelKey: 'footer.privacy' },
  { id: 'terms', to: '/terms', labelKey: 'footer.terms' },
  { id: 'cookies', to: '/cookies', labelKey: 'footer.cookies' },
]

const SUPPORT_MAIL = 'support@softgatecomic.com'

const POLICY_LINK_CLASS =
  'focus-visible:ring-primary-500 inline-flex min-h-11 items-center rounded-2xl px-1 text-sm font-bold text-primary-600 hover:text-primary-700 focus-visible:ring-2 focus-visible:outline-none'

const MAILTO_CLASS =
  'focus-visible:ring-primary-500 inline-flex min-h-11 items-center rounded-2xl font-bold text-primary-600 hover:text-primary-700 focus-visible:ring-2 focus-visible:outline-none'

interface LegalRelatedPoliciesProps {
  current: LegalPageId
}

const LegalRelatedPolicies = ({ current }: LegalRelatedPoliciesProps) => {
  const { t } = useTranslation()

  return (
    <nav
      aria-label={t('legal.relatedPolicies')}
      className="flex flex-wrap items-center gap-x-1 gap-y-1"
    >
      <span className="text-2xs mr-2 font-bold tracking-wider text-gray-400 uppercase">
        {t('legal.relatedPolicies')}
      </span>
      {POLICY_LINKS.map((policy, index) => {
        const label = t(policy.labelKey)
        const item =
          policy.id === current ? (
            <span
              aria-current="page"
              className="inline-flex min-h-11 items-center px-1 text-sm font-bold text-gray-900"
            >
              {label}
            </span>
          ) : (
            <Link to={policy.to} className={POLICY_LINK_CLASS}>
              {label}
            </Link>
          )
        return (
          <span key={policy.id} className="inline-flex items-center">
            {index > 0 ? (
              <span className="px-1 text-gray-300" aria-hidden="true">
                |
              </span>
            ) : null}
            {item}
          </span>
        )
      })}
    </nav>
  )
}

interface LegalPageShellProps {
  pageId: LegalPageId
  seoTitle: string
  seoDescription: string
  sections: LegalTocSection[]
  glanceItems: string[]
  children: ReactNode
}

const LegalPageShell = ({
  pageId,
  seoTitle,
  seoDescription,
  sections,
  glanceItems,
  children,
}: LegalPageShellProps) => {
  const { t, i18n } = useTranslation()
  const page = getInfoPageMeta(pageId, t)
  const { fontSize, setFontSize, readingTheme, setReadingTheme } = useLegalReadability()
  const lastUpdated = formatLegalEffectiveDate(i18n.language)

  return (
    <div className="relative min-h-screen bg-gray-50 pb-12 transition-colors duration-300">
      <SEO
        title={seoTitle}
        description={seoDescription}
        url={`https://softgatecomic.com/${pageId}`}
      />
      <div className="radial-wash-primary pointer-events-none absolute top-0 left-1/2 h-[450px] w-full max-w-7xl -translate-x-1/2" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 text-left sm:px-6 lg:px-8">
        <Breadcrumb items={page.breadcrumbs} className="mb-6" />
        <PageHeader
          variant="document"
          eyebrow={page.eyebrow}
          title={page.title}
          meta={t('legal.lastUpdated', { date: lastUpdated })}
        />
        <div className="mb-8">
          <LegalRelatedPolicies current={pageId} />
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-4">
          <div className="space-y-4 lg:sticky lg:top-20 lg:col-span-1">
            <LegalTocSidebar sections={sections} />
            <ReadabilityControls
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              readingTheme={readingTheme}
              onReadingThemeChange={setReadingTheme}
            />
          </div>

          <div className="lg:col-span-3">
            <div
              className={`rounded-3xl border p-6 shadow-sm transition-colors duration-300 sm:p-8 ${LEGAL_THEME_CLASSES[readingTheme]}`}
            >
              <div className={`space-y-6 text-left ${LEGAL_SIZE_CLASSES[fontSize]}`}>
                <div>
                  <h2 id="glance" className={LEGAL_H2_CLASS}>
                    {t('legal.glance')}
                  </h2>
                  <ol className="bg-primary-50/60 text-primary-900 mt-3 list-decimal space-y-2 rounded-2xl p-4 pl-9 font-semibold">
                    {glanceItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </div>

                {children}

                <div>
                  <h2 id="contact" className={LEGAL_H2_CLASS}>
                    {t('static.contactUs')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('legal.contactLead')}</p>
                  <p className="mt-2">
                    <a href={`mailto:${SUPPORT_MAIL}`} translate="no" className={MAILTO_CLASS}>
                      {SUPPORT_MAIL}
                    </a>
                  </p>
                  <p className="mt-2">
                    <Link to="/contact" className={POLICY_LINK_CLASS}>
                      {t('legal.contactPage')}
                    </Link>
                  </p>
                </div>

                <LegalRelatedPolicies current={pageId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LegalPageShell
