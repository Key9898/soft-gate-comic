import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import i18n from './lib/i18n'
import { localeFromPathname } from './lib/locale'
import { CommentsSsrContext, readClientCommentsSsrSeed } from './lib/ssr/commentsSsr'
import { registerPushWorker } from './lib/push'
import App from './App'
import './index.css'

const boot = () => {
  registerPushWorker()
  const container = document.getElementById('root')!
  const commentsSeed = readClientCommentsSsrSeed()
  const app = (
    <StrictMode>
      <HelmetProvider>
        <CommentsSsrContext.Provider value={commentsSeed}>
          <App />
        </CommentsSsrContext.Provider>
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
