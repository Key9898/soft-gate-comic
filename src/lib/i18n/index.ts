import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import mmTranslation from './locales/mm/translation.json' with { type: 'json' }
import enTranslation from './locales/en/translation.json' with { type: 'json' }

const resources = {
  mm: {
    translation: mmTranslation,
  },
  en: {
    translation: enTranslation,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en',
    defaultNS: 'translation',
    detection: {
      // localStorage only — do not auto-switch from browser OS/locale on first visit
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
  })

const updateHtmlLang = (lang: string) => {
  document.documentElement.setAttribute('lang', lang)
}

updateHtmlLang(i18n.language)

i18n.on('languageChanged', (lang) => {
  updateHtmlLang(lang)
})

export default i18n
