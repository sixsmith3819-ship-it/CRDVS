import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// Generate a unique Report ID: RPT-YYYYMMDD-DDDD
function generateReportId(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `RPT-${year}${month}${day}-${random}`
}

// Calculate SHA-256 hash of report data for tamper detection
function calculateReportHash(reportData: any): string {
  const dataString = JSON.stringify(reportData, Object.keys(reportData).sort())
  return crypto.createHash('sha256').update(dataString).digest('hex')
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      criminalRecordId,
      reportType,
      purpose,
      recipient,
      expiresInDays
    } = body

    // Validate required fields
    if (!criminalRecordId || !reportType || !purpose) {
      return NextResponse.json({ 
        error: 'Missing required fields: criminalRecordId, reportType, purpose' 
      }, { status: 400 })
    }

    // Fetch the complete criminal record with all related data
    const { data: record, error: recordError } = await supabase
      .from('criminal_records')
      .select(`
        *,
        convictions (
          id,
          case_number,
          offense_category,
          offense_description,
          statute_violated,
          court_name,
          presiding_judge,
          prosecutor,
          defense_counsel,
          verdict,
          sentence_description,
          sentence_start_date,
          sentence_end_date,
          fine_amount,
          arrest_date,
          charge_date,
          conviction_date,
          release_date,
          prison_facility,
          evidence_references,
          notes,
          created_at
        ),
        created_by:profiles!criminal_records_created_by_fkey(full_name, employee_id),
        updated_by:profiles!criminal_records_updated_by_fkey(full_name, employee_id)
      `)
      .eq('id', criminalRecordId)
      .single()

    if (recordError || !record) {
      return NextResponse.json({ 
        error: 'Criminal record not found' 
      }, { status: 404 })
    }

    // Get generator's profile
    const { data: generatorProfile } = await supabase
      .from('profiles')
      .select('full_name, employee_id, department, rank')
      .eq('id', session.user.id)
      .single()

    // Generate unique report ID
    let reportId = generateReportId()
    let attempts = 0
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from('verification_reports')
        .select('report_id')
        .eq('report_id', reportId)
        .maybeSingle()
      
      if (!existing) break
      reportId = generateReportId()
      attempts++
    }

    // Prepare report data snapshot
    const reportData = {
      report_id: reportId,
      report_type: reportType,
      generated_at: new Date().toISOString(),
      generated_by: {
        id: session.user.id,
        name: (generatorProfile as any)?.full_name,
        employee_id: (generatorProfile as any)?.employee_id,
        department: (generatorProfile as any)?.department,
        rank: (generatorProfile as any)?.rank
      },
      purpose,
      recipient: recipient || null,
      subject: {
        record_id: (record as any).record_id,
        national_id_number: (record as any).national_id_number,
        full_name: (record as any).full_name,
        date_of_birth: (record as any).date_of_birth,
        gender: (record as any).gender,
        nationality: (record as any).nationality,
        address: (record as any).address,
        aliases: (record as any).aliases,
        status: (record as any).status,
        risk_level: (record as any).risk_level,
        is_repeat_offender: (record as any).is_repeat_offender,
        prior_conviction_count: (record as any).prior_conviction_count,
        notes: (record as any).notes,
        created_at: (record as any).created_at,
        updated_at: (record as any).updated_at
      },
      convictions: (record as any).convictions || [],
      statistics: {
        total_convictions: (record as any).convictions?.length || 0,
        convicted_count: (record as any).convictions?.filter((c: any) => 
          ['convicted', 'serving_sentence', 'sentence_completed', 'parole'].includes(c.verdict)
        ).length || 0,
        pending_count: (record as any).convictions?.filter((c: any) => 
          c.verdict === 'pending'
        ).length || 0,
        acquitted_count: (record as any).convictions?.filter((c: any) => 
          c.verdict === 'acquitted'
        ).length || 0
      },
      metadata: {
        created_by: (record as any).created_by,
        updated_by: (record as any).updated_by,
        record_created_at: (record as any).created_at,
        record_updated_at: (record as any).updated_at
      }
    }

    // Calculate tamper-evident hash
    const reportHash = calculateReportHash(reportData)

    // Calculate expiration date if specified
    let expiresAt = null
    if (expiresInDays && expiresInDays > 0) {
      const expiration = new Date()
      expiration.setDate(expiration.getDate() + expiresInDays)
      expiresAt = expiration.toISOString()
    }

    // Create the report
    const reportInsertData: any = {
      report_id: reportId,
      criminal_record_id: criminalRecordId,
      generated_by: session.user.id,
      report_type: reportType,
      report_data: reportData,
      report_hash: reportHash,
      purpose: purpose.trim(),
      recipient: recipient?.trim() || null,
      expires_at: expiresAt,
      is_valid: true
    };
    const { data: newReport, error: insertError } = await (supabase
      .from('verification_reports') as any)
      .insert(reportInsertData)
      .select()
      .single()

    if (insertError) {
      console.error('Error creating report:', insertError)
      return NextResponse.json({ 
        error: `Failed to create report: ${insertError.message}` 
      }, { status: 500 })
    }

    // Log the report generation
    try {
      const auditLog: any = {
        user_id: session.user.id,
        action: 'generate_report',
        table_name: 'verification_reports',
        record_id: reportId,
        description: `Generated ${reportType} report for ${(record as any).full_name} (${(record as any).record_id})`,
        new_values: {
          report_id: reportId,
          criminal_record_id: criminalRecordId,
          report_type: reportType,
          purpose: purpose
        }
      };
      (await (supabase.from('audit_logs') as any).insert([auditLog])) as any
    } catch (error) {
      console.error('Failed to log report generation:', error)
    }

    return NextResponse.json({
      success: true,
      id: newReport.id,
      report_id: newReport.report_id,
      report_hash: reportHash,
      expires_at: expiresAt,
      message: 'Verification report generated successfully'
    })

  } catch (error: any) {
    console.error('Create report error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    )
  }
}
