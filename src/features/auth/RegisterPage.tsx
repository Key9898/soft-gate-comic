import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, User } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useAuth } from './useAuth'

const RegisterPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const from = (location.state as { from?: { pathname?: string; search?: string } } | null)?.from
  const returnTo = from?.pathname ? `${from.pathname}${from.search ?? ''}` : '/'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
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
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.passwordMinLength')
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.confirmPasswordRequired')
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordMismatch')
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await register({
        username: formData.username,
        displayName: formData.displayName,
        email: formData.email,
        password: formData.password,
      })
      navigate(returnTo, { replace: true })
    } catch (err) {
      const code = err instanceof Error ? err.message : ''
      setErrors({
        form: code === 'EMAIL_TAKEN' ? t('auth.emailTaken') : t('auth.registerFailed'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('auth.createAccount')}</h1>
        <p className="mt-2 text-gray-600">{t('auth.joinWebpad')}</p>
        <p className="mt-2 text-xs text-gray-500">{t('auth.demoAccountNote')}</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.form && (
            <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-600">{errors.form}</p>
          )}
          <Input
            label={t('auth.username')}
            type="text"
            name="username"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            leftIcon={<User className="h-5 w-5" />}
          />

          <Input
            label={t('auth.displayName')}
            type="text"
            name="displayName"
            placeholder="John Doe"
            value={formData.displayName}
            onChange={handleChange}
            error={errors.displayName}
            leftIcon={<User className="h-5 w-5" />}
          />

          <Input
            label={t('auth.email')}
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            leftIcon={<Mail className="h-5 w-5" />}
          />

          <Input
            label={t('auth.password')}
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            leftIcon={<Lock className="h-5 w-5" />}
          />

          <Input
            label={t('auth.confirmPassword')}
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            leftIcon={<Lock className="h-5 w-5" />}
          />

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              className="text-primary-600 focus:ring-primary-500 mt-1 h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
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

          <Button type="submit" className="w-full" isLoading={isLoading}>
            {t('auth.createAccount')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {t('auth.haveAccount')}{' '}
          <Link
            to="/login"
            state={{ from }}
            className="text-primary-600 hover:text-primary-700 font-medium transition"
          >
            {t('auth.signIn')}
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

export default RegisterPage
