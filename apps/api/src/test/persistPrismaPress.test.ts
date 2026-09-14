import type { PrismaClient } from '@prisma/client'
import { describe, expect, it, vi } from 'vitest'
import { createPrismaPersist } from '../persist-prisma.js'

const bi = (text: string) => ({ en: text, mm: text })

type PressMetaRow = {
  id: string
  copy: unknown
  zipUrl: string
  contactEmail: string
  facts: unknown
  palette: unknown
  assets: unknown
  spokespersonMemberId: string | null
}

const pressMeta = (spokespersonMemberId: string | null): PressMetaRow => ({
  id: 'press',
  copy: { boilerplate: bi('Live boilerplate.') },
  zipUrl: '/press-kit/softgate-comic-press-kit.zip',
  contactEmail: 'desk@softgatecomic.com',
  facts: [],
  palette: [],
  assets: [],
  spokespersonMemberId,
})

const member = (published: boolean) => ({
  id: 'm1',
  name: bi('Nandar Aye'),
  role: bi('Founder'),
  photoUrl: null,
  sortOrder: 0,
  published,
})

/**
 * Records every aboutTeamMember read so the test can assert that getPress
 * never scans the whole team table.
 */
function fakeClient(options: { meta: PressMetaRow | null; member?: ReturnType<typeof member> }) {
  const findMany = vi.fn(async () => [])
  const memberFindMany = vi.fn(async () => (options.member ? [options.member] : []))
  const memberFindUnique = vi.fn(async ({ where }: { where: { id: string } }) =>
    options.member && options.member.id === where.id ? options.member : null
  )
  return {
    client: {
      pressMeta: { findUnique: vi.fn(async () => options.meta) },
      pressNews: { findMany },
      pressStill: { findMany },
      aboutTeamMember: { findMany: memberFindMany, findUnique: memberFindUnique },
      $connect: vi.fn(async () => undefined),
      $disconnect: vi.fn(async () => undefined),
    },
    memberFindMany,
    memberFindUnique,
  }
}

describe('createPrismaPersist getPress spokesperson lookup', () => {
  it('does not touch the team table when no spokesperson is configured', async () => {
    const { client, memberFindMany, memberFindUnique } = fakeClient({ meta: pressMeta(null) })
    const persist = createPrismaPersist('postgres://unused', client as unknown as PrismaClient)

    const press = await persist.getPress()

    expect(press.spokesperson).toBeUndefined()
    expect(memberFindMany).not.toHaveBeenCalled()
    expect(memberFindUnique).not.toHaveBeenCalled()
  })

  it('reads only the referenced member instead of scanning the team table', async () => {
    const { client, memberFindMany, memberFindUnique } = fakeClient({
      meta: pressMeta('m1'),
      member: member(true),
    })
    const persist = createPrismaPersist('postgres://unused', client as unknown as PrismaClient)

    const press = await persist.getPress()

    expect(press.spokesperson?.name.en).toBe('Nandar Aye')
    expect(memberFindMany).not.toHaveBeenCalled()
    expect(memberFindUnique).toHaveBeenCalledTimes(1)
    expect(memberFindUnique.mock.calls[0]?.[0]).toMatchObject({ where: { id: 'm1' } })
  })

  it('omits an unpublished spokesperson', async () => {
    const { client } = fakeClient({ meta: pressMeta('m1'), member: member(false) })
    const persist = createPrismaPersist('postgres://unused', client as unknown as PrismaClient)

    const press = await persist.getPress()

    expect(press.spokesperson).toBeUndefined()
  })

  it('omits a spokesperson whose member row is gone', async () => {
    const { client, memberFindUnique } = fakeClient({ meta: pressMeta('missing') })
    const persist = createPrismaPersist('postgres://unused', client as unknown as PrismaClient)

    const press = await persist.getPress()

    expect(press.spokesperson).toBeUndefined()
    expect(memberFindUnique).toHaveBeenCalledTimes(1)
  })
})
