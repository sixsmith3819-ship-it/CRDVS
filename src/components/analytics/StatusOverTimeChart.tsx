'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/cn';

/**
 * Data point for the chart - daily data point with counts for each status
 */
interface DataPoint {
  date: string; // YYYY-MM-DD format
  verified: number;
  pending: number;
  mismatch: number;
}

/**
 * Which status lines are visible on the chart.
 * When a key is `false` the corresponding line and its data points are hidden.
 */
export type VisibleLines = {
  verified: boolean;
  pending: boolean;
  mismatch: boolean;
};

/**
 * Props for the StatusOverTimeChart component
 */
interface StatusOverTimeChartProps {
  data: DataPoint[];
  height?: number;
  showGrid?: boolean;
  animationDuration?: number;
  className?: string;
  /**
   * Controls which status lines are rendered.
   * Defaults to all visible when omitted.
   */
  visibleLines?: VisibleLines;
}

/**
 * Utility to find min/max for scaling
 */
function getMinMax(data: DataPoint[]) {
  let min = Infinity;
  let max = 0;

  data.forEach((point) => {
    const total = point.verified + point.pending + point.mismatch;
    min = Math.min(min, 0); // Always include 0
    max = Math.max(max, total);
  });

  return { min: 0, max: max === 0 ? 100 : max };
}

/**
 * Generate smooth path using cubic Bezier curves
 */
