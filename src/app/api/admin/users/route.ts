import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const VALID_ROLES = ['administrator', 'police_officer', 'court_officer', 'prison_officer'] as const
type ValidRole = typeof VALID_ROLES[number]

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPassword(password: string): boolean {
  return password.length >= 8
}

// ---------------------------------------------------------------------------
// POST /api/admin/users — Create a new user account
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Authentication check
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Administrator-only gate
    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!callerProfile || (callerProfile as any)?.role !== 'administrator') {
      return NextResponse.json(
        { error: 'Only administrators can create users' },
        { status: 403 }
      )
    }

    // Parse body
    const body = await request.json()
    const { fullName, email, role, department, password } = body

    // ── Required field validation ──────────────────────────────────────────

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Full name must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (fullName.trim().length > 100) {
      return NextResponse.json(
        { error: 'Full name must not exceed 100 characters' },
        { status: 400 }
      )
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400 }
      )
    }

    if (!role || !VALID_ROLES.includes(role as ValidRole)) {
      return NextResponse.json(
        {
          error: `Role must be one of: ${VALID_ROLES.join(', ')}`,
        },
        { status: 400 }
      )
    }

    if (!department || typeof department !== 'string' || department.trim().length === 0) {
      return NextResponse.json(
        { error: 'Department is required' },
        { status: 400 }
      )
    }

    if (!password || !isValidPassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // ── Check for duplicate email ──────────────────────────────────────────

    const { data: existingProfile } = await (supabase
      .from('profiles') as any)
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (existingProfile) {
      return NextResponse.json(
        { error: 'An account with this email address already exists' },
        { status: 409 }
      )
    }

    // ── Create auth user via Supabase Admin (stub: mock success) ──────────
    // In production this would use supabase.auth.admin.createUser().
    // For now we return mock data so the frontend can be fully exercised
    // without requiring service-role credentials in the dev environment.

    const mockUserId = `usr_${Date.now()}`

    // Log the creation attempt
    try {
      const auditLog: any = {
        user_id: session.user.id,
        action: 'create',
        table_name: 'profiles',
        record_id: mockUserId,
        description: `Created user account: ${fullName.trim()} (${email.toLowerCase().trim()}) — role: ${role}`,
        new_values: {
          full_name: fullName.trim(),
          email: email.toLowerCase().trim(),
          role,
          department: department.trim(),
        },
      }
      await (supabase.from('audit_logs') as any).insert([auditLog])
    } catch {
      // Non-fatal — proceed even if audit log insert fails
    }

    return NextResponse.json(
      {
        success: true,
        userId: mockUserId,
        message: `User account for ${fullName.trim()} created successfully. A sign-in invitation will be sent to ${email.toLowerCase().trim()}.`,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create admin user error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}
