'use client'

import { useRouter } from 'next/navigation'
import { GlassCard } from './GlassCard'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { colors } from '@/lib/design-tokens'
import type { UserRole } from '@/types'

interface QuickAction {
  label: string
  href: string
  icon: JSX.Element
  description: string
  variant: 'primary' | 'success' | 'info' | 'warning'
  roles: UserRole[]
  disabled?: boolean
}

const quickActions: QuickAction[] = [
  {
    label: 'New Verification',
    href: '/dashboard/verify',
    description: 'Search and verify a person\'s criminal record',
    variant: 'primary',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    roles: ['administrator', 'police_officer', 'court_officer', 'prison_officer'],
  },
  {
    label: 'Search Records',
    href: '/dashboard/records',
    description: 'Browse and search criminal record database',
    variant: 'info',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    roles: ['administrator', 'police_officer', 'court_officer', 'prison_officer'],
  },
  {
    label: 'Create Report',
    href: '/dashboard/reports',
    description: 'Generate an official verification report',
    variant: 'success',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    roles: ['administrator', 'police_officer', 'court_officer', 'prison_officer'],
  },
  {
    label: 'Review Duplicates',
    href: '/dashboard/duplicates',
    description: 'Review and manage duplicate record flags',
    variant: 'warning',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>
    ),
    roles: ['administrator', 'police_officer'],
  }
]

interface QuickActionsProps {
  userRole?: UserRole
  className?: string
}

export function QuickActions({ userRole = 'administrator', className }: QuickActionsProps) {
  const router = useRouter()

  // Filter actions based on user role
  const availableActions = quickActions.filter(action => 
    action.roles.includes(userRole)
  )

  const handleActionClick = (href: string, disabled?: boolean) => {
    if (disabled) return
    router.push(href)
  }

  return (
    <GlassCard variant="default" className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {availableActions.map((action) => {
          const isDisabled = action.disabled || false
          
          return (
            <div
              key={action.label}
              className={cn(
                "group relative p-6 rounded-xl border transition-all duration-300 cursor-pointer",
                "hover:scale-[1.02] hover:shadow-xl",
                isDisabled && "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none"
              )}
              style={{
                backgroundColor: isDisabled ? colors.surface : colors.glass,
                backdropFilter: 'blur(16px)',
                borderColor: colors.glassBorder
              }}
              onClick={() => handleActionClick(action.href, isDisabled)}
              role="button"
              tabIndex={isDisabled ? -1 : 0}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
                  e.preventDefault()
                  handleActionClick(action.href, isDisabled)
                }
              }}
            >
              {/* Aurora Glow Effect */}
              <div 
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-xl pointer-events-none",
                  !isDisabled && "group-hover:opacity-30"
                )}
                style={{
                  background: action.variant === 'primary' 
                    ? `linear-gradient(135deg, ${colors.auroraTeal}20, transparent 50%, ${colors.auroraPurple}15)`
                    : action.variant === 'success'
                    ? `linear-gradient(135deg, ${colors.statusSuccess}20, transparent 50%, ${colors.auroraTeal}15)`
                    : action.variant === 'info'
                    ? `linear-gradient(135deg, ${colors.statusInfo}20, transparent 50%, ${colors.auroraPurple}15)`
                    : `linear-gradient(135deg, ${colors.statusWarning}20, transparent 50%, ${colors.statusDanger}15)`
                }}
              />

              {/* Icon Container */}
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center mb-4 relative z-10 transition-all duration-300",
                !isDisabled && "group-hover:scale-110"
              )}
              style={{
                backgroundColor: action.variant === 'primary' 
                  ? `${colors.auroraTeal}20`
                  : action.variant === 'success'
                  ? `${colors.statusSuccess}20`
                  : action.variant === 'info'
                  ? `${colors.statusInfo}20`
                  : `${colors.statusWarning}20`,
                color: action.variant === 'primary' 
                  ? colors.auroraTeal
                  : action.variant === 'success'
                  ? colors.statusSuccess
                  : action.variant === 'info'
                  ? colors.statusInfo
                  : colors.statusWarning
              }}>
                {action.icon}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className={cn(
                  "font-semibold text-gray-900 mb-2 transition-colors duration-300",
                  !isDisabled && "group-hover:text-gray-900"
                )}>
                  {action.label}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {action.description}
                </p>
              </div>

              {/* Disabled Overlay */}
              {isDisabled && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30 backdrop-blur-sm">
                  <div className="text-center">
                    <svg className="w-6 h-6 text-gray-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs text-gray-600 font-medium">Coming Soon</span>
                  </div>
                </div>
              )}

              {/* Shine Effect */}
              {!isDisabled && (
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                  <div 
                    className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                      transform: 'skewX(-15deg)'
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Role-based Footer Message */}
      <div className="mt-6 pt-4 border-t" style={{ borderColor: colors.glassBorder }}>
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-600">
            Available actions for: <span className="text-gray-700 capitalize font-medium">
              {userRole.replace('_', ' ')}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-gray-600 text-xs">All systems operational</span>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

export default QuickActions

