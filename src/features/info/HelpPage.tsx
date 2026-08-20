import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  BookOpen,
  CreditCard,
  Shield,
  HelpCircle,
  FileText,
  ArrowRight,
  Search,
  PenLine,
  Bookmark,
  Flag,
} from 'lucide-react'
import SEO from '../../components/SEO/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import PageHeader from '../../components/PageHeader'
import { getInfoPageMeta } from '../../lib/info/pageMeta'
import { FAQ_POPULAR_IDS, filterFaqItems, getFaqItemById } from '../../lib/info/faqCatalog'

const SECTION_HEADING =
  'flex items-center gap-2 text-xl font-bold tracking-wider text-balance text-gray-900 uppercase'

const SECTION_RULE = 'border-t border-gray-200/60 py-20'

const CARD = 'rounded-3xl border border-gray-200/60 bg-white shadow-sm'

const PRIMARY_CTA =
  'bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500 flex min-h-[44px] items-center justify-center rounded-2xl px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-md shadow-primary-500/10 transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const HelpPage = () => {
  const { t } = useTranslation()
  const page = getInfoPageMeta('help', t)
  const [searchQuery, setSearchQuery] = useState('')

  const topics = [
    {
      icon: BookOpen,
      title: t('help.gettingStarted'),
      desc: t('help.topicReading'),
      to: '/faq?cat=general',
    },
    {
      icon: CreditCard,
      title: t('help.payments'),
      desc: t('help.topicCoins'),
      to: '/faq?cat=payments',
    },
    {
      icon: Shield,
      title: t('help.accountSecurity'),
      desc: t('help.topicAccount'),
      to: '/faq?cat=account',
    },
    {
      icon: Bookmark,
      title: t('help.library'),
      desc: t('help.topicLibrary'),
      to: '/faq#q16',
    },
    {
      icon: Flag,
      title: t('help.safety'),
      desc: t('help.topicSafety'),
      to: '/faq#q18',
    },
    {
      icon: HelpCircle,
      title: t('footer.contact'),
      desc: t('help.topicContact'),
      to: '/contact',
    },
  ]

  const popularArticles = FAQ_POPULAR_IDS.map((id) => getFaqItemById(id)).filter(
    (item): item is NonNullable<ReturnType<typeof getFaqItemById>> => Boolean(item)
  )

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return []
    return filterFaqItems(searchQuery, t)
  }, [searchQuery, t])

  const showSearchPanel = searchQuery.trim().length >= 2

  return (
    <div className="relative min-h-screen bg-gray-50 pb-20">
      <SEO
        title={t('footer.help')}
        description={t('help.honestIntro')}
        url="https://softgatecomic.com/help"
      />
      <div className="radial-wash-primary pointer-events-none absolute top-0 left-1/2 h-[450px] w-full max-w-7xl -translate-x-1/2" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={page.breadcrumbs} className="mb-6" />
        <PageHeader variant="compact" eyebrow={page.eyebrow} title={page.title} deck={page.deck}>
          <div className="relative max-w-3xl">
            <input
              type="search"
              aria-label={t('help.searchPlaceholder')}
              placeholder={t('help.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus:ring-primary-500 min-h-11 w-full rounded-2xl border-none bg-gray-100 py-3.5 pr-4 pl-11 text-sm font-bold text-gray-950 transition placeholder:text-gray-400 focus:bg-white focus:ring-2"
            />
            <Search
              className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </PageHeader>

        {showSearchPanel ? (
          <div className={`${CARD} max-w-3xl p-6 sm:p-8`}>
            {searchResults.length > 0 ? (
              <ul className="space-y-2">
                {searchResults.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/faq#${item.id}`}
                      className="hover:border-primary-300 focus-visible:ring-primary-500 flex min-h-11 items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <span>{t(item.qKey)}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm font-bold text-gray-500">
                {t('help.searchNoResults')}{' '}
                <Link
                  to="/contact"
                  className="text-primary-600 hover:text-primary-700 focus-visible:ring-primary-500 rounded font-bold underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                >
                  {t('footer.contact')}
                </Link>
              </p>
            )}
          </div>
        ) : null}

        <div className={`${CARD} mt-6 p-6 sm:p-8`}>
          <p className="text-sm text-gray-600">{t('help.honestIntro')}</p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {topics.map((topic) => (
              <Link
                key={topic.to}
                to={topic.to}
                className="hover:border-primary-300 focus-visible:ring-primary-500 flex min-h-11 flex-col rounded-2xl border border-gray-200 p-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <topic.icon className="text-primary-600 mb-2 h-7 w-7" />
                <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{topic.desc}</p>
              </Link>
            ))}
          </div>

          <Link
            to="/faq"
            className="hover:border-primary-300 focus-visible:ring-primary-500 bg-primary-500/10 mt-8 flex min-h-11 items-center justify-between gap-3 rounded-2xl px-4 py-3 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <span>
              <span className="text-primary-700 block font-semibold">{t('help.browseAll')}</span>
              <span className="mt-0.5 block text-sm text-gray-600">{t('help.browseAllHint')}</span>
            </span>
            <ArrowRight className="text-primary-600 h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </div>

        <section className={SECTION_RULE} aria-labelledby="help-popular">
          <h2 id="help-popular" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5 shrink-0" aria-hidden="true" />
            {t('help.popularArticles')}
          </h2>
          <ul className="mt-8 space-y-2">
            {popularArticles.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/faq#${item.id}`}
                  className="hover:border-primary-300 focus-visible:ring-primary-500 flex min-h-11 items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span className="flex items-center gap-3">
                    <FileText className="text-primary-500 h-4 w-4 shrink-0" aria-hidden="true" />
                    {t(item.qKey)}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={SECTION_RULE}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className={`${CARD} p-6 sm:p-8`} aria-labelledby="help-creators">
              <h2 id="help-creators" className={SECTION_HEADING}>
                <span
                  className="bg-primary-500 shape-circle h-2.5 w-2.5 shrink-0"
                  aria-hidden="true"
                />
                {t('help.creatorsLine')}
              </h2>
              <div className="mt-6 flex items-start gap-3">
                <PenLine className="text-primary-600 mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm leading-relaxed text-gray-600">{t('help.creatorsDesc')}</p>
                  <Link
                    to="/creators"
                    className="link mt-3 inline-flex min-h-11 items-center text-sm font-bold"
                  >
                    {t('footer.creators')}
                  </Link>
                </div>
              </div>
            </article>

            <article className={`${CARD} p-6 sm:p-8`} aria-labelledby="help-need-more">
              <h2 id="help-need-more" className={SECTION_HEADING}>
                <span
                  className="bg-primary-500 shape-circle h-2.5 w-2.5 shrink-0"
                  aria-hidden="true"
                />
                {t('help.needMore')}
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-gray-600">{t('help.needMoreDesc')}</p>
              <Link to="/contact" className={`${PRIMARY_CTA} mt-6 w-fit`}>
                {t('footer.contact')}
              </Link>
            </article>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HelpPage
