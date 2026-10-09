'use client'

import { useState, useEffect } from 'react'
import { GlassCard } from './GlassCard'
import { cn } from '@/lib/cn'
import { colors } from '@/lib/design-tokens'

interface StatCardProps {
  title: string
  value: number
  previousValue?: number
  prefix?: string
  suffix?: string
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  sparklineData?: number[]
  description?: string
  loading?: boolean
  className?: string
}

export function StatCard({
  title,
  value,
  previousValue,
  prefix = '',
  suffix = '',
  icon,
  variant = 'default',
  sparklineData = [],
  description,
  loading = false,
  className
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Calculate percentage change
  const percentageChange = previousValue !== undefined 
    ? ((value - previousValue) / previousValue) * 100 
    : null

  // Animate count-up effect
  useEffect(() => {
    if (loading) return

    setIsAnimating(true)
    const startTime = Date.now()
    const duration = 1500 // 1.5 seconds
    const startValue = displayValue

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
      const easedProgress = easeOutCubic(progress)
      
      const currentValue = Math.floor(startValue + (value - startValue) * easedProgress)
      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animate)
  }, [value, loading])

  // Variant configurations
  const variantConfig = {
    default: {
      color: colors.textPrimary,
      iconBg: colors.glass,
      iconColor: colors.auroraTeal,
      sparklineColor: colors.auroraTeal
    },
    success: {
      color: colors.statusSuccess,
      iconBg: `${colors.statusSuccess}20`,
      iconColor: colors.statusSuccess,
      sparklineColor: colors.statusSuccess
    },
    warning: {
      color: colors.statusWarning,
      iconBg: `${colors.statusWarning}20`,
      iconColor: colors.statusWarning,
      sparklineColor: colors.statusWarning
    },
    danger: {
      color: colors.statusDanger,
      iconBg: `${colors.statusDanger}20`,
      iconColor: colors.statusDanger,
      sparklineColor: colors.statusDanger
    },
    info: {
      color: colors.statusInfo,
      iconBg: `${colors.statusInfo}20`,
      iconColor: colors.statusInfo,
      sparklineColor: colors.statusInfo
    }
  }

  const config = variantConfig[variant]

  // Generate sparkline SVG path
  const generateSparklinePath = (data: number[]) => {
    if (data.length < 2) return ''

    const width = 100
    const height = 32
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    }).join(' ')

    return `M${points.replace(/,/g, ' ').replace(/ /g, ' L').slice(2)}`
  }

  return (
    <GlassCard 
      variant={variant === 'default' ? 'default' : 'elevated'} 
      className={cn('h-full', className)}
      hoverable
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-700 mb-1">
            {title}
          </h3>
          
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-[#3a4254] rounded w-24 mb-2" />
              <div className="h-4 bg-[#3a4254] rounded w-16" />
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-gray-600">{prefix}</span>
                <span 
                  className={cn(
                    "text-2xl font-bold transition-all duration-300",
                    isAnimating && "scale-105"
                  )}
                  style={{ color: config.color }}
                >
                  {displayValue.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600">{suffix}</span>
              </div>

              {/* Percentage Change */}
              {percentageChange !== null && (
                <div className="flex items-center gap-1">
                  <svg 
                    className={cn(
                      "w-3 h-3 transition-transform duration-300",
                      percentageChange >= 0 ? "text-green-400" : "text-red-400 rotate-180"
                    )}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className={cn(
                    "text-xs font-medium",
                    percentageChange >= 0 ? "text-green-400" : "text-red-400"
                  )}>
                    {Math.abs(percentageChange).toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-600">
                    vs last period
                  </span>
                </div>
              )}

              {/* Description */}
              {description && (
                <p className="text-xs text-gray-600 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ 
              backgroundColor: config.iconBg,
              color: config.iconColor 
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Sparkline */}
      {sparklineData.length > 0 && !loading && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Trend</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.sparklineColor }} />
              <span className="text-xs text-gray-700">Last 7 days</span>
            </div>
          </div>
          
          <div className="relative h-8 w-full">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 100 32" 
              className="overflow-visible"
            >
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={config.sparklineColor} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={config.sparklineColor} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Gradient fill area */}
              <path
                d={`${generateSparklinePath(sparklineData)} L100,32 L0,32 Z`}
                fill={`url(#gradient-${title})`}
                className="animate-fadeIn"
                style={{ animationDelay: '0.5s' }}
              />
              
              {/* Line */}
              <path
                d={generateSparklinePath(sparklineData)}
                fill="none"
                stroke={config.sparklineColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-draw-line"
                style={{ 
                  strokeDasharray: '200',
                  strokeDashoffset: '200',
                  animation: 'draw-line 1s ease-out 0.3s forwards'
                }}
              />
              
              {/* Data points */}
              {sparklineData.map((value, index) => {
                const max = Math.max(...sparklineData)
                const min = Math.min(...sparklineData)
                const range = max - min || 1
                const x = (index / (sparklineData.length - 1)) * 100
                const y = 32 - ((value - min) / range) * 32
                
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="1.5"
                    fill={config.sparklineColor}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  />
                )
              })}
            </svg>
          </div>
        </div>
      )}

      {/* Custom animations */}
      <style jsx>{`
        @keyframes draw-line {
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-draw-line {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </GlassCard>
  )
}

export default StatCard

