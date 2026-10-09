'use client';

import React, { useState, useEffect } from 'react';
import { Star, AlertTriangle, Shield } from 'lucide-react';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RiskLevel = 1 | 2 | 3 | 4 | 5;

export interface RiskLevelProps {
  /** Risk level from 1 (Very Low) to 5 (Very High) */
  level: RiskLevel;
  /** Optional size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show animated entrance on mount */
  animated?: boolean;
  /** Show interactive hover effects */
  interactive?: boolean;
  /** Show tooltip on hover */
  showTooltip?: boolean;
  /** Custom tooltip content */
  tooltipContent?: string;
  /** Additional className for container */
  className?: string;
  /** Callback when clicked (if interactive) */
  onClick?: () => void;
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const RISK_CONFIG = {
  1: {
    label: 'Very Low Risk',
    color: 'text-[#10b981]', // Success green
    bgColor: 'bg-[#10b981]',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    description: 'Minimal security concerns. Low probability of reoffense.',
    icon: Shield,
  },
  2: {
    label: 'Low Risk', 
    color: 'text-[#84cc16]', // Yellow-green
    bgColor: 'bg-[#84cc16]',
    glowColor: 'rgba(132, 204, 22, 0.4)',
    description: 'Minor security considerations. Generally stable profile.',
    icon: Shield,
  },
  3: {
    label: 'Medium Risk',
    color: 'text-[#f59e0b]', // Warning amber
    bgColor: 'bg-[#f59e0b]',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    description: 'Moderate security concerns. Requires standard monitoring.',
    icon: AlertTriangle,
  },
  4: {
    label: 'High Risk',
    color: 'text-[#f97316]', // Orange
    bgColor: 'bg-[#f97316]',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    description: 'Significant security concerns. Enhanced monitoring required.',
    icon: AlertTriangle,
  },
  5: {
    label: 'Very High Risk',
    color: 'text-[#dc2626]', // Danger red
    bgColor: 'bg-[#dc2626]',
    glowColor: 'rgba(220, 38, 38, 0.4)',
    description: 'Critical security risk. Maximum security protocols required.',
    icon: AlertTriangle,
  },
} as const;

const SIZE_CONFIG = {
  sm: {
    starSize: 'h-4 w-4',
    container: 'gap-1',
    label: 'text-xs',
    tooltip: 'text-xs',
  },
  md: {
    starSize: 'h-5 w-5',
    container: 'gap-1.5',
    label: 'text-sm',
    tooltip: 'text-sm',
  },
  lg: {
    starSize: 'h-6 w-6',
    container: 'gap-2',
    label: 'text-base',
    tooltip: 'text-sm',
  },
} as const;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface StarProps {
  filled: boolean;
  config: typeof RISK_CONFIG[RiskLevel];
  size: keyof typeof SIZE_CONFIG;
  delay: number;
  animated: boolean;
  interactive: boolean;
}

const AnimatedStar: React.FC<StarProps> = ({
  filled,
  config,
  size,
  delay,
  animated,
  interactive,
}) => {
  const [isVisible, setIsVisible] = useState(!animated);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [animated, delay]);

