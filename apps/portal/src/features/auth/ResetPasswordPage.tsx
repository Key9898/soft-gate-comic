import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock } from 'lucide-react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { MIN_PASSWORD_LENGTH } from '../../lib/auth'
import { authFetch, AuthApiError } from '../../lib/api/authFetch'
import { isMockApi } from '../../lib/api/isMockApi'
import AuthSEO from './AuthSEO'

const ResetPasswordPage = () => {
  const { t } = useTranslation()
  const { token } = useParams()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string; search?: string } } | null)?.from
  const mock = isMockApi()
  const hasToken = Boolean(token)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [invalidToken, setInvalidToken] = useState(false)
  const [busy, setBusy] = useState(false)
  const desc = mock ? t('auth.setNewPasswordDesc') : t('auth.setNewPasswordDescHttp')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!password) {
      nextErrors.password = t('auth.passwordRequired')
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = t('auth.passwordMinLength')
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = t('auth.confirmPasswordRequired')
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = t('auth.passwordMismatch')
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    if (mock) {
      setSubmitted(true)
      return
    }
    setBusy(true)
    try {
      await authFetch<{ ok: true }>('/api/auth/reset', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      })
      setSubmitted(true)
    } catch (err) {
      if (err instanceof AuthApiError && err.code === 'PASSWORD_TOO_SHORT') {
        setErrors({ password: t('auth.passwordMinLength') })
      } else if (err instanceof AuthApiError && err.code === 'RESET_TOKEN_INVALID') {
        setInvalidToken(true)
      } else {
        setErrors({ password: t('auth.forgotHttpError') })
      }
    } finally {
      setBusy(false)
    }
  }

  const showInvalid = !hasToken || invalidToken

  return (
    <>
      <AuthSEO title={t('auth.seoReset')} description={desc} />
      {showInvalid ? (
        <>
          <h1 className="text-2xl font-bold text-gray-900">{t('auth.invalidLink')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {mock ? t('auth.invalidLinkDesc') : t('auth.invalidLinkDescHttp')}
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-gray-900">{t('auth.setNewPassword')}</h1>
          <p className="mt-2 text-sm text-gray-600">{desc}</p>
          {submitted ? (
            <p className="bg-primary-50 text-primary-900 mt-6 rounded-2xl px-3 py-3 text-sm">
              {mock
                ? `${t('auth.resetPrepared')} ${t('auth.resetNotSaved')}`
                : t('auth.passwordResetDesc')}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <Input
                label={t('auth.newPassword')}
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }))
                }}
                error={errors.password}
                leftIcon={<Lock className="h-5 w-5" />}
              />
              <Input
                label={t('auth.confirmPassword')}
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: '' }))
                  }
                }}
                error={errors.confirmPassword}
                leftIcon={<Lock className="h-5 w-5" />}
              />
              <Button type="submit" className="w-full" disabled={busy}>
                {t('auth.setNewPassword')}
              </Button>
            </form>
          )}
        </>
      )}
      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link
          to="/forgot-password"
          state={{ from }}
          className="text-primary-600 hover:text-primary-700 focus-visible:ring-primary-500 rounded-2xl font-medium focus-visible:ring-2 focus-visible:outline-none"
        >
          {t('auth.requestNewLink')}
        </Link>
        <Link
          to="/login"
          state={{ from }}
          className="text-primary-600 hover:text-primary-700 focus-visible:ring-primary-500 rounded-2xl font-medium focus-visible:ring-2 focus-visible:outline-none"
        >
          {submitted && !mock ? t('auth.continueToLogin') : t('auth.backToLogin')}
        </Link>
      </div>
    </>
  )
}

export default ResetPasswordPage
