-- ============================================================
-- CRDVS Migration: 003_auth_trigger.sql
-- Description: Auth trigger to auto-create profile on user signup
-- Run this AFTER 001_initial_schema.sql
-- ============================================================

-- Function: Called by Supabase Auth when a new user is created
-- Reads metadata passed during signup to populate the profile
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

-- Trigger: Fires after a new user row is inserted in auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function: Update last_login_at whenever a user signs in
-- (called from the application layer via server action)
CREATE OR REPLACE FUNCTION update_last_login(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET last_login_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Storage bucket setup (run separately in Supabase dashboard
-- or via the storage API — SQL alone cannot create buckets)
-- Reference only — actual bucket creation is in the dashboard
-- ============================================================
-- Bucket: criminal-photos    (profile/mugshot photos)
-- Bucket: id-documents       (national ID document scans)
-- Both should be set to PRIVATE (not public)
-- Access controlled via Storage RLS policies below

-- Storage RLS: Allow authenticated users to read photos
-- (These policies apply after you create the buckets in dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES
--   ('criminal-photos', 'criminal-photos', false),
--   ('id-documents', 'id-documents', false);
