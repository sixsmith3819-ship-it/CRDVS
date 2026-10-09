'use server'

// ============================================================
// CRDVS Auth Server Actions
// All auth operations run server-side — never expose keys to client
// ============================================================

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { validateEmail, validatePassword } from '@/lib/utils/validation'
import type { UserRole } from '@/types/database'

export interface AuthActionResult {
  success: boolean
  error?: string
}

// ============================================================
// SIGNUP (Self-service registration)
// ============================================================

export async function signupAction(formData: FormData): Promise<AuthActionResult> {
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
  if (authData.session) {
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
      // Silently fail on audit log - don't block signup
      console.error('Failed to log signup:', error)
    }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

// ============================================================
// LOGIN
// ============================================================

export async function loginAction(
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Input validation
  const emailCheck = validateEmail(email)
  if (!emailCheck.valid) return { success: false, error: emailCheck.error }

  const passwordCheck = validatePassword(password)
  if (!passwordCheck.valid) return { success: false, error: passwordCheck.error }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })

  if (error) {
    // Return generic error to avoid leaking info about valid emails
    return {
      success: false,
      error: 'Invalid email or password. Please check your credentials.',
    }
  }

  if (!data.user) {
    return { success: false, error: 'Login failed. Please try again.' }
  }

  // Check if profile exists and account is active
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_active, full_name')
    .eq('id', data.user.id)
    .maybeSingle() as { data: { is_active: boolean; full_name: string } | null; error: any }

  if (!profile) {
    await supabase.auth.signOut()
    return {
      success: false,
      error: profileError 
        ? 'Failed to load user profile. Contact your administrator.'
        : 'User profile not found. Your account setup may be incomplete. Contact your administrator.',
    }
  }

  if (profile.is_active === false) {
    await supabase.auth.signOut()
    return {
      success: false,
      error: 'Your account has been deactivated. Contact your administrator.',
    }
  }

  // Update last login timestamp (create new client to avoid type inference issues)
  const supabase2 = await createClient()
  await (supabase2
    .from('profiles')
    .update as any)({ last_login_at: new Date().toISOString() })
    .eq('id', data.user.id)

  revalidatePath('/', 'layout')
  return { success: true }
}

// ============================================================
// LOGOUT
// ============================================================

export async function logoutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

// ============================================================
// CREATE USER (Admin only)
// ============================================================

export interface CreateUserData {
  email: string
  password: string
  fullName: string
  employeeId: string
  role: UserRole
  department?: string
  station?: string
  rank?: string
  phone?: string
}

export async function createUserAction(
  userData: CreateUserData
): Promise<AuthActionResult> {
  // Validation
  const emailCheck = validateEmail(userData.email)
  if (!emailCheck.valid) return { success: false, error: emailCheck.error }

  const passwordCheck = validatePassword(userData.password)
  if (!passwordCheck.valid) return { success: false, error: passwordCheck.error }

  if (!userData.fullName?.trim()) {
    return { success: false, error: 'Full name is required' }
  }
  if (!userData.employeeId?.trim()) {
    return { success: false, error: 'Employee ID is required' }
  }

  // Use service client for admin user creation (bypasses RLS)
  const supabase = await createServiceClient()

  const { data, error } = await supabase.auth.admin.createUser({
    email: userData.email.trim().toLowerCase(),
    password: userData.password,
    email_confirm: true, // Auto-confirm for admin-created accounts
    user_metadata: {
      full_name: userData.fullName.trim(),
      employee_id: userData.employeeId.trim(),
      role: userData.role,
      department: userData.department?.trim() || null,
      station: userData.station?.trim() || null,
      rank: userData.rank?.trim() || null,
      phone: userData.phone?.trim() || null,
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { success: false, error: 'An account with this email already exists.' }
    }
    return { success: false, error: `Failed to create user: ${error.message}` }
  }

  if (!data.user) {
    return { success: false, error: 'User creation failed. Please try again.' }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

// ============================================================
// UPDATE USER ROLE (Admin only)
// ============================================================

export async function updateUserRoleAction(
  userId: string,
  newRole: UserRole
): Promise<AuthActionResult> {
  const supabase = await createServiceClient()

  const { error } = await (supabase
    .from('profiles')
    .update as any)({ role: newRole })
    .eq('id', userId)

  if (error) {
    return { success: false, error: `Failed to update role: ${error.message}` }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

// ============================================================
// TOGGLE USER ACTIVE STATUS (Admin only)
// ============================================================

export async function toggleUserActiveAction(
  userId: string,
  isActive: boolean
): Promise<AuthActionResult> {
  const supabase = await createServiceClient()

  const { error } = await (supabase
    .from('profiles')
    .update as any)({ is_active: isActive })
    .eq('id', userId)

  if (error) {
    return {
      success: false,
      error: `Failed to ${isActive ? 'activate' : 'deactivate'} user: ${error.message}`,
    }
  }

  // If deactivating, also sign out their active sessions
  if (!isActive) {
    await supabase.auth.admin.signOut(userId)
  }

  revalidatePath('/admin/users')
  return { success: true }
}

// ============================================================
// CHANGE PASSWORD
// ============================================================

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string
): Promise<AuthActionResult> {
  const passwordCheck = validatePassword(newPassword)
  if (!passwordCheck.valid) return { success: false, error: passwordCheck.error }

  if (currentPassword === newPassword) {
    return {
      success: false,
      error: 'New password must be different from your current password.',
    }
  }

  const supabase = await createClient()

  // Verify current password by attempting a re-auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return { success: false, error: 'Not authenticated' }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  })

  if (verifyError) {
    return { success: false, error: 'Current password is incorrect.' }
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword })

  if (error) {
    return { success: false, error: `Failed to update password: ${error.message}` }
  }

  return { success: true }
}
