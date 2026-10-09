// ============================================================
// CRDVS - Database Types
// Auto-synced with Supabase schema
// DO NOT edit manually — regenerate with: npx supabase gen types typescript
// ============================================================

export type UserRole = 'administrator' | 'police_officer' | 'court_officer' | 'prison_officer'
export type RecordStatus = 'active' | 'closed' | 'under_investigation' | 'acquitted' | 'deceased' | 'archived'
export type ConvictionStatus = 'convicted' | 'acquitted' | 'pending' | 'appealing' | 'serving_sentence' | 'sentence_completed' | 'parole'
export type OffenseCategory = 'violent_crime' | 'property_crime' | 'drug_offense' | 'financial_crime' | 'cybercrime' | 'sexual_offense' | 'terrorism' | 'organized_crime' | 'traffic_offense' | 'other'
export type VerificationStatus = 'verified' | 'unverified' | 'mismatch' | 'pending' | 'flagged'
export type DuplicateFlagStatus = 'pending_review' | 'confirmed_duplicate' | 'false_positive' | 'merged' | 'dismissed'
export type Gender = 'male' | 'female' | 'other'
export type AuditAction = 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'verify' | 'generate_report' | 'flag_duplicate' | 'resolve_duplicate' | 'export'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      national_ids: {
        Row: NationalId
        Insert: NationalIdInsert
        Update: NationalIdUpdate
      }
      criminal_records: {
        Row: CriminalRecord
        Insert: CriminalRecordInsert
        Update: CriminalRecordUpdate
      }
      convictions: {
        Row: Conviction
        Insert: ConvictionInsert
        Update: ConvictionUpdate
      }
      verification_requests: {
        Row: VerificationRequest
        Insert: VerificationRequestInsert
        Update: VerificationRequestUpdate
      }
      duplicate_flags: {
        Row: DuplicateFlag
        Insert: DuplicateFlagInsert
        Update: DuplicateFlagUpdate
      }
      repeat_offender_links: {
        Row: RepeatOffenderLink
        Insert: RepeatOffenderLinkInsert
        Update: Partial<RepeatOffenderLinkInsert>
      }
      verification_reports: {
        Row: VerificationReport
        Insert: VerificationReportInsert
        Update: VerificationReportUpdate
      }
      audit_logs: {
        Row: AuditLog
        Insert: AuditLogInsert
        Update: never // Audit logs are immutable
      }
    }
    Enums: {
      user_role: UserRole
      record_status: RecordStatus
      conviction_status: ConvictionStatus
      offense_category: OffenseCategory
      verification_status: VerificationStatus
      duplicate_flag_status: DuplicateFlagStatus
      gender: Gender
      audit_action: AuditAction
    }
  }
}

// ============================================================
// ROW TYPES
// ============================================================

