import { describe, expect, it } from 'vitest'
import { portalLegalFromAdmin, STUB_PRIVACY, type AdminLegalMetaRow } from '../legal/fromAdmin.js'

const bi = (text: string) => ({ en: text, mm: text })

const metaRow = (effectiveDate: Date | string): AdminLegalMetaRow => ({
  id: 'privacy',
  seoDesc: bi('Live privacy SEO'),
  glance: [bi('Live glance.')],
  effectiveDate,
})

describe('portalLegalFromAdmin effectiveDate', () => {
  it('keeps the Yangon calendar day for a DateTime stored at Yangon midnight', () => {
    // 2026-09-10T00:00+06:30 is 2026-09-09T17:30Z — UTC truncation would publish 9 September.
    const page = portalLegalFromAdmin(STUB_PRIVACY, {
      meta: metaRow(new Date('2026-09-09T17:30:00.000Z')),
      sections: [],
    })
    expect(page.effectiveDate).toBe('2026-09-10')
  })

  it('keeps the Yangon calendar day for a DateTime stored at UTC midnight', () => {
    const page = portalLegalFromAdmin(STUB_PRIVACY, {
      meta: metaRow(new Date('2026-09-10T00:00:00.000Z')),
      sections: [],
    })
    expect(page.effectiveDate).toBe('2026-09-10')
  })

  it('passes a date-only string through untouched', () => {
    const page = portalLegalFromAdmin(STUB_PRIVACY, {
      meta: metaRow('2026-10-01'),
      sections: [],
    })
    expect(page.effectiveDate).toBe('2026-10-01')
  })

  it('falls back to the seed date for an unparsable string', () => {
    const page = portalLegalFromAdmin(STUB_PRIVACY, {
      meta: metaRow('not a date'),
      sections: [],
    })
    expect(page.effectiveDate).toBe(STUB_PRIVACY.effectiveDate)
  })

  it('falls back to the seed date for an invalid Date', () => {
    const page = portalLegalFromAdmin(STUB_PRIVACY, {
      meta: metaRow(new Date('nonsense')),
      sections: [],
    })
    expect(page.effectiveDate).toBe(STUB_PRIVACY.effectiveDate)
  })
})
