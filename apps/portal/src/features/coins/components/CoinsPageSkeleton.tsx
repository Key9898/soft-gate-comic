import { Skeleton, SkeletonSection, SkeletonText } from '../../../components/Skeleton'

const CoinsPageSkeleton = () => (
  <SkeletonSection className="min-h-screen bg-gray-50">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Skeleton className="mb-6 h-24 w-full rounded-3xl" />
        <div className="mb-6 flex gap-2">
          <Skeleton className="min-h-11 w-28" />
          <Skeleton className="min-h-11 w-28" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="rounded-3xl border border-gray-200 bg-white p-5">
              <Skeleton className="mb-3 h-8 w-24 rounded-lg" />
              <SkeletonText className="mb-4 w-1/2" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </SkeletonSection>
)

export default CoinsPageSkeleton
