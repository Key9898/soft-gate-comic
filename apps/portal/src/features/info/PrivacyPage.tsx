import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LegalPageShell, { LEGAL_H2_CLASS, LEGAL_H3_CLASS } from './components/LegalPageShell'
import LegalCmsSections from './components/LegalCmsSections'
import { parseLegalDate, pickLegalText, useLegal } from '../../lib/legal'

const RIGHTS_LINK =
  'focus-visible:ring-primary-500 inline-flex min-h-11 items-center rounded-2xl font-bold text-primary-600 hover:text-primary-700 focus-visible:ring-2 focus-visible:outline-none'

const PrivacyPage = () => {
  const { t, i18n } = useTranslation()
  const live = useLegal('privacy')
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
        pageId="privacy"
        seoTitle={t('footer.privacy')}
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

  const glanceItems = [
    t('static.privacyGlance1'),
    t('static.privacyGlance2'),
    t('static.privacyGlance3'),
    t('static.privacyGlance4'),
    t('static.privacyGlance5'),
  ]

  return (
    <LegalPageShell
      pageId="privacy"
      seoTitle={t('footer.privacy')}
      seoDescription={t('static.privacySeoDesc')}
      sections={sections}
      glanceItems={glanceItems}
    >
      <div>
        <h2 id="collect" className={LEGAL_H2_CLASS}>
          {t('static.informationWeCollect')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.informationWeCollectDesc')}</p>
      </div>

      <div className="border-primary-500/35 border-l-2 pl-4">
        <h3 id="personal" className={LEGAL_H3_CLASS}>
          {t('static.personalInfo')}
        </h3>
        <p className="mt-1.5 font-semibold opacity-90">{t('static.personalInfoDesc')}</p>
      </div>

      <div className="border-primary-500/35 border-l-2 pl-4">
        <h3 id="usage" className={LEGAL_H3_CLASS}>
          {t('static.usageData')}
        </h3>
        <p className="mt-1.5 font-semibold opacity-90">{t('static.usageDataDesc')}</p>
      </div>

      <div className="border-primary-500/35 border-l-2 pl-4">
        <h3 id="reading" className={LEGAL_H3_CLASS}>
          {t('static.readingActivity')}
        </h3>
        <p className="mt-1.5 font-semibold opacity-90">{t('static.readingActivityDesc')}</p>
      </div>

      <div>
        <h2 id="use" className={LEGAL_H2_CLASS}>
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
        <h2 id="sharing" className={LEGAL_H2_CLASS}>
          {t('static.dataSharing')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.dataSharingDesc')}</p>
      </div>

      <div>
        <h2 id="security" className={LEGAL_H2_CLASS}>
          {t('static.dataSecurity')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.dataSecurityDesc')}</p>
      </div>

      <div>
        <h2 id="rights" className={LEGAL_H2_CLASS}>
          {t('static.yourRights')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.yourRightsDesc')}</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 font-semibold opacity-90">
          <li>
            <Link to="/profile?tab=security" className={RIGHTS_LINK}>
              {t('static.yourRightsProfile')}
            </Link>
            <span> — {t('static.yourRightsDelete')}</span>
          </li>
          <li>{t('static.yourRightsClear')}</li>
          <li>{t('static.yourRightsGuest')}</li>
        </ul>
        <p className="mt-3">
          <Link to="/contact" className={RIGHTS_LINK}>
            {t('legal.contactPage')}
          </Link>
        </p>
      </div>

      <div>
        <h2 id="children" className={LEGAL_H2_CLASS}>
          {t('static.childrenPrivacy')}
        </h2>
        <p className="mt-3 font-semibold opacity-90">{t('static.childrenPrivacyDesc')}</p>
      </div>
    </LegalPageShell>
  )
}

export default PrivacyPage
