-- ============================================================
-- Fix: Update handle_new_user trigger to explicitly set is_active
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'employee_id', 'EMP-' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown Officer'),
    NEW.email,
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'police_officer'
    ),
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'station',
    NEW.raw_user_meta_data->>'rank',
    NEW.raw_user_meta_data->>'phone',
    TRUE
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