function generateSmoothPath(
  points: { x: number; y: number }[],
  width: number,
  height: number
): string {
  if (points.length === 0) return '';
  if (points.length === 1) {
    const p = points[0];
    return `M ${p.x} ${p.y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const curr = points[i];
    const prev = points[i - 1];
    const next = points[i + 1] || curr;

    // Calculate control points for smooth curves
    const cpx1 = prev.x + (curr.x - prev.x) / 2;
    const cpy1 = prev.y;
    const cpx2 = curr.x - (next.x - curr.x) / 2;
    const cpy2 = curr.y;

    path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
  }

  return path;
}

/**
 * Format date for X-axis label
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00Z');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * StatusOverTimeChart Component
 *
 * Displays verification metrics over time with:
 * - 3 colored lines (Verified, Pending, Mismatch)
 * - Smooth curves with no discrete points
 * - Hover tooltips showing exact values
 * - Grid lines for readability
 * - Legend
 * - Dark spatial theme with Aurora palette
 * - Responsive sizing
 * - Animation on load
 *
 * **Validates: Requirements 1.11**
 */
export function StatusOverTimeChart({
  data,
  height = 320,
  showGrid = true,
  animationDuration = 800,
  className,
  visibleLines,
}: StatusOverTimeChartProps) {
  // Resolve which lines are active; default all to true when prop is omitted
  const showVerified = visibleLines?.verified ?? true;
  const showPending = visibleLines?.pending ?? true;
  const showMismatch = visibleLines?.mismatch ?? true;
  const chartWidth = 1000;
  const chartHeight = height;
  const padding = 60;
  const plotWidth = chartWidth - padding * 2;
  const plotHeight = chartHeight - padding * 2;

  // Get data ranges
  const { min, max } = useMemo(() => getMinMax(data), [data]);
  const range = max - min || 1;

  // Generate chart coordinates
  const chartData = useMemo(() => {
    if (data.length === 0) {
      return {
        verified: [],
        pending: [],
        mismatch: [],
        dates: []
      };
    }

    const verifiedPoints: { x: number; y: number }[] = [];
    const pendingPoints: { x: number; y: number }[] = [];
    const mismatchPoints: { x: number; y: number }[] = [];
    const dates: string[] = [];

    data.forEach((point, index) => {
      const x = padding + (plotWidth / (data.length - 1 || 1)) * index;
      
      // Calculate Y positions (inverted because SVG Y goes down)
      const verifiedY = padding + plotHeight - ((point.verified - min) / range) * plotHeight;
      const pendingY = padding + plotHeight - ((point.pending - min) / range) * plotHeight;
      const mismatchY = padding + plotHeight - ((point.mismatch - min) / range) * plotHeight;

      verifiedPoints.push({ x, y: verifiedY });
      pendingPoints.push({ x, y: pendingY });
      mismatchPoints.push({ x, y: mismatchY });
      dates.push(point.date);
    });

    return {
      verified: verifiedPoints,
      pending: pendingPoints,
      mismatch: mismatchPoints,
      dates
    };
  }, [data, min, max, range, plotWidth, plotHeight]);

  // Generate paths
  const verifiedPath = useMemo(
    () => generateSmoothPath(chartData.verified, plotWidth, plotHeight),
    [chartData.verified, plotWidth, plotHeight]
  );

  const pendingPath = useMemo(
    () => generateSmoothPath(chartData.pending, plotWidth, plotHeight),
    [chartData.pending, plotWidth, plotHeight]
  );

  const mismatchPath = useMemo(
    () => generateSmoothPath(chartData.mismatch, plotWidth, plotHeight),
    [chartData.mismatch, plotWidth, plotHeight]
  );

  // Generate Y-axis labels
  const yAxisLabels = useMemo(() => {
    const labels: { value: number; y: number }[] = [];
    const steps = 4;
    
    for (let i = 0; i <= steps; i++) {
      const value = min + (range / steps) * i;
      const y = padding + plotHeight - (plotHeight / steps) * i;
      labels.push({ value: Math.round(value), y });
    }

    return labels;
  }, [min, range, padding, plotHeight]);

  // Generate X-axis labels (show every nth date to avoid crowding)
  const xAxisLabels = useMemo(() => {
    const labels: { date: string; x: number; index: number }[] = [];
    const step = Math.ceil(data.length / 5) || 1; // Show ~5 labels max

    data.forEach((point, index) => {
      if (index % step === 0 || index === data.length - 1) {
        const x = padding + (plotWidth / (data.length - 1 || 1)) * index;
        labels.push({ date: point.date, x, index });
      }
    });

    return labels;
  }, [data, plotWidth, padding]);

  // State for hover tooltip
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  // Get current hovered point data
  const hoveredData = hoveredIndex !== null && data[hoveredIndex] ? data[hoveredIndex] : null;
  const hoveredX = hoveredIndex !== null ? chartData.verified[hoveredIndex]?.x : 0;
  const hoveredY = hoveredIndex !== null ? padding : 0;

  return (
    <div className={cn('w-full flex flex-col gap-4', className)}>
      {/* Chart SVG */}
      <div className="relative overflow-x-auto bg-[#1a1f3a] rounded-lg p-4 glassmorphic-border">
        <svg
          width={chartWidth}
          height={chartHeight}
          className="mx-auto bg-transparent"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25))' }}
        >
          {/* Grid Lines - Background */}
          {showGrid && (
            <g opacity="0.1" stroke="#14b8a6">
              {/* Horizontal grid lines */}
              {yAxisLabels.map((label, idx) => (
                <line
                  key={`hgrid-${idx}`}
                  x1={padding}
                  y1={label.y}
                  x2={chartWidth - padding}
                  y2={label.y}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}
            </g>
          )}

          {/* Y-Axis */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={chartHeight - padding}
            stroke="#3a4254"
            strokeWidth="2"
          />

          {/* X-Axis */}
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            stroke="#3a4254"
            strokeWidth="2"
          />

          {/* Y-Axis Labels */}
          {yAxisLabels.map((label, idx) => (
            <g key={`ylabel-${idx}`}>
              {/* Tick */}
              <line
                x1={padding - 6}
                y1={label.y}
                x2={padding}
                y2={label.y}
                stroke="#3a4254"
                strokeWidth="1"
              />
              {/* Label */}
              <text
                x={padding - 12}
                y={label.y + 4}
                textAnchor="end"
                fill="#a0a9c9"
                fontSize="12"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {label.value}
              </text>
            </g>
          ))}

          {/* X-Axis Labels */}
          {xAxisLabels.map((label, idx) => (
            <g key={`xlabel-${idx}`}>
              {/* Tick */}
              <line
                x1={label.x}
                y1={chartHeight - padding}
                x2={label.x}
                y2={chartHeight - padding + 6}
                stroke="#3a4254"
                strokeWidth="1"
              />
              {/* Label */}
              <text
                x={label.x}
                y={chartHeight - padding + 20}
                textAnchor="middle"
                fill="#a0a9c9"
                fontSize="12"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {formatDate(label.date)}
              </text>
            </g>
          ))}

          {/* Data Lines - Mismatch (Red) - Draw first so it's behind */}
          {mismatchPath && (
            <g
              style={{
                opacity: showMismatch ? 1 : 0,
                transition: 'opacity 200ms ease-in-out',
                pointerEvents: showMismatch ? 'auto' : 'none',
              }}
              aria-hidden={!showMismatch}
            >
              <path
                d={mismatchPath}
                fill="none"
                stroke="#dc2626"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  animation: showMismatch ? `drawLine ${animationDuration}ms ease-out forwards` : 'none',
                  strokeDasharray: plotWidth * 3,
                  strokeDashoffset: showMismatch ? plotWidth * 3 : 0
                }}
              />
            </g>
          )}

          {/* Data Lines - Pending (Aurora Blue/Purple) */}
          {pendingPath && (
            <g
              style={{
                opacity: showPending ? 1 : 0,
                transition: 'opacity 200ms ease-in-out',
                pointerEvents: showPending ? 'auto' : 'none',
              }}
              aria-hidden={!showPending}
            >
              <path
                d={pendingPath}
                fill="none"
                stroke="#7c3aed"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  animation: showPending ? `drawLine ${animationDuration}ms ease-out forwards` : 'none',
                  strokeDasharray: plotWidth * 3,
                  strokeDashoffset: showPending ? plotWidth * 3 : 0,
                  animationDelay: '100ms'
                }}
              />
            </g>
          )}

          {/* Data Lines - Verified (Aurora Teal) - Draw last so it's on top */}
          {verifiedPath && (
            <g
              style={{
                opacity: showVerified ? 1 : 0,
                transition: 'opacity 200ms ease-in-out',
                pointerEvents: showVerified ? 'auto' : 'none',
              }}
              aria-hidden={!showVerified}
            >
              <path
                d={verifiedPath}
                fill="none"
                stroke="#14b8a6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  animation: showVerified ? `drawLine ${animationDuration}ms ease-out forwards` : 'none',
                  strokeDasharray: plotWidth * 3,
                  strokeDashoffset: showVerified ? plotWidth * 3 : 0,
                  animationDelay: '200ms'
                }}
              />
            </g>
          )}

          {/* Data Points - Verified */}
          <g
            style={{
              opacity: showVerified ? 1 : 0,
              transition: 'opacity 200ms ease-in-out',
              pointerEvents: showVerified ? 'auto' : 'none',
            }}
          >
            {chartData.verified.map((point, idx) => (
              <circle
                key={`verified-point-${idx}`}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#14b8a6"
                opacity="0.6"
                style={{
                  animation: `fadeIn ${animationDuration}ms ease-out forwards`,
                  animationDelay: `${200 + idx * 30}ms`
                }}
              />
            ))}
          </g>

          {/* Data Points - Pending */}
          <g
            style={{
              opacity: showPending ? 1 : 0,
              transition: 'opacity 200ms ease-in-out',
              pointerEvents: showPending ? 'auto' : 'none',
            }}
          >
            {chartData.pending.map((point, idx) => (
              <circle
                key={`pending-point-${idx}`}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#7c3aed"
                opacity="0.6"
                style={{
                  animation: `fadeIn ${animationDuration}ms ease-out forwards`,
                  animationDelay: `${200 + idx * 30}ms`
                }}
              />
            ))}
          </g>

          {/* Data Points - Mismatch */}
          <g
            style={{
              opacity: showMismatch ? 1 : 0,
              transition: 'opacity 200ms ease-in-out',
              pointerEvents: showMismatch ? 'auto' : 'none',
            }}
          >
            {chartData.mismatch.map((point, idx) => (
              <circle
                key={`mismatch-point-${idx}`}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#dc2626"
                opacity="0.6"
                style={{
                  animation: `fadeIn ${animationDuration}ms ease-out forwards`,
                  animationDelay: `${200 + idx * 30}ms`
                }}
              />
            ))}
          </g>

          {/* Hover Tooltip Background - Vertical Line */}
          {hoveredIndex !== null && (
            <line
              x1={hoveredX}
              y1={padding}
              x2={hoveredX}
              y2={chartHeight - padding}
              stroke="#14b8a6"
              strokeWidth="2"
              opacity="0.3"
              strokeDasharray="4 4"
            />
          )}

          {/* Interactive hover detection area */}
          <g>
            {chartData.verified.map((point, idx) => (
              <circle
                key={`hover-${idx}`}
                cx={point.x}
                cy={padding + plotHeight / 2}
                r="20"
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </g>
        </svg>

        {/* Hover Tooltip */}
        {hoveredData && hoveredIndex !== null && (
          <div
            className="absolute bg-[#0a0e27] border border-[#14b8a6] rounded-lg p-3 pointer-events-none z-10"
            style={{
              left: `${padding + (plotWidth / (data.length - 1 || 1)) * hoveredIndex + 30}px`,
              top: `${padding + 20}px`,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 24px rgba(20, 184, 166, 0.15)'
            }}
          >
            <p className="text-xs font-semibold text-white mb-2">
              {formatDate(hoveredData.date)}
            </p>
            <div className="space-y-1 text-xs">
              {showVerified && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#14b8a6' }}></span>
                  <span className="text-[#a0a9c9]">Verified:</span>
                  <span className="text-white font-medium">{hoveredData.verified}</span>
                </div>
              )}
              {showPending && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7c3aed' }}></span>
                  <span className="text-[#a0a9c9]">Pending:</span>
                  <span className="text-white font-medium">{hoveredData.pending}</span>
                </div>
              )}
              {showMismatch && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#dc2626' }}></span>
                  <span className="text-[#a0a9c9]">Mismatch:</span>
                  <span className="text-white font-medium">{hoveredData.mismatch}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 justify-center px-4" role="list" aria-label="Chart legend">
        {showVerified && (
          <div className="flex items-center gap-2" role="listitem">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#14b8a6' }}></div>
            <span className="text-sm text-[#a0a9c9]">Verified</span>
          </div>
        )}
        {showPending && (
          <div className="flex items-center gap-2" role="listitem">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#7c3aed' }}></div>
            <span className="text-sm text-[#a0a9c9]">Pending</span>
          </div>
        )}
        {showMismatch && (
          <div className="flex items-center gap-2" role="listitem">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#dc2626' }}></div>
            <span className="text-sm text-[#a0a9c9]">Mismatch</span>
          </div>
        )}
        {!showVerified && !showPending && !showMismatch && (
          <p className="text-sm text-[#6b7280]">No lines selected — enable filters above to show data</p>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes drawLine {
          from {
            stroke-dashoffset: var(--stroke-dasharray, 3000);
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.6;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          svg path,
          svg circle {
            animation: none !important;
          }
        }

        .glassmorphic-border {
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
}

export default StatusOverTimeChart;
