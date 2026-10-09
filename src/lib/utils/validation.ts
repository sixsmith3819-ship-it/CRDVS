// ============================================================
// CRDVS Validation Utilities
// Input validation for all form data and ID formats
// ============================================================

import { NATIONAL_ID_REGEX, RECORD_ID_REGEX, CASE_NUMBER_REGEX } from '@/types'

// ============================================================
// ID Format Validators
// ============================================================

/**
 * Validate National ID format: DD-DDDDDDDADD
 * e.g. 63-6323979A13
 */
export function validateNationalId(id: string): { valid: boolean; error?: string } {
  if (!id || id.trim() === '') {
    return { valid: false, error: 'National ID is required' }
  }
  const trimmed = id.trim().toUpperCase()
  if (!NATIONAL_ID_REGEX.test(trimmed)) {
    return {
      valid: false,
      error: 'Invalid National ID format. Expected: DD-DDDDDDDADD (e.g. 63-6323979A13)',
    }
  }
  return { valid: true }
}

/**
 * Validate Criminal Record ID format: CR-DDDDDDDADD
 * e.g. CR-0012345B26
 */
export function validateRecordId(id: string): { valid: boolean; error?: string } {
  if (!id || id.trim() === '') {
    return { valid: false, error: 'Record ID is required' }
  }
  if (!RECORD_ID_REGEX.test(id.trim().toUpperCase())) {
    return {
      valid: false,
      error: 'Invalid Record ID format. Expected: CR-DDDDDDDADD (e.g. CR-0012345B26)',
    }
  }
  return { valid: true }
}

/**
 * Validate Case Number format: CASE-YYYY-DDDDD
 * e.g. CASE-2026-00123
 */
export function validateCaseNumber(cn: string): { valid: boolean; error?: string } {
  if (!cn || cn.trim() === '') {
    return { valid: false, error: 'Case number is required' }
  }
  if (!CASE_NUMBER_REGEX.test(cn.trim().toUpperCase())) {
    return {
      valid: false,
      error: 'Invalid case number format. Expected: CASE-YYYY-DDDDD (e.g. CASE-2026-00123)',
    }
  }
  return { valid: true }
}

// ============================================================
// Field Validators
// ============================================================

export function validateFullName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Full name is required' }
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Full name must be at least 2 characters' }
  }
  if (name.trim().length > 200) {
    return { valid: false, error: 'Full name must not exceed 200 characters' }
  }
  // Allow letters, spaces, hyphens, apostrophes
  if (!/^[a-zA-Z\s\-'.]+$/.test(name.trim())) {
    return { valid: false, error: 'Full name contains invalid characters' }
  }
  return { valid: true }
}

export function validateDateOfBirth(dob: string): { valid: boolean; error?: string } {
  if (!dob) {
    return { valid: false, error: 'Date of birth is required' }
  }
  const date = new Date(dob)
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date format' }
  }
  const today = new Date()
  const minAge = 10
  const maxAge = 120
  const age = today.getFullYear() - date.getFullYear()
  if (date > today) {
    return { valid: false, error: 'Date of birth cannot be in the future' }
  }
  if (age < minAge) {
    return { valid: false, error: `Subject must be at least ${minAge} years old` }
  }
  if (age > maxAge) {
    return { valid: false, error: 'Please enter a valid date of birth' }
  }
  return { valid: true }
}

export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim() === '') {
    return { valid: false, error: 'Email is required' }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Invalid email address' }
  }
  return { valid: true }
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required' }
  }
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' }
  }
  return { valid: true }
}

export function validateEmployeeId(id: string): { valid: boolean; error?: string } {
  if (!id || id.trim() === '') {
    return { valid: false, error: 'Employee ID is required' }
  }
  if (id.trim().length < 3) {
    return { valid: false, error: 'Employee ID must be at least 3 characters' }
  }
  if (id.trim().length > 50) {
    return { valid: false, error: 'Employee ID must not exceed 50 characters' }
  }
  return { valid: true }
}

export function validatePhone(phone: string): { valid: boolean; error?: string } {
  if (!phone) return { valid: true } // Phone is optional
  const cleaned = phone.replace(/\s/g, '')
  // Zimbabwe phone format: +263 or 07x
  if (!/^(\+263|0)[0-9]{9}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'Invalid phone number. Use format: +263771234567 or 0771234567',
    }
  }
  return { valid: true }
}

// ============================================================
// Sanitization
// ============================================================

/**
 * Sanitize a string for safe DB storage.
 * Trims whitespace and normalizes multiple spaces.
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ')
}

/**
 * Sanitize a National ID — uppercase and trim.
 */
export function sanitizeNationalId(id: string): string {
  return id.trim().toUpperCase()
}

/**
 * Sanitize a name — title case, trimmed.
 */
export function sanitizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/(?:^|\s|-|')\S/g, (char) => char.toUpperCase())
}
