// ============================================================
// CRDVS Format Utilities
// ============================================================

/**
 * Format a date string to a human-readable format.
 * e.g. "2026-06-22" → "22 June 2026"
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

/**
 * Format a datetime string to a human-readable format with time.
 * e.g. "2026-06-22T10:30:00Z" → "22 June 2026, 10:30"
 */
export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

/**
 * Format a date to YYYYMMDD for use in IDs.
 * e.g. new Date() → "20260622"
 */
export function formatDateForId(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

/**
 * Generate a criminal record ID.
 * Format: CR-DDDDDDDADD (e.g. CR-0012345B26)
 * Uses a sequential number padded to 7 digits + alpha char + 2-digit year
 */
export function generateRecordId(sequenceNumber: number): string {
  const paddedNum = String(sequenceNumber).padStart(7, '0')
  const alphaChar = String.fromCharCode(65 + (sequenceNumber % 26)) // A-Z
  const year = String(new Date().getFullYear()).slice(-2)
  return `CR-${paddedNum}${alphaChar}${year}`
}

/**
 * Generate a case number.
 * Format: CASE-YYYY-DDDDD (e.g. CASE-2026-00123)
 */
export function generateCaseNumber(sequenceNumber: number): string {
  const year = new Date().getFullYear()
  const paddedNum = String(sequenceNumber).padStart(5, '0')
  return `CASE-${year}-${paddedNum}`
}

/**
 * Generate a report ID.
 * Format: RPT-YYYYMMDD-DDDD (e.g. RPT-20260622-0001)
 */
export function generateReportId(sequenceNumber: number): string {
  const dateStr = formatDateForId()
  const paddedNum = String(sequenceNumber).padStart(4, '0')
  return `RPT-${dateStr}-${paddedNum}`
}

/**
 * Generate a verification request reference.
 * Format: VRQ-YYYYMMDD-DDDDD (e.g. VRQ-20260622-00001)
 */
export function generateVerificationRef(sequenceNumber: number): string {
  const dateStr = formatDateForId()
  const paddedNum = String(sequenceNumber).padStart(5, '0')
  return `VRQ-${dateStr}-${paddedNum}`
}

/**
 * Format a national ID for display (mask middle digits for security).
 * e.g. "63-6323979A13" → "63-****979A13"
 */
export function maskNationalId(nationalId: string): string {
  if (!nationalId || nationalId.length < 10) return nationalId
  const prefix = nationalId.substring(0, 3) // "63-"
  const suffix = nationalId.substring(8)     // "A13"
  return `${prefix}****${suffix}`
}

/**
 * Format currency (Zimbabwe dollars).
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return 'N/A'
  return new Intl.NumberFormat('en-ZW', {
    style: 'currency',
    currency: 'ZWL',
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Truncate long text with an ellipsis.
 */
export function truncate(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Format offense category for display.
 * e.g. "violent_crime" → "Violent Crime"
 */
export function formatOffenseCategory(category: string): string {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Format record status for display.
 * e.g. "under_investigation" → "Under Investigation"
 */
export function formatStatus(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Calculate age from date of birth.
 */
export function calculateAge(dob: string): number {
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

/**
 * Get relative time string (e.g. "2 hours ago", "3 days ago").
 */
export function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  return formatDate(dateStr)
}

/**
 * Alias for getRelativeTime for compatibility
 */
export const formatDistanceToNow = getRelativeTime
