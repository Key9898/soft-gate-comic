import { Prisma } from '@prisma/client'
import {
  parsePortalSettings,
  STUB_PORTAL_SETTINGS,
  type PortalSettings,
} from '@softgate/shared/settings'

export const PLATFORM_SETTINGS_ID = 'platform'

export type AdminPlatformSettingsRow = {
  id: string
  maintenanceMode: boolean
  allowRegistration: boolean
  contactEmail: string
  defaultLanguage: 'en' | 'mm'
}

export function portalSettingsFromAdminRow(row: AdminPlatformSettingsRow | null): PortalSettings {
  if (!row) return STUB_PORTAL_SETTINGS
  return parsePortalSettings({
    maintenanceMode: row.maintenanceMode,
    allowRegistration: row.allowRegistration,
    contactEmail: row.contactEmail,
    defaultLanguage: row.defaultLanguage,
  })
}

export function isMissingPlatformSettingsTable(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021'
}
