'use client'

import React from 'react'
import { cn } from '@/lib/cn'
import { colors } from '@/lib/design-tokens'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'subtle' | 'aurora'
  hoverable?: boolean
  onClick?: () => void
  padding?: 'none' | 'sm' | 'md' | 'lg'
  header?: React.ReactNode
  footer?: React.ReactNode
}

export function GlassCard({ 
  children, 
  className, 
  variant = 'default',
  hoverable = false,
  onClick,
  padding = 'md',
  header,
  footer
}: GlassCardProps) {
  const isClickable = hoverable || onClick

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const variantStyles = {
    default: {
      backgroundColor: '#ffffff',
      backdropFilter: 'none',
      borderColor: '#e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    elevated: {
      backgroundColor: '#f9fafb',
      backdropFilter: 'none',
      borderColor: '#d1d5db',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    },
    subtle: {
      backgroundColor: '#f3f4f6',
      backdropFilter: 'none',
      borderColor: '#d1d5db',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    },
    aurora: {
      backgroundColor: '#ffffff',
      backdropFilter: 'none',
      borderColor: '#d1d5db',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }
  }

  return (
    <div
      className={cn(
        'relative rounded-xl border overflow-hidden transition-all duration-300 ease-out',
        isClickable && [
          'cursor-pointer',
          'hover:scale-[1.02]',
          'hover:shadow-xl',
          'active:scale-[0.98]',
          'hover:border-opacity-50'
        ],
        variant === 'aurora' && 'hover:shadow-teal-500/20',
        className
      )}
      style={variantStyles[variant]}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      {/* Aurora Gradient Overlay for aurora variant */}
      {variant === 'aurora' && (
        <div 
          className="absolute inset-0 opacity-30 rounded-xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(20,184,166,0.1), transparent 50%, rgba(124,58,237,0.1))'
          }}
        />
      )}

      {/* Shine Effect on Hover */}
      {isClickable && (
        <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
          <div 
            className="absolute inset-0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000 ease-out"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
              transform: 'skewX(-15deg)'
            }}
          />
        </div>
      )}

      {/* Header */}
      {header && (
        <div className={cn(
          'border-b relative z-10',
          paddingClasses[padding],
          padding !== 'none' && 'pb-4 mb-4'
        )} style={{ borderColor: '#e5e7eb' }}>
          {header}
        </div>
      )}

      {/* Content */}
      <div className={cn(
        'relative z-10',
        !header && !footer && paddingClasses[padding],
        header && !footer && padding !== 'none' && `px-${padding === 'sm' ? '4' : padding === 'lg' ? '8' : '6'} pb-${padding === 'sm' ? '4' : padding === 'lg' ? '8' : '6'}`,
        !header && footer && padding !== 'none' && `px-${padding === 'sm' ? '4' : padding === 'lg' ? '8' : '6'} pt-${padding === 'sm' ? '4' : padding === 'lg' ? '8' : '6'}`,
        header && footer && padding !== 'none' && `px-${padding === 'sm' ? '4' : padding === 'lg' ? '8' : '6'}`
      )}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className={cn(
          'border-t relative z-10',
          paddingClasses[padding],
          padding !== 'none' && 'pt-4 mt-4'
        )} style={{ borderColor: '#e5e7eb' }}>
          {footer}
        </div>
      )}

      {/* Focus Ring */}
      {onClick && (
        <div className="absolute inset-0 rounded-xl ring-2 ring-transparent focus-within:ring-teal-500 focus-within:ring-opacity-50 pointer-events-none" />
      )}
    </div>
  )
}

export default GlassCard

