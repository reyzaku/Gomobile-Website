import { SkeletonBox, SkeletonLine } from '../../components/Skeleton';

export default function BlogPostLoading() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Hero skeleton */}
      <div className="relative h-[60vh] md:h-[70vh] animate-pulse" style={{ background: 'var(--card)' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-[136px] pb-14 md:pb-20 gap-4">
          <div className="flex gap-2">
            <SkeletonLine className="h-6 w-20" />
            <SkeletonLine className="h-6 w-16" />
          </div>
          <SkeletonLine className="h-10 w-3/4" />
          <SkeletonLine className="h-10 w-1/2" />
          <div className="flex gap-4 mt-2">
            <SkeletonLine className="h-4 w-24" />
            <SkeletonLine className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="px-6 md:px-[136px] py-16 max-w-[860px] mx-auto flex flex-col gap-5">
        <SkeletonLine className="h-5 w-full" />
        <SkeletonLine className="h-5 w-full" />
        <SkeletonLine className="h-5 w-5/6" />
        <SkeletonLine className="h-5 w-full" />
        <SkeletonLine className="h-5 w-4/5" />

        <SkeletonLine className="h-8 w-2/3 mt-6" />
        <SkeletonLine className="h-5 w-full" />
        <SkeletonLine className="h-5 w-full" />
        <SkeletonLine className="h-5 w-3/4" />

        <SkeletonLine className="h-8 w-1/2 mt-6" />
        <SkeletonLine className="h-5 w-full" />
        <SkeletonLine className="h-5 w-5/6" />
      </div>

      {/* Related posts skeleton */}
      <div className="px-6 md:px-[136px] pb-20">
        <SkeletonLine className="h-4 w-32 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBox key={i} className="overflow-hidden">
              <div className="animate-pulse h-[160px]" style={{ background: 'var(--border)' }} />
              <div className="p-5 flex flex-col gap-3">
                <SkeletonLine className="h-4 w-3/4" />
                <SkeletonLine className="h-4 w-1/2" />
              </div>
            </SkeletonBox>
          ))}
        </div>
      </div>
    </main>
  );
}
