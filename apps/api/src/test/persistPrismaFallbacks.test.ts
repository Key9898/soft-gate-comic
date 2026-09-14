import { Prisma, type PrismaClient } from '@prisma/client'
import { describe, expect, it, vi } from 'vitest'
import { createPrismaPersist } from '../persist-prisma.js'
import { STUB_PRESS } from '../press/fromAdmin.js'
import { STUB_ABOUT } from '../about/fromAdmin.js'

const bi = (text: string) => ({ en: text, mm: text })

/** The error Prisma raises when the underlying table does not exist. */
const missingTable = () =>
  new Prisma.PrismaClientKnownRequestError('table does not exist', {
    code: 'P2021',
    clientVersion: 'test',
  })

/** Any other known Prisma failure — the convention says these rethrow as a 500. */
const otherPrismaError = () =>
  new Prisma.PrismaClientKnownRequestError('column type changed', {
    code: 'P2022',
    clientVersion: 'test',
  })

const rejects = (error: Error) =>
  vi.fn(async () => {
    throw error
  })

const pressMetaRow = {
  id: 'press',
  copy: { boilerplate: bi('Live boilerplate.') },
  zipUrl: '/press-kit/softgate-comic-press-kit.zip',
  contactEmail: 'desk@softgatecomic.com',
  facts: [],
  palette: [],
  assets: [],
  spokespersonMemberId: 'm1',
}

const memberRow = {
  id: 'm1',
  name: bi('Nandar Aye'),
  role: bi('Founder'),
  photoUrl: null,
  sortOrder: 0,
  published: true,
}

const historyRow = {
  id: 'h1',
  year: 2026,
  month: 1,
  title: bi('Founded'),
  description: bi('A Myanmar-first webtoon studio.'),
  sortOrder: 0,
  published: true,
}

type Overrides = Record<string, Record<string, unknown>>

function client(overrides: Overrides = {}): PrismaClient {
  const base: Overrides = {
    pressMeta: { findUnique: vi.fn(async () => pressMetaRow) },
    pressNews: { findMany: vi.fn(async () => []) },
    pressStill: { findMany: vi.fn(async () => []) },
    aboutHistory: { findMany: vi.fn(async () => [historyRow]) },
    aboutTeamMeta: { findUnique: vi.fn(async () => null) },
    aboutTeamMember: {
      findMany: vi.fn(async () => [memberRow]),
      findUnique: vi.fn(async () => memberRow),
    },
  }
  const merged: Overrides = {}
  for (const key of new Set([...Object.keys(base), ...Object.keys(overrides)])) {
    merged[key] = { ...base[key], ...overrides[key] }
  }
  return merged as unknown as PrismaClient
}

const persistWith = (overrides?: Overrides) =>
  createPrismaPersist('postgres://unused', client(overrides))

describe('getPress table fallbacks', () => {
  it('returns the stub when the press tables are missing', async () => {
    const press = await persistWith({
      pressMeta: { findUnique: rejects(missingTable()) },
      pressNews: { findMany: rejects(missingTable()) },
      pressStill: { findMany: rejects(missingTable()) },
    }).getPress()

    expect(press).toEqual(STUB_PRESS)
  })

  it('returns the stub when the meta is null and there are no news or stills', async () => {
    const press = await persistWith({
      pressMeta: { findUnique: vi.fn(async () => null) },
    }).getPress()

    expect(press).toEqual(STUB_PRESS)
  })

  it('still returns press copy when the About member table is missing', async () => {
    const press = await persistWith({
      aboutTeamMember: { findUnique: rejects(missingTable()) },
    }).getPress()

    expect(press.copy.boilerplate?.en).toBe('Live boilerplate.')
    expect(press.contactEmail).toBe('desk@softgatecomic.com')
    expect(press.spokesperson).toBeUndefined()
  })

  it('rethrows a Prisma error that is not a missing table', async () => {
    await expect(
      persistWith({ pressNews: { findMany: rejects(otherPrismaError()) } }).getPress()
    ).rejects.toMatchObject({ code: 'P2022' })
  })
})

describe('getAbout per-table independence', () => {
  it('keeps histories when the team meta table is missing', async () => {
    const about = await persistWith({
      aboutTeamMeta: { findUnique: rejects(missingTable()) },
    }).getAbout()

    expect(about.histories).toHaveLength(1)
    expect(about.histories[0]?.title.en).toBe('Founded')
    expect(about.meta).toEqual(STUB_ABOUT.meta)
  })

  it('keeps histories when the team member table is missing', async () => {
    const about = await persistWith({
      aboutTeamMember: { findMany: rejects(missingTable()) },
    }).getAbout()

    expect(about.histories).toHaveLength(1)
    expect(about.members).toEqual([])
  })

  it('keeps team members when the history table is missing', async () => {
    const about = await persistWith({
      aboutHistory: { findMany: rejects(missingTable()) },
    }).getAbout()

    expect(about.histories).toEqual([])
    expect(about.members).toHaveLength(1)
    expect(about.members[0]?.name.en).toBe('Nandar Aye')
  })

  it('rethrows a Prisma error that is not a missing table', async () => {
    await expect(
      persistWith({ aboutHistory: { findMany: rejects(otherPrismaError()) } }).getAbout()
    ).rejects.toMatchObject({ code: 'P2022' })
  })
})
