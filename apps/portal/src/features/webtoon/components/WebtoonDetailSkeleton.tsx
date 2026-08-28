import { Skeleton, SkeletonSection, SkeletonText } from '../../../components/Skeleton'

const WebtoonDetailSkeleton = () => (
  <SkeletonSection className="min-h-screen bg-gray-50">
    <section className="relative overflow-visible bg-gray-900">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-10">
          <div className="w-56 flex-shrink-0 overflow-visible px-2 sm:w-72 lg:w-80 xl:w-96">
            <Skeleton tone="dark" className="book-media aspect-[3/4] w-full" />
          </div>
          <div className="flex w-full flex-1 flex-col items-center gap-4 md:items-start">
            <Skeleton tone="dark" className="h-6 w-24 rounded-2xl" />
            <Skeleton tone="dark" className="h-10 w-2/3 rounded-xl lg:h-12" />
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Skeleton tone="dark" className="shape-circle h-8 w-8" />
              <SkeletonText tone="dark" className="w-28" />
              <Skeleton tone="dark" className="h-8 w-20 rounded-2xl" />
              <Skeleton tone="dark" className="h-8 w-16 rounded-2xl" />
            </div>
            <SkeletonText tone="dark" className="w-full max-w-lg" />
            <SkeletonText tone="dark" className="w-2/3 max-w-md" />
            <div className="scrollbar-hide flex flex-nowrap items-center justify-center gap-3 overflow-x-auto sm:flex-wrap sm:gap-4 md:justify-start">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} tone="dark" className="h-12 w-28 shrink-0 rounded-2xl" />
              ))}
            </div>
            <div
              data-testid="hub-next-drop-slot"
              className="w-full rounded-2xl bg-white/10 px-4 py-3"
            >
              <SkeletonText tone="dark" className="h-3 w-24" />
              <SkeletonText tone="dark" className="mt-1 w-40" />
              <SkeletonText tone="dark" className="mt-1 h-3 w-36" />
            </div>
            <div className="flex w-full max-w-md flex-col items-center gap-2 md:items-start">
              <SkeletonText tone="dark" className="h-3 w-28" />
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton key={i} tone="dark" className="h-11 w-12 rounded-lg" />
                ))}
              </div>
              <SkeletonText tone="dark" className="h-3 w-48" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Skeleton tone="dark" className="h-12 w-40" />
              <Skeleton tone="dark" className="h-12 w-36" />
              <Skeleton tone="dark" className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            data-testid="hub-episode-tabs"
            className="flex items-center gap-1 rounded-2xl bg-gray-100 p-1"
          >
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="min-h-[44px] w-28" />
            ))}
          </div>
          <Skeleton className="h-11 w-36" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 border-b border-gray-100 p-3 last:border-b-0 sm:gap-4 sm:p-4"
            >
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <Skeleton className="aspect-[202/142] w-20 shrink-0 rounded-2xl sm:w-24" />
                <div className="flex w-full min-w-0 flex-col gap-2">
                  <SkeletonText className="w-1/3" />
                  <SkeletonText className="h-3 w-1/2" />
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
                <SkeletonText className="h-3 w-16" />
                <SkeletonText className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="border-t border-gray-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-7 w-44 rounded-lg" />
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-4">
              <div className="flex gap-3">
                <Skeleton className="shape-circle h-10 w-10 shrink-0" />
                <div className="min-w-0 flex-1">
                  <SkeletonText className="w-1/4" />
                  <SkeletonText className="mt-2 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </SkeletonSection>
)

export default WebtoonDetailSkeleton
