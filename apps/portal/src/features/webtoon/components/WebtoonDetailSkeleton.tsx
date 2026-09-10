import { useTranslation } from 'react-i18next'
import CatalogBusyPanel from '../../../components/CatalogBusyPanel'
import { SkeletonSection } from '../../../components/Skeleton'

const WebtoonDetailSkeleton = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-visible bg-gray-900">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <SkeletonSection>
            <CatalogBusyPanel />
          </SkeletonSection>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div
              data-testid="hub-episode-tabs"
              className="flex items-center gap-1 rounded-2xl bg-gray-100 p-1"
            >
              <span className="min-h-[44px] rounded-2xl px-4 py-2 text-sm font-medium text-gray-700">
                {t('webtoonDetail.allEpisodes')}
              </span>
              <span className="min-h-[44px] rounded-2xl px-4 py-2 text-sm font-medium text-gray-700">
                {t('webtoonDetail.freeEpisodes')}
              </span>
              <span className="min-h-[44px] rounded-2xl px-4 py-2 text-sm font-medium text-gray-700">
                {t('webtoonDetail.premiumEpisodes')}
              </span>
            </div>
          </div>
          <SkeletonSection>
            <CatalogBusyPanel />
          </SkeletonSection>
        </div>
      </section>

      <section className="border-t border-gray-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">{t('webtoonDetail.comments')}</h2>
          <SkeletonSection>
            <CatalogBusyPanel />
          </SkeletonSection>
        </div>
      </section>
    </div>
  )
}

export default WebtoonDetailSkeleton
