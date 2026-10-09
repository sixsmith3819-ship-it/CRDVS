/**
 * Analytics export utilities — CSV and PDF (print) exports.
 * All logic runs client-side; no server round-trip required.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AnalyticsMetric {
  metric: string;
  currentValue: number | string;
  previousValue: number | string;
  changePct: string;
  period: string;
}

export interface ExportAnalyticsOptions {
  metrics: AnalyticsMetric[];
  dateFrom: string;
  dateTo: string;
  /** Called when export starts (for loading state) */
  onStart?: () => void;
  /** Called when export completes (for toast / loading state) */
  onComplete?: () => void;
  /** Called on error */
  onError?: (error: Error) => void;
}

// ---------------------------------------------------------------------------
// CSV Export
// ---------------------------------------------------------------------------

/**
 * Escape a CSV cell value: wrap in quotes and escape inner quotes.
 */
function escapeCsv(value: string | number): string {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Build a CSV string from rows (array of arrays).
 */
function buildCsv(rows: (string | number)[][]): string {
  return rows.map((row) => row.map(escapeCsv).join(',')).join('\r\n');
}

/**
 * Export KPI metrics to a CSV file and trigger a browser download.
 */
export function exportToCsv({
  metrics,
  dateFrom,
  dateTo,
  onStart,
  onComplete,
  onError,
}: ExportAnalyticsOptions): void {
  try {
    onStart?.();

    const header = ['Metric', 'Current Value', 'Previous Value', 'Change%', 'Period'];
    const rows = metrics.map((m) => [
      m.metric,
      m.currentValue,
      m.previousValue,
      m.changePct,
      m.period,
    ]);

    const csvContent = buildCsv([header, ...rows]);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const filename = `crdvs-analytics-${dateFrom}-${dateTo}.csv`;
    const anchor = document.createElement('a');
    anchor.setAttribute('href', url);
    anchor.setAttribute('download', filename);
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Revoke the object URL after a short delay to allow the download to start.
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    onComplete?.();
  } catch (err) {
    onError?.(err instanceof Error ? err : new Error(String(err)));
  }
}

// ---------------------------------------------------------------------------
// PDF Export (print CSS approach — no external library required)
// ---------------------------------------------------------------------------

/**
 * Inject a temporary <style id="analytics-print-style"> tag that:
 *   - Hides everything except the analytics print region.
 *   - Applies print-friendly colours (white background, black text).
 * Returns a cleanup function that removes the style tag.
 */
function injectPrintStyles(dateFrom: string, dateTo: string): () => void {
  const STYLE_ID = 'analytics-print-style';

  // Remove stale style if it exists from a previous export.
  document.getElementById(STYLE_ID)?.remove();

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @media print {
      /* Hide everything by default */
      body > * {
        display: none !important;
      }

      /* Show only our print region */
      #analytics-print-region,
      #analytics-print-region * {
        display: revert !important;
        visibility: visible !important;
      }

      #analytics-print-region {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: #ffffff !important;
        color: #000000 !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        padding: 24px;
      }

      /* Print header */
      .print-header {
        display: flex !important;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #0a0e27;
        padding-bottom: 16px;
        margin-bottom: 24px;
      }

      .print-logo {
        font-size: 20px;
        font-weight: 700;
        color: #0a0e27 !important;
        letter-spacing: 0.05em;
      }

      .print-meta {
        font-size: 11px;
        color: #6b7280 !important;
        text-align: right;
        line-height: 1.5;
      }

      /* KPI grid */
      .print-kpi-grid {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-bottom: 24px;
      }

      .print-kpi-card {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px 16px;
        background: #f9fafb !important;
      }

      .print-kpi-label {
        font-size: 10px;
        color: #6b7280 !important;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 4px;
      }

      .print-kpi-value {
        font-size: 22px;
        font-weight: 700;
        color: #0a0e27 !important;
      }

      .print-kpi-change {
        font-size: 11px;
        margin-top: 4px;
      }

      .print-kpi-change.positive {
        color: #10b981 !important;
      }

      .print-kpi-change.negative {
        color: #dc2626 !important;
      }

      /* Chart section */
      .print-chart-section {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
        page-break-inside: avoid;
      }

      .print-chart-title {
        font-size: 13px;
        font-weight: 600;
        color: #0a0e27 !important;
        margin-bottom: 8px;
      }

      /* Period badge */
      .print-period {
        display: inline-block !important;
        font-size: 11px;
        background: #f3f4f6 !important;
        border: 1px solid #e5e7eb;
        border-radius: 4px;
        padding: 2px 8px;
        color: #374151 !important;
      }

      /* Footer */
      .print-footer {
        border-top: 1px solid #e5e7eb;
        padding-top: 12px;
        font-size: 10px;
        color: #9ca3af !important;
        text-align: center;
      }

      /* Hide recharts tooltips */
      .recharts-tooltip-wrapper {
        display: none !important;
      }

      @page {
        margin: 20mm;
        size: A4 landscape;
      }
    }
  `;

  document.head.appendChild(style);

  return () => {
    document.getElementById(STYLE_ID)?.remove();
  };
}

/**
 * Export the analytics dashboard as a PDF using window.print().
 * Requires a `<div id="analytics-print-region">` element to exist in the DOM.
 */
export function exportToPdf({
  dateFrom,
  dateTo,
  onStart,
  onComplete,
  onError,
}: Pick<ExportAnalyticsOptions, 'dateFrom' | 'dateTo' | 'onStart' | 'onComplete' | 'onError'>): void {
  try {
    onStart?.();

    const cleanup = injectPrintStyles(dateFrom, dateTo);

    // Give the browser a tick to apply styles before opening the print dialog.
    setTimeout(() => {
      window.print();

      // Clean up after the print dialog closes.
      // `afterprint` fires when the dialog is dismissed (print or cancel).
      const handleAfterPrint = () => {
        cleanup();
        window.removeEventListener('afterprint', handleAfterPrint);
        onComplete?.();
      };

      window.addEventListener('afterprint', handleAfterPrint);

      // Fallback cleanup in case `afterprint` never fires (some browsers).
      setTimeout(() => {
        cleanup();
        window.removeEventListener('afterprint', handleAfterPrint);
        onComplete?.();
      }, 30_000);
    }, 100);
  } catch (err) {
    onError?.(err instanceof Error ? err : new Error(String(err)));
  }
}

// ---------------------------------------------------------------------------
// Helper: build AnalyticsMetric array from the analytics page metrics state
// ---------------------------------------------------------------------------

/**
 * Compute the percentage change between two values.
 * Returns "N/A" if the previous value is zero to avoid division by zero.
 */
export function calcChangePct(current: number, previous: number): string {
  if (previous === 0) return 'N/A';
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

/**
 * Convenience builder that converts the analytics page's metrics/previousMetrics
 * state objects into the `AnalyticsMetric[]` format required by `exportToCsv`.
 */
export function buildAnalyticsMetrics(
  metrics: Record<string, number>,
  previousMetrics: Record<string, number>,
  metricLabels: Record<string, string>,
  metricSuffixes: Record<string, string>,
  period: string,
): AnalyticsMetric[] {
  return Object.entries(metricLabels).map(([key, label]) => {
    const current = metrics[key] ?? 0;
    const previous = previousMetrics[key] ?? 0;
    const suffix = metricSuffixes[key] ?? '';
    return {
      metric: label,
      currentValue: `${current}${suffix}`,
      previousValue: `${previous}${suffix}`,
      changePct: calcChangePct(current, previous),
      period,
    };
  });
}
