'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/cn';
import { Layout } from '@/components/layout/Layout';
import { ChangeDetails } from '@/components/audit/ChangeDetails';
import {
  ChevronDown,
  Filter,
  Download,
  Clock,
  User,
  List,
  GitBranch,
  Search,
  RotateCcw,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import type { AuditLog, AuditAction } from '@/types/database';

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = 'table' | 'timeline';

interface Filters {
  actionType: AuditAction | '';
  user: string;
  startDate: string;
  endDate: string;
  search: string;
}

// ─── Mock data (used when the API is not yet seeded) ─────────────────────────

const MOCK_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    user_id: 'off-001',
    user_role: 'police_officer',
    action: 'update',
    table_name: 'criminal_records',
    record_id: 'rec-001',
    old_values: { full_name: 'John Thompson', risk_level: 2, status: 'active' },
    new_values: { full_name: 'John Michael Thompson', risk_level: 3, status: 'active' },
    ip_address: '192.168.1.101',
    user_agent: 'Mozilla/5.0',
    session_id: 'sess-001',
    description: 'Updated full name and risk level',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'log-2',
    user_id: 'off-002',
    user_role: 'administrator',
    action: 'create',
    table_name: 'criminal_records',
    record_id: 'rec-002',
    old_values: null,
    new_values: { full_name: 'Alice Moyo', national_id_number: '12-345678A90', risk_level: 1 },
    ip_address: '192.168.1.102',
    user_agent: 'Mozilla/5.0',
    session_id: 'sess-002',
    description: 'Created new criminal record',
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'log-3',
    user_id: 'off-001',
    user_role: 'police_officer',
    action: 'verify',
    table_name: 'verification_reports',
    record_id: 'rec-001',
    old_values: null,
    new_values: null,
    ip_address: '192.168.1.101',
    user_agent: 'Mozilla/5.0',
    session_id: 'sess-001',
    description: 'Identity verification completed — confidence 94%',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'log-4',
    user_id: 'off-003',
    user_role: 'court_officer',
    action: 'delete',
    table_name: 'duplicate_flags',
    record_id: 'dup-009',
    old_values: { status: 'pending_review', similarity_score: 0.87 },
    new_values: null,
    ip_address: '10.0.0.55',
    user_agent: 'Mozilla/5.0',
    session_id: 'sess-003',
    description: 'Removed duplicate flag (false positive)',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'log-5',
    user_id: 'off-002',
    user_role: 'administrator',
    action: 'update',
    table_name: 'users',
    record_id: 'usr-007',
    old_values: {
      role: 'police_officer',
      department: 'Traffic',
      is_active: true,
    },
    new_values: {
      role: 'court_officer',
      department: 'Criminal Division',
      is_active: true,
    },
    ip_address: '192.168.1.102',
    user_agent: 'Mozilla/5.0',
    session_id: 'sess-002',
    description: "Updated officer's role and department assignment",
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: 'log-6',
    user_id: 'off-001',
    user_role: 'police_officer',
    action: 'export',
    table_name: 'criminal_records',
    record_id: 'rec-001',
    old_values: null,
    new_values: null,
    ip_address: '192.168.1.101',
    user_agent: 'Mozilla/5.0',
    session_id: 'sess-001',
    description: 'Exported record to PDF',
    created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
  {
    id: 'log-7',
    user_id: 'off-004',
    user_role: 'police_officer',
    action: 'flag_duplicate',
    table_name: 'criminal_records',
    record_id: 'rec-003',
    old_values: null,
    new_values: { flagged_record_id: 'rec-001', similarity_score: 0.92, status: 'pending_review' },
    ip_address: '10.0.0.72',
    user_agent: 'Mozilla/5.0',
    session_id: 'sess-004',
    description: 'Flagged record as potential duplicate (similarity 92%)',
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
  {
    id: 'log-8',
    user_id: 'system',
    user_role: null,
    action: 'update',
    table_name: 'criminal_records',
    record_id: 'rec-004',
    old_values: { sentence_status: 'serving', release_date: null },
    new_values: { sentence_status: 'released', release_date: new Date().toISOString().split('T')[0] },
    ip_address: null,
    user_agent: null,
    session_id: null,
    description: 'Automated sentence status update — prisoner released',
    created_at: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ACTION_STYLES: Record<
  AuditAction,
  { bg: string; text: string; label: string; dot: string }
> = {
  create:           { bg: 'bg-[rgba(16,185,129,0.12)]',  text: 'text-[#86efac]', label: 'Created',  dot: 'bg-[rgba(16,185,129,0.6)]'  },
  update:           { bg: 'bg-[rgba(20,184,166,0.12)]',  text: 'text-[#7dd3fc]', label: 'Updated',  dot: 'bg-[rgba(20,184,166,0.6)]'  },
  delete:           { bg: 'bg-[rgba(220,38,38,0.12)]',   text: 'text-[#fca5a5]', label: 'Deleted',  dot: 'bg-[rgba(220,38,38,0.6)]'   },
  read:             { bg: 'bg-[rgba(148,163,184,0.12)]', text: 'text-[#cbd5e1]', label: 'Viewed',   dot: 'bg-[rgba(148,163,184,0.5)]' },
  verify:           { bg: 'bg-[rgba(124,58,237,0.12)]',  text: 'text-[#d8b4fe]', label: 'Verified', dot: 'bg-[rgba(124,58,237,0.6)]'  },
  generate_report:  { bg: 'bg-[rgba(79,70,229,0.12)]',   text: 'text-[#a5b4fc]', label: 'Report',   dot: 'bg-[rgba(79,70,229,0.6)]'   },
  flag_duplicate:   { bg: 'bg-[rgba(245,158,11,0.12)]',  text: 'text-[#fcd34d]', label: 'Flagged',  dot: 'bg-[rgba(245,158,11,0.6)]'  },
  resolve_duplicate:{ bg: 'bg-[rgba(34,197,94,0.12)]',   text: 'text-[#86efac]', label: 'Resolved', dot: 'bg-[rgba(34,197,94,0.6)]'   },
  export:           { bg: 'bg-[rgba(59,130,246,0.12)]',  text: 'text-[#93c5fd]', label: 'Exported', dot: 'bg-[rgba(59,130,246,0.6)]'  },
  login:            { bg: 'bg-[rgba(34,197,94,0.12)]',   text: 'text-[#86efac]', label: 'Login',    dot: 'bg-[rgba(34,197,94,0.6)]'   },
  logout:           { bg: 'bg-[rgba(148,163,184,0.12)]', text: 'text-[#cbd5e1]', label: 'Logout',   dot: 'bg-[rgba(148,163,184,0.5)]' },
};

const SENSITIVE_ACTIONS: AuditAction[] = ['delete', 'flag_duplicate', 'export'];

function isSensitive(action: AuditAction) {
  return SENSITIVE_ACTIONS.includes(action);
}

function actionStyle(action: AuditAction) {
  return ACTION_STYLES[action] ?? ACTION_STYLES.read;
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * ActionBadge — Pill badge for the action type.
 */
function ActionBadge({ action }: { action: AuditAction }) {
  const s = actionStyle(action);
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        s.bg, s.text
      )}
    >
      {s.label}
    </span>
  );
}

/**
 * SensitiveBadge — Small warning indicator for sensitive actions.
 */
function SensitiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[rgba(220,38,38,0.15)] text-[#fca5a5]">
      <AlertTriangle size={10} aria-hidden="true" />
      Sensitive
    </span>
  );
}

