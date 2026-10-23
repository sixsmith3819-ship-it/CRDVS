-- ============================================================
-- Migration: 016_add_repeat_offender_trigger.sql
-- Description: Add missing trigger to auto-update repeat offender status
-- Issue: Repeat offender flag was not being set when convictions were added
-- ============================================================

-- Function: Auto-update repeat offender flag and count
CREATE OR REPLACE FUNCTION update_repeat_offender_status()
RETURNS TRIGGER AS $$
DECLARE
  conviction_count INTEGER;
BEGIN
  -- COUNT CONVICTIONS with specific verdict statuses
  SELECT COUNT(*) INTO conviction_count
  FROM convictions
  WHERE criminal_record_id = NEW.criminal_record_id
    AND verdict IN ('convicted', 'serving_sentence', 'sentence_completed', 'parole');

  -- UPDATE the criminal record
  UPDATE criminal_records
  SET
    prior_conviction_count = conviction_count,
    is_repeat_offender = (conviction_count > 1),
    risk_level = CASE
      WHEN conviction_count >= 5 THEN 5
      WHEN conviction_count >= 4 THEN 4
      WHEN conviction_count >= 3 THEN 3
      WHEN conviction_count >= 2 THEN 2
      ELSE 1
    END
  WHERE id = NEW.criminal_record_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on INSERT
CREATE TRIGGER trg_update_repeat_offender_insert
  AFTER INSERT ON convictions
  FOR EACH ROW
  EXECUTE FUNCTION update_repeat_offender_status();

-- Create the trigger on UPDATE
CREATE TRIGGER trg_update_repeat_offender_update
  AFTER UPDATE ON convictions
  FOR EACH ROW
  EXECUTE FUNCTION update_repeat_offender_status();

-- ============================================================
-- FIX: Recalculate repeat offender status for existing records
-- ============================================================

-- For each criminal record, recalculate their repeat offender status
DO $$
DECLARE
  record_row criminal_records%ROWTYPE;
  conviction_count INTEGER;
BEGIN
  FOR record_row IN SELECT * FROM criminal_records LOOP
    SELECT COUNT(*) INTO conviction_count
    FROM convictions
    WHERE criminal_record_id = record_row.id
      AND verdict IN ('convicted', 'serving_sentence', 'sentence_completed', 'parole');

    UPDATE criminal_records
    SET
      prior_conviction_count = conviction_count,
      is_repeat_offender = (conviction_count > 1),
      risk_level = CASE
        WHEN conviction_count >= 5 THEN 5
        WHEN conviction_count >= 4 THEN 4
        WHEN conviction_count >= 3 THEN 3
        WHEN conviction_count >= 2 THEN 2
        ELSE 1
      END
    WHERE id = record_row.id;
  END LOOP;
END $$;

-- Verify the fix worked
-- SELECT id, full_name, prior_conviction_count, is_repeat_offender, risk_level 
-- FROM criminal_records 
-- WHERE prior_conviction_count > 0 
-- ORDER BY prior_conviction_count DESC;
