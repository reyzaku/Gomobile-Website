import { SkeletonBox, SkeletonLine } from '../components/Skeleton';

export default function CaseStudyLoading() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Page hero skeleton */}
      <div className="px-6 md:px-[136px] pt-[160px] pb-12">
        <SkeletonLine className="h-3 w-28 mb-5" />
        <SkeletonLine className="h-10 w-2/3 mb-4" />
        <SkeletonLine className="h-5 w-1/2" />
      </div>

      {/* Filter chips skeleton */}
      <div className="px-6 md:px-[136px] pb-8 flex gap-3 flex-wrap">
        {[80, 100, 90, 110, 75].map((w, i) => (
          <div
            key={i}
            className="animate-pulse h-8 rounded-full"
            style={{ width: w, background: 'var(--border)' }}
          />
        ))}
      </div>

      {/* Case study cards skeleton */}
      <div className="px-6 md:px-[136px] pb-24 flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox key={i} className="overflow-hidden flex flex-col md:flex-row h-auto md:h-[280px]">
            {/* Image side */}
            <div
              className="animate-pulse w-full md:w-[420px] shrink-0 h-[220px] md:h-full rounded-[12px]"
              style={{ background: 'var(--border)' }}
            />
            {/* Content side */}
            <div className="flex flex-col justify-center gap-4 p-8 flex-1">
              <SkeletonLine className="h-3 w-20" />
              <SkeletonLine className="h-6 w-4/5" />
              <SkeletonLine className="h-6 w-3/5" />
              {/* Metrics */}
              <div className="flex gap-6 mt-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex flex-col gap-1">
                    <SkeletonLine className="h-7 w-14" />
                    <SkeletonLine className="h-3 w-16" />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-1">
                <SkeletonLine className="h-6 w-16" />
                <SkeletonLine className="h-6 w-20" />
              </div>
            </div>
          </SkeletonBox>
        ))}
      </div>
    </main>
  );
}
