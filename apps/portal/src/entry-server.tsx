import { renderToString } from 'react-dom/server'
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { StaticRouter } from 'react-router-dom/server'
import i18n from './lib/i18n'
import { AppRoutes } from './App'
import { LocaleProvider, localeFromPathname, routerBasename } from './lib/locale'
import { SsrResponseContext, type SsrResponseState } from './lib/ssr/ssrResponse'

const APP_HEAD_PLACEHOLDER = '<!--app-head-->'
const APP_HTML_PLACEHOLDER = '<!--app-html-->'

export interface RenderResult {
  html: string
  helmet: HelmetServerState | undefined
  status: number
}

export function render(url: string): RenderResult {
  const locale = localeFromPathname(url)
  const i18nInstance = i18n.cloneInstance({ lng: locale === 'mm' ? 'mm' : 'en' })
  const helmetContext: { helmet?: HelmetServerState } = {}
  const response: SsrResponseState = { status: 200 }
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <I18nextProvider i18n={i18nInstance}>
        <LocaleProvider value={locale}>
          <SsrResponseContext.Provider value={response}>
            <StaticRouter location={url} basename={routerBasename(locale)}>
              <AppRoutes />
            </StaticRouter>
          </SsrResponseContext.Provider>
        </LocaleProvider>
      </I18nextProvider>
    </HelmetProvider>
  )
  return { html, helmet: helmetContext.helmet, status: response.status }
}

export interface RenderedPage {
  html: string
  status: number
}

export function renderPage(template: string, url: string): RenderedPage {
  const { html, helmet, status } = render(url)
  const head = helmet
    ? [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
        helmet.script.toString(),
      ]
        .filter(Boolean)
        .join('\n    ')
    : ''
  const htmlAttributes = helmet?.htmlAttributes.toString() ?? ''
  let page = template
    .replace(APP_HEAD_PLACEHOLDER, () => head)
    .replace(APP_HTML_PLACEHOLDER, () => html)
  if (htmlAttributes) {
    page = page.replace(/<html[^>]*>/, () => `<html ${htmlAttributes}>`)
  }
  return { html: page, status }
}
