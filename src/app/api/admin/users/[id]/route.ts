import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/admin/users/[id]
 *
 * Supported body fields:
 *   active        boolean  — toggle the user's is_active flag
 *   (additional fields such as fullName, role, etc. may also be updated here
 *   in future iterations; for now only `active` is required by Task 8.7)
 *
 * Requires: authenticated session with role = 'administrator'
 */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const supabase = await createClient();

    // ── Auth check ─────────────────────────────────────────────────────────
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Admin role guard ───────────────────────────────────────────────────
    const { data: callerProfile } = await (supabase
      .from('profiles') as any)
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!callerProfile || callerProfile.role !== 'administrator') {
      return NextResponse.json(
        { error: 'Only administrators can manage user accounts' },
        { status: 403 }
      );
    }

    // ── Resolve route param ────────────────────────────────────────────────
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
    }

    // ── Parse body ─────────────────────────────────────────────────────────
    const body = await request.json();
    const { active, fullName, role, department, station, rank, phone } = body;

    // Validate that at least one field is being updated
    if (
      active === undefined &&
      fullName === undefined &&
      role === undefined &&
      department === undefined &&
      station === undefined &&
      rank === undefined &&
      phone === undefined
    ) {
      return NextResponse.json(
        { error: 'No updatable fields provided' },
        { status: 400 }
      );
    }

    // ── Build the update payload ────────────────────────────────────────────
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (active !== undefined)     updateData.is_active   = Boolean(active);
    if (fullName !== undefined)   updateData.full_name   = String(fullName).trim();
    if (role !== undefined)       updateData.role        = String(role);
    if (department !== undefined) updateData.department  = department ? String(department).trim() : null;
    if (station !== undefined)    updateData.station     = station     ? String(station).trim()    : null;
    if (rank !== undefined)       updateData.rank        = rank        ? String(rank).trim()       : null;
    if (phone !== undefined)      updateData.phone       = phone       ? String(phone).trim()      : null;

    // ── Persist ────────────────────────────────────────────────────────────
    const { data: updatedProfile, error: updateError } = await (supabase
      .from('profiles') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('[admin/users PATCH] update error:', updateError);
      return NextResponse.json(
        { error: `Failed to update user: ${updateError.message}` },
        { status: 500 }
      );
    }

    // ── Audit log (best-effort) ────────────────────────────────────────────
    try {
      await (supabase.from('audit_logs') as any).insert([
        {
          user_id: session.user.id,
          action: 'update',
          table_name: 'profiles',
          record_id: id,
          description:
            active !== undefined
              ? `${active ? 'Activated' : 'Deactivated'} user account`
              : `Updated user profile`,
          new_values: updateData,
        },
      ]);
    } catch (auditErr) {
      // Non-fatal — don't fail the main request
      console.warn('[admin/users PATCH] audit log failed:', auditErr);
    }

    return NextResponse.json({
      success: true,
      user: updatedProfile,
      message: 'User updated successfully',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    console.error('[admin/users PATCH] unhandled error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
