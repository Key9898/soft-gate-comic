import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  /** The route's own skeleton. Without one the gate paints a blank screen first. */
  fallback?: React.ReactNode
}

const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    // Every gated route ships a purpose-built skeleton, but the gate rendered
    // before it — so the first paint was an empty viewport with nothing for a
    // screen reader to announce.
    return (
      <div aria-busy="true">
        <p role="status" className="sr-only">
          {t('common.loading')}
        </p>
        {fallback}
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
