export type PortalLanguage = 'en' | 'mm'

export interface PortalSettings {
  maintenanceMode: boolean
  allowRegistration: boolean
  contactEmail: string
  defaultLanguage: PortalLanguage
}

export const FALLBACK_CONTACT_EMAIL = 'support@softgatecomic.com'

export const STUB_PORTAL_SETTINGS: PortalSettings = {
  maintenanceMode: false,
  allowRegistration: true,
  contactEmail: 'admin@softgatecomic.com',
  defaultLanguage: 'en',
}

export const parsePortalSettings = (input: unknown): PortalSettings => {
  const record = input && typeof input === 'object' ? (input as Record<string, unknown>) : {}
  const language = record.defaultLanguage
  return {
    maintenanceMode: record.maintenanceMode === true,
    allowRegistration: record.allowRegistration !== false,
    contactEmail: typeof record.contactEmail === 'string' ? record.contactEmail.trim() : '',
    defaultLanguage: language === 'mm' || language === 'en' ? language : 'en',
  }
}

export const contactEmailOrFallback = (email: string | undefined) => {
  const trimmed = email?.trim() ?? ''
  if (!trimmed) {
    return { email: FALLBACK_CONTACT_EMAIL, fromSettings: false }
  }
  return { email: trimmed, fromSettings: true }
}
