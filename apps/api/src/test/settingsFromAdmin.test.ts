import { Prisma } from '@prisma/client'
import { STUB_PORTAL_SETTINGS } from '@softgate/shared/settings'
import { describe, expect, it } from 'vitest'
import {
  isMissingPlatformSettingsTable,
  portalSettingsFromAdminRow,
  type AdminPlatformSettingsRow,
} from '../settings/fromAdmin.js'

const closed: AdminPlatformSettingsRow = {
  id: 'platform',
  maintenanceMode: true,
  allowRegistration: false,
  contactEmail: 'ops@softgatecomic.com',
  defaultLanguage: 'mm',
}

describe('portalSettingsFromAdminRow', () => {
  it('returns stub defaults when the row is missing', () => {
    expect(portalSettingsFromAdminRow(null)).toEqual(STUB_PORTAL_SETTINGS)
  })

  it('maps maintenance on and registration closed', () => {
    expect(portalSettingsFromAdminRow(closed)).toEqual({
      maintenanceMode: true,
      allowRegistration: false,
      contactEmail: 'ops@softgatecomic.com',
      defaultLanguage: 'mm',
    })
  })
})

describe('isMissingPlatformSettingsTable', () => {
  it('is true for P2021', () => {
    const error = new Prisma.PrismaClientKnownRequestError('The table does not exist', {
      code: 'P2021',
      clientVersion: Prisma.prismaVersion.client,
    })
    expect(isMissingPlatformSettingsTable(error)).toBe(true)
  })

  it('is false for other Prisma codes and plain errors', () => {
    const taken = new Prisma.PrismaClientKnownRequestError('Unique constraint', {
      code: 'P2002',
      clientVersion: Prisma.prismaVersion.client,
    })
    expect(isMissingPlatformSettingsTable(taken)).toBe(false)
    expect(isMissingPlatformSettingsTable(new Error('down'))).toBe(false)
  })
})