export interface Profile {
  id: string
  employee_id: string
  full_name: string
  email: string
  role: UserRole
  department: string | null
  station: string | null
  rank: string | null
  phone: string | null
  is_active: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export interface NationalId {
  id: string
  national_id_number: string   // Format: DD-DDDDDDDADD e.g. 63-6323979A13
  full_name: string
  date_of_birth: string        // ISO date string
  gender: Gender
  nationality: string
  place_of_birth: string | null
  address: string | null
  photo_url: string | null
  fingerprint_hash: string | null
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface CriminalRecord {
  id: string
  record_id: string            // Format: CR-DDDDDDDADD e.g. CR-0012345B26
  national_id_id: string | null
  national_id_number: string
  full_name: string
  aliases: string[] | null
  date_of_birth: string
  gender: Gender
  nationality: string
  address: string | null
  photo_url: string | null
  fingerprint_hash: string | null
  status: RecordStatus
  risk_level: number           // 1-5
  is_repeat_offender: boolean
  prior_conviction_count: number
  notes: string | null
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface Conviction {
  id: string
  case_number: string          // Format: CASE-YYYY-DDDDD
  criminal_record_id: string
  offense_category: OffenseCategory
  offense_description: string
  statute_violated: string | null
  court_name: string
  presiding_judge: string | null
  prosecutor: string | null
  defense_counsel: string | null
  verdict: ConvictionStatus
  sentence_description: string | null
  sentence_start_date: string | null
  sentence_end_date: string | null
  fine_amount: number | null
  arrest_date: string | null
  charge_date: string
  conviction_date: string | null
  release_date: string | null
  prison_facility: string | null
  arresting_officer: string | null
  evidence_references: string[] | null
  notes: string | null
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface VerificationRequest {
  id: string
  request_reference: string   // e.g. VRQ-20260622-00001
  requested_by: string
  criminal_record_id: string | null
  submitted_national_id: string
  submitted_full_name: string
  submitted_dob: string | null
  submitted_photo_url: string | null
  verification_status: VerificationStatus
  confidence_score: number | null   // 0-100
  mismatch_fields: string[] | null
  notes: string | null
  verified_at: string | null
  created_at: string
}

export interface DuplicateFlag {
  id: string
  record_a_id: string
  record_b_id: string
  similarity_score: number    // 0-100
  name_similarity: number | null
  dob_match: boolean | null
  national_id_match: boolean | null
  fingerprint_match: boolean | null
  matching_fields: string[] | null
  flag_status: DuplicateFlagStatus
  detection_method: string
  flagged_by: string | null
  reviewed_by: string | null
  review_notes: string | null
  reviewed_at: string | null
  created_at: string
}

export interface RepeatOffenderLink {
  id: string
  primary_record_id: string
  linked_record_id: string
  link_reason: string
  created_by: string | null
  created_at: string
}

export interface VerificationReport {
  id: string
  report_id: string           // Format: RPT-YYYYMMDD-DDDD
  criminal_record_id: string
  generated_by: string
  report_type: string
  report_data: Record<string, unknown>  // JSONB snapshot
  report_hash: string         // SHA-256 tamper detection hash
  purpose: string | null
  recipient: string | null
  is_valid: boolean
  expires_at: string | null
  generated_at: string
}

export interface AuditLog {
  id: string
  user_id: string | null
  user_role: UserRole | null
  action: AuditAction
  table_name: string | null
  record_id: string | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  session_id: string | null
  description: string | null
  created_at: string
}

// ============================================================
// INSERT TYPES (omit auto-generated fields)
// ============================================================

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at' | 'last_login_at'>
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>

export type NationalIdInsert = Omit<NationalId, 'id' | 'created_at' | 'updated_at'>
export type NationalIdUpdate = Partial<Omit<NationalId, 'id' | 'created_at'>>

export type CriminalRecordInsert = Omit<CriminalRecord, 'id' | 'created_at' | 'updated_at' | 'is_repeat_offender' | 'prior_conviction_count'>
export type CriminalRecordUpdate = Partial<Omit<CriminalRecord, 'id' | 'created_at'>>

export type ConvictionInsert = Omit<Conviction, 'id' | 'created_at' | 'updated_at'>
export type ConvictionUpdate = Partial<Omit<Conviction, 'id' | 'created_at'>>

export type VerificationRequestInsert = Omit<VerificationRequest, 'id' | 'created_at'>
export type VerificationRequestUpdate = Partial<Omit<VerificationRequest, 'id' | 'created_at' | 'requested_by'>>

export type DuplicateFlagInsert = Omit<DuplicateFlag, 'id' | 'created_at'>
export type DuplicateFlagUpdate = Partial<Omit<DuplicateFlag, 'id' | 'created_at'>>

export type RepeatOffenderLinkInsert = Omit<RepeatOffenderLink, 'id' | 'created_at'>

export type VerificationReportInsert = Omit<VerificationReport, 'id' | 'generated_at'>
export type VerificationReportUpdate = Pick<VerificationReport, 'is_valid' | 'expires_at'>

export type AuditLogInsert = Omit<AuditLog, 'id' | 'created_at'>
