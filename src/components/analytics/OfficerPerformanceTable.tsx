'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { ChevronUp, ChevronDown, Download, Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'

// Types
export interface OfficerData {
  id: string
  name: string
  recordsProcessed: number
  verificationSuccessRate: number
  averageProcessingTime: number
  flaggedRecords: number
  status: 'online' | 'offline'
  department?: string
}

export type SortField = 'name' | 'recordsProcessed' | 'verificationSuccessRate' | 'averageProcessingTime' | 'flaggedRecords'
export type SortDirection = 'asc' | 'desc'

interface OfficerPerformanceTableProps {
  data?: OfficerData[]
  loading?: boolean
  onRowClick?: (officer: OfficerData) => void
  className?: string
}

// Sample data for demonstration
const SAMPLE_OFFICERS: OfficerData[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    recordsProcessed: 2847,
    verificationSuccessRate: 98.5,
    averageProcessingTime: 45,
    flaggedRecords: 12,
    status: 'online',
    department: 'Verification'
  },
  {
    id: '2',
    name: 'Marcus Chen',
    recordsProcessed: 2654,
    verificationSuccessRate: 97.8,
    averageProcessingTime: 52,
    flaggedRecords: 18,
    status: 'online',
    department: 'Verification'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    recordsProcessed: 3102,
    verificationSuccessRate: 99.1,
    averageProcessingTime: 38,
    flaggedRecords: 8,
    status: 'online',
    department: 'Quality Assurance'
  },
  {
    id: '4',
    name: 'James Thompson',
    recordsProcessed: 2421,
    verificationSuccessRate: 96.5,
    averageProcessingTime: 58,
    flaggedRecords: 28,
    status: 'offline',
    department: 'Verification'
  },
  {
    id: '5',
    name: 'Priya Patel',
    recordsProcessed: 2988,
    verificationSuccessRate: 98.2,
    averageProcessingTime: 48,
    flaggedRecords: 15,
    status: 'online',
    department: 'Records Management'
  },
  {
    id: '6',
    name: 'David Morrison',
    recordsProcessed: 2156,
    verificationSuccessRate: 95.8,
    averageProcessingTime: 62,
    flaggedRecords: 35,
    status: 'online',
    department: 'Verification'
  },
  {
    id: '7',
    name: 'Lisa Wang',
    recordsProcessed: 3245,
    verificationSuccessRate: 99.0,
    averageProcessingTime: 42,
    flaggedRecords: 10,
    status: 'offline',
    department: 'Quality Assurance'
  },
  {
    id: '8',
    name: 'Robert O\'Neill',
    recordsProcessed: 2719,
    verificationSuccessRate: 97.5,
    averageProcessingTime: 51,
    flaggedRecords: 22,
    status: 'online',
    department: 'Verification'
  },
  {
    id: '9',
    name: 'Amara Okafor',
    recordsProcessed: 2843,
    verificationSuccessRate: 98.8,
    averageProcessingTime: 46,
    flaggedRecords: 11,
    status: 'online',
    department: 'Records Management'
  },
  {
    id: '10',
    name: 'Thomas Brady',
    recordsProcessed: 2497,
    verificationSuccessRate: 97.1,
    averageProcessingTime: 54,
    flaggedRecords: 26,
    status: 'offline',
    department: 'Verification'
  },
  {
    id: '11',
    name: 'Victoria Martinez',
    recordsProcessed: 2765,
    verificationSuccessRate: 98.4,
    averageProcessingTime: 49,
    flaggedRecords: 14,
    status: 'online',
    department: 'Quality Assurance'
  },
  {
    id: '12',
    name: 'Christopher Lee',
    recordsProcessed: 2334,
    verificationSuccessRate: 96.2,
    averageProcessingTime: 60,
    flaggedRecords: 32,
    status: 'offline',
    department: 'Verification'
  }
]

const ROWS_PER_PAGE = 10

/**
 * OfficerPerformanceTable
 * 
 * Comprehensive analytics table featuring:
 * - Sortable columns with visual indicators
 * - Search/filter by officer name
 * - Pagination (10 rows per page)
 * - Status badges with online/offline indicators
 * - Color-coded accuracy rows
 * - CSV export functionality
 * - Full keyboard navigation
 * - WCAG AA accessibility compliance
 * - Loading skeleton states
 * - Responsive design with horizontal scroll on mobile
 */
