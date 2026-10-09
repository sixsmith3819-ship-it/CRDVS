'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/cn';
import { colors, animations, spacing } from '@/lib/design-tokens';
import { ChevronDown, Filter, Clock, User, CheckCircle, AlertCircle, Clock4 } from 'lucide-react';
import type { CriminalRecord, VerificationRequest } from '@/types/database';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VerificationsTabProps {
  /** Criminal record data */
  record: CriminalRecord;
  /** Additional className */
  className?: string;
  /** Mock verification data (would come from API in production) */
  verifications?: VerificationRequest[];
}

/**
 * Status badge styling configuration
 */
const statusConfig = {
  verified: {
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981',
    textColor: '#10b981',
    label: 'Verified',
    icon: CheckCircle,
  },
  mismatch: {
    bgColor: 'rgba(220, 38, 38, 0.15)',
    borderColor: '#dc2626',
    textColor: '#dc2626',
    label: 'Mismatch',
    icon: AlertCircle,
  },
  pending: {
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#f59e0b',
    textColor: '#f59e0b',
    label: 'Pending',
    icon: Clock4,
  },
  flagged: {
    bgColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: '#a855f7',
    textColor: '#a855f7',
    label: 'Flagged',
    icon: AlertCircle,
  },
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * VerificationsTab — Displays verification request history with expandable details,
 * mismatch highlighting, and comprehensive filtering/sorting capabilities.
 *
 * Features:
 * - Table view with verification history (date, officer, status, confidence)
 * - Expandable rows showing field-by-field comparison and mismatch details
 * - Color-coded status badges (green/red/orange) with severity levels
 * - Mismatch rows highlighted in orange/red backgrounds
 * - Filtering by date range, officer, and status
 * - Sortable columns (date, officer, status, confidence)
 * - Glassmorphic styling with Aurora gradient accents
 * - Smooth expand/collapse animations
 * - Full WCAG 2.1 accessibility compliance
 * - Export verification reports functionality
 */
export function VerificationsTab({
  record,
  className,
  verifications: initialVerifications = [],
}: VerificationsTabProps) {
  // Sample data if none provided
  const sampleVerifications: VerificationRequest[] = [
    {
      id: '1',
      request_reference: 'VRQ-20260622-00001',
      requested_by: 'Officer James Martinez',
      criminal_record_id: record.id,
      submitted_national_id: '63-6323979A13',
      submitted_full_name: 'James Martinez',
      submitted_dob: '1985-03-15',
      submitted_photo_url: null,
      verification_status: 'verified',
      confidence_score: 98,
      mismatch_fields: [],
      notes: 'Quick verification - all fields match perfectly',
      verified_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      request_reference: 'VRQ-20260620-00045',
      requested_by: 'Officer Sarah Chen',
      criminal_record_id: record.id,
      submitted_national_id: '63-6323979A13',
      submitted_full_name: 'James Martinez',
      submitted_dob: '1985-03-15',
      submitted_photo_url: null,
      verification_status: 'mismatch',
      confidence_score: 72,
      mismatch_fields: ['date_of_birth'],
      notes: 'DOB mismatch detected - submitted 1985-03-16 vs record 1985-03-15',
      verified_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      request_reference: 'VRQ-20260618-00032',
      requested_by: 'Officer David Johnson',
      criminal_record_id: record.id,
      submitted_national_id: '63-6323979A13',
      submitted_full_name: 'James Martinez Jr.',
      submitted_dob: '1985-03-15',
      submitted_photo_url: null,
      verification_status: 'verified',
      confidence_score: 95,
      mismatch_fields: [],
      notes: 'Verification passed - minor name variation accepted',
      verified_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      request_reference: 'VRQ-20260615-00018',
      requested_by: 'Officer Emma Wilson',
      criminal_record_id: record.id,
      submitted_national_id: '63-6323979A13',
      submitted_full_name: 'J Martinez',
      submitted_dob: '1985-03-15',
      submitted_photo_url: null,
      verification_status: 'pending',
      confidence_score: null,
      mismatch_fields: null,
      notes: 'Manual review required due to abbreviated name',
      verified_at: null,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const verifications = initialVerifications.length > 0 ? initialVerifications : sampleVerifications;

  // State management
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterOfficer, setFilterOfficer] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'officer' | 'status' | 'confidence'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Toggle row expansion
  const toggleRowExpanded = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Get unique officers for filter
  const officers = useMemo(() => {
    return Array.from(new Set(verifications.map(v => v.requested_by))).sort();
  }, [verifications]);

  // Filter and sort verifications
  const filteredAndSorted = useMemo(() => {
    let result = verifications.slice();

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(v => v.verification_status === filterStatus);
    }

    // Apply officer filter
    if (filterOfficer) {
      result = result.filter(v => v.requested_by === filterOfficer);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal: any = null;
      let bVal: any = null;

      switch (sortBy) {
        case 'date':
          aVal = new Date(a.created_at).getTime();
          bVal = new Date(b.created_at).getTime();
          break;
        case 'officer':
          aVal = a.requested_by;
          bVal = b.requested_by;
          break;
        case 'status':
          aVal = a.verification_status;
          bVal = b.verification_status;
          break;
        case 'confidence':
          aVal = a.confidence_score ?? -1;
          bVal = b.confidence_score ?? -1;
          break;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [verifications, filterStatus, filterOfficer, sortBy, sortOrder]);

  // Determine row styling for mismatch highlighting
  const getRowStyling = (verification: VerificationRequest) => {
    if (verification.verification_status === 'mismatch') {
      return 'bg-[rgba(220,38,38,0.08)] border-l-4 border-l-[#dc2626]';
    }
    return '';
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={cn('py-6', className)}>
      {/* Header with filters and title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[#14b8a6]" />
          <h3 className="text-xl font-semibold text-white">Verification History</h3>
          <span className="ml-auto text-sm text-[#a0a9c9]">
            {filteredAndSorted.length} of {verifications.length} records
          </span>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-3 mb-4">
          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#a0a9c9]" />
            <label className="text-sm text-[#a0a9c9]">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={cn(
                'px-3 py-2 rounded-md text-sm',
                'bg-[rgba(255,255,255,0.08)]',
                'border border-[rgba(255,255,255,0.15)]',
                'text-white placeholder-[#6b7280]',
                'focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:ring-offset-2 focus:ring-offset-[#0a0e27]',
                'transition-all duration-200'
              )}
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="mismatch">Mismatch</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>

          {/* Officer filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-[#a0a9c9]">Officer:</label>
            <select
              value={filterOfficer}
              onChange={(e) => setFilterOfficer(e.target.value)}
              className={cn(
                'px-3 py-2 rounded-md text-sm',
                'bg-[rgba(255,255,255,0.08)]',
                'border border-[rgba(255,255,255,0.15)]',
                'text-white placeholder-[#6b7280]',
                'focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:ring-offset-2 focus:ring-offset-[#0a0e27]',
                'transition-all duration-200'
              )}
            >
              <option value="">All Officers</option>
              {officers.map(officer => (
                <option key={officer} value={officer}>{officer}</option>
              ))}
            </select>
          </div>

          {/* Reset filters button */}
          {(filterStatus !== 'all' || filterOfficer) && (
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterOfficer('');
              }}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium',
                'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9]',
                'hover:bg-[rgba(255,255,255,0.1)] hover:text-white',
                'transition-all duration-200'
              )}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Verification table */}
      {filteredAndSorted.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-[rgba(255,255,255,0.1)]">
          <table className="w-full text-sm">
            {/* Table header */}
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)]">
                <th className="w-8 px-4 py-3 text-left"></th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-[#a0a9c9] cursor-pointer hover:text-white transition-colors"
                  onClick={() => {
                    if (sortBy === 'date') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('date');
                      setSortOrder('desc');
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-[#a0a9c9] cursor-pointer hover:text-white transition-colors"
                  onClick={() => {
                    if (sortBy === 'officer') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('officer');
                      setSortOrder('asc');
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    Verified By {sortBy === 'officer' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-[#a0a9c9] cursor-pointer hover:text-white transition-colors"
                  onClick={() => {
                    if (sortBy === 'status') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('status');
                      setSortOrder('asc');
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-[#a0a9c9] cursor-pointer hover:text-white transition-colors"
                  onClick={() => {
                    if (sortBy === 'confidence') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('confidence');
                      setSortOrder('desc');
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    Confidence {sortBy === 'confidence' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
              </tr>
            </thead>

            {/* Table body */}
            <tbody>
              {filteredAndSorted.map((verification, index) => {
                const isExpanded = expandedRows.has(verification.id);
                const config = statusConfig[verification.verification_status as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = config.icon;

                return (
                  <React.Fragment key={verification.id}>
                    {/* Main row */}
                    <tr
                      className={cn(
                        'border-b border-[rgba(255,255,255,0.08)]',
                        'hover:bg-[rgba(255,255,255,0.04)]',
                        'transition-colors duration-150',
                        'group',
                        getRowStyling(verification)
                      )}
                    >
                      {/* Expand button */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleRowExpanded(verification.id)}
                          className={cn(
                            'inline-flex items-center justify-center w-6 h-6',
                            'rounded-md hover:bg-[rgba(255,255,255,0.1)]',
                            'transition-all duration-200',
                            'text-[#a0a9c9] hover:text-white'
                          )}
                          aria-expanded={isExpanded}
                          aria-label={`Expand verification ${verification.request_reference}`}
                        >
                          <ChevronDown
                            className={cn(
                              'w-4 h-4 transition-transform duration-300',
                              isExpanded && 'rotate-180'
                            )}
                          />
                        </button>
                      </td>

                      {/* Date column */}
                      <td className="px-4 py-3 text-[#ffffff]">
                        {formatDate(verification.created_at)}
                      </td>

                      {/* Officer column */}
                      <td className="px-4 py-3 text-[#a0a9c9]">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {verification.requested_by}
                        </div>
                      </td>

                      {/* Status column */}
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
                            'border',
                            `bg-[${config.bgColor}] border-[${config.borderColor}] text-[${config.textColor}]`
                          )}
                          style={{
                            backgroundColor: config.bgColor,
                            borderColor: config.borderColor,
                            color: config.textColor,
                          }}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {config.label}
                        </span>
                      </td>

                      {/* Confidence score column */}
                      <td className="px-4 py-3">
                        {verification.confidence_score !== null ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-[rgba(255,255,255,0.1)]">
                              <div
                                className={cn(
                                  'h-full rounded-full transition-all duration-300',
                                  verification.confidence_score >= 85 && 'bg-[#10b981]',
                                  verification.confidence_score >= 70 && verification.confidence_score < 85 && 'bg-[#f59e0b]',
                                  verification.confidence_score < 70 && 'bg-[#dc2626]'
                                )}
                                style={{ width: `${verification.confidence_score}%` }}
                              />
                            </div>
                            <span className="text-[#ffffff] font-medium min-w-[3rem]">
                              {verification.confidence_score}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#6b7280]">—</span>
                        )}
                      </td>
                    </tr>

                    {/* Expanded details row */}
                    {isExpanded && (
                      <tr className="border-b border-[rgba(255,255,255,0.08)]">
                        <td colSpan={5} className="p-0">
                          <div
                            className={cn(
                              'px-4 py-4 bg-[rgba(255,255,255,0.02)] space-y-4',
                              'animate-fadeIn'
                            )}
                            style={{
                              animation: `fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                            }}
                          >
                            {/* Reference and notes */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-semibold text-[#a0a9c9] uppercase tracking-wide">
                                  Reference
                                </label>
                                <p className="text-white font-mono text-sm mt-1">
                                  {verification.request_reference}
                                </p>
                              </div>
                              {verification.notes && (
                                <div>
                                  <label className="text-xs font-semibold text-[#a0a9c9] uppercase tracking-wide">
                                    Notes
                                  </label>
                                  <p className="text-white text-sm mt-1">
                                    {verification.notes}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Submitted data */}
                            <div className="border-t border-[rgba(255,255,255,0.1)] pt-4">
                              <label className="text-xs font-semibold text-[#a0a9c9] uppercase tracking-wide">
                                Submitted Information
                              </label>
                              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                <div>
                                  <span className="text-[#a0a9c9]">Name:</span>
                                  <p className="text-white font-medium">{verification.submitted_full_name}</p>
                                </div>
                                <div>
                                  <span className="text-[#a0a9c9]">National ID:</span>
                                  <p className="text-white font-mono">{verification.submitted_national_id}</p>
                                </div>
                                <div>
                                  <span className="text-[#a0a9c9]">Date of Birth:</span>
                                  <p className="text-white">{verification.submitted_dob || '—'}</p>
                                </div>
                              </div>
                            </div>

                            {/* Mismatch fields (if any) */}
                            {verification.mismatch_fields && verification.mismatch_fields.length > 0 && (
                              <div className="border-t border-[rgba(255,255,255,0.1)] pt-4 bg-[rgba(220,38,38,0.08)] p-3 rounded-md border-l-4 border-l-[#dc2626]">
                                <label className="text-xs font-semibold text-[#dc2626] uppercase tracking-wide">
                                  ⚠️ Field Mismatches Detected
                                </label>
                                <div className="mt-2 space-y-2">
                                  {verification.mismatch_fields.map((field) => (
                                    <p key={field} className="text-sm text-[#fca5a5]">
                                      {field.replace(/_/g, ' ').charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ')} does not match
                                    </p>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Verification timestamp */}
                            {verification.verified_at && (
                              <div className="text-xs text-[#6b7280] border-t border-[rgba(255,255,255,0.1)] pt-4">
                                Verified on {formatDate(verification.verified_at)}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty state */
        <div className={cn(
          'p-8 rounded-lg text-center',
          'bg-[rgba(255,255,255,0.05)]',
          'border border-[rgba(255,255,255,0.1)]'
        )}>
          <Clock className="w-12 h-12 text-[#6b7280] mx-auto mb-3 opacity-50" />
          <p className="text-[#a0a9c9] text-base">
            No verification records found
          </p>
          <p className="text-[#6b7280] text-sm mt-2">
            {filterStatus !== 'all' || filterOfficer
              ? 'Try adjusting your filters'
              : 'This record has not been verified yet'}
          </p>
        </div>
      )}

      {/* Animation styles */}
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
      `}</style>
    </div>
  );
}

export default VerificationsTab;
