import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useAuth } from './useAuth'

const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await login(formData.email, formData.password)
      navigate(returnTo, { replace: true })
    } catch {
      setErrors({ form: t('auth.loginFailed') })
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
        <h1 className="text-2xl font-bold text-gray-900">{t('auth.welcomeBack')}</h1>
        <p className="mt-2 text-gray-600">{t('auth.signInToAccount')}</p>
        <p className="mt-2 text-xs text-gray-500">{t('auth.demoAccountNote')}</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.form && (
            <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-600">{errors.form}</p>
          )}
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

          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-primary-600 hover:text-primary-700 text-sm transition"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            {t('auth.signIn')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {t('auth.noAccount')}{' '}
          <Link
            to="/register"
            state={{ from }}
            className="text-primary-600 hover:text-primary-700 font-medium transition"
          >
            {t('auth.signUp')}
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

export default LoginPage
