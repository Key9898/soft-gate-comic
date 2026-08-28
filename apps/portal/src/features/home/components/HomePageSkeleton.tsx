import GenreRailChevron from '../../../components/GenreRailChevron'
import {
  Skeleton,
  SkeletonBookCard,
  SkeletonDailyDropCard,
  SkeletonSection,
  SkeletonText,
} from '../../../components/Skeleton'

const CATALOG_GRID =
  'grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'

const CONTINUE_CAP = 12

const SkeletonRailHead = ({
  withIcon = false,
  withViewAll = false,
}: {
  withIcon?: boolean
  withViewAll?: boolean
}) => (
  <div className="mb-6 flex items-center justify-between gap-4">
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        {withIcon ? <Skeleton className="h-5 w-5 shrink-0 rounded-lg" /> : null}
        <Skeleton className="h-7 w-44 rounded-lg" />
      </div>
      <SkeletonText className="mt-1 h-3 w-72 max-w-full" />
    </div>
    {withViewAll ? <Skeleton className="h-11 w-20 shrink-0" /> : null}
  </div>
)

const SkeletonContinueCard = () => (
  <div data-testid="home-continue-card" className="w-36 shrink-0 sm:w-40">
    <Skeleton className="book-media aspect-[3/4] w-full rounded-[3px]" />
    <div className="mt-0 h-[3px] w-full bg-gray-200" />
    <SkeletonText className="mt-2 h-3 w-full" />
    <SkeletonText className="mt-1 h-3 w-2/3" />
  </div>
)

const HomePageSkeleton = ({
  signedIn = false,
  hasContinueHistory = false,
}: {
  signedIn?: boolean
  hasContinueHistory?: boolean
}) => {
  const showContinue = signedIn && hasContinueHistory
  const showForYou = signedIn

  return (
    <SkeletonSection className="min-h-screen bg-gray-50">
      <section className="safe-top relative -mt-16 overflow-visible pt-16">
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
          <div className="hero-spotlight-pair flex flex-col items-center gap-8 lg:mt-12 lg:flex-row lg:items-center lg:gap-12">
            <div className="relative z-10 flex w-full min-w-0 flex-1 flex-col items-center lg:items-start">
              <SkeletonText tone="dark" className="mb-1 h-3 w-24" />
              <SkeletonText tone="dark" className="mb-3 h-3 w-32" />
              <Skeleton tone="dark" className="mb-4 h-12 w-2/3 max-w-md rounded-xl lg:h-16" />
              <SkeletonText tone="dark" className="mb-8 w-full max-w-md" />
              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Skeleton tone="dark" className="h-11 w-36" />
                <Skeleton tone="dark" className="h-11 w-32" />
              </div>
              <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Skeleton key={i} tone="dark" className="h-2.5 w-2.5 rounded-2xl" />
                  ))}
                </div>
                <Skeleton tone="dark" className="shape-circle h-11 w-11" />
              </div>
            </div>
            <div className="relative z-0 mx-auto block w-56 overflow-visible px-2 sm:w-64 lg:mx-0 lg:mt-4 lg:w-72 xl:w-80">
              <Skeleton tone="dark" className="book-media aspect-[3/4] w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Skeleton className="hidden h-4 w-16 shrink-0 sm:block" />
            <div className="scrollbar-hide flex min-w-0 flex-1 flex-nowrap items-center gap-3 overflow-x-auto overscroll-x-contain pb-2">
              {Array.from({ length: 16 }, (_, i) => (
                <Skeleton key={i} className="min-h-11 w-24 shrink-0" />
              ))}
            </div>
            <GenreRailChevron enabled={false} size="sm" />
          </div>
        </div>
      </section>

      {showContinue ? (
        <section data-testid="home-continue" className="bg-white py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Skeleton className="mb-6 h-7 w-44 rounded-lg sm:h-8" />
            <div className="scrollbar-hide flex min-w-0 flex-nowrap items-stretch gap-4 overflow-x-auto overscroll-x-contain sm:gap-5">
              {Array.from({ length: CONTINUE_CAP }, (_, i) => (
                <SkeletonContinueCard key={`continue-${i}`} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section data-testid="home-start-here" className="bg-white py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SkeletonRailHead withIcon />
            <div className={CATALOG_GRID}>
              {Array.from({ length: 6 }, (_, i) => (
                <SkeletonBookCard key={`start-${i}`} />
              ))}
            </div>
          </div>
        </section>
      )}

      {showForYou ? (
        <section data-testid="home-for-you" className="py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SkeletonRailHead withIcon />
            <div className={CATALOG_GRID}>
              {Array.from({ length: 6 }, (_, i) => (
                <SkeletonBookCard key={`foryou-${i}`} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SkeletonRailHead withViewAll />
          <div className={CATALOG_GRID}>
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonBookCard key={`rank-${i}`} rank={i + 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SkeletonRailHead withIcon />
          <div className={CATALOG_GRID}>
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonBookCard key={`trend-${i}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 min-w-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 shrink-0 rounded-lg" />
              <Skeleton className="h-7 w-44 rounded-lg" />
            </div>
            <SkeletonText className="mt-1 h-3 w-72 max-w-full" />
          </div>
          <div className="mb-6 flex flex-wrap gap-2">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} data-testid="home-daily-weekday">
                <Skeleton className="min-h-11 w-20" />
              </div>
            ))}
          </div>
          <div className={CATALOG_GRID}>
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonDailyDropCard key={`daily-${i}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SkeletonRailHead withIcon withViewAll />
          <div className={CATALOG_GRID}>
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonBookCard key={`updated-${i}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SkeletonRailHead withIcon withViewAll />
          <div className={CATALOG_GRID}>
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonBookCard key={`new-${i}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="from-primary-600 to-primary-700 rounded-3xl bg-gradient-to-r p-6 sm:p-8 md:p-10">
            <div className="flex flex-col items-center gap-4">
              <Skeleton tone="dark" className="h-8 w-64 max-w-full rounded-xl sm:h-10" />
              <SkeletonText tone="dark" className="w-full max-w-xl" />
              <Skeleton tone="dark" className="h-11 w-40" />
            </div>
          </div>
        </div>
      </section>
    </SkeletonSection>
  )
}

export default HomePageSkeleton
