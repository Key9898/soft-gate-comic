import { useTranslation } from 'react-i18next'
import SEO from '../../components/SEO/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import PageHeader from '../../components/PageHeader'
import { getInfoPageMeta } from '../../lib/info/pageMeta'
import LegalTocSidebar from './components/LegalTocSidebar'
import ReadabilityControls from './components/ReadabilityControls'
import {
  LEGAL_SIZE_CLASSES,
  LEGAL_THEME_CLASSES,
  useLegalReadability,
} from './components/useLegalReadability'

const H2_CLASS = 'scroll-mt-24 border-b border-gray-200/60 pb-2 text-lg font-bold'
const H3_CLASS = 'scroll-mt-24 text-base font-bold'

const TermsPage = () => {
  const { t, i18n } = useTranslation()
  const page = getInfoPageMeta('terms', t)
  const { fontSize, setFontSize, readingTheme, setReadingTheme } = useLegalReadability()

  const lastUpdated = new Intl.DateTimeFormat(i18n.language === 'mm' ? 'my' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(2026, 0, 1))

  const sections = [
    { id: 'acceptance', label: t('static.acceptanceTerms') },
    { id: 'eligibility', label: t('static.eligibility') },
    { id: 'license', label: t('static.useLicense') },
    { id: 'permitted', label: t('static.permitted'), sub: true },
    { id: 'prohibited', label: t('static.prohibited'), sub: true },
    { id: 'accounts', label: t('static.userAccounts') },
    { id: 'user-content', label: t('static.userContent') },
    { id: 'intellectual', label: t('static.intellectualProperty') },
    { id: 'premium', label: t('static.premiumContent') },
    { id: 'coins', label: t('static.coinsVirtual') },
    { id: 'termination', label: t('static.termination') },
    { id: 'limitation', label: t('static.limitation') },
    { id: 'governing', label: t('static.governingLaw') },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-12 transition-colors duration-300">
      <SEO
        title={t('footer.terms')}
        description={t('static.termsSeoDesc')}
        url="https://softgatecomic.com/terms"
      />
      <div className="mx-auto max-w-7xl px-4 py-8 text-left sm:px-6 lg:px-8">
        <Breadcrumb items={page.breadcrumbs} className="mb-6" />
        <PageHeader
          variant="document"
          eyebrow={page.eyebrow}
          title={page.title}
          meta={t('legal.lastUpdated', { date: lastUpdated })}
        />

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
                  <h2 id="acceptance" className={H2_CLASS}>
                    {t('static.acceptanceTerms')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.acceptanceTermsDesc')}</p>
                </div>

                <div>
                  <h2 id="eligibility" className={H2_CLASS}>
                    {t('static.eligibility')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.eligibilityDesc')}</p>
                </div>

                <div>
                  <h2 id="license" className={H2_CLASS}>
                    {t('static.useLicense')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.useLicenseDesc')}</p>
                </div>

                <div className="border-primary-500/35 border-l-2 pl-4">
                  <h3 id="permitted" className={H3_CLASS}>
                    {t('static.permitted')}
                  </h3>
                  <ul className="mt-1.5 list-disc space-y-1.5 pl-5 font-semibold opacity-90">
                    <li>{t('static.permittedAccess')}</li>
                    <li>{t('static.permittedPersonal')}</li>
                    <li>{t('static.permittedDownload')}</li>
                  </ul>
                </div>

                <div className="border-primary-500/35 border-l-2 pl-4">
                  <h3 id="prohibited" className={H3_CLASS}>
                    {t('static.prohibited')}
                  </h3>
                  <ul className="mt-1.5 list-disc space-y-1.5 pl-5 font-semibold opacity-90">
                    <li>{t('static.prohibitedModify')}</li>
                    <li>{t('static.prohibitedCommercial')}</li>
                    <li>{t('static.prohibitedReverse')}</li>
                    <li>{t('static.prohibitedTransfer')}</li>
                    <li>{t('static.prohibitedScrape')}</li>
                  </ul>
                </div>

                <div>
                  <h2 id="accounts" className={H2_CLASS}>
                    {t('static.userAccounts')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.userAccountsDesc')}</p>
                </div>

                <div>
                  <h2 id="user-content" className={H2_CLASS}>
                    {t('static.userContent')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.userContentDesc')}</p>
                </div>

                <div>
                  <h2 id="intellectual" className={H2_CLASS}>
                    {t('static.intellectualProperty')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">
                    {t('static.intellectualPropertyDesc')}
                  </p>
                </div>

                <div>
                  <h2 id="premium" className={H2_CLASS}>
                    {t('static.premiumContent')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.premiumContentDesc')}</p>
                </div>

                <div>
                  <h2 id="coins" className={H2_CLASS}>
                    {t('static.coinsVirtual')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.coinsVirtualDesc')}</p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 font-semibold opacity-90">
                    <li>{t('static.coinsNoOwnership')}</li>
                    <li>{t('static.coinsNoValue')}</li>
                    <li>{t('static.coinsNoTransfer')}</li>
                    <li>{t('static.coinsDemo')}</li>
                  </ul>
                </div>

                <div>
                  <h2 id="termination" className={H2_CLASS}>
                    {t('static.termination')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.terminationDesc')}</p>
                </div>

                <div>
                  <h2 id="limitation" className={H2_CLASS}>
                    {t('static.limitation')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.limitationDesc')}</p>
                </div>

                <div>
                  <h2 id="governing" className={H2_CLASS}>
                    {t('static.governingLaw')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.governingLawDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
