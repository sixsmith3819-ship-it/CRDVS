'use client'

import { useState } from 'react'
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { cn } from '@/lib/cn'
import { colors } from '@/lib/design-tokens'

interface ResultFiltersProps {
  results: any[]
  onFiltersChange: (filteredResults: any[]) => void
  className?: string
}

interface FilterState {
  confidenceLevel: 'all' | 'high' | 'medium' | 'low'
  matchType: 'all' | 'exact' | 'fuzzy' | 'partial'
  riskLevel: 'all' | 'critical' | 'high' | 'medium' | 'low'
  recordStatus: 'all' | 'active' | 'inactive' | 'pending'
  sortBy: 'confidence' | 'risk' | 'convictions' | 'date'
  sortOrder: 'desc' | 'asc'
}

export function ResultFilters({ results, onFiltersChange, className }: ResultFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    confidenceLevel: 'all',
    matchType: 'all',
    riskLevel: 'all',
    recordStatus: 'all',
    sortBy: 'confidence',
    sortOrder: 'desc'
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  // Calculate filter statistics
  const getFilterStats = () => {
    const stats = {
      total: results.length,
      high_confidence: results.filter(r => r.confidence_score >= 0.9).length,
      medium_confidence: results.filter(r => r.confidence_score >= 0.7 && r.confidence_score < 0.9).length,
      low_confidence: results.filter(r => r.confidence_score < 0.7).length,
      exact_match: results.filter(r => r.match_type === 'exact').length,
      fuzzy_match: results.filter(r => r.match_type === 'fuzzy').length,
      partial_match: results.filter(r => r.match_type === 'partial').length,
      critical_risk: results.filter(r => r.risk_level === 'critical').length,
      high_risk: results.filter(r => r.risk_level === 'high').length,
      medium_risk: results.filter(r => r.risk_level === 'medium').length,
      low_risk: results.filter(r => r.risk_level === 'low').length,
      active: results.filter(r => r.status === 'active').length,
      inactive: results.filter(r => r.status === 'inactive').length,
      pending: results.filter(r => r.status === 'pending').length
    }
    return stats
  }

  // Apply filters and sorting
  const applyFilters = (newFilters: FilterState) => {
    let filtered = [...results]

    // Apply confidence level filter
    if (newFilters.confidenceLevel !== 'all') {
      filtered = filtered.filter(record => {
        switch (newFilters.confidenceLevel) {
          case 'high': return record.confidence_score >= 0.9
          case 'medium': return record.confidence_score >= 0.7 && record.confidence_score < 0.9
          case 'low': return record.confidence_score < 0.7
          default: return true
        }
      })
    }

    // Apply match type filter
    if (newFilters.matchType !== 'all') {
      filtered = filtered.filter(record => record.match_type === newFilters.matchType)
    }

    // Apply risk level filter
    if (newFilters.riskLevel !== 'all') {
      filtered = filtered.filter(record => record.risk_level === newFilters.riskLevel)
    }

    // Apply record status filter
    if (newFilters.recordStatus !== 'all') {
      filtered = filtered.filter(record => record.status === newFilters.recordStatus)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let compareValue = 0
      
      switch (newFilters.sortBy) {
        case 'confidence':
          compareValue = a.confidence_score - b.confidence_score
          break
        case 'risk':
          const riskOrder = { low: 0, medium: 1, high: 2, critical: 3 }
          compareValue = riskOrder[a.risk_level as keyof typeof riskOrder] - riskOrder[b.risk_level as keyof typeof riskOrder]
          break
        case 'convictions':
          compareValue = a.conviction_count - b.conviction_count
          break
        case 'date':
          compareValue = new Date(a.last_conviction_date || '1900-01-01').getTime() - new Date(b.last_conviction_date || '1900-01-01').getTime()
          break
      }
      
      return newFilters.sortOrder === 'desc' ? -compareValue : compareValue
    })

    onFiltersChange(filtered)
  }

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  // Clear all filters
  const clearFilters = () => {
    const resetFilters: FilterState = {
      confidenceLevel: 'all',
      matchType: 'all',
      riskLevel: 'all',
      recordStatus: 'all',
      sortBy: 'confidence',
      sortOrder: 'desc'
    }
    setFilters(resetFilters)
    applyFilters(resetFilters)
  }

  const stats = getFilterStats()
  const hasActiveFilters = Object.values(filters).some((value, index) => {
    const defaultValues = ['all', 'all', 'all', 'all', 'confidence', 'desc']
    return value !== defaultValues[index]
  })

  return (
    <GlassCard className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">Filter Results</h3>
          <Badge variant="info">{stats.total} Records</Badge>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#14b8a6] hover:text-[#0d9488] font-medium transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-[#a0a9c9] hover:text-white transition-colors"
        >
          {showAdvanced ? 'Hide Advanced' : 'Advanced Filters'}
        </button>
      </div>

      {/* Quick Filter Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <button
          onClick={() => handleFilterChange('confidenceLevel', filters.confidenceLevel === 'high' ? 'all' : 'high')}
          className={cn(
            "p-3 rounded-lg border transition-all duration-200 text-left",
            filters.confidenceLevel === 'high'
              ? "border-green-500/50 bg-green-500/10"
              : "border-transparent hover:border-[#3a4254]"
          )}
          style={{ backgroundColor: filters.confidenceLevel === 'high' ? `${colors.statusSuccess}15` : colors.glass }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#6b7280]">High Confidence</span>
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </div>
          <div className="text-lg font-bold text-white">{stats.high_confidence}</div>
          <div className="text-xs text-[#a0a9c9]">≥90% match</div>
        </button>

        <button
          onClick={() => handleFilterChange('matchType', filters.matchType === 'exact' ? 'all' : 'exact')}
          className={cn(
            "p-3 rounded-lg border transition-all duration-200 text-left",
            filters.matchType === 'exact'
              ? "border-blue-500/50 bg-blue-500/10"
              : "border-transparent hover:border-[#3a4254]"
          )}
          style={{ backgroundColor: filters.matchType === 'exact' ? `${colors.statusInfo}15` : colors.glass }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#6b7280]">Exact Match</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
          <div className="text-lg font-bold text-white">{stats.exact_match}</div>
          <div className="text-xs text-[#a0a9c9]">Perfect match</div>
        </button>

        <button
          onClick={() => handleFilterChange('riskLevel', filters.riskLevel === 'high' ? 'all' : 'high')}
          className={cn(
            "p-3 rounded-lg border transition-all duration-200 text-left",
            filters.riskLevel === 'high'
              ? "border-orange-500/50 bg-orange-500/10"
              : "border-transparent hover:border-[#3a4254]"
          )}
          style={{ backgroundColor: filters.riskLevel === 'high' ? `${colors.statusWarning}15` : colors.glass }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#6b7280]">High Risk</span>
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
          </div>
          <div className="text-lg font-bold text-white">{stats.high_risk}</div>
          <div className="text-xs text-[#a0a9c9]">Requires attention</div>
        </button>

        <button
          onClick={() => handleFilterChange('recordStatus', filters.recordStatus === 'active' ? 'all' : 'active')}
          className={cn(
            "p-3 rounded-lg border transition-all duration-200 text-left",
            filters.recordStatus === 'active'
              ? "border-red-500/50 bg-red-500/10"
              : "border-transparent hover:border-[#3a4254]"
          )}
          style={{ backgroundColor: filters.recordStatus === 'active' ? `${colors.statusDanger}15` : colors.glass }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#6b7280]">Active Records</span>
            <div className="w-2 h-2 bg-red-500 rounded-full" />
          </div>
          <div className="text-lg font-bold text-white">{stats.active}</div>
          <div className="text-xs text-[#a0a9c9]">Current cases</div>
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t pt-6 space-y-4" style={{ borderColor: colors.glassBorder }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Confidence Level"
              value={filters.confidenceLevel}
              onChange={(value) => handleFilterChange('confidenceLevel', value)}
              options={[
                { value: 'all', label: `All (${stats.total})` },
                { value: 'high', label: `High ≥90% (${stats.high_confidence})` },
                { value: 'medium', label: `Medium 70-89% (${stats.medium_confidence})` },
                { value: 'low', label: `Low <70% (${stats.low_confidence})` }
              ]}
            />

            <Select
              label="Match Type"
              value={filters.matchType}
              onChange={(value) => handleFilterChange('matchType', value)}
              options={[
                { value: 'all', label: `All Types (${stats.total})` },
                { value: 'exact', label: `Exact (${stats.exact_match})` },
                { value: 'fuzzy', label: `Fuzzy (${stats.fuzzy_match})` },
                { value: 'partial', label: `Partial (${stats.partial_match})` }
              ]}
            />

            <Select
              label="Risk Level"
              value={filters.riskLevel}
              onChange={(value) => handleFilterChange('riskLevel', value)}
              options={[
                { value: 'all', label: `All Levels (${stats.total})` },
                { value: 'critical', label: `Critical (${stats.critical_risk})` },
                { value: 'high', label: `High (${stats.high_risk})` },
                { value: 'medium', label: `Medium (${stats.medium_risk})` },
                { value: 'low', label: `Low (${stats.low_risk})` }
              ]}
            />

            <Select
              label="Record Status"
              value={filters.recordStatus}
              onChange={(value) => handleFilterChange('recordStatus', value)}
              options={[
                { value: 'all', label: `All Status (${stats.total})` },
                { value: 'active', label: `Active (${stats.active})` },
                { value: 'inactive', label: `Inactive (${stats.inactive})` },
                { value: 'pending', label: `Pending (${stats.pending})` }
              ]}
            />

            <Select
              label="Sort By"
              value={filters.sortBy}
              onChange={(value) => handleFilterChange('sortBy', value)}
              options={[
                { value: 'confidence', label: 'Confidence Score' },
                { value: 'risk', label: 'Risk Level' },
                { value: 'convictions', label: 'Conviction Count' },
                { value: 'date', label: 'Last Conviction Date' }
              ]}
            />

            <Select
              label="Sort Order"
              value={filters.sortOrder}
              onChange={(value) => handleFilterChange('sortOrder', value)}
              options={[
                { value: 'desc', label: 'Highest First' },
                { value: 'asc', label: 'Lowest First' }
              ]}
            />
          </div>
        </div>
      )}

      {/* Active Filter Summary */}
      {hasActiveFilters && (
        <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${colors.auroraTeal}10` }}>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#a0a9c9]">Active filters:</span>
            {filters.confidenceLevel !== 'all' && <Badge variant="info">{filters.confidenceLevel} confidence</Badge>}
            {filters.matchType !== 'all' && <Badge variant="info">{filters.matchType} match</Badge>}
            {filters.riskLevel !== 'all' && <Badge variant="info">{filters.riskLevel} risk</Badge>}
            {filters.recordStatus !== 'all' && <Badge variant="info">{filters.recordStatus} status</Badge>}
            <span className="text-[#6b7280]">• Sorted by {filters.sortBy} ({filters.sortOrder})</span>
          </div>
        </div>
      )}
    </GlassCard>
  )
}

export default ResultFilters
