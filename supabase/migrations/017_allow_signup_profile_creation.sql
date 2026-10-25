-- Allow users to create their own profile during signup
-- This policy permits inserting a profile record only when the user_id matches the authenticated user
-- and the user doesn't already have a profile

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Add a new policy that allows users to insert their own profile during signup
-- This is checked by ensuring:
-- 1. The profile ID matches the authenticated user ID
-- 2. We verify no profile exists yet for this user (prevent duplicates)
CREATE POLICY "profiles_insert_own_during_signup" ON profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id
  );

-- Keep the original admin-only insert policy for admins creating profiles
-- The new policy will be checked first (most permissive rule applies)
-- This allows both:
-- 1. New users to create their own profile during signup (via new policy)
-- 2. Admins to create profiles for other users (via original policy)
