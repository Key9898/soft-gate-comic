import { Skeleton, SkeletonSection, SkeletonText } from '../../../components/Skeleton'

const CompactLibraryCard = () => (
  <div className="flex flex-col">
    <Skeleton className="book-media aspect-[3/4] w-full" />
    <div className="mt-2.5 flex flex-col gap-1.5 px-0.5">
      <SkeletonText className="w-3/4" />
      <SkeletonText className="h-3 w-2/3" />
    </div>
  </div>
)

const LibraryPageSkeleton = () => (
  <SkeletonSection className="min-h-screen bg-gray-50 pb-24">
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-40 rounded-lg sm:h-9" />
          <SkeletonText className="mt-1 w-56" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="mb-6 rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col border-b border-gray-100 sm:flex-row sm:items-center">
          <div className="scrollbar-hide flex overflow-x-auto">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                data-testid="library-tab"
                className="flex min-h-[44px] items-center px-6 py-4"
              >
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-2 sm:ml-auto sm:border-0">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
        <div className="p-4">
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }, (_, i) => (
          <CompactLibraryCard key={i} />
        ))}
      </div>
    </div>
  </SkeletonSection>
)

export default LibraryPageSkeleton
