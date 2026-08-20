export type { ContentRating, AgeConfirmRecord, AgeConfirmStore } from './types'
export {
  CONTENT_RATINGS,
  AGE_CONFIRM_SESSION_KEY,
  AGE_CONFIRM_STORAGE_KEY,
  AGE_CONFIRM_SCHEMA_VERSION,
} from './types'
export { readAgeConfirmStore, writeAgeConfirmStore } from './storage'
export { hasAgeConfirm, confirmAge, promoteSessionAgeConfirm } from './ageConfirm'
export {
  isMature18,
  requiresAgeConfirm,
  contentRatingLabelKey,
  contentRatingSchemaText,
} from './labels'
