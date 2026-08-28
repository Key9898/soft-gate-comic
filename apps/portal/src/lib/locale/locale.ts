export type PortalLocale = 'en' | 'mm'

export const PORTAL_LOCALES: PortalLocale[] = ['en', 'mm']

export const localeFromPathname = (pathname: string): PortalLocale => {
  const clean = pathname.split('?')[0].split('#')[0]
  return clean === '/mm' || clean.startsWith('/mm/') ? 'mm' : 'en'
}

export const stripLocalePrefix = (pathname: string): string => {
  if (pathname === '/mm') return '/'
  if (pathname.startsWith('/mm/')) return pathname.slice(3)
  return pathname
}

export const localizePath = (path: string, locale: PortalLocale): string => {
  if (locale !== 'mm') return path
  return path === '/' ? '/mm' : `/mm${path}`
}

export const routerBasename = (locale: PortalLocale): string | undefined =>
  locale === 'mm' ? '/mm' : undefined

export const htmlLangFor = (locale: PortalLocale): string => (locale === 'mm' ? 'my' : 'en')

export const OG_LOCALE: Record<PortalLocale, string> = {
  en: 'en_US',
  mm: 'my_MM',
}

export const HREFLANG: Record<PortalLocale, string> = {
  en: 'en',
  mm: 'my',
}
