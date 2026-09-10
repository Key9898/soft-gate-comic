import { useTranslation } from 'react-i18next'
import LegalPageShell, { LEGAL_H2_CLASS, LEGAL_H3_CLASS } from './components/LegalPageShell'
import { parseLegalDate, pickLegalText } from '../../lib/legal'
import { useCookies } from '../../lib/cookies'

const MOCK_STORAGE_ITEMS = [
  { id: 'lang', labelKey: 'static.storageLang', descKey: 'static.storageLangDesc' },
  { id: 'session', labelKey: 'static.storageSession', descKey: 'static.storageSessionDesc' },
  { id: 'accounts', labelKey: 'static.storageAccounts', descKey: 'static.storageAccountsDesc' },
  { id: 'wallet', labelKey: 'static.storageWallet', descKey: 'static.storageWalletDesc' },
  { id: 'library', labelKey: 'static.storageLibrary', descKey: 'static.storageLibraryDesc' },
  { id: 'follows', labelKey: 'static.storageFollows', descKey: 'static.storageFollowsDesc' },
  {
    id: 'engagement',
    labelKey: 'static.storageEngagement',
    descKey: 'static.storageEngagementDesc',
  },
  { id: 'comments', labelKey: 'static.storageComments', descKey: 'static.storageCommentsDesc' },
  {
    id: 'notifications',
    labelKey: 'static.storageNotifications',
    descKey: 'static.storageNotificationsDesc',
  },
  {
    id: 'notifPrefs',
    labelKey: 'static.storageNotifPrefs',
    descKey: 'static.storageNotifPrefsDesc',
  },
  { id: 'searches', labelKey: 'static.storageSearches', descKey: 'static.storageSearchesDesc' },
  {
    id: 'readability',
    labelKey: 'static.storageReadability',
    descKey: 'static.storageReadabilityDesc',
  },
  {
    id: 'reader',
    labelKey: 'static.storageReader',
    descKey: 'static.storageReaderDesc',
  },
  {
    id: 'episodeReports',
    labelKey: 'static.storageEpisodeReports',
    descKey: 'static.storageEpisodeReportsDesc',
  },
  {
    id: 'ageConfirm',
    labelKey: 'static.storageAgeConfirm',
    descKey: 'static.storageAgeConfirmDesc',
  },
  { id: 'catalog', labelKey: 'static.storageCatalog', descKey: 'static.storageCatalogDesc' },
]

