'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, ChevronUp, Scale, AlertTriangle, FileText, User } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ConvictionSeverity = 'low' | 'moderate' | 'high' | 'critical';

export interface Conviction {
  id: string;
  date: string;
  charge: string;
  outcome: 'guilty' | 'not-guilty' | 'dismissed' | 'plea-bargain' | 'pending';
  sentence?: string;
  description?: string;
  courtName?: string;
  caseNumber?: string;
  severity: ConvictionSeverity;
  appealStatus?: 'none' | 'pending' | 'upheld' | 'overturned';
  fineAmount?: number;
  probationPeriod?: string;
  details?: string;
}

export interface ConvictionTimelineProps {
  convictions: Conviction[];
  className?: string;
  animated?: boolean;
}

// ---------------------------------------------------------------------------
// Severity Configuration
// ---------------------------------------------------------------------------

const severityConfig: Record<ConvictionSeverity, {
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  icon: React.ElementType;
  label: string;
}> = {
  low: {
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    glowColor: 'rgba(16, 185, 129, 0.2)',
    icon: FileText,
    label: 'Low Risk',
  },
  moderate: {
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    glowColor: 'rgba(245, 158, 11, 0.2)',
    icon: Scale,
    label: 'Moderate Risk',
  },
  high: {
    color: '#dc2626',
    bgColor: 'rgba(220, 38, 38, 0.1)',
    borderColor: 'rgba(220, 38, 38, 0.3)',
    glowColor: 'rgba(220, 38, 38, 0.2)',
    icon: AlertTriangle,
    label: 'High Risk',
  },
  critical: {
    color: '#7c3aed',
    bgColor: 'rgba(124, 58, 237, 0.1)',
    borderColor: 'rgba(124, 58, 237, 0.3)',
    glowColor: 'rgba(124, 58, 237, 0.2)',
    icon: AlertTriangle,
    label: 'Critical Risk',
  },
};

