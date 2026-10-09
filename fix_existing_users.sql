-- ============================================================
-- Fix: Create missing profiles for existing auth users
-- Run this in Supabase SQL Editor to fix any users without profiles
-- ============================================================

-- Create profiles for any auth.users that don't have a profile yet
INSERT INTO public.profiles (
  id,
  employee_id,
  full_name,
  email,
  role,
  department,
  station,
  rank,
  phone,
  is_active
)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'employee_id', 'EMP-' || substr(u.id::text, 1, 8)),
  COALESCE(u.raw_user_meta_data->>'full_name', 'Unknown Officer'),
  u.email,
  COALESCE((u.raw_user_meta_data->>'role')::user_role, 'police_officer'),
  u.raw_user_meta_data->>'department',
  u.raw_user_meta_data->>'station',
  u.raw_user_meta_data->>'rank',
  u.raw_user_meta_data->>'phone',
  TRUE
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Show results
SELECT 
  u.id,
  u.email,
  p.employee_id,
  p.full_name,
  p.is_active,
  p.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
