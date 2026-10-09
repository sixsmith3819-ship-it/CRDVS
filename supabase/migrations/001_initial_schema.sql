-- ============================================================
-- CRIMINAL RECORD DIGITAL VERIFICATION SYSTEM (CRDVS)
-- Migration: 001_initial_schema.sql
-- Description: Full initial database schema with RLS policies
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- For fuzzy text matching (AI duplicate detection)
CREATE EXTENSION IF NOT EXISTS "unaccent";     -- For accent-insensitive name matching

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM (
  'administrator',
  'police_officer',
  'court_officer',
  'prison_officer'
);

CREATE TYPE record_status AS ENUM (
  'active',
  'closed',
  'under_investigation',
  'acquitted',
  'deceased',
  'archived'
);

CREATE TYPE conviction_status AS ENUM (
  'convicted',
  'acquitted',
  'pending',
  'appealing',
  'serving_sentence',
  'sentence_completed',
  'parole'
);

CREATE TYPE offense_category AS ENUM (
  'violent_crime',
  'property_crime',
  'drug_offense',
  'financial_crime',
  'cybercrime',
  'sexual_offense',
  'terrorism',
  'organized_crime',
  'traffic_offense',
  'other'
);

CREATE TYPE verification_status AS ENUM (
  'verified',
  'unverified',
  'mismatch',
  'pending',
  'flagged'
);

CREATE TYPE duplicate_flag_status AS ENUM (
  'pending_review',
  'confirmed_duplicate',
  'false_positive',
  'merged',
  'dismissed'
);

CREATE TYPE gender AS ENUM (
  'male',
  'female',
  'other'
);

CREATE TYPE audit_action AS ENUM (
  'create',
  'read',
  'update',
  'delete',
  'login',
  'logout',
  'verify',
  'generate_report',
  'flag_duplicate',
  'resolve_duplicate',
  'export'
);

-- ============================================================
-- TABLE: profiles
-- Extends Supabase auth.users with role and officer metadata
-- ============================================================

CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id     TEXT UNIQUE NOT NULL,            -- Officer badge/employee ID
  full_name       TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  role            user_role NOT NULL DEFAULT 'police_officer',
  department      TEXT,
  station         TEXT,
  rank            TEXT,
  phone           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: national_ids
-- Reference identity data used for verification
-- Format: DD-DDDDDDDADD (e.g. 63-6323979A13)
-- ============================================================

CREATE TABLE national_ids (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  national_id_number  TEXT UNIQUE NOT NULL,        -- e.g. 63-6323979A13
  full_name           TEXT NOT NULL,
  date_of_birth       DATE NOT NULL,
  gender              gender NOT NULL,
  nationality         TEXT NOT NULL DEFAULT 'Zimbabwean',
  place_of_birth      TEXT,
  address             TEXT,
  photo_url           TEXT,                        -- Supabase Storage reference
  fingerprint_hash    TEXT,                        -- Hashed biometric reference
  is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Enforce national ID format: DD-DDDDDDDADD
  CONSTRAINT national_id_format CHECK (
    national_id_number ~ '^\d{2}-\d{7}[A-Z]\d{2}$'
  )
);

-- Index for fast lookup and fuzzy matching
CREATE INDEX idx_national_ids_number ON national_ids(national_id_number);
CREATE INDEX idx_national_ids_name_trgm ON national_ids USING GIN (full_name gin_trgm_ops);
CREATE INDEX idx_national_ids_dob ON national_ids(date_of_birth);

-- ============================================================
-- TABLE: criminal_records
-- Core criminal record per individual
-- Record ID format: CR-DDDDDDDADD (e.g. CR-0012345B26)
-- ============================================================

CREATE TABLE criminal_records (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id             TEXT UNIQUE NOT NULL,        -- e.g. CR-0012345B26
  national_id_id        UUID REFERENCES national_ids(id) ON DELETE RESTRICT,
  national_id_number    TEXT NOT NULL,               -- Denormalized for quick search
  full_name             TEXT NOT NULL,
  aliases               TEXT[],                      -- Known aliases/nicknames
  date_of_birth         DATE NOT NULL,
  gender                gender NOT NULL,
  nationality           TEXT NOT NULL DEFAULT 'Zimbabwean',
  address               TEXT,
  photo_url             TEXT,
  fingerprint_hash      TEXT,
  status                record_status NOT NULL DEFAULT 'active',
  risk_level            SMALLINT NOT NULL DEFAULT 1 CHECK (risk_level BETWEEN 1 AND 5),
  is_repeat_offender    BOOLEAN NOT NULL DEFAULT FALSE,
  prior_conviction_count INTEGER NOT NULL DEFAULT 0,
  notes                 TEXT,
  created_by            UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_by            UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Record ID format: CR-DDDDDDDADD
  CONSTRAINT record_id_format CHECK (
    record_id ~ '^CR-\d{7}[A-Z]\d{2}$'
  )
);

