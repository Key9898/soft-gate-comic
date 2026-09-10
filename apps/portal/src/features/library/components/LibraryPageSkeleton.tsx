import { Bookmark, Clock, Grid3X3, Heart, List, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import CatalogBusyPanel from '../../../components/CatalogBusyPanel'
import SEO from '../../../components/SEO/SEO'
import { SkeletonSection } from '../../../components/Skeleton'

const LibraryPageSkeleton = () => {
  const { t } = useTranslation()
  const tabs = [
    { id: 'bookmarks', label: t('libraryPage.bookmarks'), icon: Bookmark },
    { id: 'history', label: t('libraryPage.history'), icon: Clock },
    { id: 'likes', label: t('libraryPage.likes'), icon: Heart },
  ] as const

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <SEO title={t('libraryPage.title')} noindex />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {t('libraryPage.title')}
            </h1>
            <p className="mt-1 text-sm font-medium text-gray-500">{t('libraryPage.subtitle')}</p>
          </div>
        </div>
        <div className="mb-6 rounded-3xl border bg-white shadow-sm">
          <div className="flex flex-col border-b border-gray-100 sm:flex-row sm:items-center">
            <div className="scrollbar-hide flex overflow-x-auto">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  data-testid="library-tab"
                  className="flex min-h-[44px] items-center gap-2 px-6 py-4 text-gray-500"
                >
                  <tab.icon className="h-4.5 w-4.5" aria-hidden="true" />
                  <span className="text-sm font-bold">{tab.label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-2 sm:ml-auto sm:border-0">
              <span
                title={t('libraryPage.gridView')}
                aria-label={t('libraryPage.gridView')}
                className="bg-primary-50 text-primary-600 rounded-2xl p-2"
              >
                <Grid3X3 className="h-5 w-5" aria-hidden="true" />
              </span>
              <span
                title={t('libraryPage.listView')}
                aria-label={t('libraryPage.listView')}
                className="rounded-2xl p-2 text-gray-400"
              >
                <List className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="relative">
              <Search
                className="absolute top-1/2 left-4.5 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                disabled
                placeholder={t('libraryPage.searchPlaceholder')}
                aria-label={t('libraryPage.searchPlaceholder')}
                className="w-full rounded-2xl border border-gray-200 py-3 pr-4 pl-12 text-sm font-medium"
              />
            </div>
          </div>
        </div>
        <SkeletonSection>
          <CatalogBusyPanel />
        </SkeletonSection>
      </div>
    </div>
  )
}

export default LibraryPageSkeleton
