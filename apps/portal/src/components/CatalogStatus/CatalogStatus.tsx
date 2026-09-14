import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useData } from '../../context/DataContext'
import { useSettings } from '../../context/SettingsContext'

const AUTH_PREFIXES = ['/login', '/register', '/forgot-password', '/reset-password']

const isAuthRoute = (pathname: string) =>
  AUTH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))

const CatalogStatus = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { error, isLoading, retry } = useData()
  const { maintenanceMode } = useSettings()
  const [slow, setSlow] = useState(false)
  // Nothing in the app told a reader they were offline: a dropped connection
  // surfaced as the generic catalog-error path, which reads as a server fault.
  const [offline, setOffline] = useState(
    () => typeof navigator !== 'undefined' && navigator.onLine === false
  )

  useEffect(() => {
    const goOffline = () => setOffline(true)
    const goOnline = () => {
      setOffline(false)
      retry()
    }
    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [retry])

  useEffect(() => {
    if (!isLoading) {
      setSlow(false)
      return
    }
    const id = window.setTimeout(() => setSlow(true), 10_000)
    return () => window.clearTimeout(id)
  }, [isLoading])

  if (maintenanceMode || pathname === '/maintenance' || isAuthRoute(pathname)) return null
  if (!error && !slow && !offline) return null

  return (
    <div
      role={error || offline ? 'alert' : 'status'}
      data-testid="catalog-status"
      className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <p>
          {offline ? t('errors.offline') : error ? t('errors.catalogLoad') : t('a11y.stillLoading')}
        </p>
        <button
          type="button"
          onClick={retry}
          className="min-h-11 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-amber-950 ring-1 ring-amber-300 transition hover:bg-amber-100"
        >
          {t('a11y.retry')}
        </button>
      </div>
    </div>
  )
}

export default CatalogStatus
