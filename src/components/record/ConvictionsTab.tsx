'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import type { CriminalRecord } from '@/types/database';

export interface ConvictionsTabProps {
  /** Criminal record data */
  record: CriminalRecord;
  /** Additional className */
  className?: string;
}

/**
 * ConvictionsTab — Displays conviction history and sentencing details.
 */
export function ConvictionsTab({ record, className }: ConvictionsTabProps) {
  return (
    <div className={cn('py-6', className)}>
      <div className={cn(
        'p-8 rounded-lg text-center',
        'bg-[rgba(255,255,255,0.05)]',
        'border border-[rgba(255,255,255,0.1)]',
        'backdrop-blur-sm'
      )}>
        <p className="text-[#a0a9c9] text-base">
          Conviction history will be displayed here with timeline visualization
        </p>
        <p className="text-[#6b7280] text-sm mt-2">
          Use the ConvictionTimeline component for enhanced timeline view
        </p>
      </div>
    </div>
  );
}

export default ConvictionsTab;
