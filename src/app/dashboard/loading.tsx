import { Container } from '@/components/layout/Container';
import { SkeletonStatCard } from '@/components/ui/Skeleton';

/**
 * Dashboard loading state
 * 
 * Shows:
 * - 6 stat card skeletons in a 3-column grid
 * - 2 chart placeholder areas
 */
export default function DashboardLoading() {
  return (
    <Container className="space-y-8 py-8">
      {/* Greeting skeleton */}
      <div className="space-y-3">
        <div className="h-9 w-80 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
        <div className="h-4 w-64 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
      </div>

      {/* Key Metrics section */}
      <div>
        <div className="h-7 w-32 bg-[rgba(255,255,255,0.06)] rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>
      </div>

      {/* Quick Actions section */}
      <div>
        <div className="h-7 w-36 bg-[rgba(255,255,255,0.06)] rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Recent Activity section */}
      <div>
        <div className="h-7 w-40 bg-[rgba(255,255,255,0.06)] rounded animate-pulse mb-6" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* System Information */}
      <div className="h-20 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
    </Container>
  );
}
