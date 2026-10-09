'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { SystemStatus } from '@/components/admin/SystemStatus';
import { useAuth } from '@/lib/hooks/useAuth';

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-[rgba(255,255,255,0.06)] ${className}`}
    />
  );
}

function LoadingState() {
  return (
    <div className="py-6 space-y-6">
      {/* Page header skeletons */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-4 w-48 mt-3" />
      </div>

      {/* Health banner skeleton */}
      <Skeleton className="h-16 w-full rounded-xl" />

      {/* Metric cards skeleton grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SystemStatusPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [secondsAgo, setSecondsAgo] = useState(0);

  // ── Auth guard ────────────────────────────────────────────────────────────
  // Redirect to /login if not admin
  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'administrator')) {
      router.replace('/login');
    }
  }, [loading, user, profile, router]);

  // ── "Last refreshed X seconds ago" counter ────────────────────────────────
  useEffect(() => {
    setSecondsAgo(0);
    const id = setInterval(() => {
      setSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Layout breadcrumbs={[{ label: 'Admin' }, { label: 'System Status' }]}>
        <Container>
          <LoadingState />
        </Container>
      </Layout>
    );
  }

  // ── Redirect guard ────────────────────────────────────────────────────────
  // Don't render if user is not admin (redirect handled by effect)
  if (!user || profile?.role !== 'administrator') {
    return null;
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Layout breadcrumbs={[{ label: 'Admin' }, { label: 'System Status' }]}>
      <Container>
        <div className="py-6 space-y-6">

          {/* ── Page header ────────────────────────────────────────────────── */}
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              System Status
            </h1>
            <p className="mt-1 text-sm text-[#a0a9c9]">
              Live infrastructure and service health
            </p>
            <p className="mt-3 text-xs text-[#6b7280]">
              Last refreshed: <span className="text-white font-medium">{secondsAgo}</span> second{secondsAgo !== 1 ? 's' : ''} ago
            </p>
          </div>

          {/* ── SystemStatus component ─────────────────────────────────────── */}
          <SystemStatus />

        </div>
      </Container>
    </Layout>
  );
}
