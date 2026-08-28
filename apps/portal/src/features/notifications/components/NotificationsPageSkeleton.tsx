import { Skeleton, SkeletonSection, SkeletonText } from '../../../components/Skeleton'

const NotificationsPageSkeleton = () => (
  <SkeletonSection className="min-h-screen bg-gray-50">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Skeleton className="mb-6 h-8 w-48 rounded-lg" />
        <div className="mb-6 flex flex-wrap gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="min-h-11 w-24" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-4">
              <Skeleton className="shape-circle h-10 w-10 shrink-0" />
              <div className="min-w-0 flex-1">
                <SkeletonText className="w-2/3" />
                <SkeletonText className="mt-2 h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </SkeletonSection>
)

export default NotificationsPageSkeleton
