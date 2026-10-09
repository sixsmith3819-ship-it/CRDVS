# Audit Trail Implementation

## Overview

The Audit Trail tab provides a comprehensive, immutable record of all system actions performed on a criminal record. This feature is critical for court-grade record management, compliance, and accountability.

## Features

### Core Features Implemented

1. **Immutable Audit Trail**
   - Read-only display (no modifications allowed)
   - Append-only database table with RLS policies preventing updates/deletes
   - Complete accountability for all system actions

2. **Chronological Timeline**
   - Visual timeline display with dots and connecting lines
   - Newest entries first (reverse chronological order)
   - Microsecond-precision timestamps

3. **User/Admin Information**
   - User ID and role for each action
   - IP address tracking
   - User agent information (browser/OS)
   - Session ID for tracking

4. **Action Type Indicators**
   - Color-coded badges: Create, Update, Delete, Read, Verify, Generate Report, Flag Duplicate, Resolve Duplicate, Export, Login, Logout
   - Action-specific styling with Aurora accent colors
   - Sensitive action highlighting (red border/background)

5. **Before/After Values**
   - Expandable detail sections showing old and new values
   - Field-level change highlighting
   - JSON display of full state snapshots
   - Visual arrow (→) between old and new values

6. **Status Badges**
   - Action type badge with semantic colors
   - Sensitive action indicator with lock icon
   - User information badge
   - Timestamp badge with clock icon

7. **Filtering & Search**
   - Filter by action type (dropdown)
   - Filter by user ID (text search)
   - Filter by date range (from/to pickers)
   - Clear all filters button
   - Filters persist across pagination

8. **Export Functionality**
   - Export to CSV format (Excel-compatible)
   - Export to PDF format (text-based for now)
   - Filename includes record ID and export date
   - Respects current filters when exporting

9. **Pagination**
   - 10 items per page (configurable)
   - Previous/Next buttons
   - Page number buttons
   - Shows current range and total count
   - Resets to page 1 when filters change

10. **Accessibility Compliance**
    - Semantic HTML structure
    - Proper ARIA labels and roles
    - Keyboard navigation support (Tab, Arrow keys, Enter, Escape)
    - Focus rings on interactive elements (3px Aurora_Teal)
    - Screen reader friendly descriptions
    - Color contrast meets WCAG AA standards (4.5:1)
    - No animation on prefers-reduced-motion

11. **Visual Design**
    - Glassmorphism styling with semi-transparent backgrounds
    - Aurora gradient accents (Teal/Blue/Purple)
    - Dark spatial theme (Primary_Black background)
    - Smooth transitions and animations (200ms)
    - Responsive design (mobile/tablet/desktop)

## Component Structure

### Main Component: AuditTrailTab

**File:** `src/components/record/AuditTrailTab.tsx`

**Props:**
```typescript
interface AuditTrailTabProps {
  record: CriminalRecord;      // Criminal record context
  recordId: string;             // Record ID for fetching audit logs
  className?: string;           // Additional CSS classes
}
```

**Key Features:**
- Fetches audit logs via `useAuditLogs` hook
- Manages filter state and pagination
- Renders timeline with expandable rows
- Handles export to CSV/PDF
- Shows loading/error states

### Supporting Component: ChangeDetails

**File:** `src/components/audit/ChangeDetails.tsx`

**Props:**
```typescript
interface ChangeDetailsProps {
  oldValues?: Record<string, any>;    // Values before change
  newValues?: Record<string, any>;    // Values after change
  className?: string;                  // Additional CSS classes
}
```

**Features:**
- Extracts changed fields automatically
- Shows before/after comparison
- Displays full JSON with details toggle
- Field-level highlighting of differences

### Hook: useAuditLogs

**File:** `src/lib/hooks/useAuditLogs.ts`

**Interface:**
```typescript
function useAuditLogs(options?: UseAuditLogsOptions): UseAuditLogsResult

interface UseAuditLogsOptions {
  recordId?: string;        // Required: record to fetch logs for
  action?: string;          // Optional: filter by action type
  userId?: string;          // Optional: filter by user ID
  startDate?: string;       // Optional: filter by start date
  endDate?: string;         // Optional: filter by end date
  limit?: number;           // Optional: max results (default: 1000)
  offset?: number;          // Optional: pagination offset
}

interface UseAuditLogsResult {
  logs: AuditLog[];         // Fetched audit logs
  isLoading: boolean;       // Fetch in progress
  error: string | null;     // Error message if fetch failed
  total: number;            // Total count
  refetch: () => Promise<void>; // Manually refetch logs
}
```

