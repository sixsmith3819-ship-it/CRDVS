'use client';

import React, { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { EmptyState, useEmptyState } from '@/components/ui/EmptyState';
import { PlusCircle, RefreshCw, Inbox, ShieldAlert } from 'lucide-react';

/**
 * Empty States Demo
 *
 * Showcases all four EmptyState variants (default, search, error, permission)
 * alongside different sizes and hook usage.
 */
export default function EmptyStatesDemoPage() {
  const [searchValue, setSearchValue] = useState('ghost query');
  const { emptySearch, emptyError, emptyPermission } = useEmptyState();

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <Container maxWidth="xl" className="py-12">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Empty State Components</h1>
          <p className="text-[#a0a9c9] text-lg">
            All four pre-defined variants, three sizes, and action button configurations.
          </p>
        </div>

        {/* ── Section 1: All four variants (md) ───────────────────────── */}
        <section className="mb-14" aria-labelledby="variants-heading">
          <h2 id="variants-heading" className="text-xl font-semibold text-white mb-6">
            Variants — default · search · error · permission
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* default */}
            <EmptyState
              variant="default"
              title="Nothing here yet"
              description="Create your first record to get started"
              action={{
                label: 'New Record',
                onClick: () => alert('New record'),
                icon: <PlusCircle className="w-4 h-4" aria-hidden="true" />,
              }}
              secondaryAction={{
                label: 'Learn more',
                onClick: () => alert('Learn more'),
              }}
            />

            {/* search */}
            <EmptyState
              variant="search"
              title="No results found"
              description={`Nothing matched "${searchValue}"`}
              action={{
                label: 'Clear search',
                onClick: () => setSearchValue(''),
              }}
            />

            {/* error */}
            <EmptyState
              variant="error"
              title="Something went wrong"
              description="We couldn't load the records. Please try again."
              action={{
                label: 'Retry',
                onClick: () => alert('Retrying…'),
                icon: <RefreshCw className="w-4 h-4" aria-hidden="true" />,
              }}
            />

            {/* permission */}
            <EmptyState
              variant="permission"
              title="Access restricted"
              description="Contact your administrator to request access."
            />
          </div>
        </section>

        {/* ── Section 2: Sizes ─────────────────────────────────────────── */}
        <section className="mb-14" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading" className="text-xl font-semibold text-white mb-6">
            Sizes — sm · md · lg
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EmptyState
              variant="default"
              size="sm"
              title="Small empty state"
              description="Compact layout for tight spaces"
            />
            <EmptyState
              variant="default"
              size="md"
              title="Medium empty state"
              description="Standard layout for most use cases"
              action={{ label: 'Get started', onClick: () => {} }}
            />
            <EmptyState
              variant="default"
              size="lg"
              title="Large empty state"
              description="Prominent layout for primary content areas"
              action={{ label: 'Create first item', onClick: () => {} }}
              secondaryAction={{ label: 'Import from CSV', onClick: () => {} }}
            />
          </div>
        </section>

        {/* ── Section 3: useEmptyState hook examples ───────────────────── */}
        <section className="mb-14" aria-labelledby="hook-heading">
          <h2 id="hook-heading" className="text-xl font-semibold text-white mb-2">
            useEmptyState() hook
          </h2>
          <p className="text-[#6b7280] text-sm mb-6">
            Helper functions that return the right props — just spread them onto{' '}
            <code className="text-[#14b8a6]">&lt;EmptyState&gt;</code>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* emptySearch */}
            <EmptyState
              {...emptySearch({
                description: 'No officers matched your query',
                action: { label: 'Reset filters', onClick: () => {} },
              })}
            />

            {/* emptyError */}
            <EmptyState
              {...emptyError({
                action: {
                  label: 'Try again',
                  onClick: () => {},
                  icon: <RefreshCw className="w-4 h-4" aria-hidden="true" />,
                },
              })}
            />

            {/* emptyPermission */}
            <EmptyState
              {...emptyPermission({
                description: 'Only system administrators can access audit logs.',
              })}
            />
          </div>
        </section>

        {/* ── Section 4: Custom icon override ─────────────────────────── */}
        <section aria-labelledby="custom-heading">
          <h2 id="custom-heading" className="text-xl font-semibold text-white mb-6">
            Custom icons
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EmptyState
              icon={<Inbox aria-hidden="true" />}
              title="Empty inbox"
              description="No notifications at this time"
            />
            <EmptyState
              icon={<ShieldAlert aria-hidden="true" />}
              title="No flagged records"
              description="All records passed automated checks"
              action={{ label: 'View all records', onClick: () => {} }}
            />
          </div>
        </section>
      </Container>
    </main>
  );
}
