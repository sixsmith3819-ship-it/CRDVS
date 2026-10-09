'use client'

import React, { useState, useMemo } from 'react'
import { cn } from '@/lib/cn'
import { GlassCard } from '@/components/dashboard/GlassCard'
import { colors, animations } from '@/lib/design-tokens'

// Types
export interface FunnelStage {
  id: string
  label: string
  count: number
  description?: string
}

interface VerificationFunnelProps {
  stages?: FunnelStage[]
  loading?: boolean
  className?: string
  animated?: boolean
  onStageHover?: (stageId: string | null) => void
  showPercentages?: boolean
}

// Sample data for demonstration
const DEFAULT_STAGES: FunnelStage[] = [
  {
    id: 'submitted',
    label: 'Records Submitted',
    count: 5847,
    description: 'Total records submitted for verification'
  },
  {
    id: 'verified',
    label: 'Records Verified',
    count: 4923,
    description: 'Successfully verified records'
  },
  {
    id: 'matched',
    label: 'Matched',
    count: 3456,
    description: 'Records with confidence matches'
  },
  {
    id: 'flagged',
    label: 'Flagged',
    count: 1467,
    description: 'Records with issues detected'
  },
  {
    id: 'resolved',
    label: 'Resolved',
    count: 892,
    description: 'Issues successfully resolved'
  }
]

interface StageColors {
  background: string
  border: string
  glow: string
  text: string
}

/**
 * VerificationFunnel
 * 
 * Sophisticated funnel chart visualization featuring:
 * - Horizontal funnel bars with decreasing width
 * - Color-coded stages (green to red for drop-off)
 * - Stage labels and percentages
 * - Glassmorphism styling with Aurora accents
 * - Dark spatial theme
 * - Smooth animations as stages appear
 * - Hover tooltips showing detailed metrics
 * - Responsive design
 * - Full accessibility labels
 * - Real-time drop-off indicators
 */
