import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { calculateCompositeSimilarity, isPotentialDuplicate } from '@/lib/utils/similarity'

/**
 * POST /api/duplicates/detect
 * Automated duplicate detection service
 * Can be triggered manually or scheduled via cron
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or police officer
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['administrator', 'police_officer'].includes((profile as any)?.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get threshold from request or use default
    const body = await request.json().catch(() => ({}))
    const threshold = body.threshold || 75
    const limit = body.limit || 100 // Process in batches

    // Use service client for better performance
    const serviceClient = await createServiceClient()

    // Fetch all criminal records (or batch if too many)
    const { data: records, error: fetchError } = await serviceClient
      .from('criminal_records')
      .select('id, record_id, full_name, date_of_birth, national_id_number, address')
      .eq('status', 'active')
      .limit(limit)

    if (fetchError) {
      console.error('Error fetching records:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 })
    }

    if (!records || records.length < 2) {
      return NextResponse.json({
        message: 'Not enough records to compare',
        duplicatesFound: 0
      })
    }

    let duplicatesFound = 0
    const flagsToInsert: any[] = []

    // Compare each record with every other record
    for (let i = 0; i < records.length; i++) {
      for (let j = i + 1; j < records.length; j++) {
        const recordA = records[i] as any
        const recordB = records[j] as any

        // Calculate similarity
        const similarity = calculateCompositeSimilarity(recordA, recordB)

        // Check if it meets threshold
        if (isPotentialDuplicate(similarity, threshold)) {
          // Check if this pair is already flagged
          const { data: existingFlag } = await serviceClient
            .from('duplicate_flags')
            .select('id')
            .or(`and(record_a_id.eq.${recordA.id},record_b_id.eq.${recordB.id}),and(record_a_id.eq.${recordB.id},record_b_id.eq.${recordA.id})`)
            .maybeSingle()

          if (!existingFlag) {
            // Create new duplicate flag
            flagsToInsert.push({
              record_a_id: recordA.id,
              record_b_id: recordB.id,
              similarity_score: similarity.overallScore,
              name_similarity: similarity.nameSimilarity,
              dob_match: similarity.dobSimilarity === 100,
              national_id_match: similarity.nationalIdSimilarity > 90,
              fingerprint_match: false, // Not implemented yet
              matching_fields: similarity.matchingFields,
              flag_status: 'pending_review',
              detection_method: 'ai_automated_scan',
              flagged_by: null // System-generated
            })
            duplicatesFound++
          }
        }
      }
    }

    // Bulk insert duplicate flags
    if (flagsToInsert.length > 0) {
      const { error: insertError } = await (serviceClient
        .from('duplicate_flags') as any)
        .insert(flagsToInsert)

      if (insertError) {
        console.error('Error inserting duplicate flags:', insertError)
        return NextResponse.json({ 
          error: 'Failed to save duplicate flags',
          duplicatesFound,
          failedToSave: flagsToInsert.length
        }, { status: 500 })
      }
    }

    // Log the detection run
    try {
      const auditLog: any = {
        user_id: session.user.id,
        action: 'flag_duplicate',
        table_name: 'duplicate_flags',
        description: `Automated duplicate detection: found ${duplicatesFound} potential duplicates`,
        new_values: { threshold, recordsScanned: records.length, duplicatesFound },
      };
      (await (serviceClient.from('audit_logs') as any).insert([auditLog])) as any
    } catch (error) {
      console.error('Failed to log detection:', error)
    }

    return NextResponse.json({
      success: true,
      recordsScanned: records.length,
      comparisons: (records.length * (records.length - 1)) / 2,
      duplicatesFound,
      threshold,
      message: `Scanned ${records.length} records and found ${duplicatesFound} potential duplicates`
    })

  } catch (error: any) {
    console.error('Duplicate detection error:', error)
    return NextResponse.json(
      { error: error.message || 'Duplicate detection failed' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/duplicates/detect
 * Trigger detection via GET for cron jobs
 */
export async function GET(request: Request) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Run detection with service client (no user session needed for cron)
  const serviceClient = await createServiceClient()

  try {
    // Fetch records
    const { data: records } = await serviceClient
      .from('criminal_records')
      .select('id, record_id, full_name, date_of_birth, national_id_number, address')
      .eq('status', 'active')
      .limit(200) // Batch size for cron

    if (!records || records.length < 2) {
      return NextResponse.json({ duplicatesFound: 0, recordsScanned: records?.length || 0 })
    }

    let duplicatesFound = 0
    const flagsToInsert: any[] = []

    // Compare records
    for (let i = 0; i < records.length; i++) {
      for (let j = i + 1; j < records.length; j++) {
        const recordAData = records[i] as any
        const recordBData = records[j] as any
        const similarity = calculateCompositeSimilarity(recordAData, recordBData)

        if (isPotentialDuplicate(similarity, 75)) {
          const { data: existingFlag } = await serviceClient
            .from('duplicate_flags')
            .select('id')
            .or(`and(record_a_id.eq.${recordAData.id},record_b_id.eq.${recordBData.id}),and(record_a_id.eq.${recordBData.id},record_b_id.eq.${recordAData.id})`)
            .maybeSingle()

          if (!existingFlag) {
            flagsToInsert.push({
              record_a_id: recordAData.id,
              record_b_id: recordBData.id,
              similarity_score: similarity.overallScore,
              name_similarity: similarity.nameSimilarity,
              dob_match: similarity.dobSimilarity === 100,
              national_id_match: similarity.nationalIdSimilarity > 90,
              fingerprint_match: false,
              matching_fields: similarity.matchingFields,
              flag_status: 'pending_review',
              detection_method: 'ai_scheduled_scan',
              flagged_by: null
            })
            duplicatesFound++
          }
        }
      }
    }

    if (flagsToInsert.length > 0) {
      await (serviceClient.from('duplicate_flags') as any).insert(flagsToInsert)
    }

    return NextResponse.json({
      success: true,
      recordsScanned: records.length,
      duplicatesFound,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Cron duplicate detection error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
