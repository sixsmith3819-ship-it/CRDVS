'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { 
  Loader2, 
  Link2, 
  Unlink2, 
  Merge, 
  CheckCircle, 
  AlertCircle,
  Zap,
  User,
  Calendar,
  FileText
} from 'lucide-react';
import type { CriminalRecord } from '@/types/database';

export interface RelatedRecordsTabProps {
  /** Criminal record data */
  record: CriminalRecord;
  /** Additional className */
  className?: string;
}

/**
 * DuplicateCard — Individual duplicate/related record card with match details
 */
function DuplicateCard({
  duplicate,
  recordId,
  onLink,
  onUnlink,
  onMerge,
  isLoading,
}: {
  duplicate: any;
  recordId: string;
  onLink: () => void;
  onUnlink: () => void;
  onMerge: () => void;
  isLoading: boolean;
}) {
  const relatedRecord = duplicate.record_a?.id === recordId ? duplicate.record_b : duplicate.record_a;
  const similarity = duplicate.similarity_score || 0;

  // Determine confidence level and color
  const getConfidenceLevel = (score: number) => {
    if (score >= 90) return { level: 'High', color: 'from-[#10b981] to-[#059669]', badge: 'bg-[#10b981]/20 text-[#86efac]', icon: '🟢' };
    if (score >= 70) return { level: 'Medium', color: 'from-[#f59e0b] to-[#d97706]', badge: 'bg-[#f59e0b]/20 text-[#fcd34d]', icon: '🟡' };
    return { level: 'Low', color: 'from-[#ef4444] to-[#dc2626]', badge: 'bg-[#ef4444]/20 text-[#fca5a5]', icon: '🔴' };
  };

  const confidence = getConfidenceLevel(similarity);
  const statusDisplay = duplicate.flag_status === 'confirmed_duplicate' ? 'Confirmed' : 
                       duplicate.flag_status === 'merged' ? 'Merged' :
                       duplicate.flag_status === 'false_positive' ? 'False Positive' :
                       'Pending Review';

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg',
        'bg-gradient-to-br from-[rgba(255,255,255,0.08)] via-[rgba(255,255,255,0.04)] to-transparent',
        'border border-[rgba(255,255,255,0.12)]',
        'backdrop-blur-md',
        'hover:border-[rgba(20,184,166,0.4)]',
        'transition-all duration-300 ease-out',
        'p-5'
      )}
      style={{
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 16px rgba(0,0,0,0.15)'
      }}
    >
      {/* Aurora glow on hover */}
      <div
        className={cn(
          'absolute -inset-0.5 rounded-lg',
          `bg-gradient-to-r ${confidence.color}`,
          'opacity-0 group-hover:opacity-10',
          'transition-opacity duration-300',
          'pointer-events-none',
          '-z-10'
        )}
      />

      {/* Header: Name and Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-white mb-1">
            {relatedRecord?.full_name || 'Unknown'}
          </h4>
          <p className="text-xs text-[#a0a9c9]">Record ID: {relatedRecord?.record_id}</p>
        </div>

        {/* Status badge */}
        <div
          className={cn(
            'px-2.5 py-1 rounded-full',
            'text-xs font-semibold whitespace-nowrap',
            duplicate.flag_status === 'confirmed_duplicate' && 'bg-[#10b981]/20 text-[#86efac]',
            duplicate.flag_status === 'merged' && 'bg-[#3b82f6]/20 text-[#93c5fd]',
            duplicate.flag_status === 'false_positive' && 'bg-[#6b7280]/20 text-[#d1d5db]',
            duplicate.flag_status === 'pending_review' && 'bg-[#f59e0b]/20 text-[#fcd34d]'
          )}
        >
          {statusDisplay}
        </div>
      </div>

      {/* Similarity Score */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#a0a9c9]">Match Similarity</span>
          <span className={cn(
            'text-base font-bold',
            similarity >= 90 && 'text-[#10b981]',
            similarity >= 70 && similarity < 90 && 'text-[#f59e0b]',
            similarity < 70 && 'text-[#ef4444]'
          )}>
            {similarity}%
          </span>
        </div>

        {/* Similarity bar */}
        <div className="h-2 rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              `bg-gradient-to-r ${confidence.color}`
            )}
            style={{ width: `${similarity}%` }}
          />
        </div>

        {/* Confidence level */}
        <div className="flex items-center gap-1">
          <span className="text-2xl">{confidence.icon}</span>
          <span className="text-xs font-semibold text-[#a0a9c9]">{confidence.level} Confidence</span>
        </div>
      </div>

      {/* Match Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-[rgba(255,255,255,0.1)]">
        {/* Name Match */}
        <div className="flex items-start gap-2">
          <div className={cn(
            'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
            duplicate.name_similarity > 80 ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'
          )}>
            {duplicate.name_similarity > 80 ? '✓' : '✗'}
          </div>
          <div>
            <p className="text-xs font-medium text-[#a0a9c9]">Name</p>
            <p className="text-xs text-[#6b7280]">{duplicate.name_similarity || 0}%</p>
          </div>
        </div>

        {/* DOB Match */}
        <div className="flex items-start gap-2">
          <div className={cn(
            'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
            duplicate.dob_match ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#f59e0b]/20 text-[#f59e0b]'
          )}>
            {duplicate.dob_match ? '✓' : '?'}
          </div>
          <div>
            <p className="text-xs font-medium text-[#a0a9c9]">Date of Birth</p>
            <p className="text-xs text-[#6b7280]">{duplicate.dob_match ? 'Match' : 'Mismatch'}</p>
          </div>
        </div>

        {/* National ID Match */}
        <div className="flex items-start gap-2">
          <div className={cn(
            'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
            duplicate.national_id_match ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#f59e0b]/20 text-[#f59e0b]'
          )}>
            {duplicate.national_id_match ? '✓' : '?'}
          </div>
          <div>
            <p className="text-xs font-medium text-[#a0a9c9]">National ID</p>
            <p className="text-xs text-[#6b7280]">{duplicate.national_id_match ? 'Match' : 'Mismatch'}</p>
          </div>
        </div>

        {/* Fingerprint Match */}
        <div className="flex items-start gap-2">
          <div className={cn(
            'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
            duplicate.fingerprint_match ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#6b7280]/20 text-[#6b7280]'
          )}>
            {duplicate.fingerprint_match ? '✓' : '–'}
          </div>
          <div>
            <p className="text-xs font-medium text-[#a0a9c9]">Fingerprint</p>
            <p className="text-xs text-[#6b7280]">{duplicate.fingerprint_match ? 'Match' : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Related Record Summary */}
      <div className="bg-[rgba(255,255,255,0.03)] rounded-lg p-3 mb-4 space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <User className="text-[#14b8a6]" size={14} />
          <span className="text-[#a0a9c9]">National ID:</span>
          <span className="text-white font-mono">{relatedRecord?.national_id_number}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Calendar className="text-[#14b8a6]" size={14} />
          <span className="text-[#a0a9c9]">DOB:</span>
          <span className="text-white">{new Date(relatedRecord?.date_of_birth).toLocaleDateString()}</span>
        </div>
        {relatedRecord?.risk_level && (
          <div className="flex items-center gap-2 text-xs">
            <AlertCircle className="text-[#f59e0b]" size={14} />
            <span className="text-[#a0a9c9]">Risk Level:</span>
            <span className={cn(
              'font-semibold',
              relatedRecord.risk_level >= 4 && 'text-[#ef4444]',
              relatedRecord.risk_level >= 3 && relatedRecord.risk_level < 4 && 'text-[#f59e0b]',
              relatedRecord.risk_level < 3 && 'text-[#10b981]'
            )}>
              {relatedRecord.risk_level}/5
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {similarity >= 90 && duplicate.flag_status !== 'merged' && (
          <button
            onClick={onMerge}
            disabled={isLoading}
            className={cn(
              'flex-1 min-w-[120px] flex items-center justify-center gap-2',
              'px-3 py-2 rounded-lg text-xs font-semibold',
              'bg-gradient-to-r from-[#14b8a6] to-[#10b981]',
              'text-white',
              'hover:shadow-lg hover:shadow-[#14b8a6]/30',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isLoading && 'opacity-50'
            )}
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Merging...</span>
              </>
            ) : (
              <>
                <Merge size={14} />
                <span>Merge</span>
              </>
            )}
          </button>
        )}

        {duplicate.flag_status !== 'merged' && similarity < 90 && (
          <button
            onClick={onLink}
            disabled={isLoading}
            className={cn(
              'flex-1 min-w-[120px] flex items-center justify-center gap-2',
              'px-3 py-2 rounded-lg text-xs font-semibold',
              'bg-[#3b82f6]/20 text-[#93c5fd]',
              'border border-[#3b82f6]/40',
              'hover:bg-[#3b82f6]/30 hover:border-[#3b82f6]/60',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Link2 size={14} />
            <span>Link</span>
          </button>
        )}

        {duplicate.flag_status !== 'false_positive' && (
          <button
            onClick={onUnlink}
            disabled={isLoading}
            className={cn(
              'flex-1 min-w-[120px] flex items-center justify-center gap-2',
              'px-3 py-2 rounded-lg text-xs font-semibold',
              'bg-[#6b7280]/20 text-[#d1d5db]',
              'border border-[#6b7280]/40',
              'hover:bg-[#6b7280]/30 hover:border-[#6b7280]/60',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Unlink2 size={14} />
            <span>Dismiss</span>
          </button>
        )}

        {duplicate.flag_status === 'confirmed_duplicate' && (
          <button
            className={cn(
              'flex-1 min-w-[120px] flex items-center justify-center gap-2',
              'px-3 py-2 rounded-lg text-xs font-semibold',
              'bg-[#10b981]/20 text-[#86efac]',
              'border border-[#10b981]/40',
              'cursor-default'
            )}
          >
            <CheckCircle size={14} />
            <span>Linked</span>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * RelatedRecordsTab — Displays related or duplicate records with similarity scores.
 * 
 * Features:
 * - Duplicate record cards with match similarity scores
 * - Visual confidence indicators (high/medium/low match)
 * - Quick linking/unlinking actions
 * - Merge suggestion buttons for high-confidence matches
 * - Status badges showing merge status
 * - Glassmorphism styling with Aurora accents
 * - Smooth animations and micro-interactions
 * - Responsive layout for all devices
 */
export function RelatedRecordsTab({ record, className }: RelatedRecordsTabProps) {
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending_review' | 'confirmed_duplicate' | 'false_positive' | 'merged'>('all');

  // Fetch related records on mount
  useEffect(() => {
    const fetchDuplicates = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/duplicates?status=${filterStatus === 'all' ? '' : filterStatus}`);
        if (!response.ok) throw new Error('Failed to fetch duplicates');

        const data = await response.json();
        // Filter to show only duplicates related to this record
        const filtered = data.flags.filter((flag: any) => 
          flag.record_a?.id === record.id || flag.record_b?.id === record.id
        );
        setDuplicates(filtered);
      } catch (err) {
        console.error('Error fetching duplicates:', err);
        setError(err instanceof Error ? err.message : 'Failed to load related records');
      } finally {
        setLoading(false);
      }
    };

    fetchDuplicates();
  }, [record.id, filterStatus]);

  // Handle merge action
  const handleMerge = async (duplicateId: string) => {
    setActionLoading(duplicateId);
    try {
      const response = await fetch(`/api/duplicates/${duplicateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flag_status: 'merged' }),
      });

      if (!response.ok) throw new Error('Failed to merge records');

      // Update local state
      setDuplicates(prev => prev.map(d => 
        d.id === duplicateId ? { ...d, flag_status: 'merged' } : d
      ));
    } catch (err) {
      console.error('Error merging records:', err);
      setError(err instanceof Error ? err.message : 'Failed to merge records');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle link action
  const handleLink = async (duplicateId: string) => {
    setActionLoading(duplicateId);
    try {
      const response = await fetch(`/api/duplicates/${duplicateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flag_status: 'confirmed_duplicate' }),
      });

      if (!response.ok) throw new Error('Failed to link records');

      setDuplicates(prev => prev.map(d => 
        d.id === duplicateId ? { ...d, flag_status: 'confirmed_duplicate' } : d
      ));
    } catch (err) {
      console.error('Error linking records:', err);
      setError(err instanceof Error ? err.message : 'Failed to link records');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle dismiss action
  const handleDismiss = async (duplicateId: string) => {
    setActionLoading(duplicateId);
    try {
      const response = await fetch(`/api/duplicates/${duplicateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flag_status: 'false_positive' }),
      });

      if (!response.ok) throw new Error('Failed to dismiss record');

      setDuplicates(prev => prev.map(d => 
        d.id === duplicateId ? { ...d, flag_status: 'false_positive' } : d
      ));
    } catch (err) {
      console.error('Error dismissing record:', err);
      setError(err instanceof Error ? err.message : 'Failed to dismiss record');
    } finally {
      setActionLoading(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={cn('py-8 space-y-4', className)}>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={cn(
              'rounded-lg h-40',
              'bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.04)]',
              'border border-[rgba(255,255,255,0.1)]',
              'animate-pulse'
            )}
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (duplicates.length === 0) {
    return (
      <div className={cn('py-12', className)}>
        <div className={cn(
          'p-8 rounded-lg text-center',
          'bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)]',
          'border border-[rgba(255,255,255,0.1)]',
          'backdrop-blur-md'
        )}>
          <div className="flex justify-center mb-4">
            <Zap className="text-[#14b8a6]" size={32} />
          </div>
          <p className="text-[#a0a9c9] text-base font-medium mb-1">
            No related records found
          </p>
          <p className="text-[#6b7280] text-sm">
            This record appears to be unique in the system
          </p>
        </div>
      </div>
    );
  }

  // Status filter tabs
  const statusOptions = [
    { value: 'all', label: 'All', icon: '📊' },
    { value: 'pending_review', label: 'Pending', icon: '⏳' },
    { value: 'confirmed_duplicate', label: 'Linked', icon: '🔗' },
    { value: 'merged', label: 'Merged', icon: '✓' },
  ];

  return (
    <div className={cn('py-6 space-y-6', className)}>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-[rgba(255,255,255,0.1)]">
        {statusOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setFilterStatus(option.value as any)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium',
              'transition-all duration-200',
              filterStatus === option.value
                ? 'bg-gradient-to-r from-[#14b8a6] to-[#10b981] text-white shadow-lg shadow-[#14b8a6]/30'
                : 'bg-[rgba(255,255,255,0.05)] text-[#a0a9c9] hover:bg-[rgba(255,255,255,0.08)]'
            )}
          >
            <span className="mr-2">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 rounded-lg bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#fca5a5] text-sm">
          {error}
        </div>
      )}

      {/* Duplicate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {duplicates.map(duplicate => (
          <DuplicateCard
            key={duplicate.id}
            duplicate={duplicate}
            recordId={record.id}
            onLink={() => handleLink(duplicate.id)}
            onUnlink={() => handleDismiss(duplicate.id)}
            onMerge={() => handleMerge(duplicate.id)}
            isLoading={actionLoading === duplicate.id}
          />
        ))}
      </div>

      {/* Info footer */}
      <div className={cn(
        'p-4 rounded-lg',
        'bg-[rgba(20,184,166,0.1)]',
        'border border-[rgba(20,184,166,0.2)]',
        'text-[#86efac] text-xs'
      )}>
        <p className="font-medium mb-1">💡 Tip</p>
        <p>High-confidence matches (90%+) can be automatically merged. Review medium and low-confidence matches carefully before taking action.</p>
      </div>
    </div>
  );
}

export default RelatedRecordsTab;
