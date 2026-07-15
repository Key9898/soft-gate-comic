import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../../components/Button'
import Input from '../../components/Input'

const ForgotPasswordPage = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError(t('auth.emailRequired'))
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('auth.emailInvalid'))
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsEmailSent(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="text-primary-600 text-3xl font-bold">
            Soft-Gate Comic
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {!isEmailSent ? (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  {t('auth.forgotPasswordTitle')}
                </h1>
                <p className="mt-2 text-gray-600">{t('auth.forgotPasswordDesc')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label={t('auth.email')}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                  error={error}
                  leftIcon={<Mail className="h-5 w-5" />}
                />

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  {t('auth.sendResetLink')}
                </Button>
              </form>

              <Link
                to="/login"
                className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600 transition hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('auth.backToLogin')}
              </Link>
            </>
          ) : (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mb-2 text-xl font-bold text-gray-900">{t('auth.checkYourEmail')}</h2>
              <p className="mb-6 text-gray-600">
                {t('auth.resetLinkSent')}
                <br />
                <span className="font-medium text-gray-900">{email}</span>
              </p>
              <Button variant="secondary" className="w-full" onClick={() => setIsEmailSent(false)}>
                {t('auth.resendEmail')}
              </Button>
              <Link
                to="/login"
                className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600 transition hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('auth.backToLogin')}
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPasswordPage
