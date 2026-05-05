import { SkeletonBox, SkeletonLine } from '../components/Skeleton';

export default function BlogLoading() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Page hero skeleton */}
      <div className="px-6 md:px-[136px] pt-[160px] pb-12">
        <SkeletonLine className="h-3 w-24 mb-5" />
        <SkeletonLine className="h-10 w-2/3 mb-4" />
        <SkeletonLine className="h-5 w-1/2" />
      </div>

      {/* Filter chips skeleton */}
      <div className="px-6 md:px-[136px] pb-8 flex gap-3 flex-wrap">
        {[100, 80, 120, 90, 110].map((w, i) => (
          <div
            key={i}
            className="animate-pulse h-8 rounded-full"
            style={{ width: w, background: 'var(--border)' }}
          />
        ))}
      </div>

      {/* Blog post cards skeleton */}
      <div className="px-6 md:px-[136px] pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBox key={i} className="overflow-hidden">
            {/* Thumbnail */}
            <div className="animate-pulse h-[220px] w-full rounded-[12px]" style={{ background: 'var(--border)' }} />
            <div className="p-6 flex flex-col gap-3">
              <SkeletonLine className="h-3 w-20" />
              <SkeletonLine className="h-5 w-full" />
              <SkeletonLine className="h-5 w-4/5" />
              <SkeletonLine className="h-4 w-full mt-1" />
              <SkeletonLine className="h-4 w-3/4" />
              <div className="flex gap-2 mt-2">
                <SkeletonLine className="h-3 w-16" />
                <SkeletonLine className="h-3 w-12" />
              </div>
            </div>
          </SkeletonBox>
        ))}
      </div>
    </main>
  );
}
