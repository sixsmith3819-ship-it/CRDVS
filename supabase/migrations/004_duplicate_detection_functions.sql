-- ============================================================
-- CRDVS Migration: 004_duplicate_detection_functions.sql
-- Description: Advanced duplicate detection with pg_trgm
-- Run this AFTER 003_auth_trigger.sql
-- ============================================================

-- Enable fuzzy string matching extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

-- ============================================================
-- Function: Calculate name similarity using trigrams
-- Returns similarity score 0-1 (multiply by 100 for percentage)
-- ============================================================

CREATE OR REPLACE FUNCTION calculate_name_similarity(name1 TEXT, name2 TEXT)
RETURNS DECIMAL AS $$
BEGIN
  RETURN similarity(LOWER(TRIM(name1)), LOWER(TRIM(name2)));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- Function: Check if names are phonetically similar
-- Uses Soundex algorithm for phonetic matching
-- ============================================================

CREATE OR REPLACE FUNCTION names_phonetically_similar(name1 TEXT, name2 TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN soundex(name1) = soundex(name2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- Function: Find potential duplicates for a given record
-- Returns records with similarity > threshold
-- ============================================================

CREATE OR REPLACE FUNCTION find_potential_duplicates(
  p_record_id UUID,
  p_threshold DECIMAL DEFAULT 0.75
)
RETURNS TABLE (
  duplicate_id UUID,
  duplicate_record_id TEXT,
  full_name TEXT,
  national_id_number TEXT,
  date_of_birth DATE,
  name_similarity DECIMAL,
  phonetic_match BOOLEAN,
  dob_match BOOLEAN,
  national_id_match BOOLEAN,
  overall_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cr.id as duplicate_id,
    cr.record_id as duplicate_record_id,
    cr.full_name,
    cr.national_id_number,
    cr.date_of_birth,
    similarity(ref.full_name, cr.full_name) as name_similarity,
    (soundex(ref.full_name) = soundex(cr.full_name)) as phonetic_match,
    (ref.date_of_birth = cr.date_of_birth) as dob_match,
    (ref.national_id_number = cr.national_id_number) as national_id_match,
    (
      similarity(ref.full_name, cr.full_name) * 0.35 +
      CASE WHEN soundex(ref.full_name) = soundex(cr.full_name) THEN 0.05 ELSE 0 END +
      CASE WHEN ref.date_of_birth = cr.date_of_birth THEN 0.30 ELSE 0 END +
      CASE WHEN ref.national_id_number = cr.national_id_number THEN 0.25 ELSE 0 END +
      CASE 
        WHEN ref.address IS NOT NULL AND cr.address IS NOT NULL 
        THEN similarity(ref.address, cr.address) * 0.05 
        ELSE 0 
      END
    ) as overall_score
  FROM criminal_records ref
  CROSS JOIN criminal_records cr
  WHERE ref.id = p_record_id
    AND cr.id != p_record_id
    AND cr.status = 'active'
    AND (
      similarity(ref.full_name, cr.full_name) * 0.35 +
      CASE WHEN soundex(ref.full_name) = soundex(cr.full_name) THEN 0.05 ELSE 0 END +
      CASE WHEN ref.date_of_birth = cr.date_of_birth THEN 0.30 ELSE 0 END +
      CASE WHEN ref.national_id_number = cr.national_id_number THEN 0.25 ELSE 0 END +
      CASE 
        WHEN ref.address IS NOT NULL AND cr.address IS NOT NULL 
        THEN similarity(ref.address, cr.address) * 0.05 
        ELSE 0 
      END
    ) >= p_threshold
  ORDER BY overall_score DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- Function: Auto-detect duplicates when new record is created
-- (Optional - can be enabled via trigger)
-- ============================================================

CREATE OR REPLACE FUNCTION auto_detect_duplicates()
RETURNS TRIGGER AS $$
DECLARE
  potential_dup RECORD;
  duplicate_count INTEGER := 0;
BEGIN
  -- Find potential duplicates for the new record
  FOR potential_dup IN 
    SELECT * FROM find_potential_duplicates(NEW.id, 0.75)
  LOOP
    -- Check if this pair is already flagged
    IF NOT EXISTS (
      SELECT 1 FROM duplicate_flags
      WHERE (record_a_id = NEW.id AND record_b_id = potential_dup.duplicate_id)
         OR (record_a_id = potential_dup.duplicate_id AND record_b_id = NEW.id)
    ) THEN
      -- Insert duplicate flag
      INSERT INTO duplicate_flags (
        record_a_id,
        record_b_id,
        similarity_score,
        name_similarity,
        dob_match,
        national_id_match,
        fingerprint_match,
        matching_fields,
        flag_status,
        detection_method,
        flagged_by
      ) VALUES (
        NEW.id,
        potential_dup.duplicate_id,
        potential_dup.overall_score * 100,
        potential_dup.name_similarity * 100,
        potential_dup.dob_match,
        potential_dup.national_id_match,
        false,
        ARRAY[
          CASE WHEN potential_dup.name_similarity > 0.85 THEN 'name' ELSE NULL END,
          CASE WHEN potential_dup.phonetic_match THEN 'phonetic_name' ELSE NULL END,
          CASE WHEN potential_dup.dob_match THEN 'date_of_birth' ELSE NULL END,
          CASE WHEN potential_dup.national_id_match THEN 'national_id' ELSE NULL END
        ]::TEXT[],
        'pending_review',
        'auto_trigger_on_create',
        NULL
      );
      duplicate_count := duplicate_count + 1;
    END IF;
  END LOOP;

  -- Log if duplicates were found
  IF duplicate_count > 0 THEN
    RAISE NOTICE 'Auto-detected % potential duplicate(s) for record %', duplicate_count, NEW.record_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Trigger: Auto-detect duplicates on new record creation
-- DISABLED by default - uncomment to enable
-- ============================================================

-- CREATE TRIGGER trg_auto_detect_duplicates
--   AFTER INSERT ON criminal_records
--   FOR EACH ROW
--   EXECUTE FUNCTION auto_detect_duplicates();

-- ============================================================
-- View: Duplicate flags with detailed information
-- ============================================================

CREATE OR REPLACE VIEW duplicate_flags_detailed AS
SELECT 
  df.*,
  a.record_id as record_a_display_id,
  a.full_name as record_a_name,
  a.national_id_number as record_a_national_id,
  a.date_of_birth as record_a_dob,
  a.prior_conviction_count as record_a_convictions,
  b.record_id as record_b_display_id,
  b.full_name as record_b_name,
  b.national_id_number as record_b_national_id,
  b.date_of_birth as record_b_dob,
  b.prior_conviction_count as record_b_convictions,
  p1.full_name as flagged_by_name,
  p2.full_name as reviewed_by_name
FROM duplicate_flags df
JOIN criminal_records a ON df.record_a_id = a.id
JOIN criminal_records b ON df.record_b_id = b.id
LEFT JOIN profiles p1 ON df.flagged_by = p1.id
LEFT JOIN profiles p2 ON df.reviewed_by = p2.id;

-- ============================================================
-- Index optimizations for duplicate detection
-- ============================================================

-- GIN index for trigram similarity on names (already created in 001)
-- CREATE INDEX IF NOT EXISTS idx_criminal_records_name_trgm 
--   ON criminal_records USING GIN (full_name gin_trgm_ops);

-- Additional index for date matching
CREATE INDEX IF NOT EXISTS idx_criminal_records_dob_name 
  ON criminal_records(date_of_birth, full_name);

-- Index for national ID similarity
CREATE INDEX IF NOT EXISTS idx_criminal_records_national_id_pattern 
  ON criminal_records(national_id_number text_pattern_ops);

-- ============================================================
-- Helper function: Get duplicate detection statistics
-- ============================================================

CREATE OR REPLACE FUNCTION get_duplicate_stats()
RETURNS TABLE (
  total_flags INTEGER,
  pending_review INTEGER,
  confirmed_duplicates INTEGER,
  false_positives INTEGER,
  dismissed INTEGER,
  merged INTEGER,
  avg_similarity DECIMAL,
  high_confidence INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_flags,
    COUNT(*) FILTER (WHERE flag_status = 'pending_review')::INTEGER as pending_review,
    COUNT(*) FILTER (WHERE flag_status = 'confirmed_duplicate')::INTEGER as confirmed_duplicates,
    COUNT(*) FILTER (WHERE flag_status = 'false_positive')::INTEGER as false_positives,
    COUNT(*) FILTER (WHERE flag_status = 'dismissed')::INTEGER as dismissed,
    COUNT(*) FILTER (WHERE flag_status = 'merged')::INTEGER as merged,
    AVG(similarity_score) as avg_similarity,
    COUNT(*) FILTER (WHERE similarity_score >= 90)::INTEGER as high_confidence
  FROM duplicate_flags;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- Success message
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 004: Duplicate detection functions created successfully';
  RAISE NOTICE 'Available functions:';
  RAISE NOTICE '  - calculate_name_similarity(name1, name2)';
  RAISE NOTICE '  - names_phonetically_similar(name1, name2)';
  RAISE NOTICE '  - find_potential_duplicates(record_id, threshold)';
  RAISE NOTICE '  - get_duplicate_stats()';
  RAISE NOTICE 'Views:';
  RAISE NOTICE '  - duplicate_flags_detailed';
  RAISE NOTICE 'To enable auto-detection trigger, uncomment trg_auto_detect_duplicates';
END $$;
