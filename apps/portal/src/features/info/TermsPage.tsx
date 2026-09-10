import { useTranslation } from 'react-i18next'
import LegalPageShell, { LEGAL_H2_CLASS, LEGAL_H3_CLASS } from './components/LegalPageShell'
import LegalCmsSections from './components/LegalCmsSections'
import { parseLegalDate, pickLegalText, useLegal } from '../../lib/legal'

const TermsPage = () => {
  const { t, i18n } = useTranslation()
  const live = useLegal('terms')
  const language = i18n.language

  if (live) {
    const sections = [
      { id: 'glance', label: t('legal.glance') },
      ...live.sections.map((section) => ({
        id: section.slug,
        label: pickLegalText(section.title, language),
        sub: section.headingLevel === 'h3',
      })),
      { id: 'contact', label: t('static.contactUs') },
    ]
    return (
      <LegalPageShell
        pageId="terms"
        seoTitle={t('footer.terms')}
        seoDescription={pickLegalText(live.seoDesc, language)}
        sections={sections}
        glanceItems={live.glance.map((item) => pickLegalText(item, language))}
        lastUpdatedDate={parseLegalDate(live.effectiveDate)}
      >
        <LegalCmsSections sections={live.sections} language={language} />
      </LegalPageShell>
    )
  }

  const sections = [
    { id: 'glance', label: t('legal.glance') },
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
    { id: 'changes', label: t('static.changesTerms') },
    { id: 'governing', label: t('static.governingLaw') },
    { id: 'contact', label: t('static.contactUs') },
  ]

  const glanceItems = [
    t('static.termsGlance1'),
    t('static.termsGlance2'),
    t('static.termsGlance3'),
    t('static.termsGlance4'),
    t('static.termsGlance5'),
  ]

  return (
    <LegalPageShell
      pageId="terms"
      seoTitle={t('footer.terms')}
      seoDescription={t('static.termsSeoDesc')}
      sections={sections}
      glanceItems={glanceItems}
    >
      <div>
        <h2 id="acceptance" className={LEGAL_H2_CLASS}>
          {t('static.acceptanceTerms')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.acceptanceTermsDesc')}</p>
      </div>

      <div>
        <h2 id="eligibility" className={LEGAL_H2_CLASS}>
          {t('static.eligibility')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.eligibilityDesc')}</p>
      </div>

      <div>
        <h2 id="license" className={LEGAL_H2_CLASS}>
          {t('static.useLicense')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.useLicenseDesc')}</p>
      </div>

      <div className="border-primary-500/35 border-l-2 pl-4">
        <h3 id="permitted" className={LEGAL_H3_CLASS}>
          {t('static.permitted')}
        </h3>
        <ul className="mt-1.5 list-disc space-y-1.5 pl-5 font-semibold opacity-90">
          <li>{t('static.permittedAccess')}</li>
          <li>{t('static.permittedPersonal')}</li>
          <li>{t('static.permittedDownload')}</li>
        </ul>
      </div>

      <div className="border-primary-500/35 border-l-2 pl-4">
        <h3 id="prohibited" className={LEGAL_H3_CLASS}>
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
        <h2 id="accounts" className={LEGAL_H2_CLASS}>
          {t('static.userAccounts')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.userAccountsDesc')}</p>
      </div>

      <div>
        <h2 id="user-content" className={LEGAL_H2_CLASS}>
          {t('static.userContent')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.userContentDesc')}</p>
      </div>

      <div>
        <h2 id="intellectual" className={LEGAL_H2_CLASS}>
          {t('static.intellectualProperty')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.intellectualPropertyDesc')}</p>
      </div>

      <div>
        <h2 id="premium" className={LEGAL_H2_CLASS}>
          {t('static.premiumContent')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.premiumContentDesc')}</p>
      </div>

      <div>
        <h2 id="coins" className={LEGAL_H2_CLASS}>
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
        <h2 id="termination" className={LEGAL_H2_CLASS}>
          {t('static.termination')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.terminationDesc')}</p>
      </div>

      <div>
        <h2 id="limitation" className={LEGAL_H2_CLASS}>
          {t('static.limitation')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.limitationDesc')}</p>
      </div>

      <div>
        <h2 id="changes" className={LEGAL_H2_CLASS}>
          {t('static.changesTerms')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.changesTermsDesc')}</p>
      </div>

      <div>
        <h2 id="governing" className={LEGAL_H2_CLASS}>
          {t('static.governingLaw')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.governingLawDesc')}</p>
      </div>
    </LegalPageShell>
  )
}

export default TermsPage
