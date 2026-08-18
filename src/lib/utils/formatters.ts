/**
 * Formats a number into a human-readable string (e.g., 2500000 -> "2.5M")
 */
export const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return count.toString()
}

/**
 * Formats a date string into a localized format.
 * Accepts the app language code ('en' | 'mm') and maps it to a BCP 47 locale.
 */
export const formatDate = (dateString: string, lang: string = 'en'): string => {
  const date = new Date(dateString)
  const locale = lang === 'mm' ? 'my-MM' : lang
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
