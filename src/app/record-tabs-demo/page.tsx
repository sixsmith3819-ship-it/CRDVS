'use client';

import React, { useState } from 'react';
import { RecordTabs, TabDefinition } from '@/components/record/RecordTabs';
import { cn } from '@/lib/cn';

/**
 * RecordTabs Demo — Showcases the tab navigation component.
 * 
 * Features demonstrated:
 * - Five tabs with different content
 * - Badge counters on tabs
 * - Active state with Aurora gradient underline
 * - Smooth animations and transitions
 * - Keyboard navigation (arrow keys, home/end)
 * - Mobile responsive scrolling
 * - Glassmorphism effects on inactive tabs
 */
export default function RecordTabsDemo() {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample tab content components
  const OverviewContent = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Overview</h3>
      <div className={cn(
        'p-6 rounded-lg',
        'bg-[rgba(255,255,255,0.05)]',
        'border border-[rgba(255,255,255,0.1)]',
        'backdrop-blur-sm'
      )}>
        <p className="text-[#a0a9c9]">
          This tab displays a general overview of the criminal record with personal information,
          status indicators, and risk assessment. Use this as the primary entry point for
          reviewing a record.
        </p>
      </div>
    </div>
  );

  const ConvictionsContent = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Convictions</h3>
      <div className={cn(
        'p-6 rounded-lg',
        'bg-[rgba(255,255,255,0.05)]',
        'border border-[rgba(255,255,255,0.1)]',
        'backdrop-blur-sm'
      )}>
        <p className="text-[#a0a9c9]">
          This tab shows the conviction history with a timeline visualization of offenses,
          charges, verdicts, and sentences. Each conviction can be expanded to show full details.
        </p>
        <p className="text-[#6b7280] text-sm mt-3">Badge count: 3 convictions on file</p>
      </div>
    </div>
  );

  const VerificationsContent = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Verifications</h3>
      <div className={cn(
        'p-6 rounded-lg',
        'bg-[rgba(255,255,255,0.05)]',
        'border border-[rgba(255,255,255,0.1)]',
        'backdrop-blur-sm'
      )}>
        <p className="text-[#a0a9c9]">
          Displays verification history including dates, officers who performed verifications,
          status results, and confidence scores. Mismatch rows are highlighted for review.
        </p>
        <p className="text-[#6b7280] text-sm mt-3">Badge count: 12 total verifications</p>
      </div>
    </div>
  );

  const RelatedRecordsContent = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Related Records</h3>
      <div className={cn(
        'p-6 rounded-lg',
        'bg-[rgba(255,255,255,0.05)]',
        'border border-[rgba(255,255,255,0.1)]',
        'backdrop-blur-sm'
      )}>
        <p className="text-[#a0a9c9]">
          Shows potentially duplicate or related records with similarity scores. Includes
          actions for reviewing matches and merging records (admin only).
        </p>
        <p className="text-[#6b7280] text-sm mt-3">Badge count: 2 related records</p>
      </div>
    </div>
  );

  const AuditTrailContent = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Audit Trail</h3>
      <div className={cn(
        'p-6 rounded-lg',
        'bg-[rgba(255,255,255,0.05)]',
        'border border-[rgba(255,255,255,0.1)]',
        'backdrop-blur-sm'
      )}>
        <p className="text-[#a0a9c9]">
          Immutable audit log showing all actions taken on this record: created, updated,
          verified, deleted. Shows timestamp, user, action type, and field changes.
        </p>
        <p className="text-[#6b7280] text-sm mt-3">Badge count: 45 audit entries</p>
      </div>
    </div>
  );

  // Define tabs
  const tabs: TabDefinition[] = [
    {
      id: 'overview',
      label: 'Overview',
      content: <OverviewContent />,
    },
    {
      id: 'convictions',
      label: 'Convictions',
      badge: 3,
      content: <ConvictionsContent />,
    },
    {
      id: 'verifications',
      label: 'Verifications',
      badge: 12,
      content: <VerificationsContent />,
    },
    {
      id: 'related_records',
      label: 'Related Records',
      badge: 2,
      content: <RelatedRecordsContent />,
    },
    {
      id: 'audit_trail',
      label: 'Audit Trail',
      badge: 45,
      content: <AuditTrailContent />,
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">RecordTabs Component Demo</h1>
          <p className="text-[#a0a9c9]">
            Comprehensive tab navigation system for criminal record detail pages featuring Aurora
            gradient animations, badge counters, and accessible keyboard navigation.
          </p>
        </div>

        {/* Features Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Aurora Gradient Underline', desc: 'Active tab indicator with glowing animation' },
              { title: 'Badge Counters', desc: 'Display item counts on relevant tabs' },
              { title: 'Glassmorphism Effects', desc: 'Semi-transparent hover backgrounds on inactive tabs' },
              { title: 'Smooth Animations', desc: '200ms fade transitions between tab content' },
              { title: 'Keyboard Navigation', desc: 'Arrow keys, Home/End keys for accessibility' },
              { title: 'Mobile Responsive', desc: 'Horizontal scrolling on small screens' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={cn(
                  'p-4 rounded-lg',
                  'bg-[rgba(20,184,166,0.1)]',
                  'border border-[rgba(20,184,166,0.2)]',
                  'backdrop-blur-sm'
                )}
              >
                <h3 className="font-semibold text-[#14b8a6] mb-1">{feature.title}</h3>
                <p className="text-sm text-[#a0a9c9]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Component Demo */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6">Interactive Demo</h2>
          <div className={cn(
            'p-6 rounded-lg',
            'bg-[rgba(255,255,255,0.02)]',
            'border border-[rgba(255,255,255,0.1)]',
            'backdrop-blur-sm'
          )}>
            <RecordTabs
              tabs={tabs}
              defaultTab="overview"
              onTabChange={(tabId) => {
                setActiveTab(tabId);
                console.log('Active tab changed to:', tabId);
              }}
            />
          </div>
        </section>

        {/* Keyboard Navigation Help */}
        <section className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.1)]">
          <h2 className="text-2xl font-semibold text-white mb-6">Keyboard Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'Arrow Right →', desc: 'Navigate to next tab' },
              { key: 'Arrow Left ←', desc: 'Navigate to previous tab' },
              { key: 'Home', desc: 'Jump to first tab' },
              { key: 'End', desc: 'Jump to last tab' },
              { key: 'Tab / Shift+Tab', desc: 'Focus next/previous focusable element' },
              { key: 'Enter / Space', desc: 'Activate focused tab' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <code className="font-mono text-[#14b8a6] font-semibold min-w-fit">{item.key}</code>
                <p className="text-[#a0a9c9]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Implementation Notes */}
        <section className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.1)]">
          <h2 className="text-2xl font-semibold text-white mb-6">Implementation</h2>
          <div className={cn(
            'p-6 rounded-lg',
            'bg-[rgba(255,255,255,0.05)]',
            'border border-[rgba(255,255,255,0.1)]',
            'backdrop-blur-sm'
          )}>
            <h3 className="font-semibold text-white mb-3">Usage Example:</h3>
            <pre className="text-sm text-[#86efac] overflow-x-auto bg-[rgba(0,0,0,0.3)] p-4 rounded">
{`import { RecordTabs, TabDefinition } from '@/components/record/RecordTabs';

const tabs: TabDefinition[] = [
  {
    id: 'overview',
    label: 'Overview',
    content: <OverviewTab record={record} />
  },
  {
    id: 'convictions',
    label: 'Convictions',
    badge: 3,
    content: <ConvictionsTab record={record} />
  }
];

<RecordTabs 
  tabs={tabs} 
  defaultTab="overview"
  onTabChange={(tabId) => console.log(tabId)}
/>`}
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}
