import {
  Skeleton,
  SkeletonBookCard,
  SkeletonSection,
  SkeletonText,
} from '../../../components/Skeleton'

const HomePageSkeleton = () => (
  <SkeletonSection className="min-h-screen bg-gray-50">
    <div className="bg-gray-200/60">
      <div className="mx-auto flex min-h-[22rem] max-w-7xl flex-col justify-center gap-4 px-4 sm:px-6 md:min-h-[28rem] lg:min-h-[36rem] lg:px-8">
        <SkeletonText className="h-3 w-24" />
        <Skeleton className="h-10 w-2/3 max-w-md rounded-xl" />
        <SkeletonText className="w-1/2 max-w-sm" />
        <div className="mt-2 flex gap-3">
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-28" />
        </div>
      </div>
    </div>

    <div className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-24 shrink-0" />
        ))}
      </div>
    </div>

    <div className="bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-7 w-44 rounded-lg" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonBookCard key={`start-${i}`} />
          ))}
        </div>
      </div>
    </div>

    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-7 w-44 rounded-lg" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonBookCard key={i} rank={i + 1} />
          ))}
        </div>
      </div>
    </div>

    {Array.from({ length: 4 }, (_, section) => (
      <div key={section} className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="mb-6 h-7 w-44 rounded-lg" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonBookCard key={i} />
            ))}
          </div>
        </div>
      </div>
    ))}
  </SkeletonSection>
)

export default HomePageSkeleton
