'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Zap,
  Database,
  HardDrive,
  Users,
  Activity,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusLevel = 'healthy' | 'warning' | 'critical';

interface MetricState {
  apiResponseMs: number;
  dbStatus: 'Connected' | 'Degraded' | 'Down';
  storagePercent: number;
  activeSessions: number;
  uptimePercent: number;
  uptimeDays: number;
  lastBackupLabel: string;
  lastBackupAgeMinutes: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function apiResponseLevel(ms: number): StatusLevel {
  if (ms < 200) return 'healthy';
  if (ms <= 500) return 'warning';
  return 'critical';
}

function dbStatusLevel(status: MetricState['dbStatus']): StatusLevel {
  if (status === 'Connected') return 'healthy';
  if (status === 'Degraded') return 'warning';
  return 'critical';
}

function storageLevel(pct: number): StatusLevel {
  if (pct < 75) return 'healthy';
  if (pct < 90) return 'warning';
  return 'critical';
}

function backupLevel(ageMinutes: number): StatusLevel {
  // < 4 h → healthy, < 24 h → warning, ≥ 24 h → critical
  if (ageMinutes < 240) return 'healthy';
  if (ageMinutes < 1440) return 'warning';
  return 'critical';
}

function overallLevel(metrics: MetricState): StatusLevel {
  const levels = [
    apiResponseLevel(metrics.apiResponseMs),
    dbStatusLevel(metrics.dbStatus),
    storageLevel(metrics.storagePercent),
    backupLevel(metrics.lastBackupAgeMinutes),
  ];
  if (levels.includes('critical')) return 'critical';
  if (levels.includes('warning')) return 'warning';
  return 'healthy';
}

const STATUS_COLORS: Record<StatusLevel, string> = {
  healthy: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444',
};

const STATUS_TEXT_CLASSES: Record<StatusLevel, string> = {
  healthy:  'text-[#10b981]',
  warning:  'text-[#f59e0b]',
  critical: 'text-[#ef4444]',
};

const STATUS_BG_CLASSES: Record<StatusLevel, string> = {
  healthy:  'bg-[#10b981]',
  warning:  'bg-[#f59e0b]',
  critical: 'bg-[#ef4444]',
};

/** Clamp a number between min and max */
function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Tiny random variation around a centre value */
function jitter(value: number, range: number) {
  return value + (Math.random() - 0.5) * 2 * range;
}

// ─── StatusDot ────────────────────────────────────────────────────────────────

function StatusDot({ level }: { level: StatusLevel }) {
  return (
    <span
      aria-label={`Status: ${level}`}
      className={cn(
        'inline-block w-2.5 h-2.5 rounded-full flex-shrink-0',
        STATUS_BG_CLASSES[level],
        level === 'healthy' && 'animate-pulse'
      )}
    />
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  level: StatusLevel;
  sub?: React.ReactNode;
}

function MetricCard({ icon, label, value, level, sub }: MetricCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 p-5 rounded-xl',
        'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]',
        'backdrop-blur-sm',
        'transition-all duration-300'
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#a0a9c9]">{icon}</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#a0a9c9]">
            {label}
          </span>
        </div>
        <StatusDot level={level} />
      </div>

      {/* Value */}
      <p
        className={cn(
          'text-2xl font-bold tracking-tight leading-none',
          STATUS_TEXT_CLASSES[level]
        )}
      >
        {value}
      </p>

      {/* Optional sub-content */}
      {sub && <div className="mt-auto">{sub}</div>}
    </div>
  );
}

// ─── StorageBar ───────────────────────────────────────────────────────────────

function StorageBar({ pct, level }: { pct: number; level: StatusLevel }) {
  return (
    <div className="space-y-1.5">
      <div
        className="h-2 w-full rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Storage usage ${pct}%`}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-in-out"
          style={{
            width: `${pct}%`,
            backgroundColor: STATUS_COLORS[level],
            boxShadow: `0 0 8px ${STATUS_COLORS[level]}66`,
          }}
        />
      </div>
      <p className="text-[10px] text-[#6b7280]">{pct}% used</p>
    </div>
  );
}

// ─── HealthBanner ─────────────────────────────────────────────────────────────

function HealthBanner({ level }: { level: StatusLevel }) {
  const config = {
    healthy: {
      text: 'All Systems Operational',
      borderClass: 'border-[rgba(16,185,129,0.4)]',
      bgClass: 'bg-[rgba(16,185,129,0.06)]',
      textClass: 'text-[#10b981]',
      // Aurora glow effect via box-shadow
      glowStyle: { boxShadow: '0 0 24px rgba(16,185,129,0.18), inset 0 0 24px rgba(16,185,129,0.04)' },
      dotLevel: 'healthy' as StatusLevel,
    },
    warning: {
      text: 'Degraded Performance',
      borderClass: 'border-[rgba(245,158,11,0.5)]',
      bgClass: 'bg-[rgba(245,158,11,0.06)]',
      textClass: 'text-[#f59e0b]',
      glowStyle: {},
      dotLevel: 'warning' as StatusLevel,
    },
    critical: {
      text: 'Critical Issues Detected',
      borderClass: 'border-[rgba(239,68,68,0.5)]',
      bgClass: 'bg-[rgba(239,68,68,0.06)]',
      textClass: 'text-[#ef4444]',
      glowStyle: {},
      dotLevel: 'critical' as StatusLevel,
    },
  }[level];

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-5 py-4 rounded-xl border',
        config.borderClass,
        config.bgClass
      )}
      style={config.glowStyle}
      role="status"
      aria-live="polite"
    >
      <StatusDot level={config.dotLevel} />
      <span className={cn('font-semibold text-sm', config.textClass)}>
        {config.text}
      </span>
    </div>
  );
}

