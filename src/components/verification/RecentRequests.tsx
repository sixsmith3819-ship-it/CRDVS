'use client'

import { useState, useEffect } from 'react'
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { colors } from '@/lib/design-tokens'

interface VerificationRequest {
  id: string
  search_params: {
    national_id?: string
    full_name?: string
    date_of_birth?: string
    phone_number?: string
  }
  results_count: number
  high_risk_found: boolean
  exact_matches: number
  fuzzy_matches: number
  status: 'completed' | 'in_progress' | 'failed'
  created_at: string
  created_by: string
  execution_time_ms: number
}

interface RecentRequestsProps {
  userId?: string
  className?: string
}

export function RecentRequests({ userId, className }: RecentRequestsProps) {
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<'all' | 'completed' | 'high_risk' | 'recent'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'results' | 'execution_time'>('date')

  const itemsPerPage = 10

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockRequests: VerificationRequest[] = [
      {
        id: 'req_001',
        search_params: {
          national_id: '63-1234567A12',
          full_name: 'John Doe'
        },
        results_count: 1,
        high_risk_found: true,
        exact_matches: 1,
        fuzzy_matches: 0,
        status: 'completed',
        created_at: '2024-01-15T14:30:00Z',
        created_by: 'Officer Smith',
        execution_time_ms: 1250
      },
      {
        id: 'req_002',
        search_params: {
          full_name: 'Jane Smith',
          date_of_birth: '1985-03-20'
        },
        results_count: 0,
        high_risk_found: false,
        exact_matches: 0,
        fuzzy_matches: 0,
        status: 'completed',
        created_at: '2024-01-15T13:45:00Z',
        created_by: 'Officer Johnson',
        execution_time_ms: 890
      },
      {
        id: 'req_003',
        search_params: {
          national_id: '63-9876543B21',
          phone_number: '+263712345678'
        },
        results_count: 2,
        high_risk_found: false,
        exact_matches: 1,
        fuzzy_matches: 1,
        status: 'completed',
        created_at: '2024-01-15T12:15:00Z',
        created_by: 'Officer Williams',
        execution_time_ms: 1680
      },
      {
        id: 'req_004',
        search_params: {
          full_name: 'Michael Brown'
        },
        results_count: 3,
        high_risk_found: true,
        exact_matches: 2,
        fuzzy_matches: 1,
        status: 'completed',
        created_at: '2024-01-15T11:20:00Z',
        created_by: 'Officer Davis',
        execution_time_ms: 2100
      },
      {
        id: 'req_005',
        search_params: {
          national_id: '63-5555555C33',
          full_name: 'Sarah Wilson',
          date_of_birth: '1990-07-15'
        },
        results_count: 1,
        high_risk_found: false,
        exact_matches: 1,
        fuzzy_matches: 0,
        status: 'completed',
        created_at: '2024-01-15T10:30:00Z',
        created_by: 'Officer Miller',
        execution_time_ms: 945
      }
    ]

    setTimeout(() => {
      setRequests(mockRequests)
      setLoading(false)
    }, 1000)
  }, [userId])

  // Filter and sort requests
  const filteredRequests = requests
    .filter(request => {
      switch (filter) {
        case 'completed':
          return request.status === 'completed'
        case 'high_risk':
          return request.high_risk_found
        case 'recent':
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
          return new Date(request.created_at) > oneDayAgo
        default:
          return true
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'results':
          return b.results_count - a.results_count
        case 'execution_time':
          return b.execution_time_ms - a.execution_time_ms
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const formatExecutionTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const getSearchSummary = (params: any) => {
    const parts = []
    if (params.national_id) parts.push(`ID: ${params.national_id}`)
    if (params.full_name) parts.push(`Name: ${params.full_name}`)
    if (params.date_of_birth) parts.push(`DOB: ${new Date(params.date_of_birth).toLocaleDateString()}`)
    if (params.phone_number) parts.push(`Phone: ${params.phone_number}`)
    return parts.join(', ') || 'No search parameters'
  }

  if (loading) {
    return (
      <GlassCard className={className}>
        <div className="animate-pulse">
          <div className="h-6 bg-[#3a4254] rounded w-48 mb-6" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: colors.glass }}>
                <div className="space-y-2">
                  <div className="h-4 bg-[#3a4254] rounded w-64" />
                  <div className="h-3 bg-[#3a4254] rounded w-48" />
                </div>
                <div className="h-8 bg-[#3a4254] rounded w-20" />
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">Recent Verification Requests</h3>
          <Badge variant="info">{filteredRequests.length} Records</Badge>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Dropdown */}
          <div className="flex rounded-lg" style={{ backgroundColor: colors.surface }}>
            {[
              { key: 'all', label: 'All', count: requests.length },
              { key: 'completed', label: 'Completed', count: requests.filter(r => r.status === 'completed').length },
              { key: 'high_risk', label: 'High Risk', count: requests.filter(r => r.high_risk_found).length },
              { key: 'recent', label: 'Today', count: requests.filter(r => new Date(r.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => {
                  setFilter(filterOption.key as any)
                  setCurrentPage(1)
                }}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                  filter === filterOption.key
                    ? "bg-[#14b8a6] text-white shadow-sm"
                    : "text-[#a0a9c9] hover:text-white hover:bg-[#3a4254]"
                )}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 text-xs rounded-md border-0 text-white focus:ring-2 focus:ring-[#14b8a6]"
            style={{ backgroundColor: colors.surface }}
          >
            <option value="date">Sort by Date</option>
            <option value="results">Sort by Results</option>
            <option value="execution_time">Sort by Speed</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {paginatedRequests.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-8 h-8 text-[#6b7280] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-[#6b7280] text-sm">No verification requests found</p>
          </div>
        ) : (
          paginatedRequests.map((request) => (
            <div
              key={request.id}
              className="p-4 rounded-lg border transition-all duration-200 hover:border-[#14b8a6]/30 cursor-pointer group"
              style={{
                backgroundColor: colors.glass,
                borderColor: colors.glassBorder
              }}
              onClick={() => {
                // Handle click to view details
                console.log('View request details:', request.id)
              }}
            >
              <div className="flex items-start justify-between">
                {/* Request Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-sm font-medium text-white truncate">
                      {getSearchSummary(request.search_params)}
                    </h4>
                    <div className="flex items-center gap-1">
                      {request.high_risk_found && (
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="High Risk Found" />
                      )}
                      {request.exact_matches > 0 && (
                        <Badge variant="success" className="text-xs py-0">
                          {request.exact_matches} Exact
                        </Badge>
                      )}
                      {request.fuzzy_matches > 0 && (
                        <Badge variant="warning" className="text-xs py-0">
                          {request.fuzzy_matches} Fuzzy
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-[#6b7280]">
                    <span>By {request.created_by}</span>
                    <span>{formatDate(request.created_at)}</span>
                    <span>{formatExecutionTime(request.execution_time_ms)}</span>
                    <span>
                      {request.results_count === 0 
                        ? 'No records found'
                        : `${request.results_count} record${request.results_count !== 1 ? 's' : ''} found`
                      }
                    </span>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Badge 
                    variant={
                      request.status === 'completed' ? 'success' :
                      request.status === 'in_progress' ? 'warning' : 'danger'
                    }
                    className="capitalize"
                  >
                    {request.status === 'in_progress' ? 'In Progress' : request.status}
                  </Badge>
                  
                  <svg 
                    className="w-4 h-4 text-[#6b7280] group-hover:text-[#14b8a6] transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Results Summary (on hover) */}
              {request.results_count > 0 && (
                <div className="mt-3 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ borderColor: colors.glassBorder }}>
                  <div className="flex items-center gap-4 text-xs">
                    {request.high_risk_found && (
                      <div className="flex items-center gap-1 text-red-400">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        High Risk Individual
                      </div>
                    )}
                    <div className="text-[#a0a9c9]">
                      {request.exact_matches > 0 && `${request.exact_matches} exact matches`}
                      {request.fuzzy_matches > 0 && `${request.fuzzy_matches} fuzzy matches`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: colors.glassBorder }}>
          <div className="text-sm text-[#6b7280]">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of {filteredRequests.length} requests
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1
                const isVisible = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                
                if (!isVisible && page === 2 && currentPage > 4) {
                  return <span key={page} className="text-[#6b7280]">...</span>
                }
                if (!isVisible && page === totalPages - 1 && currentPage < totalPages - 3) {
                  return <span key={page} className="text-[#6b7280]">...</span>
                }
                if (!isVisible) return null
                
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-8 h-8 text-xs rounded-md transition-colors",
                      page === currentPage
                        ? "bg-[#14b8a6] text-white"
                        : "text-[#a0a9c9] hover:text-white hover:bg-[#3a4254]"
                    )}
                  >
                    {page}
                  </button>
                )
              })}
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-4 p-3 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4" style={{ backgroundColor: `${colors.auroraTeal}10` }}>
        <div className="text-center">
          <div className="text-lg font-bold text-white">{requests.length}</div>
          <div className="text-xs text-[#a0a9c9]">Total Requests</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{requests.filter(r => r.status === 'completed').length}</div>
          <div className="text-xs text-[#a0a9c9]">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-400">{requests.filter(r => r.high_risk_found).length}</div>
          <div className="text-xs text-[#a0a9c9]">High Risk Found</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">
            {requests.length > 0 ? Math.round(requests.reduce((sum, r) => sum + r.execution_time_ms, 0) / requests.length) : 0}ms
          </div>
          <div className="text-xs text-[#a0a9c9]">Avg Response</div>
        </div>
      </div>
    </GlassCard>
  )
}

export default RecentRequests
