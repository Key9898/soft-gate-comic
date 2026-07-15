import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ChevronDown,
  Search,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react'

// ═══════════════ SUB-COMPONENT: FAQ ACCORDION ITEM ═══════════════
const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [vote, setVote] = useState<'yes' | 'no' | null>(null)

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 dark:border-white/5 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
      >
        <span className="pr-4 text-sm font-bold text-gray-950 sm:text-base dark:text-white">
          {q}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
            isOpen ? 'text-primary-500 rotate-180' : ''
          }`}
        />
      </button>

      {/* Smooth sliding height accordion */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 px-4.5 py-4 dark:border-white/5">
              <p className="text-xs leading-relaxed font-bold text-gray-600 sm:text-sm dark:text-gray-400">
                {a}
              </p>

              {/* Thumbs Feedback Widget */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3.5 dark:border-white/5">
                <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase dark:text-gray-500">
                  Was this helpful?
                </span>

                <div className="flex items-center gap-2">
                  {vote === null ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setVote('yes')}
                        className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-[10px] font-bold text-gray-600 transition-all hover:bg-emerald-50 hover:text-emerald-600 dark:border-white/5 dark:text-gray-400 dark:hover:bg-emerald-950/20"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setVote('no')}
                        className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-[10px] font-bold text-gray-600 transition-all hover:bg-red-50 hover:text-red-600 dark:border-white/5 dark:text-gray-400 dark:hover:bg-red-950/20"
                      >
                        <ThumbsDown className="h-3 w-3" />
                        No
                      </button>
                    </>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Thanks for your feedback!
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

// ═══════════════ MAIN FAQ PAGE ═══════════════
const FAQPage = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const faqCategories = [
    {
      id: 'general',
      category: t('faq.general'),
      questions: [
        { q: t('faq.q1'), a: t('faq.a1') },
        { q: t('faq.q2'), a: t('faq.a2') },
        { q: t('faq.q3'), a: t('faq.a3') },
      ],
    },
    {
      id: 'account',
      category: t('faq.account'),
      questions: [
        { q: t('faq.q4'), a: t('faq.a4') },
        { q: t('faq.q5'), a: t('faq.a5') },
        { q: t('faq.q6'), a: t('faq.a6') },
      ],
    },
    {
      id: 'payments',
      category: t('faq.payments'),
      questions: [
        { q: t('faq.q7'), a: t('faq.a7') },
        { q: t('faq.q8'), a: t('faq.a8') },
        { q: t('faq.q9'), a: t('faq.a9') },
      ],
    },
    {
      id: 'content',
      category: t('faq.content'),
      questions: [
        { q: t('faq.q10'), a: t('faq.a10') },
        { q: t('faq.q11'), a: t('faq.a11') },
      ],
    },
  ]

  // Filter Categories & search match query
  const filteredFAQ = faqCategories
    .filter((cat) => activeCategory === 'all' || cat.id === activeCategory)
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0)

  return (
    <div className="min-h-screen bg-gray-50 pb-12 transition-colors duration-300 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-8 text-left sm:px-6 lg:px-8">
        <Link
          to="/"
          className="hover:text-primary-600 mb-6 inline-flex items-center gap-2 text-xs font-black tracking-wider text-gray-500 uppercase transition-colors dark:text-gray-400"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Link>

        <div className="rounded-3xl border bg-white p-6 shadow-sm sm:p-8 dark:border-white/5 dark:bg-gray-900">
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-primary-50 dark:bg-primary-950/20 flex h-12 w-12 items-center justify-center rounded-2xl">
              <HelpCircle className="text-primary-500 h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 sm:text-2xl dark:text-white">
                {t('static.faqTitle')}
              </h1>
              <p className="mt-0.5 text-xs font-bold text-gray-400 dark:text-gray-500">
                Find answers to commonly asked questions about Soft-Gate Comic.
              </p>
            </div>
          </div>

          {/* Interactive Live Search Input */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search questions or answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus:ring-primary-500 dark:focus:ring-primary-500 w-full rounded-2xl border-none bg-gray-100 py-3.5 pr-4 pl-11 text-sm font-bold text-gray-950 transition placeholder:text-gray-400 focus:bg-white focus:ring-2 dark:bg-white/5 dark:text-white dark:focus:bg-gray-900"
            />
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>

          {/* Category Tabs Pill Grid with Gliding indicator */}
          <div className="mb-8 flex flex-wrap gap-2.5">
            {[
              { id: 'all', label: 'All FAQs' },
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
                  className={`relative flex min-h-[38px] items-center justify-center rounded-full px-4 py-2 text-xs font-black tracking-wider uppercase transition-all ${
                    isActive
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10'
                  }`}
                >
                  <span className="relative z-10">{cat.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeFaqCategoryBackground"
                      className="bg-primary-600 dark:bg-primary-500 absolute inset-0 rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* FAQ Accordion Lists */}
          <div className="space-y-6">
            {filteredFAQ.map((cat) => (
              <div key={cat.id} className="space-y-3">
                <h3 className="text-primary-500 dark:text-primary-400 pl-1.5 text-sm font-black tracking-wider uppercase">
                  {cat.category}
                </h3>
                <div className="space-y-2">
                  {cat.questions.map((faq, index) => (
                    <FAQItem key={`${cat.id}-${index}`} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </div>
            ))}

            {filteredFAQ.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  No questions match your search query. Try another term!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQPage
