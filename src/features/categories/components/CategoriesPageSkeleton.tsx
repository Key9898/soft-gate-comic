import {
  Skeleton,
  SkeletonBookCard,
  SkeletonSection,
  SkeletonText,
} from '../../../components/Skeleton'

const CategoriesPageSkeleton = () => (
  <SkeletonSection className="min-h-screen bg-gray-50">
    <div className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-8 w-52 rounded-lg" />
        <Skeleton className="mb-6 h-12 w-full max-w-xl" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-24 shrink-0" />
          ))}
        </div>
      </div>
    </div>

    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <SkeletonText className="w-32" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }, (_, i) => (
            <SkeletonBookCard key={i} />
          ))}
        </div>
      </div>
    </div>
  </SkeletonSection>
)

export default CategoriesPageSkeleton
