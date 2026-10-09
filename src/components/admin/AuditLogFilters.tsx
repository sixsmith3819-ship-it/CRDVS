'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search, X, SlidersHorizontal, Shield } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuditLogFiltersState = {
  search: string;
  actionType: string;
  role: string;
  startDate: string;
  endDate: string;
  sensitiveOnly: boolean;
};

interface AuditLogFiltersProps {
  filters: AuditLogFiltersState;
  onChange: (filters: AuditLogFiltersState) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTION_PILLS: { value: string; label: string; activeClasses: string }[] = [
  {
    value: '',
    label: 'All',
    activeClasses:
      'bg-[rgba(20,184,166,0.18)] text-[#5eead4] border-[rgba(20,184,166,0.4)]',
  },
  {
    value: 'create',
    label: 'Create',
    activeClasses:
      'bg-[rgba(16,185,129,0.18)] text-[#6ee7b7] border-[rgba(16,185,129,0.4)]',
  },
  {
    value: 'update',
    label: 'Update',
    activeClasses:
      'bg-[rgba(20,184,166,0.18)] text-[#5eead4] border-[rgba(20,184,166,0.4)]',
  },
  {
    value: 'delete',
    label: 'Delete',
    activeClasses:
      'bg-[rgba(220,38,38,0.18)] text-[#fca5a5] border-[rgba(220,38,38,0.4)]',
  },
  {
    value: 'verify',
    label: 'Verify',
    activeClasses:
      'bg-[rgba(124,58,237,0.18)] text-[#d8b4fe] border-[rgba(124,58,237,0.4)]',
  },
  {
    value: 'export',
    label: 'Export',
    activeClasses:
      'bg-[rgba(245,158,11,0.18)] text-[#fcd34d] border-[rgba(245,158,11,0.4)]',
  },
];

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'administrator', label: 'Administrator' },
  { value: 'police_officer', label: 'Police Officer' },
  { value: 'court_officer', label: 'Court Officer' },
  { value: 'prison_officer', label: 'Prison Officer' },
];

// ─── Shared input style ────────────────────────────────────────────────────────

const INPUT_CLS = cn(
  'w-full px-3 py-2 rounded-lg text-sm',
  'bg-[rgba(255,255,255,0.05)] text-white placeholder-[#6b7280]',
  'border border-[rgba(255,255,255,0.1)]',
  'focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] outline-none',
  'transition-all duration-200'
);

// ─── Component ────────────────────────────────────────────────────────────────

