import { Skeleton, SkeletonSection } from '../../../components/Skeleton'

const ReaderSkeleton = () => (
  <SkeletonSection className="min-h-screen bg-gray-950">
    <div className="fixed top-0 right-0 left-0 border-b border-white/5 bg-gray-950/90">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Skeleton tone="dark" className="h-6 w-40 rounded-lg" />
        <Skeleton tone="dark" className="h-8 w-24 rounded-lg" />
      </div>
    </div>
    <div className="mx-auto flex max-w-2xl flex-col gap-1 px-0 pt-20 pb-16 sm:px-2 md:pt-24">
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} tone="dark" className="h-[60vh] w-full rounded-none sm:rounded-2xl" />
      ))}
    </div>
  </SkeletonSection>
)

export default ReaderSkeleton
