import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CalendarDays, Clock, Play, Sparkles, TrendingUp } from 'lucide-react'
import Button from '../../../components/Button'
import CatalogBusyPanel from '../../../components/CatalogBusyPanel'
import GenreRailChevron from '../../../components/GenreRailChevron'
import SEO from '../../../components/SEO/SEO'
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from '../../../components/SEO/jsonLd'
import { SkeletonSection } from '../../../components/Skeleton'
import { todayWeekday, UPLOAD_DAY_ORDER } from '../../../lib/catalog'

const WEEKDAY_KEYS = [
  'home.weekdaySun',
  'home.weekdayMon',
  'home.weekdayTue',
  'home.weekdayWed',
  'home.weekdayThu',
  'home.weekdayFri',
  'home.weekdaySat',
] as const

const BusyWell = () => (
  <SkeletonSection>
    <CatalogBusyPanel />
  </SkeletonSection>
)

const RailHead = ({
  title,
  description,
  icon,
}: {
  title: string
  description?: string
  icon?: ReactNode
}) => (
  <div className="mb-6 min-w-0">
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
    </div>
    {description ? <p className="mt-1 text-xs text-gray-500 sm:text-sm">{description}</p> : null}
  </div>
)

const HomePageSkeleton = ({
  signedIn = false,
  hasContinueHistory = false,
  registrationOpen = true,
}: {
  signedIn?: boolean
  hasContinueHistory?: boolean
  registrationOpen?: boolean
}) => {
  const { t } = useTranslation()
  const showContinue = signedIn && hasContinueHistory
  const today = todayWeekday()

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={t('nav.home')}
        description={t('footer.description')}
        path="/"
        jsonLd={[buildWebsiteJsonLd(), buildOrganizationJsonLd()]}
      />
      <section className="safe-top relative -mt-16 overflow-visible pt-16 text-white">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden bg-gray-950 bg-cover bg-center"
          style={{ backgroundImage: `url('/banner/banner.png')` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-r from-gray-950/70 via-gray-950/30 to-gray-950/45"
          aria-hidden="true"
        />
        <div className="hero-landscape-adjust relative mx-auto flex min-h-[22rem] max-w-7xl flex-col justify-center px-4 py-10 sm:min-h-[26rem] sm:px-6 sm:py-12 lg:min-h-[32rem] lg:px-8 lg:py-14 xl:min-h-[36rem] xl:py-16">
          <div className="relative z-10 flex w-full max-w-2xl min-w-0 flex-col text-center lg:text-left">
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t('home.pageHeading')}
            </h1>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="hidden shrink-0 font-medium whitespace-nowrap text-gray-500 sm:inline">
              {t('home.genres')}:
            </span>
            <div className="min-w-0 flex-1">
              <BusyWell />
            </div>
            <GenreRailChevron enabled={false} size="sm" />
          </div>
        </div>
      </section>

      {showContinue ? (
        <section data-testid="home-continue" className="bg-white py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
              {t('home.continueReading')}
            </h2>
            <BusyWell />
          </div>
        </section>
      ) : (
        <section data-testid="home-start-here" className="bg-white py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <RailHead
              title={t('home.startHere')}
              description={t('home.startHereDesc')}
              icon={<Play className="text-primary-600 h-5 w-5 shrink-0" aria-hidden="true" />}
            />
            <BusyWell />
          </div>
        </section>
      )}

      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RailHead title={t('home.ranking')} description={t('home.rankingDesc')} />
          <BusyWell />
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RailHead
            title={t('home.trendingNow')}
            description={t('home.trendingDesc')}
            icon={<TrendingUp className="text-primary-600 h-5 w-5 shrink-0" aria-hidden="true" />}
          />
          <BusyWell />
        </div>
      </section>

      <section id="home-daily" className="bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 min-w-0">
            <div className="flex items-center gap-2">
              <CalendarDays className="text-primary-600 h-5 w-5 shrink-0" aria-hidden="true" />
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{t('home.daily')}</h2>
            </div>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">{t('home.dailyDesc')}</p>
          </div>
          <div className="mb-6 flex flex-wrap gap-2">
            {UPLOAD_DAY_ORDER.map((value) => {
              const selected = value === today
              return (
                <button
                  key={value}
                  type="button"
                  data-testid="home-daily-weekday"
                  aria-pressed={selected}
                  className={`inline-flex min-h-11 items-center rounded-2xl px-4 py-2 text-sm font-medium ${
                    selected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {t(WEEKDAY_KEYS[value])}
                </button>
              )
            })}
          </div>
          <BusyWell />
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RailHead
            title={t('home.updated')}
            description={t('home.updatedDesc')}
            icon={<Clock className="text-primary-600 h-5 w-5 shrink-0" aria-hidden="true" />}
          />
          <BusyWell />
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RailHead
            title={t('home.newReleases')}
            description={t('home.newReleasesDesc')}
            icon={<Sparkles className="text-primary-600 h-5 w-5 shrink-0" aria-hidden="true" />}
          />
          <BusyWell />
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="from-primary-600 to-primary-700 rounded-3xl bg-gradient-to-r p-6 text-center text-white sm:p-8 md:p-10">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              {t('home.startJourney')}
            </h2>
            <p className="mx-auto mb-6 max-w-xl text-white">{t('home.joinDescription')}</p>
            <Link
              to={signedIn ? '/categories' : registrationOpen ? '/register' : '/login'}
              className="focus:ring-offset-primary-700 inline-block rounded-2xl focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
            >
              <Button variant="secondary">
                {signedIn ? t('home.browseNow') : t('home.getStartedFree')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePageSkeleton
