'use client';

import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LastLoginBadgeProps {
  /** ISO 8601 timestamp of the last login, or null/undefined if never logged in */
  lastLoginAt: string | null | undefined;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns a human-readable relative time string such as "2 days ago",
 * "just now", or "3 months ago".
 */
function getRelativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return 'just now';

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours   = Math.floor(diffMinutes / 60);
  const diffDays    = Math.floor(diffHours   / 24);
  const diffWeeks   = Math.floor(diffDays    / 7);
  const diffMonths  = Math.floor(diffDays    / 30);
  const diffYears   = Math.floor(diffDays    / 365);

  if (diffSeconds < 60)  return 'just now';
  if (diffMinutes < 60)  return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  if (diffHours   < 24)  return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays    < 7)   return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  if (diffWeeks   < 5)   return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
  if (diffMonths  < 12)  return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
  return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
}

/**
 * Returns a full, human-readable date/time string for the tooltip.
 * e.g. "Wednesday, 09 October 2026, 14:30:00"
 */
function getFullDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * LastLoginBadge
 *
 * Renders a relative time string ("2 days ago") with the full date/time
 * shown in a native tooltip on hover. If the user has never logged in,
 * renders "Never" with a muted style.
 *
 * The component re-evaluates the relative time on mount so SSR-rendered
 * static HTML (which has no timestamp) is replaced with the live value.
 *
 * @example
 * <LastLoginBadge lastLoginAt={user.last_login_at} />
 * <LastLoginBadge lastLoginAt={null} />
 */
export function LastLoginBadge({ lastLoginAt, className }: LastLoginBadgeProps) {
  // Hydrate on client to avoid SSR/client timestamp mismatch
  const [relative, setRelative] = useState<string | null>(null);

  useEffect(() => {
    if (!lastLoginAt) return;
    setRelative(getRelativeTime(lastLoginAt));

    // Update every minute so the badge stays fresh for long-lived pages
    const interval = setInterval(() => {
      setRelative(getRelativeTime(lastLoginAt));
    }, 60_000);

    return () => clearInterval(interval);
  }, [lastLoginAt]);

  // "Never" case
  if (!lastLoginAt) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 text-sm text-[#6b7280]',
          className
        )}
        aria-label="Never logged in"
      >
        <Clock size={14} className="text-[#6b7280]" aria-hidden="true" />
        Never
      </span>
    );
  }

  const fullDate = getFullDate(lastLoginAt);
  const displayText = relative ?? '…'; // placeholder before client hydration

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-sm text-[#a0a9c9] cursor-default',
        'underline decoration-dotted decoration-[#6b7280] underline-offset-2',
        className
      )}
      title={fullDate}
      aria-label={`Last login: ${fullDate}`}
    >
      <Clock size={14} className="text-[#14b8a6] flex-shrink-0" aria-hidden="true" />
      {displayText}
    </span>
  );
}

export default LastLoginBadge;
