import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, User } from 'lucide-react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { MIN_PASSWORD_LENGTH, safeReturnTo } from '../../lib/auth'
import { useAuth } from './useAuth'
import AuthSEO from './AuthSEO'

const RegisterPage = ({
  embedded = false,
  active = true,
}: {
  embedded?: boolean
  active?: boolean
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { register, isAuthenticated, isLoading } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    if (!formData.username) {
      newErrors.username = t('auth.usernameRequired')
    } else if (formData.username.length < 3) {
      newErrors.username = t('auth.usernameMinLength')
    }
    if (!formData.displayName) {
      newErrors.displayName = t('auth.displayNameRequired')
    }
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
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.confirmPasswordRequired')
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordMismatch')
    }
    if (!agreedToTerms) {
      newErrors.terms = t('auth.termsRequired')
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      await register({
        username: formData.username,
        displayName: formData.displayName,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })
      navigate(returnTo, { replace: true })
    } catch (err) {
      const code = err instanceof Error ? err.message : ''
      setErrors({
        form:
          code === 'EMAIL_TAKEN'
            ? t('auth.emailTaken')
            : code === 'USERNAME_TAKEN'
              ? t('auth.usernameTaken')
              : t('auth.registerFailed'),
      })
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
        <AuthSEO title={t('auth.seoRegister')} description={t('auth.registerLead')} />
      )}
      <h1 className="text-2xl font-bold text-gray-900">{t('auth.createReaderAccount')}</h1>
      <p className="mt-2 text-sm text-gray-600">{t('auth.registerLead')}</p>
      <p className="mt-2 text-xs text-gray-500">{t('auth.demoAccountNote')}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {errors.form && (
          <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-600">{errors.form}</p>
        )}
        <Input
          id="register-username"
          label={t('auth.username')}
          type="text"
          name="username"
          autoComplete="username"
          placeholder="johndoe"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          leftIcon={<User className="h-5 w-5" />}
        />

        <Input
          id="register-display-name"
          label={t('auth.displayName')}
          type="text"
          name="displayName"
          autoComplete="nickname"
          placeholder="John Doe"
          value={formData.displayName}
          onChange={handleChange}
          error={errors.displayName}
          leftIcon={<User className="h-5 w-5" />}
        />

        <Input
          id="register-email"
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
          id="register-password"
          label={t('auth.password')}
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          leftIcon={<Lock className="h-5 w-5" />}
        />

        <Input
          id="register-confirm-password"
          label={t('auth.confirmPassword')}
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          leftIcon={<Lock className="h-5 w-5" />}
        />

        <div>
          <div className="flex min-h-11 items-start gap-3">
            <input
              type="checkbox"
              id="register-terms"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked)
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: '' }))
              }}
              className="text-primary-600 focus-visible:ring-primary-500 mt-1 h-5 w-5 shrink-0 rounded-2xl border-gray-300"
              aria-invalid={Boolean(errors.terms)}
              aria-describedby={errors.terms ? 'register-terms-error' : undefined}
            />
            <label htmlFor="register-terms" className="text-sm text-gray-600">
              {t('auth.agreeToTerms')}{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                {t('footer.terms')}
              </Link>{' '}
              {t('auth.and')}{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                {t('footer.privacy')}
              </Link>
            </label>
          </div>
          {errors.terms ? (
            <p id="register-terms-error" className="mt-1.5 text-sm text-red-500">
              {errors.terms}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" isLoading={submitting}>
          {t('auth.createAccount')}
        </Button>
      </form>

      <p className="mt-6 text-sm text-gray-600 lg:hidden">
        {t('auth.haveAccount')}{' '}
        <Link
          to="/login"
          state={{ from }}
          className="text-primary-600 hover:text-primary-700 focus-visible:ring-primary-500 rounded-2xl font-medium transition focus-visible:ring-2 focus-visible:outline-none"
        >
          {t('auth.signIn')}
        </Link>
      </p>
    </>
  )
}

export default RegisterPage
