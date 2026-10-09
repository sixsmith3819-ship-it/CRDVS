'use client';

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { AuditTrailTab } from '@/components/record/AuditTrailTab';
import type { CriminalRecord } from '@/types/database';

/**
 * Audit Trail Demo Page
 *
 * Demonstrates the audit trail functionality with mock data.
 * Shows how the audit trail displays all system actions on a record,
 * with filtering, pagination, and export options.
 */
export default function AuditTrailDemoPage() {
  // Mock criminal record
  const mockRecord: CriminalRecord = {
    id: 'test-record-123',
    record_id: 'CR-0001234B26',
    national_id_id: null,
    full_name: 'John Michael Thompson',
    date_of_birth: '1985-06-15',
    gender: 'male',
    national_id_number: '63-6323979A13',
    nationality: 'Zimbabwean',
    address: '123 Main Street, Harare',
    photo_url: null,
    fingerprint_hash: null,
    status: 'active',
    risk_level: 3,
    is_repeat_offender: true,
    prior_conviction_count: 2,
    aliases: ['J. Thompson', 'Johnny T'],
    notes: 'Subject has prior conviction for robbery',
    created_by: null,
    updated_by: null,
    created_at: '2023-06-01',
    updated_at: '2024-01-10',
  };

  return (
    <Layout>
      <div className="space-y-6 py-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Audit Trail Demo</h1>
          <p className="text-[#a0a9c9]">
            Interactive demonstration of the audit trail component showing immutable record history
          </p>
        </div>

        {/* Audit Trail Component */}
        <div className={`
          p-6 rounded-lg
          bg-[rgba(255,255,255,0.03)]
          border border-[rgba(255,255,255,0.1)]
          backdrop-blur-sm
        `}>
          <AuditTrailTab
            record={mockRecord}
            recordId={mockRecord.id}
            className="pt-0"
          />
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Features */}
          <div className={`
            p-6 rounded-lg
            bg-[rgba(255,255,255,0.03)]
            border border-[rgba(255,255,255,0.1)]
            backdrop-blur-sm
          `}>
            <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-[#a0a9c9]">
              <li>✓ Immutable audit trail (no modifications allowed)</li>
              <li>✓ Chronological timeline display</li>
              <li>✓ Action type indicators with color coding</li>
              <li>✓ Before/after value comparison</li>
              <li>✓ User and IP address tracking</li>
              <li>✓ Advanced filtering (action, user, date range)</li>
              <li>✓ Pagination support (10 items per page)</li>
              <li>✓ Export to CSV and PDF</li>
              <li>✓ Sensitive action highlighting</li>
              <li>✓ Full keyboard navigation</li>
              <li>✓ WCAG AA accessibility compliance</li>
              <li>✓ Glassmorphism dark theme styling</li>
            </ul>
          </div>

          {/* API Information */}
          <div className={`
            p-6 rounded-lg
            bg-[rgba(255,255,255,0.03)]
            border border-[rgba(255,255,255,0.1)]
            backdrop-blur-sm
          `}>
            <h3 className="text-lg font-semibold text-white mb-4">API Endpoint</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-mono text-[#14b8a6] mb-1">GET /api/audit/record/[recordId]</p>
                <p className="text-sm text-[#a0a9c9]">Fetches audit logs for a specific criminal record</p>
              </div>
              <div>
                <p className="text-xs font-medium text-white mb-1">Query Parameters:</p>
                <ul className="text-xs text-[#a0a9c9] space-y-1 ml-4">
                  <li>• action - Filter by action type</li>
                  <li>• user_id - Filter by user ID</li>
                  <li>• start_date - Filter by start date</li>
                  <li>• end_date - Filter by end date</li>
                  <li>• limit - Max results (default: 1000)</li>
                  <li>• offset - Pagination offset</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Types */}
          <div className={`
            p-6 rounded-lg
            bg-[rgba(255,255,255,0.03)]
            border border-[rgba(255,255,255,0.1)]
            backdrop-blur-sm
            md:col-span-2
          `}>
            <h3 className="text-lg font-semibold text-white mb-4">Action Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                'create', 'read', 'update', 'delete',
                'verify', 'generate_report', 'flag_duplicate', 'resolve_duplicate',
                'export', 'login', 'logout'
              ].map(action => (
                <div
                  key={action}
                  className="text-xs font-mono text-[#a0a9c9] bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded"
                >
                  {action}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Documentation Link */}
        <div className={`
          p-4 rounded-lg
          bg-[rgba(20,184,166,0.1)]
          border border-[rgba(20,184,166,0.2)]
          backdrop-blur-sm
        `}>
          <p className="text-sm text-[#86efac]">
            📚 Full documentation available in{' '}
            <code className="font-mono">src/components/record/AUDIT_TRAIL_README.md</code>
          </p>
        </div>
      </div>
    </Layout>
  );
}
