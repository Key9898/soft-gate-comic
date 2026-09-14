import { buttonClasses } from '../../../components/Button'

/**
 * The info pages (About, Help, FAQ, Press, Creators, Maintenance, 404) speak in an
 * editorial voice: small uppercase labels with wide tracking, not the sentence-case
 * app CTA. That is a deliberate difference in register, and it used to be re-derived
 * in six files — `PRIMARY_CTA` existed in three mutually incompatible forms.
 *
 * Sizing, focus and the touch floor come from `buttonClasses`; only the voice lives here.
 */
const EDITORIAL_VOICE = 'text-xs font-bold uppercase tracking-wider'

export const INFO_PRIMARY_CTA = buttonClasses({
  variant: 'primary',
  size: 'lg',
  className: `${EDITORIAL_VOICE} shadow-md shadow-primary-500/10`,
})

export const INFO_SECONDARY_CTA = buttonClasses({
  variant: 'surface',
  size: 'lg',
  className: EDITORIAL_VOICE,
})

/** Compact bordered chip used for tables of contents and related-page strips. */
export const INFO_TOC_LINK = buttonClasses({
  variant: 'surface',
  size: 'sm',
  className: `${EDITORIAL_VOICE} hover:border-primary-300 hover:text-primary-700`,
})

/**
 * Destination tiles on recovery surfaces (404, author, categories empty state):
 * full-width, icon + label, one per row on a phone.
 */
export const DESTINATION_TILE = buttonClasses({
  variant: 'surface',
  size: 'md',
  className: 'hover:border-primary-300 w-full py-3 text-sm font-semibold',
})

/**
 * The info pages share one editorial section rhythm: a rule, a wide-tracked heading,
 * and a large white panel. These were five byte-identical copies before.
 */
export const INFO_SECTION_HEADING =
  'flex items-center gap-2 text-xl font-bold tracking-wider text-balance text-gray-900 uppercase'

export const INFO_SECTION_RULE = 'border-t border-gray-200/60 py-20'

export { PANEL_CLASS as INFO_CARD } from '../../../components/Card'
