import { Outlet } from 'react-router-dom'
import { RouteErrorBoundary } from '../components/ErrorBoundary'

const ReaderLayout = () => {
  return (
    <div className="min-h-screen">
      <RouteErrorBoundary>
        <Outlet />
      </RouteErrorBoundary>
    </div>
  )
}

export default ReaderLayout
