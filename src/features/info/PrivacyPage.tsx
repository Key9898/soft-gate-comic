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

const PrivacyPage = () => {
  const { t, i18n } = useTranslation()
  const page = getInfoPageMeta('privacy', t)
  const { fontSize, setFontSize, readingTheme, setReadingTheme } = useLegalReadability()

  const lastUpdated = new Intl.DateTimeFormat(i18n.language === 'mm' ? 'my' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(2026, 0, 1))

  const sections = [
    { id: 'collect', label: t('static.informationWeCollect') },
    { id: 'personal', label: t('static.personalInfo'), sub: true },
    { id: 'usage', label: t('static.usageData'), sub: true },
    { id: 'reading', label: t('static.readingActivity'), sub: true },
    { id: 'use', label: t('static.howWeUse') },
    { id: 'sharing', label: t('static.dataSharing') },
    { id: 'security', label: t('static.dataSecurity') },
    { id: 'rights', label: t('static.yourRights') },
    { id: 'children', label: t('static.childrenPrivacy') },
    { id: 'contact', label: t('static.contactUs') },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-12 transition-colors duration-300">
      <SEO
        title={t('footer.privacy')}
        description={t('static.privacySeoDesc')}
        url="https://softgatecomic.com/privacy"
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
                  {t('static.privacyLocalNote')}
                </p>

                <div>
                  <h2 id="collect" className={H2_CLASS}>
                    {t('static.informationWeCollect')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">
                    {t('static.informationWeCollectDesc')}
                  </p>
                </div>

                <div className="border-primary-500/35 border-l-2 pl-4">
                  <h3 id="personal" className={H3_CLASS}>
                    {t('static.personalInfo')}
                  </h3>
                  <p className="mt-1.5 font-semibold opacity-90">{t('static.personalInfoDesc')}</p>
                </div>

                <div className="border-primary-500/35 border-l-2 pl-4">
                  <h3 id="usage" className={H3_CLASS}>
                    {t('static.usageData')}
                  </h3>
                  <p className="mt-1.5 font-semibold opacity-90">{t('static.usageDataDesc')}</p>
                </div>

                <div className="border-primary-500/35 border-l-2 pl-4">
                  <h3 id="reading" className={H3_CLASS}>
                    {t('static.readingActivity')}
                  </h3>
                  <p className="mt-1.5 font-semibold opacity-90">
                    {t('static.readingActivityDesc')}
                  </p>
                </div>

                <div>
                  <h2 id="use" className={H2_CLASS}>
                    {t('static.howWeUse')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.howWeUseDesc')}</p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 font-semibold opacity-90">
                    <li>{t('static.useProvide')}</li>
                    <li>{t('static.useImprove')}</li>
                    <li>{t('static.useCommunicate')}</li>
                    <li>{t('static.useSecurity')}</li>
                  </ul>
                </div>

                <div>
                  <h2 id="sharing" className={H2_CLASS}>
                    {t('static.dataSharing')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.dataSharingDesc')}</p>
                </div>

                <div>
                  <h2 id="security" className={H2_CLASS}>
                    {t('static.dataSecurity')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.dataSecurityDesc')}</p>
                </div>

                <div>
                  <h2 id="rights" className={H2_CLASS}>
                    {t('static.yourRights')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.yourRightsDesc')}</p>
                </div>

                <div>
                  <h2 id="children" className={H2_CLASS}>
                    {t('static.childrenPrivacy')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.childrenPrivacyDesc')}</p>
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

export default PrivacyPage
