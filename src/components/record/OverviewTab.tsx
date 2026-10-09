'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { Shield, AlertTriangle, CheckCircle, User, Calendar, MapPin, Phone, Mail, FileText } from 'lucide-react';
import { colors, spacing } from '@/lib/design-tokens';
import type { CriminalRecord } from '@/types/database';

export interface OverviewTabProps {
  /** Criminal record data */
  record: CriminalRecord;
  /** Additional className */
  className?: string;
}

/**
 * OverviewTab — Displays general criminal record information.
 * Includes personal details, status, and quick summary information.
 */
export function OverviewTab({ record, className }: OverviewTabProps) {
  return (
    <div className={cn('py-6 space-y-6', className)}>
      {/* Personal Information Section */}
      <section>
        <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="flex gap-3">
            <User className="text-[#14b8a6] flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-[#a0a9c9]">Full Name</p>
              <p className="text-base font-medium text-white">{record.full_name}</p>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="flex gap-3">
            <Calendar className="text-[#14b8a6] flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-[#a0a9c9]">Date of Birth</p>
              <p className="text-base font-medium text-white">
                {new Date(record.date_of_birth).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Gender */}
          <div className="flex gap-3">
            <User className="text-[#14b8a6] flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-[#a0a9c9]">Gender</p>
              <p className="text-base font-medium text-white">
                {record.gender ? record.gender.charAt(0).toUpperCase() + record.gender.slice(1) : 'Not specified'}
              </p>
            </div>
          </div>

          {/* National ID */}
          <div className="flex gap-3">
            <FileText className="text-[#14b8a6] flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-[#a0a9c9]">National ID</p>
              <p className="text-base font-medium text-white font-mono">{record.national_id_number}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Status & Risk Information */}
      <section>
        <h3 className="text-lg font-semibold text-white mb-4">Status & Risk Assessment</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Record Status */}
          <div className={cn(
            'p-4 rounded-lg',
            'bg-[rgba(255,255,255,0.05)]',
            'border border-[rgba(255,255,255,0.1)]',
            'backdrop-blur-sm'
          )}>
            <p className="text-sm text-[#a0a9c9] mb-2">Record Status</p>
            <div className="flex items-center gap-2">
              <CheckCircle 
                size={20} 
                className={record.status === 'active' ? 'text-[#10b981]' : 'text-[#f59e0b]'}
              />
              <span className="text-base font-medium text-white">
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Risk Level */}
          <div className={cn(
            'p-4 rounded-lg',
            'bg-[rgba(255,255,255,0.05)]',
            'border border-[rgba(255,255,255,0.1)]',
            'backdrop-blur-sm'
          )}>
            <p className="text-sm text-[#a0a9c9] mb-2">Risk Level</p>
            <div className="flex items-center gap-2">
              <Shield 
                size={20} 
                className={
                  record.risk_level >= 4 ? 'text-[#dc2626]' :
                  record.risk_level >= 3 ? 'text-[#f59e0b]' :
                  'text-[#10b981]'
                }
              />
              <span className="text-base font-medium text-white">
                Level {record.risk_level}/5
              </span>
            </div>
          </div>

          {/* Repeat Offender Status */}
          {record.is_repeat_offender && (
            <div className={cn(
              'p-4 rounded-lg',
              'bg-[rgba(245,158,11,0.1)]',
              'border border-[rgba(245,158,11,0.2)]',
              'backdrop-blur-sm'
            )}>
              <p className="text-sm text-[#fbbf24] mb-2">Offender Status</p>
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-[#fbbf24]" />
                <span className="text-base font-medium text-[#fbbf24]">
                  Repeat Offender
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Additional Information */}
      {record.aliases && record.aliases.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-white mb-4">Known Aliases</h3>
          <div className="flex flex-wrap gap-2">
            {record.aliases.map((alias, idx) => (
              <div
                key={idx}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium',
                  'bg-[rgba(20,184,166,0.15)]',
                  'border border-[rgba(20,184,166,0.3)]',
                  'text-[#86efac]'
                )}
              >
                {alias}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Notes Section */}
      {record.notes && (
        <section>
          <h3 className="text-lg font-semibold text-white mb-4">Additional Notes</h3>
          <div className={cn(
            'p-4 rounded-lg',
            'bg-[rgba(255,255,255,0.05)]',
            'border border-[rgba(255,255,255,0.1)]',
            'backdrop-blur-sm'
          )}>
            <p className="text-sm text-[#a0a9c9] leading-relaxed">{record.notes}</p>
          </div>
        </section>
      )}
    </div>
  );
}

export default OverviewTab;
