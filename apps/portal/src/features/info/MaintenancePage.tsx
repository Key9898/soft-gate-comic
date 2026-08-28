import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookOpen, HelpCircle, Lock, Mail, ShieldCheck, UserRound } from 'lucide-react'
import SEO from '../../components/SEO/SEO'
import { useSettings } from '../../context/SettingsContext'

const CARD = 'rounded-3xl border border-gray-200/80 bg-white p-5 text-left shadow-sm'
const LINK =
  'focus-visible:ring-primary-500 inline-flex min-h-11 items-center justify-center rounded-2xl px-5 text-sm font-semibold focus-visible:ring-2 focus-visible:outline-none'

const MaintenancePage = () => {
  const { t } = useTranslation()
  const { contactEmail } = useSettings()

  return (
    <div className="bg-gray-50 pb-16">
      <SEO
        noindex
        omitJsonLd
        omitCanonical
        omitKeywords
        omitSocial
        title={t('maintenance.title')}
        description={t('maintenance.lead')}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-primary-600 text-xs font-bold tracking-wider uppercase">
          {t('maintenance.windowEyebrow')}
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          {t('maintenance.title')}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
          {t('maintenance.lead')}
        </p>
        <p className="mt-3 max-w-3xl text-sm text-gray-500">{t('maintenance.honesty')}</p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <section className={CARD} aria-labelledby="maintenance-paused">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-gray-700">
              <Lock className="h-5 w-5" aria-hidden />
            </div>
            <h2 id="maintenance-paused" className="mt-4 text-lg font-bold text-gray-950">
              {t('maintenance.pausedTitle')}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <BookOpen className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {t('maintenance.pausedCatalog')}
              </li>
              <li className="flex gap-2">
                <BookOpen className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {t('maintenance.pausedReading')}
              </li>
              <li className="flex gap-2">
                <UserRound className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {t('maintenance.pausedAccount')}
              </li>
            </ul>
          </section>

          <section className={CARD} aria-labelledby="maintenance-open">
            <div className="bg-primary-50 text-primary-700 flex h-11 w-11 items-center justify-center rounded-2xl">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </div>
            <h2 id="maintenance-open" className="mt-4 text-lg font-bold text-gray-950">
              {t('maintenance.openTitle')}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>{t('maintenance.openLogin')}</li>
              <li>{t('maintenance.openHelp')}</li>
            </ul>
          </section>
        </div>

        <section className={`${CARD} mt-4`} aria-labelledby="maintenance-window">
          <p className="text-2xs font-bold tracking-wider text-gray-400 uppercase">
            {t('common.demo')}
          </p>
          <h2 id="maintenance-window" className="mt-2 text-lg font-bold text-gray-950">
            {t('maintenance.windowTitle')}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
            {t('maintenance.windowBody')}
          </p>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/login" className={`${LINK} bg-primary-600 hover:bg-primary-700 text-white`}>
            {t('maintenance.login')}
          </Link>
          <Link
            to="/help"
            className={`${LINK} border border-gray-200 bg-white text-gray-800 hover:bg-gray-50`}
          >
            <HelpCircle className="mr-2 h-4 w-4" aria-hidden />
            {t('maintenance.help')}
          </Link>
          <Link
            to="/faq"
            className={`${LINK} border border-gray-200 bg-white text-gray-800 hover:bg-gray-50`}
          >
            {t('maintenance.faq')}
          </Link>
          <Link
            to="/contact"
            className={`${LINK} border border-gray-200 bg-white text-gray-800 hover:bg-gray-50`}
          >
            {t('maintenance.contact')}
          </Link>
          <a
            href={`mailto:${contactEmail}`}
            translate="no"
            className={`${LINK} border border-gray-200 bg-white text-gray-800 hover:bg-gray-50`}
          >
            <Mail className="mr-2 h-4 w-4" aria-hidden />
            {contactEmail}
          </a>
        </div>
      </div>
    </div>
  )
}

export default MaintenancePage
