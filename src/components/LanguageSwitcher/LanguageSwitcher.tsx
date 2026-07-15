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
      className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"
      aria-label={`Switch to ${displayLanguage.name}`}
    >
      <Globe className="h-5 w-5 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">{displayLanguage.name}</span>
    </motion.button>
  )
}

export default LanguageSwitcher