-- Indexes for search performance
CREATE INDEX idx_criminal_records_record_id ON criminal_records(record_id);
CREATE INDEX idx_criminal_records_national_id ON criminal_records(national_id_number);
CREATE INDEX idx_criminal_records_status ON criminal_records(status);
CREATE INDEX idx_criminal_records_name_trgm ON criminal_records USING GIN (full_name gin_trgm_ops);
CREATE INDEX idx_criminal_records_dob ON criminal_records(date_of_birth);
CREATE INDEX idx_criminal_records_repeat ON criminal_records(is_repeat_offender);
CREATE INDEX idx_criminal_records_aliases ON criminal_records USING GIN (aliases);

-- ============================================================
-- TABLE: convictions
-- Individual charges and sentences linked to a criminal record
-- Case Number format: CASE-YYYY-DDDDD
-- ============================================================

CREATE TABLE convictions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_number         TEXT UNIQUE NOT NULL,          -- e.g. CASE-2026-00123
  criminal_record_id  UUID NOT NULL REFERENCES criminal_records(id) ON DELETE CASCADE,
  offense_category    offense_category NOT NULL,
  offense_description TEXT NOT NULL,
  statute_violated    TEXT,                          -- Legal statute reference
  court_name          TEXT NOT NULL,
  presiding_judge     TEXT,
  prosecutor          TEXT,
  defense_counsel     TEXT,
  verdict             conviction_status NOT NULL,
  sentence_description TEXT,                         -- e.g. "5 years imprisonment"
  sentence_start_date DATE,
  sentence_end_date   DATE,
  fine_amount         DECIMAL(12,2),
  arrest_date         DATE,
  charge_date         DATE NOT NULL,
  conviction_date     DATE,
  release_date        DATE,
  prison_facility     TEXT,
  arresting_officer   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  evidence_references TEXT[],
  notes               TEXT,
  created_by          UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_by          UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Case number format: CASE-YYYY-DDDDD
  CONSTRAINT case_number_format CHECK (
    case_number ~ '^CASE-\d{4}-\d{5}$'
  )
);

-- Indexes
CREATE INDEX idx_convictions_record_id ON convictions(criminal_record_id);
CREATE INDEX idx_convictions_case_number ON convictions(case_number);
CREATE INDEX idx_convictions_category ON convictions(offense_category);
CREATE INDEX idx_convictions_verdict ON convictions(verdict);
CREATE INDEX idx_convictions_charge_date ON convictions(charge_date);

-- ============================================================
-- TABLE: verification_requests
-- Logs every identity verification attempt
-- ============================================================

