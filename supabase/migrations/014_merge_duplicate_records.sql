-- ============================================================
-- CRDVS Migration: 014_merge_duplicate_records.sql
-- Description: Add function to merge duplicate criminal records
-- ============================================================

-- ============================================================
-- Function: Merge duplicate criminal records
-- This function consolidates two records into one (primary) and archives the other (secondary)
-- ============================================================

CREATE OR REPLACE FUNCTION merge_criminal_records(
  p_primary_id UUID,
  p_secondary_id UUID,
  p_merge_reason TEXT DEFAULT 'Confirmed duplicate'
)
RETURNS TABLE (
  success BOOLEAN,
  primary_id UUID,
  secondary_id UUID,
  merged_at TIMESTAMP,
  message TEXT
) AS $$
DECLARE
  v_primary RECORD;
  v_secondary RECORD;
  v_convictions_merged INTEGER := 0;
  v_timestamp TIMESTAMP := NOW();
BEGIN
  -- Fetch both records
  SELECT * INTO v_primary FROM criminal_records WHERE id = p_primary_id;
  SELECT * INTO v_secondary FROM criminal_records WHERE id = p_secondary_id;

  -- Validation: both records must exist
  IF v_primary IS NULL OR v_secondary IS NULL THEN
    RETURN QUERY SELECT 
      FALSE,
      p_primary_id,
      p_secondary_id,
      v_timestamp,
      'One or both records not found'::TEXT;
    RETURN;
  END IF;

  -- Start transaction
  BEGIN
    -- Step 1: Fill in any NULL fields in primary record from secondary
    UPDATE criminal_records
    SET
      full_name = COALESCE(full_name, v_secondary.full_name),
      gender = COALESCE(gender, v_secondary.gender),
      nationality = COALESCE(nationality, v_secondary.nationality),
      address = COALESCE(address, v_secondary.address),
      date_of_birth = COALESCE(date_of_birth, v_secondary.date_of_birth),
      national_id_number = COALESCE(national_id_number, v_secondary.national_id_number),
      updated_at = v_timestamp
    WHERE id = p_primary_id;

    -- Step 2: Reassign all convictions from secondary to primary
    UPDATE convictions
    SET 
      criminal_record_id = p_primary_id,
      updated_at = v_timestamp
    WHERE criminal_record_id = p_secondary_id;

    GET DIAGNOSTICS v_convictions_merged = ROW_COUNT;

    -- Step 3: Archive the secondary record
    UPDATE criminal_records
    SET
      status = 'archived',
      updated_at = v_timestamp
    WHERE id = p_secondary_id;

    -- Step 4: Create audit log entry
    INSERT INTO audit_logs (
      user_id,
      user_role,
      action,
      table_name,
      record_id,
      old_values,
      new_values,
      description
    )
    VALUES (
      auth.uid(),
      get_user_role(auth.uid()),
      'resolve_duplicate'::audit_action,
      'criminal_records',
      p_primary_id::TEXT,
      jsonb_build_object('secondary_record_id', p_secondary_id::TEXT),
      jsonb_build_object(
        'status', 'merged',
        'convictions_transferred', v_convictions_merged,
        'merge_reason', p_merge_reason
      ),
      FORMAT('Record %s merged into %s. %s convictions transferred. Reason: %s',
        v_secondary.record_id,
        v_primary.record_id,
        v_convictions_merged,
        p_merge_reason
      )
    );

    -- Step 5: Update duplicate flag status
    UPDATE duplicate_flags
    SET
      flag_status = 'merged',
      reviewed_at = v_timestamp,
      review_notes = p_merge_reason
    WHERE
      (record_a_id = p_primary_id AND record_b_id = p_secondary_id)
      OR (record_a_id = p_secondary_id AND record_b_id = p_primary_id);

    -- Return success
    RETURN QUERY SELECT 
      TRUE,
      p_primary_id,
      p_secondary_id,
      v_timestamp,
      FORMAT('Successfully merged records. %s convictions reassigned. Secondary record archived.', v_convictions_merged)::TEXT;

  EXCEPTION WHEN OTHERS THEN
    -- Return error
    RETURN QUERY SELECT 
      FALSE,
      p_primary_id,
      p_secondary_id,
      v_timestamp,
      CONCAT('Merge failed: ', SQLERRM)::TEXT;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Success message
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 014: merge_criminal_records() function created successfully';
  RAISE NOTICE 'Usage: SELECT * FROM merge_criminal_records(primary_id, secondary_id, merge_reason)';
END $$;
