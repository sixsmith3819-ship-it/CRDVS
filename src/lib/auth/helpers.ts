// ============================================================
// CRDVS Auth Helpers
// Server-side utilities for getting the current user and profile
// Use ONLY in Server Components, Server Actions, and Route Handlers
// ============================================================

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Profile, UserRole } from '@/types/database'

/**
 * Get the currently authenticated user from Supabase Auth.
 * Returns null if not authenticated.
 * Does NOT redirect — use requireAuth() for that.
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

/**
 * Get the full profile record for the current user.
 * Returns null if not found.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) return null
  return profile
}

/**
 * Require authentication. Redirects to /login if not authenticated.
 * Returns the current profile.
 * Use at the top of protected Server Components.
 */
export async function requireAuth(): Promise<Profile> {
  const profile = await getCurrentProfile()
  if (!profile) {
    redirect('/login')
  }
  if (!profile.is_active) {
    redirect('/login?error=account_disabled')
  }
  return profile
}

/**
 * Require a specific role. Redirects to /dashboard if role not allowed.
 * Use to protect role-specific pages.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<Profile> {
  const profile = await requireAuth()
  if (!allowedRoles.includes(profile.role)) {
    redirect('/dashboard?error=insufficient_permissions')
  }
  return profile
}

/**
 * Check if the current user has a specific role (no redirect).
 * Useful for conditional rendering in Server Components.
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const profile = await getCurrentProfile()
  return profile?.role === role
}

/**
 * Check if the current user is an administrator.
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('administrator')
}

/**
 * Get the user role label for display.
 */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    administrator: 'Administrator',
    police_officer: 'Police Officer',
    court_officer: 'Court Officer',
    prison_officer: 'Prison Officer',
  }
  return labels[role]
}

/**
 * Get the role badge color classes for Tailwind.
 */
export function getRoleBadgeClass(role: UserRole): string {
  const classes: Record<UserRole, string> = {
    administrator: 'bg-red-100 text-red-800',
    police_officer: 'bg-blue-100 text-blue-800',
    court_officer: 'bg-purple-100 text-purple-800',
    prison_officer: 'bg-yellow-100 text-yellow-800',
  }
  return classes[role]
}
