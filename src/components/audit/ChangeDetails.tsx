'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@/lib/cn';
import { ArrowRight, ChevronDown } from 'lucide-react';

export interface ChangeDetailsProps {
  /** Original values before the change */
  oldValues?: Record<string, unknown> | null;
  /** New values after the change */
  newValues?: Record<string, unknown> | null;
  /** Action type — only "update" renders an expand affordance */
  action?: string;
  /** Whether the panel is initially open */
  defaultOpen?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Formats a raw value into a human-readable string for display.
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '(empty)';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}

/**
 * Returns the union of keys from two objects, ordered so changed keys come
 * first, then unchanged keys (for context).
 */
function mergeKeys(
  oldVals: Record<string, unknown>,
  newVals: Record<string, unknown>
): string[] {
  const all = new Set([...Object.keys(oldVals), ...Object.keys(newVals)]);
  const changed: string[] = [];
  const unchanged: string[] = [];
  all.forEach((k) => {
    if (JSON.stringify(oldVals[k]) !== JSON.stringify(newVals[k])) {
      changed.push(k);
    } else {
      unchanged.push(k);
    }
  });
  return [...changed, ...unchanged];
}

/**
 * ChangeDetails — Collapsible diff panel for audit log "update" entries.
 *
 * Features:
 * - Table layout: Field | Old Value | → | New Value
 * - Old value: red text with line-through styling
 * - New value: green text
 * - Smooth 200ms CSS max-height transition
 * - Only renders an expand chevron for "update" actions
 * - Non-object values and nested objects are both handled
 * - Glassmorphism panel background with Aurora border accent
 */
export function ChangeDetails({
  oldValues,
  newValues,
  action = 'update',
  defaultOpen = false,
  className,
}: ChangeDetailsProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // Only show for update actions
  const isUpdate = action === 'update';

  // Build rows
  const rows = useMemo(() => {
    const old = oldValues ?? {};
    const next = newValues ?? {};
    const keys = mergeKeys(old, next);

    return keys.map((key) => {
      const oldVal = old[key];
      const newVal = next[key];
      const changed = JSON.stringify(oldVal) !== JSON.stringify(newVal);

      // If either value is an object, expand its sub-keys as separate rows
      const oldIsObj = oldVal !== null && typeof oldVal === 'object' && !Array.isArray(oldVal);
      const newIsObj = newVal !== null && typeof newVal === 'object' && !Array.isArray(newVal);

      if (oldIsObj || newIsObj) {
        const subOld = (oldIsObj ? oldVal : {}) as Record<string, unknown>;
        const subNew = (newIsObj ? newVal : {}) as Record<string, unknown>;
        const subKeys = mergeKeys(subOld, subNew);
        return subKeys.map((subKey) => ({
          field: `${key}.${subKey}`,
          oldVal: subOld[subKey],
          newVal: subNew[subKey],
          changed: JSON.stringify(subOld[subKey]) !== JSON.stringify(subNew[subKey]),
        }));
      }

      return [{ field: key, oldVal, newVal, changed }];
    }).flat();
  }, [oldValues, newValues]);

  // Measure content height for smooth transition
  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver(() => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    });
    observer.observe(contentRef.current);
    setContentHeight(contentRef.current.scrollHeight);
    return () => observer.disconnect();
  }, [rows]);

  // Nothing to show
  if (!isUpdate || (!oldValues && !newValues)) {
    return null;
  }

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className={cn('', className)}>
      {/* Expand / collapse toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md',
          'text-xs font-medium text-[#a0a9c9]',
          'bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)]',
          'border border-[rgba(255,255,255,0.1)]',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
          'select-none'
        )}
      >
        <ChevronDown
          size={12}
          className={cn(
            'transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
        {isOpen ? 'Hide changes' : `Show ${rows.filter((r) => r.changed).length} change${rows.filter((r) => r.changed).length !== 1 ? 's' : ''}`}
      </button>

      {/* Animated panel */}
      <div
        style={{
          maxHeight: isOpen ? `${contentHeight}px` : '0px',
          overflow: 'hidden',
          transition: 'max-height 200ms ease-in-out',
        }}
        aria-hidden={!isOpen}
      >
        <div ref={contentRef}>
          <div
            className={cn(
              'mt-2 rounded-lg overflow-hidden',
              'bg-[rgba(255,255,255,0.04)]',
              'backdrop-blur-sm',
              'border border-[rgba(20,184,166,0.2)]',
              'shadow-[0_0_12px_rgba(20,184,166,0.06)]'
            )}
          >
            {/* Table header */}
            <div
              className={cn(
                'grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto_minmax(0,2fr)]',
                'px-4 py-2',
                'bg-[rgba(255,255,255,0.04)]',
                'border-b border-[rgba(255,255,255,0.08)]',
                'text-xs font-semibold text-[#6b7280] uppercase tracking-wide'
              )}
            >
              <span>Field</span>
              <span>Old Value</span>
              <span className="px-2" />
              <span>New Value</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[rgba(255,255,255,0.06)]">
              {rows.map((row) => (
                <div
                  key={row.field}
                  className={cn(
                    'grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto_minmax(0,2fr)]',
                    'items-start px-4 py-3 gap-2',
                    row.changed
                      ? 'bg-[rgba(255,255,255,0.02)]'
                      : 'opacity-40'
                  )}
                >
                  {/* Field name */}
                  <span className="text-xs font-mono text-[#cbd5e1] break-all pt-0.5">
                    {row.field}
                  </span>

                  {/* Old value */}
                  <div
                    className={cn(
                      'text-xs font-mono break-all whitespace-pre-wrap',
                      'rounded px-2 py-1',
                      row.changed
                        ? 'text-[#fca5a5] line-through bg-[rgba(220,38,38,0.08)]'
                        : 'text-[#9ca3af]'
                    )}
                    title={row.changed ? 'Old value (removed)' : undefined}
                  >
                    {formatValue(row.oldVal)}
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center px-1 pt-1">
                    <ArrowRight
                      size={12}
                      className={cn(
                        row.changed ? 'text-[#14b8a6]' : 'text-[#374151]'
                      )}
                      aria-label="changed to"
                    />
                  </div>

                  {/* New value */}
                  <div
                    className={cn(
                      'text-xs font-mono break-all whitespace-pre-wrap',
                      'rounded px-2 py-1',
                      row.changed
                        ? 'text-[#86efac] bg-[rgba(16,185,129,0.08)]'
                        : 'text-[#9ca3af]'
                    )}
                    title={row.changed ? 'New value (added)' : undefined}
                  >
                    {formatValue(row.newVal)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangeDetails;
