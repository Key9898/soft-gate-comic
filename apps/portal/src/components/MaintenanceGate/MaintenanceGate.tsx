import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSettings } from '../../context/SettingsContext'
import { isMaintenanceAllowlisted } from '../../lib/settings/maintenance'

const MaintenanceGate = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation()
  const { maintenanceMode, isLoading } = useSettings()
  const { pathname } = useLocation()

  if (isLoading) {
    // A blank grey screen says nothing to a screen reader; the settings fetch is
    // brief, so a live status line is the honest treatment rather than a skeleton
    // for a page we do not yet know we are rendering.
    return (
      <div aria-busy="true" className="min-h-screen bg-gray-50">
        <p role="status" className="sr-only">
          {t('common.loading')}
        </p>
      </div>
    )
  }

  if (maintenanceMode && !isMaintenanceAllowlisted(pathname)) {
    return <Navigate to="/maintenance" replace />
  }

  return <>{children}</>
}

export default MaintenanceGate
