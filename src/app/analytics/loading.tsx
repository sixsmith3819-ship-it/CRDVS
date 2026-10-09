import { Container } from '@/components/layout/Container';
import { SkeletonStatCard } from '@/components/ui/Skeleton';

/**
 * Analytics page loading state
 * 
 * Shows:
 * - Header skeleton
 * - Filter section skeleton
 * - 6 KPI card skeletons in a 3-column grid
 * - Chart placeholder
 */
export default function AnalyticsLoading() {
  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <Container maxWidth="xl" className="pt-8 pb-12">
        {/* Page Header skeleton */}
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <div className="h-10 w-80 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
            <div className="h-6 w-96 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
        </div>

        {/* Filter section skeleton */}
        <section className="mb-8">
          <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-lg p-6 md:p-8">
            <div className="space-y-6">
              {/* Filter header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 w-16 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                  <div className="h-4 w-48 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                </div>
              </div>

              {/* Date presets skeleton */}
              <div>
                <div className="h-4 w-24 bg-[rgba(255,255,255,0.06)] rounded animate-pulse mb-3" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              </div>

              {/* Custom date inputs skeleton */}
              <div>
                <div className="h-4 w-32 bg-[rgba(255,255,255,0.06)] rounded animate-pulse mb-3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-11 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
                  <div className="h-11 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
                </div>
              </div>

              {/* Status and category filters skeleton */}
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-36 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                  <div className="flex flex-wrap gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-9 w-24 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                </div>
                <div className="sm:w-56 space-y-3">
                  <div className="h-4 w-32 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                  <div className="h-10 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
                </div>
              </div>

              {/* Action buttons skeleton */}
              <div className="flex gap-3 justify-end pt-2 border-t border-[rgba(255,255,255,0.06)]">
                <div className="h-10 w-20 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
                <div className="h-10 w-28 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* KPI Cards skeleton */}
        <div className="mb-12">
          <div className="h-8 w-64 bg-[rgba(255,255,255,0.06)] rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </div>
        </div>

        {/* Chart placeholder skeleton */}
        <div>
          <div className="h-8 w-56 bg-[rgba(255,255,255,0.06)] rounded animate-pulse mb-6" />
          <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-lg p-6">
            <div className="h-96 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
          </div>
        </div>
      </Container>
    </main>
  );
}
