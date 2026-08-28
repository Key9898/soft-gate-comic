import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AuthSEO from './AuthSEO'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import { useSettings } from '../../context/SettingsContext'
import { isRegistrationOpen } from '../../lib/settings/maintenance'

export type AuthReturnFrom = { pathname?: string; search?: string }

const JOBS = ['auth.jobContinue', 'auth.jobLibrary', 'auth.jobCoins'] as const

const bindInert = (inactive: boolean) => (el: HTMLDivElement | null) => {
  if (!el) return
  if (inactive) {
    el.setAttribute('inert', '')
  } else {
    el.removeAttribute('inert')
  }
}

const AuthSplitHero = ({
  invite,
  active,
  to,
  from,
  side,
}: {
  invite: 'login' | 'register'
  active: boolean
  to?: string
  from?: AuthReturnFrom
  side: 'login' | 'register'
}) => {
  const { t } = useTranslation()
  const isLoginInvite = invite === 'login'

  return (
    <div
      className={`auth-split-slide absolute top-0 z-[3] hidden h-full w-1/2 flex-col items-center justify-center px-8 py-10 text-center text-white lg:flex ${
        side === 'login' ? 'left-1/2' : 'left-0'
      } ${
        active
          ? 'visible opacity-100'
          : `pointer-events-none invisible opacity-0 ${side === 'register' ? '-translate-x-full' : 'translate-x-full'}`
      }`}
    >
      <p className="text-2xs font-bold tracking-wider text-white/80 uppercase">
        {t('auth.roomEyebrow')}
      </p>
      <p className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        {t(isLoginInvite ? 'auth.roomLoginTitle' : 'auth.roomRegisterTitle')}
      </p>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85">
        {t(isLoginInvite ? 'auth.roomLoginLead' : 'auth.roomRegisterLead')}
      </p>
      <ul className="mt-6 space-y-2 text-sm text-white/90">
        {JOBS.map((key) => (
          <li key={key} className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-2xl bg-white" aria-hidden />
            {t(key)}
          </li>
        ))}
      </ul>
      {to ? (
        <Link
          to={to}
          state={{ from }}
          className="focus-visible:ring-primary-500 hover:text-primary-700 mt-8 inline-flex min-h-11 items-center justify-center rounded-2xl border border-white px-8 text-sm font-bold text-white transition hover:bg-white focus-visible:ring-2 focus-visible:outline-none"
        >
          {t(isLoginInvite ? 'auth.signIn' : 'auth.signUp')}
        </Link>
      ) : null}
    </div>
  )
}

const AuthSplitCard = ({ view, from }: { view: 'login' | 'register'; from?: AuthReturnFrom }) => {
  const { t } = useTranslation()
  const isLogin = view === 'login'
  const { maintenanceMode, allowRegistration } = useSettings()
  const registrationOpen = isRegistrationOpen(maintenanceMode, allowRegistration)

  return (
    <div data-testid="auth-split-card" className="auth-split-card" data-view={view}>
      <AuthSEO
        title={t(isLogin ? 'auth.seoLogin' : 'auth.seoRegister')}
        description={t(isLogin ? 'auth.signInToAccount' : 'auth.registerLead')}
      />
      <div
        data-testid="auth-split-form-login"
        ref={bindInert(!isLogin)}
        className={`relative z-[1] w-full bg-white p-6 sm:p-8 lg:absolute lg:top-0 lg:left-0 lg:h-full lg:w-1/2 lg:overflow-y-auto lg:overscroll-contain ${
          isLogin ? 'block' : 'pointer-events-none hidden lg:block'
        }`}
        aria-hidden={!isLogin}
      >
        <LoginPage embedded active={isLogin} />
      </div>
      <div
        data-testid="auth-split-form-register"
        ref={bindInert(isLogin)}
        className={`relative z-[1] w-full bg-white p-6 sm:p-8 lg:absolute lg:top-0 lg:left-1/2 lg:h-full lg:w-1/2 lg:overflow-y-auto lg:overscroll-contain ${
          isLogin ? 'pointer-events-none hidden lg:block' : 'block'
        }`}
        aria-hidden={isLogin}
      >
        <RegisterPage embedded active={!isLogin} />
      </div>
      <div
        data-testid="auth-split-bg"
        aria-hidden
        className={`auth-split-bg-motion pointer-events-none absolute top-1 left-1 z-[2] hidden h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] rounded-[1.25rem] bg-[url('/auth/reading-room-lg.jpg')] bg-cover bg-center lg:block ${
          isLogin ? 'translate-x-full' : ''
        }`}
      >
        <div className="absolute inset-0 rounded-[1.25rem] bg-gray-950/45" />
      </div>
      <AuthSplitHero
        invite="register"
        active={isLogin}
        to={registrationOpen ? '/register' : undefined}
        from={from}
        side="login"
      />
      <AuthSplitHero invite="login" active={!isLogin} to="/login" from={from} side="register" />
    </div>
  )
}

export default AuthSplitCard