export function AuditLogFilters({ filters, onChange }: AuditLogFiltersProps) {
  // Local state for the search input so we can debounce it
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync localSearch when filters.search is reset externally (e.g. "Clear All")
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  // 300 ms debounce on the search field
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (localSearch !== filters.search) {
        onChange({ ...filters, search: localSearch });
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  function set<K extends keyof AuditLogFiltersState>(
    key: K,
    value: AuditLogFiltersState[K]
  ) {
    onChange({ ...filters, [key]: value });
  }

  function clearAll() {
    setLocalSearch('');
    onChange({
      search: '',
      actionType: '',
      role: '',
      startDate: '',
      endDate: '',
      sensitiveOnly: false,
    });
  }

  // Build active-filter chip list (excludes search — it's inline in the input)
  type Chip = { key: keyof AuditLogFiltersState; label: string };
  const chips: Chip[] = [];

  if (filters.actionType) {
    const pill = ACTION_PILLS.find((p) => p.value === filters.actionType);
    chips.push({ key: 'actionType', label: `Action: ${pill?.label ?? filters.actionType}` });
  }
  if (filters.role) {
    const opt = ROLE_OPTIONS.find((o) => o.value === filters.role);
    chips.push({ key: 'role', label: `Role: ${opt?.label ?? filters.role}` });
  }
  if (filters.startDate) {
    chips.push({ key: 'startDate', label: `From: ${filters.startDate}` });
  }
  if (filters.endDate) {
    chips.push({ key: 'endDate', label: `To: ${filters.endDate}` });
  }
  if (filters.sensitiveOnly) {
    chips.push({ key: 'sensitiveOnly', label: 'Sensitive only' });
  }

  const hasActiveFilters =
    !!filters.search ||
    !!filters.actionType ||
    !!filters.role ||
    !!filters.startDate ||
    !!filters.endDate ||
    filters.sensitiveOnly;

  function dismissChip(key: keyof AuditLogFiltersState) {
    const reset: Partial<AuditLogFiltersState> =
      key === 'sensitiveOnly' ? { sensitiveOnly: false } : { [key]: '' };
    if (key === 'search') setLocalSearch('');
    onChange({ ...filters, ...reset });
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <section
      aria-label="Audit log filters"
      className={cn(
        'rounded-2xl border',
        'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.09)]',
        'backdrop-blur-md',
        'overflow-hidden'
      )}
    >
      {/* ── Controls grid ────────────────────────────────────────────────── */}
      <div className="px-5 py-4 space-y-4">

        {/* Row 1 — Search */}
        <div>
          <label htmlFor="audit-search" className="sr-only">
            Search audit log
          </label>
          <div className="relative">
            <Search
              size={15}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none"
            />
            <input
              id="audit-search"
              type="search"
              placeholder="Search user, description, record ID, IP…"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className={cn(INPUT_CLS, 'pl-9 pr-3')}
              aria-label="Search audit log entries"
            />
            {localSearch && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setLocalSearch('');
                  onChange({ ...filters, search: '' });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-white transition-colors duration-150"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Row 2 — Action type pills */}
        <fieldset>
          <legend className="text-xs font-semibold text-[#a0a9c9] mb-2 flex items-center gap-1.5">
            <SlidersHorizontal size={12} aria-hidden="true" />
            Action Type
          </legend>
          <div
            role="group"
            aria-label="Filter by action type"
            className="flex flex-wrap gap-2"
          >
            {ACTION_PILLS.map(({ value, label, activeClasses }) => {
              const isActive = filters.actionType === value;
              return (
                <button
                  key={value || 'all'}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => set('actionType', value)}
                  className={cn(
                    'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                    isActive
                      ? activeClasses
                      : 'bg-[rgba(255,255,255,0.04)] text-[#a0a9c9] border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white'
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Row 3 — Role + Date range + Sensitive toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* Role dropdown */}
          <div>
            <label
              htmlFor="audit-role"
              className="block text-xs font-medium text-[#a0a9c9] mb-1.5 flex items-center gap-1"
            >
              <Shield size={11} aria-hidden="true" />
              Role
            </label>
            <select
              id="audit-role"
              value={filters.role}
              onChange={(e) => set('role', e.target.value)}
              aria-label="Filter by role"
              className={cn(
                INPUT_CLS,
                // native select needs explicit text colour in dark background
                '[&>option]:bg-[#1a1f3a] [&>option]:text-white'
              )}
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* From date */}
          <div>
            <label
              htmlFor="audit-start-date"
              className="block text-xs font-medium text-[#a0a9c9] mb-1.5"
            >
              From
            </label>
            <input
              id="audit-start-date"
              type="date"
              value={filters.startDate}
              max={filters.endDate || undefined}
              onChange={(e) => set('startDate', e.target.value)}
              aria-label="Filter from date"
              className={cn(
                INPUT_CLS,
                // date-picker icon inherits text colour in WebKit
                '[color-scheme:dark]'
              )}
            />
          </div>

          {/* To date */}
          <div>
            <label
              htmlFor="audit-end-date"
              className="block text-xs font-medium text-[#a0a9c9] mb-1.5"
            >
              To
            </label>
            <input
              id="audit-end-date"
              type="date"
              value={filters.endDate}
              min={filters.startDate || undefined}
              onChange={(e) => set('endDate', e.target.value)}
              aria-label="Filter to date"
              className={cn(INPUT_CLS, '[color-scheme:dark]')}
            />
          </div>

          {/* Sensitive-only toggle */}
          <div className="flex items-end pb-0.5">
            <label
              htmlFor="audit-sensitive-only"
              className={cn(
                'flex items-center gap-3 w-full cursor-pointer',
                'select-none'
              )}
            >
              {/* Toggle track */}
              <span
                className={cn(
                  'relative inline-flex flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200',
                  filters.sensitiveOnly
                    ? 'bg-[rgba(220,38,38,0.6)] border border-[rgba(220,38,38,0.6)]'
                    : 'bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.15)]'
                )}
                aria-hidden="true"
              >
                <span
                  className={cn(
                    'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
                    filters.sensitiveOnly ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </span>
              <input
                id="audit-sensitive-only"
                type="checkbox"
                role="switch"
                checked={filters.sensitiveOnly}
                onChange={(e) => set('sensitiveOnly', e.target.checked)}
                aria-label="Show sensitive entries only"
                className="sr-only"
              />
              <span className="text-xs font-medium text-[#a0a9c9] leading-tight">
                Sensitive
                <br />
                <span className="text-[#6b7280] font-normal">only</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* ── Active filter chips ──────────────────────────────────────────────── */}
      {(chips.length > 0 || filters.search) && (
        <div
          aria-label="Active filters"
          className="px-5 py-3 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] flex flex-wrap items-center gap-2"
        >
          {/* Search chip */}
          {filters.search && (
            <Chip
              label={`Search: "${filters.search}"`}
              onDismiss={() => dismissChip('search')}
            />
          )}

          {/* Other chips */}
          {chips.map(({ key, label }) => (
            <Chip key={key} label={label} onDismiss={() => dismissChip(key)} />
          ))}

          {/* Clear All */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className={cn(
                'ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium',
                'bg-[rgba(220,38,38,0.08)] text-[#fca5a5] border border-[rgba(220,38,38,0.2)]',
                'hover:bg-[rgba(220,38,38,0.16)] hover:border-[rgba(220,38,38,0.35)]',
                'transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]'
              )}
              aria-label="Clear all filters"
            >
              <X size={12} />
              Clear All
            </button>
          )}
        </div>
      )}
    </section>
  );
}

// ─── Chip sub-component ────────────────────────────────────────────────────────

function Chip({
  label,
  onDismiss,
}: {
  label: string;
  onDismiss: () => void;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        'bg-[rgba(20,184,166,0.1)] text-[#5eead4] border border-[rgba(20,184,166,0.25)]'
      )}
    >
      {label}
      <button
        type="button"
        onClick={onDismiss}
        aria-label={`Remove filter: ${label}`}
        className={cn(
          'inline-flex items-center justify-center w-3.5 h-3.5 rounded-full',
          'hover:bg-[rgba(20,184,166,0.3)] transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#14b8a6]'
        )}
      >
        <X size={9} aria-hidden="true" />
      </button>
    </span>
  );
}
