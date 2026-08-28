import { Outlet } from 'react-router-dom'

const ReaderLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  )
}

export default ReaderLayout
