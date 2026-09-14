import { useTranslation } from 'react-i18next'
import LegalPageShell from './components/LegalPageShell'
import LegalCmsSections from './components/LegalCmsSections'
import { parseLegalDate, pickLegalText, useLegal } from '../../lib/legal'
import { fallbackLegalPage } from '../../lib/info/legalFallback'

const TermsPage = () => {
  const { t, i18n } = useTranslation()
  const live = useLegal('terms')
  const language = i18n.language
  const page = live ?? fallbackLegalPage('terms', t)

  const sections = [
    { id: 'glance', label: t('legal.glance') },
    ...page.sections.map((section) => ({
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
      seoDescription={pickLegalText(page.seoDesc, language)}
      sections={sections}
      glanceItems={page.glance.map((item) => pickLegalText(item, language))}
      lastUpdatedDate={parseLegalDate(page.effectiveDate)}
    >
      <LegalCmsSections sections={page.sections} language={language} />
    </LegalPageShell>
  )
}

export default TermsPage
