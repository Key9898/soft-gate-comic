import type { TFunction } from 'i18next'
import type { BreadcrumbItem } from '../../components/Breadcrumb'
import type { PageHeaderVariant } from '../../components/PageHeader'

export type InfoSection = 'company' | 'support' | 'legal'

export const INFO_PAGES = {
  about: {
    section: 'company',
    path: '/about',
    header: 'masthead',
    titleKey: 'static.aboutTitle',
    eyebrowKey: 'info.eyebrow.about',
    deckKey: 'info.deck.about',
  },
  creators: {
    section: 'company',
    path: '/creators',
    header: 'masthead',
    titleKey: 'static.creatorsTitle',
    eyebrowKey: 'info.eyebrow.creators',
    deckKey: 'info.deck.creators',
  },
  press: {
    section: 'company',
    path: '/press',
    header: 'masthead',
    titleKey: 'static.pressTitle',
    eyebrowKey: 'info.eyebrow.press',
    deckKey: 'info.deck.press',
  },
  help: {
    section: 'support',
    path: '/help',
    header: 'compact',
    titleKey: 'static.helpTitle',
    eyebrowKey: 'info.eyebrow.help',
    deckKey: 'info.deck.help',
  },
  faq: {
    section: 'support',
    path: '/faq',
    header: 'compact',
    titleKey: 'static.faqTitle',
    eyebrowKey: 'info.eyebrow.faq',
    deckKey: 'info.deck.faq',
  },
  contact: {
    section: 'support',
    path: '/contact',
    header: 'compact',
    titleKey: 'static.contactTitle',
    eyebrowKey: 'info.eyebrow.contact',
    deckKey: 'info.deck.contact',
  },
  privacy: {
    section: 'legal',
    path: '/privacy',
    header: 'document',
    titleKey: 'static.privacyTitle',
    eyebrowKey: 'info.eyebrow.legal',
    deckKey: 'info.deck.legal',
  },
  terms: {
    section: 'legal',
    path: '/terms',
    header: 'document',
    titleKey: 'static.termsTitle',
    eyebrowKey: 'info.eyebrow.legal',
    deckKey: 'info.deck.legal',
  },
  cookies: {
    section: 'legal',
    path: '/cookies',
    header: 'document',
    titleKey: 'static.cookiesTitle',
    eyebrowKey: 'info.eyebrow.legal',
    deckKey: 'info.deck.legal',
  },
} as const satisfies Record<
  string,
  {
    section: InfoSection
    path: string
    header: PageHeaderVariant
    titleKey: string
    eyebrowKey: string
    deckKey: string
  }
>

export type InfoPageKey = keyof typeof INFO_PAGES

export function buildInfoBreadcrumbs(pageKey: InfoPageKey, t: TFunction): BreadcrumbItem[] {
  const page = INFO_PAGES[pageKey]
  return [
    { label: t('nav.home'), to: '/' },
    { label: t(`footer.${page.section}`) },
    { label: t(page.titleKey) },
  ]
}

export function getInfoPageMeta(pageKey: InfoPageKey, t: TFunction) {
  const page = INFO_PAGES[pageKey]
  return {
    ...page,
    title: t(page.titleKey),
    eyebrow: t(page.eyebrowKey),
    deck: t(page.deckKey),
    breadcrumbs: buildInfoBreadcrumbs(pageKey, t),
  }
}
