import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is administrator
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || (profile as any)?.role !== 'administrator') {
      return NextResponse.json({ 
        error: 'Only administrators can update users' 
      }, { status: 403 })
    }

    const { id } = await context.params
    const body = await request.json()
    const {
      fullName,
      role,
      department,
      station,
      rank,
      phone,
      isActive
    } = body

    // Validate required fields
    if (!fullName || !role) {
      return NextResponse.json({ 
        error: 'Missing required fields: fullName, role' 
      }, { status: 400 })
    }

    // Validate role
    const validRoles = ['administrator', 'police_officer', 'court_officer', 'prison_officer']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role' 
      }, { status: 400 })
    }

    // Update the user
    const updateData: any = {
      full_name: fullName.trim(),
      role: role,
      department: department?.trim() || null,
      station: station?.trim() || null,
      rank: rank?.trim() || null,
      phone: phone?.trim() || null,
      is_active: isActive !== undefined ? isActive : true,
      updated_at: new Date().toISOString()
    };
    const { data: updatedUser, error: updateError } = await (supabase
      .from('profiles') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating user:', updateError)
      return NextResponse.json({ 
        error: `Failed to update user: ${updateError.message}` 
      }, { status: 500 })
    }

    // Log the update
    try {
      const auditLog: any = {
        user_id: session.user.id,
        action: 'update',
        table_name: 'profiles',
        record_id: id,
        description: `Updated user: ${fullName}`,
        new_values: {
          full_name: fullName,
          role: role,
          is_active: isActive
        }
      };
      (await (supabase.from('audit_logs') as any).insert([auditLog])) as any
    } catch (error) {
      console.error('Failed to log user update:', error)
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'User updated successfully'
    })

  } catch (error: any) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    )
  }
}
