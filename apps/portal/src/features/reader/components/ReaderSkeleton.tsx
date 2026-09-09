import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  List,
  MessageCircle,
  Settings,
  X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Skeleton, SkeletonSection, SkeletonText } from '../../../components/Skeleton'
import { loadReaderPrefs, type ReaderImageFit } from '../../../lib/reader'

const ReaderSkeleton = ({
  webtoonId,
  darkMode: darkModeProp,
  imageFit: imageFitProp,
}: {
  webtoonId?: string
  darkMode?: boolean
  imageFit?: ReaderImageFit
}) => {
  const { t } = useTranslation()
  const loaded = loadReaderPrefs()
  const darkMode = darkModeProp ?? loaded.darkMode
  const imageFit = imageFitProp ?? loaded.imageFit
  const tone = darkMode ? 'dark' : 'light'
  const chromeHover = darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
  const chromeBorder = darkMode
    ? 'border-white/5 bg-gray-950/75 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]'
    : 'border-gray-200 bg-white/75 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)]'
  const footerChromeBorder = darkMode
    ? 'border-white/5 bg-gray-950/75 shadow-[0_-8px_32px_0_rgba(0,0,0,0.37)]'
    : 'border-gray-200 bg-white/75 shadow-[0_-8px_32px_0_rgba(31,38,135,0.08)]'

  return (
    <SkeletonSection className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <header
        data-testid="reader-skeleton-header"
        className={`safe-top fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md ${chromeBorder}`}
      >
        <div className="relative mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {webtoonId ? (
                <a
                  href={`/webtoon/${webtoonId}`}
                  title={t('readerPage.closeReader')}
                  aria-label={t('readerPage.closeReader')}
                  className={`flex min-h-11 min-w-11 items-center justify-center rounded-2xl transition ${chromeHover}`}
                >
                  <X className="h-5 w-5" />
                </a>
              ) : (
                <Skeleton tone={tone} className="h-10 w-10 shrink-0" />
              )}
              <div>
                <SkeletonText tone={tone} className="h-4 w-40 sm:w-56" />
                <SkeletonText tone={tone} className="mt-1.5 h-3 w-28 sm:w-40" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                tabIndex={-1}
                aria-disabled="true"
                title={t('readerPage.settings')}
                aria-label={t('readerPage.settings')}
                className={`flex min-h-11 min-w-11 items-center justify-center rounded-2xl ${chromeHover}`}
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                type="button"
                tabIndex={-1}
                aria-disabled="true"
                title={t('readerPage.comments')}
                aria-label={t('readerPage.comments')}
                className={`flex min-h-11 items-center gap-1 rounded-2xl px-2.5 py-2.5 ${chromeHover}`}
              >
                <MessageCircle className="h-5 w-5" />
                <Skeleton tone={tone} className="h-3 w-4" />
              </button>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 left-0 h-[3px] bg-gray-200/20">
            <div
              className="progress-bar from-primary-500 to-accent-600 h-full bg-gradient-to-r"
              style={{ width: '0%' }}
              role="progressbar"
              aria-valuenow={0}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </header>

      <main
        className={`${imageFit === 'full' ? 'w-full' : 'mx-auto max-w-2xl'} px-0 pt-20 pb-16 sm:px-2 md:pt-24`}
      >
        <div className="min-h-[50dvh] w-full" aria-hidden="true" />
      </main>

      <div
        data-testid="reader-skeleton-footer"
        className={`safe-bottom fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur-md ${footerChromeBorder}`}
      >
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled
              title={t('reader.previousEpisode')}
              aria-label={t('reader.previousEpisode')}
              className="flex min-h-[44px] cursor-not-allowed items-center gap-2 rounded-2xl px-4 py-2 opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden sm:inline">{t('readerPage.prevEpisode')}</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tabular-nums opacity-70">0 / 0</span>
              <button
                type="button"
                tabIndex={-1}
                aria-disabled="true"
                title={t('webtoon.likes')}
                aria-label={t('webtoon.likes')}
                className={`flex min-h-[44px] items-center gap-1 rounded-2xl px-4 py-2 ${chromeHover}`}
              >
                <Heart className="h-5 w-5" />
              </button>
              <button
                type="button"
                tabIndex={-1}
                aria-disabled="true"
                title={t('webtoonDetail.subscribe')}
                aria-label={t('webtoonDetail.subscribe')}
                className={`flex min-h-[44px] items-center gap-1 rounded-2xl px-4 py-2 ${chromeHover}`}
              >
                <Bookmark className="h-5 w-5" />
              </button>
              <button
                type="button"
                tabIndex={-1}
                aria-disabled="true"
                title={t('readerPage.episodeList')}
                aria-label={t('readerPage.episodeList')}
                className={`flex min-h-[44px] items-center gap-1 rounded-2xl px-4 py-2 ${chromeHover}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
            <button
              type="button"
              disabled
              title={t('reader.nextEpisode')}
              aria-label={t('reader.nextEpisode')}
              className="flex min-h-[44px] cursor-not-allowed items-center gap-2 rounded-2xl px-4 py-2 opacity-30"
            >
              <span className="hidden sm:inline">{t('readerPage.nextEpisode')}</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </SkeletonSection>
  )
}

export default ReaderSkeleton
