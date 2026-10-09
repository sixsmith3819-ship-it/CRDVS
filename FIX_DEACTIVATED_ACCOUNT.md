# Fix: "Account Deactivated" Error for New Users

## Problem
New users created through signup see "Your account has been deactivated" error when trying to log in.

## Root Cause
The `handle_new_user()` database trigger wasn't explicitly setting `is_active = TRUE`, and if the profile creation failed silently, users would get the deactivated error.

## Solution

### Step 1: Fix the Database Trigger
1. Go to your Supabase Dashboard: https://dvgldolepvymuffqmjpv.supabase.co
2. Navigate to **SQL Editor**
3. Open and run the file: `fix_profile_trigger.sql`
4. This will update the trigger to explicitly set `is_active = TRUE`

### Step 2: Fix Existing Users Without Profiles
1. Still in the **SQL Editor**
2. Open and run the file: `fix_existing_users.sql`
3. This will create profiles for any auth users that don't have one yet
4. The query results will show all users with their profile status

### Step 3: Verify the Fix
1. Try logging in with the user account that was showing the error
2. If it still fails, check the query results from Step 2 to see if the profile was created

## Alternative: Manually Create Profile for Specific User

If you know the user's email, you can manually create their profile:

```sql
-- Replace with actual user details
INSERT INTO public.profiles (
  id,
  employee_id,
  full_name,
  email,
  role,
  is_active
)
SELECT 
  id,
  'EMP-12345',  -- Replace with actual employee ID
  'Full Name',   -- Replace with actual name
  email,
  'police_officer',  -- Or appropriate role
  TRUE
FROM auth.users
WHERE email = 'user@example.com'  -- Replace with actual email
ON CONFLICT (id) DO UPDATE
SET is_active = TRUE;
```

## Code Changes Made

1. **Updated `003_auth_trigger.sql`**: Added explicit `is_active = TRUE` and error handling
2. **Updated `src/actions/auth.ts`**: Better error messages to distinguish between missing profile and deactivated account

## Prevention

Going forward, all new user signups will automatically have `is_active = TRUE` set in their profile.

## Additional Checks

If users still can't log in, check:

1. **Email Confirmation**: Check your Supabase settings under Authentication > Email
   - If "Confirm email" is enabled, users must click the confirmation link in their email first
   - You can disable this for testing or manually confirm users in the Auth dashboard

2. **Check Auth Users**: In Supabase Dashboard > Authentication > Users
   - Verify the user exists
   - Check if "Email Confirmed" is checked
   - Manually confirm if needed

3. **Check Profile Table**: In Supabase Dashboard > Table Editor > profiles
   - Verify the profile row exists for the user
   - Verify `is_active = TRUE`
