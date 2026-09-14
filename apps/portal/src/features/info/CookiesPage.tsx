import { useTranslation } from 'react-i18next'
import LegalPageShell, { LEGAL_H2_CLASS, LEGAL_H3_CLASS } from './components/LegalPageShell'
import { parseLegalDate, pickLegalText } from '../../lib/legal'
import { useCookies } from '../../lib/cookies'
import { fallbackCookies } from '../../lib/info/legalFallback'

const CookiesPage = () => {
  const { t, i18n } = useTranslation()
  const live = useCookies()
  const language = i18n.language
  const page = live ?? fallbackCookies(t)

  const copy = (key: keyof typeof page.copy) => pickLegalText(page.copy[key], language)
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
  const rows = page.rows
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))

  return (
    <LegalPageShell
      pageId="cookies"
      seoTitle={t('footer.cookies')}
      seoDescription={copy('cookiesSeoDesc')}
      sections={sections}
      glanceItems={page.glance.map((item) => pickLegalText(item, language))}
      lastUpdatedDate={parseLegalDate(page.effectiveDate)}
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

export default CookiesPage
