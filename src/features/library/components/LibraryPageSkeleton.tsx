import {
  Skeleton,
  SkeletonBookCard,
  SkeletonSection,
  SkeletonText,
} from '../../../components/Skeleton'

const LibraryPageSkeleton = () => (
  <SkeletonSection className="min-h-screen bg-gray-50 pb-24">
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Skeleton className="mb-2 h-8 w-40 rounded-lg" />
      <SkeletonText className="mb-6 w-56" />
      <Skeleton className="mb-8 h-16 w-full rounded-3xl" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }, (_, i) => (
          <SkeletonBookCard key={i} />
        ))}
      </div>
    </div>
  </SkeletonSection>
)

export default LibraryPageSkeleton
