import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Info } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../../components/Button'

const ForgotPasswordPage = () => {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <div className="bg-primary-50 shape-circle mx-auto mb-4 flex h-16 w-16 items-center justify-center">
            <Info className="text-primary-600 h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('auth.forgotPasswordTitle')}</h1>
          <p className="mt-3 text-sm text-gray-600">{t('auth.passwordResetUnavailable')}</p>
        </div>

        <Link to="/login">
          <Button className="w-full">{t('auth.backToLogin')}</Button>
        </Link>
      </div>
    </motion.div>
  )
}

export default ForgotPasswordPage
