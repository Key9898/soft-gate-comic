import { BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../../../components/Button'

const HomeEmptyState = () => {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md py-16 text-center">
        <div className="shape-circle mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-gray-100">
          <BookOpen className="h-8 w-8 text-gray-400" aria-hidden="true" />
        </div>
        <h1 className="mb-2 text-lg font-bold text-gray-900">{t('home.emptyTitle')}</h1>
        <p className="mb-6 text-sm text-gray-500">{t('home.emptyDesc')}</p>
        <Button variant="primary" size="sm" onClick={() => window.location.reload()}>
          {t('home.refresh')}
        </Button>
      </div>
    </div>
  )
}

export default HomeEmptyState
