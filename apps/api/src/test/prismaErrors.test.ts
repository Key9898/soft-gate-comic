import { Prisma } from '@prisma/client'
import { describe, expect, it } from 'vitest'
import { isMissingTable } from '../prismaErrors.js'

const knownError = (code: string) =>
  new Prisma.PrismaClientKnownRequestError('boom', {
    code,
    clientVersion: Prisma.prismaVersion.client,
  })

describe('isMissingTable', () => {
  it('detects Prisma P2021', () => {
    expect(isMissingTable(knownError('P2021'))).toBe(true)
  })

  it('rejects other known Prisma errors so they keep rethrowing as a 500', () => {
    // P2022 is a changed column — schema drift, not a table Admin has yet to
    // provision. Swallowing it would serve a stub instead of surfacing the bug.
    expect(isMissingTable(knownError('P2022'))).toBe(false)
    expect(isMissingTable(knownError('P2002'))).toBe(false)
  })

  it('rejects anything that is not a known Prisma error', () => {
    expect(isMissingTable(new Error('down'))).toBe(false)
    expect(isMissingTable('P2021')).toBe(false)
    expect(isMissingTable({ code: 'P2021' })).toBe(false)
    expect(isMissingTable(null)).toBe(false)
    expect(isMissingTable(undefined)).toBe(false)
  })
})