// ─── Initial mock state ────────────────────────────────────────────────────────

const INITIAL_STATE: MetricState = {
  apiResponseMs: 142,
  dbStatus: 'Connected',
  storagePercent: 68,
  activeSessions: 23,
  uptimePercent: 99.8,
  uptimeDays: 30,
  lastBackupLabel: '2 hours ago',
  lastBackupAgeMinutes: 120,
};

// ─── SystemStatus ─────────────────────────────────────────────────────────────

export function SystemStatus() {
  const [metrics, setMetrics] = useState<MetricState>(INITIAL_STATE);

  /** Apply minor random variation to simulate live telemetry */
  const tick = useCallback(() => {
    setMetrics((prev) => ({
      ...prev,
      apiResponseMs: Math.round(clamp(jitter(prev.apiResponseMs, 25), 80, 400)),
      activeSessions: Math.round(clamp(jitter(prev.activeSessions, 3), 5, 60)),
    }));
  }, []);

  useEffect(() => {
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [tick]);

  const apiLevel      = apiResponseLevel(metrics.apiResponseMs);
  const dbLevel       = dbStatusLevel(metrics.dbStatus);
  const storageLevel_ = storageLevel(metrics.storagePercent);
  const backupLevel_  = backupLevel(metrics.lastBackupAgeMinutes);
  const overall       = overallLevel(metrics);

  return (
    <div className="space-y-6">
      {/* ── Overall health banner ──────────────────────────────────────────── */}
      <HealthBanner level={overall} />

      {/* ── 2×3 metric grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* 1 — API Response Time */}
        <MetricCard
          icon={<Zap size={16} aria-hidden="true" />}
          label="API Response Time"
          value={`${metrics.apiResponseMs} ms`}
          level={apiLevel}
          sub={
            <p className="text-xs text-[#6b7280]">
              {apiLevel === 'healthy' && 'Excellent response time'}
              {apiLevel === 'warning' && 'Slightly elevated latency'}
              {apiLevel === 'critical' && 'High latency detected'}
            </p>
          }
        />

        {/* 2 — Database Connection */}
        <MetricCard
          icon={<Database size={16} aria-hidden="true" />}
          label="Database Connection"
          value={metrics.dbStatus}
          level={dbLevel}
          sub={
            <p className="text-xs text-[#6b7280]">
              {dbLevel === 'healthy' && 'All replicas reachable'}
              {dbLevel === 'warning' && 'Some replicas degraded'}
              {dbLevel === 'critical' && 'Primary unreachable'}
            </p>
          }
        />

        {/* 3 — Storage Usage */}
        <MetricCard
          icon={<HardDrive size={16} aria-hidden="true" />}
          label="Storage Usage"
          value={`${metrics.storagePercent}%`}
          level={storageLevel_}
          sub={
            <StorageBar pct={metrics.storagePercent} level={storageLevel_} />
          }
        />

        {/* 4 — Active Sessions */}
        <MetricCard
          icon={<Users size={16} aria-hidden="true" />}
          label="Active Sessions"
          value={metrics.activeSessions}
          level="healthy"
          sub={
            <p className="text-xs text-[#6b7280]">Authenticated users online</p>
          }
        />

        {/* 5 — System Uptime */}
        <MetricCard
          icon={<Activity size={16} aria-hidden="true" />}
          label="System Uptime"
          value={`${metrics.uptimePercent}%`}
          level="healthy"
          sub={
            <p className="text-xs text-[#6b7280]">{metrics.uptimeDays}-day rolling average</p>
          }
        />

        {/* 6 — Last Backup */}
        <MetricCard
          icon={<Clock size={16} aria-hidden="true" />}
          label="Last Backup"
          value={metrics.lastBackupLabel}
          level={backupLevel_}
          sub={
            <p className="text-xs text-[#6b7280]">
              {backupLevel_ === 'healthy'  && 'Backup schedule on track'}
              {backupLevel_ === 'warning'  && 'Backup overdue — check schedule'}
              {backupLevel_ === 'critical' && 'Backup critically overdue'}
            </p>
          }
        />
      </div>
    </div>
  );
}

export default SystemStatus;
