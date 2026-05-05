import { SkeletonBox, SkeletonLine } from '../../components/Skeleton';

export default function CaseStudyDetailLoading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="relative h-[60vh] md:h-[75vh] animate-pulse" style={{ background: 'var(--card)' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-[136px] pb-14 md:pb-24 gap-4">
          <div className="flex gap-2">
            <SkeletonLine className="h-6 w-16" />
            <SkeletonLine className="h-6 w-20" />
            <SkeletonLine className="h-6 w-14" />
          </div>
          <SkeletonLine className="h-12 w-2/3" />
          <SkeletonLine className="h-5 w-1/2" />
          <SkeletonLine className="h-4 w-32 mt-1" />
        </div>
      </div>

      {/* Metrics strip skeleton */}
      <div className="px-6 md:px-[136px] py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="p-7 md:p-9 flex flex-col gap-3">
              <SkeletonLine className="h-10 w-24" />
              <SkeletonLine className="h-4 w-20" />
              <SkeletonLine className="h-3 w-full" />
              <SkeletonLine className="h-3 w-4/5" />
            </SkeletonBox>
          ))}
        </div>
      </div>

      {/* Overview skeleton */}
      <div className="px-6 md:px-[136px] py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {['CHALLENGE', 'SOLUTION', 'RESULT'].map((label) => (
            <SkeletonBox key={label} className="p-8 md:p-10 flex flex-col gap-4">
              <SkeletonLine className="h-3 w-20" />
              <SkeletonLine className="h-4 w-full" />
              <SkeletonLine className="h-4 w-full" />
              <SkeletonLine className="h-4 w-3/4" />
            </SkeletonBox>
          ))}
        </div>
      </div>

      {/* Approach skeleton */}
      <div className="px-6 md:px-[136px] py-10 md:py-16">
        <div className="mb-10 flex flex-col gap-3">
          <SkeletonLine className="h-3 w-28" />
          <SkeletonLine className="h-8 w-56" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="p-8 md:p-10 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="animate-pulse w-10 h-10 rounded-full shrink-0" style={{ background: 'var(--border)' }} />
                <SkeletonLine className="h-5 w-48" />
              </div>
              <SkeletonLine className="h-4 w-full" />
              <SkeletonLine className="h-4 w-5/6" />
            </SkeletonBox>
          ))}
        </div>
      </div>

      {/* Channels skeleton */}
      <div className="px-6 md:px-[136px] py-10">
        <SkeletonBox className="p-8 md:p-10 flex flex-wrap items-center gap-4">
          <SkeletonLine className="h-3 w-28 mr-4" />
          {[70, 60, 80, 65].map((w, i) => (
            <SkeletonLine key={i} className="h-7 rounded-full" style={{ width: w }} />
          ))}
        </SkeletonBox>
      </div>
    </div>
  );
}
