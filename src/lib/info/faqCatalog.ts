export type FaqCategoryId = 'general' | 'account' | 'payments' | 'content'

export type FaqRelated = {
  to: string
  labelKey: string
}

export type FaqCatalogItem = {
  id: `q${number}`
  category: FaqCategoryId
  qKey: string
  aKey: string
  related?: FaqRelated[]
}

export const FAQ_CATEGORY_IDS: FaqCategoryId[] = ['general', 'account', 'payments', 'content']

export const FAQ_ITEMS: FaqCatalogItem[] = [
  { id: 'q1', category: 'general', qKey: 'faq.q1', aKey: 'faq.a1' },
  { id: 'q2', category: 'general', qKey: 'faq.q2', aKey: 'faq.a2' },
  { id: 'q3', category: 'general', qKey: 'faq.q3', aKey: 'faq.a3' },
  {
    id: 'q4',
    category: 'account',
    qKey: 'faq.q4',
    aKey: 'faq.a4',
    related: [{ to: '/profile', labelKey: 'faq.relatedProfile' }],
  },
  {
    id: 'q5',
    category: 'account',
    qKey: 'faq.q5',
    aKey: 'faq.a5',
    related: [{ to: '/profile', labelKey: 'faq.relatedProfile' }],
  },
  {
    id: 'q6',
    category: 'account',
    qKey: 'faq.q6',
    aKey: 'faq.a6',
    related: [{ to: '/profile', labelKey: 'faq.relatedProfile' }],
  },
  {
    id: 'q7',
    category: 'payments',
    qKey: 'faq.q7',
    aKey: 'faq.a7',
    related: [{ to: '/coins', labelKey: 'faq.relatedCoins' }],
  },
  {
    id: 'q8',
    category: 'payments',
    qKey: 'faq.q8',
    aKey: 'faq.a8',
    related: [{ to: '/coins', labelKey: 'faq.relatedCoins' }],
  },
  { id: 'q9', category: 'payments', qKey: 'faq.q9', aKey: 'faq.a9' },
  {
    id: 'q10',
    category: 'content',
    qKey: 'faq.q10',
    aKey: 'faq.a10',
    related: [{ to: '/', labelKey: 'faq.relatedHome' }],
  },
  {
    id: 'q11',
    category: 'content',
    qKey: 'faq.q11',
    aKey: 'faq.a11',
    related: [{ to: '/contact', labelKey: 'faq.relatedContact' }],
  },
  {
    id: 'q12',
    category: 'content',
    qKey: 'faq.q12',
    aKey: 'faq.a12',
    related: [{ to: '/coins', labelKey: 'faq.relatedCoins' }],
  },
  {
    id: 'q13',
    category: 'content',
    qKey: 'faq.q13',
    aKey: 'faq.a13',
    related: [{ to: '/', labelKey: 'faq.relatedHome' }],
  },
  {
    id: 'q14',
    category: 'content',
    qKey: 'faq.q14',
    aKey: 'faq.a14',
    related: [{ to: '/creators', labelKey: 'faq.relatedCreators' }],
  },
  {
    id: 'q15',
    category: 'general',
    qKey: 'faq.q15',
    aKey: 'faq.a15',
    related: [{ to: '/profile', labelKey: 'faq.relatedProfile' }],
  },
  {
    id: 'q16',
    category: 'content',
    qKey: 'faq.q16',
    aKey: 'faq.a16',
    related: [{ to: '/library', labelKey: 'faq.relatedLibrary' }],
  },
  {
    id: 'q17',
    category: 'account',
    qKey: 'faq.q17',
    aKey: 'faq.a17',
    related: [{ to: '/notifications', labelKey: 'faq.relatedNotifications' }],
  },
  {
    id: 'q18',
    category: 'content',
    qKey: 'faq.q18',
    aKey: 'faq.a18',
    related: [{ to: '/contact', labelKey: 'faq.relatedContact' }],
  },
  { id: 'q19', category: 'general', qKey: 'faq.q19', aKey: 'faq.a19' },
  {
    id: 'q20',
    category: 'account',
    qKey: 'faq.q20',
    aKey: 'faq.a20',
    related: [{ to: '/profile', labelKey: 'faq.relatedProfile' }],
  },
]

export const FAQ_POPULAR_IDS = ['q2', 'q7', 'q12', 'q13', 'q14'] as const

export function isFaqCategoryId(value: string | null): value is FaqCategoryId {
  return value !== null && (FAQ_CATEGORY_IDS as string[]).includes(value)
}

export function getFaqItemById(id: string): FaqCatalogItem | undefined {
  return FAQ_ITEMS.find((item) => item.id === id)
}

export function filterFaqItems(query: string, getText: (key: string) => string): FaqCatalogItem[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []
  return FAQ_ITEMS.filter((item) => {
    const q = getText(item.qKey).toLowerCase()
    const a = getText(item.aKey).toLowerCase()
    return q.includes(needle) || a.includes(needle)
  })
}
