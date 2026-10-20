-- Update RLS policies to allow court officers to create and update criminal records

-- Drop existing insert policy
DROP POLICY IF EXISTS "criminal_records_insert" ON criminal_records;

-- Create new insert policy that includes court officers
CREATE POLICY "criminal_records_insert" ON criminal_records
  FOR INSERT WITH CHECK (
    get_user_role(auth.uid()) IN ('administrator', 'police_officer', 'court_officer')
  );

-- Drop existing update policy
DROP POLICY IF EXISTS "criminal_records_update" ON criminal_records;

-- Create new update policy that includes court officers
CREATE POLICY "criminal_records_update" ON criminal_records
  FOR UPDATE USING (
    get_user_role(auth.uid()) IN ('administrator', 'police_officer', 'court_officer')
  );