## API Endpoints

### GET `/api/audit/record/[recordId]`

**Purpose:** Fetch audit logs for a specific criminal record

**Query Parameters:**
- `action` (optional): Filter by action type
- `user_id` (optional): Filter by user ID
- `start_date` (optional): Filter by start date (ISO format)
- `end_date` (optional): Filter by end date (ISO format)
- `limit` (optional, default: 1000, max: 1000): Max results per request
- `offset` (optional, default: 0): Pagination offset

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "user_role": "administrator",
      "action": "update",
      "table_name": "criminal_records",
      "record_id": "CR-0012345B26",
      "old_values": { "risk_level": 3 },
      "new_values": { "risk_level": 4 },
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "session_id": "uuid",
      "description": "Risk level updated",
      "created_at": "2024-01-15T10:30:45.123456Z"
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

**Error Response:**
```json
{
  "error": "Failed to fetch audit logs",
  "details": "Error message from database"
}
```

## Database Schema

### audit_logs Table

The `audit_logs` table stores all system actions in an immutable format:

```sql
CREATE TABLE audit_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES profiles(id) ON DELETE SET NULL,
  user_role       user_role,
  action          audit_action NOT NULL,
  table_name      TEXT,
  record_id       TEXT,
  old_values      JSONB,
  new_values      JSONB,
  ip_address      INET,
  user_agent      TEXT,
  session_id      TEXT,
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Audit Policies (RLS)

- **Select:** Admins see all logs; users see their own logs
- **Insert:** Only active users can insert (via server actions)
- **Update:** **NEVER** - Enforced by RLS policy
- **Delete:** **NEVER** - Enforced by RLS policy

### Indexes

- `idx_audit_logs_user` - Fast lookup by user_id
- `idx_audit_logs_action` - Fast lookup by action type
- `idx_audit_logs_table` - Fast lookup by table name
- `idx_audit_logs_record` - Fast lookup by record_id
- `idx_audit_logs_created` - Fast lookup by created_at (DESC)

## Action Types

### Standard Audit Actions

```typescript
type AuditAction = 
  | 'create'               // Record created
  | 'read'                 // Record accessed/viewed
  | 'update'               // Record fields modified
  | 'delete'               // Record deleted
  | 'login'                // User logged in
  | 'logout'               // User logged out
  | 'verify'               // Record verified
  | 'generate_report'      // Report generated
  | 'flag_duplicate'       // Duplicate flag created
  | 'resolve_duplicate'    // Duplicate resolved
  | 'export'               // Data exported
```

### Color Coding

| Action | Color | Background | Icon |
|--------|-------|-----------|------|
| create | Green (Aurora) | Green tint | ✓ |
| read | Slate | Gray tint | ◉ |
| update | Teal (Aurora) | Teal tint | ◈ |
| delete | Red | Red tint | ✕ |
| verify | Purple (Aurora) | Purple tint | ✓✓ |
| generate_report | Indigo | Indigo tint | 📄 |
| flag_duplicate | Amber | Amber tint | ⚠ |
| resolve_duplicate | Green | Green tint | ✓ |
| export | Blue | Blue tint | ↓ |
| login | Green | Green tint | → |
| logout | Slate | Gray tint | ← |

## Security Considerations

1. **Immutability:** Audit logs cannot be modified or deleted (enforced at database level)
2. **Row-Level Security:** Users can only view their own logs unless admin
3. **Sensitive Actions:** Highlighted in red for audit attention
4. **IP Tracking:** All actions logged with IP address for forensics
5. **User Identification:** User role captured at time of action (for accountability)
6. **Session Tracking:** Session ID allows grouping related actions

## Performance Optimization

1. **Pagination:** Limited to 10 items per page by default
2. **Database Indexes:** Optimized for common query patterns
3. **Caching:** API responses cached for 1 minute
4. **Lazy Loading:** Only fetches data for visible pages
5. **Filtering:** Applied server-side before returning to client

## Accessibility Features

1. **Semantic HTML:** Proper heading hierarchy, landmarks
2. **ARIA Labels:** Buttons and icons have descriptive labels
3. **Keyboard Navigation:** Full keyboard support
4. **Focus Management:** Clear focus rings (Aurora_Teal, 3px)
5. **Motion Sensitivity:** Respects prefers-reduced-motion
6. **Color Contrast:** All text meets WCAG AA standards (4.5:1)
7. **Screen Reader:** Proper roles and descriptions for screen readers

## Usage Example

### In Record Detail Page

```typescript
import { AuditTrailTab } from '@/components/record/AuditTrailTab';

