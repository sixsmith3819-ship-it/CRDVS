import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { SkeletonTable } from '@/components/ui/Skeleton';

/**
 * Audit Log loading state
 * 
 * Shows:
 * - Toolbar skeleton (title + download button)
 * - Filter bar skeleton
 * - Table with 10 row skeletons
 */
export default function AuditLogLoading() {
  return (
    <Layout breadcrumbs={[{ label: 'Admin' }, { label: 'Audit Log' }]}>
      <Container>
        <div className="space-y-6 py-6">
          {/* Page header skeleton */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <div className="h-8 w-56 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
              <div className="h-4 w-72 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
            </div>
            <div className="h-10 w-36 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
          </div>

          {/* Filter toolbar skeleton */}
          <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-lg p-4 md:p-5">
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              {/* Search input */}
              <div className="flex-1 min-w-[200px] h-10 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
              {/* Filter dropdowns */}
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-36 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse"
                />
              ))}
              {/* Date range */}
              <div className="h-10 w-44 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Table skeleton */}
          <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden">
            {/* Table header */}
            <div className="flex gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
              {/* Timestamp */}
              <div className="w-36 h-4 bg-[rgba(255,255,255,0.08)] rounded animate-pulse" />
              {/* User */}
              <div className="flex-1 h-4 bg-[rgba(255,255,255,0.08)] rounded animate-pulse" />
              {/* Action */}
              <div className="w-24 h-4 bg-[rgba(255,255,255,0.08)] rounded animate-pulse" />
              {/* Table */}
              <div className="w-28 h-4 bg-[rgba(255,255,255,0.08)] rounded animate-pulse" />
              {/* Record ID */}
              <div className="w-32 h-4 bg-[rgba(255,255,255,0.08)] rounded animate-pulse" />
              {/* Details */}
              <div className="w-24 h-4 bg-[rgba(255,255,255,0.08)] rounded animate-pulse" />
            </div>

            {/* Data rows */}
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.04)] last:border-0"
              >
                <div className="w-36 h-4 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-7 h-7 bg-[rgba(255,255,255,0.06)] rounded-full animate-pulse" />
                  <div className="h-4 w-28 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                </div>
                <div className="w-24 h-6 bg-[rgba(255,255,255,0.06)] rounded-full animate-pulse" />
                <div className="w-28 h-4 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                <div className="w-32 h-4 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                <div className="w-24 h-8 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
              </div>
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-4 w-40 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
