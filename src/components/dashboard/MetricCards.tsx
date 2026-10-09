'use client'

import { useState, useEffect } from 'react'
import { StatCard } from './StatCard'
import { colors } from '@/lib/design-tokens'

interface MetricData {
  pendingVerifications: number
  recordsThisMonth: number  
  activeUsers: number
}

interface MetricCardsProps {
  data?: MetricData
  loading?: boolean
}

export function MetricCards({ data, loading = false }: MetricCardsProps) {
  const [sparklineData, setSparklineData] = useState<Record<string, number[]>>({})

  // Mock previous period data for percentage calculations
  const previousData = {
    pendingVerifications: data ? data.pendingVerifications - 15 : 0,
    recordsThisMonth: data ? data.recordsThisMonth - 127 : 0,
    activeUsers: data ? data.activeUsers - 8 : 0
  }

  // Generate deterministic sparkline data based on the actual values
  const generateDeterministicSparklineData = (current: number, seed: string, variance: number = 0.2) => {
    const data = []
    const baseValue = current * 0.8
    
    // Use a simple deterministic random function based on seed
    const seedNumber = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    let random = seedNumber / 1000
    
    for (let i = 0; i < 7; i++) {
      const trend = (i / 6) * (current - baseValue)
      // Simple deterministic "random" that's consistent across server/client
      random = (random * 9301 + 49297) % 233280 / 233280
      const noise = (random - 0.5) * variance * current
      data.push(Math.max(0, Math.floor(baseValue + trend + noise)))
    }
    return data
  }

  // Generate sparkline data only on client side to prevent hydration mismatch
  useEffect(() => {
    if (!loading && data) {
      setSparklineData({
        pendingVerifications: generateDeterministicSparklineData(data.pendingVerifications, 'pending'),
        recordsThisMonth: generateDeterministicSparklineData(data.recordsThisMonth, 'records'),
        activeUsers: generateDeterministicSparklineData(data.activeUsers, 'users', 0.3)
      })
    }
  }, [data, loading])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Pending Verifications */}
      <StatCard
        title="Pending Verifications"
        value={data?.pendingVerifications || 0}
        previousValue={previousData.pendingVerifications}
        variant="warning"
        description="Identity verification requests awaiting review"
        sparklineData={sparklineData.pendingVerifications || []}
        loading={loading}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      {/* Records Created This Month */}
      <StatCard
        title="Records Created This Month"
        value={data?.recordsThisMonth || 0}
        previousValue={previousData.recordsThisMonth}
        variant="success"
        description="New criminal records added to the database"
        sparklineData={sparklineData.recordsThisMonth || []}
        loading={loading}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />

      {/* Active Users */}
      <StatCard
        title="Active Users"
        value={data?.activeUsers || 0}
        previousValue={previousData.activeUsers}
        variant="info"
        description="Officers currently signed in to the system"
        sparklineData={sparklineData.activeUsers || []}
        loading={loading}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
      />
    </div>
  )
}

export default MetricCards


