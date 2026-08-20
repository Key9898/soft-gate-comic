import type { ContentRating } from '@softgate/shared'

export type { ContentRating }

export const CONTENT_RATINGS: ContentRating[] = ['all', '13', '16', '18']

export const AGE_CONFIRM_SESSION_KEY = 'softgate_age_confirm_session'
export const AGE_CONFIRM_STORAGE_KEY = 'softgate_age_confirm_v1'
export const AGE_CONFIRM_SCHEMA_VERSION = 1

export interface AgeConfirmRecord {
  confirmedAt: string
}

export interface AgeConfirmStore {
  schemaVersion: number
  byUserId: Record<string, AgeConfirmRecord>
}
