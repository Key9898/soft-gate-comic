import type { PortalCookieRow, PortalCookies, CookieCopyKey } from '../cookies'
import type { PortalLegalPage, PortalLegalSection } from '../legal'

/**
 * The i18n copy is the fail-open source for the legal pages. Normalising it into
 * the same shape the API returns lets each page render one tree instead of two,
 * so a layout change cannot land on the live branch and miss the fallback.
 *
 * `t()` already resolves the active language, so both slots carry the same
 * string — `pickLegalText` returns it either way.
 */
type Translate = (key: string) => string

const LEGAL_FALLBACK_DATE = '2026-09-10'

function bi(value: string) {
  return { en: value, mm: value }
}

type SectionSpec = {
  slug: string
  titleKey: string
  bodyKey?: string
  bulletKeys?: string[]
  headingLevel?: PortalLegalSection['headingLevel']
  kind?: PortalLegalSection['kind']
}

const PRIVACY_SPECS: SectionSpec[] = [
  {
    slug: 'collect',
    titleKey: 'static.informationWeCollect',
    bodyKey: 'static.informationWeCollectDesc',
  },
  {
    slug: 'personal',
    titleKey: 'static.personalInfo',
    bodyKey: 'static.personalInfoDesc',
    headingLevel: 'h3',
  },
  {
    slug: 'usage',
    titleKey: 'static.usageData',
    bodyKey: 'static.usageDataDesc',
    headingLevel: 'h3',
  },
  {
    slug: 'reading',
    titleKey: 'static.readingActivity',
    bodyKey: 'static.readingActivityDesc',
    headingLevel: 'h3',
  },
  {
    slug: 'use',
    titleKey: 'static.howWeUse',
    bodyKey: 'static.howWeUseDesc',
    kind: 'bullets',
    bulletKeys: [
      'static.useProvide',
      'static.useImprove',
      'static.useCommunicate',
      'static.useSecurity',
    ],
  },
  { slug: 'sharing', titleKey: 'static.dataSharing', bodyKey: 'static.dataSharingDesc' },
  { slug: 'security', titleKey: 'static.dataSecurity', bodyKey: 'static.dataSecurityDesc' },
  {
    slug: 'rights',
    titleKey: 'static.yourRights',
    bodyKey: 'static.yourRightsDesc',
    kind: 'privacy-rights',
    // LegalCmsSections reads this list positionally: [0] and [1] form the
    // Profile → Security line, [2]-[3] are plain bullets, [4] is the contact link.
    bulletKeys: [
      'static.yourRightsProfile',
      'static.yourRightsDelete',
      'static.yourRightsClear',
      'static.yourRightsGuest',
      'legal.contactPage',
    ],
  },
  {
    slug: 'children',
    titleKey: 'static.childrenPrivacy',
    bodyKey: 'static.childrenPrivacyDesc',
  },
]

const TERMS_SPECS: SectionSpec[] = [
  { slug: 'acceptance', titleKey: 'static.acceptanceTerms', bodyKey: 'static.acceptanceTermsDesc' },
  { slug: 'eligibility', titleKey: 'static.eligibility', bodyKey: 'static.eligibilityDesc' },
  { slug: 'license', titleKey: 'static.useLicense', bodyKey: 'static.useLicenseDesc' },
  {
    slug: 'permitted',
    titleKey: 'static.permitted',
    headingLevel: 'h3',
    kind: 'bullets',
    bulletKeys: ['static.permittedAccess', 'static.permittedPersonal', 'static.permittedDownload'],
  },
  {
    slug: 'prohibited',
    titleKey: 'static.prohibited',
    headingLevel: 'h3',
    kind: 'bullets',
    bulletKeys: [
      'static.prohibitedModify',
      'static.prohibitedCommercial',
      'static.prohibitedReverse',
      'static.prohibitedTransfer',
      'static.prohibitedScrape',
    ],
  },
  { slug: 'accounts', titleKey: 'static.userAccounts', bodyKey: 'static.userAccountsDesc' },
  { slug: 'user-content', titleKey: 'static.userContent', bodyKey: 'static.userContentDesc' },
  {
    slug: 'intellectual',
    titleKey: 'static.intellectualProperty',
    bodyKey: 'static.intellectualPropertyDesc',
  },
  { slug: 'premium', titleKey: 'static.premiumContent', bodyKey: 'static.premiumContentDesc' },
  {
    slug: 'coins',
    titleKey: 'static.coinsVirtual',
    bodyKey: 'static.coinsVirtualDesc',
    kind: 'bullets',
    bulletKeys: [
      'static.coinsNoOwnership',
      'static.coinsNoValue',
      'static.coinsNoTransfer',
      'static.coinsDemo',
    ],
  },
  { slug: 'termination', titleKey: 'static.termination', bodyKey: 'static.terminationDesc' },
  { slug: 'limitation', titleKey: 'static.limitation', bodyKey: 'static.limitationDesc' },
  { slug: 'changes', titleKey: 'static.changesTerms', bodyKey: 'static.changesTermsDesc' },
  { slug: 'governing', titleKey: 'static.governingLaw', bodyKey: 'static.governingLawDesc' },
]

