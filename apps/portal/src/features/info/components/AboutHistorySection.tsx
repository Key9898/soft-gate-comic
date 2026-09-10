import { useTranslation } from 'react-i18next'
import { SkeletonText } from '../../../components/Skeleton/Skeleton'
import {
  aboutMonthKey,
  groupHistoriesByYear,
  pickBilingual,
  type PortalAboutHistory,
} from '../../../lib/about/history'
import { useAboutHistories } from '../useAboutHistories'

const SECTION_HEADING =
  'flex items-center gap-2 text-xl font-bold tracking-wider text-balance text-gray-900 uppercase'

const SECTION_RULE = 'border-t border-gray-200/60 py-20'

const MOCK_HISTORY = [
  {
    yearKey: 'about.history1Year',
    titleKey: 'about.history1Title',
    descKey: 'about.history1Desc',
    photo: '/about/team/studio-workspace.jpg',
  },
  {
    yearKey: 'about.history2Year',
    titleKey: 'about.history2Title',
    descKey: 'about.history2Desc',
  },
  {
    yearKey: 'about.history3Year',
    titleKey: 'about.history3Title',
    descKey: 'about.history3Desc',
  },
  {
    yearKey: 'about.history4Year',
    titleKey: 'about.history4Title',
    descKey: 'about.history4Desc',
  },
] as const

const PHOTO_CLASS = 'mt-6 h-48 w-full max-w-3xl rounded-3xl object-cover sm:h-64'

function HistorySkeleton() {
  const { t } = useTranslation()
  return (
    <div className="mt-10 space-y-10" aria-busy="true" aria-live="polite">
      <span className="sr-only">{t('a11y.loading')}</span>
      {[0, 1].map((row) => (
        <div key={row} className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <SkeletonText className="h-4 w-16 lg:col-span-2" />
          <div className="space-y-3 lg:col-span-10">
            <SkeletonText className="h-4 w-24" />
            <SkeletonText className="h-4 w-48" />
            <SkeletonText className="max-w-3xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

function MockHistoryList() {
  const { t } = useTranslation()
  return (
    <ol className="mt-10 space-y-10">
      {MOCK_HISTORY.map((item) => (
        <li key={item.titleKey} className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <p className="text-primary-600 text-sm font-bold tracking-widest uppercase lg:col-span-2">
            {t(item.yearKey)}
          </p>
          <div className="lg:col-span-10">
            <h3 className="text-base font-bold text-gray-900">{t(item.titleKey)}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed font-medium text-gray-500">
              {t(item.descKey)}
            </p>
            {'photo' in item ? (
              <img
                src={item.photo}
                alt={t('about.studioAlt')}
                width={1920}
                height={1080}
                loading="lazy"
                className={PHOTO_CLASS}
              />
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}

function HttpHistoryList({ histories, lang }: { histories: PortalAboutHistory[]; lang: string }) {
  const { t } = useTranslation()
  const groups = groupHistoriesByYear(histories)
  return (
    <ol className="mt-10 space-y-12">
      {groups.map((group) => (
        <li key={group.year} className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <p className="text-primary-600 text-sm font-bold tracking-widest uppercase lg:col-span-2">
            {String(group.year)}
          </p>
          <ol className="space-y-10 lg:col-span-10">
            {group.items.map((item) => {
              const title = pickBilingual(item.title, lang)
              const monthKey = aboutMonthKey(item.month)
              const monthLabel = monthKey ? t(monthKey) : String(item.month)
              return (
                <li key={item.id}>
                  <p className="text-2xs font-bold tracking-widest text-gray-400 uppercase">
                    {monthLabel}
                  </p>
                  <h3 className="mt-1 text-base font-bold text-gray-900">{title}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed font-medium text-gray-500">
                    {pickBilingual(item.description, lang)}
                  </p>
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={title}
                      width={1920}
                      height={1080}
                      loading="lazy"
                      className={PHOTO_CLASS}
                    />
                  ) : null}
                </li>
              )
            })}
          </ol>
        </li>
      ))}
    </ol>
  )
}

const AboutHistorySection = () => {
  const { t, i18n } = useTranslation()
  const state = useAboutHistories()

  return (
    <section className={SECTION_RULE}>
      <h2 className={SECTION_HEADING}>
        <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
        {t('about.ourHistory')}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed font-medium text-gray-500">
        {t('about.historyDeck')}
      </p>
      {state.status === 'mock' ? <MockHistoryList /> : null}
      {state.status === 'loading' ? <HistorySkeleton /> : null}
      {state.status === 'empty' ? (
        <p className="mt-10 max-w-3xl text-sm leading-relaxed font-medium text-gray-500">
          {t('about.historyEmpty')}
        </p>
      ) : null}
      {state.status === 'error' ? (
        <div className="mt-10 max-w-3xl">
          <p className="text-sm leading-relaxed font-medium text-gray-500">
            {t('about.historyUnavailable')}
          </p>
          <button
            type="button"
            onClick={state.retry}
            className="mt-4 min-h-11 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-gray-800 ring-1 ring-gray-200 transition hover:bg-gray-50"
          >
            {t('a11y.retry')}
          </button>
        </div>
      ) : null}
      {state.status === 'ready' ? (
        <HttpHistoryList histories={state.histories} lang={i18n.language} />
      ) : null}
    </section>
  )
}

export default AboutHistorySection