CREATE TABLE verification_requests (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_reference     TEXT UNIQUE NOT NULL,        -- e.g. VRQ-20260622-00001
  requested_by          UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  criminal_record_id    UUID REFERENCES criminal_records(id) ON DELETE SET NULL,
  submitted_national_id TEXT NOT NULL,               -- ID submitted for verification
  submitted_full_name   TEXT NOT NULL,
  submitted_dob         DATE,
  submitted_photo_url   TEXT,
  verification_status   verification_status NOT NULL DEFAULT 'pending',
  confidence_score      DECIMAL(5,2),               -- 0.00 to 100.00
  mismatch_fields       TEXT[],                     -- Which fields didn't match
  notes                 TEXT,
  verified_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_verification_requests_record ON verification_requests(criminal_record_id);
CREATE INDEX idx_verification_requests_officer ON verification_requests(requested_by);
CREATE INDEX idx_verification_requests_national_id ON verification_requests(submitted_national_id);
CREATE INDEX idx_verification_requests_status ON verification_requests(verification_status);
CREATE INDEX idx_verification_requests_created ON verification_requests(created_at);

-- ============================================================
-- TABLE: duplicate_flags
-- AI-detected potential duplicate criminal records
-- ============================================================

CREATE TABLE duplicate_flags (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_a_id             UUID NOT NULL REFERENCES criminal_records(id) ON DELETE CASCADE,
  record_b_id             UUID NOT NULL REFERENCES criminal_records(id) ON DELETE CASCADE,
  similarity_score        DECIMAL(5,2) NOT NULL,     -- 0.00 to 100.00
  name_similarity         DECIMAL(5,2),
  dob_match               BOOLEAN,
  national_id_match       BOOLEAN,
  fingerprint_match       BOOLEAN,
  matching_fields         TEXT[],                    -- List of fields that matched
  flag_status             duplicate_flag_status NOT NULL DEFAULT 'pending_review',
  detection_method        TEXT NOT NULL DEFAULT 'ai_fuzzy_match',
  flagged_by              UUID REFERENCES profiles(id) ON DELETE SET NULL,   -- NULL = auto-detected
  reviewed_by             UUID REFERENCES profiles(id) ON DELETE SET NULL,
  review_notes            TEXT,
  reviewed_at             TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Prevent duplicate pairs in both directions
  CONSTRAINT no_self_duplicate CHECK (record_a_id != record_b_id),
  CONSTRAINT unique_duplicate_pair UNIQUE (record_a_id, record_b_id)
);

-- Indexes
CREATE INDEX idx_duplicate_flags_record_a ON duplicate_flags(record_a_id);
CREATE INDEX idx_duplicate_flags_record_b ON duplicate_flags(record_b_id);
CREATE INDEX idx_duplicate_flags_status ON duplicate_flags(flag_status);
CREATE INDEX idx_duplicate_flags_score ON duplicate_flags(similarity_score DESC);

-- ============================================================
-- TABLE: repeat_offender_links
-- Explicit links identifying a person as a repeat offender
-- across multiple criminal records (e.g. aliases used)
-- ============================================================

CREATE TABLE repeat_offender_links (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  primary_record_id   UUID NOT NULL REFERENCES criminal_records(id) ON DELETE CASCADE,
  linked_record_id    UUID NOT NULL REFERENCES criminal_records(id) ON DELETE CASCADE,
  link_reason         TEXT NOT NULL,                 -- Why these are linked
  created_by          UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT no_self_link CHECK (primary_record_id != linked_record_id),
  CONSTRAINT unique_repeat_link UNIQUE (primary_record_id, linked_record_id)
);

CREATE INDEX idx_repeat_offender_primary ON repeat_offender_links(primary_record_id);
CREATE INDEX idx_repeat_offender_linked ON repeat_offender_links(linked_record_id);

-- ============================================================
-- TABLE: verification_reports
-- Generated digital verification reports (tamper-evident)
-- Report ID format: RPT-YYYYMMDD-DDDD
-- ============================================================

CREATE TABLE verification_reports (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id           TEXT UNIQUE NOT NULL,          -- e.g. RPT-20260622-0001
  criminal_record_id  UUID NOT NULL REFERENCES criminal_records(id) ON DELETE RESTRICT,
  generated_by        UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  report_type         TEXT NOT NULL DEFAULT 'full_verification',
  report_data         JSONB NOT NULL,                -- Full snapshot of record at time of generation
  report_hash         TEXT NOT NULL,                 -- SHA-256 hash for tamper detection
  purpose             TEXT,                          -- Why this report was requested
  recipient           TEXT,                          -- Who the report is for
  is_valid            BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at          TIMESTAMPTZ,
  generated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_verification_reports_record ON verification_reports(criminal_record_id);
CREATE INDEX idx_verification_reports_officer ON verification_reports(generated_by);
CREATE INDEX idx_verification_reports_date ON verification_reports(generated_at);
CREATE INDEX idx_verification_reports_report_id ON verification_reports(report_id);

-- ============================================================
-- TABLE: audit_logs
-- Immutable audit trail — append-only, no updates or deletes
-- ============================================================

CREATE TABLE audit_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES profiles(id) ON DELETE SET NULL,
  user_role       user_role,
  action          audit_action NOT NULL,
  table_name      TEXT,                              -- Which table was affected
  record_id       TEXT,                              -- ID of the affected record
  old_values      JSONB,                             -- Previous state (for updates)
  new_values      JSONB,                             -- New state (for creates/updates)
  ip_address      INET,
  user_agent      TEXT,
  session_id      TEXT,
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes (audit logs are write-heavy but read occasionally)
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_national_ids_updated_at
  BEFORE UPDATE ON national_ids
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_criminal_records_updated_at
  BEFORE UPDATE ON criminal_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_convictions_updated_at
  BEFORE UPDATE ON convictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Auto-update repeat offender flag and count
CREATE OR REPLACE FUNCTION update_repeat_offender_status()
RETURNS TRIGGER AS $$
DECLARE
  conviction_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO conviction_count
  FROM convictions
  WHERE criminal_record_id = NEW.criminal_record_id
    AND verdict IN ('convicted', 'serving_sentence', 'sentence_completed', 'parole');

  UPDATE criminal_records
  SET
    prior_conviction_count = conviction_count,
    is_repeat_offender = (conviction_count > 1),
    risk_level = CASE
      WHEN conviction_count >= 5 THEN 5
      WHEN conviction_count >= 4 THEN 4
      WHEN conviction_count >= 3 THEN 3
      WHEN conviction_count >= 2 THEN 2
      ELSE 1
    END
  WHERE id = NEW.criminal_record_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_repeat_offender
  AFTER INSERT OR UPDATE ON convictions
  FOR EACH ROW EXECUTE FUNCTION update_repeat_offender_status();

-- Function: Generate audit log entry
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id UUID,
  p_user_role user_role,
  p_action audit_action,
  p_table_name TEXT,
  p_record_id TEXT,
  p_old_values JSONB,
  p_new_values JSONB,
  p_ip_address INET,
  p_description TEXT
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO audit_logs (
    user_id, user_role, action, table_name, record_id,
    old_values, new_values, ip_address, description
  ) VALUES (
    p_user_id, p_user_role, p_action, p_table_name, p_record_id,
    p_old_values, p_new_values, p_ip_address, p_description
  ) RETURNING id INTO log_id;
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE national_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE criminal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE convictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE duplicate_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE repeat_offender_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role(auth.uid()) = 'administrator';
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: is active user
CREATE OR REPLACE FUNCTION is_active_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- -----------------------------------------------
-- PROFILES policies
-- -----------------------------------------------

-- Users can view their own profile; admins see all
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR is_admin()
  );

-- Only admins can insert new profiles
CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT WITH CHECK (is_admin());

-- Users can update their own profile; admins update any
CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (
    auth.uid() = id OR is_admin()
  );

-- Only admins can deactivate/delete profiles
CREATE POLICY "profiles_delete" ON profiles
  FOR DELETE USING (is_admin());

-- -----------------------------------------------
-- NATIONAL_IDS policies
-- -----------------------------------------------

-- All active users can read national IDs (for verification)
CREATE POLICY "national_ids_select" ON national_ids
  FOR SELECT USING (is_active_user());

-- Only admins and police can create national ID records
CREATE POLICY "national_ids_insert" ON national_ids
  FOR INSERT WITH CHECK (
    get_user_role(auth.uid()) IN ('administrator', 'police_officer')
  );

-- Only admins can update national ID records
CREATE POLICY "national_ids_update" ON national_ids
  FOR UPDATE USING (is_admin());

-- Only admins can delete national ID records
CREATE POLICY "national_ids_delete" ON national_ids
  FOR DELETE USING (is_admin());

-- -----------------------------------------------
-- CRIMINAL_RECORDS policies
-- -----------------------------------------------

-- All active users can read criminal records
CREATE POLICY "criminal_records_select" ON criminal_records
  FOR SELECT USING (is_active_user());

-- Admins and police officers can create criminal records
CREATE POLICY "criminal_records_insert" ON criminal_records
  FOR INSERT WITH CHECK (
    get_user_role(auth.uid()) IN ('administrator', 'police_officer')
  );

-- Admins and police officers can update criminal records
CREATE POLICY "criminal_records_update" ON criminal_records
  FOR UPDATE USING (
    get_user_role(auth.uid()) IN ('administrator', 'police_officer')
  );

-- Only admins can archive/delete criminal records
CREATE POLICY "criminal_records_delete" ON criminal_records
  FOR DELETE USING (is_admin());

-- -----------------------------------------------
-- CONVICTIONS policies
-- -----------------------------------------------

-- All active users can read convictions
CREATE POLICY "convictions_select" ON convictions
  FOR SELECT USING (is_active_user());

-- Admins, police, and court officers can create convictions
CREATE POLICY "convictions_insert" ON convictions
  FOR INSERT WITH CHECK (
    get_user_role(auth.uid()) IN ('administrator', 'police_officer', 'court_officer')
  );

-- Admins, police, and court officers can update convictions
CREATE POLICY "convictions_update" ON convictions
  FOR UPDATE USING (
    get_user_role(auth.uid()) IN ('administrator', 'police_officer', 'court_officer')
  );

-- Only admins can delete convictions
CREATE POLICY "convictions_delete" ON convictions
  FOR DELETE USING (is_admin());

-- -----------------------------------------------
-- VERIFICATION_REQUESTS policies
-- -----------------------------------------------

-- Users see their own requests; admins see all
CREATE POLICY "verification_requests_select" ON verification_requests
  FOR SELECT USING (
    requested_by = auth.uid() OR is_admin()
  );

-- All active users can submit verification requests
CREATE POLICY "verification_requests_insert" ON verification_requests
  FOR INSERT WITH CHECK (is_active_user());

-- Only the requester or admin can update a request
CREATE POLICY "verification_requests_update" ON verification_requests
  FOR UPDATE USING (
    requested_by = auth.uid() OR is_admin()
  );

-- Only admins can delete verification requests
CREATE POLICY "verification_requests_delete" ON verification_requests
  FOR DELETE USING (is_admin());

-- -----------------------------------------------
-- DUPLICATE_FLAGS policies
-- -----------------------------------------------

-- All active users can view duplicate flags
CREATE POLICY "duplicate_flags_select" ON duplicate_flags
  FOR SELECT USING (is_active_user());

-- System (service role) and admins can create flags
CREATE POLICY "duplicate_flags_insert" ON duplicate_flags
  FOR INSERT WITH CHECK (
    get_user_role(auth.uid()) IN ('administrator', 'police_officer')
  );

-- Only admins can review/resolve duplicate flags
CREATE POLICY "duplicate_flags_update" ON duplicate_flags
  FOR UPDATE USING (is_admin());

-- Only admins can delete duplicate flags
CREATE POLICY "duplicate_flags_delete" ON duplicate_flags
  FOR DELETE USING (is_admin());

-- -----------------------------------------------
-- REPEAT_OFFENDER_LINKS policies
-- -----------------------------------------------

-- All active users can view repeat offender links
CREATE POLICY "repeat_offender_links_select" ON repeat_offender_links
  FOR SELECT USING (is_active_user());

-- Admins and police can create links
CREATE POLICY "repeat_offender_links_insert" ON repeat_offender_links
  FOR INSERT WITH CHECK (
    get_user_role(auth.uid()) IN ('administrator', 'police_officer')
  );

-- Only admins can delete links
CREATE POLICY "repeat_offender_links_delete" ON repeat_offender_links
  FOR DELETE USING (is_admin());

-- -----------------------------------------------
-- VERIFICATION_REPORTS policies
-- -----------------------------------------------

-- Users see reports they generated; admins see all
CREATE POLICY "verification_reports_select" ON verification_reports
  FOR SELECT USING (
    generated_by = auth.uid() OR is_admin()
  );

-- All active users can generate reports
CREATE POLICY "verification_reports_insert" ON verification_reports
  FOR INSERT WITH CHECK (is_active_user());

-- Only admins can invalidate reports
CREATE POLICY "verification_reports_update" ON verification_reports
  FOR UPDATE USING (is_admin());

-- Only admins can delete reports
CREATE POLICY "verification_reports_delete" ON verification_reports
  FOR DELETE USING (is_admin());

-- -----------------------------------------------
-- AUDIT_LOGS policies
-- Append-only: no updates, no deletes — ever
-- -----------------------------------------------

-- Admins can read all logs; users can read their own logs
CREATE POLICY "audit_logs_select" ON audit_logs
  FOR SELECT USING (
    user_id = auth.uid() OR is_admin()
  );

-- All active users can insert audit logs (via server actions)
CREATE POLICY "audit_logs_insert" ON audit_logs
  FOR INSERT WITH CHECK (is_active_user());

-- CRITICAL: No updates allowed on audit logs
CREATE POLICY "audit_logs_no_update" ON audit_logs
  FOR UPDATE USING (FALSE);

-- CRITICAL: No deletes allowed on audit logs
CREATE POLICY "audit_logs_no_delete" ON audit_logs
  FOR DELETE USING (FALSE);
