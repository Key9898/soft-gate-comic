import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO/SEO'

const AuthLayout = () => {
  const { t } = useTranslation()
  return (
    <div className="from-primary-50 to-primary-100 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <SEO title="Account" noindex />
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src="/logo/logo.svg"
            alt="SoftGate Comic Logo"
            className="mb-2 h-14 w-auto object-contain"
          />
          <p className="text-primary-600 text-3xl font-bold tracking-tight">SoftGate Comic</p>
          <p className="mt-2 text-gray-500">{t('auth.tagline')}</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
