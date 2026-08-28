import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type AuthScene = 'login' | 'register' | 'forgot' | 'reset'

function sceneFromPath(pathname: string): AuthScene {
  if (pathname.startsWith('/register')) return 'register'
  if (pathname.startsWith('/forgot-password')) return 'forgot'
  if (pathname.startsWith('/reset-password')) return 'reset'
  return 'login'
}

const COPY: Record<AuthScene, { title: string; lead: string }> = {
  login: { title: 'auth.roomLoginTitle', lead: 'auth.roomLoginLead' },
  register: { title: 'auth.roomRegisterTitle', lead: 'auth.roomRegisterLead' },
  forgot: { title: 'auth.roomForgotTitle', lead: 'auth.roomForgotLead' },
  reset: { title: 'auth.roomResetTitle', lead: 'auth.roomResetLead' },
}

const JOBS = ['auth.jobContinue', 'auth.jobLibrary', 'auth.jobCoins'] as const

const AuthAtmosphere = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const copy = COPY[sceneFromPath(pathname)]

  return (
    <div>
      <p className="text-primary-600 text-2xs font-bold tracking-wider uppercase">
        {t('auth.roomEyebrow')}
      </p>
      <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {t(copy.title)}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">{t(copy.lead)}</p>
      <ul className="mt-6 space-y-2">
        {JOBS.map((key) => (
          <li key={key} className="flex items-center gap-2 text-sm text-gray-700">
            <span className="bg-primary-600 h-1.5 w-1.5 shrink-0 rounded-2xl" aria-hidden />
            {t(key)}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs text-gray-500">{t('auth.demoAccountNote')}</p>
    </div>
  )
}

export default AuthAtmosphere
