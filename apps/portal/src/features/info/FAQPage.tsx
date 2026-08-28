import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react'
import SEO from '../../components/SEO/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import PageHeader from '../../components/PageHeader'
import { getInfoPageMeta } from '../../lib/info/pageMeta'
import {
  FAQ_CATEGORY_IDS,
  FAQ_ITEMS,
  getFaqItemById,
  isFaqCategoryId,
  type FaqCatalogItem,
  type FaqCategoryId,
} from '../../lib/info/faqCatalog'

const SECTION_HEADING =
  'flex items-center gap-2 text-xl font-bold tracking-wider text-balance text-gray-900 uppercase'

const SECTION_RULE = 'border-t border-gray-200/60 py-20'

const CARD = 'rounded-3xl border border-gray-200/60 bg-white shadow-sm'

const PRIMARY_CTA =
  'bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500 flex min-h-[44px] items-center justify-center rounded-2xl px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-md shadow-primary-500/10 transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const FAQItem = ({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqCatalogItem
  isOpen: boolean
  onToggle: () => void
}) => {
  const { t } = useTranslation()
  const [vote, setVote] = useState<'yes' | 'no' | null>(null)
  const panelId = `${item.id}-panel`

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300">
      <button
        type="button"
        id={item.id}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex min-h-11 w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
      >
        <span className="pr-4 text-sm font-bold text-gray-950 sm:text-base">{t(item.qKey)}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
            isOpen ? 'text-primary-500 rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={item.id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 px-4.5 py-4">
              <p className="text-xs leading-relaxed font-bold text-gray-600 sm:text-sm">
                {t(item.aKey)}
              </p>

              {item.related && item.related.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {item.related.map((related) => (
                    <li key={`${item.id}-${related.to}`}>
                      <Link
                        to={related.to}
                        className="link inline-flex min-h-11 items-center text-sm font-bold"
                      >
                        {t(related.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-4 flex flex-wrap items-start justify-between gap-3 border-t border-gray-50 pt-3.5">
                <div className="min-w-0 flex-1">
                  <span className="text-2xs font-bold tracking-wider text-gray-400 uppercase">
                    {t('faq.wasHelpful')}
                  </span>
                  <p className="mt-1 text-xs font-medium text-gray-400">{t('faq.feedbackLocal')}</p>
                </div>

                <div className="flex items-center gap-2">
                  {vote === null ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setVote('yes')}
                        className="text-2xs flex min-h-11 items-center gap-1.5 rounded-2xl border border-gray-200 px-3 py-1.5 font-bold text-gray-600 transition-all hover:bg-emerald-50 hover:text-emerald-600"
                      >
                        <ThumbsUp className="h-3 w-3" aria-hidden="true" />
                        {t('faq.yes')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setVote('no')}
                        className="text-2xs flex min-h-11 items-center gap-1.5 rounded-2xl border border-gray-200 px-3 py-1.5 font-bold text-gray-600 transition-all hover:bg-red-50 hover:text-red-600"
                      >
                        <ThumbsDown className="h-3 w-3" aria-hidden="true" />
                        {t('faq.no')}
                      </button>
                    </>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xs flex items-center gap-1.5 font-bold text-emerald-600"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {t('faq.feedbackThanks')}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const FAQPage = () => {
  const { t } = useTranslation()
  const page = getInfoPageMeta('faq', t)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    const hashId = location.hash.replace(/^#/, '')
    const hashed = getFaqItemById(hashId)
    if (hashed) {
      setActiveCategory(hashed.category)
      setOpenId(hashed.id)
      requestAnimationFrame(() => {
        document.getElementById(hashed.id)?.scrollIntoView?.({ block: 'start' })
      })
      return
    }
    const cat = searchParams.get('cat')
    if (isFaqCategoryId(cat)) {
      setActiveCategory(cat)
    }
  }, [location.hash, searchParams])

  const filteredFAQ = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase()
    const visible = FAQ_ITEMS.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false
      if (!needle) return true
      return (
        t(item.qKey).toLowerCase().includes(needle) || t(item.aKey).toLowerCase().includes(needle)
      )
    })

    return FAQ_CATEGORY_IDS.map((id: FaqCategoryId) => ({
      id,
      category: t(`faq.${id}`),
      items: visible.filter((item) => item.category === id),
    })).filter((group) => group.items.length > 0)
  }, [activeCategory, searchQuery, t])

  return (
    <div className="relative min-h-screen bg-gray-50 pb-20 transition-colors duration-300">
      <SEO title={t('footer.faq')} description={t('faq.intro')} path="/faq" />
      <div className="radial-wash-primary pointer-events-none absolute top-0 left-1/2 h-[450px] w-full max-w-7xl -translate-x-1/2" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 text-left sm:px-6 lg:px-8">
        <Breadcrumb items={page.breadcrumbs} className="mb-6" />
        <PageHeader variant="compact" eyebrow={page.eyebrow} title={page.title} deck={page.deck}>
          <div className="relative max-w-3xl">
            <input
              type="search"
              aria-label={t('faq.searchPlaceholder')}
              placeholder={t('faq.searchPlaceholder')}
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

        <section className={`${SECTION_RULE} max-w-3xl`} aria-labelledby="faq-questions">
          <h2 id="faq-questions" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5 shrink-0" aria-hidden="true" />
            {t('faq.intro')}
          </h2>
          <div className={`${CARD} mt-8 p-6 sm:p-8`}>
            <div className="mb-8 flex flex-wrap gap-2.5">
              {[
                { id: 'all', label: t('faq.all') },
                { id: 'general', label: t('faq.general') },
                { id: 'account', label: t('faq.account') },
                { id: 'payments', label: t('faq.payments') },
                { id: 'content', label: t('faq.content') },
              ].map((cat) => {
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`relative flex min-h-11 items-center justify-center rounded-2xl px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all ${
                      isActive ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="relative z-10">{cat.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeFaqCategoryBackground"
                        className="bg-primary-600 absolute inset-0 rounded-2xl"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="space-y-6">
              {filteredFAQ.map((cat) => (
                <div key={cat.id} className="space-y-3">
                  <h3 className="text-primary-500 pl-1.5 text-sm font-bold tracking-wider uppercase">
                    {cat.category}
                  </h3>
                  <div className="space-y-2">
                    {cat.items.map((item) => (
                      <FAQItem
                        key={item.id}
                        item={item}
                        isOpen={openId === item.id}
                        onToggle={() =>
                          setOpenId((current) => (current === item.id ? null : item.id))
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}

              {filteredFAQ.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm font-bold text-gray-500">{t('faq.noResults')}</p>
                  <p className="mt-2 text-xs font-medium text-gray-400">
                    {t('faq.noResultsDesc')}{' '}
                    <Link
                      to="/contact"
                      className="text-primary-600 hover:text-primary-700 focus-visible:ring-primary-500 rounded font-bold underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {t('footer.contact')}
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className={`${SECTION_RULE} max-w-3xl`} aria-labelledby="faq-still-need">
          <h2 id="faq-still-need" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5 shrink-0" aria-hidden="true" />
            {t('faq.stillNeedHelp')}
          </h2>
          <div className={`${CARD} mt-8 p-6 sm:p-8`}>
            <p className="text-sm leading-relaxed text-gray-600">{t('faq.stillNeedHelpDesc')}</p>
            <Link to="/contact" className={`${PRIMARY_CTA} mt-6 w-fit`}>
              {t('footer.contact')}
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default FAQPage
