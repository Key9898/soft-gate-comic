import { Skeleton, SkeletonSection, SkeletonText } from '../../../components/Skeleton'

const ProfilePageSkeleton = () => (
  <SkeletonSection className="min-h-screen bg-gray-50">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="flex flex-col items-center gap-4 rounded-3xl border border-gray-200 bg-white p-6 lg:items-stretch">
          <Skeleton className="shape-circle mx-auto h-24 w-24" />
          <SkeletonText className="mx-auto w-32" />
          <SkeletonText className="mx-auto h-3 w-40" />
          <div className="mt-4 flex w-full flex-col gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-11 w-full" />
            ))}
          </div>
        </aside>
        <div className="lg:col-span-3">
          <Skeleton className="mb-6 h-8 w-48 rounded-lg" />
          <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </SkeletonSection>
)

export default ProfilePageSkeleton
