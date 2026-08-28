import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { isMaintenanceAllowlisted } from '../../lib/settings/maintenance'

const MaintenanceGate = ({ children }: { children: ReactNode }) => {
  const { maintenanceMode, isLoading } = useSettings()
  const { pathname } = useLocation()

  if (isLoading) {
    return <div aria-busy="true" className="min-h-screen bg-gray-50" />
  }

  if (maintenanceMode && !isMaintenanceAllowlisted(pathname)) {
    return <Navigate to="/maintenance" replace />
  }

  return <>{children}</>
}

export default MaintenanceGate