const outcomeConfig: Record<Conviction['outcome'], {
  variant: 'success' | 'warning' | 'danger' | 'default';
  label: string;
}> = {
  'guilty': { variant: 'danger', label: 'Guilty' },
  'not-guilty': { variant: 'success', label: 'Not Guilty' },
  'dismissed': { variant: 'default', label: 'Dismissed' },
  'plea-bargain': { variant: 'warning', label: 'Plea Bargain' },
  'pending': { variant: 'warning', label: 'Pending' },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface TimelineItemProps {
  conviction: Conviction;
  index: number;
  isLast: boolean;
  animated: boolean;
}

function TimelineItem({ conviction, index, isLast, animated }: TimelineItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(!animated);
  const [hasAnimated, setHasAnimated] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const severityInfo = severityConfig[conviction.severity];
  const outcomeInfo = outcomeConfig[conviction.outcome];
  const SeverityIcon = severityInfo.icon;

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    if (!animated || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          // Staggered animation delay: 50-100ms between items
          // Using index * 75ms as middle ground
          const delay = index * 75;
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '75px',
      }
    );

    const currentRef = itemRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [animated, index, isVisible]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      ref={itemRef}
      className={cn(
        'relative flex gap-6 pb-8',
        animated && !isVisible && 'opacity-0 transform translate-x-[-20px]',
        animated && isVisible && 'opacity-100 transform translate-x-0',
        animated && isVisible && 'transition-all duration-[400ms] ease-out',
        hasAnimated && 'timeline-item-animated',
      )}
    >
      {/* Timeline Line & Node */}
      <div className="flex flex-col items-center relative z-10">
        {/* Timeline Node */}
        <div
          ref={cardRef}
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full border-4 shrink-0',
            'bg-[#252d48] transition-all duration-300',
            hasAnimated && 'timeline-node-glowing'
          )}
          style={{
            borderColor: severityInfo.color,
            boxShadow: animated && isVisible 
              ? `0 0 16px ${severityInfo.glowColor}, 0 0 32px ${severityInfo.glowColor}33`
              : `0 0 16px ${severityInfo.glowColor}`,
          }}
        >
          <SeverityIcon 
            size={20} 
            style={{ color: severityInfo.color }}
            aria-hidden="true"
          />
        </div>

        {/* Connecting Line */}
        {!isLast && (
          <div
            className={cn(
              'w-1 flex-1 mt-2 rounded-full transition-all duration-500',
              animated && isVisible && 'timeline-line-animated'
            )}
            style={{
              background: `linear-gradient(to bottom, ${severityInfo.color}, rgba(20, 184, 166, 0.3))`,
              minHeight: '60px',
              opacity: animated && isVisible ? 1 : 0.3,
            }}
          />
        )}
      </div>

      {/* Timeline Content */}
      <div className="flex-1 min-w-0">
        <Card
          variant="glass"
          className={cn(
            'transition-all duration-300',
            'hover:scale-[1.02] hover:shadow-lg',
            isExpanded && 'ring-1',
            animated && isVisible && 'timeline-card-animated',
          )}
          style={{
            ringColor: severityInfo.borderColor,
          }}
          onClick={handleToggleExpand}
        >
          {/* Card Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              {/* Date */}
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-[#14b8a6] shrink-0" />
                <span className="text-sm font-medium text-[#a0a9c9]">
                  {new Date(conviction.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* Charge */}
              <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
                {conviction.charge}
              </h3>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={outcomeInfo.variant}
                  size="sm"
                >
                  {outcomeInfo.label}
                </Badge>
                <Badge 
                  variant="glass" 
                  size="sm"
                  dot
                  style={{
                    background: severityInfo.bgColor,
                    borderColor: severityInfo.borderColor,
                  }}
                >
                  {severityInfo.label}
                </Badge>
              </div>
            </div>

            {/* Expand/Collapse Button */}
            <button
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg',
                'bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)]',
                'text-[#a0a9c9] hover:text-white',
                'transition-all duration-200',
                'shrink-0 ml-4'
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleExpand();
              }}
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* Sentence Summary */}
          {conviction.sentence && (
            <div className="mb-4">
              <p className="text-[#a0a9c9] text-sm">
                <span className="font-medium text-white">Sentence:</span> {conviction.sentence}
              </p>
            </div>
          )}

          {/* Expandable Details */}
          <div
            className={cn(
              'overflow-hidden transition-all duration-300 ease-in-out',
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="pt-4 border-t border-[rgba(255,255,255,0.1)] space-y-3">
              {/* Description */}
              {conviction.description && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Description</h4>
                  <p className="text-sm text-[#a0a9c9] leading-relaxed">
                    {conviction.description}
                  </p>
                </div>
              )}

              {/* Court Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {conviction.courtName && (
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Court</h4>
                    <p className="text-sm text-[#a0a9c9]">{conviction.courtName}</p>
                  </div>
                )}
                {conviction.caseNumber && (
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Case Number</h4>
                    <p className="text-sm text-[#a0a9c9] font-mono">{conviction.caseNumber}</p>
                  </div>
                )}
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {conviction.fineAmount && (
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Fine</h4>
                    <p className="text-sm text-[#a0a9c9]">
                      ${conviction.fineAmount.toLocaleString()}
                    </p>
                  </div>
                )}
                {conviction.probationPeriod && (
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Probation</h4>
                    <p className="text-sm text-[#a0a9c9]">{conviction.probationPeriod}</p>
                  </div>
                )}
              </div>

              {/* Appeal Status */}
              {conviction.appealStatus && conviction.appealStatus !== 'none' && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Appeal Status</h4>
                  <Badge 
                    variant={
                      conviction.appealStatus === 'upheld' ? 'danger' :
                      conviction.appealStatus === 'overturned' ? 'success' :
                      'warning'
                    }
                    size="sm"
                  >
                    {conviction.appealStatus.charAt(0).toUpperCase() + conviction.appealStatus.slice(1)}
                  </Badge>
                </div>
              )}

              {/* Additional Details */}
              {conviction.details && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Additional Details</h4>
                  <p className="text-sm text-[#a0a9c9] leading-relaxed">
                    {conviction.details}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

/**
 * ConvictionTimeline - Displays chronological conviction history with expandable details
 * 
 * Features:
 * - Vertical timeline with connecting lines and severity-colored nodes
 * - Glassmorphism cards with hover animations
 * - Expandable details for each conviction
 * - Severity indicators with color coding
 * - Scroll-triggered staggered animations
 * - Responsive design for mobile devices
 * 
 * @example
 * <ConvictionTimeline 
 *   convictions={convictionsData} 
 *   animated={true}
 * />
 */
export function ConvictionTimeline({ 
  convictions, 
  className, 
  animated = true 
}: ConvictionTimelineProps) {
  // Sort convictions by date (most recent first)
  const sortedConvictions = [...convictions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (convictions.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <User size={48} className="mx-auto mb-4 text-[#a0a9c9]" />
        <h3 className="text-lg font-medium text-white mb-2">No Conviction History</h3>
        <p className="text-[#a0a9c9]">
          No criminal convictions found for this individual.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Timeline Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-[#14b8a6] to-[#7c3aed]">
          <Scale size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Conviction History</h2>
          <p className="text-sm text-[#a0a9c9]">
            {convictions.length} conviction{convictions.length !== 1 ? 's' : ''} on record
          </p>
        </div>
      </div>

      {/* Timeline Items */}
      <div className="relative">
        {sortedConvictions.map((conviction, index) => (
          <TimelineItem
            key={conviction.id}
            conviction={conviction}
            index={index}
            isLast={index === sortedConvictions.length - 1}
            animated={animated}
          />
        ))}
      </div>

      {/* Aurora Gradient Accent Line (subtle) */}
      <div 
        className="absolute left-6 top-20 bottom-0 w-px opacity-30 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(20, 184, 166, 0.5), rgba(124, 58, 237, 0.5))',
          zIndex: 1,
        }}
      />
    </div>
  );
}

export default ConvictionTimeline;