import type { ContentRating } from '@softgate/shared'

export function isMature18(rating: ContentRating): boolean {
  return rating === '18'
}

export function requiresAgeConfirm(webtoon: { contentRating: ContentRating }): boolean {
  return webtoon.contentRating === '18'
}

export function contentRatingLabelKey(rating: ContentRating): `contentRating.${ContentRating}` {
  return `contentRating.${rating}`
}

export function contentRatingSchemaText(rating: ContentRating): string {
  if (rating === 'all') return 'All Ages'
  return `${rating}+`
}
