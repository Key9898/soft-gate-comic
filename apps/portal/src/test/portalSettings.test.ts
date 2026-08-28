import { describe, expect, it } from 'vitest'
import {
  FALLBACK_CONTACT_EMAIL,
  contactEmailOrFallback,
  parsePortalSettings,
} from '@softgate/shared'

describe('parsePortalSettings', () => {
  it('fails open when the payload is missing', () => {
    expect(parsePortalSettings(undefined)).toEqual({
      maintenanceMode: false,
      allowRegistration: true,
      contactEmail: '',
      defaultLanguage: 'en',
    })
  })

  it('treats only explicit true as maintenance', () => {
    expect(parsePortalSettings({ maintenanceMode: true }).maintenanceMode).toBe(true)
    expect(parsePortalSettings({ maintenanceMode: 'true' }).maintenanceMode).toBe(false)
  })

  it('treats only explicit false as registration closed', () => {
    expect(parsePortalSettings({ allowRegistration: false }).allowRegistration).toBe(false)
    expect(parsePortalSettings({}).allowRegistration).toBe(true)
  })

  it('trims contactEmail and treats non-strings as missing', () => {
    expect(parsePortalSettings({ contactEmail: '  ops@example.com  ' }).contactEmail).toBe(
      'ops@example.com'
    )
    expect(parsePortalSettings({ contactEmail: 1 }).contactEmail).toBe('')
  })
})

describe('contactEmailOrFallback', () => {
  it('uses the fallback when email is missing or blank', () => {
    expect(contactEmailOrFallback(undefined)).toEqual({
      email: FALLBACK_CONTACT_EMAIL,
      fromSettings: false,
    })
    expect(contactEmailOrFallback('   ')).toEqual({
      email: FALLBACK_CONTACT_EMAIL,
      fromSettings: false,
    })
  })

  it('keeps a present address', () => {
    expect(contactEmailOrFallback('ops@example.com')).toEqual({
      email: 'ops@example.com',
      fromSettings: true,
    })
  })
})
