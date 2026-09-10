import { useTranslation } from 'react-i18next'
import CatalogBusyPanel from '../../../components/CatalogBusyPanel'
import { Skeleton, SkeletonSection, SkeletonText } from '../../../components/Skeleton'

const AuthorPageSkeleton = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 sm:flex-row sm:items-start sm:px-6 lg:px-8">
          <Skeleton className="shape-circle h-24 w-24 shrink-0" />
          <div className="flex w-full flex-col items-center gap-3 sm:items-start">
            <Skeleton className="h-8 w-48 rounded-xl" />
            <SkeletonText className="w-full max-w-lg" />
            <Skeleton className="h-4 w-24 rounded-xl" />
            <Skeleton className="h-11 w-28 rounded-2xl" />
            <SkeletonText className="w-full max-w-sm" />
          </div>
        </div>
      </div>
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">{t('authorPage.works')}</h2>
          <SkeletonSection>
            <CatalogBusyPanel />
          </SkeletonSection>
        </div>
      </div>
    </div>
  )
}

export default AuthorPageSkeleton
