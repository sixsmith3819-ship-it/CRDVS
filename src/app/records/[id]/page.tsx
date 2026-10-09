'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { RecordHeader } from '@/components/record/RecordHeader';
import { RecordTabs, TabDefinition } from '@/components/record/RecordTabs';
import { OverviewTab } from '@/components/record/OverviewTab';
import { ConvictionsTab } from '@/components/record/ConvictionsTab';
import { VerificationsTab } from '@/components/record/VerificationsTab';
import { RelatedRecordsTab } from '@/components/record/RelatedRecordsTab';
import { AuditTrailTab } from '@/components/record/AuditTrailTab';
import { EditRecordModal } from '@/components/record/EditRecordModal';
import type { CriminalRecord } from '@/types/database';
import { useAuth } from '@/lib/hooks/useAuth';

// Mock data for demonstration
const mockRecord: CriminalRecord = {
  id: '1',
  record_id: 'CR-2024001234',
  national_id_id: null,
  full_name: 'John Michael Thompson',
  date_of_birth: '1985-06-15',
  gender: 'male',
  national_id_number: '123-4567890AB',
  nationality: 'Zimbabwean',
  address: '123 Main Street, Harare',
  photo_url: null,
  fingerprint_hash: null,
  status: 'active',
  risk_level: 3,
  is_repeat_offender: true,
  prior_conviction_count: 2,
  aliases: ['J. Thompson', 'Johnny T', 'Mike Thompson'],
  notes: 'Subject has prior conviction for assault and robbery. Last verified on January 10, 2024.',
  created_by: null,
  updated_by: null,
  created_at: '2023-06-01',
  updated_at: '2024-01-10',
};

/**
 * Record Detail Page — Displays comprehensive criminal record with tabs.
 * 
 * Demonstrates:
 * - RecordHeader with photo and quick actions
 * - RecordTabs with five tab sections
 * - Responsive layout
 * - Badge counters on tabs
 * - Keyboard navigation
 * - Edit Record functionality with audit logging
 */
export default function RecordDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<CriminalRecord>(mockRecord);
  const { user, profile } = useAuth();

  // Define tabs with content and badge counts
  const tabs: TabDefinition[] = [
    {
      id: 'overview',
      label: 'Overview',
      content: <OverviewTab record={currentRecord} />,
    },
    {
      id: 'convictions',
      label: 'Convictions',
      badge: 3,
      content: <ConvictionsTab record={currentRecord} />,
    },
    {
      id: 'verifications',
      label: 'Verifications',
      badge: 12,
      content: <VerificationsTab record={currentRecord} />,
    },
    {
      id: 'related_records',
      label: 'Related Records',
      badge: 2,
      content: <RelatedRecordsTab record={currentRecord} />,
    },
    {
      id: 'audit_trail',
      label: 'Audit Trail',
      badge: 45,
      content: <AuditTrailTab record={currentRecord} recordId={currentRecord.id} />,
    },
  ];

  const handleRecordUpdate = (updatedRecord: CriminalRecord) => {
    setCurrentRecord(updatedRecord);
  };

  return (
    <Layout>
      <div className="space-y-6 py-6">
        {/* Record Header */}
        <RecordHeader
          record={currentRecord}
          canEdit={profile?.role === 'administrator'}
          canDelete={profile?.role === 'administrator'}
          lastVerified="2024-01-10"
          onEdit={() => setIsEditModalOpen(true)}
          onPrint={() => console.log('Print clicked')}
          onExport={() => console.log('Export clicked')}
          onArchive={() => console.log('Archive clicked')}
        />

        {/* Record Tabs */}
        <RecordTabs
          tabs={tabs}
          defaultTab="overview"
          onTabChange={(tabId) => {
            console.log('Tab changed to:', tabId);
            setActiveTab(tabId);
          }}
        />
      </div>

      {/* Edit Record Modal */}
      {user && profile && (
        <EditRecordModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          record={currentRecord}
          userId={user.id}
          userRole={profile.role}
          onSuccess={handleRecordUpdate}
        />
      )}
    </Layout>
  );
}
