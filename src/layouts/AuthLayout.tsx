import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="from-primary-50 to-primary-100 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src="/logo/logo.jpg"
            alt="Soft-Gate Comic Logo"
            className="mb-2 h-12 w-12 rounded-xl object-cover shadow-md"
          />
          <h1 className="text-primary-600 text-3xl font-black tracking-tight">Soft-Gate Comic</h1>
          <p className="text-gray-550 mt-2">Your gateway to amazing webtoons</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
