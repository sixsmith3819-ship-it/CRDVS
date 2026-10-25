-- Allow police and court officers to delete duplicate flags
-- This extends the delete permission beyond just admins

-- Update the existing delete policy to include police and court officers
DROP POLICY "duplicate_flags_delete" ON duplicate_flags;

-- Create new delete policy that allows admins, police, and court officers
CREATE POLICY "duplicate_flags_delete" ON duplicate_flags
  FOR DELETE USING (
    get_user_role(auth.uid()) IN ('administrator', 'police_officer', 'court_officer')
  );
