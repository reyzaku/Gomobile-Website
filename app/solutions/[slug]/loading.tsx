import { SkeletonBox, SkeletonLine } from '../../components/Skeleton';

export default function SolutionDetailLoading() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Hero skeleton */}
      <div className="px-6 md:px-[136px] pt-[160px] pb-16 flex flex-col gap-4">
        <SkeletonLine className="h-3 w-32" />
        <SkeletonLine className="h-12 w-3/4" />
        <SkeletonLine className="h-12 w-1/2" />
        <SkeletonLine className="h-5 w-2/3 mt-2" />
        <div className="flex gap-3 mt-4">
          <SkeletonLine className="h-10 w-36 rounded-full" />
          <SkeletonLine className="h-10 w-36 rounded-full" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="px-6 md:px-[136px] py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="p-7 flex flex-col gap-3">
              <SkeletonLine className="h-9 w-20" />
              <SkeletonLine className="h-4 w-24" />
            </SkeletonBox>
          ))}
        </div>
      </div>

      {/* Features skeleton */}
      <div className="px-6 md:px-[136px] py-10 md:py-16">
        <div className="mb-10 flex flex-col gap-3">
          <SkeletonLine className="h-3 w-24" />
          <SkeletonLine className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBox key={i} className="p-8 flex flex-col gap-4">
              <div className="animate-pulse w-10 h-10 rounded-xl" style={{ background: 'var(--border)' }} />
              <SkeletonLine className="h-5 w-3/4" />
              <SkeletonLine className="h-4 w-full" />
              <SkeletonLine className="h-4 w-5/6" />
            </SkeletonBox>
          ))}
        </div>
      </div>

      {/* Related case studies skeleton */}
      <div className="px-6 md:px-[136px] py-10 md:py-16">
        <SkeletonLine className="h-4 w-40 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <SkeletonBox key={i} className="overflow-hidden h-[260px]">
              <div className="animate-pulse h-full w-full" style={{ background: 'var(--border)' }} />
            </SkeletonBox>
          ))}
        </div>
      </div>
    </main>
  );
}
