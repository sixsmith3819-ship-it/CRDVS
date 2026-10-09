'use server'

import { createClient } from '@/lib/supabase/server'
import { validateEmail, validatePassword } from '@/lib/utils/validation'
import type { UserRole } from '@/types/database'

export interface SignupResult {
  success: boolean
  error?: string
}

export async function signupAction(formData: FormData): Promise<SignupResult> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const fullName = formData.get('fullName') as string
  const employeeId = formData.get('employeeId') as string
  const role = formData.get('role') as UserRole
  const rank = formData.get('rank') as string | null
  const department = formData.get('department') as string | null
  const station = formData.get('station') as string | null
  const phone = formData.get('phone') as string | null

  // Validation
  if (!email || !password || !fullName || !employeeId || !role) {
    return { success: false, error: 'Please fill in all required fields' }
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match' }
  }

  const emailCheck = validateEmail(email)
  if (!emailCheck.valid) {
    return { success: false, error: emailCheck.error }
  }

  const passwordCheck = validatePassword(password)
  if (!passwordCheck.valid) {
    return { success: false, error: passwordCheck.error }
  }

  const supabase = await createClient()

  // Check if employee ID already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('employee_id')
    .eq('employee_id', employeeId.trim())
    .maybeSingle()

  if (existingProfile) {
    return { success: false, error: 'Employee ID already registered' }
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
        employee_id: employeeId.trim(),
        role,
        department: department?.trim() || null,
        station: station?.trim() || null,
        rank: rank?.trim() || null,
        phone: phone?.trim() || null,
      },
    },
  })

  if (authError) {
    if (authError.message.includes('already registered')) {
      return { success: false, error: 'An account with this email already exists' }
    }
    return { success: false, error: authError.message }
  }

  if (!authData.user) {
    return { success: false, error: 'Failed to create account. Please try again.' }
  }

  // If email confirmation is required, inform user
  if (authData.user && !authData.session) {
    return {
      success: false,
      error: 'Please check your email to confirm your account before logging in.',
    }
  }

  // Log the signup
  try {
    const auditLog: any = {
      user_id: authData.user.id,
      action: 'create',
      table_name: 'profiles',
      description: `New user registered: ${fullName} (${employeeId})`,
      new_values: { email, employee_id: employeeId, role },
    };
    (await (supabase.from('audit_logs') as any).insert([auditLog])) as any
  } catch (error) {
    console.error('Failed to log signup:', error)
  }

  return { success: true }
}