export function OfficerPerformanceTable({
  data = SAMPLE_OFFICERS,
  loading = false,
  onRowClick,
  className
}: OfficerPerformanceTableProps) {
  const [sortField, setSortField] = useState<SortField>('recordsProcessed')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter data by search query
  const filteredData = useMemo(() => {
    return data.filter(officer =>
      officer.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [data, searchQuery])

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sortField) {
        case 'name':
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          break
        case 'recordsProcessed':
          aVal = a.recordsProcessed
          bVal = b.recordsProcessed
          break
        case 'verificationSuccessRate':
          aVal = a.verificationSuccessRate
          bVal = b.verificationSuccessRate
          break
        case 'averageProcessingTime':
          aVal = a.averageProcessingTime
          bVal = b.averageProcessingTime
          break
        case 'flaggedRecords':
          aVal = a.flaggedRecords
          bVal = b.flaggedRecords
          break
        default:
          return 0
      }

      if (aVal < bVal) {
        return sortDirection === 'asc' ? -1 : 1
      }
      if (aVal > bVal) {
        return sortDirection === 'asc' ? 1 : -1
      }
      return 0
    })

    return sorted
  }, [filteredData, sortField, sortDirection])

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * ROWS_PER_PAGE
    return sortedData.slice(startIdx, startIdx + ROWS_PER_PAGE)
  }, [sortedData, currentPage])

  const totalPages = Math.ceil(sortedData.length / ROWS_PER_PAGE)

  // Handle column header click
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }, [sortField, sortDirection])

  // Get row background color based on accuracy
  const getRowColor = (successRate: number): string => {
    if (successRate >= 95) return 'hover:bg-[rgba(16,185,129,0.05)]' // Green for >95%
    if (successRate >= 85) return 'hover:bg-[rgba(245,158,11,0.05)]' // Amber for 85-94%
    return 'hover:bg-[rgba(220,38,38,0.05)]' // Red for <85%
  }

  // Get accuracy badge variant
  const getAccuracyVariant = (successRate: number): 'success' | 'warning' | 'danger' => {
    if (successRate >= 95) return 'success'
    if (successRate >= 85) return 'warning'
    return 'danger'
  }

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Officer Name', 'Records Processed', 'Verification Success Rate (%)', 'Average Processing Time (seconds)', 'Flagged Records', 'Status']
    const csvContent = [
      headers.join(','),
      ...sortedData.map(officer =>
        [
          `"${officer.name}"`,
          officer.recordsProcessed,
          officer.verificationSuccessRate.toFixed(1),
          officer.averageProcessingTime,
          officer.flaggedRecords,
          officer.status
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `officer-performance-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 text-[#6b7280] opacity-0 group-hover:opacity-50 transition-opacity" />
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-[#14b8a6]" />
      : <ChevronDown className="w-4 h-4 text-[#14b8a6]" />
  }

  // Render table header cell
  const renderHeaderCell = (label: string, field: SortField) => (
    <button
      onClick={() => handleSort(field)}
      className={cn(
        'group',
        'flex items-center gap-2',
        'px-4 py-3',
        'text-left font-semibold text-sm',
        'text-[#a0a9c9]',
        'cursor-pointer',
        'transition-colors duration-200',
        'hover:text-white hover:bg-[rgba(20,184,166,0.05)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
        'rounded-lg'
      )}
      aria-label={`Sort by ${label}`}
      aria-sort={sortField === field ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      {label}
      {renderSortIndicator(field)}
    </button>
  )

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Officer Performance</h2>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExportCSV}
            disabled={sortedData.length === 0}
          >
            Export CSV
          </Button>
        </div>

        {/* Search Bar */}
        <Input
          placeholder="Search officer name..."
          leftIcon={<Search className="w-4 h-4" />}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
          className="max-w-sm"
          aria-label="Search officers by name"
        />
      </div>

      {/* Results info */}
      <div className="text-sm text-[#6b7280]">
        {filteredData.length === 0 ? (
          'No officers found'
        ) : (
          <>
            Showing {((currentPage - 1) * ROWS_PER_PAGE) + 1} to {Math.min(currentPage * ROWS_PER_PAGE, filteredData.length)} of {filteredData.length} officers
          </>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl">
        <GlassCard variant="elevated" padding="none" className="overflow-hidden">
          {loading ? (
            // Loading Skeleton
            <div className="divide-y divide-[rgba(255,255,255,0.1)]">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center px-4 py-3 gap-4 border-b border-[rgba(255,255,255,0.1)]">
                  <Skeleton width="25%" height={20} />
                  <Skeleton width="12%" height={20} />
                  <Skeleton width="15%" height={20} />
                  <Skeleton width="18%" height={20} />
                  <Skeleton width="12%" height={20} />
                  <Skeleton width="10%" height={24} className="rounded" />
                </div>
              ))}
            </div>
          ) : paginatedData.length === 0 ? (
            // Empty State
            <div className="px-6 py-12 text-center">
              <p className="text-[#a0a9c9] mb-2">No officers to display</p>
              <p className="text-sm text-[#6b7280]">
                {searchQuery ? 'Try adjusting your search filters' : 'No data available'}
              </p>
            </div>
          ) : (
            // Table
            <div className="relative overflow-hidden">
              {/* Header Row */}
              <div className="sticky top-0 bg-gradient-to-r from-[#14b8a6]/10 via-transparent to-[#7c3aed]/10 backdrop-blur-sm border-b border-[rgba(255,255,255,0.1)]">
                <div className="grid grid-cols-6 gap-0 min-w-full">
                  {renderHeaderCell('Officer Name', 'name')}
                  {renderHeaderCell('Records Processed', 'recordsProcessed')}
                  {renderHeaderCell('Success Rate %', 'verificationSuccessRate')}
                  {renderHeaderCell('Avg Time (sec)', 'averageProcessingTime')}
                  {renderHeaderCell('Flagged Records', 'flaggedRecords')}
                  <div className="px-4 py-3 text-left font-semibold text-sm text-[#a0a9c9]">
                    Status
                  </div>
                </div>
              </div>

              {/* Body Rows */}
              <div className="divide-y divide-[rgba(255,255,255,0.1)]">
                {paginatedData.map((officer, index) => (
                  <div
                    key={officer.id}
                    onClick={() => onRowClick?.(officer)}
                    className={cn(
                      'grid grid-cols-6 gap-0 min-w-full',
                      'transition-colors duration-200 ease-out',
                      'border-b border-[rgba(255,255,255,0.05)]',
                      getRowColor(officer.verificationSuccessRate),
                      onRowClick && 'cursor-pointer',
                      'focus-within:ring-2 focus-within:ring-[#14b8a6] focus-within:ring-inset'
                    )}
                    role={onRowClick ? 'button' : 'row'}
                    tabIndex={onRowClick ? 0 : -1}
                    onKeyDown={onRowClick ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onRowClick(officer)
                      }
                    } : undefined}
                  >
                    {/* Officer Name */}
                    <div className="px-4 py-4 text-sm font-medium text-white truncate">
                      {officer.name}
                    </div>

                    {/* Records Processed */}
                    <div className="px-4 py-4 text-sm text-[#a0a9c9]">
                      {officer.recordsProcessed.toLocaleString()}
                    </div>

                    {/* Verification Success Rate */}
                    <div className="px-4 py-4">
                      <Badge
                        variant={getAccuracyVariant(officer.verificationSuccessRate)}
                        size="sm"
                      >
                        {officer.verificationSuccessRate.toFixed(1)}%
                      </Badge>
                    </div>

                    {/* Average Processing Time */}
                    <div className="px-4 py-4 text-sm text-[#a0a9c9]">
                      {officer.averageProcessingTime}s
                    </div>

                    {/* Flagged Records */}
                    <div className="px-4 py-4 text-sm text-[#a0a9c9]">
                      {officer.flaggedRecords}
                    </div>

                    {/* Status Badge */}
                    <div className="px-4 py-4">
                      <div className="flex items-center gap-2 w-fit">
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          officer.status === 'online'
                            ? 'bg-[#10b981] animate-pulse'
                            : 'bg-[#6b7280]'
                        )} />
                        <span className={cn(
                          'text-xs font-medium capitalize',
                          officer.status === 'online' ? 'text-[#10b981]' : 'text-[#6b7280]'
                        )}>
                          {officer.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-[#6b7280]">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Accessibility Info */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {filteredData.length} results. Table is sortable by clicking column headers.
        {searchQuery && ` Filtered by: ${searchQuery}`}
        {currentPage > 1 && ` Currently viewing page ${currentPage} of ${totalPages}`}
      </div>
    </div>
  )
}

export default OfficerPerformanceTable
