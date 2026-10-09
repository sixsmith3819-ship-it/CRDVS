'use client';

import React from 'react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserStatusBadgeProps {
  /** Whether the user account is active */
  active: boolean;
  /**
   * Compact mode for use inside table cells.
   * Renders a small pill without extra spacing.
   */
  compact?: boolean;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * UserStatusBadge
 *
 * Shows a green pulsing "Active" badge or a grey "Deactivated" badge.
 * Use `compact` for table cells where space is limited.
 *
 * @example
 * <UserStatusBadge active={user.is_active} />
 * <UserStatusBadge active={false} compact />
 */
export function UserStatusBadge({ active, compact = false, className }: UserStatusBadgeProps) {
  if (active) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 font-medium whitespace-nowrap',
          compact ? 'px-2 py-0.5 text-xs rounded-full' : 'px-3 py-1 text-sm rounded-full',
          'bg-[rgba(16,185,129,0.15)] text-[#6ee7b7] border border-[rgba(16,185,129,0.3)]',
          className
        )}
        role="status"
        aria-label="Account active"
      >
        {/* Pulsing green dot */}
        <span className="relative flex-shrink-0" aria-hidden="true">
          <span
            className={cn(
              'absolute inline-flex rounded-full bg-[#10b981] opacity-75 animate-ping',
              compact ? 'h-2 w-2' : 'h-2.5 w-2.5'
            )}
          />
          <span
            className={cn(
              'relative inline-flex rounded-full bg-[#10b981]',
              compact ? 'h-2 w-2' : 'h-2.5 w-2.5'
            )}
          />
        </span>
        Active
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium whitespace-nowrap',
        compact ? 'px-2 py-0.5 text-xs rounded-full' : 'px-3 py-1 text-sm rounded-full',
        'bg-[rgba(107,114,128,0.15)] text-[#9ca3af] border border-[rgba(107,114,128,0.25)]',
        className
      )}
      role="status"
      aria-label="Account deactivated"
    >
      {/* Static grey dot */}
      <span
        className={cn(
          'flex-shrink-0 rounded-full bg-[#6b7280]',
          compact ? 'h-2 w-2' : 'h-2.5 w-2.5'
        )}
        aria-hidden="true"
      />
      Deactivated
    </span>
  );
}

export default UserStatusBadge;
