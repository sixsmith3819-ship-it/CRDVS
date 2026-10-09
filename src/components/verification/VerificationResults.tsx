'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'
import { colors } from '@/lib/design-tokens'
import { formatDate, calculateAge } from '@/lib/utils/format'

interface VerificationResultsProps {
  results: any
  searchParams?: any
  onNewSearch?: () => void
}

interface CriminalRecord {
  id: string
  national_id: string
  full_name: string
  date_of_birth: string
  conviction_count: number
  last_conviction_date: string | null
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'inactive' | 'pending'
  crimes: Array<{
    type: string
    date: string
    court: string
    sentence: string
    status: string
  }>
}

export function VerificationResults({ results, searchParams, onNewSearch }: VerificationResultsProps) {
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const { records = [], exactMatches = 0, fuzzyMatches = 0, noRecordsFound = false, searchId } = results

  const getRiskConfig = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return {
          color: colors.statusDanger,
          bgColor: `${colors.statusDanger}20`,
          label: 'Critical Risk',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        }
      case 'high':
        return {
          color: colors.statusWarning,
          bgColor: `${colors.statusWarning}20`,
          label: 'High Risk',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        }
      case 'medium':
        return {
          color: colors.statusInfo,
          bgColor: `${colors.statusInfo}20`,
          label: 'Medium Risk',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )
        }
      default:
        return {
          color: colors.statusSuccess,
          bgColor: `${colors.statusSuccess}20`,
          label: 'Low Risk',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )
        }
    }
  }

  if (noRecordsFound) {
    return (
      <GlassCard variant="success" className="text-center">
        <div className="py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Criminal Record Found
          </h3>
          <p className="text-gray-700 mb-6 max-w-md mx-auto">
            The person you searched for does not have any criminal records in the criminal records database.
          </p>
          
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <p>• Search completed on {new Date().toLocaleString()}</p>
              {searchId && <p>• Reference ID: {searchId}</p>}
            </div>
            
            <Button onClick={onNewSearch} variant="primary">
              New Search
            </Button>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <GlassCard variant="aurora">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Verification Results</h2>
          <div className="flex items-center gap-3">
            <Badge variant="success">
              {records.length} Record{records.length !== 1 ? 's' : ''} Found
            </Badge>
            {searchId && (
              <span className="text-xs text-gray-600">
                ID: {searchId}
              </span>
            )}
          </div>
        </div>

        {/* Match Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.glass }}>
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-700">Exact Matches</p>
              <p className="text-lg font-bold text-gray-900">{exactMatches}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.glass }}>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-700">Fuzzy Matches</p>
              <p className="text-lg font-bold text-gray-900">{fuzzyMatches}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.glass }}>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-700">Total Records</p>
              <p className="text-lg font-bold text-gray-900">{records.length}</p>
            </div>
          </div>
        </div>

        {/* High Risk Alert */}
        {records.some((record: CriminalRecord) => ['high', 'critical'].includes(record.risk_level)) && (
          <div 
            className="p-4 rounded-lg border-l-4 mb-6"
            style={{
              backgroundColor: `${colors.statusDanger}15`,
              borderColor: colors.statusDanger,
              borderLeftColor: colors.statusDanger
            }}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: colors.statusDanger }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-gray-900">High Risk Individual Detected</h4>
                <p className="text-sm text-gray-700 mt-1">
                  This person has been flagged as high or critical risk. Additional verification procedures may be required.
                </p>
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Individual Records */}
      <div className="space-y-4">
        {records.map((record: CriminalRecord, index: number) => {
          const riskConfig = getRiskConfig(record.risk_level)
          const isExpanded = showDetails === record.id
          
          return (
            <GlassCard key={record.id} variant="elevated">
              {/* Record Header */}
              <div 
                className="cursor-pointer"
                onClick={() => setShowDetails(isExpanded ? null : record.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* Risk Indicator */}
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: riskConfig.bgColor,
                        color: riskConfig.color 
                      }}
                    >
                      {riskConfig.icon}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {record.full_name}
                      </h3>
                      <p className="text-sm text-gray-700">
                        ID: {record.national_id} • Age: {calculateAge(record.date_of_birth)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="info">{riskConfig.label}</Badge>
                    <Badge variant="default">
                      {record.conviction_count} Conviction{record.conviction_count !== 1 ? 's' : ''}
                    </Badge>
                    <svg 
                      className={cn(
                        "w-5 h-5 text-gray-700 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Quick Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Date of Birth</p>
                    <p className="text-sm font-medium text-gray-700">
                      {formatDate(record.date_of_birth)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Status</p>
                    <Badge 
                      variant={record.status === 'active' ? 'warning' : record.status === 'inactive' ? 'default' : 'info'}
                      className="capitalize"
                    >
                      {record.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Last Conviction</p>
                    <p className="text-sm font-medium text-gray-700">
                      {record.last_conviction_date 
                        ? formatDate(record.last_conviction_date)
                        : 'None'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Risk Level</p>
                    <span 
                      className="text-sm font-medium"
                      style={{ color: riskConfig.color }}
                    >
                      {riskConfig.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-6 pt-6 border-t space-y-6" style={{ borderColor: colors.glassBorder }}>
                  {/* Criminal History */}
                  {record.crimes && record.crimes.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-4">Criminal History</h4>
                      <div className="space-y-3">
                        {record.crimes.map((crime, crimeIndex) => (
                          <div 
                            key={crimeIndex}
                            className="p-4 rounded-lg border"
                            style={{
                              backgroundColor: colors.glass,
                              borderColor: colors.glassBorder
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{crime.type}</h5>
                              <Badge 
                                variant={crime.status === 'convicted' ? 'danger' : 'warning'}
                                className="capitalize"
                              >
                                {crime.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Date:</p>
                                <p className="text-gray-700">{formatDate(crime.date)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Court:</p>
                                <p className="text-gray-700">{crime.court}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Sentence:</p>
                                <p className="text-gray-700">{crime.sentence}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: colors.glassBorder }}>
                    <div className="text-xs text-gray-600">
                      Record #{index + 1} of {records.length}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button variant="secondary" size="sm">
                        Generate Report
                      </Button>
                      <Link href={`/dashboard/records/${record.id}`}>
                        <Button variant="primary" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          )
        })}
      </div>

      {/* Actions Footer */}
      <GlassCard variant="subtle">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Verification Complete</p>
            <p className="text-xs text-gray-600">
              Search completed at {new Date().toLocaleString()} • All results verified
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={onNewSearch}>
              New Search
            </Button>
            <Button variant="primary">
              Export Results
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export default VerificationResults


