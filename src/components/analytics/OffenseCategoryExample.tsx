'use client';

import React, { useState, useEffect } from 'react';
import { OffenseCategoryChart, OffenseCategory } from './index';

/**
 * Example component showing how to fetch and display offense category data
 * This can be used as a template for integration with the analytics page
 */
export function OffenseCategoryExample() {
  const [data, setData] = useState<OffenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOffenseData();
  }, []);

  /**
   * Fetch offense category data from the backend
   * Replace this with actual API call to your backend
   */
  const fetchOffenseData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/analytics/offense-distribution');
      // const result = await response.json();
      // setData(result);

      // Mock data for demonstration
      const mockData: OffenseCategory[] = [
        { name: 'Assault', count: 245, color: '#14b8a6' },
        { name: 'Theft', count: 189, color: '#7c3aed' },
        { name: 'Fraud', count: 156, color: '#10b981' },
        { name: 'Traffic', count: 98, color: '#f59e0b' },
        { name: 'Drug Offense', count: 112, color: '#3b82f6' },
        { name: 'Cybercrime', count: 67, color: '#8b5cf6' },
      ];

      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching offense data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg p-6 bg-glass-base backdrop-blur-lg border border-glass-border">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-elevation rounded w-1/3"></div>
          <div className="h-64 bg-elevation rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg p-6 bg-glass-base backdrop-blur-lg border border-glass-border text-center">
        <p className="text-critical-red">Error: {error}</p>
        <button
          onClick={fetchOffenseData}
          className="mt-4 px-4 py-2 bg-aurora-teal text-text-primary rounded hover:bg-opacity-80 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg p-6 bg-glass-base backdrop-blur-lg border border-glass-border text-center">
        <p className="text-text-secondary">No offense data available</p>
      </div>
    );
  }

  return (
    <OffenseCategoryChart
      data={data}
      title="Offense Category Distribution"
      subtitle="All records"
      onSegmentClick={(category) => {
        console.log('Selected category:', category);
        // Handle segment click - e.g., filter other dashboards
      }}
    />
  );
}

/**
 * Hook for fetching offense category data with date range filtering
 * This can be used throughout the application
 */
export function useOffenseData(dateRange?: { from: string; to: string }) {
  const [data, setData] = useState<OffenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const params = new URLSearchParams();
      // if (dateRange) {
      //   params.append('from', dateRange.from);
      //   params.append('to', dateRange.to);
      // }
      // const response = await fetch(`/api/analytics/offense-distribution?${params}`);
      // const result = await response.json();
      // setData(result);

      // Mock implementation
      const mockData: OffenseCategory[] = [
        { name: 'Assault', count: 245, color: '#14b8a6' },
        { name: 'Theft', count: 189, color: '#7c3aed' },
        { name: 'Fraud', count: 156, color: '#10b981' },
        { name: 'Traffic', count: 98, color: '#f59e0b' },
        { name: 'Drug Offense', count: 112, color: '#3b82f6' },
      ];
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange?.from, dateRange?.to]);

  return { data, isLoading, error, refetch: fetchData };
}

/**
 * Example: Using the hook in a component
 */
export function OffenseCategoryWithDateRange() {
  const [dateRange, setDateRange] = useState<{ from: string; to: string } | undefined>();
  const { data, isLoading, error } = useOffenseData(dateRange);

  const handleDateRangeChange = (from: string, to: string) => {
    setDateRange({ from, to });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <input
          type="date"
          defaultValue="2024-01-01"
          onChange={(e) => {
            const to = document.querySelector(
              'input[type="date"]:nth-of-type(2)'
            ) as HTMLInputElement;
            if (to?.value) handleDateRangeChange(e.target.value, to.value);
          }}
        />
        <input
          type="date"
          defaultValue="2024-12-31"
          onChange={(e) => {
            const from = document.querySelector(
              'input[type="date"]:nth-of-type(1)'
            ) as HTMLInputElement;
            if (from?.value) handleDateRangeChange(from.value, e.target.value);
          }}
        />
      </div>
      <OffenseCategoryChart
        data={data}
        title="Offense Distribution by Date Range"
        subtitle={
          dateRange
            ? `From ${dateRange.from} to ${dateRange.to}`
            : 'All time'
        }
      />
    </div>
  );
}
