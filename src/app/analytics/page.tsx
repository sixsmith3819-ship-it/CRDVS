'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Container } from '@/components/layout/Container';
import { Grid } from '@/components/layout/Grid';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusOverTimeChart, type VisibleLines } from '@/components/analytics/StatusOverTimeChart';
import { cn } from '@/lib/cn';
import { ExportButton } from '@/components/analytics/ExportButton';
import { buildAnalyticsMetrics } from '@/lib/analytics/exportAnalytics';
import {
  Calendar,
  RotateCcw,
  FileCheck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Flag,
  Signal,
  Filter,
  X,
  ChevronDown,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DateRange {
  from: string;
  to: string;
}

type DatePreset = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

type StatusKey = keyof VisibleLines;

const OFFENSE_CATEGORIES = [
  'All',
  'Assault',
  'Theft',
  'Fraud',
  'Traffic',
  'Homicide',
  'Drug Offenses',
  'Other',
] as const;
type OffenseCategory = (typeof OFFENSE_CATEGORIES)[number];

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_VISIBLE_LINES: VisibleLines = {
  verified: true,
  pending: true,
  mismatch: true,
};

const DEFAULT_OFFENSE: OffenseCategory = 'All';

// ─── Presets ─────────────────────────────────────────────────────────────────

const QUICK_PRESETS = [
  { label: 'Today', value: 'today' as DatePreset },
  { label: 'This Week', value: 'week' as DatePreset },
  { label: 'This Month', value: 'month' as DatePreset },
  { label: 'This Quarter', value: 'quarter' as DatePreset },
  { label: 'This Year', value: 'year' as DatePreset },
];

/** Status toggle definitions (order = display order) */
const STATUS_TOGGLES: { key: StatusKey; label: string; color: string; glow: string }[] = [
  { key: 'verified', label: 'Verified', color: '#14b8a6', glow: 'rgba(20,184,166,0.45)' },
  { key: 'pending', label: 'Pending', color: '#7c3aed', glow: 'rgba(124,58,237,0.45)' },
  { key: 'mismatch', label: 'Mismatch', color: '#dc2626', glow: 'rgba(220,38,38,0.45)' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDateRangeFromPreset(preset: DatePreset): DateRange {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (preset) {
    case 'today':
      return {
        from: today.toISOString().split('T')[0],
        to: today.toISOString().split('T')[0],
      };
    case 'week': {
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      return { from: start.toISOString().split('T')[0], to: today.toISOString().split('T')[0] };
    }
    case 'month': {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: start.toISOString().split('T')[0], to: today.toISOString().split('T')[0] };
    }
    case 'quarter': {
      const q = Math.floor(today.getMonth() / 3);
      const start = new Date(today.getFullYear(), q * 3, 1);
      return { from: start.toISOString().split('T')[0], to: today.toISOString().split('T')[0] };
    }
    case 'year': {
      const start = new Date(today.getFullYear(), 0, 1);
      return { from: start.toISOString().split('T')[0], to: today.toISOString().split('T')[0] };
    }
    default:
      return { from: '', to: '' };
  }
}

function formatDateDisplay(date: string): string {
  if (!date) return '';
  const d = new Date(date + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Active-Chip helper ───────────────────────────────────────────────────────

interface ActiveChip {
  id: string;
  label: string;
  color?: string;
  onRemove: () => void;
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  // ── Date range state ──────────────────────────────────────────────────────
  const [activePreset, setActivePreset] = useState<DatePreset>('month');
  const [dateRange, setDateRange] = useState<DateRange>(getDateRangeFromPreset('month'));
  const [isLoadingData, setIsLoadingData] = useState(true);

  // ── Filter state ──────────────────────────────────────────────────────────
  const [visibleLines, setVisibleLines] = useState<VisibleLines>(DEFAULT_VISIBLE_LINES);
  const [activeOffense, setActiveOffense] = useState<OffenseCategory>(DEFAULT_OFFENSE);

  // ── Offense dropdown state ────────────────────────────────────────────────
  const [offenseOpen, setOffenseOpen] = useState(false);
  const offenseRef = useRef<HTMLDivElement>(null);

  // Close offense dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (offenseRef.current && !offenseRef.current.contains(e.target as Node)) {
        setOffenseOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── KPI state ─────────────────────────────────────────────────────────────
  const [metrics, setMetrics] = useState({
    totalRecords: 0,
    successRate: 0,
    avgVerificationTime: 0,
    activeInvestigations: 0,
    flaggedRecords: 0,
    systemUptime: 0,
  });
  const [previousMetrics, setPreviousMetrics] = useState({ ...metrics });

  const [statusOverTimeData, setStatusOverTimeData] = useState<
    Array<{ date: string; verified: number; pending: number; mismatch: number }>
  >([]);

  const sparklineData = {
    totalRecords: [3200, 3450, 3620, 3890, 4120, 4456, 4856],
    successRate: [88.5, 89.2, 90.1, 91.5, 92.8, 93.5, 94.2],
    avgVerificationTime: [4.2, 3.8, 3.5, 3.2, 2.9, 2.6, 2.4],
    activeInvestigations: [98, 102, 108, 115, 120, 125, 127],
    flaggedRecords: [28, 31, 34, 37, 40, 42, 43],
    systemUptime: [99.1, 99.3, 99.4, 99.5, 99.6, 99.7, 99.8],
  };

  // ── Data fetch on date-range change ──────────────────────────────────────
  useEffect(() => {
    setIsLoadingData(true);
    const timer = setTimeout(() => {
      setMetrics({
        totalRecords: 4856,
        successRate: 94.2,
        avgVerificationTime: 2.4,
        activeInvestigations: 127,
        flaggedRecords: 43,
        systemUptime: 99.8,
      });
      setPreviousMetrics({
        totalRecords: 4512,
        successRate: 91.5,
        avgVerificationTime: 3.1,
        activeInvestigations: 115,
        flaggedRecords: 38,
        systemUptime: 99.6,
      });

      const startDate = new Date(dateRange.from);
      const endDate = new Date(dateRange.to);
      const chartData: typeof statusOverTimeData = [];
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        chartData.push({
          date: d.toISOString().split('T')[0],
          verified: 50 + Math.floor(Math.random() * 100),
          pending: 10 + Math.floor(Math.random() * 30),
          mismatch: 2 + Math.floor(Math.random() * 8),
        });
      }
      setStatusOverTimeData(chartData);
      setIsLoadingData(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [dateRange]);

  // ── Date handlers ─────────────────────────────────────────────────────────
  const handlePresetClick = useCallback(
    (preset: DatePreset) => {
      setActivePreset(preset);
      if (preset !== 'custom') {
        const newRange = getDateRangeFromPreset(preset);
        setDateRange(newRange);
      } else {
        setDateRange({ from: '', to: '' });
      }
    },
    [],
  );

  const handleDateChange = useCallback((type: 'from' | 'to', value: string) => {
    setDateRange((prev) => ({ ...prev, [type]: value }));
    setActivePreset('custom');
  }, []);

  const handleApplyFilter = useCallback(
    (range?: DateRange) => {
      const r = range ?? dateRange;
      if (!r.from || !r.to) return;
      setIsLoadingData(true);
      setTimeout(() => setIsLoadingData(false), 800);
    },
    [dateRange],
  );

  // ── Clear all filters ─────────────────────────────────────────────────────
  const handleClearAll = useCallback(() => {
    const defaultRange = getDateRangeFromPreset('month');
    setDateRange(defaultRange);
    setActivePreset('month');
    setVisibleLines(DEFAULT_VISIBLE_LINES);
    setActiveOffense(DEFAULT_OFFENSE);
  }, []);

  // ── Status toggle ─────────────────────────────────────────────────────────
  const toggleStatus = useCallback((key: StatusKey) => {
    setVisibleLines((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // ── Compute active filter chips ────────────────────────────────────────────
  const activeChips: ActiveChip[] = [];

  // Date range chip
  if (activePreset !== 'month' || (!dateRange.from && !dateRange.to)) {
    const presetLabel = QUICK_PRESETS.find((p) => p.value === activePreset)?.label;
    if (activePreset !== 'month' && presetLabel) {
      activeChips.push({
        id: 'date-preset',
        label: `Period: ${presetLabel}`,
        onRemove: () => handlePresetClick('month'),
      });
    } else if (activePreset === 'custom' && dateRange.from && dateRange.to) {
      activeChips.push({
        id: 'date-custom',
        label: `${formatDateDisplay(dateRange.from)} → ${formatDateDisplay(dateRange.to)}`,
        onRemove: () => handlePresetClick('month'),
      });
    }
  }

  STATUS_TOGGLES.forEach(({ key, label, color }) => {
    if (!visibleLines[key]) {
      activeChips.push({
        id: `hidden-${key}`,
        label: `${label} hidden`,
        color,
        onRemove: () => setVisibleLines((prev) => ({ ...prev, [key]: true })),
      });
    }
  });

  if (activeOffense !== DEFAULT_OFFENSE) {
    activeChips.push({
      id: 'offense',
      label: `Category: ${activeOffense}`,
      onRemove: () => setActiveOffense(DEFAULT_OFFENSE),
    });
  }

  const isCustom = activePreset === 'custom';
  const hasActiveFilters =
    activePreset !== 'month' ||
    !visibleLines.verified ||
    !visibleLines.pending ||
    !visibleLines.mismatch ||
    activeOffense !== DEFAULT_OFFENSE;

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <Container maxWidth="xl" className="pt-8 pb-12">
        {/* Page Header */}
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-[#a0a9c9] text-lg">
              Monitor system performance, verification metrics, and team activity
            </p>
          </div>

          {/* Export dropdown */}
          <div className="flex-shrink-0 pt-1">
            <ExportButton
              metrics={buildAnalyticsMetrics(
                metrics,
                previousMetrics,
                {
                  totalRecords: 'Total Records Processed',
                  successRate: 'Verification Success Rate',
                  avgVerificationTime: 'Average Verification Time',
                  activeInvestigations: 'Active Investigations',
                  flaggedRecords: 'Flagged Records',
                  systemUptime: 'System Uptime',
                },
                {
                  successRate: '%',
                  avgVerificationTime: 's',
                  systemUptime: '%',
                },
                dateRange.from && dateRange.to
                  ? `${dateRange.from} to ${dateRange.to}`
                  : activePreset,
              )}
              dateFrom={dateRange.from || 'N/A'}
              dateTo={dateRange.to || 'N/A'}
              disabled={isLoadingData}
            />
          </div>
        </div>

        {/* ── Multi-Dimensional Filter Bar ──────────────────────────────── */}
        <section aria-label="Analytics filters" className="mb-8">
          <Card variant="glass" className="p-6 md:p-8">
            <div className="space-y-6">
              {/* Section header */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#14b8a6]/20 flex items-center justify-center">
                    <Filter className="w-5 h-5 text-[#14b8a6]" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Filters</h2>
                    <p className="text-sm text-[#6b7280] mt-0.5">
                      Refine charts by date, status, and category
                    </p>
                  </div>
                </div>

                {/* Clear All button */}
                {hasActiveFilters && (
                  <Button
                    variant="tertiary"
                    size="sm"
                    leftIcon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}
                    onClick={handleClearAll}
                    className="text-[#a0a9c9] hover:text-white"
                    aria-label="Clear all filters"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>

              {/* ── Row 1: Date presets ──────────────────────────────────── */}
              <div>
                <p className="text-sm font-medium text-[#a0a9c9] mb-3" id="date-preset-label">
                  Date Range
                </p>
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2"
                  role="group"
                  aria-labelledby="date-preset-label"
                >
                  {QUICK_PRESETS.map((preset) => {
                    const isActive = activePreset === preset.value;
                    return (
                      <button
                        key={preset.value}
                        onClick={() => handlePresetClick(preset.value)}
                        aria-pressed={isActive}
                        className={cn(
                          'px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200',
                          'border border-transparent focus-visible:outline-none',
                          'focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e27]',
                          isActive
                            ? 'bg-gradient-to-r from-[#14b8a6] to-[#7c3aed] text-white shadow-lg'
                            : 'bg-[#252d48] text-[#a0a9c9] hover:bg-[#3a4254] hover:text-white',
                        )}
                        style={
                          isActive
                            ? { boxShadow: '0 0 16px rgba(20,184,166,0.35)' }
                            : undefined
                        }
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Row 2: Custom date inputs ──────────────────────────── */}
              <div>
                <p className="text-sm font-medium text-[#a0a9c9] mb-3">
                  {isCustom ? 'Custom Date Range' : 'Exact Dates'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    type="date"
                    label="From Date"
                    value={dateRange.from}
                    onChange={(e) => handleDateChange('from', e.target.value)}
                    disabled={isLoadingData}
                    className="bg-[#1a1f3a] border-[#3a4254]"
                    aria-label="Start date"
                  />
                  <Input
                    type="date"
                    label="To Date"
                    value={dateRange.to}
                    onChange={(e) => handleDateChange('to', e.target.value)}
                    disabled={isLoadingData}
                    className="bg-[#1a1f3a] border-[#3a4254]"
                    aria-label="End date"
                  />
                </div>

                {dateRange.from && dateRange.to && (
                  <div className="p-3 bg-[#1a1f3a] border border-[#3a4254] rounded-lg">
                    <p className="text-sm text-[#a0a9c9]">
                      Selected:{' '}
                      <span className="text-[#14b8a6] font-medium">
                        {formatDateDisplay(dateRange.from)}
                      </span>{' '}
                      to{' '}
                      <span className="text-[#14b8a6] font-medium">
                        {formatDateDisplay(dateRange.to)}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* ── Row 3: Status toggles + Offense category ─────────────── */}
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Status multi-toggle */}
                <div className="flex-1">
                  <p
                    className="text-sm font-medium text-[#a0a9c9] mb-3"
                    id="status-filter-label"
                  >
                    Verification Status
                    <span className="ml-2 text-xs text-[#6b7280]">(toggle lines on chart)</span>
                  </p>
                  <div
                    className="flex flex-wrap gap-2"
                    role="group"
                    aria-labelledby="status-filter-label"
                  >
                    {STATUS_TOGGLES.map(({ key, label, color, glow }) => {
                      const isOn = visibleLines[key];
                      return (
                        <button
                          key={key}
                          onClick={() => toggleStatus(key)}
                          aria-pressed={isOn}
                          aria-label={`${isOn ? 'Hide' : 'Show'} ${label} line`}
                          className={cn(
                            'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
                            'border transition-all duration-200 select-none',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e27]',
                          )}
                          style={{
                            borderColor: isOn ? color : '#3a4254',
                            backgroundColor: isOn ? `${color}20` : '#1a1f3a',
                            color: isOn ? color : '#6b7280',
                            boxShadow: isOn ? `0 0 10px ${glow}` : 'none',
                            // @ts-expect-error custom CSS variable
                            '--tw-ring-color': color,
                          }}
                        >
                          {/* Color dot */}
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-200"
                            style={{ backgroundColor: isOn ? color : '#3a4254' }}
                            aria-hidden="true"
                          />
                          {label}
                          {/* Check / hidden indicator */}
                          {isOn ? (
                            <CheckCircleIcon color={color} />
                          ) : (
                            <EyeOffIcon />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Offense category dropdown */}
                <div className="sm:w-56" ref={offenseRef}>
                  <p
                    className="text-sm font-medium text-[#a0a9c9] mb-3"
                    id="offense-filter-label"
                  >
                    Offense Category
                  </p>
                  <div className="relative">
                    <button
                      onClick={() => setOffenseOpen((v) => !v)}
                      aria-haspopup="listbox"
                      aria-expanded={offenseOpen}
                      aria-labelledby="offense-filter-label"
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium',
                        'bg-[#1a1f3a] border text-left transition-all duration-200',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e27]',
                        offenseOpen
                          ? 'border-[#14b8a6] shadow-[0_0_10px_rgba(20,184,166,0.35)]'
                          : 'border-[#3a4254] hover:border-[#5a6274]',
                        activeOffense !== DEFAULT_OFFENSE
                          ? 'text-[#14b8a6]'
                          : 'text-[#a0a9c9]',
                      )}
                    >
                      <span>{activeOffense}</span>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          offenseOpen ? 'rotate-180' : 'rotate-0',
                        )}
                        aria-hidden="true"
                      />
                    </button>

                    {/* Dropdown list */}
                    {offenseOpen && (
                      <ul
                        role="listbox"
                        aria-labelledby="offense-filter-label"
                        className={cn(
                          'absolute z-50 mt-1 w-full rounded-lg overflow-hidden',
                          'bg-[#1a1f3a] border border-[#3a4254]',
                          'shadow-[0_8px_24px_rgba(0,0,0,0.5)]',
                          'backdrop-blur-xl',
                        )}
                      >
                        {OFFENSE_CATEGORIES.map((cat) => {
                          const isSelected = activeOffense === cat;
                          return (
                            <li
                              key={cat}
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => {
                                setActiveOffense(cat);
                                setOffenseOpen(false);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setActiveOffense(cat);
                                  setOffenseOpen(false);
                                }
                              }}
                              tabIndex={0}
                              className={cn(
                                'px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between',
                                'transition-colors duration-150',
                                'focus-visible:outline-none focus-visible:bg-[#252d48]',
                                isSelected
                                  ? 'bg-[#14b8a6]/15 text-[#14b8a6] font-medium'
                                  : 'text-[#a0a9c9] hover:bg-[#252d48] hover:text-white',
                              )}
                            >
                              {cat}
                              {isSelected && (
                                <span aria-hidden="true" className="text-[#14b8a6]">
                                  ✓
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Active filter chips ────────────────────────────────── */}
              {activeChips.length > 0 && (
                <div
                  className="pt-4 border-t border-[rgba(255,255,255,0.08)]"
                  role="region"
                  aria-label="Active filters"
                >
                  <p className="text-xs text-[#6b7280] mb-2 font-medium uppercase tracking-wide">
                    Active Filters
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeChips.map((chip) => (
                      <span
                        key={chip.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200"
                        style={{
                          backgroundColor: chip.color ? `${chip.color}15` : 'rgba(20,184,166,0.1)',
                          borderColor: chip.color ? `${chip.color}50` : 'rgba(20,184,166,0.3)',
                          color: chip.color ?? '#14b8a6',
                        }}
                      >
                        {chip.label}
                        <button
                          onClick={chip.onRemove}
                          aria-label={`Remove filter: ${chip.label}`}
                          className={cn(
                            'ml-0.5 rounded-full p-0.5 transition-opacity duration-150',
                            'hover:opacity-100 opacity-70',
                            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current',
                          )}
                        >
                          <X className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Apply / Reset action row ──────────────────────────── */}
              <div className="flex gap-3 justify-end pt-2 border-t border-[rgba(255,255,255,0.06)]">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleClearAll}
                  disabled={isLoadingData}
                  aria-label="Reset all filters to defaults"
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  loading={isLoadingData}
                  onClick={() => handleApplyFilter()}
                  disabled={!dateRange.from || !dateRange.to}
                >
                  Apply Filter
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
        {/* analytics-print-region: targeted by the PDF print stylesheet */}
        <div id="analytics-print-region">

          {/* Print-only header (hidden on screen, shown when printing) */}
          <div className="print-header" style={{ display: 'none' }}>
            <div className="print-logo">CRDVS — Criminal Record Digital Verification System</div>
            <div className="print-meta">
              <div>Analytics Report</div>
              <div>
                Period:{' '}
                {dateRange.from && dateRange.to
                  ? `${dateRange.from} to ${dateRange.to}`
                  : activePreset}
              </div>
              <div>Generated: {new Date().toLocaleString()}</div>
            </div>
          </div>

          <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Key Performance Indicators</h2>
          <Grid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
            <div className="animate-card-fadeIn" style={{ animationDelay: '0s' }}>
              <StatCard
                title="Total Records Processed"
                value={metrics.totalRecords}
                previousValue={previousMetrics.totalRecords}
                icon={<FileCheck className="w-5 h-5" />}
                variant="default"
                sparklineData={sparklineData.totalRecords}
                loading={isLoadingData}
                description="Records verified this period"
                className="h-full"
              />
            </div>
            <div className="animate-card-fadeIn" style={{ animationDelay: '0.1s' }}>
              <StatCard
                title="Verification Success Rate"
                value={metrics.successRate}
                previousValue={previousMetrics.successRate}
                suffix="%"
                icon={<CheckCircle className="w-5 h-5" />}
                variant="success"
                sparklineData={sparklineData.successRate}
                loading={isLoadingData}
                description="Successful verifications"
                className="h-full"
              />
            </div>
            <div className="animate-card-fadeIn" style={{ animationDelay: '0.2s' }}>
              <StatCard
                title="Average Verification Time"
                value={metrics.avgVerificationTime}
                previousValue={previousMetrics.avgVerificationTime}
                suffix="s"
                icon={<Clock className="w-5 h-5" />}
                variant="info"
                sparklineData={sparklineData.avgVerificationTime}
                loading={isLoadingData}
                description="Average seconds per verification"
                className="h-full"
              />
            </div>
            <div className="animate-card-fadeIn" style={{ animationDelay: '0.3s' }}>
              <StatCard
                title="Active Investigations"
                value={metrics.activeInvestigations}
                previousValue={previousMetrics.activeInvestigations}
                icon={<AlertTriangle className="w-5 h-5" />}
                variant="warning"
                sparklineData={sparklineData.activeInvestigations}
                loading={isLoadingData}
                description="Ongoing investigation cases"
                className="h-full"
              />
            </div>
            <div className="animate-card-fadeIn" style={{ animationDelay: '0.4s' }}>
              <StatCard
                title="Flagged Records"
                value={metrics.flaggedRecords}
                previousValue={previousMetrics.flaggedRecords}
                icon={<Flag className="w-5 h-5" />}
                variant="danger"
                sparklineData={sparklineData.flaggedRecords}
                loading={isLoadingData}
                description="Records requiring manual review"
                className="h-full"
              />
            </div>
            <div className="animate-card-fadeIn" style={{ animationDelay: '0.5s' }}>
              <StatCard
                title="System Uptime"
                value={metrics.systemUptime}
                previousValue={previousMetrics.systemUptime}
                suffix="%"
                icon={<Signal className="w-5 h-5" />}
                variant="success"
                sparklineData={sparklineData.systemUptime}
                loading={isLoadingData}
                description="System availability percentage"
                className="h-full"
              />
            </div>
          </Grid>
        </div>

        {/* ── Charts ────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Chart 1 – Verification Funnel placeholder */}
          <Card variant="glass" className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Verification Funnel</h3>
              <p className="text-sm text-[#6b7280] mt-1">
                {activeOffense !== DEFAULT_OFFENSE ? `Category: ${activeOffense}` : 'Submitted → Verified'}
              </p>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-[#14b8a6]/20 flex items-center justify-center mx-auto mb-2">
                  <div className="w-8 h-8 border-2 border-[#14b8a6] border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-[#6b7280] text-sm">
                  {isLoadingData ? 'Loading chart…' : 'Select a date range to view data'}
                </p>
              </div>
            </div>
          </Card>

          {/* Chart 2 – Status Over Time */}
          <Card variant="glass" className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">
                Verification Status Over Time
              </h3>
              <p className="text-sm text-[#6b7280] mt-1">
                {dateRange.from && dateRange.to
                  ? `${formatDateDisplay(dateRange.from)} to ${formatDateDisplay(dateRange.to)}`
                  : 'Select a date range'}
              </p>
            </div>

            {isLoadingData ? (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-lg bg-[#7c3aed]/20 flex items-center justify-center mx-auto mb-2">
                    <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-[#6b7280] text-sm">Loading chart…</p>
                </div>
              </div>
            ) : statusOverTimeData.length > 0 ? (
              <StatusOverTimeChart
                data={statusOverTimeData}
                height={300}
                showGrid={true}
                animationDuration={800}
                visibleLines={visibleLines}
              />
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-[#6b7280] text-sm">
                  No data available for selected range
                </p>
              </div>
            )}
          </Card>
        </div>

        </div> {/* end #analytics-print-region */}

        {/* ── Officer Performance placeholder ─────────────────────────────── */}
        <div className="mb-8">
          <Card variant="glass" className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Officer Performance</h3>
              <p className="text-sm text-[#6b7280] mt-1">Team metrics and statistics</p>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-[#10b981]/20 flex items-center justify-center mx-auto mb-2">
                  <div className="w-8 h-8 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-[#6b7280] text-sm">
                  {isLoadingData ? 'Loading table…' : 'Select a date range to view data'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-[#6b7280]">
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
      </Container>

      <style jsx>{`
        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-card-fadeIn {
          animation: cardFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </main>
  );
}

// ─── Tiny inline SVG icons (avoids additional dependencies) ──────────────────

function CheckCircleIcon({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6b7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
