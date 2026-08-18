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

const CookiesPage = () => {
  const { t, i18n } = useTranslation()
  const page = getInfoPageMeta('cookies', t)
  const { fontSize, setFontSize, readingTheme, setReadingTheme } = useLegalReadability()

  const lastUpdated = new Intl.DateTimeFormat(i18n.language === 'mm' ? 'my' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(2026, 0, 1))

  const storageItems = [
    { id: 'lang', labelKey: 'static.storageLang', descKey: 'static.storageLangDesc' },
    { id: 'session', labelKey: 'static.storageSession', descKey: 'static.storageSessionDesc' },
    { id: 'wallet', labelKey: 'static.storageWallet', descKey: 'static.storageWalletDesc' },
    { id: 'library', labelKey: 'static.storageLibrary', descKey: 'static.storageLibraryDesc' },
    { id: 'progress', labelKey: 'static.storageProgress', descKey: 'static.storageProgressDesc' },
    { id: 'comments', labelKey: 'static.storageComments', descKey: 'static.storageCommentsDesc' },
    {
      id: 'notifications',
      labelKey: 'static.storageNotifications',
      descKey: 'static.storageNotificationsDesc',
    },
    { id: 'searches', labelKey: 'static.storageSearches', descKey: 'static.storageSearchesDesc' },
    {
      id: 'readability',
      labelKey: 'static.storageReadability',
      descKey: 'static.storageReadabilityDesc',
    },
  ]

  const sections = [
    { id: 'what', label: t('static.whatAreCookies') },
    { id: 'how', label: t('static.howWeUseCookies') },
    { id: 'essential', label: t('static.essentialCookies'), sub: true },
    { id: 'functional', label: t('static.functionalCookies'), sub: true },
    { id: 'analytics', label: t('static.analyticsCookies'), sub: true },
    { id: 'marketing', label: t('static.marketingCookies'), sub: true },
    { id: 'storage', label: t('static.storageDetails') },
    { id: 'managing', label: t('static.managingCookies') },
    { id: 'third-party', label: t('static.thirdPartyCookies') },
    { id: 'updates', label: t('static.updatesPolicy') },
    { id: 'contact', label: t('static.contactUs') },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-12 transition-colors duration-300">
      <SEO
        title={t('footer.cookies')}
        description={t('static.cookiesSeoDesc')}
        url="https://softgatecomic.com/cookies"
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
                <p className="bg-primary-50/60 text-primary-900 rounded-2xl p-4 font-semibold">
                  {t('static.noCookiesNote')}
                </p>

                <div>
                  <h2 id="what" className={H2_CLASS}>
                    {t('static.whatAreCookies')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.whatAreCookiesDesc')}</p>
                </div>

                <div>
                  <h2 id="how" className={H2_CLASS}>
                    {t('static.howWeUseCookies')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.howWeUseCookiesDesc')}</p>
                </div>

                <div className="border-primary-500/35 border-l-2 pl-4">
                  <h3 id="essential" className={H3_CLASS}>
                    {t('static.essentialCookies')}
                  </h3>
                  <p className="mt-1.5 font-semibold opacity-90">
                    {t('static.essentialCookiesDesc')}
                  </p>
                </div>

                <div className="border-primary-500/35 border-l-2 pl-4">
                  <h3 id="functional" className={H3_CLASS}>
                    {t('static.functionalCookies')}
                  </h3>
                  <p className="mt-1.5 font-semibold opacity-90">
                    {t('static.functionalCookiesDesc')}
                  </p>
                </div>

                <div className="border-primary-500/35 border-l-2 pl-4">
                  <h3 id="analytics" className={H3_CLASS}>
                    {t('static.analyticsCookies')}
                  </h3>
                  <p className="mt-1.5 font-semibold opacity-90">
                    {t('static.analyticsCookiesDesc')}
                  </p>
                </div>

                <div className="border-primary-500/35 border-l-2 pl-4">
                  <h3 id="marketing" className={H3_CLASS}>
                    {t('static.marketingCookies')}
                  </h3>
                  <p className="mt-1.5 font-semibold opacity-90">
                    {t('static.marketingCookiesDesc')}
                  </p>
                </div>

                <div>
                  <h2 id="storage" className={H2_CLASS}>
                    {t('static.storageDetails')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.storageDetailsDesc')}</p>
                  <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                    {storageItems.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-gray-200/60 p-4">
                        <dt className="font-bold">{t(item.labelKey)}</dt>
                        <dd className="mt-1 font-semibold opacity-90">{t(item.descKey)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div>
                  <h2 id="managing" className={H2_CLASS}>
                    {t('static.managingCookies')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.managingCookiesDesc')}</p>
                </div>

                <div>
                  <h2 id="third-party" className={H2_CLASS}>
                    {t('static.thirdPartyCookies')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">
                    {t('static.thirdPartyCookiesDesc')}
                  </p>
                </div>

                <div>
                  <h2 id="updates" className={H2_CLASS}>
                    {t('static.updatesPolicy')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.updatesPolicyDesc')}</p>
                </div>

                <div>
                  <h2 id="contact" className={H2_CLASS}>
                    {t('static.contactUs')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.contactUsDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookiesPage
