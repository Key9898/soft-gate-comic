import { Skeleton, SkeletonSection, SkeletonText } from '../../../components/Skeleton'

const SearchPageSkeleton = () => (
  <SkeletonSection className="min-h-screen bg-gray-50">
    <div className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Skeleton className="h-12 w-full max-w-2xl" />
      </div>
    </div>

    <div className="py-8">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        {Array.from({ length: 2 }, (_, column) => (
          <div key={column}>
            <SkeletonText className="mb-4 w-36" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-10 w-28" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </SkeletonSection>
)

export default SearchPageSkeleton
