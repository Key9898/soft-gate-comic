import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { localeFromPathname, routerBasename } from '../../lib/locale'

type ErrorBoundaryProps = {
  children: ReactNode
  /** Changing this clears the fallback — the routes pass the current path. */
  resetKey?: string
  onError?: (error: Error, info: ErrorInfo) => void
}

type ErrorBoundaryState = {
  error: Error | null
}

const ACTION_CLASS =
  'focus-visible:ring-primary-500 inline-flex min-h-11 items-center justify-center rounded-2xl px-5 font-bold focus-visible:ring-2 focus-visible:outline-none'

/**
 * A render crash used to unmount the whole tree to a blank page. The fallback
 * states plainly that the page failed and offers the two things that actually
 * help — retry the subtree, or leave for Home. It does not claim the failure
 * was reported anywhere, because nothing reports it.
 */
/**
 * A plain anchor, not a router `Link`. The outer boundary has to survive a crash
 * in the router itself, and a full page load is the right recovery after a
 * render crash anyway — it rebuilds the app state the crash left behind.
 */
function homeHref(): string {
  if (typeof window === 'undefined') return '/'
  return routerBasename(localeFromPathname(window.location.pathname)) ?? '/'
}

const ErrorBoundaryFallback = ({ onRetry }: { onRetry: () => void }) => {
  const { t } = useTranslation()

  return (
    <div role="alert" className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900">{t('errors.boundaryTitle')}</h1>
      <p className="mt-3 font-semibold text-gray-600">{t('errors.boundaryBody')}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onRetry} className={`${ACTION_CLASS} btn-primary`}>
          {t('errors.boundaryRetry')}
        </button>
        <a href={homeHref()} className={`${ACTION_CLASS} btn-secondary`}>
          {t('errors.boundaryHome')}
        </a>
      </div>
    </div>
  )
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidUpdate(previous: ErrorBoundaryProps) {
    if (this.state.error && previous.resetKey !== this.props.resetKey) {
      this.setState({ error: null })
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }

  private handleRetry = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return <ErrorBoundaryFallback onRetry={this.handleRetry} />
    }
    return this.props.children
  }
}

/**
 * Router-aware wrapper: navigating away from a crashed route clears the
 * fallback, so one bad page does not strand the reader.
 */
export const RouteErrorBoundary = ({ children, onError }: Omit<ErrorBoundaryProps, 'resetKey'>) => {
  const location = useLocation()
  return (
    <ErrorBoundary resetKey={location.pathname} onError={onError}>
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary
