'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { useAuth } from '@/lib/hooks/useAuth';
import { cn } from '@/lib/cn';
import { SensitiveActionBadge } from '@/components/admin/SensitiveActionBadge';
import { isSensitiveEntry, getSensitiveReason } from '@/lib/admin/sensitiveActions';
import {
  AuditLogFilters,
  type AuditLogFiltersState,
} from '@/components/admin/AuditLogFilters';
import {
  Download,
  Clock,
  User,
  Shield,
  Lock,
  Table2,
  GitBranch,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  AlertTriangle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type AuditAction = 'create' | 'update' | 'delete' | 'verify' | 'export';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: AuditAction;
  table: string;
  record_id: string;
  ip_address: string;
  sensitive: boolean;
  description: string;
}

type SortKey = keyof Pick<AuditEntry, 'timestamp' | 'user' | 'role' | 'action' | 'table' | 'record_id' | 'ip_address'>;
type SortDir = 'asc' | 'desc';
type ViewMode = 'table' | 'timeline';

// ─── Mock data: 30 realistic audit log entries ───────────────────────────────

const MOCK_AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'AL-001',
    timestamp: '2026-10-09T08:15:22Z',
    user: 'Det. Sarah Moyo',
    role: 'administrator',
    action: 'create',
    table: 'criminal_records',
    record_id: 'CR-2026001',
    ip_address: '196.43.12.5',
    sensitive: false,
    description: 'Created new criminal record for John M. Banda',
  },
  {
    id: 'AL-002',
    timestamp: '2026-10-09T08:42:10Z',
    user: 'Ofc. James Chikwanda',
    role: 'police_officer',
    action: 'verify',
    table: 'criminal_records',
    record_id: 'CR-2026001',
    ip_address: '196.43.12.8',
    sensitive: false,
    description: 'Verified identity against national ID database — confidence 94%',
  },
  {
    id: 'AL-003',
    timestamp: '2026-10-09T09:05:47Z',
    user: 'Ct. Grace Mutasa',
    role: 'court_officer',
    action: 'export',
    table: 'criminal_records',
    record_id: 'CR-2025897',
    ip_address: '196.43.15.22',
    sensitive: true,
    description: 'Exported full criminal record PDF for court proceedings',
  },
  {
    id: 'AL-004',
    timestamp: '2026-10-09T09:18:03Z',
    user: 'Det. Sarah Moyo',
    role: 'administrator',
    action: 'update',
    table: 'criminal_records',
    record_id: 'CR-2026001',
    ip_address: '196.43.12.5',
    sensitive: false,
    description: 'Updated risk level from 2 to 4; added repeat offender flag',
  },
  {
    id: 'AL-005',
    timestamp: '2026-10-09T10:00:00Z',
    user: 'Ofc. Tendai Ncube',
    role: 'police_officer',
    action: 'create',
    table: 'criminal_records',
    record_id: 'CR-2026002',
    ip_address: '196.43.12.11',
    sensitive: false,
    description: 'Created new criminal record for Alice K. Dube',
  },
  {
    id: 'AL-006',
    timestamp: '2026-10-09T10:22:31Z',
    user: 'Prs. Leonard Sibanda',
    role: 'prison_officer',
    action: 'update',
    table: 'criminal_records',
    record_id: 'CR-2024311',
    ip_address: '196.43.20.3',
    sensitive: false,
    description: 'Updated sentence status to RELEASED — parole granted',
  },
  {
    id: 'AL-007',
    timestamp: '2026-10-09T11:05:15Z',
    user: 'Det. Sarah Moyo',
    role: 'administrator',
    action: 'delete',
    table: 'profiles',
    record_id: 'USR-0088',
    ip_address: '196.43.12.5',
    sensitive: true,
    description: 'Deactivated officer account USR-0088 (disciplinary action)',
  },
  {
    id: 'AL-008',
    timestamp: '2026-10-09T11:34:59Z',
    user: 'Ofc. James Chikwanda',
    role: 'police_officer',
    action: 'verify',
    table: 'criminal_records',
    record_id: 'CR-2026002',
    ip_address: '196.43.12.8',
    sensitive: false,
    description: 'Verified identity against national ID — confidence 81%',
  },
  {
    id: 'AL-009',
    timestamp: '2026-10-09T12:10:44Z',
    user: 'Ct. Grace Mutasa',
    role: 'court_officer',
    action: 'export',
    table: 'criminal_records',
    record_id: 'CR-2025012',
    ip_address: '196.43.15.22',
    sensitive: true,
    description: 'Exported sentencing summary for Case No. HC-2026/0381',
  },
  {
    id: 'AL-010',
    timestamp: '2026-10-09T13:00:00Z',
    user: 'Ofc. Ruth Zimba',
    role: 'police_officer',
    action: 'create',
    table: 'criminal_records',
    record_id: 'CR-2026003',
    ip_address: '196.43.12.19',
    sensitive: false,
    description: 'Created new criminal record for Michael T. Phiri',
  },
  {
    id: 'AL-011',
    timestamp: '2026-10-09T13:22:08Z',
    user: 'Det. Sarah Moyo',
    role: 'administrator',
    action: 'update',
    table: 'profiles',
    record_id: 'USR-0042',
    ip_address: '196.43.12.5',
    sensitive: false,
    description: "Promoted Officer Chikwanda's role from police_officer to senior_officer",
  },
  {
    id: 'AL-012',
    timestamp: '2026-10-09T14:05:33Z',
    user: 'Prs. Leonard Sibanda',
    role: 'prison_officer',
    action: 'verify',
    table: 'criminal_records',
    record_id: 'CR-2023784',
    ip_address: '196.43.20.3',
    sensitive: false,
    description: 'Identity re-verification on admission — confidence 97%',
  },
  {
    id: 'AL-013',
    timestamp: '2026-10-09T14:45:21Z',
    user: 'Ofc. Tendai Ncube',
    role: 'police_officer',
    action: 'update',
    table: 'criminal_records',
    record_id: 'CR-2026003',
    ip_address: '196.43.12.11',
    sensitive: false,
    description: 'Added alias "M. Phiri" and updated home address',
  },
  {
    id: 'AL-014',
    timestamp: '2026-10-09T15:10:00Z',
    user: 'Ct. Grace Mutasa',
    role: 'court_officer',
    action: 'verify',
    table: 'criminal_records',
    record_id: 'CR-2025897',
    ip_address: '196.43.15.22',
    sensitive: false,
    description: 'Pre-sentencing verification — confidence 88%',
  },
  {
    id: 'AL-015',
    timestamp: '2026-10-09T15:30:55Z',
    user: 'Det. Sarah Moyo',
    role: 'administrator',
    action: 'export',
    table: 'criminal_records',
    record_id: 'CR-2024100',
    ip_address: '196.43.12.5',
    sensitive: true,
    description: 'Bulk exported 12 records for inter-agency data sharing request',
  },
  {
    id: 'AL-016',
    timestamp: '2026-10-09T16:02:14Z',
    user: 'Ofc. Ruth Zimba',
    role: 'police_officer',
    action: 'verify',
    table: 'criminal_records',
    record_id: 'CR-2026003',
    ip_address: '196.43.12.19',
    sensitive: false,
    description: 'Routine identity verification — confidence 79%',
  },
  {
    id: 'AL-017',
    timestamp: '2026-10-09T16:40:07Z',
    user: 'Ofc. James Chikwanda',
    role: 'police_officer',
    action: 'create',
    table: 'criminal_records',
    record_id: 'CR-2026004',
    ip_address: '196.43.12.8',
    sensitive: false,
    description: 'Created new criminal record for Blessing N. Nkosi',
  },
  {
    id: 'AL-018',
    timestamp: '2026-10-09T17:15:40Z',
    user: 'Det. Sarah Moyo',
    role: 'administrator',
    action: 'delete',
    table: 'criminal_records',
    record_id: 'CR-2020045',
    ip_address: '196.43.12.5',
    sensitive: true,
    description: 'Soft-deleted expunged record per court order HC/EXP/2026/022',
  },
  {
    id: 'AL-019',
    timestamp: '2026-10-08T09:00:00Z',
    user: 'Prs. Leonard Sibanda',
    role: 'prison_officer',
    action: 'update',
    table: 'criminal_records',
    record_id: 'CR-2022119',
    ip_address: '196.43.20.3',
    sensitive: false,
    description: 'Updated prison facility from Chikurubi Main to Harare Remand',
  },
  {
    id: 'AL-020',
    timestamp: '2026-10-08T10:30:18Z',
    user: 'Ofc. Ruth Zimba',
    role: 'police_officer',
    action: 'create',
    table: 'criminal_records',
    record_id: 'CR-2026005',
    ip_address: '196.43.12.19',
    sensitive: false,
    description: 'Created new criminal record for Peter C. Mwangi',
  },
  {
    id: 'AL-021',
    timestamp: '2026-10-08T11:05:33Z',
    user: 'Ct. Grace Mutasa',
    role: 'court_officer',
    action: 'update',
    table: 'criminal_records',
    record_id: 'CR-2025012',
    ip_address: '196.43.15.22',
    sensitive: false,
    description: 'Recorded guilty verdict — sentence: 5 years imprisonment',
  },
  {
    id: 'AL-022',
    timestamp: '2026-10-08T12:22:47Z',
    user: 'Det. Sarah Moyo',
    role: 'administrator',
    action: 'verify',
    table: 'criminal_records',
    record_id: 'CR-2026005',
    ip_address: '196.43.12.5',
    sensitive: false,
    description: 'Admin verification override — confidence threshold waived',
  },
  {
    id: 'AL-023',
    timestamp: '2026-10-08T13:50:00Z',
    user: 'Ofc. James Chikwanda',
    role: 'police_officer',
    action: 'export',
    table: 'criminal_records',
    record_id: 'CR-2026004',
    ip_address: '196.43.12.8',
    sensitive: false,
    description: 'Exported arrest report for CR-2026004',
  },
  {
    id: 'AL-024',
    timestamp: '2026-10-08T14:30:12Z',
    user: 'Ofc. Tendai Ncube',
    role: 'police_officer',
    action: 'create',
    table: 'criminal_records',
    record_id: 'CR-2026006',
    ip_address: '196.43.12.11',
    sensitive: false,
    description: 'Created new criminal record for Chipo F. Makoni',
  },
  {
    id: 'AL-025',
    timestamp: '2026-10-08T15:00:00Z',
    user: 'Prs. Leonard Sibanda',
    role: 'prison_officer',
    action: 'update',
    table: 'criminal_records',
    record_id: 'CR-2021333',
    ip_address: '196.43.20.3',
    sensitive: false,
    description: 'Updated transfer status — transferred to Bulawayo Prison',
  },
  {
    id: 'AL-026',
    timestamp: '2026-10-07T09:15:00Z',
    user: 'Det. Sarah Moyo',
    role: 'administrator',
    action: 'update',
    table: 'profiles',
    record_id: 'USR-0031',
    ip_address: '196.43.12.5',
    sensitive: false,
    description: 'Reset 2FA for officer USR-0031 following lockout',
  },
  {
    id: 'AL-027',
    timestamp: '2026-10-07T10:44:29Z',
    user: 'Ofc. Ruth Zimba',
    role: 'police_officer',
    action: 'verify',
    table: 'criminal_records',
    record_id: 'CR-2026006',
    ip_address: '196.43.12.19',
    sensitive: false,
    description: 'Verified identity — confidence 92%',
  },
  {
    id: 'AL-028',
    timestamp: '2026-10-07T11:30:00Z',
    user: 'Ct. Grace Mutasa',
    role: 'court_officer',
    action: 'export',
    table: 'criminal_records',
    record_id: 'CR-2024200',
    ip_address: '196.43.15.22',
    sensitive: true,
    description: 'Exported appeal documentation — Case HC-2026/0299',
  },
  {
    id: 'AL-029',
    timestamp: '2026-10-07T13:05:00Z',
    user: 'Det. Sarah Moyo',
    role: 'administrator',
    action: 'delete',
    table: 'profiles',
    record_id: 'USR-0011',
    ip_address: '196.43.12.5',
    sensitive: true,
    description: 'Permanently deactivated retired officer account USR-0011',
  },
  {
    id: 'AL-030',
    timestamp: '2026-10-07T14:20:00Z',
    user: 'Ofc. James Chikwanda',
    role: 'police_officer',
    action: 'update',
    table: 'criminal_records',
    record_id: 'CR-2026006',
    ip_address: '196.43.12.8',
    sensitive: false,
    description: 'Added court date and presiding magistrate details',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ACTION_CONFIG: Record<AuditAction, { label: string; bg: string; text: string; border: string }> = {
  create: {
    label: 'Create',
    bg: 'bg-[rgba(16,185,129,0.12)]',
    text: 'text-[#6ee7b7]',
    border: 'border-[rgba(16,185,129,0.3)]',
  },
  update: {
    label: 'Update',
    bg: 'bg-[rgba(20,184,166,0.12)]',
    text: 'text-[#5eead4]',
    border: 'border-[rgba(20,184,166,0.3)]',
  },
  delete: {
    label: 'Delete',
    bg: 'bg-[rgba(220,38,38,0.12)]',
    text: 'text-[#fca5a5]',
    border: 'border-[rgba(220,38,38,0.3)]',
  },
  verify: {
    label: 'Verify',
    bg: 'bg-[rgba(124,58,237,0.12)]',
    text: 'text-[#d8b4fe]',
    border: 'border-[rgba(124,58,237,0.3)]',
  },
  export: {
    label: 'Export',
    bg: 'bg-[rgba(245,158,11,0.12)]',
    text: 'text-[#fcd34d]',
    border: 'border-[rgba(245,158,11,0.3)]',
  },
};

function ActionBadge({ action }: { action: AuditAction }) {
  const cfg = ACTION_CONFIG[action];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border',
        cfg.bg,
        cfg.text,
        cfg.border
      )}
    >
      {cfg.label}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const label = role
    .split('_')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[rgba(255,255,255,0.06)] text-[#a0a9c9] border border-[rgba(255,255,255,0.1)]">
      <Shield size={10} className="opacity-70" />
      {label}
    </span>
  );
}

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatDateHeader(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/** Group entries by calendar date (YYYY-MM-DD) */
function groupByDate(entries: AuditEntry[]): Map<string, AuditEntry[]> {
  const map = new Map<string, AuditEntry[]>();
  for (const entry of entries) {
    const key = entry.timestamp.slice(0, 10);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(entry);
  }
  return map;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded bg-[rgba(255,255,255,0.06)]', className)}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AuditLogPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  // ── View & sort state ──
  const [view, setView] = useState<ViewMode>('table');
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ── Sensitive summary banner ──
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // ── Filter state ──
  const [filters, setFilters] = useState<AuditLogFiltersState>({
    search: '',
    actionType: '',
    role: '',
    startDate: '',
    endDate: '',
    sensitiveOnly: false,
  });

  // ─── Auth guard ───────────────────────────────────────────────────────────
  // Loading state — show skeletons
  const isLoading = loading;

  // Redirect once we know user is not admin
  React.useEffect(() => {
    if (!loading && (!user || profile?.role !== 'administrator')) {
      router.replace('/login');
    }
  }, [loading, user, profile, router]);

  // ─── Derived data ─────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let data = [...MOCK_AUDIT_LOGS];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        (e) =>
          e.user.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.record_id.toLowerCase().includes(q) ||
          e.table.toLowerCase().includes(q) ||
          e.ip_address.includes(q)
      );
    }
    if (filters.actionType) data = data.filter((e) => e.action === filters.actionType);
    if (filters.role)       data = data.filter((e) => e.role === filters.role);
    if (filters.sensitiveOnly) data = data.filter((e) => e.sensitive);
    if (filters.startDate) {
      data = data.filter((e) => e.timestamp.slice(0, 10) >= filters.startDate);
    }
    if (filters.endDate) {
      data = data.filter((e) => e.timestamp.slice(0, 10) <= filters.endDate);
    }

    // Sort
    data.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === 'boolean'
        ? Number(av) - Number(bv)
        : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return data;
  }, [filters, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filtered, currentPage]
  );

  const groupedTimeline = useMemo(() => groupByDate(filtered), [filtered]);

  // Reset page on filter/sort change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortKey, sortDir]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortDir('desc');
      }
    },
    [sortKey]
  );

  const exportCSV = useCallback(() => {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Table', 'Record ID', 'IP Address', 'Sensitive', 'Description'];
    const rows = filtered.map((e) => [
      formatTimestamp(e.timestamp),
      e.user,
      e.role,
      e.action,
      e.table,
      e.record_id,
      e.ip_address,
      e.sensitive ? 'Yes' : 'No',
      e.description,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  const clearFilters = useCallback(() => {
    setFilters({ search: '', actionType: '', role: '', startDate: '', endDate: '', sensitiveOnly: false });
  }, []);

  const hasActiveFilters =
    !!filters.search ||
    !!filters.actionType ||
    !!filters.role ||
    !!filters.startDate ||
    !!filters.endDate ||
    filters.sensitiveOnly;

  // ─── Render ───────────────────────────────────────────────────────────────

  // Show skeletons while loading
  if (isLoading) {
    return (
      <Layout breadcrumbs={[{ label: 'Admin' }, { label: 'Audit Log' }]}>
        <Container>
          <div className="space-y-6 py-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40 ml-auto" />
            </div>
            <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-none border-b border-[rgba(255,255,255,0.05)]" />
              ))}
            </div>
          </div>
        </Container>
      </Layout>
    );
  }

  // Don't render content if not admin (effect will redirect)
  if (!user || profile?.role !== 'administrator') {
    return null;
  }

  // ─── Sort icon helper ──────────────────────────────────────────────────────

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronsUpDown size={14} className="text-[#6b7280]" />;
    return sortDir === 'asc'
      ? <ChevronUp size={14} className="text-[#14b8a6]" />
      : <ChevronDown size={14} className="text-[#14b8a6]" />;
  }

  function ThBtn({ col, children }: { col: SortKey; children: React.ReactNode }) {
    return (
      <button
        onClick={() => handleSort(col)}
        className="inline-flex items-center gap-1 font-semibold text-xs uppercase tracking-wider text-[#a0a9c9] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#14b8a6] rounded"
      >
        {children}
        <SortIcon col={col} />
      </button>
    );
  }

  return (
    <Layout breadcrumbs={[{ label: 'Admin' }, { label: 'Audit Log' }]}>
      <Container>
        <div className="py-6 space-y-6">

          {/* ── Page header ─────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">System Audit Log</h1>
              <p className="mt-1 text-sm text-[#a0a9c9]">
                Immutable record of every system action across all entities and users.
              </p>
            </div>

            <button
              onClick={exportCSV}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium',
                'bg-[rgba(20,184,166,0.12)] text-[#5eead4]',
                'border border-[rgba(20,184,166,0.25)]',
                'hover:bg-[rgba(20,184,166,0.2)] hover:border-[rgba(20,184,166,0.4)]',
                'transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                'flex-shrink-0'
              )}
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>

          {/* ── AuditLogFilters ──────────────────────────────────────────── */}
          <AuditLogFilters filters={filters} onChange={setFilters} />

          {/* ── Glassmorphism card ───────────────────────────────────────────── */}
          <div
            className={cn(
              'rounded-2xl border',
              'bg-[rgba(255,255,255,0.04)]',
              'border-[rgba(255,255,255,0.09)]',
              'backdrop-blur-md',
              'overflow-hidden'
            )}
          >
            {/* ── Toolbar ─────────────────────────────────────────────────── */}
            <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.07)] flex flex-col sm:flex-row gap-3">
              {/* Right-side controls */}
              <div className="flex items-center gap-2 flex-wrap ml-auto">
                {/* View toggle */}
                <div
                  className={cn(
                    'inline-flex rounded-lg overflow-hidden',
                    'border border-[rgba(255,255,255,0.1)]'
                  )}
                  role="group"
                  aria-label="View mode"
                >
                  <button
                    onClick={() => setView('table')}
                    aria-pressed={view === 'table'}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#14b8a6]',
                      view === 'table'
                        ? 'bg-[rgba(20,184,166,0.18)] text-[#5eead4]'
                        : 'bg-transparent text-[#a0a9c9] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
                    )}
                  >
                    <Table2 size={14} />
                    Table
                  </button>
                  <button
                    onClick={() => setView('timeline')}
                    aria-pressed={view === 'timeline'}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#14b8a6]',
                      view === 'timeline'
                        ? 'bg-[rgba(20,184,166,0.18)] text-[#5eead4]'
                        : 'bg-transparent text-[#a0a9c9] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
                    )}
                  >
                    <GitBranch size={14} />
                    Timeline
                  </button>
                </div>
              </div>
            </div>

            {/* ── Result count ────────────────────────────────────────────── */}
            <div className="px-5 py-2.5 border-b border-[rgba(255,255,255,0.05)] flex items-center gap-2">
              <span className="text-xs text-[#6b7280]">
                Showing <span className="text-white font-medium">{filtered.length}</span> of{' '}
                <span className="text-white font-medium">{MOCK_AUDIT_LOGS.length}</span> entries
              </span>
              {hasActiveFilters && (
                <span className="text-xs text-[#14b8a6] font-medium">• filtered</span>
              )}
            </div>

            {/* ── TABLE VIEW ──────────────────────────────────────────────── */}
            {view === 'table' && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[900px]" role="table">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.07)]">
                        {(
                          [
                            ['timestamp', 'Timestamp'],
                            ['user', 'User'],
                            ['role', 'Role'],
                            ['action', 'Action'],
                            ['table', 'Entity'],
                            ['record_id', 'Record ID'],
                            ['ip_address', 'IP Address'],
                          ] as [SortKey, string][]
                        ).map(([key, label]) => (
                          <th
                            key={key}
                            scope="col"
                            className="px-4 py-3 text-left bg-[rgba(255,255,255,0.02)]"
                          >
                            <ThBtn col={key}>{label}</ThBtn>
                          </th>
                        ))}
                        <th
                          scope="col"
                          className="px-4 py-3 text-left bg-[rgba(255,255,255,0.02)]"
                        >
                          <span className="font-semibold text-xs uppercase tracking-wider text-[#a0a9c9]">
                            Sensitive
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-12 text-center text-[#6b7280]">
                            No audit entries match the current filters.
                          </td>
                        </tr>
                      ) : (
                        paginated.map((entry) => (
                          <tr
                            key={entry.id}
                            className={cn(
                              'border-b border-[rgba(255,255,255,0.04)]',
                              'transition-colors duration-150',
                              entry.sensitive
                                ? 'bg-[rgba(220,38,38,0.04)] hover:bg-[rgba(220,38,38,0.08)]'
                                : 'hover:bg-[rgba(255,255,255,0.03)]'
                            )}
                          >
                            {/* Timestamp */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5 text-[#a0a9c9] font-mono text-xs">
                                <Clock size={12} className="opacity-60" />
                                {formatTimestamp(entry.timestamp)}
                              </span>
                            </td>

                            {/* User */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5 text-white font-medium">
                                <User size={13} className="text-[#a0a9c9]" />
                                {entry.user}
                              </span>
                            </td>

                            {/* Role */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <RoleBadge role={entry.role} />
                            </td>

                            {/* Action */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <ActionBadge action={entry.action} />
                            </td>

                            {/* Entity */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="font-mono text-xs text-[#a0a9c9]">{entry.table}</span>
                            </td>

                            {/* Record ID */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="font-mono text-xs text-[#5eead4]">{entry.record_id}</span>
                            </td>

                            {/* IP */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="font-mono text-xs text-[#a0a9c9]">{entry.ip_address}</span>
                            </td>

                            {/* Sensitive */}
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              {entry.sensitive ? (
                                <span
                                  title="Sensitive action"
                                  className="inline-flex items-center justify-center"
                                >
                                  <Lock
                                    size={15}
                                    className="text-[#fca5a5]"
                                    aria-label="Sensitive"
                                  />
                                </span>
                              ) : (
                                <span className="text-[#3a4254] text-xs">—</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-5 py-4 border-t border-[rgba(255,255,255,0.07)] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-[#a0a9c9]">
                      Page {currentPage} of {totalPages} &nbsp;·&nbsp;{' '}
                      {(currentPage - 1) * itemsPerPage + 1}–
                      {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
                    </p>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className={cn(
                          'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                          currentPage === 1
                            ? 'text-[#3a4254] cursor-not-allowed'
                            : 'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.09)] border border-[rgba(255,255,255,0.08)]'
                        )}
                      >
                        «
                      </button>
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                          currentPage === 1
                            ? 'text-[#3a4254] cursor-not-allowed'
                            : 'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.09)] border border-[rgba(255,255,255,0.08)]'
                        )}
                      >
                        Previous
                      </button>

                      {/* Page numbers — show up to 5 around current */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (p) =>
                            p === 1 ||
                            p === totalPages ||
                            Math.abs(p - currentPage) <= 1
                        )
                        .reduce<(number | '…')[]>((acc, p, i, arr) => {
                          if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('…');
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((p, i) =>
                          p === '…' ? (
                            <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-xs text-[#6b7280]">
                              …
                            </span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => setCurrentPage(p as number)}
                              className={cn(
                                'min-w-[2rem] px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                                currentPage === p
                                  ? 'bg-[rgba(20,184,166,0.2)] text-[#5eead4] border border-[rgba(20,184,166,0.35)]'
                                  : 'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.09)] border border-[rgba(255,255,255,0.08)]'
                              )}
                            >
                              {p}
                            </button>
                          )
                        )}

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                          currentPage === totalPages
                            ? 'text-[#3a4254] cursor-not-allowed'
                            : 'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.09)] border border-[rgba(255,255,255,0.08)]'
                        )}
                      >
                        Next
                      </button>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className={cn(
                          'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                          currentPage === totalPages
                            ? 'text-[#3a4254] cursor-not-allowed'
                            : 'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.09)] border border-[rgba(255,255,255,0.08)]'
                        )}
                      >
                        »
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── TIMELINE VIEW ───────────────────────────────────────────── */}
            {view === 'timeline' && (
              <div className="px-5 py-6">
                {filtered.length === 0 ? (
                  <p className="text-center text-[#6b7280] py-12">No audit entries match the current filters.</p>
                ) : (
                  <div className="space-y-10">
                    {Array.from(groupedTimeline.entries()).map(([dateKey, entries]) => (
                      <div key={dateKey}>
                        {/* Date group header */}
                        <div className="flex items-center gap-3 mb-5">
                          <div className="h-px flex-1 bg-[rgba(255,255,255,0.07)]" />
                          <span className="text-xs font-semibold text-[#a0a9c9] uppercase tracking-widest px-3 py-1 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.09)]">
                            {formatDateHeader(dateKey)}
                          </span>
                          <div className="h-px flex-1 bg-[rgba(255,255,255,0.07)]" />
                        </div>

                        {/* Entries for that date */}
                        <div className="relative ml-4">
                          {/* Vertical connecting line */}
                          <div
                            className="absolute left-[7px] top-3 bottom-3 w-px bg-[rgba(255,255,255,0.08)]"
                            aria-hidden="true"
                          />

                          <div className="space-y-4">
                            {entries.map((entry) => {
                              const cfg = ACTION_CONFIG[entry.action];
                              return (
                                <div key={entry.id} className="relative flex gap-4">
                                  {/* Timeline dot */}
                                  <div
                                    className={cn(
                                      'relative z-10 flex-shrink-0 w-4 h-4 mt-2 rounded-full border-2',
                                      'ring-4 ring-[#0a0e27]',
                                      cfg.bg,
                                      cfg.border
                                    )}
                                    aria-hidden="true"
                                  />

                                  {/* Card */}
                                  <div
                                    className={cn(
                                      'flex-1 rounded-xl p-4',
                                      'border transition-all duration-200',
                                      entry.sensitive
                                        ? 'bg-[rgba(220,38,38,0.05)] border-[rgba(220,38,38,0.2)] hover:border-[rgba(220,38,38,0.35)]'
                                        : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.13)]'
                                    )}
                                  >
                                    {/* Top row */}
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                      <ActionBadge action={entry.action} />

                                      {entry.sensitive && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[rgba(220,38,38,0.12)] text-[#fca5a5] border border-[rgba(220,38,38,0.3)]">
                                          <Lock size={10} />
                                          Sensitive
                                        </span>
                                      )}

                                      <span className="ml-auto inline-flex items-center gap-1 text-xs text-[#6b7280] font-mono">
                                        <Clock size={11} />
                                        {formatTimestamp(entry.timestamp)}
                                      </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-white leading-relaxed mb-3">
                                      {entry.description}
                                    </p>

                                    {/* Meta row */}
                                    <div className="flex flex-wrap items-center gap-3 text-xs">
                                      {/* User badge */}
                                      <span className="inline-flex items-center gap-1.5 text-[#a0a9c9]">
                                        <User size={12} />
                                        <span className="font-medium text-white">{entry.user}</span>
                                      </span>

                                      <RoleBadge role={entry.role} />

                                      <span className="text-[#6b7280]">·</span>

                                      <span className="font-mono text-[#5eead4]">{entry.record_id}</span>

                                      <span className="text-[#6b7280]">·</span>

                                      <span className="font-mono text-[#6b7280]">{entry.table}</span>

                                      <span className="text-[#6b7280]">·</span>

                                      <span className="font-mono text-[#6b7280]">{entry.ip_address}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Immutability notice ──────────────────────────────────────────── */}
          <div
            className={cn(
              'flex items-start gap-3 px-4 py-3 rounded-xl',
              'bg-[rgba(124,58,237,0.06)] border border-[rgba(124,58,237,0.18)]'
            )}
          >
            <AlertTriangle size={16} className="text-[#d8b4fe] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#c4b5fd] leading-relaxed">
              <span className="font-semibold text-[#d8b4fe]">Immutable audit trail.</span>{' '}
              All entries are append-only and tamper-evident. No log can be modified or deleted.
              This data provides full accountability and compliance with court record management standards.
            </p>
          </div>

        </div>
      </Container>
    </Layout>
  );
}
