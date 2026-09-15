export type DemoSearchChip = {
  readonly en: string
  readonly mm: string
}

/**
 * A chip has to match something. Series titles are the same in both locales
 * (Impl 227), so a Burmese term for one now finds nothing — `ဆိုးလ်` and
 * `သွေးနက်လ` were live until that change. Author names are still translated,
 * which is why `Ko Zaw` keeps its Burmese form.
 */
export const DEMO_SEARCH_CHIPS: readonly DemoSearchChip[] = [
  { en: 'Horizon', mm: 'Horizon' },
  { en: 'Seoul', mm: 'Seoul' },
  { en: 'Shadow Knight', mm: 'Shadow Knight' },
  { en: 'Blood Moon', mm: 'Blood Moon' },
  { en: 'Cyber Dreams', mm: 'Cyber Dreams' },
  { en: 'Ko Zaw', mm: 'ကိုဇော်' },
]