function toSection(spec: SectionSpec, index: number, t: Translate): PortalLegalSection {
  return {
    id: spec.slug,
    slug: spec.slug,
    kind: spec.kind ?? 'body',
    headingLevel: spec.headingLevel ?? 'h2',
    title: bi(t(spec.titleKey)),
    body: bi(spec.bodyKey ? t(spec.bodyKey) : ''),
    bullets: (spec.bulletKeys ?? []).map((key) => bi(t(key))),
    sortOrder: index,
  }
}

export function fallbackLegalPage(doc: 'privacy' | 'terms', t: Translate): PortalLegalPage {
  const specs = doc === 'privacy' ? PRIVACY_SPECS : TERMS_SPECS
  const glancePrefix = doc === 'privacy' ? 'static.privacyGlance' : 'static.termsGlance'
  return {
    seoDesc: bi(t(doc === 'privacy' ? 'static.privacySeoDesc' : 'static.termsSeoDesc')),
    glance: [1, 2, 3, 4, 5].map((n) => bi(t(`${glancePrefix}${n}`))),
    effectiveDate: LEGAL_FALLBACK_DATE,
    sections: specs.map((spec, index) => toSection(spec, index, t)),
  }
}

const COOKIE_COPY_KEYS: CookieCopyKey[] = [
  'cookiesTitle',
  'cookiesSeoDesc',
  'whatAreCookies',
  'whatAreCookiesDesc',
  'howWeUseCookies',
  'howWeUseCookiesDesc',
  'essentialCookies',
  'essentialCookiesDesc',
  'functionalCookies',
  'functionalCookiesDesc',
  'analyticsCookies',
  'analyticsCookiesDesc',
  'marketingCookies',
  'marketingCookiesDesc',
  'storageDetails',
  'storageDetailsDesc',
  'managingCookies',
  'managingCookiesDesc',
  'thirdPartyCookies',
  'thirdPartyCookiesDesc',
  'updatesPolicy',
  'updatesPolicyDesc',
]

const COOKIE_STORAGE_KEYS = [
  'lang',
  'session',
  'accounts',
  'wallet',
  'library',
  'follows',
  'engagement',
  'comments',
  'notifications',
  'notifPrefs',
  'searches',
  'readability',
  'reader',
  'episodeReports',
  'ageConfirm',
  'catalog',
] as const

function storageLabelKey(id: string): string {
  return `static.storage${id.charAt(0).toUpperCase()}${id.slice(1)}`
}

export function fallbackCookies(t: Translate): PortalCookies {
  const copy = {} as PortalCookies['copy']
  for (const key of COOKIE_COPY_KEYS) {
    copy[key] = bi(t(`static.${key}`))
  }

  const rows: PortalCookieRow[] = COOKIE_STORAGE_KEYS.map((id, index) => ({
    id,
    storageKey: id,
    label: bi(t(storageLabelKey(id))),
    description: bi(t(`${storageLabelKey(id)}Desc`)),
    sortOrder: index,
  }))

  return {
    effectiveDate: LEGAL_FALLBACK_DATE,
    copy,
    glance: [1, 2, 3, 4, 5].map((n) => bi(t(`static.cookiesGlance${n}`))),
    rows,
  }
}
