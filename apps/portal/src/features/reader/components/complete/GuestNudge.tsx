import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '../../../../components/Button'

export type GuestNudgeProps = {
  darkMode: boolean
  fromPath: string
  onGuestRegister: () => void
  nested: string
}

const GuestNudge = ({ darkMode, fromPath, onGuestRegister, nested }: GuestNudgeProps) => {
  const { t } = useTranslation()

  return (
    <div className={`mt-6 w-full max-w-md rounded-2xl border p-4 ${nested}`}>
      <p className={`mb-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {t('readerPage.guestNudge')}
      </p>
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
        <Button size="sm" onClick={onGuestRegister}>
          {t('readerPage.createFreeAccount')}
        </Button>
        <Link
          to="/login"
          state={{ from: { pathname: fromPath } }}
          className="text-primary-500 hover:text-primary-400 focus-visible:ring-primary-500 flex min-h-11 items-center rounded-2xl px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2"
        >
          {t('nav.login')}
        </Link>
      </div>
    </div>
  )
}

export default GuestNudge
