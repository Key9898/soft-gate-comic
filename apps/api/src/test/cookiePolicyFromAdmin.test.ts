import { Prisma } from '@prisma/client'
import { describe, expect, it } from 'vitest'
import {
  isMissingCookieTable,
  portalCookiesFromAdmin,
  portalRowsFromAdminRows,
  STUB_COOKIES,
  type AdminCookieRow,
} from '../cookiePolicy/fromAdmin.js'

const published: AdminCookieRow = {
  id: 'wallet',
  storageKey: 'softgate_wallet_v1',
  label: { en: 'Coin wallet', mm: 'Coin ပိုက်ဆံအိတ်' },
  description: { en: 'Balance.', mm: 'လက်ကျန်။' },
  sortOrder: 4,
}

describe('portalRowsFromAdminRows', () => {
  it('drops unknown storageKey rows', () => {
    const mapped = portalRowsFromAdminRows([
      { ...published, id: 'mystery', storageKey: 'softgate_unknown_v9' },
      published,
    ])
    expect(mapped).toHaveLength(1)
    expect(mapped[0]?.id).toBe('wallet')
  })
})

describe('portalCookiesFromAdmin', () => {
  it('uses stub copy when meta is missing and rows are empty', () => {
    const cookies = portalCookiesFromAdmin({ meta: null, rows: [] })
    expect(cookies.rows).toHaveLength(STUB_COOKIES.rows.length)
    expect(cookies.copy.cookiesTitle).toEqual(STUB_COOKIES.copy.cookiesTitle)
  })

  it('keeps empty rows when meta exists', () => {
    const cookies = portalCookiesFromAdmin({
      meta: {
        id: 'cookies',
        effectiveDate: '2026-10-01',
        copy: STUB_COOKIES.copy,
        glance: STUB_COOKIES.glance,
      },
      rows: [],
    })
    expect(cookies.rows).toEqual([])
    expect(cookies.effectiveDate).toBe('2026-10-01')
  })

  it('falls back to stub glance when length is not 5', () => {
    const cookies = portalCookiesFromAdmin({
      meta: {
        id: 'cookies',
        effectiveDate: '2026-09-10',
        copy: STUB_COOKIES.copy,
        glance: [{ en: 'one', mm: 'one' }],
      },
      rows: [],
    })
    expect(cookies.glance).toHaveLength(5)
    expect(cookies.glance[0]?.en).toBe(STUB_COOKIES.glance[0]?.en)
  })
})

describe('isMissingCookieTable', () => {
  it('detects Prisma P2021', () => {
    const error = new Prisma.PrismaClientKnownRequestError('missing', {
      code: 'P2021',
      clientVersion: Prisma.prismaVersion.client,
    })
    expect(isMissingCookieTable(error)).toBe(true)
    expect(isMissingCookieTable(new Error('down'))).toBe(false)
  })
})
