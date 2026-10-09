# Quick Start: Objective 2 Duplicate Detection

## 🚀 Get Started in 5 Minutes

Follow these steps to activate the new AI-based duplicate detection system.

---

## Step 1: Apply Database Migration (2 minutes)

### Option A: Supabase CLI
```bash
cd "C:\Users\terre\Desktop\CRIMINAL RECORD DIGITAL VERIFICATION SYSTEM\crdvs"
supabase db push
```

### Option B: Supabase Dashboard (Recommended)
1. Go to https://dvgldolepvymuffqmjpv.supabase.co
2. Click **SQL Editor** in sidebar
3. Click **New Query**
4. Open file: `supabase/migrations/004_duplicate_detection_functions.sql`
5. Copy all contents
6. Paste into SQL Editor
7. Click **Run** (or press Ctrl+Enter)
8. Wait for "Success" message

**Expected Output**:
```
Migration 004: Duplicate detection functions created successfully
Available functions:
  - calculate_name_similarity(name1, name2)
  - names_phonetically_similar(name1, name2)
  - find_potential_duplicates(record_id, threshold)
  - get_duplicate_stats()
Views:
  - duplicate_flags_detailed
```

---

## Step 2: Test the System (3 minutes)

### Start Development Server
```bash
npm run dev
```

### Login and Navigate
1. Open http://localhost:3000
2. Login as administrator or police officer
3. Navigate to **Duplicate Flags** in sidebar
4. Or go directly to: http://localhost:3000/dashboard/duplicates

### Run First Detection
1. Click **"Run Duplicate Detection Scan"** button
2. Wait 5-10 seconds
3. See results:
   - ✅ Records scanned
   - ✅ Comparisons performed
   - ✅ Duplicates found

### Review a Duplicate (if found)
1. Scroll down to duplicate flags list
2. Click **"Review"** on any flag
3. Examine side-by-side comparison
4. Click **"Confirm Duplicate"** or **"False Positive"**
5. Add optional notes
6. Submit

---

## Step 3: Verify It Works

### Check the UI
- ✅ Statistics show counts (pending, confirmed, dismissed)
- ✅ Can filter by tabs
- ✅ Can see similarity scores
- ✅ Can review flags
- ✅ Actions are logged

### Test API (Optional)
```bash
# Manual detection
curl -X POST http://localhost:3000/api/duplicates/detect \
  -H "Content-Type: application/json" \
  -d '{"threshold": 75, "limit": 100}'

# List flags
curl http://localhost:3000/api/duplicates?status=pending_review
```

### Test SQL Functions (Optional)
```sql
-- In Supabase SQL Editor
SELECT * FROM get_duplicate_stats();
SELECT * FROM duplicate_flags_detailed LIMIT 5;
```

---

## Step 4: Schedule Automated Detection (Optional)

### For Vercel Deployment

Create `vercel.json` in project root:
```json
{
  "crons": [{
    "path": "/api/duplicates/detect",
    "schedule": "0 2 * * *"
  }]
}
```

Add to `.env.local`:
```env
CRON_SECRET=your-random-secret-here
```

Deploy:
```bash
vercel --prod
```

### For Local Testing
Run detection manually or set up a local cron job.

---

## Common Issues & Solutions

### Issue 1: "404 Not Found" on /dashboard/duplicates
**Solution**: Make sure all new files are saved and dev server is restarted.

### Issue 2: Database migration fails
**Solution**: 
- Check that migrations 001, 002, 003 were run first
- Verify you're connected to the correct Supabase project
- Try running in Supabase SQL Editor directly

### Issue 3: "Forbidden" error when running detection
**Solution**: 
- Make sure you're logged in as Administrator or Police Officer
- Check user role in profiles table

### Issue 4: No duplicates found
**Solution**: 
- This is normal if you have < 10 records
- Manually create test records with similar names
- Adjust threshold in API call (lower = more sensitive)

---

## Quick Commands Reference

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Apply database migrations
supabase db push
```

---

## Test Data (Optional)

### Create Test Duplicates

Run this in Supabase SQL Editor to create test duplicates:

```sql
-- Insert similar records for testing
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, 
  date_of_birth, gender, status
) VALUES
  ('CR-0000001A01', '63-1234567A12', 'John Doe', '1990-05-15', 'male', 'active'),
  ('CR-0000002B02', '63-1234567A12', 'Jon Doe', '1990-05-15', 'male', 'active'),
  ('CR-0000003C03', '63-9876543B21', 'Jane Smith', '1985-08-20', 'female', 'active'),
  ('CR-0000004D04', '63-9876543B21', 'Jane Smyth', '1985-08-20', 'female', 'active');

-- Now run detection and you should find 2 duplicate pairs
```

---

## Success Checklist

After completing these steps, you should have:

- [x] Database migration applied
- [x] `/dashboard/duplicates` page accessible
- [x] Detection button functional
- [x] Can see duplicate flags
- [x] Can review and update flags
- [x] Statistics displayed correctly
- [x] API endpoints working
- [x] SQL functions available

---

## Next Steps

1. **User Testing**: Have actual users test the duplicate detection
2. **Tune Threshold**: Adjust similarity threshold based on real data
3. **Schedule Automation**: Set up nightly scans
4. **Monitor Performance**: Check detection speed with real data volume
5. **Train Users**: Create user guide for reviewing duplicates

---

## Support

**Documentation**:
- Full implementation guide: `OBJECTIVE_2_IMPLEMENTATION.md`
- Technical details: `OBJECTIVE_2_VERIFICATION.md`
- Overview: `IMPLEMENTATION_COMPLETE.md`

**File Locations**:
- Database migration: `supabase/migrations/004_duplicate_detection_functions.sql`
- Main page: `src/app/dashboard/duplicates/page.tsx`
- Detection API: `src/app/api/duplicates/detect/route.ts`
- Algorithms: `src/lib/utils/similarity.ts`

---

**Setup Time**: ~5 minutes  
**Difficulty**: Easy  
**Status**: ✅ Ready to use
