import { Outlet } from 'react-router-dom'

const ReaderLayout = () => {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  )
}

export default ReaderLayout
