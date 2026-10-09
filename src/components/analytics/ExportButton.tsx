'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, Download, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { AnalyticsMetric } from '@/lib/analytics/exportAnalytics';
import { exportToCsv, exportToPdf } from '@/lib/analytics/exportAnalytics';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExportButtonProps {
  /** KPI metrics to include in the CSV export */
  metrics: AnalyticsMetric[];
  /** ISO date string – start of the selected period (YYYY-MM-DD) */
  dateFrom: string;
  /** ISO date string – end of the selected period (YYYY-MM-DD) */
  dateTo: string;
  /** Whether to disable the button (e.g., while data is still loading) */
  disabled?: boolean;
  className?: string;
}

type ExportFormat = 'csv' | 'pdf';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Export dropdown button for the Analytics Dashboard.
 *
 * Renders a "Export ▾" button that opens a glassmorphic dropdown with
 * "Export CSV" and "Export PDF" options.  Shows a loading spinner while
 * the export is in progress and fires a success toast on completion.
 */
export function ExportButton({
  metrics,
  dateFrom,
  dateTo,
  disabled = false,
  className,
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // -------------------------------------------------------------------------
  // Close on outside click
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  // -------------------------------------------------------------------------
  // Keyboard navigation
  // -------------------------------------------------------------------------
  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    },
    [],
  );

  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLUListElement>) => {
      const items = Array.from(
        e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not([disabled])'),
      );
      const current = document.activeElement as HTMLElement;
      const idx = items.indexOf(current as HTMLButtonElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[(idx + 1) % items.length]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[(idx - 1 + items.length) % items.length]?.focus();
      } else if (e.key === 'Escape' || e.key === 'Tab') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    },
    [],
  );

  // -------------------------------------------------------------------------
  // Toast helper (uses the custom event bus defined in Toast.tsx)
  // -------------------------------------------------------------------------
  const fireSuccessToast = useCallback((format: ExportFormat) => {
    const label = format === 'csv' ? 'CSV' : 'PDF';
    window.dispatchEvent(
      new CustomEvent('add-toast', {
        detail: {
          id: `export-${Date.now()}`,
          title: 'Analytics exported successfully',
          message: `Your ${label} export is ready.`,
          type: 'success',
        },
      }),
    );
  }, []);

  const fireErrorToast = useCallback((format: ExportFormat) => {
    const label = format === 'csv' ? 'CSV' : 'PDF';
    window.dispatchEvent(
      new CustomEvent('add-toast', {
        detail: {
          id: `export-err-${Date.now()}`,
          title: `${label} export failed`,
          message: 'Please try again. Check console for details.',
          type: 'error',
        },
      }),
    );
  }, []);

  // -------------------------------------------------------------------------
  // Export handlers
  // -------------------------------------------------------------------------
  const handleExport = useCallback(
    (format: ExportFormat) => {
      if (isExporting) return;
      setIsOpen(false);
      setIsExporting(true);
      setExportingFormat(format);

      const shared = {
        onStart: () => {
          /* loading state already set above */
        },
        onComplete: () => {
          setIsExporting(false);
          setExportingFormat(null);
          fireSuccessToast(format);
        },
        onError: (err: Error) => {
          console.error('[ExportButton]', err);
          setIsExporting(false);
          setExportingFormat(null);
          fireErrorToast(format);
        },
      };

      if (format === 'csv') {
        exportToCsv({ metrics, dateFrom, dateTo, ...shared });
      } else {
        exportToPdf({ dateFrom, dateTo, ...shared });
      }
    },
    [isExporting, metrics, dateFrom, dateTo, fireSuccessToast, fireErrorToast],
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  const isDisabled = disabled || isExporting;

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Export analytics data"
        disabled={isDisabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'inline-flex items-center gap-2',
          'px-4 py-2 rounded-lg font-medium text-sm',
          'border transition-all duration-200',
          // Glassmorphism surface
          'bg-[rgba(255,255,255,0.08)] backdrop-blur-sm',
          'border-[rgba(255,255,255,0.15)]',
          'text-[#a0a9c9]',
          // Hover: Aurora teal tint
          'hover:bg-[rgba(20,184,166,0.15)] hover:border-[rgba(20,184,166,0.4)] hover:text-white',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e27]',
          'active:scale-[0.98]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
        )}
        <span>{isExporting ? `Exporting ${exportingFormat?.toUpperCase()}…` : 'Export'}</span>
        {!isExporting && (
          <ChevronDown
            className={cn(
              'w-4 h-4 shrink-0 transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
            aria-hidden="true"
          />
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul
          role="menu"
          aria-label="Export options"
          onKeyDown={handleMenuKeyDown}
          className={cn(
            'absolute right-0 top-[calc(100%+6px)] z-50',
            'min-w-[180px] rounded-xl overflow-hidden',
            'border border-[rgba(255,255,255,0.15)]',
            'bg-[rgba(15,20,45,0.85)] backdrop-blur-xl',
            'shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(20,184,166,0.1)]',
            // Entrance animation
            'animate-[dropdownIn_0.15s_ease-out_forwards]',
          )}
        >
          <li role="none">
            <button
              role="menuitem"
              type="button"
              autoFocus
              onClick={() => handleExport('csv')}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3',
                'text-sm text-[#a0a9c9] text-left',
                'transition-colors duration-150',
                'hover:bg-[rgba(20,184,166,0.15)] hover:text-white',
                'focus-visible:outline-none focus-visible:bg-[rgba(20,184,166,0.15)] focus-visible:text-white',
              )}
            >
              <span
                className="w-7 h-7 rounded-md flex items-center justify-center bg-[rgba(20,184,166,0.15)] shrink-0"
                aria-hidden="true"
              >
                <FileText className="w-3.5 h-3.5 text-[#14b8a6]" />
              </span>
              <span>
                <span className="block font-medium">Export CSV</span>
                <span className="block text-xs text-[#6b7280] mt-0.5">KPI data as spreadsheet</span>
              </span>
            </button>
          </li>

          {/* Divider */}
          <li role="none" className="mx-3 my-0.5 h-px bg-[rgba(255,255,255,0.08)]" aria-hidden="true" />

          <li role="none">
            <button
              role="menuitem"
              type="button"
              onClick={() => handleExport('pdf')}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3',
                'text-sm text-[#a0a9c9] text-left',
                'transition-colors duration-150',
                'hover:bg-[rgba(124,58,237,0.15)] hover:text-white',
                'focus-visible:outline-none focus-visible:bg-[rgba(124,58,237,0.15)] focus-visible:text-white',
              )}
            >
              <span
                className="w-7 h-7 rounded-md flex items-center justify-center bg-[rgba(124,58,237,0.15)] shrink-0"
                aria-hidden="true"
              >
                <FileText className="w-3.5 h-3.5 text-[#7c3aed]" />
              </span>
              <span>
                <span className="block font-medium">Export PDF</span>
                <span className="block text-xs text-[#6b7280] mt-0.5">Print-ready report layout</span>
              </span>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default ExportButton;
