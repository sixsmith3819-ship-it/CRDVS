-- ============================================================
-- CRDVS Migration: 012_allow_police_court_view_duplicates.sql
-- Description: Allow police officers and court officers to view duplicate flags
-- ============================================================

-- Update duplicate_flags SELECT policy to allow police_officer and court_officer
DROP POLICY IF EXISTS "duplicate_flags_select" ON duplicate_flags;

CREATE POLICY "duplicate_flags_select" ON duplicate_flags
  FOR SELECT USING (
    get_user_role(auth.uid()) IN ('administrator', 'police_officer', 'court_officer')
  );

-- ============================================================
-- Success message
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 012: Updated duplicate_flags SELECT policy to allow police_officer and court_officer roles';
END $$;
