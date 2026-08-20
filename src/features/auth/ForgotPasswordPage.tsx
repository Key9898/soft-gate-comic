import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock, Mail } from 'lucide-react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { DEMO_PASSWORD_RESET_OTP, isDemoOtp, MIN_PASSWORD_LENGTH } from '../../lib/auth'
import { useAuth } from './useAuth'
import AuthSEO from './AuthSEO'

type Step = 'email' | 'otp' | 'password' | 'done'

const STEPS: { id: Exclude<Step, 'done'>; labelKey: string }[] = [
  { id: 'email', labelKey: 'auth.stepEmail' },
  { id: 'otp', labelKey: 'auth.stepOtp' },
  { id: 'password', labelKey: 'auth.stepPassword' },
]

const ForgotPasswordPage = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()
  const from = (location.state as { from?: { pathname?: string; search?: string } } | null)?.from
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [resendNote, setResendNote] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setEmail(user.email)
    }
  }, [isAuthenticated, user?.email])

  const emailLocked = isAuthenticated && Boolean(user?.email)

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!email) {
      nextErrors.email = t('auth.emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      nextErrors.email = t('auth.emailInvalid')
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setResendNote(false)
    setStep('otp')
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim()) {
      setErrors({ otp: t('auth.otpRequired') })
      return
    }
    if (!isDemoOtp(otp)) {
      setErrors({ otp: t('auth.otpInvalid') })
      return
    }
    setErrors({})
    setStep('password')
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
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
    setStep('done')
  }

  return (
    <>
      <AuthSEO title={t('auth.seoForgot')} description={t('auth.forgotLead')} />
      <h1 className="text-2xl font-bold text-gray-900">{t('auth.forgotPasswordTitle')}</h1>
      <p className="mt-2 text-sm text-gray-600">{t('auth.forgotLead')}</p>

      <ol className="mt-6 flex gap-2" aria-label={t('auth.forgotPasswordTitle')}>
        {STEPS.map((item, index) => {
          const order = ['email', 'otp', 'password'] as const
          const currentIndex = step === 'done' ? 3 : order.indexOf(step as (typeof order)[number])
          const current = step === item.id
          const complete = currentIndex > index
          return (
            <li
              key={item.id}
              className={`flex min-h-11 flex-1 items-center justify-center rounded-2xl px-2 text-center text-xs font-semibold ${
                current
                  ? 'bg-primary-600 text-white'
                  : complete
                    ? 'bg-primary-50 text-primary-700'
                    : 'bg-gray-100 text-gray-500'
              }`}
            >
              {index + 1}. {t(item.labelKey)}
            </li>
          )
        })}
      </ol>

      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit} className="mt-6 space-y-5">
          <Input
            label={t('auth.email')}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              if (!emailLocked) setEmail(e.target.value)
              if (errors.email) setErrors({})
            }}
            error={errors.email}
            readOnly={emailLocked}
            leftIcon={<Mail className="h-5 w-5" />}
          />
          <Button type="submit" className="w-full">
            {t('auth.sendCode')}
          </Button>
        </form>
      ) : null}

      {step === 'otp' ? (
        <form onSubmit={handleOtpSubmit} className="mt-6 space-y-5">
          <p className="rounded-2xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {t('auth.otpMockNote', { code: DEMO_PASSWORD_RESET_OTP })}
          </p>
          <Input
            label={t('auth.otp')}
            type="text"
            name="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder={t('auth.otpHint')}
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value)
              if (errors.otp) setErrors({})
            }}
            error={errors.otp}
          />
          {resendNote ? <p className="text-sm text-gray-600">{t('auth.resendHonesty')}</p> : null}
          <Button type="submit" className="w-full">
            {t('auth.verifyCode')}
          </Button>
          <button
            type="button"
            className="text-primary-600 hover:text-primary-700 w-full text-sm font-medium"
            onClick={() => setResendNote(true)}
          >
            {t('auth.resendCode')}
          </button>
        </form>
      ) : null}

      {step === 'password' ? (
        <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-5">
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
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }))
            }}
            error={errors.confirmPassword}
            leftIcon={<Lock className="h-5 w-5" />}
          />
          <Button type="submit" className="w-full">
            {t('auth.setNewPassword')}
          </Button>
        </form>
      ) : null}

      {step === 'done' ? (
        <p className="mt-6 rounded-2xl bg-amber-50 px-3 py-3 text-sm text-amber-900">
          {t('auth.resetPrepared')} {t('auth.resetNotSaved')}
        </p>
      ) : (
        <p className="mt-6 text-sm text-gray-500">{t('auth.resetNotSaved')}</p>
      )}

      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link
          to="/login"
          state={{ from }}
          className="text-primary-600 hover:text-primary-700 focus-visible:ring-primary-500 rounded-2xl font-medium focus-visible:ring-2 focus-visible:outline-none"
        >
          {t('auth.backToLogin')}
        </Link>
        <Link
          to="/help"
          className="text-primary-600 hover:text-primary-700 focus-visible:ring-primary-500 rounded-2xl font-medium focus-visible:ring-2 focus-visible:outline-none"
        >
          {t('footer.help')}
        </Link>
        <Link
          to="/contact"
          className="text-primary-600 hover:text-primary-700 focus-visible:ring-primary-500 rounded-2xl font-medium focus-visible:ring-2 focus-visible:outline-none"
        >
          {t('footer.contact')}
        </Link>
      </div>
    </>
  )
}

export default ForgotPasswordPage
