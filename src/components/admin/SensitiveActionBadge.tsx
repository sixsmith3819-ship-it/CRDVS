'use client';

import React, { useState, useId } from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SensitiveActionBadgeProps {
  /**
   * `inline` — compact pill for table cells and timeline entries.
   * `banner` — wider strip for page-level alerts.
   */
  variant: 'inline' | 'banner';
  /** Short explanation shown inside the banner variant and in the tooltip. */
  reason?: string;
  /** Extra Tailwind classes forwarded to the root element. */
  className?: string;
}

// ─── Tooltip (plain CSS, no third-party dependency) ───────────────────────────

function Tooltip({
  id,
  text,
  children,
}: {
  id: string;
  text: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          id={id}
          className={cn(
            // Positioning — floats above the badge
            'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50',
            // Sizing
            'w-56 px-3 py-2 rounded-lg',
            // Appearance
            'bg-[#1a1f3a] border border-[rgba(220,38,38,0.35)]',
            'text-xs text-[#fca5a5] leading-relaxed',
            // Subtle shadow
            'shadow-[0_4px_16px_rgba(0,0,0,0.5)]',
            // Prevent tooltip from receiving pointer events (avoids flicker)
            'pointer-events-none'
          )}
        >
          {text}
          {/* Arrow */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute top-full left-1/2 -translate-x-1/2',
              'border-4 border-transparent border-t-[rgba(220,38,38,0.35)]'
            )}
          />
        </span>
      )}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Visual indicator for sensitive audit-log actions.
 *
 * ### Variants
 * - **inline** — compact pill (lock icon + "Sensitive" label) for table cells
 *   and timeline entries.
 * - **banner** — wider strip with a short explanation for page-level alerts.
 *
 * Both variants show a tooltip on hover / focus explaining the reason.
 * Colour palette: Aurora red accent on a dark semi-transparent background —
 * WCAG AA compliant (text contrast ≥ 4.5 : 1 against dark backgrounds).
 */
export function SensitiveActionBadge({
  variant,
  reason = 'This action involves sensitive data or an irreversible operation.',
  className,
}: SensitiveActionBadgeProps) {
  const tooltipId = useId();

  if (variant === 'inline') {
    return (
      <Tooltip id={tooltipId} text={reason}>
        {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
        <span
          role="img"
          aria-label="Sensitive action"
          aria-describedby={tooltipId}
          tabIndex={0}
          className={cn(
            // Layout
            'inline-flex items-center gap-1',
            // Sizing — matches the pill spec
            'px-2 py-0.5 rounded-full text-xs font-medium',
            // Aurora red palette
            'bg-[rgba(220,38,38,0.15)] text-[#fca5a5] border border-[rgba(220,38,38,0.3)]',
            // Interaction
            'cursor-default select-none',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fca5a5] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
            className
          )}
        >
          <Lock size={10} aria-hidden="true" />
          Sensitive
        </span>
      </Tooltip>
    );
  }

  // banner variant
  return (
    <Tooltip id={tooltipId} text={reason}>
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
      <span
        role="img"
        aria-label="Sensitive action"
        aria-describedby={tooltipId}
        tabIndex={0}
        className={cn(
          // Layout
          'inline-flex items-center gap-2',
          // Sizing — banner spec
          'px-4 py-2 rounded-lg',
          // Aurora red palette (same as inline, just larger)
          'bg-[rgba(220,38,38,0.15)] text-[#fca5a5] border border-[rgba(220,38,38,0.3)]',
          // Interaction
          'cursor-default select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fca5a5] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
          className
        )}
      >
        <Lock size={14} aria-hidden="true" className="flex-shrink-0" />
        <span className="font-semibold text-sm">Sensitive</span>
        {reason && (
          <span className="text-xs text-[#fca5a5]/80 font-normal hidden sm:inline">
            — {reason}
          </span>
        )}
      </span>
    </Tooltip>
  );
}
