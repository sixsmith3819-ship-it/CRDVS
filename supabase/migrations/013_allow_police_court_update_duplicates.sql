-- ============================================================
-- CRDVS Migration: 013_allow_police_court_update_duplicates.sql
-- Description: Allow police officers and court officers to update duplicate flags
-- ============================================================

-- Update duplicate_flags UPDATE policy to allow police_officer and court_officer
DROP POLICY IF EXISTS "duplicate_flags_update" ON duplicate_flags;

CREATE POLICY "duplicate_flags_update" ON duplicate_flags
  FOR UPDATE USING (
    get_user_role(auth.uid()) IN ('administrator', 'police_officer', 'court_officer')
  );

-- ============================================================
-- Success message
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 013: Updated duplicate_flags UPDATE policy to allow police_officer and court_officer roles';
END $$;
