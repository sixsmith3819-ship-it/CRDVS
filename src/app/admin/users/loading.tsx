import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';

/**
 * User Management loading state
 * 
 * Shows:
 * - Page header skeleton with title and action button
 * - 4 stat cards row
 * - Search / filter bar skeleton
 * - Table with 8 row skeletons
 */
export default function UsersLoading() {
  return (
    <Layout breadcrumbs={[{ label: 'Admin' }, { label: 'User Management' }]}>
      <Container>
        <div className="py-6 space-y-6">
          {/* Page header skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-8 w-52 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
              <div className="h-4 w-72 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
            </div>
            <div className="h-11 w-28 bg-[rgba(255,255,255,0.06)] rounded-xl animate-pulse" />
          </div>

          {/* Stat cards row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl px-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] backdrop-blur-sm space-y-2"
              >
                <div className="h-4 w-20 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                <div className="h-8 w-12 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Search / filter bar skeleton */}
          <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-lg p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 h-10 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-36 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Table skeleton */}
          <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden">
            {/* Table header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
              {/* Name */}
              <div className="flex-1 h-4 bg-[rgba(255,255,255,0.08)] rounded animate-pulse" />
              {/* Role */}
              <div className="w-28 h-4 bg-[rgba(255,255,255,0.08)] rounded animate-pulse" />
              {/* Department */}
              <div className="w-32 h-4 bg-[rgba(255,255,255,0.08)] rounded animate-pulse hidden md:block" />
              {/* Status */}
              <div className="w-24 h-4 bg-[rgba(255,255,255,0.08)] rounded animate-pulse" />
              {/* Last login */}
              <div className="w-28 h-4 bg-[rgba(255,255,255,0.08)] rounded animate-pulse hidden lg:block" />
              {/* Actions */}
              <div className="w-20 h-4 bg-[rgba(255,255,255,0.08)] rounded animate-pulse" />
            </div>

            {/* Data rows */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3.5 border-b border-[rgba(255,255,255,0.04)] last:border-0"
              >
                {/* Avatar + name */}
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-9 h-9 bg-[rgba(255,255,255,0.06)] rounded-full animate-pulse shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-36 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                    <div className="h-3 w-48 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                  </div>
                </div>
                {/* Role badge */}
                <div className="w-28 h-6 bg-[rgba(255,255,255,0.06)] rounded-full animate-pulse" />
                {/* Department */}
                <div className="w-32 h-4 bg-[rgba(255,255,255,0.06)] rounded animate-pulse hidden md:block" />
                {/* Status */}
                <div className="w-24 h-6 bg-[rgba(255,255,255,0.06)] rounded-full animate-pulse" />
                {/* Last login */}
                <div className="w-28 h-4 bg-[rgba(255,255,255,0.06)] rounded animate-pulse hidden lg:block" />
                {/* Actions */}
                <div className="flex gap-1">
                  <div className="w-8 h-8 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
                  <div className="w-8 h-8 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Layout>
  );
}
