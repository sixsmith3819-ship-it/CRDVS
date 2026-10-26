/**
 * Signup Form Validation Utilities
 * Comprehensive validation for all signup fields
 */

export interface SignupValidationErrors {
  fullName?: string
  employeeId?: string
  email?: string
  role?: string
  rank?: string
  department?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

/**
 * Validates full name - letters only, no numbers
 */
export function validateFullName(value: string): { valid: boolean; error?: string } {
  const trimmed = value.trim()

  if (!trimmed) {
    return { valid: false, error: 'Full name is required' }
  }

  if (trimmed.length < 2) {
    return { valid: false, error: 'Full name must be at least 2 characters' }
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Full name must not exceed 100 characters' }
  }

  // Must contain at least some letters
  if (!/[a-zA-Z]/.test(trimmed)) {
    return { valid: false, error: 'Full name must contain letters' }
  }

  // Allow letters, spaces, hyphens, apostrophes only
  if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) {
    return { valid: false, error: 'Full name cannot contain numbers or special characters' }
  }

  return { valid: true }
}

/**
 * Validates employee/badge ID - alphanumeric with hyphens
 */
export function validateEmployeeId(value: string): { valid: boolean; error?: string } {
  const trimmed = value.trim()

  if (!trimmed) {
    return { valid: false, error: 'Employee/Badge ID is required' }
  }

  if (trimmed.length < 3) {
    return { valid: false, error: 'Employee ID must be at least 3 characters' }
  }

  if (trimmed.length > 50) {
    return { valid: false, error: 'Employee ID must not exceed 50 characters' }
  }

  // Allow letters, numbers, hyphens
  if (!/^[a-zA-Z0-9\-]+$/.test(trimmed)) {
    return { valid: false, error: 'Employee ID contains invalid characters' }
  }

  return { valid: true }
}

/**
 * Validates email address format
 */
export function validateEmail(value: string): { valid: boolean; error?: string } {
  const trimmed = value.trim().toLowerCase()

  if (!trimmed) {
    return { valid: false, error: 'Email address is required' }
  }

  // Standard email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid email address format' }
  }

  // Additional check for common typos
  if (trimmed.endsWith('.c') || trimmed.endsWith('.o')) {
    return { valid: false, error: 'Email address appears incomplete' }
  }

  return { valid: true }
}

/**
 * Validates role selection
 */
export function validateRole(value: string): { valid: boolean; error?: string } {
  const validRoles = ['police_officer', 'court_officer', 'prison_officer']

  if (!value) {
    return { valid: false, error: 'Please select a role' }
  }

  if (!validRoles.includes(value)) {
    return { valid: false, error: 'Invalid role selected' }
  }

  return { valid: true }
}

/**
 * Validates rank - optional, letters and spaces only
 */
export function validateRank(value: string): { valid: boolean; error?: string } {
  // Rank is optional
  if (!value) {
    return { valid: true }
  }

  const trimmed = value.trim()

  if (trimmed.length > 50) {
    return { valid: false, error: 'Rank must not exceed 50 characters' }
  }

  // Allow letters, spaces, hyphens, periods
  if (!/^[a-zA-Z\s\-'.]+$/.test(trimmed)) {
    return { valid: false, error: 'Rank contains invalid characters' }
  }

  return { valid: true }
}

/**
 * Validates department - optional, letters and spaces only
 */
export function validateDepartment(value: string): { valid: boolean; error?: string } {
  // Department is optional
  if (!value) {
    return { valid: true }
  }

  const trimmed = value.trim()

  if (trimmed.length > 100) {
    return { valid: false, error: 'Department must not exceed 100 characters' }
  }

  // Allow letters, spaces, hyphens, numbers, commas, slashes
  if (!/^[a-zA-Z0-9\s\-',/]+$/.test(trimmed)) {
    return { valid: false, error: 'Department contains invalid characters' }
  }

  return { valid: true }
}

/**
 * Validates phone number - Zimbabwe format
 */
export function validatePhone(value: string): { valid: boolean; error?: string } {
  // Phone is optional
  if (!value) {
    return { valid: true }
  }

  const trimmed = value.trim()
  const cleaned = trimmed.replace(/\s/g, '')

  // Allow Zimbabwe format: +263 followed by digits, or 07 followed by digits
  if (!/^(\+?263|0)[0-9]{9,10}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'Invalid phone number. Use Zimbabwe format: +263771234567 or 0771234567',
    }
  }

  return { valid: true }
}

/**
 * Validates password strength
 */
export function validatePassword(value: string): { valid: boolean; error?: string } {
  if (!value) {
    return { valid: false, error: 'Password is required' }
  }

  if (value.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' }
  }

  if (value.length > 128) {
    return { valid: false, error: 'Password must not exceed 128 characters' }
  }

  if (!/[A-Z]/.test(value)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' }
  }

  if (!/[a-z]/.test(value)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' }
  }

  if (!/[0-9]/.test(value)) {
    return { valid: false, error: 'Password must contain at least one number' }
  }

  // Check for special characters (recommended but not required)
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    return {
      valid: false,
      error: 'Password should contain at least one special character (!@#$%^&* etc)',
    }
  }

  return { valid: true }
}

/**
 * Validates password confirmation matches
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): { valid: boolean; error?: string } {
  if (!confirmPassword) {
    return { valid: false, error: 'Please confirm your password' }
  }

  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match' }
  }

  return { valid: true }
}

/**
 * Validates entire signup form and returns all errors
 */
export function validateSignupForm(formData: {
  fullName: string
  employeeId: string
  email: string
  role: string
  rank: string
  department: string
  phone: string
  password: string
  confirmPassword: string
}): { valid: boolean; errors: SignupValidationErrors } {
  const errors: SignupValidationErrors = {}

  // Validate full name
  const fullNameValidation = validateFullName(formData.fullName)
  if (!fullNameValidation.valid) {
    errors.fullName = fullNameValidation.error
  }

  // Validate employee ID
  const employeeIdValidation = validateEmployeeId(formData.employeeId)
  if (!employeeIdValidation.valid) {
    errors.employeeId = employeeIdValidation.error
  }

  // Validate email
  const emailValidation = validateEmail(formData.email)
  if (!emailValidation.valid) {
    errors.email = emailValidation.error
  }

  // Validate role
  const roleValidation = validateRole(formData.role)
  if (!roleValidation.valid) {
    errors.role = roleValidation.error
  }

  // Validate rank (optional)
  const rankValidation = validateRank(formData.rank)
  if (!rankValidation.valid) {
    errors.rank = rankValidation.error
  }

  // Validate department (optional)
  const departmentValidation = validateDepartment(formData.department)
  if (!departmentValidation.valid) {
    errors.department = departmentValidation.error
  }

  // Validate phone (optional)
  const phoneValidation = validatePhone(formData.phone)
  if (!phoneValidation.valid) {
    errors.phone = phoneValidation.error
  }

  // Validate password
  const passwordValidation = validatePassword(formData.password)
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.error
  }

  // Validate password match
  const passwordMatchValidation = validatePasswordMatch(
    formData.password,
    formData.confirmPassword
  )
  if (!passwordMatchValidation.valid) {
    errors.confirmPassword = passwordMatchValidation.error
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
