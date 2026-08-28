export const MAINTENANCE_ALLOWLIST = [
  '/maintenance',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/about',
  '/creators',
  '/press',
  '/help',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
  '/cookies',
] as const

export const isMaintenanceAllowlisted = (pathname: string) =>
  MAINTENANCE_ALLOWLIST.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))

export const isRegistrationOpen = (maintenanceMode: boolean, allowRegistration: boolean) =>
  !maintenanceMode && allowRegistration