export function VerificationFunnel({
  stages = DEFAULT_STAGES,
  loading = false,
  className,
  animated = true,
  onStageHover,
  showPercentages = true
}: VerificationFunnelProps) {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  // Calculate stage widths and percentages
  const stageData = useMemo(() => {
    if (stages.length === 0) return []

    const maxCount = stages[0].count
    return stages.map((stage, index) => {
      const percentage = (stage.count / maxCount) * 100
      const dropOff = index === 0 ? 0 : ((stages[index - 1].count - stage.count) / stages[index - 1].count) * 100
      
      return {
        ...stage,
        percentage,
        dropOff,
        widthPercent: percentage
      }
    })
  }, [stages])

  // Get color scheme for each stage based on position
  const getStageColors = (index: number): StageColors => {
    const colors_array = [
      // Green (Submitted) - baseline
      {
        background: 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.4)',
        glow: '0 0 20px rgba(16, 185, 129, 0.3)',
        text: '#10b981'
      },
      // Teal (Verified) - good
      {
        background: 'rgba(20, 184, 166, 0.15)',
        border: 'rgba(20, 184, 166, 0.4)',
        glow: '0 0 20px rgba(20, 184, 166, 0.3)',
        text: '#14b8a6'
      },
      // Blue (Matched) - neutral
      {
        background: 'rgba(59, 130, 246, 0.15)',
        border: 'rgba(59, 130, 246, 0.4)',
        glow: '0 0 20px rgba(59, 130, 246, 0.3)',
        text: '#3b82f6'
      },
      // Amber (Flagged) - warning
      {
        background: 'rgba(245, 158, 11, 0.15)',
        border: 'rgba(245, 158, 11, 0.4)',
        glow: '0 0 20px rgba(245, 158, 11, 0.3)',
        text: '#f59e0b'
      },
      // Red (Resolved) - resolved/complete
      {
        background: 'rgba(239, 68, 68, 0.15)',
        border: 'rgba(239, 68, 68, 0.4)',
        glow: '0 0 20px rgba(239, 68, 68, 0.3)',
        text: '#ef4444'
      }
    ]

    return colors_array[Math.min(index, colors_array.length - 1)]
  }

  const handleStageHover = (stageId: string | null, e?: React.MouseEvent<HTMLDivElement>) => {
    setHoveredStage(stageId)
    onStageHover?.(stageId)
    
    if (e && stageId) {
      const rect = e.currentTarget.getBoundingClientRect()
      setTooltipPos({
        x: rect.left,
        y: rect.top
      })
    }
  }

  if (loading) {
    return (
      <GlassCard variant="elevated" padding="lg" className={className}>
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-6 bg-gradient-to-r from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0.05)] rounded-lg animate-pulse" style={{ width: `${100 - i * 15}%` }} />
              <div className="h-4 bg-[rgba(255,255,255,0.08)] rounded w-24 animate-pulse" />
            </div>
          ))}
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard variant="elevated" padding="lg" className={className}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Verification Funnel</h3>
          <p className="text-sm text-[#a0a9c9]">Verification process flow showing completion stages and drop-off rates</p>
        </div>

        {/* Funnel Container */}
        <div className="space-y-4">
          {stageData.map((stage, index) => {
            const colors_scheme = getStageColors(index)
            const isHovered = hoveredStage === stage.id
            const animationDelay = animated ? index * 100 : 0

            return (
              <div
                key={stage.id}
                className="space-y-1"
              >
                {/* Stage Bar */}
                <div
                  className={cn(
                    'group relative rounded-lg overflow-hidden transition-all duration-300 ease-out',
                    'cursor-pointer',
                    'hover:shadow-lg',
                    isHovered && 'shadow-lg',
                    animated && 'animate-in fade-in slide-in-from-left'
                  )}
                  style={{
                    animationDelay: `${animationDelay}ms`,
                    animationDuration: '600ms'
                  }}
                  onMouseEnter={(e) => handleStageHover(stage.id, e)}
                  onMouseLeave={() => handleStageHover(null)}
                  role="progressbar"
                  aria-valuenow={stage.count}
                  aria-valuemin={0}
                  aria-valuemax={stageData[0]?.count || 0}
                  aria-label={`${stage.label}: ${stage.count.toLocaleString()} records (${stage.percentage.toFixed(1)}%)`}
                  tabIndex={0}
                >
                  {/* Gradient Background */}
                  <div
                    className={cn(
                      'relative h-12 rounded-lg transition-all duration-300 ease-out',
                      'border backdrop-blur-sm',
                      isHovered && 'scale-y-110 origin-left'
                    )}
                    style={{
                      width: `${stage.widthPercent}%`,
                      backgroundColor: colors_scheme.background,
                      borderColor: colors_scheme.border,
                      boxShadow: isHovered ? colors_scheme.glow : 'none'
                    }}
                  >
                    {/* Animated Gradient Overlay */}
                    <div
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${colors_scheme.text}15, transparent)`,
                        animation: isHovered ? `shimmer 2s infinite` : 'none'
                      }}
                    />

                    {/* Content */}
                    <div className="relative z-10 h-full flex items-center justify-between px-4">
                      {/* Left: Label and Count */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white truncate">
                          {stage.label}
                        </div>
                        <div className="text-xs text-[#a0a9c9] truncate">
                          {stage.count.toLocaleString()} records
                        </div>
                      </div>

                      {/* Right: Percentage and Drop-off */}
                      <div className="flex items-center gap-4 ml-4">
                        {showPercentages && (
                          <div className="text-right">
                            <div className="text-sm font-bold" style={{ color: colors_scheme.text }}>
                              {stage.percentage.toFixed(1)}%
                            </div>
                            {stage.dropOff > 0 && (
                              <div className="text-xs text-[#f59e0b] font-medium">
                                -{stage.dropOff.toFixed(1)}%
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shine Effect */}
                    <div
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden"
                      style={{
                        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)`,
                      }}
                    />
                  </div>

                  {/* Tooltip - Hidden by default, shown on hover */}
                  {isHovered && (
                    <div
                      className={cn(
                        'absolute bottom-full left-1/2 mb-3 -translate-x-1/2',
                        'z-50 pointer-events-none'
                      )}
                    >
                      <div
                        className="px-4 py-3 rounded-lg text-sm whitespace-nowrap"
                        style={{
                          backgroundColor: colors_scheme.background,
                          borderColor: colors_scheme.border,
                          border: `1px solid ${colors_scheme.border}`,
                          boxShadow: colors_scheme.glow
                        }}
                      >
                        <div className="font-semibold text-white">
                          {stage.label}
                        </div>
                        <div className="text-xs text-[#a0a9c9] mt-1">
                          {stage.count.toLocaleString()} records processed
                        </div>
                        {stage.description && (
                          <div className="text-xs text-[#6b7280] mt-1">
                            {stage.description}
                          </div>
                        )}
                        {stage.dropOff > 0 && (
                          <div className="text-xs text-[#f59e0b] mt-1 font-medium">
                            Drop-off: -{stage.dropOff.toFixed(1)}% ({(stageData[index - 1]?.count - stage.count).toLocaleString()} records)
                          </div>
                        )}

                        {/* Tooltip Arrow */}
                        <div
                          className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 -mt-1"
                          style={{
                            backgroundColor: colors_scheme.background,
                            borderRight: `1px solid ${colors_scheme.border}`,
                            borderBottom: `1px solid ${colors_scheme.border}`,
                            transform: 'translateX(-50%) rotate(45deg)'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Stage Label with Metrics */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs text-[#6b7280] uppercase tracking-wide font-medium">
                    Stage {index + 1} of {stageData.length}
                  </span>
                  {index > 0 && (
                    <span className="text-xs text-[#f59e0b] font-semibold">
                      Drop-off: {stage.dropOff.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary Statistics */}
        <div className="pt-4 border-t border-[rgba(255,255,255,0.1)] space-y-3">
          <div className="grid grid-cols-2 gap-4">
            {/* Conversion Rate */}
            <div className="p-3 rounded-lg bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)]">
              <div className="text-xs text-[#a0a9c9] mb-1">Overall Conversion</div>
              <div className="text-xl font-bold text-[#10b981]">
                {stageData.length > 0 
                  ? ((stageData[stageData.length - 1].count / stageData[0].count) * 100).toFixed(1) 
                  : 0}%
              </div>
              <div className="text-xs text-[#6b7280] mt-1">
                {stageData[stageData.length - 1]?.count.toLocaleString() || 0} / {stageData[0]?.count.toLocaleString() || 0} records
              </div>
            </div>

            {/* Total Drop-off */}
            <div className="p-3 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)]">
              <div className="text-xs text-[#a0a9c9] mb-1">Total Drop-off</div>
              <div className="text-xl font-bold text-[#f59e0b]">
                {stageData.length > 0 
                  ? (100 - ((stageData[stageData.length - 1].count / stageData[0].count) * 100)).toFixed(1) 
                  : 0}%
              </div>
              <div className="text-xs text-[#6b7280] mt-1">
                {stageData.length > 0 
                  ? (stageData[0].count - stageData[stageData.length - 1].count).toLocaleString() 
                  : 0} records lost
              </div>
            </div>
          </div>

          {/* Highest Drop-off Stage */}
          {stageData.length > 1 && (
            <div className="p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]">
              <div className="text-xs text-[#a0a9c9] mb-1">Highest Drop-off Stage</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">
                    {stageData.filter((s, i) => i > 0).reduce((max, s, i) => 
                      s.dropOff > stageData[Math.max(0, i)].dropOff ? s : max
                    ).label}
                  </div>
                  <div className="text-xs text-[#6b7280]">
                    {Math.max(...stageData.filter((_, i) => i > 0).map(s => s.dropOff)).toFixed(1)}% drop-off
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </GlassCard>
  )
}

export default VerificationFunnel
