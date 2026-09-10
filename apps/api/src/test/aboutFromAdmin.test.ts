import { Prisma } from '@prisma/client'
import { describe, expect, it } from 'vitest'
import {
  isMissingAboutTable,
  portalHistoriesFromAdminRows,
  portalMembersFromAdminRows,
  portalMetaFromAdminRow,
  STUB_ABOUT,
  type AdminAboutHistoryRow,
  type AdminAboutTeamMemberRow,
} from '../about/fromAdmin.js'

const publishedHistory: AdminAboutHistoryRow = {
  id: 'h1',
  year: 2026,
  month: 1,
  title: { en: 'Founded', mm: 'တည်ထောင်ခြင်း' },
  description: { en: 'A studio.', mm: 'စတူဒီယို။' },
  photoUrl: 'https://cdn.example/found.jpg',
  sortOrder: 0,
  published: true,
}

const unpublishedHistory: AdminAboutHistoryRow = {
  ...publishedHistory,
  id: 'h-draft',
  month: 2,
  published: false,
}

const emptyPhotoHistory: AdminAboutHistoryRow = {
  ...publishedHistory,
  id: 'h-empty',
  month: 4,
  photoUrl: '',
}

const publishedMember: AdminAboutTeamMemberRow = {
  id: 'm1',
  name: { en: 'Nandar Aye', mm: 'နန္ဒာအေး' },
  role: { en: 'Founder', mm: 'တည်ထောင်သူ' },
  photoUrl: 'https://cdn.example/nandar.jpg',
  sortOrder: 0,
  published: true,
}

describe('portalHistoriesFromAdminRows', () => {
  it('drops unpublished rows', () => {
    expect(portalHistoriesFromAdminRows([unpublishedHistory, publishedHistory])).toEqual([
      {
        id: 'h1',
        year: 2026,
        month: 1,
        title: { en: 'Founded', mm: 'တည်ထောင်ခြင်း' },
        description: { en: 'A studio.', mm: 'စတူဒီယို။' },
        sortOrder: 0,
        photoUrl: 'https://cdn.example/found.jpg',
      },
    ])
  })

  it('omits empty photoUrl and keeps a nonempty photo', () => {
    const mapped = portalHistoriesFromAdminRows([emptyPhotoHistory, publishedHistory])
    expect(mapped.find((row) => row.id === 'h-empty')?.photoUrl).toBeUndefined()
    expect(mapped.find((row) => row.id === 'h1')?.photoUrl).toBe('https://cdn.example/found.jpg')
  })

  it('returns an empty list when there are no rows', () => {
    expect(portalHistoriesFromAdminRows([])).toEqual([])
  })
})

describe('portalMembersFromAdminRows', () => {
  it('drops unpublished rows and omits empty photoUrl', () => {
    expect(
      portalMembersFromAdminRows([
        { ...publishedMember, published: false },
        { ...publishedMember, id: 'm2', sortOrder: 1, photoUrl: '' },
        publishedMember,
      ])
    ).toEqual([
      {
        id: 'm1',
        name: { en: 'Nandar Aye', mm: 'နန္ဒာအေး' },
        role: { en: 'Founder', mm: 'တည်ထောင်သူ' },
        sortOrder: 0,
        photoUrl: 'https://cdn.example/nandar.jpg',
      },
      {
        id: 'm2',
        name: { en: 'Nandar Aye', mm: 'နန္ဒာအေး' },
        role: { en: 'Founder', mm: 'တည်ထောင်သူ' },
        sortOrder: 1,
      },
    ])
  })

  it('returns an empty list when there are no rows', () => {
    expect(portalMembersFromAdminRows([])).toEqual([])
  })
})

describe('portalMetaFromAdminRow', () => {
  it('returns stub meta when the row is missing', () => {
    expect(portalMetaFromAdminRow(null)).toEqual(STUB_ABOUT.meta)
  })
})

describe('isMissingAboutTable', () => {
  it('is true for P2021', () => {
    const error = new Prisma.PrismaClientKnownRequestError('The table does not exist', {
      code: 'P2021',
      clientVersion: Prisma.prismaVersion.client,
    })
    expect(isMissingAboutTable(error)).toBe(true)
  })

  it('is false for other Prisma codes and plain errors', () => {
    const taken = new Prisma.PrismaClientKnownRequestError('Unique constraint', {
      code: 'P2002',
      clientVersion: Prisma.prismaVersion.client,
    })
    expect(isMissingAboutTable(taken)).toBe(false)
    expect(isMissingAboutTable(new Error('down'))).toBe(false)
  })
})
