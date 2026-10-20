-- ============================================================
-- CRDVS Migration: 011_allow_police_court_delete_records.sql
-- Description: Allow police officers and court officers to delete criminal records
-- ============================================================

-- Update criminal_records DELETE policy to allow police_officer and court_officer roles
DROP POLICY IF EXISTS "criminal_records_delete" ON criminal_records;

CREATE POLICY "criminal_records_delete" ON criminal_records
  FOR DELETE USING (
    get_user_role(auth.uid()) IN ('administrator', 'police_officer', 'court_officer')
  );

-- ============================================================
-- Success message
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 011: Updated criminal_records DELETE policy to allow police_officer and court_officer roles';
END $$;
