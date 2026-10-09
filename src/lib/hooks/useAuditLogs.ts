import { useState, useEffect } from 'react';
import type { AuditLog } from '@/types/database';

export interface UseAuditLogsOptions {
  recordId?: string;
  action?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface UseAuditLogsResult {
  logs: AuditLog[];
  isLoading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing audit logs
 */
export function useAuditLogs(options: UseAuditLogsOptions = {}): UseAuditLogsResult {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchLogs = async () => {
    if (!options.recordId) {
      setError('recordId is required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.action) params.append('action', options.action);
      if (options.userId) params.append('user_id', options.userId);
      if (options.startDate) params.append('start_date', options.startDate);
      if (options.endDate) params.append('end_date', options.endDate);
      if (options.limit) params.append('limit', String(options.limit));
      if (options.offset) params.append('offset', String(options.offset));

      const url = `/api/audit/record/${options.recordId}${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch audit logs: ${response.statusText}`);
      }

      const result = await response.json();
      // Handle both direct array and paginated response formats
      const auditLogs = Array.isArray(result) ? result : result.data || [];
      const totalCount = result.total || auditLogs.length;

      setLogs(auditLogs);
      setTotal(totalCount);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch audit logs';
      setError(message);
      console.error('useAuditLogs error:', message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (options.recordId) {
      fetchLogs();
    }
  }, [options.recordId, options.action, options.userId, options.startDate, options.endDate]);

  return {
    logs,
    isLoading,
    error,
    total,
    refetch: fetchLogs,
  };
}
