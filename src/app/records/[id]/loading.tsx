import { Layout } from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Record detail page loading state
 * 
 * Shows:
 * - Header skeleton with photo placeholder
 * - Tab navigation skeleton
 * - Content area skeleton
 */
export default function RecordDetailLoading() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#0a0e27]">
        {/* Record Header skeleton */}
        <div className="bg-[rgba(255,255,255,0.04)] border-b border-[rgba(255,255,255,0.08)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Photo placeholder */}
              <div className="shrink-0">
                <div className="w-32 h-32 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
              </div>

              {/* Info section skeleton */}
              <div className="flex-1 space-y-4">
                <div className="space-y-3">
                  <div className="h-8 w-72 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                  <div className="h-5 w-48 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-6 w-24 bg-[rgba(255,255,255,0.06)] rounded-full animate-pulse"
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-20 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                      <div className="h-5 w-32 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons skeleton */}
              <div className="flex lg:flex-col gap-2">
                <div className="h-10 w-32 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
                <div className="h-10 w-32 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab navigation skeleton */}
        <div className="bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.06)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-32 bg-[rgba(255,255,255,0.06)] rounded-t animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content area skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Section header */}
            <div className="h-7 w-40 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />

            {/* Content cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-lg p-6 space-y-4"
                >
                  <div className="h-5 w-32 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                    <div className="h-4 w-4/6 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
