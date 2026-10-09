// ============================================================
// CRDVS - Application-wide TypeScript types
// ============================================================

export * from './database'

// ============================================================
// API Response types
// ============================================================

export interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ============================================================
// Search and filter types
// ============================================================

export interface RecordSearchParams {
  query?: string          // Full-text search
  status?: string
  riskLevel?: number
  isRepeatOffender?: boolean
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface VerificationResult {
  isVerified: boolean
  confidenceScore: number   // 0-100
  status: 'verified' | 'unverified' | 'mismatch' | 'flagged'
  matchedFields: string[]
  mismatchedFields: string[]
  criminalRecord: import('./database').CriminalRecord | null
  nationalId: import('./database').NationalId | null
  message: string
}

export interface DuplicateDetectionResult {
  hasDuplicates: boolean
  potentialDuplicates: DuplicateMatch[]
  totalChecked: number
}

export interface DuplicateMatch {
  recordId: string
  recordDisplayId: string
  fullName: string
  nationalIdNumber: string
  dateOfBirth: string
  similarityScore: number
  nameSimilarity: number
  dobMatch: boolean
  nationalIdMatch: boolean
  matchingFields: string[]
}

export interface RepeatOffenderAnalysis {
  isRepeatOffender: boolean
  totalConvictions: number
  convictionsByCategory: Record<string, number>
  riskLevel: number
  riskLabel: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Critical'
  firstConvictionDate: string | null
  mostRecentConviction: string | null
  activeConvictions: number
}

// ============================================================
// ID Format validation helpers
// ============================================================

/** National ID format: DD-DDDDDDDADD e.g. 63-6323979A13 */
export const NATIONAL_ID_REGEX = /^\d{2}-\d{7}[A-Z]\d{2}$/

/** Criminal Record ID format: CR-DDDDDDDADD e.g. CR-0012345B26 */
export const RECORD_ID_REGEX = /^CR-\d{7}[A-Z]\d{2}$/

/** Case Number format: CASE-YYYY-DDDDD */
export const CASE_NUMBER_REGEX = /^CASE-\d{4}-\d{5}$/

/** Report ID format: RPT-YYYYMMDD-DDDD */
export const REPORT_ID_REGEX = /^RPT-\d{8}-\d{4}$/

export function isValidNationalId(id: string): boolean {
  return NATIONAL_ID_REGEX.test(id)
}

export function isValidRecordId(id: string): boolean {
  return RECORD_ID_REGEX.test(id)
}

export function isValidCaseNumber(cn: string): boolean {
  return CASE_NUMBER_REGEX.test(cn)
}

// ============================================================
// UI / Display types
// ============================================================

export interface NavItem {
  label: string
  href: string
  icon: string
  roles: import('./database').UserRole[]   // Which roles can see this nav item
  badge?: number
}

export interface DashboardStats {
  totalRecords: number
  activeRecords: number
  pendingVerifications: number
  duplicateFlagsCount: number
  repeatOffendersCount: number
  reportsGeneratedToday: number
}

export type RiskLabel = 'Low' | 'Moderate' | 'High' | 'Very High' | 'Critical'

export function getRiskLabel(level: number): RiskLabel {
  const labels: Record<number, RiskLabel> = {
    1: 'Low',
    2: 'Moderate',
    3: 'High',
    4: 'Very High',
    5: 'Critical',
  }
  return labels[level] ?? 'Low'
}

export function getRiskColor(level: number): string {
  const colors: Record<number, string> = {
    1: 'text-green-700 bg-green-100',
    2: 'text-yellow-700 bg-yellow-100',
    3: 'text-orange-700 bg-orange-100',
    4: 'text-red-700 bg-red-100',
    5: 'text-white bg-red-800',
  }
  return colors[level] ?? 'text-gray-700 bg-gray-100'
}