// ─── Table row ────────────────────────────────────────────────────────────────

interface TableRowProps {
  log: AuditLog;
  isExpanded: boolean;
  onToggle: () => void;
}

function TableRow({ log, isExpanded, onToggle }: TableRowProps) {
  const sensitive = isSensitive(log.action);
  const hasChanges = log.action === 'update' && (log.old_values || log.new_values);

  return (
    <>
      {/* Main row */}
      <tr
        className={cn(
          'border-b border-[rgba(255,255,255,0.06)] transition-colors duration-150',
          sensitive
            ? 'bg-[rgba(220,38,38,0.04)] hover:bg-[rgba(220,38,38,0.08)]'
            : 'hover:bg-[rgba(255,255,255,0.04)]'
        )}
      >
        {/* Timestamp */}
        <td className="px-4 py-3 text-xs text-[#a0a9c9] whitespace-nowrap">
          <div className="flex flex-col gap-0.5">
            <time>{formatTimestamp(log.created_at)}</time>
            <span className="text-[#6b7280]">{timeAgo(log.created_at)}</span>
          </div>
        </td>

        {/* User */}
        <td className="px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-white font-mono">
              {log.user_id ? log.user_id.substring(0, 12) + '…' : 'System'}
            </span>
            {log.user_role && (
              <span className="text-xs text-[#6b7280] capitalize">
                {log.user_role.replace(/_/g, ' ')}
              </span>
            )}
          </div>
        </td>

        {/* Action */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <ActionBadge action={log.action} />
            {sensitive && <SensitiveBadge />}
          </div>
        </td>

        {/* Details */}
        <td className="px-4 py-3 max-w-xs">
          <div className="flex flex-col gap-1">
            {log.table_name && (
              <span className="text-xs font-mono text-[#6b7280]">{log.table_name}</span>
            )}
            {log.description && (
              <span className="text-xs text-[#a0a9c9] line-clamp-2">{log.description}</span>
            )}
          </div>
        </td>

        {/* Expand button — only for update rows with changes */}
        <td className="px-4 py-3 text-right">
          {hasChanges ? (
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse changes' : 'Expand changes'}
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md',
                'text-xs font-medium transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                isExpanded
                  ? 'bg-[rgba(20,184,166,0.15)] text-[#86efac] border border-[rgba(20,184,166,0.3)]'
                  : 'bg-[rgba(255,255,255,0.06)] text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)]'
              )}
            >
              <ChevronDown
                size={12}
                className={cn('transition-transform duration-200', isExpanded && 'rotate-180')}
                aria-hidden="true"
              />
              {isExpanded ? 'Hide' : 'Changes'}
            </button>
          ) : (
            <span className="text-xs text-[#374151]">—</span>
          )}
        </td>
      </tr>

      {/* Sub-row with ChangeDetails — full-width colspan */}
      {isExpanded && hasChanges && (
        <tr
          className={cn(
            'border-b border-[rgba(255,255,255,0.06)]',
            'bg-[rgba(20,184,166,0.03)]'
          )}
        >
          <td colSpan={5} className="px-6 py-4">
            <ChangeDetails
              oldValues={log.old_values ?? undefined}
              newValues={log.new_values ?? undefined}
              action={log.action}
              defaultOpen={true}
            />
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Timeline entry ───────────────────────────────────────────────────────────

interface TimelineEntryProps {
  log: AuditLog;
  isLast: boolean;
  isVisible: boolean;
  index: number;
}

function TimelineEntry({ log, isLast, isVisible, index }: TimelineEntryProps) {
  const s = actionStyle(log.action);
  const sensitive = isSensitive(log.action);
  const hasChanges = log.action === 'update' && (log.old_values || log.new_values);

  return (
    <div
      data-timeline-id={log.id}
      className={cn(
        'relative pl-10 transition-all',
        !isVisible && 'opacity-0 translate-x-[-16px]',
        isVisible && 'opacity-100 translate-x-0',
        'duration-300 ease-out'
      )}
      style={{ transitionDelay: isVisible ? `${index * 60}ms` : '0ms' }}
    >
      {/* Vertical connecting line */}
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-[rgba(255,255,255,0.07)]" aria-hidden="true" />
      )}

      {/* Node dot */}
      <div
        className={cn(
          'absolute left-1.5 top-3 w-4 h-4 rounded-full',
          'ring-4 ring-[#0d1117]',
          s.dot
        )}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        className={cn(
          'mb-4 rounded-lg border overflow-hidden',
          'bg-[rgba(255,255,255,0.03)]',
          'backdrop-blur-sm',
          sensitive
            ? 'border-[rgba(220,38,38,0.25)]'
            : 'border-[rgba(255,255,255,0.1)]',
          'transition-shadow duration-200 hover:shadow-[0_0_16px_rgba(20,184,166,0.08)]'
        )}
      >
        {/* Header row */}
        <div className="px-4 py-3 flex items-start gap-3 flex-wrap">
          <ActionBadge action={log.action} />
          {sensitive && <SensitiveBadge />}

          <div className="ml-auto flex items-center gap-2 text-xs text-[#6b7280]">
            <Clock size={12} aria-hidden="true" />
            <time title={formatTimestamp(log.created_at)}>{timeAgo(log.created_at)}</time>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 pb-3 space-y-2">
          {/* User + IP */}
          <div className="flex items-center gap-3 flex-wrap text-xs text-[#a0a9c9]">
            <span className="inline-flex items-center gap-1">
              <User size={12} aria-hidden="true" />
              {log.user_id ?? 'System'}
            </span>
            {log.ip_address && (
              <span className="font-mono">{log.ip_address}</span>
            )}
            {log.table_name && (
              <span className="font-mono text-[#6b7280]">{log.table_name}</span>
            )}
          </div>

          {/* Description */}
          {log.description && (
            <p className="text-sm text-[#a0a9c9]">{log.description}</p>
          )}

          {/* ChangeDetails — appears directly below the entry, no extra wrapping */}
          {hasChanges && (
            <div className="pt-1">
              <ChangeDetails
                oldValues={log.old_values ?? undefined}
                newValues={log.new_values ?? undefined}
                action={log.action}
                defaultOpen={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const EMPTY_FILTERS: Filters = {
  actionType: '',
  user: '',
  startDate: '',
  endDate: '',
  search: '',
};

export default function AuditLogsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemsPerPage = 10;

  // ── Filter logic ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return MOCK_LOGS.filter((log) => {
      if (filters.actionType && log.action !== filters.actionType) return false;
      if (filters.user && !(log.user_id ?? '').toLowerCase().includes(filters.user.toLowerCase())) return false;
      if (filters.startDate && new Date(log.created_at) < new Date(filters.startDate)) return false;
      if (filters.endDate && new Date(log.created_at) > new Date(filters.endDate + 'T23:59:59')) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const haystack = [
          log.description ?? '',
          log.record_id ?? '',
          log.table_name ?? '',
          log.user_id ?? '',
        ].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [filters]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filtered, currentPage]
  );

  // Reset pagination on filter change
  useEffect(() => { setCurrentPage(1); }, [filters]);

  // ── Intersection Observer for timeline animations ─────────────────────────
  useEffect(() => {
    if (viewMode !== 'timeline') return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.timelineId;
            if (id) setVisibleIds((p) => new Set([...p, id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '60px' }
    );
    return () => observerRef.current?.disconnect();
  }, [viewMode]);

  useEffect(() => {
    if (!observerRef.current || viewMode !== 'timeline') return;
    const items = document.querySelectorAll('[data-timeline-id]');
    items.forEach((el) => observerRef.current?.observe(el));
    return () => items.forEach((el) => observerRef.current?.unobserve(el));
  }, [paginated, viewMode]);

  // ── Export ────────────────────────────────────────────────────────────────
  const exportCSV = useCallback(() => {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Table', 'Record ID', 'Description'];
    const rows = filtered.map((l) => [
      formatTimestamp(l.created_at),
      l.user_id ?? 'System',
      l.user_role ?? '-',
      l.action,
      l.table_name ?? '-',
      l.record_id ?? '-',
      l.description ?? '-',
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: `audit-logs-${new Date().toISOString().split('T')[0]}.csv`,
    });
    a.click();
  }, [filtered]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <Layout>
      <div className="py-6 space-y-6 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
            <p className="text-sm text-[#a0a9c9] mt-1">
              {filtered.length} entr{filtered.length !== 1 ? 'ies' : 'y'} — immutable system activity record
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View toggle */}
            <div
              className="inline-flex rounded-lg overflow-hidden border border-[rgba(255,255,255,0.1)]"
              role="group"
              aria-label="View mode"
            >
              {(['table', 'timeline'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  aria-pressed={viewMode === mode}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                    viewMode === mode
                      ? 'bg-[rgba(20,184,166,0.2)] text-[#86efac]'
                      : 'bg-[rgba(255,255,255,0.04)] text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.08)]'
                  )}
                >
                  {mode === 'table' ? <List size={13} aria-hidden="true" /> : <GitBranch size={13} aria-hidden="true" />}
                  {mode === 'table' ? 'Table' : 'Timeline'}
                </button>
              ))}
            </div>

            {/* Filter button */}
            <button
              type="button"
              onClick={() => setShowFilters((p) => !p)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium',
                'border transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                showFilters
                  ? 'bg-[rgba(20,184,166,0.15)] text-[#86efac] border-[rgba(20,184,166,0.3)]'
                  : 'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.1)] border-[rgba(255,255,255,0.1)]'
              )}
            >
              <Filter size={13} aria-hidden="true" />
              Filter
              {activeFilterCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#14b8a6] text-black text-[10px] font-bold leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Export CSV */}
            <button
              type="button"
              onClick={exportCSV}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium',
                'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.1)]',
                'border border-[rgba(255,255,255,0.1)] transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]'
              )}
              title="Export filtered results as CSV"
            >
              <Download size={13} aria-hidden="true" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* ── Filters panel ────────────────────────────────────────────────── */}
        {showFilters && (
          <div
            className={cn(
              'p-4 rounded-lg space-y-4',
              'bg-[rgba(255,255,255,0.04)]',
              'border border-[rgba(255,255,255,0.1)]',
              'backdrop-blur-sm'
            )}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {/* Search */}
              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-xs font-medium text-[#a0a9c9] mb-1.5">Search</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Record ID, description…"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className={cn(
                      'w-full pl-8 pr-3 py-2 rounded-lg text-xs',
                      'bg-[rgba(255,255,255,0.05)] text-white placeholder-[#6b7280]',
                      'border border-[rgba(255,255,255,0.1)]',
                      'focus:outline-none focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6]',
                      'transition-colors duration-150'
                    )}
                  />
                </div>
              </div>

              {/* Action type */}
              <div>
                <label className="block text-xs font-medium text-[#a0a9c9] mb-1.5">Action</label>
                <select
                  value={filters.actionType}
                  onChange={(e) => setFilters({ ...filters, actionType: e.target.value as AuditAction | '' })}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg text-xs',
                    'bg-[rgba(255,255,255,0.05)] text-white',
                    'border border-[rgba(255,255,255,0.1)]',
                    'focus:outline-none focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6]',
                    'transition-colors duration-150'
                  )}
                >
                  <option value="">All actions</option>
                  {Object.entries(ACTION_STYLES).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* User */}
              <div>
                <label className="block text-xs font-medium text-[#a0a9c9] mb-1.5">User ID</label>
                <input
                  type="text"
                  placeholder="Filter by user…"
                  value={filters.user}
                  onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg text-xs',
                    'bg-[rgba(255,255,255,0.05)] text-white placeholder-[#6b7280]',
                    'border border-[rgba(255,255,255,0.1)]',
                    'focus:outline-none focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6]',
                    'transition-colors duration-150'
                  )}
                />
              </div>

              {/* From date */}
              <div>
                <label className="block text-xs font-medium text-[#a0a9c9] mb-1.5">From</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg text-xs',
                    'bg-[rgba(255,255,255,0.05)] text-white',
                    'border border-[rgba(255,255,255,0.1)]',
                    'focus:outline-none focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6]',
                    'transition-colors duration-150'
                  )}
                />
              </div>

              {/* To date */}
              <div>
                <label className="block text-xs font-medium text-[#a0a9c9] mb-1.5">To</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg text-xs',
                    'bg-[rgba(255,255,255,0.05)] text-white',
                    'border border-[rgba(255,255,255,0.1)]',
                    'focus:outline-none focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6]',
                    'transition-colors duration-150'
                  )}
                />
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={() => setFilters(EMPTY_FILTERS)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md',
                  'text-xs font-medium text-[#a0a9c9]',
                  'bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)]',
                  'border border-[rgba(255,255,255,0.1)] transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]'
                )}
              >
                <RotateCcw size={12} aria-hidden="true" />
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* ── Main content ──────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div
            className={cn(
              'py-16 text-center rounded-xl',
              'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]'
            )}
          >
            <Lock size={36} className="mx-auto mb-3 text-[#374151]" aria-hidden="true" />
            <p className="text-[#a0a9c9] font-medium">No audit logs match your filters</p>
            <p className="text-[#6b7280] text-sm mt-1">Try broadening the date range or clearing filters</p>
          </div>
        ) : viewMode === 'table' ? (
          /* ── Table view ─────────────────────────────────────────────────── */
          <div
            className={cn(
              'rounded-xl overflow-hidden',
              'bg-[rgba(255,255,255,0.03)]',
              'border border-[rgba(255,255,255,0.1)]',
              'backdrop-blur-sm'
            )}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
                    {['Timestamp', 'User', 'Action', 'Details', 'Changes'].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((log) => (
                    <TableRow
                      key={log.id}
                      log={log}
                      isExpanded={expandedId === log.id}
                      onToggle={() => setExpandedId(expandedId === log.id ? null : log.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ── Timeline view ───────────────────────────────────────────────── */
          <div className="pl-2">
            {paginated.map((log, i) => (
              <TimelineEntry
                key={log.id}
                log={log}
                isLast={i === paginated.length - 1}
                isVisible={visibleIds.has(log.id)}
                index={i}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ────────────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
            <p className="text-xs text-[#a0a9c9]">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)}–
              {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                  currentPage === 1
                    ? 'bg-[rgba(255,255,255,0.03)] text-[#374151] cursor-not-allowed'
                    : 'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)]'
                )}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  aria-current={currentPage === p ? 'page' : undefined}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                    currentPage === p
                      ? 'bg-[rgba(20,184,166,0.2)] text-[#86efac] border border-[rgba(20,184,166,0.3)]'
                      : 'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)]'
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                  currentPage === totalPages
                    ? 'bg-[rgba(255,255,255,0.03)] text-[#374151] cursor-not-allowed'
                    : 'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)]'
                )}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ── Immutability notice ───────────────────────────────────────────── */}
        <div
          className={cn(
            'p-4 rounded-lg flex items-start gap-3',
            'bg-[rgba(124,58,237,0.05)] border border-[rgba(124,58,237,0.2)]',
            'backdrop-blur-sm'
          )}
        >
          <Lock size={16} className="text-[#d8b4fe] flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-[#d8b4fe]">Immutable Audit Trail</p>
            <p className="text-xs text-[#c4b5fd] mt-0.5">
              All entries are append-only and tamper-evident. No record can be modified or removed.
            </p>
          </div>
        </div>

      </div>
    </Layout>
  );
}
