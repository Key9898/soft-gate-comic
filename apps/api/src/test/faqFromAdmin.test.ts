import { Prisma } from '@prisma/client'
import { describe, expect, it } from 'vitest'
import {
  isMissingFaqTable,
  portalFaqFromAdmin,
  portalItemsFromAdminRows,
  STUB_FAQ,
  type AdminFaqItemRow,
} from '../faq/fromAdmin.js'

const published: AdminFaqItemRow = {
  id: 'q1',
  category: 'general',
  question: { en: 'What is SoftGate Comic?', mm: 'SoftGate Comic ဆိုတာ ဘာလဲ' },
  answer: { en: 'A portal.', mm: 'Portal။' },
  sortOrder: 1,
  published: true,
}

describe('portalItemsFromAdminRows', () => {
  it('drops unpublished rows, unknown categories, and unknown relatedTo', () => {
    const mapped = portalItemsFromAdminRows([
      { ...published, id: 'draft', published: false },
      { ...published, id: 'bad-cat', category: 'secret' },
      {
        ...published,
        id: 'q4',
        relatedTo: '/not-a-path',
        relatedLabel: { en: 'Nope', mm: 'Nope' },
      },
      published,
    ])
    expect(mapped.map((row) => row.id)).toEqual(['q1', 'q4'])
    expect(mapped.find((row) => row.id === 'q4')).not.toHaveProperty('relatedTo')
    expect(mapped[0]).not.toHaveProperty('published')
  })
})

describe('portalFaqFromAdmin', () => {
  it('uses stub copy when meta is missing and items are empty', () => {
    const faq = portalFaqFromAdmin({ meta: null, items: [] })
    expect(faq.items).toHaveLength(STUB_FAQ.items.length)
    expect(faq.items[0]?.id).toBe(STUB_FAQ.items[0]?.id)
  })

  it('keeps an empty list when meta exists', () => {
    const faq = portalFaqFromAdmin({ meta: { id: 'faq', nextItemNumber: 21 }, items: [] })
    expect(faq.items).toEqual([])
  })
})

describe('isMissingFaqTable', () => {
  it('detects Prisma P2021', () => {
    const error = new Prisma.PrismaClientKnownRequestError('missing', {
      code: 'P2021',
      clientVersion: Prisma.prismaVersion.client,
    })
    expect(isMissingFaqTable(error)).toBe(true)
    expect(isMissingFaqTable(new Error('down'))).toBe(false)
  })
})
