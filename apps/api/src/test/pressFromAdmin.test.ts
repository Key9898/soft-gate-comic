import { Prisma } from '@prisma/client'
import { describe, expect, it } from 'vitest'
import {
  isMissingPressTable,
  portalNewsFromAdminRows,
  portalPressFromAdmin,
  portalSpokespersonFromAdmin,
  STUB_PRESS,
  type AdminPressNewsRow,
} from '../press/fromAdmin.js'

const publishedNews: AdminPressNewsRow = {
  id: 'n1',
  title: { en: 'Launch note', mm: 'စတင်မှု' },
  body: { en: 'A public note.', mm: 'အများသုံး မှတ်ချက်။' },
  href: 'https://softgatecomic.com',
  sortOrder: 0,
  published: true,
  demoBadge: false,
}

describe('portalNewsFromAdminRows', () => {
  it('drops unpublished rows and strips published', () => {
    const mapped = portalNewsFromAdminRows([
      { ...publishedNews, id: 'draft', published: false },
      publishedNews,
    ])
    expect(mapped).toHaveLength(1)
    expect(mapped[0]?.id).toBe('n1')
    expect(mapped[0]).not.toHaveProperty('published')
  })
})

describe('portalSpokespersonFromAdmin', () => {
  it('omits person fields when the member is unpublished or missing', () => {
    expect(
      portalSpokespersonFromAdmin('m1', [
        {
          id: 'm1',
          name: { en: 'Nandar Aye', mm: 'နန္ဒာအေး' },
          role: { en: 'Founder', mm: 'တည်ထောင်သူ' },
          published: false,
          sortOrder: 0,
        },
      ])
    ).toBeUndefined()
    expect(portalSpokespersonFromAdmin('missing', [])).toBeUndefined()
  })

  it('resolves a published About member', () => {
    expect(
      portalSpokespersonFromAdmin('m1', [
        {
          id: 'm1',
          name: { en: 'Nandar Aye', mm: 'နန္ဒာအေး' },
          role: { en: 'Founder', mm: 'တည်ထောင်သူ' },
          photoUrl: '/about/team/team-founder.jpg',
          published: true,
          sortOrder: 0,
        },
      ])
    ).toEqual({
      name: { en: 'Nandar Aye', mm: 'နန္ဒာအေး' },
      role: { en: 'Founder', mm: 'တည်ထောင်သူ' },
      photoUrl: '/about/team/team-founder.jpg',
    })
  })
})

describe('portalPressFromAdmin', () => {
  it('uses stub copy when meta is missing and keeps news empty by default', () => {
    const press = portalPressFromAdmin({ meta: null, news: [], stills: [], members: [] })
    expect(press.copy.boilerplateTitle).toEqual(STUB_PRESS.copy.boilerplateTitle)
    expect(press.news).toEqual([])
    expect(press.stills).toEqual([])
    expect(press.spokesperson).toBeUndefined()
  })
})

describe('isMissingPressTable', () => {
  it('detects Prisma P2021', () => {
    const error = new Prisma.PrismaClientKnownRequestError('missing', {
      code: 'P2021',
      clientVersion: Prisma.prismaVersion.client,
    })
    expect(isMissingPressTable(error)).toBe(true)
    expect(isMissingPressTable(new Error('down'))).toBe(false)
  })
})
