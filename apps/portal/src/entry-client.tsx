import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import i18n from './lib/i18n'
import { localeFromPathname } from './lib/locale'
import App from './App'
import './index.css'

const boot = () => {
  const container = document.getElementById('root')!
  const app = (
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>
  )

  if (container.firstElementChild) {
    hydrateRoot(container, app)
  } else {
    createRoot(container).render(app)
  }
}

const locale = localeFromPathname(window.location.pathname)
const bootLanguage = locale === 'mm' ? 'mm' : 'en'
if (i18n.language !== bootLanguage) {
  void i18n.changeLanguage(bootLanguage).then(boot)
} else {
  boot()
}
