/**
 * Utilities for identifying and describing sensitive audit-log actions.
 *
 * "Sensitive" means the action is either irreversible (delete) or may expose
 * personally identifiable / confidential data to external parties (export),
 * or it touches fields that carry heightened privacy obligations.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

/** Action types that are considered sensitive and require extra scrutiny. */
export const SENSITIVE_ACTION_TYPES: string[] = ['delete', 'export'];

/**
 * Database field names whose modification should be flagged as sensitive.
 * Changes to these fields directly affect identity, legal status, or risk
 * classification and therefore warrant an audit review.
 */
export const SENSITIVE_FIELDS: string[] = [
  'national_id_number',
  'status',
  'risk_level',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns `true` when the audit entry should be treated as sensitive.
 *
 * An entry is sensitive when EITHER:
 *  - its `action` is in `SENSITIVE_ACTION_TYPES`, OR
 *  - it has been explicitly tagged `sensitive: true` by the system.
 */
export function isSensitiveEntry(
  entry: { action: string; sensitive?: boolean }
): boolean {
  return (
    entry.sensitive === true ||
    SENSITIVE_ACTION_TYPES.includes(entry.action.toLowerCase())
  );
}

/**
 * Returns a short, human-readable explanation of *why* a given action is
 * considered sensitive.  Falls back to a generic message for unknown actions.
 */
export function getSensitiveReason(action: string): string {
  switch (action.toLowerCase()) {
    case 'delete':
      return 'Deletes are irreversible and permanently remove records from the system.';
    case 'export':
      return 'Exports may share personal data with external parties.';
    default:
      return 'This action involves sensitive data or an irreversible operation.';
  }
}
