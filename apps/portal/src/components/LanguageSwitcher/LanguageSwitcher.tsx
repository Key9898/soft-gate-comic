import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { localizePath, stripLocalePrefix, useLocale } from '../../lib/locale'

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation()
  const locale = useLocale()

  const isMyanmar = locale === 'mm'
  const displayLanguage = isMyanmar
    ? { code: 'en', name: 'English' }
    : { code: 'mm', name: 'မြန်မာ' }

  const toggleLanguage = () => {
    const nextLanguage = isMyanmar ? 'en' : 'mm'
    void i18n.changeLanguage(nextLanguage)
    const { pathname, search } = window.location
    const neutralPath = stripLocalePrefix(pathname)
    const nextPath = localizePath(neutralPath, nextLanguage)
    window.location.assign(`${nextPath}${search}`)
  }

  return (
    <motion.button
      type="button"
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="focus-visible:ring-primary-500 flex min-h-11 items-center gap-2 rounded-2xl px-3 py-2 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2"
      aria-label={t('a11y.switchLanguage', { language: displayLanguage.name })}
    >
      <Globe className="h-5 w-5 text-gray-600" aria-hidden="true" />
      {/* Label visibility follows the Impl 77 responsive ladder, not this file's
          preference. The control's accessible name comes from aria-label, so the
          globe is never unlabelled for assistive tech at any width. */}
      <span className="hidden text-sm font-medium text-gray-700 xl:inline">
        {displayLanguage.name}
      </span>
    </motion.button>
  )
}

export default LanguageSwitcher
