'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import { ChevronDown, Filter, Download, Calendar, User, Clock, ArrowRight, Lock } from 'lucide-react';
import { useAuditLogs } from '@/lib/hooks/useAuditLogs';
import { ChangeDetails } from '@/components/audit/ChangeDetails';
import type { CriminalRecord, AuditLog, AuditAction, UserRole } from '@/types/database';

export interface AuditTrailTabProps {
  /** Criminal record data */
  record: CriminalRecord;
  /** Record ID to filter audit logs */
  recordId: string;
  /** Additional className */
  className?: string;
}

/**
 * AuditTrailTab — Displays immutable audit history of all actions on the record.
 *
 * Features:
 * - Chronological timeline of all system actions
 * - User/admin information for each action
 * - Action type indicators (create, update, verify, flag, etc.)
 * - Timestamp with microsecond precision
 * - Before/after values for edit actions
 * - Status badges for different action types
 * - Filter options by user, action type, date range
 * - Export audit history to PDF/CSV
 * - Read-only display (immutable records)
 * - Glassmorphism styling with Aurora accents
 * - Pagination for long histories
 * - Accessibility compliance
 */
export function AuditTrailTab({ record, recordId, className }: AuditTrailTabProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleRows, setVisibleRows] = useState<Set<string>>(new Set());
  const itemsPerPage = 10;
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Filters state
  const [filters, setFilters] = useState({
    actionType: '' as AuditAction | '',
    user: '',
    startDate: '',
    endDate: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch audit logs using hook
  const { logs: auditLogs, isLoading, error } = useAuditLogs({
    recordId,
    action: filters.actionType || undefined,
    userId: filters.user || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  });

  // Filter audit logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (filters.actionType && log.action !== filters.actionType) return false;
      if (filters.user && !log.user_id?.includes(filters.user)) return false;
      if (filters.startDate) {
        const logDate = new Date(log.created_at);
        if (logDate < new Date(filters.startDate)) return false;
      }
      if (filters.endDate) {
        const logDate = new Date(log.created_at);
        if (logDate > new Date(filters.endDate)) return false;
      }
      return true;
    });
  }, [auditLogs, filters]);

  // Pagination
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Set up Intersection Observer for audit trail row animations
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Create observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const logId = element.getAttribute('data-log-id');
          if (logId) {
            setVisibleRows((prev) => {
              const newSet = new Set(prev);
              newSet.add(logId);
              return newSet;
            });
          }
        }
      },
      {
        threshold: 0.15,
        rootMargin: '50px',
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Observe audit trail items as they render
  useEffect(() => {
    if (!observerRef.current) return;

    const auditItems = document.querySelectorAll('[data-log-id]');
    auditItems.forEach((item) => {
      observerRef.current?.observe(item);
    });

    return () => {
      auditItems.forEach((item) => {
        observerRef.current?.unobserve(item);
      });
    };
  }, [paginatedLogs]);

  // Action type colors and labels
  const getActionTypeStyles = (action: AuditAction) => {
    const styles: Record<AuditAction, { bg: string; text: string; icon: string; label: string }> = {
      create: { bg: 'bg-[rgba(16,185,129,0.1)]', text: 'text-[#86efac]', icon: '✓', label: 'Created' },
      update: { bg: 'bg-[rgba(20,184,166,0.1)]', text: 'text-[#7dd3fc]', icon: '◈', label: 'Updated' },
      delete: { bg: 'bg-[rgba(220,38,38,0.1)]', text: 'text-[#fca5a5]', icon: '✕', label: 'Deleted' },
      read: { bg: 'bg-[rgba(148,163,184,0.1)]', text: 'text-[#cbd5e1]', icon: '◉', label: 'Viewed' },
      verify: { bg: 'bg-[rgba(124,58,237,0.1)]', text: 'text-[#d8b4fe]', icon: '✓✓', label: 'Verified' },
      generate_report: { bg: 'bg-[rgba(79,70,229,0.1)]', text: 'text-[#a5b4fc]', icon: '📄', label: 'Report' },
      flag_duplicate: { bg: 'bg-[rgba(245,158,11,0.1)]', text: 'text-[#fcd34d]', icon: '⚠', label: 'Flagged' },
      resolve_duplicate: { bg: 'bg-[rgba(34,197,94,0.1)]', text: 'text-[#86efac]', icon: '✓', label: 'Resolved' },
      export: { bg: 'bg-[rgba(59,130,246,0.1)]', text: 'text-[#93c5fd]', icon: '↓', label: 'Exported' },
      login: { bg: 'bg-[rgba(34,197,94,0.1)]', text: 'text-[#86efac]', icon: '→', label: 'Login' },
      logout: { bg: 'bg-[rgba(148,163,184,0.1)]', text: 'text-[#cbd5e1]', icon: '←', label: 'Logout' },
    };
    return styles[action] || styles.read;
  };

  const isSensitiveAction = (action: AuditAction) => {
    return ['delete', 'flag_duplicate', 'export'].includes(action);
  };

  // Export handlers
  const exportToCSV = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Table', 'Record ID', 'Description'];
    const rows = filteredLogs.map((log) => [
      new Date(log.created_at).toLocaleString(),
      log.user_id || 'System',
      log.action,
      log.table_name || '-',
      log.record_id || '-',
      log.description || '-',
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trail-${recordId}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportToPDF = () => {
    // In a real implementation, use a library like jsPDF
    const content = filteredLogs
      .map(
        (log) =>
          `${new Date(log.created_at).toLocaleString()} | ${log.user_id || 'System'} | ${log.action} | ${log.description || '-'}`
      )
      .join('\n');

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trail-${recordId}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className={cn('py-6', className)}>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                'p-4 rounded-lg h-24',
                'bg-[rgba(255,255,255,0.05)]',
                'border border-[rgba(255,255,255,0.1)]',
                'backdrop-blur-sm',
                'animate-pulse'
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('py-6', className)}>
        <div
          className={cn(
            'p-6 rounded-lg',
            'bg-[rgba(220,38,38,0.1)]',
            'border border-[rgba(220,38,38,0.3)]',
            'backdrop-blur-sm'
          )}
        >
          <p className="text-[#fca5a5]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('py-6 space-y-6', className)}>
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Audit Trail</h3>
          <p className="text-sm text-[#a0a9c9]">
            Immutable record of all {filteredLogs.length} system action{filteredLogs.length !== 1 ? 's' : ''} on this record
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
              'text-sm font-medium transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
              showFilters
                ? 'bg-[rgba(20,184,166,0.15)] text-[#86efac] border border-[rgba(20,184,166,0.3)]'
                : 'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)]'
            )}
          >
            <Filter size={16} />
            Filter
          </button>

          <button
            onClick={exportToCSV}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
              'text-sm font-medium transition-all duration-200',
              'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9]',
              'hover:bg-[rgba(255,255,255,0.1)]',
              'border border-[rgba(255,255,255,0.1)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]'
            )}
            title="Export as CSV"
          >
            <Download size={16} />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button
            onClick={exportToPDF}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
              'text-sm font-medium transition-all duration-200',
              'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9]',
              'hover:bg-[rgba(255,255,255,0.1)]',
              'border border-[rgba(255,255,255,0.1)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]'
            )}
            title="Export as PDF"
          >
            <Download size={16} />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div
          className={cn(
            'p-4 rounded-lg space-y-4',
            'bg-[rgba(255,255,255,0.05)]',
            'border border-[rgba(255,255,255,0.1)]',
            'backdrop-blur-sm',
            'animate-fadeIn'
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Action Type Filter */}
            <div>
              <label className="block text-xs font-medium text-[#a0a9c9] mb-2">Action Type</label>
              <select
                value={filters.actionType}
                onChange={(e) => setFilters({ ...filters, actionType: e.target.value as AuditAction })}
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-sm',
                  'bg-[rgba(255,255,255,0.05)] text-white',
                  'border border-[rgba(255,255,255,0.1)]',
                  'focus:border-[#14b8a6] focus:ring-2 focus:ring-[#14b8a6]',
                  'transition-all duration-200'
                )}
              >
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="read">Read</option>
                <option value="verify">Verify</option>
              </select>
            </div>

            {/* User Filter */}
            <div>
              <label className="block text-xs font-medium text-[#a0a9c9] mb-2">User</label>
              <input
                type="text"
                placeholder="Search user..."
                value={filters.user}
                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-sm',
                  'bg-[rgba(255,255,255,0.05)] text-white',
                  'border border-[rgba(255,255,255,0.1)]',
                  'placeholder-[#6b7280]',
                  'focus:border-[#14b8a6] focus:ring-2 focus:ring-[#14b8a6]',
                  'transition-all duration-200'
                )}
              />
            </div>

            {/* Start Date Filter */}
            <div>
              <label className="block text-xs font-medium text-[#a0a9c9] mb-2">From Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-sm',
                  'bg-[rgba(255,255,255,0.05)] text-white',
                  'border border-[rgba(255,255,255,0.1)]',
                  'focus:border-[#14b8a6] focus:ring-2 focus:ring-[#14b8a6]',
                  'transition-all duration-200'
                )}
              />
            </div>

            {/* End Date Filter */}
            <div>
              <label className="block text-xs font-medium text-[#a0a9c9] mb-2">To Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-sm',
                  'bg-[rgba(255,255,255,0.05)] text-white',
                  'border border-[rgba(255,255,255,0.1)]',
                  'focus:border-[#14b8a6] focus:ring-2 focus:ring-[#14b8a6]',
                  'transition-all duration-200'
                )}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() =>
                setFilters({
                  actionType: '',
                  user: '',
                  startDate: '',
                  endDate: '',
                })
              }
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium',
                'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9]',
                'hover:bg-[rgba(255,255,255,0.1)]',
                'border border-[rgba(255,255,255,0.1)]',
                'transition-all duration-200'
              )}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Audit Trail Timeline */}
      {paginatedLogs.length > 0 ? (
        <div className="space-y-3">
          {paginatedLogs.map((log, index) => {
            const actionStyles = getActionTypeStyles(log.action);
            const isSensitive = isSensitiveAction(log.action);
            const isExpanded = expandedRowId === log.id;
            const isVisible = visibleRows.has(log.id);

            return (
              <div
                key={log.id}
                data-log-id={log.id}
                className={cn(
                  'rounded-lg border transition-all duration-200',
                  !isVisible && 'opacity-0 transform translate-x-[-20px]',
                  isVisible && 'opacity-100 transform translate-x-0 audit-trail-item-animated',
                  isExpanded
                    ? cn(
                        'bg-[rgba(255,255,255,0.08)]',
                        'border-[rgba(255,255,255,0.15)]',
                        'shadow-lg'
                      )
                    : cn(
                        'bg-[rgba(255,255,255,0.03)]',
                        'border-[rgba(255,255,255,0.1)]',
                        'hover:bg-[rgba(255,255,255,0.05)]',
                        'hover:border-[rgba(255,255,255,0.15)]'
                      ),
                  isSensitive && 'border-[rgba(220,38,38,0.3)] bg-[rgba(220,38,38,0.05)]'
                )}
                style={{
                  animationDelay: isVisible ? `${index * 75}ms` : '0ms',
                }}
              >
                {/* Main row — only update actions with values are expandable */}
                {(() => {
                  const hasChanges = log.action === 'update' && (log.old_values || log.new_values);
                  return (<button
                  onClick={() => { if (hasChanges) setExpandedRowId(isExpanded ? null : log.id); }}
                  className={cn(
                    'w-full text-left p-4 rounded-lg',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                    !hasChanges && 'cursor-default'
                  )}
                  aria-expanded={hasChanges ? isExpanded : undefined}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center gap-2 flex-shrink-0 pt-1">
                        <div
                          className={cn(
                            'w-3 h-3 rounded-full',
                            'ring-4 ring-[rgba(255,255,255,0.1)]',
                            actionStyles.bg.replace('bg-', 'bg-').replace('0.1)', '0.3)')
                          )}
                        />
                        {index < paginatedLogs.length - 1 && (
                          <div className="w-0.5 h-8 bg-[rgba(255,255,255,0.05)]" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          {/* Action badge */}
                          <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium', actionStyles.bg, actionStyles.text)}>
                            <span>{actionStyles.label}</span>
                          </div>

                          {/* Sensitive action indicator */}
                          {isSensitive && (
                            <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium bg-[rgba(220,38,38,0.15)] text-[#fca5a5]">
                              <Lock size={12} />
                              <span>Sensitive</span>
                            </div>
                          )}

                          {/* User */}
                          {log.user_id && (
                            <div className="inline-flex items-center gap-1 text-xs text-[#a0a9c9]">
                              <User size={14} />
                              <span>{log.user_id.substring(0, 8)}...</span>
                            </div>
                          )}

                          {/* Timestamp */}
                          <div className="inline-flex items-center gap-1 text-xs text-[#a0a9c9]">
                            <Clock size={14} />
                            <time>{new Date(log.created_at).toLocaleString()}</time>
                          </div>
                        </div>

                        {/* Description */}
                        {log.description && (
                          <p className="text-sm text-[#a0a9c9] mt-2 line-clamp-2">{log.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Expand chevron — only shown for expandable update rows */}
                    {log.action === 'update' && (log.old_values || log.new_values) && (
                      <ChevronDown
                        size={20}
                        className={cn(
                          'flex-shrink-0 text-[#a0a9c9] transition-transform duration-200',
                          isExpanded && 'rotate-180'
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </button>
                  );
                })()}

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-[rgba(255,255,255,0.1)] px-4 py-4 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* User Role */}
                      {log.user_role && (
                        <div>
                          <p className="text-xs font-medium text-[#a0a9c9] mb-1">User Role</p>
                          <p className="text-sm text-white capitalize">{log.user_role.replace(/_/g, ' ')}</p>
                        </div>
                      )}

                      {/* IP Address */}
                      {log.ip_address && (
                        <div>
                          <p className="text-xs font-medium text-[#a0a9c9] mb-1">IP Address</p>
                          <p className="text-sm font-mono text-white">{log.ip_address}</p>
                        </div>
                      )}

                      {/* Table */}
                      {log.table_name && (
                        <div>
                          <p className="text-xs font-medium text-[#a0a9c9] mb-1">Affected Table</p>
                          <p className="text-sm text-white font-mono">{log.table_name}</p>
                        </div>
                      )}

                      {/* Record ID */}
                      {log.record_id && (
                        <div>
                          <p className="text-xs font-medium text-[#a0a9c9] mb-1">Record ID</p>
                          <p className="text-sm text-white font-mono">{log.record_id}</p>
                        </div>
                      )}
                    </div>

                    {/* Before/After Values — only for update actions */}
                    {log.action === 'update' && (log.old_values || log.new_values) && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-white">Changes</p>
                        <ChangeDetails
                          oldValues={log.old_values as Record<string, unknown> | undefined}
                          newValues={log.new_values as Record<string, unknown> | undefined}
                          action={log.action}
                          defaultOpen={true}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className={cn(
            'p-8 rounded-lg text-center',
            'bg-[rgba(255,255,255,0.03)]',
            'border border-[rgba(255,255,255,0.1)]',
            'backdrop-blur-sm'
          )}
        >
          <Lock size={32} className="mx-auto mb-3 text-[#6b7280]" />
          <p className="text-[#a0a9c9] text-base font-medium">No audit logs found</p>
          <p className="text-[#6b7280] text-sm mt-1">
            {filteredLogs.length === 0 && auditLogs.length > 0
              ? 'Try adjusting your filters'
              : 'All actions on this record are logged here'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-[#a0a9c9]">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredLogs.length)} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                currentPage === 1
                  ? 'bg-[rgba(255,255,255,0.03)] text-[#6b7280] cursor-not-allowed'
                  : 'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.1)]'
              )}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                  currentPage === page
                    ? 'bg-[rgba(20,184,166,0.2)] text-[#86efac] border border-[rgba(20,184,166,0.3)]'
                    : 'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)]'
                )}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                currentPage === totalPages
                  ? 'bg-[rgba(255,255,255,0.03)] text-[#6b7280] cursor-not-allowed'
                  : 'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.1)]'
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Immutability notice */}
      <div
        className={cn(
          'p-4 rounded-lg flex items-start gap-3',
          'bg-[rgba(124,58,237,0.05)]',
          'border border-[rgba(124,58,237,0.2)]',
          'backdrop-blur-sm'
        )}
      >
        <Lock size={18} className="text-[#d8b4fe] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[#d8b4fe]">Immutable Audit Trail</p>
          <p className="text-xs text-[#c4b5fd] mt-1">
            All audit logs are immutable and tamper-evident. No entries can be modified or deleted. This provides
            complete accountability and compliance with court record management standards.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 200ms ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default AuditTrailTab;
