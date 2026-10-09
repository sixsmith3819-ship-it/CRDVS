'use client'

import { GlassCard } from './GlassCard'
import { cn } from '@/lib/cn'
import { colors } from '@/lib/design-tokens'

interface DashboardSkeletonsProps {
  showMetrics?: boolean
  showQuickActions?: boolean
  showNotifications?: boolean
  className?: string
}

export function DashboardSkeletons({ 
  showMetrics = true,
  showQuickActions = true, 
  showNotifications = true,
  className 
}: DashboardSkeletonsProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Greeting Skeleton */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-[#3a4254] rounded-lg w-64 mb-2 animate-shimmer" />
            <div className="flex items-center gap-4">
              <div className="h-5 bg-[#3a4254] rounded w-48 animate-shimmer" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#3a4254] rounded-full animate-shimmer" />
                <div className="h-4 bg-[#3a4254] rounded w-24 animate-shimmer" />
              </div>
            </div>
          </div>
          
          {/* User Info Skeleton */}
          <GlassCard variant="subtle" padding="sm">
            <div className="flex items-center gap-3">
              <div>
                <div className="h-4 bg-[#3a4254] rounded w-24 mb-1 animate-shimmer" />
                <div className="h-3 bg-[#3a4254] rounded w-20 mb-1 animate-shimmer" />
                <div className="h-3 bg-[#3a4254] rounded w-16 animate-shimmer" />
              </div>
              <div className="w-10 h-10 bg-[#3a4254] rounded-full animate-shimmer" />
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Metrics Skeleton */}
      {showMetrics && (
        <div>
          <div className="h-6 bg-[#3a4254] rounded w-32 mb-6 animate-shimmer" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <GlassCard key={`metric-${i}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="h-4 bg-[#3a4254] rounded w-32 mb-2 animate-shimmer" />
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        <div className="h-8 bg-[#3a4254] rounded w-20 animate-shimmer" />
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[#3a4254] rounded animate-shimmer" />
                        <div className="h-3 bg-[#3a4254] rounded w-16 animate-shimmer" />
                        <div className="h-3 bg-[#3a4254] rounded w-20 animate-shimmer" />
                      </div>
                      <div className="h-3 bg-[#3a4254] rounded w-40 animate-shimmer" />
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-[#3a4254] rounded-lg animate-shimmer" />
                </div>
                
                {/* Sparkline Skeleton */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-3 bg-[#3a4254] rounded w-12 animate-shimmer" />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#3a4254] rounded-full animate-shimmer" />
                      <div className="h-3 bg-[#3a4254] rounded w-16 animate-shimmer" />
                    </div>
                  </div>
                  <div className="h-8 bg-[#3a4254] rounded animate-shimmer" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions Skeleton */}
      {showQuickActions && (
        <div>
          <div className="h-6 bg-[#3a4254] rounded w-32 mb-6 animate-shimmer" />
          <GlassCard>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={`action-${i}`}
                  className="p-6 rounded-xl border"
                  style={{
                    backgroundColor: colors.glass,
                    backdropFilter: 'blur(16px)',
                    borderColor: colors.glassBorder
                  }}
                >
                  <div className="w-12 h-12 bg-[#3a4254] rounded-lg mb-4 animate-shimmer" />
                  <div className="space-y-2">
                    <div className="h-5 bg-[#3a4254] rounded w-24 animate-shimmer" />
                    <div className="h-4 bg-[#3a4254] rounded w-full animate-shimmer" />
                    <div className="h-4 bg-[#3a4254] rounded w-3/4 animate-shimmer" />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="mt-6 pt-4 border-t" style={{ borderColor: colors.glassBorder }}>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-[#3a4254] rounded w-48 animate-shimmer" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#3a4254] rounded-full animate-shimmer" />
                  <div className="h-3 bg-[#3a4254] rounded w-32 animate-shimmer" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Notifications Skeleton */}
      {showNotifications && (
        <div>
          <div className="h-6 bg-[#3a4254] rounded w-32 mb-6 animate-shimmer" />
          <GlassCard>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-6 bg-[#3a4254] rounded w-32 animate-shimmer" />
                <div className="w-6 h-6 bg-[#3a4254] rounded-full animate-shimmer" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 bg-[#3a4254] rounded-full w-24 animate-shimmer" />
                <div className="h-4 bg-[#3a4254] rounded w-20 animate-shimmer" />
              </div>
            </div>

            {/* Notification Items */}
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={`notification-${i}`}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: colors.glass,
                    borderColor: colors.glassBorder
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#3a4254] rounded-lg animate-shimmer" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="h-4 bg-[#3a4254] rounded w-48 animate-shimmer" />
                        <div className="w-2 h-2 bg-[#3a4254] rounded-full animate-shimmer" />
                      </div>
                      <div className="h-3 bg-[#3a4254] rounded w-full mb-1 animate-shimmer" />
                      <div className="h-3 bg-[#3a4254] rounded w-3/4 mb-2 animate-shimmer" />
                      <div className="flex items-center justify-between">
                        <div className="h-3 bg-[#3a4254] rounded w-16 animate-shimmer" />
                        <div className="h-3 bg-[#3a4254] rounded w-20 animate-shimmer" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: colors.glassBorder }}>
              <div className="h-4 bg-[#3a4254] rounded w-24 mx-auto animate-shimmer" />
            </div>
          </GlassCard>
        </div>
      )}

      {/* System Information Skeleton */}
      <GlassCard variant="subtle">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 bg-[#3a4254] rounded w-32 mb-1 animate-shimmer" />
            <div className="h-3 bg-[#3a4254] rounded w-64 animate-shimmer" />
          </div>
          <div className="w-8 h-8 bg-[#3a4254] rounded-lg animate-shimmer" />
        </div>
      </GlassCard>
    </div>
  )
}

export default DashboardSkeletons
