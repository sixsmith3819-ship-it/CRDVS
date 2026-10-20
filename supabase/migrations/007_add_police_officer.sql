-- Create Police Officer User (Police Officer Role)
-- Note: This assumes you've already created the user in Supabase Auth with email: policeofficer1@gmail.com
-- 
-- Steps to create user in Supabase:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Create new user"
-- 3. Enter email: policeofficer1@gmail.com
-- 4. Enter password: 12345678
-- 5. Copy the user ID generated
-- 6. Run the SQL below with the correct UUID

-- SQL: Insert the police officer profile
-- Replace 'YOUR_USER_UUID_HERE' with the actual UUID from Supabase Auth

INSERT INTO profiles (
  id,
  employee_id,
  full_name,
  email,
  role,
  department,
  station,
  rank,
  is_active,
  created_at,
  updated_at
) VALUES (
  'YOUR_USER_UUID_HERE',                    -- Replace with actual UUID from Supabase Auth
  'PO-' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS'),  -- Auto-generate employee ID like PO-20260622143045
  'Police Officer 1',                       -- You can change this name
  'policeofficer1@gmail.com',
  'police_officer',                         -- Role enum: police_officer
  'Zimbabwe Republic Police',               -- Department
  'Gweru Police Station',                   -- Station/Facility
  'Detective',                              -- Rank
  TRUE,                                     -- Active user
  NOW(),
  NOW()
);

-- Log the user creation in audit logs
INSERT INTO audit_logs (
  user_id,
  user_role,
  action,
  table_name,
  record_id,
  new_values,
  description,
  created_at
) VALUES (
  NULL,                                     -- System action (no user ID)
  'administrator',                          -- Admin action
  'create',
  'profiles',
  'policeofficer1@gmail.com',
  jsonb_build_object(
    'email', 'policeofficer1@gmail.com',
    'role', 'police_officer',
    'department', 'Zimbabwe Republic Police'
  ),
  'Created new police officer user account',
  NOW()
);