// In your tabs array:
{
  id: 'audit_trail',
  label: 'Audit Trail',
  badge: 45,  // Number of audit entries
  content: <AuditTrailTab record={record} recordId={record.id} />,
}
```

### Using the Hook Directly

```typescript
import { useAuditLogs } from '@/lib/hooks/useAuditLogs';

function MyComponent({ recordId }: { recordId: string }) {
  const { logs, isLoading, error, refetch } = useAuditLogs({
    recordId,
    action: 'update',
    startDate: '2024-01-01',
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {logs.map(log => (
        <div key={log.id}>{log.description}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## Testing

### Unit Tests

Test scenarios for AuditTrailTab:
- [ ] Fetches and displays audit logs correctly
- [ ] Filtering by action type works
- [ ] Filtering by date range works
- [ ] Filtering by user works
- [ ] Pagination works correctly
- [ ] Export to CSV produces valid file
- [ ] Export to PDF produces valid file
- [ ] Expandable rows show before/after values
- [ ] Sensitive actions are highlighted
- [ ] Loading state displays correctly
- [ ] Error state displays correctly
- [ ] Empty state displays correctly

### Accessibility Tests

- [ ] Keyboard navigation works (Tab, Arrow, Enter, Escape)
- [ ] Focus rings visible on all interactive elements
- [ ] Screen reader announces action types correctly
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] No animations if prefers-reduced-motion set
- [ ] All form inputs have proper labels

### Security Tests

- [ ] Audit logs cannot be modified via UI
- [ ] Audit logs cannot be deleted via UI
- [ ] RLS policies prevent unauthorized access
- [ ] IP addresses logged correctly
- [ ] User role captured correctly

## Future Enhancements

1. **Advanced Search:** Full-text search of description and changed values
2. **Export Formats:** Add PDF with proper formatting and charts
3. **Batch Export:** Export multiple records' audit trails
4. **Analytics:** Dashboard showing most common actions, users, etc.
5. **Real-time Updates:** WebSocket integration for live audit feed
6. **Digital Signatures:** Sign audit trail with PKI
7. **Tamper Detection:** Verify audit trail hasn't been modified
8. **Compliance Reports:** Generate GDPR/court compliance reports
9. **Webhook Integration:** Send audit events to external systems
10. **Custom Fields:** Allow users to add notes to audit entries

## Compliance

### Court Record Standards

- ✓ Immutable audit trail
- ✓ Tamper-evident (RLS policies, database constraints)
- ✓ Chronological order (created_at timestamp)
- ✓ User identification (user_id, user_role)
- ✓ Action type logging (action enum)
- ✓ Before/after values (old_values, new_values JSONB)
- ✓ Timestamp precision (microseconds via TIMESTAMPTZ)
- ✓ Retention (append-only, never deleted)

### GDPR Compliance

- ✓ User data collection logged
- ✓ Right to access: Users can view their own audit logs
- ✓ Right to be forgotten: Audit logs are immutable (data minimization)
- ✓ Purpose limitation: Logs only for audit trail
- ✓ Data integrity: RLS and database constraints

## Troubleshooting

### Audit Logs Not Displaying

1. Check that `recordId` is being passed correctly
2. Verify `/api/audit/record/[recordId]` endpoint is accessible
3. Check browser console for network errors
4. Verify user has permission to view audit logs (RLS policies)

### Slow Loading Times

1. Pagination is set to 10 items - reduce if still slow
2. Check database indexes are created (`idx_audit_logs_record`, etc.)
3. Consider archiving old audit logs (> 1 year)
4. Monitor database performance

### Export Not Working

1. Check browser's popup/download permissions
2. Verify file size doesn't exceed limits
3. Check browser console for JavaScript errors
4. Try different export format (CSV vs PDF)

## References

- Database Schema: `supabase/migrations/001_initial_schema.sql`
- Type Definitions: `src/types/database.ts`
- Design Tokens: `src/lib/design-tokens.ts`
- Layout Components: `src/components/layout/Layout.tsx`
