import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookOpen, CreditCard, Shield, HelpCircle, FileText, ArrowRight } from 'lucide-react'
import SEO from '../../components/SEO/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import PageHeader from '../../components/PageHeader'
import { getInfoPageMeta } from '../../lib/info/pageMeta'

const HelpPage = () => {
  const { t } = useTranslation()
  const page = getInfoPageMeta('help', t)

  const topics = [
    {
      icon: BookOpen,
      title: t('help.gettingStarted'),
      desc: t('help.topicReading'),
      to: '/faq',
    },
    {
      icon: CreditCard,
      title: t('help.payments'),
      desc: t('help.topicCoins'),
      to: '/coins',
    },
    {
      icon: Shield,
      title: t('help.accountSecurity'),
      desc: t('help.topicAccount'),
      to: '/profile',
    },
    {
      icon: HelpCircle,
      title: t('footer.contact'),
      desc: t('help.topicContact'),
      to: '/contact',
    },
  ]

  const popularArticles = [t('faq.q2'), t('faq.q7'), t('faq.q12'), t('faq.q13'), t('faq.q14')]

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <SEO
        title={t('footer.help')}
        description={t('help.honestIntro')}
        url="https://softgatecomic.com/help"
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={page.breadcrumbs} className="mb-6" />
        <PageHeader variant="compact" eyebrow={page.eyebrow} title={page.title} deck={page.deck} />

        <div className="mt-6 max-w-3xl rounded-3xl border border-gray-200/60 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-gray-600">{t('help.honestIntro')}</p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {topics.map((topic) => (
              <Link
                key={topic.title}
                to={topic.to}
                className="hover:border-primary-300 focus-visible:ring-primary-500 rounded-2xl border border-gray-200 p-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <topic.icon className="text-primary-600 mb-2 h-7 w-7" />
                <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{topic.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <section aria-labelledby="help-popular" className="mt-8 max-w-3xl">
          <h2
            id="help-popular"
            className="text-lg font-bold tracking-wider text-gray-900 uppercase"
          >
            {t('help.popularArticles')}
          </h2>
          <ul className="mt-4 space-y-2">
            {popularArticles.map((question) => (
              <li key={question}>
                <Link
                  to="/faq"
                  className="hover:border-primary-300 focus-visible:ring-primary-500 flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span className="flex items-center gap-3">
                    <FileText className="text-primary-500 h-4 w-4 shrink-0" aria-hidden />
                    {question}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 max-w-3xl rounded-3xl border border-gray-200/60 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-gray-900">{t('help.needMore')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{t('help.needMoreDesc')}</p>
          <Link
            to="/contact"
            className="bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500 mt-5 inline-block rounded-2xl px-6 py-2.5 text-sm font-medium text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {t('footer.contact')}
          </Link>
        </section>
      </div>
    </div>
  )
}

export default HelpPage
