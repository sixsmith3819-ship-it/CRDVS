'use client';

import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { colors, spacing } from '@/lib/design-tokens';

/**
 * Offense category data structure
 */
export interface OffenseCategory {
  name: string;
  count: number;
  color: string;
}

interface OffenseCategoryChartProps {
  data: OffenseCategory[];
  title?: string;
  subtitle?: string;
  className?: string;
  onSegmentClick?: (category: OffenseCategory) => void;
}

/**
 * Color palette for chart segments - distinct, high-contrast colors
 * ensuring WCAG AA compliance for accessibility
 */
const DEFAULT_COLORS = [
  '#14b8a6', // Aurora Teal
  '#7c3aed', // Aurora Purple
  '#10b981', // Aurora Green
  '#f59e0b', // Warning Amber
  '#3b82f6', // Info Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
];

/**
 * Calculate angle in degrees for arc path
 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

/**
 * Create SVG arc path for donut segment
 */
function describeArc(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  innerRadius: number
) {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const innerStart = polarToCartesian(centerX, centerY, innerRadius, endAngle);
  const innerEnd = polarToCartesian(centerX, centerY, innerRadius, startAngle);

  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

export function OffenseCategoryChart({
  data,
  title = 'Offense Category Distribution',
  subtitle,
  className,
  onSegmentClick,
}: OffenseCategoryChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Calculate total and percentages
  const calculations = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const segments = data.map((item, index) => {
      const percentage = total > 0 ? (item.count / total) * 100 : 0;
      const startAngle = index === 0 ? 0 : data.slice(0, index).reduce((sum, d) => sum + (d.count / total) * 360, 0);
      const angle = (item.count / total) * 360;
      const endAngle = startAngle + angle;
      const midAngle = (startAngle + endAngle) / 2;

      return {
        ...item,
        total,
        percentage,
        startAngle,
        endAngle,
        midAngle,
        angle,
        index,
      };
    });

    return { segments, total };
  }, [data]);

  if (calculations.total === 0) {
    return (
      <div
        className={cn(
          'rounded-lg p-6 text-center',
          'bg-glass-base backdrop-blur-lg border border-glass-border',
          className
        )}
      >
        <p className="text-text-secondary">No data available</p>
      </div>
    );
  }

  const chartSize = 300;
  const outerRadius = 100;
  const innerRadius = 60;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;

  return (
    <div
      className={cn(
        'rounded-lg p-6',
        'bg-glass-base backdrop-blur-lg border border-glass-border',
        'transition-all duration-200 hover:border-glass-border-hover',
        className
      )}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {subtitle && (
          <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
        )}
      </div>

      {/* Chart Container */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* SVG Donut Chart */}
        <div className="relative flex items-center justify-center">
          <svg
            width={chartSize}
            height={chartSize}
            viewBox={`0 0 ${chartSize} ${chartSize}`}
            className="drop-shadow-lg"
          >
            {/* Segments */}
            {calculations.segments.map((segment) => {
              const isHovered = hoveredIndex === segment.index;
              const path = describeArc(
                centerX,
                centerY,
                isHovered ? outerRadius + 8 : outerRadius,
                segment.startAngle,
                segment.endAngle,
                innerRadius
              );

              return (
                <g key={segment.index}>
                  <path
                    d={path}
                    fill={segment.color}
                    opacity={isHovered ? 1 : 0.9}
                    className="transition-all duration-200 cursor-pointer hover:opacity-100"
                    style={{
                      filter: isHovered ? `drop-shadow(0 0 12px ${segment.color}80)` : 'none',
                    }}
                    onMouseEnter={() => setHoveredIndex(segment.index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => onSegmentClick?.(segment)}
                  />
                  {/* Label on segment (only show for segments > 5%) */}
                  {segment.percentage > 5 && (
                    <text
                      x={
                        centerX +
                        ((outerRadius + innerRadius) / 2) *
                          Math.cos(((segment.midAngle - 90) * Math.PI) / 180)
                      }
                      y={
                        centerY +
                        ((outerRadius + innerRadius) / 2) *
                          Math.sin(((segment.midAngle - 90) * Math.PI) / 180)
                      }
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-semibold pointer-events-none"
                      fill={colors.textPrimary}
                      opacity={isHovered ? 1 : 0.8}
                    >
                      {segment.percentage.toFixed(1)}%
                    </text>
                  )}
                </g>
              );
            })}

            {/* Center circle with total */}
            <circle
              cx={centerX}
              cy={centerY}
              r={innerRadius - 5}
              fill={colors.surface}
              opacity={0.5}
            />
            <text
              x={centerX}
              y={centerY - 12}
              textAnchor="middle"
              className="text-2xl font-bold"
              fill={colors.textPrimary}
            >
              {calculations.total.toLocaleString()}
            </text>
            <text
              x={centerX}
              y={centerY + 12}
              textAnchor="middle"
              className="text-xs"
              fill={colors.textSecondary}
            >
              Total Offenses
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 max-w-sm">
          {calculations.segments.map((segment, index) => {
            const isHovered = hoveredIndex === segment.index;
            return (
              <div
                key={segment.index}
                className={cn(
                  'flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-150',
                  isHovered ? 'bg-glass-hover' : 'hover:bg-glass-hover'
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSegmentClick?.(segment)}
              >
                {/* Color indicator */}
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0 transition-all duration-200"
                  style={{
                    backgroundColor: segment.color,
                    boxShadow: isHovered
                      ? `0 0 8px ${segment.color}80`
                      : 'none',
                  }}
                />

                {/* Category info */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-medium truncate',
                      isHovered ? 'text-text-primary' : 'text-text-primary'
                    )}
                  >
                    {segment.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {segment.count.toLocaleString()} ({segment.percentage.toFixed(1)}%)
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-6 pt-6 border-t border-glass-border grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-aurora-teal">
            {data.length}
          </p>
          <p className="text-xs text-text-secondary mt-1">Categories</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-aurora-purple">
            {calculations.total.toLocaleString()}
          </p>
          <p className="text-xs text-text-secondary mt-1">Total Records</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-aurora-green">
            {(calculations.total / data.length).toFixed(0)}
          </p>
          <p className="text-xs text-text-secondary mt-1">Avg per Category</p>
        </div>
      </div>
    </div>
  );
}
