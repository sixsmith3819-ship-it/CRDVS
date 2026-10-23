# Fix: Repeat Offender Trigger Missing

## Problem
When adding a person with 2+ convictions, the system was not flagging them as a repeat offender. The `is_repeat_offender` field remained `FALSE` even with multiple convictions.

## Root Cause
The database trigger `trg_update_repeat_offender` was never deployed to Supabase. It was defined in the schema design but not actually created in the migrations.

## Solution
Created migration `016_add_repeat_offender_trigger.sql` that:

1. **Creates the function** `update_repeat_offender_status()` that:
   - Counts convictions with verdict: `'convicted'`, `'serving_sentence'`, `'sentence_completed'`, `'parole'`
   - Updates `is_repeat_offender = TRUE` if count > 1
   - Updates `prior_conviction_count` with the exact count
   - Updates `risk_level` based on conviction count (1-5)

2. **Creates two triggers**:
   - `trg_update_repeat_offender_insert` - runs after a conviction is inserted
   - `trg_update_repeat_offender_update` - runs after a conviction is updated

3. **Recalculates all existing records** using a DO block to fix any existing data

## How to Apply

### Option A: Using Supabase CLI
```bash
cd crdvs
supabase db push
```

### Option B: Manual in Supabase Dashboard
1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the entire contents of `supabase/migrations/016_add_repeat_offender_trigger.sql`
4. Paste into the SQL editor
5. Click "Run"

### Option C: Using Supabase Web Interface
1. Go to https://supabase.com → Your project
2. SQL Editor → New Query
3. Paste migration contents
4. Execute

## Verification

### Before Fix
```sql
SELECT id, full_name, prior_conviction_count, is_repeat_offender
FROM criminal_records
WHERE prior_conviction_count >= 2;
-- Returns: is_repeat_offender = FALSE (WRONG!)
```

### After Fix
```sql
SELECT id, full_name, prior_conviction_count, is_repeat_offender
FROM criminal_records
WHERE prior_conviction_count >= 2;
-- Returns: is_repeat_offender = TRUE (CORRECT!)
```

## Testing

After applying the migration:

1. **Add a new record with 1 conviction**:
   - Expected: `is_repeat_offender = FALSE` ✅

2. **Add the 2nd conviction to that record**:
   - Expected: `is_repeat_offender = TRUE` ✅ (should update automatically)

3. **Add the 3rd conviction**:
   - Expected: `is_repeat_offender = TRUE` ✅
   - Expected: `risk_level = 3` ✅ (increases with conviction count)

## What Changed

| Field | Before | After |
|-------|--------|-------|
| is_repeat_offender (2 convictions) | FALSE ❌ | TRUE ✅ |
| prior_conviction_count | 0 | 2 |
| risk_level (2 convictions) | 1 | 2 |
| Automatic updates on new conviction | ❌ No | ✅ Yes |

## Impact

- ✅ Fixes the repeat offender flag for all existing records
- ✅ Enables automatic repeat offender detection going forward
- ✅ Automatic risk level calculation based on convictions
- ✅ No manual intervention needed

## Note

The migration includes a fix that recalculates all existing records. So if you had 5 people with 2 convictions each, they will all now be correctly marked as `is_repeat_offender = TRUE`.

## Files Modified
- Created: `supabase/migrations/016_add_repeat_offender_trigger.sql`
- This document: `FIX_REPEAT_OFFENDER_TRIGGER.md`
