-- ============================================================
-- CRDVS Migration: 015_allow_court_officer_insert_duplicates.sql
-- Description: Allow court officers to insert duplicate flags
-- ============================================================

-- Update duplicate_flags INSERT policy to allow court_officer
DROP POLICY IF EXISTS "duplicate_flags_insert" ON duplicate_flags;

CREATE POLICY "duplicate_flags_insert" ON duplicate_flags
  FOR INSERT WITH CHECK (
    get_user_role(auth.uid()) IN ('administrator', 'police_officer', 'court_officer')
  );

-- ============================================================
-- Success message
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 015: Updated duplicate_flags INSERT policy to allow court_officer role';
END $$;