const CookiesPage = () => {
  const { t, i18n } = useTranslation()
  const live = useCookies()
  const language = i18n.language

  if (live) {
    const copy = (key: keyof typeof live.copy) => pickLegalText(live.copy[key], language)
    const sections = [
      { id: 'glance', label: t('legal.glance') },
      { id: 'what', label: copy('whatAreCookies') },
      { id: 'how', label: copy('howWeUseCookies') },
      { id: 'essential', label: copy('essentialCookies'), sub: true },
      { id: 'functional', label: copy('functionalCookies'), sub: true },
      { id: 'analytics', label: copy('analyticsCookies'), sub: true },
      { id: 'marketing', label: copy('marketingCookies'), sub: true },
      { id: 'storage', label: copy('storageDetails') },
      { id: 'managing', label: copy('managingCookies') },
      { id: 'third-party', label: copy('thirdPartyCookies') },
      { id: 'updates', label: copy('updatesPolicy') },
      { id: 'contact', label: t('static.contactUs') },
    ]
    const glanceItems = live.glance.map((item) => pickLegalText(item, language))
    const rows = live.rows
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))

    return (
      <LegalPageShell
        pageId="cookies"
        seoTitle={t('footer.cookies')}
        seoDescription={copy('cookiesSeoDesc')}
        sections={sections}
        glanceItems={glanceItems}
        lastUpdatedDate={parseLegalDate(live.effectiveDate)}
      >
        <div>
          <h2 id="what" className={LEGAL_H2_CLASS}>
            {copy('whatAreCookies')}
          </h2>
          <p className="mt-3 font-semibold opacity-90">{copy('whatAreCookiesDesc')}</p>
        </div>

        <div>
          <h2 id="how" className={LEGAL_H2_CLASS}>
            {copy('howWeUseCookies')}
          </h2>
          <p className="mt-3 font-semibold opacity-90">{copy('howWeUseCookiesDesc')}</p>
        </div>

        <div className="border-primary-500/35 border-l-2 pl-4">
          <h3 id="essential" className={LEGAL_H3_CLASS}>
            {copy('essentialCookies')}
          </h3>
          <p className="mt-1.5 font-semibold opacity-90">{copy('essentialCookiesDesc')}</p>
        </div>

        <div className="border-primary-500/35 border-l-2 pl-4">
          <h3 id="functional" className={LEGAL_H3_CLASS}>
            {copy('functionalCookies')}
          </h3>
          <p className="mt-1.5 font-semibold opacity-90">{copy('functionalCookiesDesc')}</p>
        </div>

        <div className="border-primary-500/35 border-l-2 pl-4">
          <h3 id="analytics" className={LEGAL_H3_CLASS}>
            {copy('analyticsCookies')}
          </h3>
          <p className="mt-1.5 font-semibold opacity-90">{copy('analyticsCookiesDesc')}</p>
        </div>

        <div className="border-primary-500/35 border-l-2 pl-4">
          <h3 id="marketing" className={LEGAL_H3_CLASS}>
            {copy('marketingCookies')}
          </h3>
          <p className="mt-1.5 font-semibold opacity-90">{copy('marketingCookiesDesc')}</p>
        </div>

        <div>
          <h2 id="storage" className={LEGAL_H2_CLASS}>
            {copy('storageDetails')}
          </h2>
          <p className="mt-3 font-semibold opacity-90">{copy('storageDetailsDesc')}</p>
          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {rows.map((item) => (
              <div key={item.id} className="rounded-2xl border border-gray-200/60 p-4">
                <dt className="font-bold">{pickLegalText(item.label, language)}</dt>
                <dd className="mt-1 font-semibold opacity-90">
                  {pickLegalText(item.description, language)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 id="managing" className={LEGAL_H2_CLASS}>
            {copy('managingCookies')}
          </h2>
          <p className="mt-3 font-semibold opacity-90">{copy('managingCookiesDesc')}</p>
        </div>

        <div>
          <h2 id="third-party" className={LEGAL_H2_CLASS}>
            {copy('thirdPartyCookies')}
          </h2>
          <p className="mt-3 font-semibold opacity-90">{copy('thirdPartyCookiesDesc')}</p>
        </div>

        <div>
          <h2 id="updates" className={LEGAL_H2_CLASS}>
            {copy('updatesPolicy')}
          </h2>
          <p className="mt-3 font-semibold opacity-90">{copy('updatesPolicyDesc')}</p>
        </div>
      </LegalPageShell>
    )
  }

  const sections = [
    { id: 'glance', label: t('legal.glance') },
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

  const glanceItems = [
    t('static.cookiesGlance1'),
    t('static.cookiesGlance2'),
    t('static.cookiesGlance3'),
    t('static.cookiesGlance4'),
    t('static.cookiesGlance5'),
  ]

  return (
    <LegalPageShell
      pageId="cookies"
      seoTitle={t('footer.cookies')}
      seoDescription={t('static.cookiesSeoDesc')}
      sections={sections}
      glanceItems={glanceItems}
    >
      <div>
        <h2 id="what" className={LEGAL_H2_CLASS}>
          {t('static.whatAreCookies')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.whatAreCookiesDesc')}</p>
      </div>

      <div>
        <h2 id="how" className={LEGAL_H2_CLASS}>
          {t('static.howWeUseCookies')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.howWeUseCookiesDesc')}</p>
      </div>

      <div className="border-primary-500/35 border-l-2 pl-4">
        <h3 id="essential" className={LEGAL_H3_CLASS}>
          {t('static.essentialCookies')}
        </h3>
        <p className="mt-1.5 font-semibold opacity-90">{t('static.essentialCookiesDesc')}</p>
      </div>

      <div className="border-primary-500/35 border-l-2 pl-4">
        <h3 id="functional" className={LEGAL_H3_CLASS}>
          {t('static.functionalCookies')}
        </h3>
        <p className="mt-1.5 font-semibold opacity-90">{t('static.functionalCookiesDesc')}</p>
      </div>

      <div className="border-primary-500/35 border-l-2 pl-4">
        <h3 id="analytics" className={LEGAL_H3_CLASS}>
          {t('static.analyticsCookies')}
        </h3>
        <p className="mt-1.5 font-semibold opacity-90">{t('static.analyticsCookiesDesc')}</p>
      </div>

      <div className="border-primary-500/35 border-l-2 pl-4">
        <h3 id="marketing" className={LEGAL_H3_CLASS}>
          {t('static.marketingCookies')}
        </h3>
        <p className="mt-1.5 font-semibold opacity-90">{t('static.marketingCookiesDesc')}</p>
      </div>

      <div>
        <h2 id="storage" className={LEGAL_H2_CLASS}>
          {t('static.storageDetails')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.storageDetailsDesc')}</p>
        <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          {MOCK_STORAGE_ITEMS.map((item) => (
            <div key={item.id} className="rounded-2xl border border-gray-200/60 p-4">
              <dt className="font-bold">{t(item.labelKey)}</dt>
              <dd className="mt-1 font-semibold opacity-90">{t(item.descKey)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <h2 id="managing" className={LEGAL_H2_CLASS}>
          {t('static.managingCookies')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.managingCookiesDesc')}</p>
      </div>

      <div>
        <h2 id="third-party" className={LEGAL_H2_CLASS}>
          {t('static.thirdPartyCookies')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.thirdPartyCookiesDesc')}</p>
      </div>

      <div>
        <h2 id="updates" className={LEGAL_H2_CLASS}>
          {t('static.updatesPolicy')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.updatesPolicyDesc')}</p>
      </div>
    </LegalPageShell>
  )
}

export default CookiesPage
