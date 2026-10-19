import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is administrator
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || (profile as any).role !== 'administrator') {
      return NextResponse.json(
        { error: 'Only administrators can edit users' },
        { status: 403 }
      )
    }

    // Get the request body
    const body = await request.json()

    // Update the user profile
    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: body.fullName,
        role: body.role,
        department: body.department,
        station: body.station,
        rank: body.rank,
        phone: body.phone,
        is_active: body.isActive
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    return NextResponse.json(
      { success: true, data, message: 'User updated successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is administrator
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || (profile as any).role !== 'administrator') {
      return NextResponse.json(
        { error: 'Only administrators can delete users' },
        { status: 403 }
      )
    }

    // Prevent deleting yourself
    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      )
    }

    // Delete the user profile
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (deleteError) {
      throw deleteError
    }

    // Also delete from auth if possible
    const { error: authError } = await supabase.auth.admin.deleteUser(id)
    
    // Log the deletion (auth error is non-critical)
    console.log('User deleted:', { userId: id, authError })

    return NextResponse.json(
      { success: true, message: 'User deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
}
