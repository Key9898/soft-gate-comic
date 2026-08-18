import { Skeleton, SkeletonSection, SkeletonText } from '../../../components/Skeleton'

const WebtoonDetailSkeleton = () => (
  <SkeletonSection className="min-h-screen bg-gray-50">
    <div className="bg-gray-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-start lg:px-8 lg:py-16">
        <Skeleton tone="dark" className="book-media aspect-[3/4] w-56 shrink-0 lg:w-72" />
        <div className="flex w-full flex-col gap-4">
          <Skeleton tone="dark" className="h-6 w-24 rounded-2xl" />
          <Skeleton tone="dark" className="h-10 w-2/3 rounded-xl" />
          <SkeletonText tone="dark" className="w-1/3" />
          <SkeletonText tone="dark" className="w-full max-w-lg" />
          <SkeletonText tone="dark" className="w-2/3 max-w-md" />
          <div className="mt-2 flex gap-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} tone="dark" className="h-16 w-24" />
            ))}
          </div>
          <div className="mt-2 flex gap-3">
            <Skeleton tone="dark" className="h-12 w-40" />
            <Skeleton tone="dark" className="h-12 w-32" />
          </div>
        </div>
      </div>
    </div>

    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4"
            >
              <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
              <div className="flex w-full flex-col gap-2">
                <SkeletonText className="w-1/3" />
                <SkeletonText className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </SkeletonSection>
)

export default WebtoonDetailSkeleton