  return (
    <div
      className={cn(
        'relative transition-all duration-300 ease-out',
        animated && !isVisible && 'opacity-0 scale-0',
        animated && isVisible && 'opacity-100 scale-100 animate-scale-in',
        interactive && 'hover:scale-110 cursor-pointer',
      )}
      style={{
        animationDelay: animated ? `${delay}ms` : '0ms',
      }}
    >
      <Star
        className={cn(
          SIZE_CONFIG[size].starSize,
          'transition-all duration-200 ease-out',
          filled ? [
            config.color,
            'fill-current',
            'drop-shadow-sm',
          ] : [
            'text-[#3a4254]', // Elevation color for empty stars
            'fill-none stroke-2',
          ],
        )}
        style={
          filled && interactive
            ? {
                filter: `drop-shadow(0 0 8px ${config.glowColor})`,
              }
            : undefined
        }
      />
      
      {/* Glassmorphism glow effect on hover */}
      {filled && interactive && (
        <div
          className={cn(
            'absolute inset-0 rounded-full opacity-0 transition-opacity duration-300',
            'hover:opacity-100 pointer-events-none',
            config.bgColor,
          )}
          style={{
            background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)`,
            transform: 'scale(1.5)',
          }}
        />
      )}
    </div>
  );
};

interface TooltipProps {
  visible: boolean;
  config: typeof RISK_CONFIG[RiskLevel];
  size: keyof typeof SIZE_CONFIG;
  customContent?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  visible, 
  config, 
  size, 
  customContent 
}) => {
  return (
    <div
      className={cn(
        'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50',
        'transition-all duration-200 ease-out pointer-events-none',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
      )}
    >
      <div className="glass-card px-3 py-2 rounded-lg shadow-lg max-w-xs">
        <div className={cn(
          'flex items-center gap-2 mb-1',
          SIZE_CONFIG[size].tooltip,
        )}>
          <config.icon className="h-4 w-4" />
          <span className="font-medium text-white">{config.label}</span>
        </div>
        <p className={cn(
          'text-[#a0a9c9] leading-relaxed',
          SIZE_CONFIG[size].tooltip,
        )}>
          {customContent || config.description}
        </p>
      </div>
      {/* Arrow */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2">
        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-glass-border" />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

/**
 * RiskLevel - 5-star risk level visualization component
 * 
 * Features:
 * - 5-star rating system with precise color coding
 * - Risk levels: Very Low (green) to Very High (red)
 * - Smooth hover animations and micro-interactions
 * - Glassmorphism effects with Aurora gradient touches
 * - Interactive tooltips explaining each risk level
 * - Proper accessibility support with ARIA labels
 * - Dark spatial design theme consistency
 * 
 * @example
 * <RiskLevel level={3} animated interactive showTooltip />
 */
export const RiskLevel: React.FC<RiskLevelProps> = ({
  level,
  size = 'md',
  animated = true,
  interactive = false,
  showTooltip = false,
  tooltipContent,
  className,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const config = RISK_CONFIG[level];
  const sizeConfig = SIZE_CONFIG[size];

  // Generate array of 5 stars with filled/empty state
  const stars = Array.from({ length: 5 }, (_, index) => ({
    id: index,
    filled: index < level,
    delay: animated ? index * 100 : 0,
  }));

  return (
    <div
      className={cn(
        'relative inline-flex flex-col items-center',
        interactive && 'cursor-pointer',
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={`Risk Level: ${config.label}`}
      aria-description={tooltipContent || config.description}
    >
      {/* Star Display */}
      <div
        className={cn(
          'flex items-center',
          sizeConfig.container,
          interactive && 'focus-ring rounded-lg p-1',
        )}
      >
        {stars.map((star) => (
          <AnimatedStar
            key={star.id}
            filled={star.filled}
            config={config}
            size={size}
            delay={star.delay}
            animated={animated}
            interactive={interactive}
          />
        ))}
      </div>

      {/* Risk Level Label */}
      <div className={cn(
        'mt-1 font-medium transition-colors duration-200',
        config.color,
        sizeConfig.label,
        interactive && isHovered && 'brightness-110',
      )}>
        {config.label}
      </div>

      {/* Aurora Gradient Background on Hover */}
      {interactive && isHovered && (
        <div
          className="absolute inset-0 rounded-lg opacity-10 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${config.glowColor}, transparent)`,
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Tooltip */}
      {showTooltip && (
        <Tooltip
          visible={isHovered}
          config={config}
          size={size}
          customContent={tooltipContent}
        />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Get risk level configuration for external use
 */
export const getRiskConfig = (level: RiskLevel) => RISK_CONFIG[level];

/**
 * Calculate risk level based on numeric score (0-100)
 */
export const calculateRiskLevel = (score: number): RiskLevel => {
  if (score >= 80) return 5;
  if (score >= 60) return 4;
  if (score >= 40) return 3;
  if (score >= 20) return 2;
  return 1;
};

export default RiskLevel;