/**
 * Conviction Form Validation Utilities
 * Ensures data integrity for all conviction-related fields
 */

export interface ConvictionValidationErrors {
  caseNumber?: string
  offenseCategory?: string
  offenseDescription?: string
  courtName?: string
  chargeDate?: string
  convictionDate?: string
  verdict?: string
  sentenceDescription?: string
}

/**
 * Validates case number format: CASE-YYYY-DDDDD
 */
export function validateCaseNumber(value: string): { valid: boolean; error?: string } {
  const trimmed = value.trim()

  if (!trimmed) {
    return { valid: false, error: 'Case number is required' }
  }

  if (!/^CASE-\d{4}-\d{5}$/.test(trimmed)) {
    return { valid: false, error: 'Case number must follow format: CASE-YYYY-DDDDD (e.g., CASE-2026-00123)' }
  }

  return { valid: true }
}

/**
 * Validates offense description - must contain letters, can have numbers and common punctuation
 * Rejects pure numbers or special characters
 */
export function validateOffenseDescription(value: string): { valid: boolean; error?: string } {
  const trimmed = value.trim()

  if (!trimmed) {
    return { valid: false, error: 'Offense description is required' }
  }

  if (trimmed.length < 5) {
    return { valid: false, error: 'Offense description must be at least 5 characters' }
  }

  if (trimmed.length > 500) {
    return { valid: false, error: 'Offense description must not exceed 500 characters' }
  }

  // Must contain at least some letters (not pure numbers or symbols)
  if (!/[a-zA-Z]/.test(trimmed)) {
    return { valid: false, error: 'Offense description must contain letters' }
  }

  // Allow letters, numbers, spaces, apostrophes, hyphens, periods, commas
  if (!/^[a-zA-Z0-9\s\-\.',()/&]+$/.test(trimmed)) {
    return { valid: false, error: 'Offense description contains invalid characters' }
  }

  return { valid: true }
}

/**
 * Validates court name - must contain letters, no pure numbers
 */
export function validateCourtName(value: string): { valid: boolean; error?: string } {
  const trimmed = value.trim()

  if (!trimmed) {
    return { valid: false, error: 'Court name is required' }
  }

  if (trimmed.length < 3) {
    return { valid: false, error: 'Court name must be at least 3 characters' }
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Court name must not exceed 100 characters' }
  }

  // Must contain at least some letters
  if (!/[a-zA-Z]/.test(trimmed)) {
    return { valid: false, error: 'Court name must contain letters' }
  }

  // Allow letters, numbers, spaces, hyphens
  if (!/^[a-zA-Z0-9\s\-'.,&]+$/.test(trimmed)) {
    return { valid: false, error: 'Court name contains invalid characters' }
  }

  return { valid: true }
}

/**
 * Validates charge date - must be a valid date and not in the future
 */
export function validateChargeDate(value: string): { valid: boolean; error?: string } {
  if (!value) {
    return { valid: false, error: 'Charge date is required' }
  }

  const chargeDate = new Date(value)
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  // Check if date is valid
  if (isNaN(chargeDate.getTime())) {
    return { valid: false, error: 'Invalid charge date' }
  }

  // Date should not be in the future
  if (chargeDate > today) {
    return { valid: false, error: 'Charge date cannot be in the future' }
  }

  // Date should not be more than 50 years ago
  const fiftyYearsAgo = new Date()
  fiftyYearsAgo.setFullYear(fiftyYearsAgo.getFullYear() - 50)

  if (chargeDate < fiftyYearsAgo) {
    return { valid: false, error: 'Charge date seems too old (more than 50 years ago)' }
  }

  return { valid: true }
}

/**
 * Validates conviction date - must be after or equal to charge date, not in future
 */
export function validateConvictionDate(
  value: string,
  chargeDate: string
): { valid: boolean; error?: string } {
  // Conviction date is optional
  if (!value) {
    return { valid: true }
  }

  const convictionDate = new Date(value)
  const charge = new Date(chargeDate)
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  // Check if date is valid
  if (isNaN(convictionDate.getTime())) {
    return { valid: false, error: 'Invalid conviction date' }
  }

  // Date should not be in the future
  if (convictionDate > today) {
    return { valid: false, error: 'Conviction date cannot be in the future' }
  }

  // Conviction date should not be before charge date
  if (convictionDate < charge) {
    return { valid: false, error: 'Conviction date cannot be before charge date' }
  }

  return { valid: true }
}

/**
 * Validates sentence description - must contain letters if provided
 */
export function validateSentenceDescription(value: string): { valid: boolean; error?: string } {
  // Sentence description is optional
  if (!value) {
    return { valid: true }
  }

  const trimmed = value.trim()

  if (trimmed.length < 3) {
    return { valid: false, error: 'Sentence description must be at least 3 characters if provided' }
  }

  if (trimmed.length > 500) {
    return { valid: false, error: 'Sentence description must not exceed 500 characters' }
  }

  // Must contain at least some letters
  if (!/[a-zA-Z]/.test(trimmed)) {
    return { valid: false, error: 'Sentence description must contain letters' }
  }

  // Allow letters, numbers, spaces, hyphens, periods, commas, parentheses
  if (!/^[a-zA-Z0-9\s\-\.',()/&]+$/.test(trimmed)) {
    return { valid: false, error: 'Sentence description contains invalid characters' }
  }

  return { valid: true }
}

/**
 * Validates all conviction fields and returns all errors
 */
export function validateConvictionForm(formData: {
  caseNumber: string
  offenseCategory: string
  offenseDescription: string
  courtName: string
  chargeDate: string
  convictionDate: string
  verdict: string
  sentenceDescription: string
}): { valid: boolean; errors: ConvictionValidationErrors } {
  const errors: ConvictionValidationErrors = {}

  // Validate case number
  const caseNumberValidation = validateCaseNumber(formData.caseNumber)
  if (!caseNumberValidation.valid) {
    errors.caseNumber = caseNumberValidation.error
  }

  // Validate offense description
  const offenseDescriptionValidation = validateOffenseDescription(formData.offenseDescription)
  if (!offenseDescriptionValidation.valid) {
    errors.offenseDescription = offenseDescriptionValidation.error
  }

  // Validate court name
  const courtNameValidation = validateCourtName(formData.courtName)
  if (!courtNameValidation.valid) {
    errors.courtName = courtNameValidation.error
  }

  // Validate charge date
  const chargeDateValidation = validateChargeDate(formData.chargeDate)
  if (!chargeDateValidation.valid) {
    errors.chargeDate = chargeDateValidation.error
  }

  // Validate conviction date
  const convictionDateValidation = validateConvictionDate(formData.convictionDate, formData.chargeDate)
  if (!convictionDateValidation.valid) {
    errors.convictionDate = convictionDateValidation.error
  }

  // Validate sentence description
  const sentenceDescriptionValidation = validateSentenceDescription(formData.sentenceDescription)
  if (!sentenceDescriptionValidation.valid) {
    errors.sentenceDescription = sentenceDescriptionValidation.error
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
