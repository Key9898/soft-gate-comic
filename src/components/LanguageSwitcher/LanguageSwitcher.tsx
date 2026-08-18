import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const isMyanmar = i18n.language === 'mm'
  const displayLanguage = isMyanmar
    ? { code: 'en', name: 'English' }
    : { code: 'mm', name: 'မြန်မာ' }

  const toggleLanguage = () => {
    const nextLanguage = isMyanmar ? 'en' : 'mm'
    i18n.changeLanguage(nextLanguage)
  }

  return (
    <motion.button
      type="button"
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="focus-visible:ring-primary-500 flex min-h-11 items-center gap-2 rounded-2xl px-3 py-2 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:outline-none"
      aria-label={`Switch to ${displayLanguage.name}`}
    >
      <Globe className="h-5 w-5 text-gray-600" aria-hidden="true" />
      <span className="hidden text-sm font-medium text-gray-700 xl:inline">
        {displayLanguage.name}
      </span>
    </motion.button>
  )
}

export default LanguageSwitcher
