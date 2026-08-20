import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, Lock } from 'lucide-react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { MIN_PASSWORD_LENGTH, safeReturnTo } from '../../lib/auth'
import { useAuth } from './useAuth'
import AuthSEO from './AuthSEO'

const LoginPage = ({
  embedded = false,
  active = true,
}: {
  embedded?: boolean
  active?: boolean
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, isLoading } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const from = (location.state as { from?: { pathname?: string; search?: string } } | null)?.from
  const returnTo = safeReturnTo(from)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name] || errors.form) {
      setErrors((prev) => ({ ...prev, [name]: '', form: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email) {
      newErrors.email = t('auth.emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.emailInvalid')
    }
    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired')
    } else if (formData.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = t('auth.passwordMinLength')
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      await login(formData.email.trim().toLowerCase(), formData.password)
      navigate(returnTo, { replace: true })
    } catch {
      setErrors({ form: t('auth.loginFailed') })
    } finally {
      setSubmitting(false)
    }
  }

  if (!isLoading && isAuthenticated && active) {
    return <Navigate to={returnTo} replace />
  }

  return (
    <>
      {embedded ? null : (
        <AuthSEO title={t('auth.seoLogin')} description={t('auth.signInToAccount')} />
      )}
      <h1 className="text-2xl font-bold text-gray-900">{t('auth.continueInBrowser')}</h1>
      <p className="mt-2 text-sm text-gray-600">{t('auth.signInToAccount')}</p>
      <p className="mt-2 text-xs text-gray-500">{t('auth.demoAccountNote')}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {errors.form && (
          <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-600">{errors.form}</p>
        )}
        <Input
          id="login-email"
          label={t('auth.email')}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          leftIcon={<Mail className="h-5 w-5" />}
        />

        <Input
          id="login-password"
          label={t('auth.password')}
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          leftIcon={<Lock className="h-5 w-5" />}
        />

        <div className="flex items-center justify-end">
          <Link
            to="/forgot-password"
            state={{ from }}
            className="text-primary-600 hover:text-primary-700 focus-visible:ring-primary-500 rounded-2xl text-sm transition focus-visible:ring-2 focus-visible:outline-none"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>

        <Button type="submit" className="w-full" isLoading={submitting}>
          {t('auth.signIn')}
        </Button>
      </form>

      <p className="mt-6 text-sm text-gray-600 lg:hidden">
        {t('auth.noAccount')}{' '}
        <Link
          to="/register"
          state={{ from }}
          className="text-primary-600 hover:text-primary-700 focus-visible:ring-primary-500 rounded-2xl font-medium transition focus-visible:ring-2 focus-visible:outline-none"
        >
          {t('auth.signUp')}
        </Link>
      </p>
    </>
  )
}

export default LoginPage
