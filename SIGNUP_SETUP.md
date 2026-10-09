# Self-Service Signup Setup

## ✅ What Was Added

1. **Signup Page** (`/signup`)
   - Beautiful registration form
   - Validates all inputs
   - Immediate account creation (no approval needed)
   - Auto-login after successful signup

2. **Signup Button on Login Page**
   - "Create New Account" button added
   - Links to `/signup`
   - Clear visual separation with divider

3. **Server Action** (`signupAction`)
   - Creates auth user in Supabase
   - Triggers profile creation via auth trigger
   - Validates email, password, employee ID
   - Checks for duplicate employee IDs
   - Logs signup in audit trail

## 🔧 Required Configuration

### Disable Email Confirmation (For Instant Access)

By default, Supabase requires email confirmation. To allow **instant signup**:

1. Go to **Supabase Dashboard** → **Authentication** → **Providers**
2. Click on **"Email"**
3. Scroll to **"Email Confirmation"**
4. **Uncheck** "Confirm email"
5. Click **"Save"**

**Result:** Users can sign up and immediately access the system without email confirmation.

### Alternative: Keep Email Confirmation Enabled

If you want to keep email security:
- Users will need to confirm their email before logging in
- The signup flow will show: "Please check your email to confirm your account"
- After clicking the confirmation link, they can log in

## 🎯 How It Works

### User Flow:
1. User visits `/login`
2. Clicks "Create New Account"
3. Fills out registration form with:
   - Full Name
   - Employee ID (must be unique)
   - Email (must be unique)
   - Role (Police/Court/Prison Officer)
   - Optional: Rank, Department, Station, Phone
   - Password (min 8 characters)
   - Confirm Password
4. Submits form
5. **Instant account creation** (if email confirmation disabled)
6. Auto-redirected to `/dashboard`
7. Can immediately start using the system

### Security Features:
- ✅ Email validation
- ✅ Password strength validation (min 8 chars)
- ✅ Employee ID uniqueness check
- ✅ Password confirmation match
- ✅ All actions logged in audit trail
- ✅ Row Level Security (RLS) enforced
- ✅ Secure password hashing by Supabase

## 🧪 Test It

1. **Restart your dev server** (to pick up new routes):
   ```bash
   npm run dev
   ```

2. **Visit**: `http://localhost:3000/login`

3. **Click**: "Create New Account" button

4. **Fill in the form**:
   - Full Name: `Test Officer`
   - Employee ID: `EMP999`
   - Email: `test.officer@zrp.gov.zw`
   - Role: `Police Officer`
   - Password: `Test123456`
   - Confirm Password: `Test123456`

5. **Submit** and you should be immediately logged in!

## 📋 Default Roles Available

- **Police Officer** - Can create/update records, verify identities
- **Court Officer** - Can manage convictions, verify identities
- **Prison Officer** - Can view records, verify identities

**Note:** Administrator role is not available during self-signup for security reasons. Admins must be created manually or promoted by existing admins.

## 🔐 Security Considerations

### Pros of Instant Signup:
- ✅ Fast onboarding
- ✅ No delays for legitimate officers
- ✅ Self-service reduces admin workload

### Cons:
- ⚠️ Anyone with the URL can create an account
- ⚠️ No verification of officer credentials

### Recommendations:
1. **Add IP Whitelisting** - Only allow signups from police network
2. **Email Domain Validation** - Only allow `@zrp.gov.zw` emails
3. **Manual Verification** - Admin reviews new accounts within 24h
4. **Two-Factor Authentication** - Add 2FA for sensitive operations

### Quick Email Domain Restriction

Add this to the signup validation in `src/actions/auth.ts`:

```typescript
// Only allow official ZRP emails
if (!email.toLowerCase().endsWith('@zrp.gov.zw')) {
  return { success: false, error: 'Please use your official ZRP email address' }
}
```

## 🎉 Done!

Self-service signup is now fully functional! New officers can create accounts instantly and start using the system right away.
