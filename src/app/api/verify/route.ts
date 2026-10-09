import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateCompositeSimilarity } from '@/lib/utils/similarity'

export async function POST(request: Request) {
  try {
    const { nationalId, fullName, dateOfBirth } = await request.json()

    // Validate input
    if (!nationalId && !fullName) {
      return NextResponse.json(
        { error: 'At least National ID or Full Name is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let exactMatches = 0
    let fuzzyMatches = 0
    const allRecords: any[] = []

    // Search by National ID (exact match)
    if (nationalId) {
      const { data: idMatches } = await supabase
        .from('criminal_records')
        .select('*')
        .eq('national_id_number', nationalId)

      if (idMatches && idMatches.length > 0) {
        exactMatches += idMatches.length
        allRecords.push(...idMatches)
      }
    }

    // Search by Full Name and DOB (exact match)
    if (fullName && dateOfBirth) {
      const { data: namedobMatches } = await supabase
        .from('criminal_records')
        .select('*')
        .ilike('full_name', fullName)
        .eq('date_of_birth', dateOfBirth) as { data: any[] | null }

      if (namedobMatches && namedobMatches.length > 0) {
        // Filter out duplicates
        const newMatches = namedobMatches.filter(
          (record: any) => !allRecords.some((r: any) => r.id === record.id)
        )
        exactMatches += newMatches.length
        allRecords.push(...newMatches)
      }
    }

    // Fuzzy search by name only (if no exact matches found)
    // Uses advanced similarity algorithms
    if (fullName && allRecords.length === 0) {
      // Get potential matches using substring search first
      const { data: potentialMatches } = await supabase
        .from('criminal_records')
        .select('*')
        .ilike('full_name', `%${fullName}%`)
        .limit(50) as { data: any[] | null }

      if (potentialMatches && potentialMatches.length > 0) {
        // Calculate similarity for each potential match
        const scoredMatches = potentialMatches.map(record => {
          const similarity = calculateCompositeSimilarity(
            {
              full_name: fullName,
              date_of_birth: dateOfBirth || '',
              national_id_number: nationalId || '',
              address: null
            },
            record
          )
          return {
            ...record,
            similarityScore: similarity.overallScore,
            nameSimilarity: similarity.nameSimilarity
          }
        })

        // Filter by threshold and sort by similarity
        const fuzzyNameMatches = scoredMatches
          .filter(m => m.similarityScore >= 60) // 60% threshold for fuzzy
          .sort((a, b) => b.similarityScore - a.similarityScore)
          .slice(0, 10)

        if (fuzzyNameMatches.length > 0) {
          fuzzyMatches = fuzzyNameMatches.length
          allRecords.push(...fuzzyNameMatches)
        }
      }
    }

    // Log verification request
    const requestRef = `VRQ-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`
    
    try {
      const verificationData: any = {
        request_reference: requestRef,
        requested_by: session.user.id,
        submitted_national_id: nationalId || 'N/A',
        submitted_full_name: fullName || 'N/A',
        submitted_dob: dateOfBirth || null,
        verification_status: allRecords.length > 0 ? 'verified' : 'unverified',
        confidence_score: exactMatches > 0 ? 100 : fuzzyMatches > 0 ? 75 : 0,
        criminal_record_id: allRecords.length > 0 ? allRecords[0].id : null,
      };
      (await (supabase.from('verification_requests') as any).insert(verificationData)) as any
    } catch (error) {
      console.error('Failed to log verification request:', error)
    }

    // Log audit
    try {
      const auditLog: any = {
        user_id: session.user.id,
        action: 'verify',
        table_name: 'verification_requests',
        record_id: requestRef,
        description: `Verification request: ${fullName || nationalId}`,
        new_values: { nationalId, fullName, dateOfBirth },
      };
      (await (supabase.from('audit_logs') as any).insert([auditLog])) as any
    } catch (error) {
      console.error('Failed to log audit:', error)
    }

    return NextResponse.json({
      records: allRecords,
      exactMatches,
      fuzzyMatches,
      noRecordsFound: allRecords.length === 0,
      requestReference: requestRef,
    })
  } catch (error: any) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Verification failed' },
      { status: 500 }
    )
  }
}
