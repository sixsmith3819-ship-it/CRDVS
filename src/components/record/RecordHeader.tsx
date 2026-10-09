'use client';

import React from 'react';
import { Edit, Printer, Download, Archive, User, Calendar, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/utils/format';
import { getRiskLabel, getRiskColor } from '@/types';
import type { CriminalRecord } from '@/types/database';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RecordHeaderProps {
  /** The criminal record data */
  record: CriminalRecord;
  /** Whether the current user has edit permissions */
  canEdit?: boolean;
  /** Whether the current user has admin permissions */
  canDelete?: boolean;
  /** Callback when edit button is clicked */
  onEdit?: () => void;
  /** Callback when print action is triggered */
  onPrint?: () => void;
  /** Callback when export action is triggered */
  onExport?: () => void;
  /** Callback when archive action is triggered */
  onArchive?: () => void;
  /** Last verification timestamp */
  lastVerified?: string;
  /** Additional className for styling */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * RecordHeader — Premium header section for individual criminal record pages.
 *
 * Features:
 * - Individual's photo with elegant glassmorphic border
 * - Key identification details (name, ID, DOB)
 * - Current status indicator with color coding
 * - Last verification timestamp
 * - Quick action buttons with proper permissions
 * - Aurora gradient accents and dark spatial design
 */
export function RecordHeader({
  record,
  canEdit = false,
  canDelete = false,
  onEdit,
  onPrint,
  onExport,
  onArchive,
  lastVerified,
  className,
}: RecordHeaderProps) {
  // Generate fallback initials from full name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Format the status for display
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase();
  };

  return (
    <div
      className={cn(
        // Base glass container with Aurora accents
        'relative overflow-hidden rounded-2xl',
        'bg-gradient-to-br from-[rgba(20,184,166,0.08)] via-[rgba(124,58,237,0.06)] to-[rgba(16,185,129,0.08)]',
        'backdrop-blur-md',
        'border border-[rgba(255,255,255,0.15)]',
        'shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]',
        className,
      )}
    >
      {/* Aurora gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(20,184,166,0.05)] to-transparent opacity-60" />

      {/* Content container */}
      <div className="relative z-10 p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Photo Section */}
          <div className="flex-shrink-0">
            <div className="relative">
              {/* Photo container with elegant glassmorphic border */}
              <div
                className={cn(
                  'w-32 h-32 rounded-2xl overflow-hidden',
                  'bg-gradient-to-br from-[rgba(255,255,255,0.12)] to-[rgba(255,255,255,0.06)]',
                  'border-2 border-[rgba(255,255,255,0.2)]',
                  'shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]',
                  'backdrop-blur-sm',
                )}
              >
                {record.photo_url ? (
                  <img
                    src={record.photo_url}
                    alt={`${record.full_name} profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Fallback avatar with initials
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#14b8a6] to-[#7c3aed] text-white font-bold text-2xl">
                    {getInitials(record.full_name)}
                  </div>
                )}
              </div>

              {/* Status indicator dot */}
              <div className="absolute -bottom-1 -right-1">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border-2 border-[#0a0e27]',
                    'flex items-center justify-center',
                    record.status === 'active' ? 'bg-[#10b981]' :
                    record.status === 'pending' ? 'bg-[#f59e0b]' :
                    record.status === 'archived' ? 'bg-[#6b7280]' :
                    'bg-[#dc2626]'
                  )}
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Identification Details */}
          <div className="flex-1 min-w-0">
            <div className="space-y-6">
              {/* Name and primary info */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                  {record.full_name}
                </h1>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-[#a0a9c9]">
                    <User size={14} className="text-[#14b8a6]" />
                    <span className="font-medium">ID:</span>
                    <span className="text-white font-mono">{record.record_id}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[#a0a9c9]">
                    <Calendar size={14} className="text-[#14b8a6]" />
                    <span className="font-medium">DOB:</span>
                    <span className="text-white">{formatDate(record.date_of_birth)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[#a0a9c9]">
                    <Shield size={14} className="text-[#14b8a6]" />
                    <span className="font-medium">National ID:</span>
                    <span className="text-white font-mono">{record.national_id_number}</span>
                  </div>
                </div>
              </div>

              {/* Status badges and indicators */}
              <div className="flex flex-wrap gap-3">
                <StatusBadge
                  status={record.status === 'active' ? 'verified' : 
                         record.status === 'pending' ? 'pending' :
                         record.status === 'flagged' ? 'flagged' : 'unverified'}
                  size="md"
                />

                <div
                  className={cn(
                    'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
                    'bg-gradient-to-r from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0.05)]',
                    'border border-[rgba(255,255,255,0.2)]',
                    'backdrop-blur-sm',
                    getRiskColor(record.risk_level).includes('red') ? 'text-[#fca5a5]' :
                    getRiskColor(record.risk_level).includes('orange') ? 'text-[#fbbf24]' :
                    getRiskColor(record.risk_level).includes('yellow') ? 'text-[#facc15]' :
                    'text-[#86efac]'
                  )}
                >
                  <Shield size={14} />
                  Risk: {getRiskLabel(record.risk_level)}
                </div>

                {record.is_repeat_offender && (
                  <div
                    className={cn(
                      'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
                      'bg-gradient-to-r from-[rgba(251,191,36,0.2)] to-[rgba(245,158,11,0.1)]',
                      'border border-[rgba(251,191,36,0.3)]',
                      'text-[#fbbf24]',
                      'backdrop-blur-sm'
                    )}
                  >
                    Repeat Offender
                  </div>
                )}
              </div>

              {/* Last verification timestamp */}
              {lastVerified && (
                <div className="flex items-center gap-2 text-sm text-[#a0a9c9]">
                  <Clock size={14} className="text-[#7c3aed]" />
                  <span>Last verified: {formatDate(lastVerified)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex-shrink-0">
            <div className="flex flex-col gap-3 lg:min-w-[200px]">
              <h3 className="text-sm font-medium text-[#a0a9c9] mb-1">Quick Actions</h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {canEdit && (
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Edit size={14} />}
                    onClick={onEdit}
                    className="justify-start"
                  >
                    Edit
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Printer size={14} />}
                  onClick={onPrint}
                  className="justify-start"
                >
                  Print
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Download size={14} />}
                  onClick={onExport}
                  className="justify-start"
                >
                  Export
                </Button>

                {canDelete && (
                  <Button
                    variant="tertiary"
                    size="sm"
                    leftIcon={<Archive size={14} />}
                    onClick={onArchive}
                    className="justify-start text-[#a0a9c9] hover:text-[#f59e0b]"
                  >
                    Archive
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle animated border glow */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none">
        <div
          className={cn(
            'absolute inset-0 rounded-2xl opacity-40',
            'bg-gradient-to-r from-transparent via-[rgba(20,184,166,0.3)] to-transparent',
            'animate-pulse'
          )}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.3), transparent)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  );
}

export default RecordHeader;