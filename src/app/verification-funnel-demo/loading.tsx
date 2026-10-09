import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';

/**
 * Verification form loading state
 * 
 * Shows:
 * - Form header skeleton
 * - 4 field placeholder skeletons
 * - Action button skeleton
 */
export default function VerificationLoading() {
  return (
    <Layout>
      <Container maxWidth="lg" className="py-8">
        <div className="space-y-6">
          {/* Page header skeleton */}
          <div className="space-y-3">
            <div className="h-9 w-80 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
            <div className="h-5 w-full max-w-2xl bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
          </div>

          {/* Form card skeleton */}
          <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-lg p-6 md:p-8">
            <div className="space-y-6">
              {/* Form fields */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-32 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                  <div className="h-11 w-full bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
                </div>
              ))}

              {/* Additional info section */}
              <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] space-y-3">
                <div className="h-5 w-40 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-24 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                      <div className="h-11 w-full bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons skeleton */}
              <div className="flex gap-3 justify-end pt-4">
                <div className="h-11 w-24 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
                <div className="h-11 w-32 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
              </div>
            </div>
          </div>

          {/* Help card skeleton */}
          <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                <div className="h-4 w-full bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
