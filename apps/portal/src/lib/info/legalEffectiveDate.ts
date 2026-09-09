export const LEGAL_EFFECTIVE_DATE = new Date(2026, 8, 10)

export function formatLegalEffectiveDate(language: string): string {
  return new Intl.DateTimeFormat(language === 'mm' ? 'my' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(LEGAL_EFFECTIVE_DATE)
}
