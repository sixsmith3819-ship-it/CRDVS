'use client'

import { useState } from 'react'
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { colors } from '@/lib/design-tokens'

interface VerificationCardProps {
  record: {
    id: string
    national_id: string
    full_name: string
    date_of_birth: string
    conviction_count: number
    last_conviction_date: string | null
    risk_level: 'low' | 'medium' | 'high' | 'critical'
    status: 'active' | 'inactive' | 'pending'
    confidence_score: number
    match_type: 'exact' | 'fuzzy' | 'partial'
    crimes?: Array<{
      type: string
      date: string
      court: string
      sentence: string
      status: string
    }>
  }
  searchParams?: any
  onViewDetails?: (id: string) => void
  onGenerateReport?: (id: string) => void
  className?: string
}

export function VerificationCard({ 
  record, 
  searchParams, 
  onViewDetails, 
  onGenerateReport,
  className 
}: VerificationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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

  const getMatchTypeConfig = (matchType: string) => {
    switch (matchType) {
      case 'exact':
        return { 
          variant: 'success' as const, 
          label: 'Exact Match',
          description: 'All provided information matches exactly'
        }
      case 'fuzzy':
        return { 
          variant: 'warning' as const, 
          label: 'Fuzzy Match',
          description: 'Similar information found with minor differences'
        }
      case 'partial':
        return { 
          variant: 'info' as const, 
          label: 'Partial Match',
          description: 'Some information matches, verification needed'
        }
      default:
        return { 
          variant: 'default' as const, 
          label: 'Unknown',
          description: 'Match type not determined'
        }
    }
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return colors.statusSuccess
    if (score >= 0.7) return colors.statusInfo  
    if (score >= 0.5) return colors.statusWarning
    return colors.statusDanger
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birth = new Date(dateOfBirth)
    const age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1
    }
    return age
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Check for mismatches
  const getMismatchWarnings = () => {
    const warnings = []
    
    if (searchParams?.fullName && record.full_name.toLowerCase() !== searchParams.fullName.toLowerCase()) {
      warnings.push({
        field: 'Name',
        searched: searchParams.fullName,
        found: record.full_name
      })
    }
    
    if (searchParams?.nationalId && record.national_id !== searchParams.nationalId) {
      warnings.push({
        field: 'National ID',
        searched: searchParams.nationalId,
        found: record.national_id
      })
    }
    
    if (searchParams?.dateOfBirth && record.date_of_birth !== searchParams.dateOfBirth) {
      warnings.push({
        field: 'Date of Birth',
        searched: formatDate(searchParams.dateOfBirth),
        found: formatDate(record.date_of_birth)
      })
    }
    
    return warnings
  }

  const riskConfig = getRiskConfig(record.risk_level)
  const matchConfig = getMatchTypeConfig(record.match_type)
  const mismatchWarnings = getMismatchWarnings()

  return (
    <GlassCard className={cn("transition-all duration-300 hover:scale-[1.01]", className)}>
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* Risk Indicator */}
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ 
              backgroundColor: riskConfig.bgColor,
              color: riskConfig.color 
            }}
          >
            {riskConfig.icon}
          </div>
          
          {/* Basic Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {record.full_name}
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              ID: {record.national_id} • Age: {calculateAge(record.date_of_birth)}
            </p>
            
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={riskConfig.label === 'Low Risk' ? 'success' : 
                            riskConfig.label === 'Medium Risk' ? 'info' :
                            riskConfig.label === 'High Risk' ? 'warning' : 'danger'}>
                {riskConfig.label}
              </Badge>
              <Badge variant={matchConfig.variant}>
                {matchConfig.label}
              </Badge>
              <Badge variant="default">
                {record.conviction_count} Conviction{record.conviction_count !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="text-right flex-shrink-0">
          <div className="text-xs text-gray-600 mb-1">Confidence</div>
          <div 
            className="text-lg font-bold"
            style={{ color: getConfidenceColor(record.confidence_score) }}
          >
            {Math.round(record.confidence_score * 100)}%
          </div>
          <div className="w-16 h-1 rounded-full bg-[#3a4254] overflow-hidden">
            <div 
              className="h-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${record.confidence_score * 100}%`,
                backgroundColor: getConfidenceColor(record.confidence_score)
              }}
            />
          </div>
        </div>
      </div>

      {/* Mismatch Warnings */}
      {mismatchWarnings.length > 0 && (
        <div 
          className="mb-4 p-3 rounded-lg border-l-4"
          style={{
            backgroundColor: `${colors.statusWarning}15`,
            borderColor: colors.statusWarning,
            borderLeftColor: colors.statusWarning
          }}
        >
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0" style={{ color: colors.statusWarning }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 mb-1">Field Mismatches Detected</h4>
              <div className="space-y-1">
                {mismatchWarnings.map((warning, index) => (
                  <div key={index} className="text-xs text-gray-700">
                    <span className="font-medium">{warning.field}:</span> 
                    <span className="text-red-400"> Searched: "{warning.searched}"</span> 
                    <span className="text-gray-600"> → </span>
                    <span className="text-gray-900">Found: "{warning.found}"</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
            {record.last_conviction_date ? formatDate(record.last_conviction_date) : 'None'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Match Type</p>
          <span 
            className="text-sm font-medium"
            style={{ color: matchConfig.variant === 'success' ? colors.statusSuccess :
                         matchConfig.variant === 'warning' ? colors.statusWarning :
                         matchConfig.variant === 'info' ? colors.statusInfo : colors.textSecondary }}
          >
            {matchConfig.label}
          </span>
        </div>
      </div>

      {/* Expand Toggle */}
      <div className="border-t pt-4" style={{ borderColor: colors.glassBorder }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-sm text-gray-700 hover:text-gray-900 transition-colors"
        >
          <span>{isExpanded ? 'Hide Details' : 'Show Criminal History'}</span>
          <svg 
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isExpanded && "rotate-180"
            )} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded Content */}
        {isExpanded && record.crimes && record.crimes.length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">Criminal History ({record.crimes.length} records)</h4>
            {record.crimes.map((crime, index) => (
              <div 
                key={index}
                className="p-3 rounded-lg border"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
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
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: colors.glassBorder }}>
          <div className="text-xs text-gray-600">
            Match confidence: {matchConfig.description}
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => onGenerateReport?.(record.id)}
            >
              Generate Report
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => onViewDetails?.(record.id)}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

export default VerificationCard


