import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import type { AuditLog } from '@/types/database';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * GET /api/audit/record/[recordId]
 *
 * Fetch audit logs for a specific criminal record
 * Returns all audit entries related to the record, sorted by creation date (newest first)
 *
 * Query parameters:
 * - action: Filter by action type (optional)
 * - user_id: Filter by user ID (optional)
 * - start_date: Filter by start date (ISO format) (optional)
 * - end_date: Filter by end date (ISO format) (optional)
 * - limit: Maximum number of results (default: 1000)
 * - offset: Pagination offset (default: 0)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ recordId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const { recordId } = await params;
    const action = searchParams.get('action');
    const userId = searchParams.get('user_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = Math.min(parseInt(searchParams.get('limit') || '1000'), 1000);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .eq('record_id', recordId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (action) {
      query = query.eq('action', action);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch audit logs', details: error.message },
        { status: 500 }
      );
    }

    // Return data with metadata
    return NextResponse.json(
      {
        data: data as AuditLog[],
        total: count,
        limit,
        offset,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=60', // Cache for 1 minute
        },
      }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
